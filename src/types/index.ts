export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  maxPrice: number;
  totalTickets: number;
  soldTickets: number;
  image: string;
  organizer: string;
  category: string;
  receiverWallet: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  tokenId: number;
  owner: string;
  purchasePrice: number;
  purchaseDate: string;
  isForSale: boolean;
  salePrice?: number;
  event: Event;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
}

export interface AIRecommendation {
  eventId: string;
  score: number;
  reason: string;
}
