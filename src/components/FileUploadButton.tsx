import React from "react";

interface FileUploadButtonProps {
  bgColor?: string;
  textColor?: string;
  hoverBg?: string;
  borderColor?: string;
  icon?: React.ReactNode;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  bgColor = "bg-indigo-600",
  textColor = "text-white",
  hoverBg = "hover:bg-indigo-700",
  borderColor = "border border-indigo-600",
  icon,
  label,
  onChange
}) => {
  return (
    <label
      className={`flex items-center gap-2 px-4 py-2 ${bgColor} ${textColor} rounded-lg shadow-lg 
             ${hoverBg} transition-all duration-300 ${borderColor}
             hover:scale-105 backdrop-blur-sm cursor-pointer`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
      <input
        type="file"
        accept=".obj,.gltf,.glb,.stl"
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
};

export default FileUploadButton;
