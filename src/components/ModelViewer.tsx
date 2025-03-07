import React, {
  useState,
  Suspense,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  useGLTF,
  Center,
  PerspectiveCamera,
  Html,
} from "@react-three/drei";
import { Cube } from "./Cube";
import {
  Download,
  Upload,
  Maximize2,
  Camera,
  RotateCcw,
  Info,
  Compass,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { saveAs } from "file-saver";
import * as THREE from "three";
import { GLTFExporter } from "three-stdlib";

interface ModelViewerProps {
  className?: string;
  isDarkMode: boolean;
}

const Model: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const DirectionIndicator = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { camera } = useThree();
  const [direction, setDirection] = useState("N");

  useEffect(() => {
    const updateDirection = () => {
      const angle = Math.atan2(camera.position.x, camera.position.z);
      const degrees = (angle * 180) / Math.PI;

      let newDirection = "";
      if (degrees > -22.5 && degrees <= 22.5) newDirection = "N";
      else if (degrees > 22.5 && degrees <= 67.5) newDirection = "NW";
      else if (degrees > 67.5 && degrees <= 112.5) newDirection = "W";
      else if (degrees > 112.5 && degrees <= 157.5) newDirection = "SW";
      else if (degrees > 157.5 || degrees <= -157.5) newDirection = "S";
      else if (degrees > -157.5 && degrees <= -112.5) newDirection = "SE";
      else if (degrees > -112.5 && degrees <= -67.5) newDirection = "E";
      else if (degrees > -67.5 && degrees <= -22.5) newDirection = "NE";

      setDirection(newDirection);
    };

    (camera as THREE.PerspectiveCamera).addEventListener(
      "change",
      updateDirection
    );
    return () =>
      (camera as THREE.PerspectiveCamera).removeEventListener(
        "change",
        updateDirection
      );
  }, [camera]);

  return (
    <Html position={[-2, 2, 0]}>
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isDarkMode ? "bg-gray-900/80" : "bg-white/80"
        } backdrop-blur-sm border ${
          isDarkMode ? "border-indigo-500/30" : "border-indigo-200"
        }`}
      >
        <Compass
          className={isDarkMode ? "text-indigo-400" : "text-indigo-600"}
          size={20}
        />
        <span
          className={`font-medium ${
            isDarkMode ? "text-indigo-300" : "text-indigo-600"
          }`}
        >
          {direction}
        </span>
      </div>
    </Html>
  );
};

const ControlButton: React.FC<{
  onClick: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
  label: string;
  tooltip?: string;
  isDarkMode: boolean;
}> = ({ onClick, icon, label, tooltip, isDarkMode }) => {
  const bgColor = isDarkMode ? "bg-indigo-600/20" : "bg-indigo-50";
  const textColor = isDarkMode ? "text-indigo-300" : "text-indigo-600";
  const borderColor = isDarkMode ? "border-indigo-500/30" : "border-indigo-200";
  const hoverBg = isDarkMode ? "hover:bg-indigo-500/30" : "hover:bg-indigo-100";

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 ${bgColor} ${textColor} rounded-lg shadow-lg 
                   ${hoverBg} transition-all duration-300 border ${borderColor}
                   hover:scale-105 backdrop-blur-sm`}
      >
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </button>
      {tooltip && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 
                      bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 pointer-events-none whitespace-nowrap"
        >
          {tooltip}
        </div>
      )}
    </div>
  );
};

const SceneContent: React.FC<{
  modelUrl: string | null;
  isDarkMode: boolean;
  controlsRef: React.RefObject<any>;
}> = ({ modelUrl, isDarkMode, controlsRef }) => {
  useThree();

  return (
    <>
      <Stage environment={isDarkMode ? "night" : "sunset"} intensity={0.6}>
        <Center>
          {modelUrl ? (
            <Model url={modelUrl} />
          ) : (
            <Cube isDarkMode={isDarkMode} />
          )}
        </Center>
      </Stage>
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={!modelUrl}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <DirectionIndicator isDarkMode={isDarkMode} />
    </>
  );
};

