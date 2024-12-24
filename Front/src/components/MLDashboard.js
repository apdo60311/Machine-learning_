import React, { useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Upload,
  Code,
  Layers,
  BarChart2,
  Cpu,
  Activity,
  Target,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import Papa from "papaparse";

const MLProjectLogo = () => (
  <div className="flex items-center space-x-3">
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
      <Cpu color="white" size={32} />
    </div>
    <h1 className="text-2xl font-bold text-gray-800">
      ML <span className="text-blue-600">Insight</span>Hub
    </h1>
  </div>
);

const MachineLearningDashboard = () => {
  const [algorithmData, setAlgorithmData] = useState({
    algorithms: [
      {
        name: "K-Nearest Neighbors",
        accuracy: 85.5,
        precision: 82.3,
        recall: 88.1,
        f1Score: 85.2,
        icon: <Layers color="#3B82F6" size={24} />,
      },
      {
        name: "Naive Bayes",
        accuracy: 78.2,
        precision: 75.6,
        recall: 80.1,
        f1Score: 77.8,
        icon: <Code color="#10B981" size={24} />,
      },
      {
        name: "Support Vector Machine",
        accuracy: 90.1,
        precision: 89.5,
        recall: 90.7,
        f1Score: 90.1,
        icon: <BarChart2 color="#8B5CF6" size={24} />,
      },
      {
        name: "Decision Tree",
        accuracy: 82.3,
        precision: 80.1,
        recall: 84.5,
        f1Score: 82.2,
        icon: <Activity color="#F43F5E" size={24} />,
      },
    ],
  });

  const [importedData, setImportedData] = useState(null);
  const [importError, setImportError] = useState(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "text/csv") {
      setError("Please upload a CSV file");
      return;
    }

    // Reset previous states
    setImportedData(null);
    setImportError(null);

    Papa.parse(file, {
      complete: (results) => {
        try {
          // Validate CSV structure
          if (results.data.length < 2) {
            throw new Error("Insufficient data in the CSV file");
          }

          console.log(results.data);

          setImportedData(results.data);
          setError(null);

          const formData = new FormData();
          formData.append("file", file);

          fetch("http://localhost:5000/machine-learning/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              file: results.data,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to upload file");
              }
              return response.json();
            })
            .then((data) => {
              console.log("File uploaded successfully:", data);
            })
            .catch((error) => {
              console.error("Error uploading file:", error);
            });
        } catch (error) {
          setImportError(error.message);
        }
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  const getIconForAlgorithm = (name) => {
    const iconMap = {
      "K-Nearest Neighbors": <Layers color="#3B82F6" size={24} />,
      "Naive Bayes": <Code color="#10B981" size={24} />,
      "Support Vector Machine": <BarChart2 color="#8B5CF6" size={24} />,
      "Decision Tree": <Activity color="#F43F5E" size={24} />,
    };
    return iconMap[name] || <Target color="#6B7280" size={24} />;
  };

  const performanceChartData = algorithmData.algorithms.map((algo) => ({
    name: algo.name,
    Accuracy: algo.accuracy,
    Precision: algo.precision,
    Recall: algo.recall,
    F1Score: algo.f1Score,
  }));

  const clearImportedData = () => {
    setImportedData(null);
    setImportError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="container mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <MLProjectLogo />
          <div className="flex space-x-4 items-center">
            {/* File Upload */}
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
              >
                <Upload className="mr-2" size={20} />
                Import CSV
              </label>
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
              Export Report
            </button>
          </div>
        </header>

        {/* Import Status & Errors */}
        {importError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <div className="flex items-center">
              <AlertTriangle className="mr-2" />
              <span className="block sm:inline">{importError}</span>
              <button
                onClick={clearImportedData}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {importedData && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <div className="flex items-center">
              <Check className="mr-2" />
              <span className="block sm:inline">
                Successfully imported data with {importedData.length} records
              </span>
              <button
                onClick={clearImportedData}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Algorithm Performance Overview */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="mr-2" /> Algorithm Performance Metrics
            </h2>
            <LineChart width={500} height={300} data={performanceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Accuracy" stroke="#3B82F6" />
              <Line type="monotone" dataKey="Precision" stroke="#10B981" />
              <Line type="monotone" dataKey="Recall" stroke="#8B5CF6" />
              <Line type="monotone" dataKey="F1Score" stroke="#F43F5E" />
            </LineChart>
          </div>

          {/* Algorithm Comparison Radar Chart */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Cpu className="mr-2" /> Comparative Analysis
            </h2>
            <RadarChart
              cx={250}
              cy={150}
              outerRadius={100}
              width={500}
              height={300}
              data={performanceChartData}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Accuracy"
                dataKey="Accuracy"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
          </div>

          {/* Algorithm Details */}
          <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Detailed Algorithm Insights
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {algorithmData.algorithms.map((algo, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-4">
                    {algo.icon}
                    <span className="font-bold">{algo.name}</span>
                  </div>
                  <div className="space-y-2">
                    <p>
                      Accuracy:{" "}
                      <span className="font-semibold">{algo.accuracy}%</span>
                    </p>
                    <p>
                      Precision:{" "}
                      <span className="font-semibold">{algo.precision}%</span>
                    </p>
                    <p>
                      Recall:{" "}
                      <span className="font-semibold">{algo.recall}%</span>
                    </p>
                    <p>
                      F1 Score:{" "}
                      <span className="font-semibold">{algo.f1Score}%</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineLearningDashboard;
