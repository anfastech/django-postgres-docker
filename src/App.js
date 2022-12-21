import react, { useRef } from "react";
// Three
import * as THREE from "three";
// R3F and Drei
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, CubeCamera } from "@react-three/drei";
// Shaders
import BackgroundShader from "./Shaders/BackgroundShader";
import SphereShaderMaterial from "./Shaders/SphereShader";

function Scene() {
  const backgroundShaderRef = useRef();
  const sphereShaderRef = useRef();

  useFrame(({ clock }) => {
    backgroundShaderRef.current.uTime = clock.getElapsedTime();
  });

  return (
    <>
      <CubeCamera args={[0.1, 100, 512]}>
        {(texture) => (
          <mesh position={[0, 0, 0]}>
            <sphereBufferGeometry args={[0.3, 64, 64]} />
            <sphereShaderMaterial ref={sphereShaderRef} uCube={texture} />
          </mesh>
        )}
      </CubeCamera>
      <mesh position={[0, 0, 0]}>
        <sphereBufferGeometry attach="geometry" args={[2, 100, 100]} />
        <backgroundShader
          attach="material"
          side={THREE.BackSide}
          ref={backgroundShaderRef}
        />
      </mesh>
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <OrbitControls />
        <Scene />
      </Canvas>
    </div>
  );
}
