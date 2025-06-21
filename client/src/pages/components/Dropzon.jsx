import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CCard from "./CCard";
import axios from "../../axiosClient";
import * as XLSX from "xlsx";

const Dropzone = ({ refresh}) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [uploading , setUploading] = useState(false)
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError("");
    setMessage("");
    setPreviewData([]);

    if (fileRejections.length > 0) {
      setFile(null);
      setError("Only one Excel file is allowed (.xlsx or .xls, max 5MB)");
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Parse Excel for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Get first 10 rows
        setPreviewData(jsonData.slice(0, 11)); // header + 10 rows
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/vnd.ms-excel": [],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true)
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/app/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMessage(`✅ Uploaded successfully. Rows: ${res.data.rowCount}`);
      setFile(null);
      setPreviewData([]);
      refresh(true);
    } catch (err) {
      console.error(err);
      setError("❌ Upload failed. Please try again.");
    }finally{
      setUploading(false)
    }
  };

  return (
    <CCard title="Upload Excel File" desc="Only .xlsx or .xls files. Max size: 5MB.">
      <form
        {...getRootProps()}
        className={`transition border border-dashed rounded-xl p-7 lg:p-10 cursor-pointer
        ${isDragActive ? "border-brand-500 bg-gray-100" : "border-gray-300 bg-gray-50"}`}
        id="excel-upload"
        aria-label="Upload Excel File"
        role="button"
      >
        <input {...getInputProps()} />

        <div className="dz-message flex flex-col items-center text-center">
          <div className="mb-5">
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-accent text-gray-700">
              📄
            </div>
          </div>
          <h4 className="mb-2 font-semibold text-gray-800 text-lg">
            {isDragActive ? "Drop the file here" : "Drag & Drop Excel File Here"}
          </h4>
          <p className="text-sm text-gray-600 mb-2">Supported: .xlsx, .xls</p>
          <span className="font-medium underline text-sm text-brand-500 text-primary">
            Browse File
          </span>
        </div>
      </form>

      {/* File Info */}
      {file && (
        <div className="mt-4 px-4 py-2 bg-green-50 text-green-800 text-sm rounded-md">
          Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
        </div>
      )}
      {/* Upload Button */}
      <div className="mt-4 px-4">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`px-4 py-2 text-sm font-semibold rounded-md text-white transition ${
            (file && !uploading) ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {(uploading) ? 'uploading...':'Upload File'}
        </button>
      </div>


      {/* Success */}
      {message && (
        <div className="mt-4 px-4 py-2 bg-blue-50 text-blue-800 text-sm rounded-md">
          {message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 px-4 py-2 bg-red-100 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      {/* Excel Preview */}
      <h3 className="text-secondary text-2xl">Excel Preview:</h3>
      {previewData.length > 0 && (
        <div className="overflow-x-auto mt-4 border rounded-lg">
          <table className="min-w-full text-sm text-left text-text-main">
            <thead className="bg-accent border-b">
              <tr>
                {previewData[0].map((col, i) => (
                  <th key={i} className="px-4 py-2 font-semibold">{col || `Column ${i + 1}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.slice(1).map((row, ri) => (
                <tr key={ri} className="border-t">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
    </CCard>
  );
};

export default Dropzone;
