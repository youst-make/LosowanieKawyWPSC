import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a8849dc2`;

interface CoffeeData {
  members: any[];
  history: any[];
  drawnInRound: number[];
}

export const coffeeApi = {
  async getData(): Promise<CoffeeData> {
    const response = await fetch(`${API_BASE}/coffee/data`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  },

  async saveMembers(members: any[]): Promise<void> {
    const response = await fetch(`${API_BASE}/coffee/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ members }),
    });

    if (!response.ok) {
      throw new Error('Failed to save members');
    }
  },

  async saveHistory(history: any[]): Promise<void> {
    const response = await fetch(`${API_BASE}/coffee/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ history }),
    });

    if (!response.ok) {
      throw new Error('Failed to save history');
    }
  },

  async saveDrawnInRound(drawnInRound: number[]): Promise<void> {
    const response = await fetch(`${API_BASE}/coffee/drawn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ drawnInRound }),
    });

    if (!response.ok) {
      throw new Error('Failed to save drawn in round');
    }
  },

  async clearAllData(): Promise<void> {
    const response = await fetch(`${API_BASE}/coffee/data`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to clear data');
    }
  },
};
