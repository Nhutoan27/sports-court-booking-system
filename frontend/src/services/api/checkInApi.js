import client from './client';

export const checkInApi = {
  checkIn: (bookingId) => client.post('/check-ins', null, { params: { bookingId } }).then((res) => res.data),
};

