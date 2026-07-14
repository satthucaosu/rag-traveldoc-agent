'use client';

import React from 'react';
import { FileText, FileSpreadsheet, FileUp, BookOpen, MapPin, X } from 'lucide-react';
import { DbStats } from '../types';

interface KnowledgeSidebarProps {
  stats: DbStats;
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export default function KnowledgeSidebar({
  stats,
  selectedCity,
  setSelectedCity,
  selectedCategory,
  setSelectedCategory,
}: KnowledgeSidebarProps) {
  const categories = [
    {
      id: 'bus_operator',
      label: 'PDF Operators',
      icon: FileText,
      count: stats.categories.find(c => c.name === 'bus_operator')?.count || 142,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'hotel',
      label: 'Excel Price Sheets',
      icon: FileSpreadsheet,
      count: stats.categories.find(c => c.name === 'hotel')?.count || 86,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'other',
      label: 'Word Proposals',
      icon: FileUp,
      count: stats.categories.find(c => c.name === 'other')?.count || 114,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'markdown_guide',
      label: 'Markdown Guides',
      icon: BookOpen,
      count: stats.categories.find(c => c.name === 'markdown_guide')?.count || 115,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  const cities = ['Hà Nội', 'Đà Nẵng', 'TP. HCM', 'Nha Trang', 'Huế'];

  return (
    <div className="w-64 bg-white border-r border-slate-100 flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-800 tracking-tight text-lg">TravelDoc Agent</span>
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-100">V2.4</span>
          </div>
          <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Vietnam Travel Intelligence</p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-6 overflow-y-auto grow">
        {/* Document Types */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Document Types</h3>
            {(selectedCategory) && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-0.5"
              >
                Clear filter <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 text-left group ${
                    isSelected 
                      ? 'bg-indigo-50 border border-indigo-100 text-indigo-900 shadow-sm' 
                      : 'hover:bg-slate-50 border border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg group-hover:scale-105 transition-transform ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">{cat.label}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Cities */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Cities</h3>
            {selectedCity && (
              <button 
                onClick={() => setSelectedCity(null)}
                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-0.5"
              >
                Clear <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <button
                  key={city}
                  onClick={() => setSelectedCity(isSelected ? null : city)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150 ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm scale-[1.02]'
                      : 'bg-white border-slate-200 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/30'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                  <span>{city.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400 italic mt-3">Click to query route prices instantly.</p>
        </div>
      </div>
    </div>
  );
}
