import client from './client';

export const bookingApi = {
  listMine: (params) => client.get('/bookings/me', { params }).then((res) => res.data),

  create: (payload) => client.post('/bookings', payload).then((res) => res.data),

  getById: (id) => client.get(`/bookings/${id}`).then((res) => res.data),

  cancel: (id) => client.post(`/bookings/${id}/cancel`).then((res) => res.data),

  availability: (courtId, playDate) =>
    client.get('/bookings/availability', { params: { courtId, playDate } }).then((res) => res.data),

  listAll: (params) => client.get('/bookings', { params }).then((res) => res.data),

  markNoShow: (id) => client.post(`/bookings/${id}/no-show`).then((res) => res.data),
};

