import React, { useState, useRef } from 'react';
import { Button } from './Button';

interface FileItem {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error' | 'offline_pending';
}

interface DragDropUploadProps {
  onFilesChange: (files: FileItem[]) => void;
  maxFiles?: number;
  accept?: string;
  isOffline?: boolean;
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({ 
  onFilesChange, 
  maxFiles = 5, 
  accept = "*",
  isOffline = false
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles).slice(0, maxFiles - files.length);
    
    const fileItems: FileItem[] = fileArray.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: isOffline ? 'offline_pending' : 'uploading'
    }));

    const updatedFiles = [...files, ...fileItems];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);

    // Simulate upload process if online
    if (!isOffline) {
      fileItems.forEach(item => {
        simulateUpload(item.id, updatedFiles);
      });
    }
  };

  const simulateUpload = (id: string, currentFiles: FileItem[]) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setFiles(prev => {
        const newArr = prev.map(f => {
          if (f.id === id) {
            if (progress >= 100) return { ...f, progress: 100, status: 'success' as const };
            return { ...f, progress };
          }
          return f;
        });
        onFilesChange(newArr);
        return newArr;
      });

      if (progress >= 100) clearInterval(interval);
    }, 500);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const retryUpload = (id: string) => {
    if (isOffline) return;
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading', progress: 0 } : f));
    simulateUpload(id, files);
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-1 text-sm text-gray-600">
          <span className="font-medium text-blue-600 hover:text-blue-500">Haz clic para seleccionar</span> o arrastra y suelta aquí
        </p>
        <p className="mt-1 text-xs text-gray-500">
          PDF, PNG, JPG, MP4 hasta 25MB
        </p>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept={accept}
          onChange={handleFileInput} 
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-3">
          {files.map(item => (
            <li key={item.id} className="bg-white border rounded-md p-3 shadow-sm flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 truncate">{item.file.name}</span>
                  <span className="text-sm text-gray-500">{(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.status === 'success' ? 'bg-green-500' : 
                      item.status === 'error' ? 'bg-red-500' : 
                      item.status === 'offline_pending' ? 'bg-yellow-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className={
                      item.status === 'success' ? 'text-green-600' : 
                      item.status === 'error' ? 'text-red-600' : 
                      item.status === 'offline_pending' ? 'text-yellow-600' : 'text-blue-600'
                  }>
                    {item.status === 'uploading' && `Subiendo... ${item.progress}%`}
                    {item.status === 'success' && 'Completado'}
                    {item.status === 'error' && 'Error al subir'}
                    {item.status === 'offline_pending' && 'En espera de red'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                {item.status === 'error' && (
                  <button onClick={() => retryUpload(item.id)} className="text-gray-400 hover:text-blue-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
                <button onClick={() => removeFile(item.id)} className="text-gray-400 hover:text-red-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
