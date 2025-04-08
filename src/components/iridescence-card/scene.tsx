import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { type FC } from 'react';
import { IridescenceCard } from './index';

export const IridescenceCardScene: FC = () => {
  return (
    <div className="h-screen w-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <IridescenceCard />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};
