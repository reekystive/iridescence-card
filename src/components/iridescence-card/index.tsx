import { Environment, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState, type FC } from 'react';
import { Group, ShaderMaterial } from 'three';
import { CardText } from './card-text';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

export const IridescenceCard: FC = () => {
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const [deviceOrientation, setDeviceOrientation] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        setDeviceOrientation([event.gamma * (Math.PI / 180), event.beta * (Math.PI / 180)]);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      (materialRef.current.uniforms.uTime as { value: number }).value = clock.getElapsedTime();
      (materialRef.current.uniforms.uDeviceOrientation as { value: [number, number] }).value = deviceOrientation;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  return (
    <>
      <color attach="background" args={['#0a0a1a']} />
      <Environment preset="city" />
      <group ref={groupRef}>
        <RoundedBox args={[3, 4, 0.1]} radius={0.02} smoothness={8} rotation={[0, 0, 0]}>
          <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={{
              uDeviceOrientation: { value: deviceOrientation },
              uTime: { value: 0 },
            }}
          />
        </RoundedBox>
        <CardText deviceOrientation={deviceOrientation} />
      </group>
    </>
  );
};
