import client from './client';

export const courtApi = {
  listSports: () => client.get('/sports').then((res) => res.data),

  listCourts: (sportId) =>
    client.get('/courts', { params: sportId ? { sportId } : {} }).then((res) => res.data),

  getCourt: (id) => client.get(`/courts/${id}`).then((res) => res.data),

  createCourt: (payload) => client.post('/courts', payload).then((res) => res.data),

  updateCourt: (id, payload) => client.patch(`/courts/${id}`, payload).then((res) => res.data),

  updateCourtStatus: (id, status) => client.patch(`/courts/${id}/status`, { status }).then((res) => res.data),

  listPrices: (courtId) => client.get(`/courts/${courtId}/prices`).then((res) => res.data),

  createPrice: (courtId, payload) => client.post(`/courts/${courtId}/prices`, payload).then((res) => res.data),

  deletePrice: (priceId) => client.delete(`/courts/prices/${priceId}`).then((res) => res.data),

  listClosures: (courtId) => client.get(`/courts/${courtId}/closures`).then((res) => res.data),

  createClosure: (courtId, payload) => client.post(`/courts/${courtId}/closures`, payload).then((res) => res.data),

  deleteClosure: (closureId) => client.delete(`/courts/closures/${closureId}`).then((res) => res.data),

  listTimeSlots: (courtId) => client.get('/time-slots', { params: { courtId } }).then((res) => res.data),

  createTimeSlot: (courtId, payload) =>
    client.post('/time-slots', payload, { params: { courtId } }).then((res) => res.data),

  deleteTimeSlot: (id) => client.delete(`/time-slots/${id}`).then((res) => res.data),
};

