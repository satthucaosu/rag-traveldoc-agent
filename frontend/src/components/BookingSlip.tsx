'use client';

import React from 'react';
import { Bookmark, Send, Calendar, Users, MapPin, CheckCircle } from 'lucide-react';
import { BookingSlipState } from '../types';

interface BookingSlipProps {
  state: BookingSlipState;
  onProceed: () => void;
  onClear: () => void;
}

export default function BookingSlip({ state, onProceed, onClear }: BookingSlipProps) {
  const hasSelections = !!(state.vehicle || state.route || state.hotel);

  return (
    <div className="p-4 border-t border-slate-100 bg-white">
      <div className="bg-slate-50 rounded-2xl p-4 border border-indigo-100/50 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg">
              <Bookmark className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight">Draft Booking Slip</span>
          </div>
          {hasSelections && (
            <button 
              onClick={onClear} 
              className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2.5 mb-4">
          <div className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-200">
            <span className="text-xs font-semibold text-slate-400">Vehicle:</span>
            <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]" title={state.vehicle || 'None selected'}>
              {state.vehicle || <span className="text-slate-300 italic font-medium">None</span>}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-200">
            <span className="text-xs font-semibold text-slate-400">Route:</span>
            <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]" title={state.route || 'None selected'}>
              {state.route || <span className="text-slate-300 italic font-medium">None</span>}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-200">
            <span className="text-xs font-semibold text-slate-400">Hotel:</span>
            <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]" title={state.hotel || 'None selected'}>
              {state.hotel || <span className="text-slate-300 italic font-medium">None</span>}
            </span>
          </div>
        </div>

        <button
          onClick={onProceed}
          disabled={!hasSelections}
          className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
            hasSelections
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>PROCEED TO BOOKING</span>
        </button>
      </div>
    </div>
  );
}
