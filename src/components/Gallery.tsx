import React, { useState, useEffect } from "react";
import { Download, Upload } from "lucide-react";
import FileUploadButton from "./FileUploadButton";

interface GalleryProps {
  isDarkMode: boolean;
}

const backendUrl =
  "https://b0ed76d0-7489-42b9-b9b5-02971486301e-00-1qecrwu2j9xei.sisko.replit.dev:8000/api/models/";

export const Gallery: React.FC<GalleryProps> = ({ isDarkMode }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUploadStatus, setFileUploadStatus] = useState<string | null>(null);
  const [models, setModels] = useState<
    { id: number; name: string; format: string; downloadUrl: string }[]
  >([]);

  const intialmodels = [
    {
      id: 1,
      name: "Low Poly Tree",
      thumbnail:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1740",
      format: "glb",
      downloadUrl: "/models/tree.glb",
    },
    {
      id: 2,
      name: "Modern Chair",
      thumbnail:
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1764",
      format: "glb",
      downloadUrl: "/models/chair.glb",
    },
    {
      id: 3,
      name: "Geometric Sculpture",
      thumbnail:
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1674",
      format: "glb",
      downloadUrl: "/models/sculpture.glb",
    },
  ];

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      handleSubmit();
    }
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await fetch(backendUrl + "generate_report/", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Data:", data);

        // Assuming "report" is the key that contains the models
        setModels(data.report || []);
      } else {
        setFileUploadStatus(`Failed to fetch data: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFileUploadStatus("An error occurred while fetching data.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setFileUploadStatus("File uploaded successfully!");
        setSelectedFile(null);
        fetchModels(); // Refresh models after upload
      } else {
        setFileUploadStatus("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setFileUploadStatus("An error occurred during upload.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center my-8 md:my-4">
        <h2
          className={`text-3xl font-bold ${
            isDarkMode
              ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
              : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
          }`}
        >
          3D Model Gallery
        </h2>
        <div>
          <FileUploadButton
            label="Upload File"
            icon={<Upload size={16} />}
            onChange={handleFileChange}
          />
          {fileUploadStatus && (
            <p
              className={`mt-2 text-sm font-medium px-3 py-2 rounded-md border ${
                fileUploadStatus?.includes("successfully")
                  ? isDarkMode
                    ? "bg-blue-900/30 text-blue-300 border-blue-600"
                    : "bg-blue-50 text-blue-600 border-blue-300"
                  : isDarkMode
                  ? "bg-gray-800/40 text-red-300 border-gray-600"
                  : "bg-gray-50 text-gray-700 border-gray-300"
              }`}
            >
              {fileUploadStatus}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {intialmodels.map((intialmodel) => (
          <div
            key={intialmodel.id}
            className={`rounded-lg overflow-hidden border ${
              isDarkMode ? "border-gray-800" : "border-gray-200"
            } transition-transform duration-300 hover:scale-105`}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={intialmodel.thumbnail}
                alt={intialmodel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`p-4 ${isDarkMode ? "bg-gray-800/50" : "bg-white/50"}`}
            >
              <h3
                className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {intialmodel.name}
              </h3>
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Format: .{intialmodel.format}
                </span>
                <a
                  href={intialmodel.downloadUrl}
                  download
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                    isDarkMode
                      ? "bg-indigo-600/20 text-indigo-300 hover:bg-indigo-500/30"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  } transition-colors duration-300`}
                >
                  <Download size={16} />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        ))}
        {models.length > 0 ? (
          models.map((model) => (
            <div
              key={model.id}
              className={`rounded-lg overflow-hidden border ${
                isDarkMode ? "border-gray-800" : "border-gray-200"
              } transition-transform duration-300 hover:scale-105`}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={
                    model.downloadUrl || // If API provides image URL, use it
                    "https://via.placeholder.com/150" // Otherwise, use a placeholder
                  }
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`p-4 ${
                  isDarkMode ? "bg-gray-800/50" : "bg-white/50"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {model.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Format: .{model.format}
                  </span>
                  <a
                    href={model.downloadUrl}
                    download
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                      isDarkMode
                        ? "bg-indigo-600/20 text-indigo-300 hover:bg-indigo-500/30"
                        : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                    } transition-colors duration-300`}
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No models available.
          </p>
        )}
      </div>
    </div>
  );
};