export const ModelViewer: React.FC<ModelViewerProps> = ({
  className,
  isDarkMode,
}) => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const viewerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<any>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);


  useEffect(() => {
    if (!showTutorial) {
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showTutorial]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
      setShowTutorial(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "model/gltf-binary": [".glb"],
      "model/gltf+json": [".gltf"],
      "model/obj": [".obj"],
      "model/stl": [".stl"],
    },
    noClick: true,
  });

  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sceneRef.current) return;

    const exporter = new GLTFExporter();
    try {
      const gltf = await new Promise((resolve, reject) => {
        exporter.parse(
          sceneRef.current!,
          (result) => resolve(result),
          (error) => reject(error),
          { binary: true }
        );
      });

      const blob = new Blob([gltf as BlobPart], {
        type: "application/octet-stream",
      });
      saveAs(blob, "model-export.glb");
    } catch (error) {
      console.error("Error exporting model:", error);
    }
  };

  const handleScreenshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvasRef.current) return;

    // Convert WebGL canvas to image
    const dataUrl = canvasRef.current.toDataURL("image/png");

    // Trigger download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "model-screenshot.png";
    link.click();
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModelUrl(null);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!viewerRef.current) return;
    console.log("ASdf");

    if (document.fullscreenElement === viewerRef.current) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      if (viewerRef.current.requestFullscreen) {
        await viewerRef.current.requestFullscreen();
      } else if ((viewerRef.current as any).mozRequestFullScreen) {
        await (viewerRef.current as any).mozRequestFullScreen();
      } else if ((viewerRef.current as any).webkitRequestFullscreen) {
        await (viewerRef.current as any).webkitRequestFullscreen();
      } else if ((viewerRef.current as any).msRequestFullscreen) {
        await (viewerRef.current as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
    }
  };

  return (
    <div
    
      className={`relative ${className || ""} ${
        isDragActive ? "ring-2 ring-indigo-400 ring-opacity-50" : ""
      }`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div
        className={`w-full ${isFullscreen ? "h-screen" : "h-[600px]"} ${
          isDarkMode ? "bg-black/50" : "bg-white/50"
        } rounded-xl overflow-hidden backdrop-blur-sm border ${
          isDarkMode ? "border-indigo-500/20" : "border-indigo-200"
        } transition-all duration-300`}
        ref={viewerRef}
      >
        
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          ref={canvasRef}
          shadows
          camera={{ position: [0, 0, 5], fov: 50 }}
          onCreated={({ scene }) => {
            sceneRef.current = scene;
          }}
        >
          <Suspense fallback={null}>
            <SceneContent
              modelUrl={modelUrl}
              isDarkMode={isDarkMode}
              controlsRef={controlsRef}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-3">
        <ControlButton
          onClick={handleExport}
          icon={<Download size={20} />}
          label="Export"
          tooltip="Export model as GLB"
          isDarkMode={isDarkMode}
        />
        <ControlButton
          onClick={handleScreenshot}
          icon={<Camera size={20} />}
          label="Screenshot"
          tooltip="Take a screenshot"
          isDarkMode={isDarkMode}
        />
        <ControlButton
          onClick={toggleFullscreen}
          icon={<Maximize2 size={20} />}
          label="Fullscreen"
          tooltip="Toggle fullscreen mode"
          isDarkMode={isDarkMode}
        />
        {modelUrl && (
          <ControlButton
            onClick={handleReset}
            icon={<RotateCcw size={20} />}
            label="Reset"
            tooltip="Reset to default cube"
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      {isDragActive && (
        <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div
          
            className={`text-center p-8 ${
              isDarkMode ? "bg-gray-900/80" : "bg-white/80"
            } rounded-2xl 
                          border ${
                            isDarkMode
                              ? "border-indigo-500/30"
                              : "border-indigo-200"
                          } 
                          transform scale-105 transition-transform duration-300`}
          >
            <Upload
              className={`mx-auto h-12 w-12 ${
                isDarkMode ? "text-indigo-400" : "text-indigo-600"
              } animate-bounce`}
            />
            <p
              className={`mt-4 text-xl font-medium ${
                isDarkMode ? "text-indigo-300" : "text-indigo-600"
              }`}
            >
              Drop your 3D model here
            </p>
            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Supported formats: .glb, .gltf, .obj, .stl
            </p>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
        {showTutorial ? (
          <div
            className={`flex items-center gap-2 px-6 py-3 ${
              isDarkMode ? "bg-gray-900/80" : "bg-white/80"
            } 
            rounded-full backdrop-blur-sm border ${
              isDarkMode ? "border-indigo-500/30" : "border-indigo-200"
            } 
            animate-pulse shadow-lg`}
          >
            <Info
              size={16}
              className={isDarkMode ? "text-indigo-400" : "text-indigo-600"}
            />
            <p
              className={`text-sm ${
                isDarkMode ? "text-indigo-300" : "text-indigo-600"
              }`}
            >
              Watch the compass indicator to track model orientation <br /> •
              Click and drag to rotate the model.
            </p>
          </div>
        ) : (
          showInstructions && (
            <div
              className="flex items-center gap-2 px-4 py-2 bg-[#1E1B4B]/80 rounded-full backdrop-blur-sm
                   border border-[#06B6D4]/30 animate-pulse"
            >
              <Info size={16} className="text-[#06B6D4]" />
              <p className="text-sm text-[#06B6D4]">
                Right click to pan • Scroll to zoom • Left click to rotate
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
