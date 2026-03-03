import { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('nyra_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nyra_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };

  const updateBookingStatus = (id, status) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status, ...(status === 'confirmed' ? { confirmedAt: new Date().toISOString() } : {}) } : b))
    );
  };

  const getBookingByProductId = (productId) => {
    return bookings.find(
      b => b.productId === Number(productId) && (b.status === 'pending' || b.status === 'confirmed')
    );
  };

  const getPendingBookings = () => bookings.filter(b => b.status === 'pending');
  const getConfirmedBookings = () => bookings.filter(b => b.status === 'confirmed');

  const deleteBooking = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      updateBookingStatus,
      getBookingByProductId,
      getPendingBookings,
      getConfirmedBookings,
      deleteBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used within BookingProvider');
  return ctx;
}
