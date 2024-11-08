'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ClientOnly from './ClientOnly'

const TerrainMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const geometry = useMemo(() => {
    const size = 50
    const segments = 30
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
    
    const positions = geometry.attributes.position.array as Float32Array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] = Math.random() * 2
    }
    
    return geometry
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.getElapsedTime() * 0.3
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      
      positions[i + 2] = Math.sin(x * 0.3 + time) * Math.cos(y * 0.2 + time) * 2
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true
    meshRef.current.rotation.z = time * 0.1
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} position={[0, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshPhysicalMaterial
        color="#1A0040"
        roughness={0.7}
        metalness={0.3}
        wireframe={true}
      />
    </mesh>
  )
}

const LowPolyBackground = () => {
  return (
    <ClientOnly>
      <div className="fixed inset-0 -z-10 opacity-80">
        <Canvas
          camera={{ 
            position: [0, -20, 20],
            fov: 45,
            near: 0.1,
            far: 1000
          }}
          style={{ 
            width: '100%',
            height: '100%',
            background: '#0a0010',
          }}
        >
          <color attach="background" args={['#0a0010']} />
          <TerrainMesh />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ff66dd" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#4422ff" />
          <fog attach="fog" args={['#0a0010', 20, 50]} />
        </Canvas>
      </div>
    </ClientOnly>
  )
}

export default LowPolyBackground
