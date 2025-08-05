import { Event, Ticket } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Blockchain Summit 2024',
    description: 'The premier blockchain conference featuring industry leaders, developers, and innovators discussing the future of decentralized technology.',
    date: '2024-03-15',
    location: 'San Francisco, CA',
    price: 0.5,
    maxPrice: 0.75,
    totalTickets: 500,
    soldTickets: 342,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    organizer: '0x1234...5678',
    category: 'Technology'
  },
  {
    id: '2',
    title: 'DeFi Music Festival',
    description: 'Experience the intersection of music and decentralized finance with top artists and DeFi protocols.',
    date: '2024-04-20',
    location: 'Miami, FL',
    price: 0.3,
    maxPrice: 0.45,
    totalTickets: 1000,
    soldTickets: 756,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    organizer: '0x9876...4321',
    category: 'Music'
  },
  {
    id: '3',
    title: 'NFT Art Gallery Opening',
    description: 'Exclusive opening of the first physical NFT art gallery featuring works from renowned digital artists.',
    date: '2024-03-28',
    location: 'New York, NY',
    price: 0.2,
    maxPrice: 0.3,
    totalTickets: 200,
    soldTickets: 89,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    organizer: '0x5555...7777',
    category: 'Art'
  },
  {
    id: '4',
    title: 'Web3 Gaming Convention',
    description: 'Discover the future of gaming with blockchain technology, play-to-earn games, and virtual worlds.',
    date: '2024-05-10',
    location: 'Los Angeles, CA',
    price: 0.4,
    maxPrice: 0.6,
    totalTickets: 800,
    soldTickets: 234,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
    organizer: '0x3333...9999',
    category: 'Gaming'
  }
];

export const mockTickets: Ticket[] = [
  {
    id: 't1',
    eventId: '1',
    tokenId: 1001,
    owner: '0x1111...2222',
    purchasePrice: 0.5,
    purchaseDate: '2024-02-15',
    isForSale: false,
    event: mockEvents[0]
  },
  {
    id: 't2',
    eventId: '2',
    tokenId: 1002,
    owner: '0x1111...2222',
    purchasePrice: 0.3,
    purchaseDate: '2024-02-20',
    isForSale: true,
    salePrice: 0.4,
    event: mockEvents[1]
  }
];
