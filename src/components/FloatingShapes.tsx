import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

const PALETTE = [
  '#FF6B6B', '#A855F7', '#6366F1', '#38BDF8',
  '#34D399', '#FBBF24', '#FB7185', '#C4B5FD',
]

interface BlobProps {
  position: [number, number, number]
  color: string
  scale: number
  speed: number
  distort: number
}

function Blob({ position, color, scale, speed, distort }: BlobProps) {
  const mesh = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.3
    mesh.current.rotation.y = Math.cos(state.clock.elapsedTime * speed * 0.2) * 0.4
  })

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={mesh} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={speed * 2}
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  )
}

function GlassRing({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const mesh = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * 0.3
    mesh.current.rotation.z = state.clock.elapsedTime * 0.2
  })

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh} position={position} scale={scale}>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.1}
          metalness={0.2}
          transmission={0.6}
          thickness={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  )
}

function Crystal({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const mesh = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.5
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.2
  })

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1}>
      <mesh ref={mesh} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.05}
          metalness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  )
}

export default function FloatingShapes({ count = 12, spread = 8, intensity = 1 }: {
  count?: number
  spread?: number
  intensity?: number
}) {
  const shapes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const type = i % 3
      const angle = (i / count) * Math.PI * 2
      const radius = 2 + Math.random() * spread
      return {
        id: i,
        type,
        position: [
          Math.cos(angle) * radius + (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * spread * 0.8,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 2 - 3,
        ] as [number, number, number],
        color: PALETTE[i % PALETTE.length],
        scale: (0.3 + Math.random() * 0.7) * intensity,
        speed: 0.5 + Math.random() * 2,
        distort: 0.2 + Math.random() * 0.5,
      }
    })
  }, [count, spread, intensity])

  return (
    <group>
      {shapes.map((s) => {
        if (s.type === 0) return <Blob key={s.id} {...s} />
        if (s.type === 1) return <GlassRing key={s.id} position={s.position} color={s.color} scale={s.scale} />
        return <Crystal key={s.id} position={s.position} color={s.color} scale={s.scale} />
      })}
    </group>
  )
}
