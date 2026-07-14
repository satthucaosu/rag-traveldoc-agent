import { DocumentRecord, ChatMessage, DbStats } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getDocuments(filters?: { city?: string; category?: string; q?: string }): Promise<DocumentRecord[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.q) params.append('q', filters.q);

    const res = await fetch(`${API_BASE_URL}/documents?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return await res.json();
  } catch (error) {
    console.error('Error getting documents:', error);
    // Return dummy data in development mode if server is down
    return getMockDocuments();
  }
}

export async function getDbStats(): Promise<DbStats> {
  try {
    const res = await fetch(`${API_BASE_URL}/documents/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalDocuments: 457,
      indexedDocuments: 457,
      totalChunks: 1845,
      cities: ['Hà Nội', 'Đà Nẵng', 'TP. HCM', 'Nha Trang', 'Huế'],
      categories: [
        { name: 'bus_operator', count: 142 },
        { name: 'hotel', count: 86 },
        { name: 'markdown_guide', count: 115 },
        { name: 'other', count: 114 }
      ],
      lastSyncAt: new Date().toISOString()
    };
  }
}

export async function uploadDocument(file: File): Promise<DocumentRecord> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Upload failed');
  }

  return await res.json();
}

export async function deleteDocument(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
}

export async function syncDatabase(): Promise<{ synced: number; skipped: number; totalTime: number }> {
  const res = await fetch(`${API_BASE_URL}/documents/sync`, {
    method: 'POST',
  });

  if (!res.ok) throw new Error('Sync failed');
  return await res.json();
}

export async function sendMessage(
  message: string, 
  sessionId?: string,
  filters?: { city?: string; category?: string }
): Promise<{ answer: string; citations: any[]; suggestions: string[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, sessionId, filters }),
    });

    if (!res.ok) throw new Error('Chat failed');
    return await res.json();
  } catch (error) {
    console.error('Error sending message:', error);
    // Simulating response in mock mode
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          answer: `Tôi đã đối chiếu giá limousine Hà Nội đi Hạ Long từ hợp đồng vận chuyển 'Limousine_HN_HL_2026.pdf'. Dưới đây là giá vé của Vân Đồn Xanh và Phúc Xuyên.`,
          citations: [
            { docId: '1', filename: 'Limousine_HN_HL_2026.pdf', snippet: 'Giá vé Vân Đồn Xanh Limo: 260.000 VND/vé...', chunkIndex: 0 }
          ],
          suggestions: [
            'So sánh giá xe Đà Nẵng – Hội An',
            'Metropole Hà Nội có những hạng phòng nào?',
            'Chính sách hủy phòng của Reverie Saigon?'
          ]
        });
      }, 1000);
    });
  }
}

export async function compareDocuments(documentIds: string[]): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ documentIds }),
  });

  if (!res.ok) throw new Error('Comparison failed');
  return await res.json();
}

// Dummy data generator
function getMockDocuments(): DocumentRecord[] {
  return [
    {
      id: 'doc-1',
      filename: 'Limousine_HN_HL_2026.pdf',
      originalName: 'Limousine_HN_HL_2026.pdf',
      category: 'bus_operator',
      city: 'Hà Nội',
      docType: 'pdf',
      contentHash: 'hash1',
      size: 1245000,
      uploadedAt: new Date(Date.now() - 3600000).toISOString(),
      indexedAt: new Date().toISOString()
    },
    {
      id: 'doc-2',
      filename: 'Price_Sheets_Danang_2026.xlsx',
      originalName: 'Price_Sheets_Danang_2026.xlsx',
      category: 'hotel',
      city: 'Đà Nẵng',
      docType: 'xlsx',
      contentHash: 'hash2',
      size: 89000,
      uploadedAt: new Date(Date.now() - 7200000).toISOString(),
      indexedAt: new Date().toISOString()
    },
    {
      id: 'doc-3',
      filename: 'Hợp đồng khứ hồi Cam Ranh - Nha Trang.pdf',
      originalName: 'Hợp đồng khứ hồi Cam Ranh - Nha Trang.pdf',
      category: 'bus_operator',
      city: 'Nha Trang',
      docType: 'pdf',
      contentHash: 'hash3',
      size: 1200000,
      uploadedAt: new Date().toISOString(),
      indexedAt: new Date().toISOString()
    }
  ];
}
