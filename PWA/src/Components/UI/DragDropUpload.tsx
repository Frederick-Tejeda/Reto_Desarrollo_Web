import React, { useState, useRef } from 'react';

interface FileItem {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'scanning' | 'success' | 'error' | 'offline_pending';
  metadata: {
    mime: string;
    size: number;
    hash: string;
    author: string;
    deviceDate: string;
    serverDate: string | null;
  };
}

interface DragDropUploadProps {
  onFilesChange?: (files: FileItem[]) => void;
  maxFiles?: number;
  accept?: string;
  isOffline?: boolean;
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({ 
  onFilesChange, 
  maxFiles = 5, 
  accept = "image/*,video/*,application/pdf",
  isOffline = false
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const generateMockHash = () => {
    return Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
  };

  const processFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles).slice(0, maxFiles - files.length);
    
    const fileItems: FileItem[] = fileArray.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: isOffline ? 'offline_pending' : 'uploading',
      metadata: {
        mime: file.type || 'application/octet-stream',
        size: file.size,
        hash: generateMockHash(), // RF-15.4 Hash
        author: 'Tec. Inspector (ID: 4099)',
        deviceDate: new Date().toISOString(),
        serverDate: null
      }
    }));

    const updatedFiles = [...files, ...fileItems];
    setFiles(updatedFiles);
    if(onFilesChange) onFilesChange(updatedFiles);

    if (!isOffline) {
      fileItems.forEach(item => {
        simulateUploadPipeline(item.id);
      });
    }
  };

  const simulateUploadPipeline = (id: string) => {
    let progress = 0;
    
    // 1. Uploading phase
    const interval = setInterval(() => {
      progress += 25;
      setFiles(prev => {
        const newArr = prev.map(f => {
          if (f.id === id) {
            if (progress >= 100) {
              clearInterval(interval);
              setTimeout(() => simulateScanningPhase(id), 500); // Trigger antimalware scan
              return { ...f, progress: 100, status: 'scanning' as const };
            }
            return { ...f, progress, status: 'uploading' as const };
          }
          return f;
        });
        if(onFilesChange) onFilesChange(newArr);
        return newArr;
      });
    }, 400);
  };

  // RF-15.5 Antimalware Institutional
  const simulateScanningPhase = (id: string) => {
    setTimeout(() => {
      setFiles(prev => {
        const newArr = prev.map(f => {
          if (f.id === id) {
            return { 
              ...f, 
              status: 'success' as const,
              metadata: {
                ...f.metadata,
                serverDate: new Date().toISOString()
              }
            };
          }
          return f;
        });
        if(onFilesChange) onFilesChange(newArr);
        return newArr;
      });
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    if(onFilesChange) onFilesChange(updatedFiles);
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
      >
        <svg className="mx-auto h-10 w-10 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-sm text-gray-600 mb-4">Arrastra y suelta evidencias aquí, o selecciona una opción:</p>
        
        <div className="flex justify-center gap-3">
          {/* File Explorer */}
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            📂 Explorar Archivos
          </button>
          
          {/* RF-15.2: Direct Camera Access */}
          <button 
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded shadow-sm text-sm font-medium text-white hover:bg-blue-700"
          >
            📸 Tomar Foto
          </button>
        </div>

        <input type="file" ref={fileInputRef} className="hidden" multiple accept={accept} onChange={(e) => { if(e.target.files) processFiles(e.target.files); }} />
        {/* RF-15.2 capture attribute */}
        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => { if(e.target.files) processFiles(e.target.files); }} />
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-3">
          {files.map(item => (
            <li key={item.id} className="bg-white border rounded-md p-3 shadow-sm flex flex-col">
              
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900 truncate" title={item.file.name}>{item.file.name}</span>
                    <span className="text-xs font-mono text-gray-500">{formatSize(item.metadata.size)}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        item.status === 'success' ? 'bg-green-500' : 
                        item.status === 'scanning' ? 'bg-purple-500 animate-pulse' :
                        item.status === 'offline_pending' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${item.status === 'scanning' ? 100 : item.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={
                        item.status === 'success' ? 'text-green-600' : 
                        item.status === 'scanning' ? 'text-purple-600' :
                        item.status === 'offline_pending' ? 'text-yellow-600' : 'text-blue-600'
                    }>
                      {item.status === 'uploading' && `Subiendo... ${item.progress}%`}
                      {item.status === 'scanning' && 'Escaneando (Antimalware Institucional)...'}
                      {item.status === 'success' && 'Evidencia Asegurada'}
                      {item.status === 'offline_pending' && 'Cifrado local (Pendiente Sincronización)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button onClick={() => setExpandedFile(expandedFile === item.id ? null : item.id)} className="text-xs bg-gray-100 hover:bg-gray-200 border px-2 py-1 rounded text-gray-700 font-medium">
                    {expandedFile === item.id ? 'Ocultar' : 'Metadatos'}
                  </button>
                  <button onClick={() => removeFile(item.id)} className="text-red-400 hover:text-red-600 p-1">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              {/* RF-15.4 Metadatos Acordeon */}
              {expandedFile === item.id && (
                <div className="mt-3 p-3 bg-gray-900 rounded text-gray-300 text-xs font-mono break-all animate-fade-in">
                  <p className="text-blue-400 font-bold mb-1 border-b border-gray-700 pb-1">Trazabilidad Forense (RF-15.4)</p>
                  <p><span className="text-gray-500">MIME_DETECTADO:</span> {item.metadata.mime}</p>
                  <p><span className="text-gray-500">SHA256_HASH:</span> {item.metadata.hash}</p>
                  <p><span className="text-gray-500">AUTOR_SESION:</span> {item.metadata.author}</p>
                  <p><span className="text-gray-500">FECHA_DISPOSITIVO:</span> {item.metadata.deviceDate}</p>
                  <p><span className="text-gray-500">FECHA_SERVIDOR:</span> {item.metadata.serverDate || 'PENDIENTE'}</p>
                  <p><span className="text-gray-500">ESTADO_RED:</span> {isOffline ? 'OFFLINE (Cifrado)' : 'ONLINE (Confirmado)'}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
