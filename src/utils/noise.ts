interface NoiseModule {
    seed: (seed: number) => void;
    simplex2: (xin: number, yin: number) => number;
    simplex3: (xin: number, yin: number, zin: number) => number;
    perlin2: (x: number, y: number) => number;
    perlin3: (x: number, y: number, z: number) => number;
}

class Grad {
    constructor(public x: number, public y: number, public z: number) {}

    dot2(x: number, y: number): number {
        return this.x * x + this.y * y;
    }

    dot3(x: number, y: number, z: number): number {
        return this.x * x + this.y * y + this.z * z;
    }
}

export class ImprovedNoise implements NoiseModule {
    private perm: number[] = new Array(512);
    private gradP: Grad[] = new Array(512);
    private readonly grad3: Grad[] = [
        new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
        new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
        new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)
    ];

    private readonly F2 = 0.5 * (Math.sqrt(3) - 1);
    private readonly G2 = (3 - Math.sqrt(3)) / 6;
    private readonly F3 = 1 / 3;
    private readonly G3 = 1 / 6;

    constructor(seed: number = 237664) {
        this.seed(seed);
    }

    private xorshift(value: number): number {
        let x = value;
        x ^= (x << 13);
        x ^= (x >> 17);
        x ^= (x << 5);
        return x;
    }

    private generatePermutation(seed: number): void {
        const initialPerm = Array.from({ length: 256 }, (_, i) => i);
        
        let state = seed;
        for (let i = 255; i > 0; i--) {
            state = this.xorshift(state);
            const j = Math.abs(state % (i + 1));
            [initialPerm[i], initialPerm[j]] = [initialPerm[j], initialPerm[i]];
        }

        for (let i = 0; i < 256; i++) {
            state = this.xorshift(state);
            const lcg = (1597 * initialPerm[i] + 51749) % 256;
            initialPerm[i] = Math.abs(lcg ^ (state & 255));
        }

        for (let i = 0; i < 256; i++) {
            this.perm[i] = this.perm[i + 256] = initialPerm[i];
            this.gradP[i] = this.gradP[i + 256] = this.grad3[initialPerm[i] % 12];
        }

        this.improveDistribution();
    }

    private improveDistribution(): void {
        const newPerm = [...this.perm];
        const newGradP = [...this.gradP];

        for (let i = 0; i < 255; i++) {
            const diff = Math.abs(newPerm[i] - newPerm[i + 1]);
            if (diff < 20) {
                newPerm[i + 1] = (newPerm[i + 1] + 128) % 256;
                newPerm[i + 1 + 256] = newPerm[i + 1];
                newGradP[i + 1] = newGradP[i + 1 + 256] = this.grad3[newPerm[i + 1] % 12];
            }
        }

        this.perm = newPerm;
        this.gradP = newGradP;
    }

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(a: number, b: number, t: number): number {
        return (1 - t) * a + t * b;
    }

    public seed(seed: number): void {
        if (seed > 0 && seed < 1) {
            seed *= 65536;
        }

        seed = Math.floor(seed);
        if (seed < 256) {
            seed |= seed << 8;
        }

        this.generatePermutation(seed);
    }

    public simplex2(xin: number, yin: number): number {
        let n0: number, n1: number, n2: number;
        const s = (xin + yin) * this.F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const t = (i + j) * this.G2;
        const x0 = xin - i + t;
        const y0 = yin - j + t;

        let i1: number, j1: number;
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } else {
            i1 = 0;
            j1 = 1;
        }

        const x1 = x0 - i1 + this.G2;
        const y1 = y0 - j1 + this.G2;
        const x2 = x0 - 1 + 2 * this.G2;
        const y2 = y0 - 1 + 2 * this.G2;

        const ii = i & 255;
        const jj = j & 255;

        const gi0 = this.gradP[ii + this.perm[jj]];
        const gi1 = this.gradP[ii + i1 + this.perm[jj + j1]];
        const gi2 = this.gradP[ii + 1 + this.perm[jj + 1]];

        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) {
            n0 = 0;
        } else {
            t0 *= t0;
            n0 = t0 * t0 * gi0.dot2(x0, y0);
        }

        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) {
            n1 = 0;
        } else {
            t1 *= t1;
            n1 = t1 * t1 * gi1.dot2(x1, y1);
        }

        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) {
            n2 = 0;
        } else {
            t2 *= t2;
            n2 = t2 * t2 * gi2.dot2(x2, y2);
        }

        return 70 * (n0 + n1 + n2);
    }

    public simplex3(xin: number, yin: number, zin: number): number {
        let n0: number, n1: number, n2: number, n3: number;

        const s = (xin + yin + zin) * this.F3;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const k = Math.floor(zin + s);
        const t = (i + j + k) * this.G3;
        const x0 = xin - i + t;
        const y0 = yin - j + t;
        const z0 = zin - k + t;

        let i1: number, j1: number, k1: number;
        let i2: number, j2: number, k2: number;

        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
            } else if (x0 >= z0) {
                i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
            } else {
                i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
            }
        } else {
            if (y0 < z0) {
                i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
            } else if (x0 < z0) {
                i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
            } else {
                i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
            }
        }

        const x1 = x0 - i1 + this.G3;
        const y1 = y0 - j1 + this.G3;
        const z1 = z0 - k1 + this.G3;
        const x2 = x0 - i2 + 2 * this.G3;
        const y2 = y0 - j2 + 2 * this.G3;
        const z2 = z0 - k2 + 2 * this.G3;
        const x3 = x0 - 1 + 3 * this.G3;
        const y3 = y0 - 1 + 3 * this.G3;
        const z3 = z0 - 1 + 3 * this.G3;

        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;

        const gi0 = this.gradP[ii + this.perm[jj + this.perm[kk]]];
        const gi1 = this.gradP[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]];
        const gi2 = this.gradP[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]];
        const gi3 = this.gradP[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]];

        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) {
            n0 = 0;
        } else {
            t0 *= t0;
            n0 = t0 * t0 * gi0.dot3(x0, y0, z0);
        }

        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) {
            n1 = 0;
        } else {
            t1 *= t1;
            n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
        }

        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) {
            n2 = 0;
        } else {
            t2 *= t2;
            n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
        }

        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) {
            n3 = 0;
        } else {
            t3 *= t3;
            n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
        }

        return 32 * (n0 + n1 + n2 + n3);
    }

    public perlin2(x: number, y: number): number {
        const X = Math.floor(x);
        const Y = Math.floor(y);
        x = x - X;
        y = y - Y;
        const Xi = X & 255;
        const Yi = Y & 255;

        const n00 = this.gradP[Xi + this.perm[Yi]].dot2(x, y);
        const n01 = this.gradP[Xi + this.perm[Yi + 1]].dot2(x, y - 1);
        const n10 = this.gradP[Xi + 1 + this.perm[Yi]].dot2(x - 1, y);
        const n11 = this.gradP[Xi + 1 + this.perm[Yi + 1]].dot2(x - 1, y - 1);

        const u = this.fade(x);
        return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
    }

    public perlin3(x: number, y: number, z: number): number {
        const X = Math.floor(x);
        const Y = Math.floor(y);
        const Z = Math.floor(z);
        x = x - X;
        y = y - Y;
        z = z - Z;
        const Xi = X & 255;
        const Yi = Y & 255;
        const Zi = Z & 255;

        const n000 = this.gradP[Xi + this.perm[Yi + this.perm[Zi]]].dot3(x, y, z);
        const n001 = this.gradP[Xi + this.perm[Yi + this.perm[Zi + 1]]].dot3(x, y, z - 1);
        const n010 = this.gradP[Xi + this.perm[Yi + 1 + this.perm[Zi]]].dot3(x, y - 1, z);
        const n011 = this.gradP[Xi + this.perm[Yi + 1 + this.perm[Zi + 1]]].dot3(x, y - 1, z - 1);
        const n100 = this.gradP[Xi + 1 + this.perm[Yi + this.perm[Zi]]].dot3(x - 1, y, z);
        const n101 = this.gradP[Xi + 1 + this.perm[Yi + this.perm[Zi + 1]]].dot3(x - 1, y, z - 1);
        const n110 = this.gradP[Xi + 1 + this.perm[Yi + 1 + this.perm[Zi]]].dot3(x - 1, y - 1, z);
        const n111 = this.gradP[Xi + 1 + this.perm[Yi + 1 + this.perm[Zi + 1]]].dot3(x - 1, y - 1, z - 1);

        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);

        return this.lerp(
          this.lerp(
            this.lerp(n000, n100, u),
            this.lerp(n001, n101, u),
            w
          ),
          this.lerp(
            this.lerp(n010, n110, u),
            this.lerp(n011, n111, u),
            w
          ),
          v
        );
    }
}