import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { AudioAnalysisResult } from '@/pages/Index';
import { SoundMarker } from './SoundMarker';

interface SphereViewerProps {
  results: AudioAnalysisResult | null;
  isLoading: boolean;
}

// Convert azimuth and elevation to 3D coordinates
const azimuthElevationToCartesian = (azimuth: number, elevation: number, radius: number = 3): [number, number, number] => {
  const azimuthRad = (azimuth * Math.PI) / 180;
  const elevationRad = (elevation * Math.PI) / 180;
  
  const x = radius * Math.cos(elevationRad) * Math.cos(azimuthRad);
  const y = radius * Math.sin(elevationRad);
  const z = radius * Math.cos(elevationRad) * Math.sin(azimuthRad);
  
  return [x, y, z];
};

const Scene = ({ results }: { results: AudioAnalysisResult | null }) => {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Main transparent sphere */}
      <mesh>
        <sphereGeometry args={[3, 64, 64]} />
        <meshPhongMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={0.1} 
          wireframe={false}
        />
      </mesh>
      
      {/* Wireframe sphere for reference */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={0.2} 
          wireframe={true}
        />
      </mesh>
      
      {/* Sound source marker */}
      {results && (
        <SoundMarker
          position={azimuthElevationToCartesian(results.azimuth, results.elevation)}
          soundType={results.classification[0]?.label || 'Unknown'}
          confidence={results.classification[0]?.score || 0}
        />
      )}
      
      {/* Coordinate system helpers */}
      <Text
        position={[4, 0, 0]}
        fontSize={0.3}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        +X (East)
      </Text>
      <Text
        position={[0, 4, 0]}
        fontSize={0.3}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        +Y (Up)
      </Text>
      <Text
        position={[0, 0, 4]}
        fontSize={0.3}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        +Z (North)
      </Text>
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
      />
    </>
  );
};

export const SphereViewer = ({ results, isLoading }: SphereViewerProps) => {
  return (
    <div className="glass-panel rounded-2xl p-6 h-full relative overflow-hidden">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">3D Sound Localization</h2>
        <p className="text-sm text-muted-foreground">
          Interactive sphere showing sound source direction and type
        </p>
      </div>
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center glass-panel rounded-2xl z-10"
        >
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium">Analyzing audio...</p>
            <p className="text-sm text-muted-foreground">Processing sound classification and localization</p>
          </div>
        </motion.div>
      )}
      
      <div className="h-[calc(100%-80px)] rounded-xl overflow-hidden">
        <Canvas camera={{ position: [5, 2, 5], fov: 60 }}>
          <Scene results={results} />
        </Canvas>
      </div>
      
      {results && (
        <div className="absolute bottom-8 left-8 glass-panel rounded-lg p-3">
          <div className="text-sm">
            <div className="font-medium text-accent">Sound Location</div>
            <div className="text-muted-foreground">
              Azimuth: {results.azimuth.toFixed(1)}° | Elevation: {results.elevation.toFixed(1)}°
            </div>
          </div>
        </div>
      )}
    </div>
  );
};