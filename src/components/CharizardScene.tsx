import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useRef, Suspense, useEffect } from 'react'
import * as THREE from 'three'

function Charizard() {
  const { scene, animations } = useGLTF('/charizard/charizard.glb')
  const ref = useRef<THREE.Group>(null)
  const { actions } = useAnimations(animations, ref)
  const t = useRef(0)

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

useGLTF.preload('/charizard/charizard.glb')

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
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
          // Disable ACES tone mapping — it washes out Charizard's orange to white
          toneMapping: THREE.NoToneMapping,
        }}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        {/* Clean warm orange — matches reference: soft even lighting, true #FF8C00 orange */}
        <ambientLight intensity={0.65} />
        <directionalLight position={[5, 10, 8]} intensity={1.0} color="#ffaa66" />
        <pointLight position={[2, 4, 5]} intensity={2.0} decay={0} color="#ff8c00" />
        <pointLight position={[-3, 2, 4]} intensity={0.8} decay={0} color="#ffaa44" />
        <Suspense fallback={null}>
          <Charizard />
        </Suspense>
      </Canvas>
    </div>
  )
}
