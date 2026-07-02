export type UserRole = 'client' | 'pharmacist';

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  pharmacyName?: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: string;
}

export interface ProductRequest {
  id: string;
  clientUid: string;
  productName: string;
  normalizedProductName: string;
  status: 'pending' | 'resolved' | 'expired';
  createdAt: string;
  // Optional client metadata if we store it
  clientName?: string;
  clientPhone?: string;
}

export interface ProductResponse {
  id: string;
  requestId: string;
  pharmacistUid: string;
  pharmacyName: string;
  pharmacyPhone?: string;
  pharmacyAddress?: string;
  available: boolean;
  price?: number;
  note?: string;
  createdAt: string;
}
