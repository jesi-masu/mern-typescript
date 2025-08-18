
import { AdminUser } from '@/types/admin';

// Mock users for demo
export const DEMO_USERS: AdminUser[] = [
  {
    id: '1',
    email: 'admin@prefabplus.com',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'personnel@prefabplus.com',
    name: 'Personnel User',
    role: 'personnel'
  }
];

export const DEMO_PASSWORDS: Record<string, string> = {
  'admin@prefabplus.com': 'admin123',
  'personnel@prefabplus.com': 'personnel123'
};
