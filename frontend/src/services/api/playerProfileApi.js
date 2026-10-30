import client from './client';

export const playerProfileApi = {
  getMine: () => client.get('/player-profiles/me').then((res) => res.data),

  upsertMine: (payload) => client.patch('/player-profiles/me', payload).then((res) => res.data),
};

