import client from './client';

export const authApi = {
  login: (email, password) => client.post('/auth/login', { email, password }).then((res) => res.data),

  register: ({ fullName, email, password, phone }) =>
    client.post('/auth/register', { fullName, email, password, phone }).then((res) => res.data),

  forgotPassword: (email) => client.post('/auth/forgot-password', { email }).then((res) => res.data),

  resetPassword: ({ email, otp, newPassword }) =>
    client.post('/auth/reset-password', { email, otp, newPassword }).then((res) => res.data),
};

