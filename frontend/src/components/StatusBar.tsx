'use client';

import React from 'react';
import { Cpu, Wifi, CheckCircle2, Database } from 'lucide-react';

interface StatusBarProps {
  latency: number;
  documentCount: number;
}

export default function StatusBar({ latency, documentCount }: StatusBarProps) {
  return (
    <div className="bg-slate-900 text-slate-400 text-[10.5px] px-5 py-2.5 border-t border-slate-800 flex items-center justify-between shrink-0 font-bold select-none tracking-wide">
      {/* Left side */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 uppercase">Environment:</span>
          <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[9px]">PRODUCTION</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 uppercase">System Latency:</span>
          <span className="text-indigo-300">{latency}ms</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 uppercase">Corpus Size:</span>
          <span className="text-slate-200">{documentCount} Documents</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-emerald-400 flex items-center gap-1 uppercase tracking-widest text-[9.5px]">CONNECTED</span>
        </div>

        <span className="text-slate-600">|</span>

        <div className="text-[10px] text-slate-500 font-medium">
          Powered by <span className="font-extrabold text-indigo-400">@google/genai</span> & Vietnam Intelligence Database
        </div>
      </div>
    </div>
  );
}
