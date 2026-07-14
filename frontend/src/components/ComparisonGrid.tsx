'use client';

import React from 'react';
import { X, Scale, FileText, Check, AlertCircle } from 'lucide-react';

interface ComparisonColumn {
  docId: string;
  provider: string;
  filename: string;
  docType: string;
}

interface ComparisonRow {
  field: string;
  values: Record<string, string>; // Maps docId -> value
}

interface ComparisonGridProps {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  onClose: () => void;
  isLoading: boolean;
}

export default function ComparisonGrid({ columns, rows, onClose, isLoading }: ComparisonGridProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 text-indigo-700 p-2 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">Side-by-Side Comparison</h3>
              <p className="text-xs font-semibold text-slate-400">Comparing details extracted from your selected documents</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-slate-500">Extracting structured fields using Gemini...</p>
            </div>
          ) : columns.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-700">No documents selected for comparison</p>
              <p className="text-xs text-slate-400 mt-1">Please close this window and tick checkboxes on verified documents in the right panel.</p>
            </div>
          ) : (
            <div className="border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full border-collapse text-left table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150">
                    <th className="w-1/4 p-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Features</th>
                    {columns.map((col) => (
                      <th key={col.docId} className="p-4 border-l border-slate-150">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 font-extrabold text-[9px] uppercase">
                            {col.docType}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate" title={col.filename}>
                              {col.filename}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                              {col.provider || 'Đơn vị chưa xác định'}
                            </p>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {rows.map((row) => (
                    <tr key={row.field} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 text-xs font-extrabold text-slate-600 bg-slate-50/20">{row.field}</td>
                      {columns.map((col) => {
                        const val = row.values[col.docId];
                        return (
                          <td key={col.docId} className="p-4 border-l border-slate-150 text-xs font-bold text-slate-800 leading-relaxed break-words">
                            {val ? (
                              <div className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                                <span>{val}</span>
                              </div>
                            ) : (
                              <span className="text-slate-300 italic font-medium">Not specified</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
