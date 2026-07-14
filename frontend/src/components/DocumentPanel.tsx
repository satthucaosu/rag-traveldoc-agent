'use client';

import React, { useState, useRef } from 'react';
import { Upload, Search, FileText, Trash2, CheckSquare, Square, RefreshCw, AlertCircle } from 'lucide-react';
import { DocumentRecord } from '../types';

interface DocumentPanelProps {
  documents: DocumentRecord[];
  onUpload: (file: File) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSync: () => Promise<void>;
  isSyncing: boolean;
  selectedDocsForCompare: string[];
  setSelectedDocsForCompare: (docIds: string[]) => void;
}

export default function DocumentPanel({
  documents,
  onUpload,
  onDelete,
  onSync,
  isSyncing,
  selectedDocsForCompare,
  setSelectedDocsForCompare,
}: DocumentPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processUpload(e.target.files[0]);
    }
  };

  const processUpload = async (file: File) => {
    setUploadingFile(file.name);
    setUploadError(null);
    try {
      await onUpload(file);
    } catch (err: any) {
      setUploadError(err.message || 'Lỗi tải tệp lên');
    } finally {
      setUploadingFile(null);
    }
  };

  const toggleCompare = (docId: string) => {
    if (selectedDocsForCompare.includes(docId)) {
      setSelectedDocsForCompare(selectedDocsForCompare.filter(id => id !== docId));
    } else {
      if (selectedDocsForCompare.length >= 3) {
        alert('Chỉ chọn tối đa 3 tài liệu để so sánh');
        return;
      }
      setSelectedDocsForCompare([...selectedDocsForCompare, docId]);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.city && doc.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDocTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'bg-red-50 text-red-600 border-red-100';
      case 'xlsx': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'docx': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-80 bg-white border-l border-slate-100 flex flex-col h-full shrink-0">
      {/* Top Header stats */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="text-xs font-bold text-slate-500">
          Knowledge Base: <span className="text-indigo-600 font-extrabold">{documents.length} Documents</span>
        </div>
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Database'}</span>
        </button>
      </div>

      <div className="p-4 flex flex-col gap-5 overflow-y-auto grow">
        {/* Upload documents */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Upload Documents</h3>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]' 
                : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              className="hidden"
              accept=".pdf,.docx,.xlsx,.md,.txt"
            />
            <div className="bg-slate-50 text-slate-400 w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100 hover:scale-105 transition-transform">
              <Upload className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Drag & drop files here</p>
            <p className="text-[10px] text-slate-400 mt-1">PDF, XLSX, DOCX, MD (max 10MB)</p>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-2.5 inline-block">
              Browse files
            </button>
          </div>

          {uploadingFile && (
            <div className="mt-2.5 p-2 bg-indigo-50/50 rounded-lg flex items-center gap-2 border border-indigo-100/50">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
              <span className="text-xs font-semibold text-slate-600 truncate">Uploading: {uploadingFile}...</span>
            </div>
          )}

          {uploadError && (
            <div className="mt-2.5 p-2 bg-red-50 rounded-lg flex items-center gap-2 border border-red-100 text-red-700">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-semibold truncate">{uploadError}</span>
            </div>
          )}
        </div>

        {/* Verified documents */}
        <div className="flex flex-col grow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Documents</h3>
            {selectedDocsForCompare.length > 0 && (
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                {selectedDocsForCompare.length} selected
              </span>
            )}
          </div>

          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Index..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[220px] pr-1">
            {filteredDocs.length === 0 ? (
              <p className="text-xs font-semibold text-slate-400 italic text-center py-4">No documents found</p>
            ) : (
              filteredDocs.map((doc) => {
                const isSelected = selectedDocsForCompare.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    className={`flex items-start justify-between p-2.5 border rounded-lg transition-all ${
                      isSelected 
                        ? 'border-indigo-200 bg-indigo-50/30' 
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded border shrink-0 font-extrabold text-[9px] uppercase tracking-wide flex items-center justify-center w-8 h-8 ${getDocTypeColor(doc.docType)}`}>
                        {doc.docType}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate" title={doc.originalName}>
                          {doc.originalName}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                          {formatSize(doc.size)} • {doc.city || 'Chưa phân loại'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button
                        onClick={() => toggleCompare(doc.id)}
                        className={`p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition-colors`}
                        title="Compare Document"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                      <button
                        onClick={() => onDelete(doc.id)}
                        className="p-1 hover:bg-red-50 rounded text-slate-300 hover:text-red-500 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
