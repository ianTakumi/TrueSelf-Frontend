import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5 * Math.PI} />
      <RelaxingSphere scale={1.5} />
      <OrbitControls />
      <Environment preset="city" />
    </Canvas>
  );
}

function RelaxingSphere(props) {
  const ref = useRef();
  let scaleFactor = 0;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    scaleFactor = 1 + 0.1 * Math.sin(t * 2);
    ref.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    ref.current.material.color.setHSL((Math.sin(t * 0.5) + 1) / 2, 0.6, 0.5);
  });

  return (
    <mesh ref={ref} {...props}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={"blue"} />
    </mesh>
  );
}
