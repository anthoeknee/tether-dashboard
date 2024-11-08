'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, RootState } from '@react-three/fiber'
import { ImprovedNoise } from '@/utils/noise'
import Delaunator from 'delaunator'
import * as THREE from 'three'
import ClientOnly from './ClientOnly'


type Point2D = [number, number];

interface GeometryResult {
  points: Point2D[];
  geometry: THREE.BufferGeometry;
}

const LowPolyTerrain = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const noiseGen = useMemo(() => new ImprovedNoise(), [])
  
  const { points, geometry }: GeometryResult = useMemo(() => {
    const pts: Point2D[] = []
    const width = 100000
    const height = 100000
    const numPoints = 3000
    
    for (let i = 0; i < numPoints; i++) {
      let x, y, isValid
      do {
        isValid = true
        x = (Math.random() * width) - width / 2
        y = (Math.random() * height) - height / 2
        
        const minDist = 300
        for (const pt of pts) {
          const dx = pt[0] - x
          const dy = pt[1] - y
          if (dx * dx + dy * dy < minDist * minDist) {
            isValid = false
            break
          }
        }
      } while (!isValid)
      pts.push([x, y])
    }

    const delaunay = new Delaunator<number>(pts.flat())
    const positions = new Float32Array(delaunay.triangles.length * 3)
    const colors = new Float32Array(delaunay.triangles.length * 3)
    const normals = new Float32Array(delaunay.triangles.length * 3)
    
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
    
    return { points: pts, geometry: geo }
  }, [])

  const colorA = new THREE.Color('#030712')  // Very dark blue/gray
  const colorB = new THREE.Color('#0ea5e9')  // Matches primary-500 from tailwind config

  // Add these new refs for camera movement
  const timeRef = useRef(0)

  useFrame((state: RootState) => {
    if (!meshRef.current?.geometry) return
    
    timeRef.current += 0.001
    const time = timeRef.current

    if (state.camera) {
      const radius = 20000
      const speed = 0.015
      state.camera.position.x = Math.sin(time * speed) * radius * 0.3
      state.camera.position.y = 18000 + Math.cos(time * speed * 1.2) * radius * 0.2
      state.camera.position.z = Math.cos(time * speed * 0.8) * radius * 0.3
      state.camera.lookAt(Math.sin(time * speed * 0.5) * 2000, 5000, Math.cos(time * speed * 0.5) * 2000)
    }

    const positions = meshRef.current.geometry.getAttribute('position').array as Float32Array
    const colors = meshRef.current.geometry.getAttribute('color').array as Float32Array
    const normals = meshRef.current.geometry.getAttribute('normal').array as Float32Array
    
    const delaunay = new Delaunator<number>(points.flat())

    for (let i = 0; i < delaunay.triangles.length; i += 3) {
      const vertices: THREE.Vector3[] = []
      const triangleCenter = new THREE.Vector3()
      
      for (let j = 0; j < 3; j++) {
        const idx = delaunay.triangles[i + j]
        const point = points[idx]
        
        if (!point) continue
        
        const noiseValue = noiseGen.perlin2(
          point[0] * 0.0001 + time * 0.1, 
          point[1] * 0.0001 + time * 0.1
        ) * 0.7 // Reduced amplitude

        const secondaryNoise = noiseGen.perlin2(
          point[0] * 0.0002 - time * 0.05,
          point[1] * 0.0002 + time * 0.05
        ) * 0.3

        const z = (noiseValue + secondaryNoise) * 15 // Adjusted scale
        
        const vertexIndex = (i + j) * 3
        positions[vertexIndex] = point[0]
        positions[vertexIndex + 1] = point[1]
        positions[vertexIndex + 2] = z
        
        vertices.push(new THREE.Vector3(point[0], point[1], z))
        triangleCenter.add(vertices[j])
      }
      
      triangleCenter.divideScalar(3)
      const heightFactor = (triangleCenter.z + 500) / 1000

      const baseNoise = noiseGen.perlin2(
        triangleCenter.x * 0.0001 + time * 0.05,
        triangleCenter.y * 0.0001 + time * 0.05
      )
      
      const detailNoise = noiseGen.perlin2(
        triangleCenter.x * 0.001 + time * 0.08,
        triangleCenter.y * 0.001 - time * 0.08
      )
      const gradientFactor = (
        (triangleCenter.y + 10000) / 20000 + 
        baseNoise * 0.3 + 
        detailNoise * 0.15
      )
      
      const clampedGradient = Math.max(0, Math.min(1, gradientFactor))
      
      const color = new THREE.Color()
      color.copy(colorA).lerp(colorB, clampedGradient)
      
      const brightnessNoise = noiseGen.perlin2(triangleCenter.x * 0.0005 + time * 0.05, triangleCenter.y * 0.0005)
      color.multiplyScalar(0.3 + heightFactor * 0.4 + brightnessNoise * 0.15)
      
      for (let j = 0; j < 3; j++) {
        const colorIndex = (i + j) * 3
        colors[colorIndex] = color.r
        colors[colorIndex + 1] = color.g
        colors[colorIndex + 2] = color.b
      }
      
      const normal = new THREE.Vector3()
        .crossVectors(
          new THREE.Vector3().subVectors(vertices[1], vertices[0]),
          new THREE.Vector3().subVectors(vertices[2], vertices[0])
        )
        .normalize()
      
      for (let j = 0; j < 3; j++) {
        const normalIndex = (i + j) * 3
        normals[normalIndex] = normal.x
        normals[normalIndex + 1] = normal.y
        normals[normalIndex + 2] = normal.z
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
    meshRef.current.geometry.attributes.color.needsUpdate = true
    meshRef.current.geometry.attributes.normal.needsUpdate = true
  })

  return (
    <mesh 
      ref={meshRef} 
      rotation={[1.5, 0, 0]}
      position={[0, 0, 0]}
      scale={2}
    >
      <primitive object={geometry} attach="geometry" />
      <meshPhysicalMaterial
        vertexColors
        roughness={0.8}
        metalness={0.1}
        envMapIntensity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

interface SceneProps {
  className?: string;
}

const Scene = ({ className }: SceneProps) => {
  return (
    <Canvas
      camera={{ 
        position: [0, 15000, 15000],
        fov: 90,
        near: 1,
        far: 100000
      }}
      className={className}
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#030712',
        filter: 'blur(0px)',
      }}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
    >
      <color attach="background" args={['#030712']} />
      <LowPolyTerrain />
      <ambientLight intensity={0.5} />
      <pointLight position={[100, 100, 100]} intensity={2} color="#ff66dd" />
      <pointLight position={[-100, -100, -100]} intensity={2} color="#4422ff" />
      <hemisphereLight 
        intensity={0.5}
        color="#ffffff"
        groundColor="#000000"
      />
      <fog attach="fog" args={['#030712', 8000, 40000]} />
    </Canvas>
  )
}

const TerrainBackground = () => {
  return (
    <ClientOnly>
      <div className="fixed inset-0 w-full h-full" style={{ zIndex: -1 }}>
        <Scene className="w-full h-full" />
      </div>
    </ClientOnly>
  )
}

export default TerrainBackground