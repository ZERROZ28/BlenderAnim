import { useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Lightformer, useGLTF, useAnimations, SoftShadows, ScrollControls, useScroll, Environment, OrthographicCamera } from '@react-three/drei'

export default function App() {
  return (
    <Canvas shadows orthographic camera={{ position: [15, 0, 15], zoom: 80 }}>
      {/* Scroll controls are like orbit controls for scroll */}
      <ScrollControls pages={2}>
        <Model scale={0.1} />
      </ScrollControls>
      {/* Fill light and main light */}
      <hemisphereLight intensity={0.1} />
      <directionalLight position={[2, 8, -5]} castShadow intensity={2} shadow-mapSize={2048} shadow-bias={-0.001}>
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.1, 30]} />
      </directionalLight>
      {/* The shadow catcher */}
      <mesh receiveShadow position={[0, -5.2, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={30}>
        <planeGeometry />
        <shadowMaterial transparent opacity={0.4} color="#604020" />
      </mesh>
      {/* Enable PCSS soft shadows */}
      <SoftShadows size={35} />
      {/* The environment map, creates the reflections */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 4, 0, 0]}>
          <Lightformer form="ring" intensity={2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[2, 100, 1]} />
          <Lightformer form="ring" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[100, 2, 1]} />
          <Lightformer form="ring" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={0.5} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[100, 10, 1]} />
        </group>
      </Environment>
    </Canvas>
  )
}

/*
Author: Slava Z. (https://sketchfab.com/slava)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/3d-printable-radial-pneumatic-engine-3cbddbecd6c5462391e9936a3ccd7d32
Title: 3d Printable Radial Pneumatic Engine
*/
function Model(props) {
  // Fetch scroll data
  const scroll = useScroll()
  const { scene, animations } = useGLTF('/3d_printable_radial_pneumatic_engine-transformed.glb')

  
  const { actions } = useAnimations(animations, scene)
  useEffect(() => {
    // Enable shadows
    scene.traverse((o) => (o.castShadow = o.receiveShadow = true))
    // Start action, pause right away
    actions['Take 001'].play().paused = true
  }, [])


  useFrame((state, delta) => {
    const action = actions['Take 001']
    // Action.time is the clip duration multiplied with the normalized scroll offset (0-1)
    action.time = action.getClip().duration * scroll.offset
    // Move camera along
    state.camera.position.set(Math.sin(scroll.offset) * 10, Math.atan(scroll.offset * Math.PI * 2) * 5, Math.cos((scroll.offset * Math.PI) / 2) * 10)
    state.camera.zoom = 100 - scroll.offset * 50
    state.camera.lookAt(0, 0, 0)
    state.camera.updateProjectionMatrix()
  })
  return <primitive object={scene} {...props} />
}
