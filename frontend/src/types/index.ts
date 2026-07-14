export interface DocumentRecord {
  id: string;
  filename: string;
  originalName: string;
  category: 'bus_operator' | 'hotel' | 'markdown_guide' | 'other';
  city: string | null;
  docType: string;
  contentHash: string;
  size: number;
  uploadedAt: string;
  indexedAt: string | null;
}

export interface Citation {
  docId: string;
  filename: string;
  snippet: string;
  chunkIndex: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  hotelCard?: HotelCardInfo | null;
  transportCard?: TransportCardInfo | null;
  timestamp: string;
}

export interface HotelCardInfo {
  name: string;
  priceRange: string;
  starRating: number;
  city: string;
  verified: boolean;
}

export interface TransportCardInfo {
  providers: { name: string; price: string; policy: string }[];
  route: string;
}

export interface BookingSlipState {
  vehicle: string;
  route: string;
  hotel: string;
}

export interface DbStats {
  totalDocuments: number;
  indexedDocuments: number;
  totalChunks: number;
  cities: string[];
  categories: { name: string; count: number }[];
  lastSyncAt: string | null;
}
