import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Loader2, Eye, Navigation } from 'lucide-react';
import { useState } from 'react';
import * as THREE from 'three';
import { AudioAnalysisResult } from '@/pages/Index';
import { SoundMarker } from './SoundMarker';
import { Button } from '@/components/ui/button';

interface SphereViewerProps {
  results: AudioAnalysisResult | null;
  isLoading: boolean;
}

type ViewMode = 'default' | 'inside';

// Convert azimuth and elevation to 3D coordinates
const azimuthElevationToCartesian = (azimuth: number, elevation: number, radius: number = 3): [number, number, number] => {
  const azimuthRad = (azimuth * Math.PI) / 180;
  const elevationRad = (elevation * Math.PI) / 180;
  
  const x = radius * Math.cos(elevationRad) * Math.cos(azimuthRad);
  const y = radius * Math.sin(elevationRad);
  const z = radius * Math.cos(elevationRad) * Math.sin(azimuthRad);
  
  return [x, y, z];
};

const Scene = ({ results, viewMode }: { results: AudioAnalysisResult | null; viewMode: ViewMode }) => {
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
          opacity={viewMode === 'inside' ? 0.05 : 0.1} 
          wireframe={false}
          side={viewMode === 'inside' ? THREE.DoubleSide : THREE.FrontSide}
        />
      </mesh>
      
      {/* Wireframe sphere for reference */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={viewMode === 'inside' ? 0.1 : 0.2} 
          wireframe={true}
          side={viewMode === 'inside' ? THREE.DoubleSide : THREE.FrontSide}
        />
      </mesh>
      
      {/* Sound source marker */}
      {results && (
        <SoundMarker
          position={azimuthElevationToCartesian(results.azimuth, results.elevation)}
          soundType={results.classification[0]?.label || 'Unknown'}
          confidence={results.classification[0]?.score || 0}
          viewMode={viewMode}
        />
      )}
      
      {/* Coordinate system helpers - only show in default mode */}
      {viewMode === 'default' && (
        <>
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
        </>
      )}
      
      {/* Controls based on view mode */}
      {viewMode === 'default' ? (
        <OrbitControls 
          key="orbit-default"
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          rotateSpeed={0.8}
          enableDamping={true}
          dampingFactor={0.1}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }}
        />
      ) : (
        <OrbitControls 
          key="orbit-pov"
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          target={[0, 0, 0]}
          minDistance={0.01}
          maxDistance={0.01}
          rotateSpeed={0.8}
          enableDamping={true}
          dampingFactor={0.1}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.ROTATE
          }}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.ROTATE,
            RIGHT: THREE.MOUSE.ROTATE
          }}
        />
      )}
    </>
  );
};

export const SphereViewer = ({ results, isLoading }: SphereViewerProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('default');

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'default' ? 'inside' : 'default');
  };

  return (
    <div className="glass-panel rounded-2xl p-3 md:p-6 h-full relative">
      <div className="mb-3 md:mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold mb-2">3D Sound Localization</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            {viewMode === 'default' 
              ? 'Interactive sphere showing sound source direction and type'
              : 'Immersive view from inside the sphere - look around to locate sounds'
            }
          </p>
        </div>
        
        {/* View mode toggle button */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleViewMode}
          className="flex items-center gap-2 text-xs flex-shrink-0"
          title={viewMode === 'default' 
            ? 'Switch to immersive sound-source view from inside the sphere'
            : 'Return to external sphere view'
          }
        >
          {viewMode === 'default' ? (
            <>
              <Eye className="w-3 h-3" />
              POV Mode
            </>
          ) : (
            <>
              <Navigation className="w-3 h-3" />
              Explore Sphere
            </>
          )}
        </Button>
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
      
      <div 
        className="h-[calc(100%-60px)] md:h-[calc(100%-80px)] w-full rounded-xl relative"
        style={{ 
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div 
          className="w-full h-full"
          style={{ 
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            position: 'relative'
          }}
          onTouchStart={(e) => {
            // Prevent page scrolling when touching the 3D area
            e.preventDefault();
          }}
        >
          <Canvas 
            key={viewMode}
            camera={{ 
              position: viewMode === 'default' ? [5, 2, 5] : [0, 0, 0], 
              fov: 60,
              aspect: 1
            }}
            gl={{ 
              antialias: false,
              alpha: true,
              powerPreference: "default",
              precision: "mediump"
            }}
            dpr={1}
            style={{ 
              width: '100%',
              height: '100%',
              display: 'block'
            }}
            onCreated={({ gl, size }) => {
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
              gl.setSize(size.width, size.height);
            }}
            resize={{ scroll: false, debounce: { scroll: 50, resize: 50 } }}
          >
            <Scene results={results} viewMode={viewMode} />
          </Canvas>
        </div>
      </div>
      
      {results && (
        <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 glass-panel rounded-lg p-2 md:p-3 max-w-[calc(100%-2rem)]">
          <div className="text-xs md:text-sm">
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