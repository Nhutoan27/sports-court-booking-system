import client from './client';

export const chatApi = {
  createSession: () => client.post('/chat/sessions').then((res) => res.data),

  listMessages: (sessionId, token, params) =>
    client.get(`/chat/sessions/${sessionId}/messages`, { params: { ...params, token } }).then((res) => res.data),

  sendMessage: (sessionId, token, content) =>
    client.post(`/chat/sessions/${sessionId}/messages`, { content }, { params: { token } }).then((res) => res.data),
};

