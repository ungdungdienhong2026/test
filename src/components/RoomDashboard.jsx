import React, { useState } from 'react';
import { Calendar, Clock, Users, Video, Plus, MapPin } from 'lucide-react';
import BookingFormModal from './BookingFormModal';

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

const initialBookings = [
  { id: 1, startTime: '09:00', endTime: '11:00', title: 'Họp Giao Ban', name: 'Nguyễn Văn A', department: 'Ban Giám Đốc' },
  { id: 2, startTime: '14:00', endTime: '15:00', title: 'Phỏng vấn Nhân sự', name: 'Trần Thị B', department: 'Phòng HR' }
];

const RoomDashboard = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const isSlotBooked = (time) => {
    return bookings.find(b => {
      const bStart = parseInt(b.startTime);
      const bEnd = parseInt(b.endTime);
      const current = parseInt(time);
      return current >= bStart && current < bEnd;
    });
  };

  const handleSlotClick = (time) => {
    if (isSlotBooked(time)) return;
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const handleBook = (formData) => {
    const newBooking = {
      id: Date.now(),
      ...formData
    };
    setBookings([...bookings, newBooking]);
    setIsModalOpen(false);
    setSelectedTime(null);
  };

  const currentSlot = isSlotBooked('10:00'); 
  const roomStatus = currentSlot ? 'ĐANG SỬ DỤNG' : 'ĐANG TRỐNG';
  const statusColor = currentSlot ? 'bg-red-500' : 'bg-primary';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 pb-20 font-sans">
      {/* Premium Header */}
      <header className="bg-gradient-to-r from-primary to-primary-light text-white p-5 shadow-lg sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-primary rounded-xl flex items-center justify-center font-black text-xl shadow-inner">
              C
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight">CorpSpace</h1>
              <p className="text-primary-100 text-xs font-medium opacity-90">Meeting Room Booking</p>
            </div>
          </div>
          <div className="text-sm bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 font-medium border border-white/10 shadow-sm">
            <Calendar size={18} /> Hôm nay, 22/05/2026
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full p-4 mt-6 flex flex-col gap-8">
        
        {/* Hero Section */}
        <section className="glass-card rounded-3xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-[55%] h-72 md:h-auto relative">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&h=800" 
              alt="Phòng họp chính" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
            
            <div className={`absolute top-5 left-5 ${statusColor} text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm`}>
              {currentSlot ? <Clock size={16} /> : <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>}
              {roomStatus}
            </div>
            
            <div className="absolute bottom-5 left-5 text-white">
              <h2 className="text-3xl font-extrabold drop-shadow-md">Phòng Họp Chính</h2>
              <div className="flex items-center gap-1.5 mt-1 opacity-90 text-sm font-medium">
                <MapPin size={16} /> Tầng 3, Tòa nhà Alpha
              </div>
            </div>
          </div>
          
          <div className="p-8 md:w-[45%] flex flex-col justify-between bg-white">
            <div>
              <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full mb-4">
                Premium Space
              </div>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Không gian chuyên nghiệp dành cho các cuộc họp quan trọng, thuyết trình và hội thảo nội bộ. Trang bị đầy đủ ánh sáng tự nhiên và thiết bị tối tân.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-primary">
                    <Users size={20} /> 
                  </div>
                  <span className="font-medium text-sm">Sức chứa: 10-15 người</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-primary">
                    <Video size={20} /> 
                  </div>
                  <span className="font-medium text-sm">TV 85" & Hệ thống âm thanh</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => { setSelectedTime(null); setIsModalOpen(true); }}
              className="w-full btn-primary py-4 rounded-2xl text-lg flex justify-center items-center gap-2"
            >
              <Plus size={22} /> ĐẶT PHÒNG NGAY
            </button>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="glass-card rounded-3xl p-8 bg-white">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Clock className="text-primary" size={24} /> Lịch Trình Hôm Nay
            </h3>
            <div className="flex gap-5 text-sm font-semibold text-gray-600">
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-gray-50 rounded-md border border-gray-200 shadow-inner"></span> Trống</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-red-100 border border-red-200 rounded-md shadow-inner"></span> Đã đặt</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {timeSlots.map(time => {
              const bookedSlot = isSlotBooked(time);
              const isStart = bookedSlot && bookedSlot.startTime === time;
              
              return (
                <div key={time} className="flex h-16 group">
                  <div className="w-20 shrink-0 flex items-center justify-end pr-5 text-sm font-bold text-gray-400">
                    {time}
                  </div>
                  
                  {bookedSlot ? (
                    <div className="flex-1 relative p-1">
                      {isStart && (
                        <div className="absolute top-1 bottom-0 left-1 right-1 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-xl p-4 z-10 shadow-md overflow-hidden border-l-4 border-l-red-500 transition-all hover:shadow-lg"
                             style={{ height: `calc(${parseInt(bookedSlot.endTime) - parseInt(bookedSlot.startTime)} * 4.5rem - 0.5rem)` }}>
                          <h4 className="font-extrabold text-red-900 text-base mb-1">{bookedSlot.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-red-700 font-medium opacity-90">
                            <span className="bg-red-200/50 px-2 py-0.5 rounded-md">{bookedSlot.department}</span>
                            <span>•</span>
                            <span>{bookedSlot.name}</span>
                          </div>
                          <div className="absolute top-4 right-4 bg-white/60 text-red-600 px-2 py-1 rounded-lg text-xs font-bold border border-red-100 shadow-sm">
                            {bookedSlot.startTime} - {bookedSlot.endTime}
                          </div>
                        </div>
                      )}
                      <div className="w-full h-full bg-red-50/40 rounded-xl border border-red-100/50"></div>
                    </div>
                  ) : (
                    <div className="flex-1 p-1">
                      <div 
                        onClick={() => handleSlotClick(time)}
                        className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-green-50 hover:border-primary hover:text-primary hover:shadow-inner text-sm font-bold"
                      >
                        <Plus size={18} className="mr-1" /> Bấm để đặt giờ này
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {isModalOpen && (
        <BookingFormModal 
          selectedTime={selectedTime}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleBook}
        />
      )}
    </div>
  );
};

export default RoomDashboard;
