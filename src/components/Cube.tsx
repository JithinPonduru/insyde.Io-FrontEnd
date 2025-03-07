import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface CubeProps {
  isDarkMode: boolean
}

export const Cube: React.FC<CubeProps> = ({ isDarkMode }) => {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2
      meshRef.current.rotation.y += delta * 0.2
    }
  })

  const lightModeColors = {
    main: "#FF6B6B", // Coral red
    emissive: "#FF8787",
    roughness: 0.5,
    metalness: 1,
    emissiveIntensity: 0.6
  }

  const darkModeColors = {
    main: "#06B6D4", // Electric blue
    emissive: "#0EA5E9",
    roughness: 0.2,
    metalness: 0.9,
    emissiveIntensity: 0.4
  }

  const colors = isDarkMode ? darkModeColors : lightModeColors

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={colors.main}
        roughness={colors.roughness}
        metalness={colors.metalness}
        emissive={colors.emissive}
        emissiveIntensity={colors.emissiveIntensity}
      />
    </mesh>
  )
}