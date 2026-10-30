import client from './client';

export const userApi = {
  getMe: () => client.get('/users/me').then((res) => res.data),

  updateProfile: (payload) => client.patch('/users/me', payload).then((res) => res.data),

  changePassword: (payload) => client.patch('/users/me/password', payload).then((res) => res.data),

  updateAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return client
      .post('/users/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data);
  },

  listAll: (params) => client.get('/users', { params }).then((res) => res.data),

  createStaff: (payload) => client.post('/users/staff', payload).then((res) => res.data),

  updateStatus: (id, status) => client.patch(`/users/${id}/status`, { status }).then((res) => res.data),
};

