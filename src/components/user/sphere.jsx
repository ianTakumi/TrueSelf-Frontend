import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  SUBTRACTION,
  INTERSECTION,
  ADDITION,
  Brush,
  Evaluator,
} from "three-bvh-csg";

const ThreeScene = () => {
  const mountRef = useRef(null);
  const [params, setParams] = useState({
    operation: SUBTRACTION,
    useGroups: true,
    wireframe: false,
  });

  useEffect(() => {
    let scene, camera, renderer;
    let baseBrush, brush, core, result, evaluator, wireframe;
    let controls;

    const init = () => {
      if (!mountRef.current) return; // Ensure mountRef exists

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xfafafa);
      camera = new THREE.PerspectiveCamera(
        50,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        1,
        100
      );
      camera.position.set(-1, 1, 1).normalize().multiplyScalar(10);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(renderer.domElement);

      // Lights
      const ambient = new THREE.HemisphereLight(0xffffff, 0xbfd4d2, 3);
      scene.add(ambient);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
      directionalLight.position.set(1, 4, 3).multiplyScalar(3);
      scene.add(directionalLight);

      // Plane
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(),
        new THREE.ShadowMaterial({
          color: 0xd81b60,
          transparent: true,
          opacity: 0.075,
          side: THREE.DoubleSide,
        })
      );
      plane.position.y = -3;
      plane.rotation.x = -Math.PI / 2;
      plane.scale.setScalar(10);
      plane.receiveShadow = true;
      scene.add(plane);

      // Brushes
      evaluator = new Evaluator();
      baseBrush = new Brush(
        new THREE.IcosahedronGeometry(2, 3),
        new THREE.MeshStandardMaterial({ flatShading: true })
      );
      brush = new Brush(
        new THREE.CylinderGeometry(1, 1, 5, 45),
        new THREE.MeshStandardMaterial({ color: 0x80cbc4 })
      );
      core = new Brush(
        new THREE.IcosahedronGeometry(0.15, 1),
        new THREE.MeshStandardMaterial({ color: 0xff9800, emissive: 0xff9800 })
      );
      scene.add(core);

      wireframe = new THREE.Mesh(
        undefined,
        new THREE.MeshBasicMaterial({ color: 0x009688, wireframe: true })
      );
      scene.add(wireframe);

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = 5;
      controls.maxDistance = 75;
    };

    const updateCSG = () => {
      evaluator.useGroups = params.useGroups;
      result = evaluator.evaluate(baseBrush, brush, params.operation, result);
      result.castShadow = true;
      result.receiveShadow = true;
      scene.add(result);
    };

    const animate = () => {
      if (!renderer) return; // Prevents errors if renderer is disposed
      requestAnimationFrame(animate);

      // Update transforms
      const t = performance.now() * 0.001;
      baseBrush.rotation.x = t * 0.2;
      baseBrush.rotation.y = t * 0.3;
      baseBrush.rotation.z = t * 0.4;
      baseBrush.updateMatrixWorld();

      brush.rotation.x = t * -0.2;
      brush.rotation.y = t * -0.3;
      brush.rotation.z = t * -0.4;
      brush.updateMatrixWorld();

      updateCSG();
      wireframe.geometry = result.geometry;
      wireframe.visible = params.wireframe;
      renderer.render(scene, camera);
    };

    init();
    animate();

    return () => {
      if (renderer) {
        renderer.dispose(); // Dispose of renderer
      }

      if (controls) {
        controls.dispose(); // Dispose of OrbitControls
      }

      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement);
      }

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(
              (material) => material.dispose && material.dispose()
            );
          } else {
            object.material.dispose && object.material.dispose();
          }
        }
      });
    };
  }, [params]);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default ThreeScene;
