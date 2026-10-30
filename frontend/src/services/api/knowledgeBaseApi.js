import client from './client';

export const knowledgeBaseApi = {
  listAll: ({ page = 0, size = 20 } = {}) =>
    client.get('/knowledge-base', { params: { page, size } }).then((res) => res.data),

  create: (payload) => client.post('/knowledge-base', payload).then((res) => res.data),

  update: (id, payload) => client.patch(`/knowledge-base/${id}`, payload).then((res) => res.data),

  delete: (id) => client.delete(`/knowledge-base/${id}`).then((res) => res.data),
};

