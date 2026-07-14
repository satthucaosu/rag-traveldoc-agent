'use client';

import React, { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';
import KnowledgeSidebar from '../components/KnowledgeSidebar';
import DocumentPanel from '../components/DocumentPanel';
import ChatRoom from '../components/ChatRoom';
import BookingSlip from '../components/BookingSlip';
import StatusBar from '../components/StatusBar';
import ComparisonGrid from '../components/ComparisonGrid';
import { DocumentRecord, ChatMessage, DbStats, BookingSlipState } from '../types';
import * as api from '../lib/api';

export default function Home() {
  // Filters & Documents
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [stats, setStats] = useState<DbStats>({
    totalDocuments: 0,
    indexedDocuments: 0,
    totalChunks: 0,
    cities: [],
    categories: [],
    lastSyncAt: null,
  });

  // Selection & Actions
  const [selectedDocsForCompare, setSelectedDocsForCompare] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareData, setCompareData] = useState<{ columns: any[]; rows: any[] }>({ columns: [], rows: [] });

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Booking Slip
  const [bookingState, setBookingState] = useState<BookingSlipState>({
    vehicle: '',
    route: '',
    hotel: '',
  });

  // Performance / Metadata
  const [latency, setLatency] = useState<number>(218);

  // Initial Load
  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(7));
    fetchInitialData();
  }, []);

  // Reload when filters change
  useEffect(() => {
    loadDocuments();
  }, [selectedCity, selectedCategory]);

  const fetchInitialData = async () => {
    try {
      const statsData = await api.getDbStats();
      setStats(statsData);
      await loadDocuments();
      setSuggestions([
        'So sánh giá xe Đà Nẵng – Hội An',
        'Limousine Hà Nội đi Hạ Long',
        'Sài Gòn đi Vũng Tàu',
        'Đón sân bay Cam Ranh về Nha Trang'
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const docs = await api.getDocuments({
        city: selectedCity || undefined,
        category: selectedCategory || undefined,
      });
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  // Upload handler
  const handleUpload = async (file: File) => {
    const start = Date.now();
    await api.uploadDocument(file);
    setLatency(Date.now() - start);
    // Reload data
    await fetchInitialData();
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    const ok = await api.deleteDocument(id);
    if (ok) {
      // Unselect if it was selected for compare
      setSelectedDocsForCompare(selectedDocsForCompare.filter(dId => dId !== id));
      await fetchInitialData();
    }
  };

  // Sync handler
  const handleSync = async () => {
    setIsSyncing(true);
    const start = Date.now();
    try {
      await api.syncDatabase();
      setLatency(Date.now() - start);
      await fetchInitialData();
    } catch (error) {
      console.error('Error syncing database:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Send message handler
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoadingChat(true);

    const start = Date.now();
    try {
      const res = await api.sendMessage(text, sessionId, {
        city: selectedCity || undefined,
        category: selectedCategory || undefined,
      });
      setLatency(Date.now() - start);

      // Detect hotel recommendation card mock
      let hotelCard = null;
      if (text.toLowerCase().includes('metropole') || res.answer.toLowerCase().includes('metropole')) {
        hotelCard = {
          name: 'Sofitel Legend Metropole Hanoi',
          priceRange: '5.500.000 VND',
          starRating: 5,
          city: 'Hà Nội',
          verified: true
        };
      } else if (text.toLowerCase().includes('reverie') || res.answer.toLowerCase().includes('reverie')) {
        hotelCard = {
          name: 'The Reverie Saigon',
          priceRange: '4.800.000 VND',
          starRating: 5,
          city: 'TP. HCM',
          verified: true
        };
      }

      // Detect transport recommendation card mock
      let transportCard = null;
      if (text.toLowerCase().includes('cam ranh') || text.toLowerCase().includes('nha trang')) {
        transportCard = {
          route: 'Cam Ranh to Nha Trang',
          providers: [
            { name: 'Hoàng Long Limo', price: '180.000 VND/vé', policy: 'Hỗ trợ đón tận nơi' },
            { name: 'Cúc Tùng Limousine', price: '200.000 VND/vé', policy: 'Không hoàn hủy' }
          ]
        };
      } else if (text.toLowerCase().includes('vũng tàu') || text.toLowerCase().includes('sài gòn')) {
        transportCard = {
          route: 'SGN to Vung Tau',
          providers: [
            { name: 'Hoa Mai Limousine', price: '200.000 VND/vé', policy: 'Hỗ trợ trung chuyển' },
            { name: 'Toàn Thắng Limo', price: '190.000 VND/vé', policy: 'Cancel 1h free' }
          ]
        };
      }

      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: res.answer,
        citations: res.citations,
        hotelCard,
        transportCard,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
      setSuggestions(res.suggestions || []);
    } catch (error) {
      console.error('Error sending chat message:', error);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Compare handler
  const handleCompare = async () => {
    if (selectedDocsForCompare.length < 2) {
      alert('Vui lòng chọn ít nhất 2 tài liệu để so sánh');
      return;
    }
    setCompareModalOpen(true);
    setCompareLoading(true);
    try {
      const data = await api.compareDocuments(selectedDocsForCompare);
      setCompareData(data);
    } catch (error) {
      console.error('Error comparing documents:', error);
      // Fallback/Mock data for compare
      setTimeout(() => {
        const mockCols = selectedDocsForCompare.map(id => {
          const doc = documents.find(d => d.id === id);
          return {
            docId: id,
            filename: doc?.originalName || 'Document.pdf',
            provider: doc?.category === 'bus_operator' ? 'Nhà xe Limousine' : 'Khách sạn',
            docType: doc?.docType || 'pdf'
          };
        });

        const mockRows = [
          { field: 'Price', values: Object.fromEntries(selectedDocsForCompare.map((id, idx) => [id, idx === 0 ? '260,000 VND/vé' : '240,000 VND/vé'])) },
          { field: 'Route', values: Object.fromEntries(selectedDocsForCompare.map((id, idx) => [id, 'Hà Nội đi Hạ Long'])) },
          { field: 'Cancellation Policy', values: Object.fromEntries(selectedDocsForCompare.map((id, idx) => [id, idx === 0 ? 'Chọn ghế trước' : 'Không hoàn huỷ'])) },
          { field: 'Hotline', values: Object.fromEntries(selectedDocsForCompare.map((id) => [id, '1900 6789'])) },
        ];

        setCompareData({ columns: mockCols, rows: mockRows });
      }, 1000);
    } finally {
      setCompareLoading(false);
    }
  };

  // Booking handlers
  const handleSelectHotel = (hotelName: string) => {
    setBookingState(prev => ({ ...prev, hotel: hotelName }));
  };

  const handleSelectVehicle = (vehicleName: string, route: string) => {
    setBookingState(prev => ({ ...prev, vehicle: vehicleName, route }));
  };

  const handleProceedBooking = () => {
    alert(`Proceeding to book:\nVehicle: ${bookingState.vehicle}\nRoute: ${bookingState.route}\nHotel: ${bookingState.hotel}`);
  };

  const handleClearBooking = () => {
    setBookingState({ vehicle: '', route: '', hotel: '' });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans antialiased text-slate-800">
      
      {/* 3-Column main layout */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        
        {/* Sidebar Left: filters */}
        <KnowledgeSidebar
          stats={stats}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Center: Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-slate-100 bg-white">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Grounded AI Chat Room</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </h2>
            
            {/* Compare Trigger button if docs selected */}
            {selectedDocsForCompare.length >= 2 && (
              <button
                onClick={handleCompare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Selected ({selectedDocsForCompare.length})</span>
              </button>
            )}
          </div>

          <ChatRoom
            messages={messages}
            onSendMessage={handleSendMessage}
            suggestions={suggestions}
            isLoading={isLoadingChat}
            onSelectHotel={handleSelectHotel}
            onSelectVehicle={handleSelectVehicle}
          />
        </div>

        {/* Sidebar Right: Documents & Booking */}
        <div className="w-80 flex flex-col h-full bg-white shrink-0 border-l border-slate-100">
          <DocumentPanel
            documents={documents}
            onUpload={handleUpload}
            onDelete={handleDelete}
            onSync={handleSync}
            isSyncing={isSyncing}
            selectedDocsForCompare={selectedDocsForCompare}
            setSelectedDocsForCompare={setSelectedDocsForCompare}
          />
          <BookingSlip
            state={bookingState}
            onProceed={handleProceedBooking}
            onClear={handleClearBooking}
          />
        </div>

      </div>

      {/* Footer Status Bar */}
      <StatusBar latency={latency} documentCount={stats.totalDocuments} />

      {/* Comparison Grid Modal */}
      {compareModalOpen && (
        <ComparisonGrid
          columns={compareData.columns}
          rows={compareData.rows}
          onClose={() => setCompareModalOpen(false)}
          isLoading={compareLoading}
        />
      )}

    </div>
  );
}
