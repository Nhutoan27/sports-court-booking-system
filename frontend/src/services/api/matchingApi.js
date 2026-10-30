import client from './client';

export const matchingApi = {
  createRequest: (payload) => client.post('/matching/requests', payload).then((res) => res.data),

  listMyRequests: (params) => client.get('/matching/requests/me', { params }).then((res) => res.data),

  cancelRequest: (id) => client.patch(`/matching/requests/${id}/cancel`).then((res) => res.data),

  findCandidates: (requestId) => client.get(`/matching/requests/${requestId}/candidates`).then((res) => res.data),

  sendInvitation: (payload) => client.post('/matching/invitations', payload).then((res) => res.data),

  listReceivedInvitations: (params) => client.get('/matching/invitations/received', { params }).then((res) => res.data),

  listSentInvitations: (params) => client.get('/matching/invitations/sent', { params }).then((res) => res.data),

  acceptInvitation: (id) => client.patch(`/matching/invitations/${id}/accept`).then((res) => res.data),

  rejectInvitation: (id) => client.patch(`/matching/invitations/${id}/reject`).then((res) => res.data),

  cancelInvitation: (id) => client.patch(`/matching/invitations/${id}/cancel`).then((res) => res.data),

  listMyMatches: (params) => client.get('/matching/matches/me', { params }).then((res) => res.data),
};

