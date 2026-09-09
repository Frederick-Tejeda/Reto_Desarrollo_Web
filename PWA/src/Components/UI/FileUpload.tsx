import React, { useState, useRef } from 'react';
import { Button } from './Button';

interface FileUploadProps {
  label?: string;
  onUpload: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label = "Carta de Autorización", 
  onUpload,
  accept = "application/pdf,image/jpeg,image/png",
  maxSizeMB = 5
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = (selectedFile: File) => {
    setErrorMessage('');
    
    // Validate size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setStatus('error');
      setErrorMessage(`El archivo supera el límite de ${maxSizeMB}MB.`);
      return;
    }

    setFile(selectedFile);
    simulateUpload(selectedFile);
  };

  const simulateUpload = (selectedFile: File) => {
    setStatus('uploading');
    setProgress(0);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Simulate random error 10% of the time for testing UX
        if (Math.random() > 0.9) {
          setStatus('error');
          setErrorMessage('Error de red al subir el archivo. Intenta de nuevo.');
        } else {
          setStatus('success');
          onUpload(selectedFile);
        }
      }
    }, 500);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (status === 'uploading' || status === 'success') return;
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) processFile(droppedFile);
  };

  const handleRemove = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      {status === 'idle' || (status === 'error' && !file) ? (
        <div 
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors
            ${status === 'error' ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 bg-white'}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600 justify-center">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Selecciona un archivo</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileChange} accept={accept} />
              </label>
              <p className="pl-1 hidden sm:block">o arrástralo aquí</p>
            </div>
            <p className="text-xs text-gray-500">PDF, PNG, JPG hasta {maxSizeMB}MB</p>
          </div>
        </div>
      ) : (
        <div className={`mt-1 border rounded-md p-4 bg-white ${status === 'error' ? 'border-red-300' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{file?.name}</p>
                <p className="text-xs text-gray-500">{(file?.size ? file.size / 1024 / 1024 : 0).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
              {status === 'error' && (
                 <button onClick={() => file && simulateUpload(file)} className="text-sm text-blue-600 hover:text-blue-500 font-medium">Reintentar</button>
              )}
              {status === 'success' && (
                 <span className="text-green-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span>
              )}
              <button onClick={handleRemove} className="text-gray-400 hover:text-gray-500" aria-label="Eliminar archivo">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          {status === 'uploading' && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      )}
      
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};
