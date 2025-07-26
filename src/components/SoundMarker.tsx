import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh } from 'three';
import { getSoundIcon } from '@/utils/soundIcons';

interface SoundMarkerProps {
  position: [number, number, number];
  soundType: string;
  confidence: number;
  viewMode?: 'default' | 'inside';
}

export const SoundMarker = ({ position, soundType, confidence, viewMode = 'default' }: SoundMarkerProps) => {
  const markerRef = useRef<Mesh>(null);
  const iconData = getSoundIcon(soundType);
  
  useFrame((state) => {
    if (markerRef.current) {
      markerRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      
      // In inside mode, make marker face center (0,0,0)
      if (viewMode === 'inside') {
        markerRef.current.lookAt(0, 0, 0);
      }
    }
  });

  return (
    <group position={position}>
      {/* Glowing sphere marker */}
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhongMaterial 
          color="#06d6a0" 
          emissive="#06d6a0"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Pulsing ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.3, 32]} />
        <meshBasicMaterial 
          color="#06d6a0" 
          transparent 
          opacity={0.4}
        />
      </mesh>
      
      {/* HTML overlay for icon and info */}
      <Html
        position={viewMode === 'inside' ? [0, -0.3, 0] : [0, 0.3, 0]}
        center
        distanceFactor={viewMode === 'inside' ? 4 : 8}
        className="pointer-events-none"
        transform={viewMode === 'inside'}
        sprite={viewMode === 'inside'}
      >
        <div className="glass-panel rounded-lg p-2 text-center min-w-[120px]">
          <div className="text-2xl mb-1">{iconData.icon}</div>
          <div className="text-xs font-medium text-accent">{iconData.name}</div>
          <div className="text-xs text-muted-foreground">
            {(confidence * 100).toFixed(1)}%
          </div>
        </div>
      </Html>
    </group>
  );
};