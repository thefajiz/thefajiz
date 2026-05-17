import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useRef, Suspense, useEffect } from 'react'
import * as THREE from 'three'

function Charizard() {
  const { scene, animations } = useGLTF('/charizard/charizard.glb')
  const ref = useRef<THREE.Group>(null)
  const { actions } = useAnimations(animations, ref)
  const t = useRef(0)

  // Mutate existing materials in-place (no replacement = no loading race condition)
  // Set roughness=1 metalness=0 so white lights show true texture colors
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach((mat: any) => {
          if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
            mat.roughness = 1
            mat.metalness = 0
            mat.envMapIntensity = 0
          }
          mat.needsUpdate = true
        })
      }
    })
  }, [scene])

  useEffect(() => {
    if (actions && animations.length > 0) {
      const firstAction = actions[animations[0].name]
      if (firstAction) {
        firstAction.reset().play()
        firstAction.setLoop(THREE.LoopRepeat, Infinity)
      }
    }
  }, [actions, animations])

  useFrame((_, delta) => {
    if (!ref.current) return
    t.current += delta * 1.2

    const x = Math.sin(t.current * 0.7) * 5
    const y = Math.sin(t.current * 1.1) * 2 + 1
    const z = Math.cos(t.current * 0.5) * 3

    const nx = Math.sin((t.current + 0.05) * 0.7) * 5
    const nz = Math.cos((t.current + 0.05) * 0.5) * 3

    ref.current.position.set(x, y, z)
    ref.current.rotation.y = Math.atan2(nx - x, nz - z)
    ref.current.rotation.z = Math.sin(t.current * 2) * 0.15
    ref.current.rotation.x = Math.sin(t.current * 1.5) * 0.1
  })

  return <primitive ref={ref} object={scene} scale={0.8} />
}

export default function CharizardScene() {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 2, 12], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        {/* Pure white neutral lights — no color tinting */}
        <ambientLight intensity={2.5} color="#ffffff" />
        <directionalLight position={[5, 10, 8]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, 5, 8]} intensity={1} color="#ffffff" />
        <Suspense fallback={null}>
          <Charizard />
        </Suspense>
      </Canvas>
    </div>
  )
}
