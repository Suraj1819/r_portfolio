import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function GeometricSculpture() {
  const group = useRef();
  const mesh = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.2, 1);
    return geo;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.15;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    if (mesh.current) {
      mesh.current.rotation.z = t * 0.08;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geometry}>
        <meshStandardMaterial
          color="#E9A23B"
          wireframe
          transparent
          opacity={0.85}
          emissive="#B87519"
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh geometry={geometry} scale={0.92}>
        <meshStandardMaterial
          color="#F8F4EA"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[1.6, 0.02, 8, 64]} />
        <meshStandardMaterial color="#E9A23B" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 4, 2]} intensity={1.2} color="#FFF8E7" />
      <pointLight position={[-3, -2, 2]} intensity={0.4} color="#E9A23B" />
      <GeometricSculpture />
    </Canvas>
  );
}
