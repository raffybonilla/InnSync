export type Booking = {
  hotel: string;
  room: string;
  price: number;
  guests: number;
  checkIn: string;
  checkOut: string;
  payment?: string;
  total?: number;
};

let currentBooking: Booking | null = null;

export const bookingStore = {
  set: (data: Booking | null) => {
    currentBooking = data;
  },

  get: () => currentBooking,

  clear: () => {
    currentBooking = null;
  },
};