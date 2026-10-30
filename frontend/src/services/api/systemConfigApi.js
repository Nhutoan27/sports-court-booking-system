import client from './client';

export const systemConfigApi = {
  getCurrent: () => client.get('/system-config').then((res) => res.data),

  getHistory: () => client.get('/system-config/history').then((res) => res.data),

  create: (payload) => client.post('/system-config', payload).then((res) => res.data),
};

