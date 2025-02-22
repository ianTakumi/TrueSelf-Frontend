import React, { useRef, useMemo, useEffect } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { randomRange } from "../../../../utils/helpers";

// Shader Material
const BrainParticleMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color(0.1, 0.3, 0.6) },
  // Vertex Shader
  /*glsl*/ `
    varying vec2 vUv;
    uniform float time;
    varying float vProgress;
    attribute float randoms;

    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = randoms * 2.0 * (1.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  /*glsl*/ `
    uniform float time;

    void main() {
      float disc = length(gl_PointCoord.xy - vec2(0.5));
      float opacity = 0.3 * smoothstep(0.5, 0.4, disc);
      gl_FragColor = vec4(vec3(opacity), 1.0);
    }
  `
);

extend({ BrainParticleMaterial });

export function BrainParticles({ curves }) {
  const density = 10;
  const numberOfPoints = density * curves.length;
  const myPoints = useRef([]);
  const brainGeo = useRef();

  // Position Array
  const positions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < numberOfPoints; i++) {
      positions.push(
        randomRange(-1, 1),
        randomRange(-1, 1),
        randomRange(-1, 1)
      );
    }
    return new Float32Array(positions);
  }, [numberOfPoints]);

  // Randoms Array
  const randoms = useMemo(() => {
    const randoms = [];
    for (let i = 0; i < numberOfPoints; i++) {
      randoms.push(randomRange(0.3, 1));
    }
    return new Float32Array(randoms);
  }, [numberOfPoints]);

  // Initialize Particles
  useEffect(() => {
    const points = [];
    for (let i = 0; i < curves.length; i++) {
      for (let j = 0; j < density; j++) {
        points.push({
          currentOffset: Math.random(),
          speed: Math.random() * 0.01,
          curve: curves[i],
          curPosition: Math.random(),
        });
      }
    }
    myPoints.current = points;
  }, [curves, density]);

  // Animation Frame
  useFrame(() => {
    if (!brainGeo.current) return;
    const positionsArray = brainGeo.current.attributes.position.array;

    myPoints.current.forEach((point, i) => {
      point.curPosition = (point.curPosition + point.speed) % 1;
      const pos = point.curve.getPointAt(point.curPosition);

      positionsArray[i * 3] = pos.x;
      positionsArray[i * 3 + 1] = pos.y;
      positionsArray[i * 3 + 2] = pos.z;
    });

    brainGeo.current.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={brainGeo}>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-randoms"
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>

      <brainParticleMaterial
        depthTest={false}
        depthWrite={false}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
