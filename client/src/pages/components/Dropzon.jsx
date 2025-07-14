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
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-accent text-secondary">
               <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
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
