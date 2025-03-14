import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Tubes } from "./brain-tubes.jsx";
import { BrainParticles } from "./brain-particles.jsx";
import { data } from "./data.js";

function createBrainCurvesFromPaths() {
  const paths = data.economics[0].paths;

  const brainCurves = [];
  paths.forEach((path) => {
    const points = [];
    for (let i = 0; i < path.length; i += 3) {
      points.push(new THREE.Vector3(path[i], path[i + 1], path[i + 2]));
    }
    const tempCurve = new THREE.CatmullRomCurve3(points);
    brainCurves.push(tempCurve);
  });

  return brainCurves;
}

const curves = createBrainCurvesFromPaths();

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 0.3], near: 0.001, far: 5 }}>
      <color attach="background" args={["black"]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Tubes curves={curves} />
      <BrainParticles curves={curves} />
      <OrbitControls />
    </Canvas>
  );
}

export default App;
