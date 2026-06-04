import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  // Initial Available Rooms
  const [rooms, setRooms] = useState([
    { id: 'alpha', name: 'Boardroom Alpha', capacity: 12, features: 'Polycom', status: 'Available', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb7dau-WeLjFBWSOKH9zgOEGe8SvMYeSuLlg8jmaRwFslpSJRaAAa0kWyKvsN7IEbCnIFyK7n02SNaPALLKwpRXbViKvcn1p6i7Jpc6ngWco3VUTCeePrwWA6XhLLz8vFj7zqiPeYxinDDeHkhz-LoQ-QVCUGDY_aZHNQGy34tJOGNm3qNlGIpk80eXW4EIZhk7V_YUJOQ7htV-k0dukBEr6nGLS6I9o-Q2bIZCAv2lyFlTLwGHFTmsmwrO3rkWYTSU5pCIITincs' },
    { id: 'studio2', name: 'Studio 2', capacity: 4, features: 'Smart Board', status: 'Available', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCImAaG35RtNqqemfTgsTwLs1qOHJo8zEg8jJdyAnalvScMN7kzb9VF5kRAWzniZIQzF2gP3X74t73ZMQqAAqL7UQHNNL2XZu4BF31V2StcB3mpxmUIgBsvr1u4kCnVN_2SbYGcK20h--QlkzvZX5sBfIiwUnzPhM01YNJKBe1nRzU_ZmMswDNm0blS1Oxbcc9RILZaqq5iuuX-qbhzNqk_mveH8DyjX4__nuwWuQfqO0jQDeBv7nUFzcmAq0uUOcMXF4Vjs_T2A0k' },
    { id: 'delta', name: 'Collab Space Delta', capacity: 8, features: 'Whiteboard', status: 'Available', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA56SM5nmka8PQ-7POb6rV9nF5qZhRlwTxJSmCQsDkuwrGg1oXHSWk8jl-fQLykbu4_sfl0N_RWocsC4rz5-NuUWFtQAPHfkisjOwclVurbZEb4Okdju3_ZggM33bg_GxxTI1OlcXj8QMcqDEeIoCbRjpEga596q78993XlSvVe3qcut2K7FqqHZQ06513BieVJggG5uRIi1zfj67M9ksjaLMYlMzUsVAziTZhdCKmZ6MbCkBWJnBWxDHqSjOwmx0d0FU2lSRqRDew' }
  ]);

  // Initial Bookings
  const [bookings, setBookings] = useState([
    { id: 'b1', title: 'Đánh giá hàng quý', location: 'Boardroom Alpha', time: '09:00', period: 'AM', status: 'past', attendees: 8 },
    { id: 'b2', title: 'Thảo luận thiết kế', location: 'Studio 4', time: '11:30', period: 'AM', status: 'active', attendees: 4 },
    { id: 'b3', title: 'Chuẩn bị gặp khách hàng', location: 'Executive Suite', time: '14:00', period: 'PM', status: 'future', attendees: 3 }
  ]);

  const bookRoom = (roomId) => {
    // Find the room
    const roomToBook = rooms.find(r => r.id === roomId);
    if (!roomToBook || roomToBook.status === 'Booked') return;

    // Change room status
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId ? { ...room, status: 'Booked' } : room
      )
    );

    // Create a new booking based on current time (mocking next hour)
    const now = new Date();
    const nextHour = (now.getHours() + 1) % 24;
    const period = nextHour >= 12 ? 'PM' : 'AM';
    const timeDisplay = `${nextHour > 12 ? nextHour - 12 : (nextHour === 0 ? 12 : nextHour)}:00`;

    const newBooking = {
      id: `new-${Date.now()}`,
      title: `Họp tại ${roomToBook.name}`,
      location: roomToBook.name,
      time: timeDisplay,
      period: period,
      status: 'future',
      attendees: 1
    };

    setBookings(prev => [...prev, newBooking].sort((a, b) => {
      // Very simple sorting logic just to put active/future correctly, not a perfect time sort
      if (a.status === 'past') return -1;
      return 1;
    }));
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    // Ideally we would also free up the room, but for this mock we just remove the booking
  };

  return (
    <BookingContext.Provider value={{ rooms, bookings, bookRoom, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
