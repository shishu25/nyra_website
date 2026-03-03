import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);

  // Real-time listener to Firestore bookings
  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({
        ...d.data(),
        id: d.id
      }));
      setBookings(data);
    }, (error) => {
      console.error('Error fetching bookings:', error);
    });

    return () => unsubscribe();
  }, []);

  const addBooking = async (booking) => {
    try {
      const newBooking = {
        ...booking,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'bookings'), newBooking);
      return { ...newBooking, id: docRef.id };
    } catch (e) {
      console.error('Error adding booking:', e);
      throw e;
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const updates = { status };
      if (status === 'confirmed') {
        updates.confirmedAt = new Date().toISOString();
      }
      await updateDoc(doc(db, 'bookings', String(id)), updates);
    } catch (e) {
      console.error('Error updating booking:', e);
    }
  };

  const getBookingByProductId = (productId) => {
    return bookings.find(
      b => b.productId === String(productId) && (b.status === 'pending' || b.status === 'confirmed')
    );
  };

  const getPendingBookings = () => bookings.filter(b => b.status === 'pending');
  const getConfirmedBookings = () => bookings.filter(b => b.status === 'confirmed');

  const deleteBooking = async (id) => {
    try {
      await deleteDoc(doc(db, 'bookings', String(id)));
    } catch (e) {
      console.error('Error deleting booking:', e);
    }
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
