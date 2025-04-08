import '@fontsource/inter';
import { Text } from '@react-three/drei';
import { type FC } from 'react';
import { BASE_PATH } from '../../constants/index.ts';

interface CardTextProps {
  deviceOrientation?: [number, number];
}

export const CardText: FC<CardTextProps> = ({ deviceOrientation }) => {
  return (
    <group position={[0, 0, 0.051]}>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font={`${BASE_PATH}fonts/inter.woff`}
      >
        Interactive Iridescence Card
      </Text>
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font={`${BASE_PATH}fonts/inter.woff`}
      >
        Move your phone to see the iridescence effect
      </Text>
      {deviceOrientation && (
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font={`${BASE_PATH}fonts/inter.woff`}
        >
          {`Orientation: ${deviceOrientation[0].toFixed(2)}, ${deviceOrientation[1].toFixed(2)}`}
        </Text>
      )}
    </group>
  );
};
