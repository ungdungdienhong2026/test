import React from 'react';
import { useBooking } from '../context/BookingContext';

const MySchedule = () => {
  const { bookings, cancelBooking } = useBooking();
  const upcomingBookings = bookings.filter(b => b.status === 'future' || b.status === 'active');

  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto h-full flex flex-col lg:flex-row gap-gutter">
      {/* Calendar View Section */}
      <section className="flex-1 flex flex-col min-w-0 bg-[#334155]/20 backdrop-blur-[12px] border border-[#334155] rounded-xl overflow-hidden h-full">
        {/* Calendar Header */}
        <div className="p-6 border-b border-[#334155] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Tháng 10 2023</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Tuần 42</p>
          </div>
          <div className="flex items-center gap-2 bg-[#0A0F1C] p-1 border border-[#334155] rounded-lg">
            <button className="px-4 py-1.5 rounded text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">Ngày</button>
            <button className="px-4 py-1.5 rounded bg-[#334155]/50 text-on-surface font-label-md text-label-md shadow-sm">Tuần</button>
            <button className="px-4 py-1.5 rounded text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">Tháng</button>
          </div>
        </div>

        {/* Calendar Grid (Weekly Representation) */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:calc(100%/7)_60px] opacity-20 pointer-events-none"></div>
          
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-4 mb-4 sticky top-0 bg-surface-dim/80 backdrop-blur-md z-10 py-2 border-b border-[#334155]">
            <div className="text-center"><span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">T2</span><span className="font-body-lg text-body-lg text-on-surface">16</span></div>
            <div className="text-center"><span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">T3</span><span className="font-body-lg text-body-lg text-on-surface">17</span></div>
            <div className="text-center"><span className="block font-label-sm text-label-sm text-on-surface-variant uppercase text-primary">T4</span><span className="font-body-lg text-body-lg text-primary font-bold bg-primary/10 w-8 h-8 rounded-full inline-flex items-center justify-center mt-1 border border-primary/30">18</span></div>
            <div className="text-center"><span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">T5</span><span className="font-body-lg text-body-lg text-on-surface">19</span></div>
            <div className="text-center"><span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">T6</span><span className="font-body-lg text-body-lg text-on-surface">20</span></div>
            <div className="text-center"><span className="block font-label-sm text-label-sm text-on-surface-variant uppercase opacity-50">T7</span><span className="font-body-lg text-body-lg text-on-surface opacity-50">21</span></div>
            <div className="text-center"><span className="block font-label-sm text-label-sm text-on-surface-variant uppercase opacity-50">CN</span><span className="font-body-lg text-body-lg text-on-surface opacity-50">22</span></div>
          </div>

          {/* Time Slots & Blocks */}
          <div className="relative min-h-[600px] mt-4 font-label-sm tabular-nums">
            {/* Time lines */}
            <div className="absolute w-full border-t border-[#334155]/30 top-[0px]"></div>
            <span className="absolute -left-2 -top-3 text-on-surface-variant/50 text-xs">09:00</span>
            
            <div className="absolute w-full border-t border-[#334155]/30 top-[60px]"></div>
            <span className="absolute -left-2 top-[48px] text-on-surface-variant/50 text-xs">10:00</span>
            
            <div className="absolute w-full border-t border-[#334155]/30 top-[120px]"></div>
            <span className="absolute -left-2 top-[108px] text-on-surface-variant/50 text-xs">11:00</span>
            
            <div className="absolute w-full border-t border-[#334155]/30 top-[180px]"></div>
            <span className="absolute -left-2 top-[168px] text-on-surface-variant/50 text-xs">12:00</span>

            {/* Blocks Container */}
            <div className="grid grid-cols-7 gap-4 absolute inset-0 pt-[0px] pl-8 pointer-events-none">
              {/* Monday */}
              <div className="relative col-start-1">
                <div className="absolute top-[30px] h-[90px] w-full bg-secondary-container/80 backdrop-blur-sm border-l-2 border-secondary rounded-r p-2 pointer-events-auto hover:brightness-110 transition-all cursor-pointer shadow-sm">
                  <p className="font-label-sm text-label-sm text-on-secondary-container truncate font-bold">Đồng bộ Dự án</p>
                  <p className="text-xs text-on-secondary-container/70">09:30 - 11:00</p>
                  <p className="text-[10px] text-on-secondary-container/50 uppercase mt-1 tracking-wider">Phòng A</p>
                </div>
              </div>
              
              {/* Wednesday */}
              <div className="relative col-start-3">
                <div className="absolute top-[120px] h-[60px] w-full border border-[#3B82F6] bg-[#3B82F6]/5 rounded p-2 pointer-events-auto shadow-[0_0_15px_rgba(59,130,246,0.15)] flex flex-col justify-center items-center cursor-pointer">
                  <span className="material-symbols-outlined text-[#3B82F6] opacity-50">add</span>
                </div>
                <div className="absolute top-[240px] h-[120px] w-full bg-tertiary-container/80 backdrop-blur-sm border-l-2 border-tertiary rounded-r p-2 pointer-events-auto hover:brightness-110 transition-all cursor-pointer shadow-sm">
                  <p className="font-label-sm text-label-sm text-on-tertiary-container truncate font-bold">Gặp khách hàng</p>
                  <p className="text-xs text-on-tertiary-container/70">13:00 - 15:00</p>
                  <p className="text-[10px] text-on-tertiary-container/50 uppercase mt-1 tracking-wider">Phòng lớn</p>
                </div>
              </div>

              {/* Friday */}
              <div className="relative col-start-5">
                <div className="absolute top-[60px] h-[60px] w-full bg-[#1e293b]/80 backdrop-blur-sm border-l-2 border-[#94a3b8] rounded-r p-2 pointer-events-auto hover:brightness-110 transition-all cursor-pointer shadow-sm">
                  <p className="font-label-sm text-label-sm text-on-surface truncate font-bold">Đánh giá 1:1</p>
                  <p className="text-xs text-on-surface-variant">10:00 - 11:00</p>
                  <p className="text-[10px] text-on-surface-variant/50 uppercase mt-1 tracking-wider">Phòng tập trung</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Bookings Side Panel */}
      <aside className="w-full lg:w-80 lg:flex-shrink-0 flex flex-col gap-6 h-full overflow-y-auto">
        <div className="bg-[#334155]/20 backdrop-blur-[12px] border border-[#334155] rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Sắp tới</h3>
            <button className="text-primary hover:text-primary-fixed-dim transition-colors">
              <span className="material-symbols-outlined text-[20px]">more_horiz</span>
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {upcomingBookings.length === 0 ? (
              <p className="text-on-surface-variant text-sm">Không có cuộc họp nào sắp tới.</p>
            ) : (
              upcomingBookings.map((booking) => (
                <div key={booking.id} className="group relative bg-[#0A0F1C] border border-[#334155] p-4 rounded-lg hover:border-primary/50 transition-colors">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => cancelBooking(booking.id)} className="w-6 h-6 rounded flex items-center justify-center bg-[#334155] text-error hover:bg-error/20 transition-colors" title="Hủy phòng">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`w-2 h-2 mt-2 rounded-full ${booking.status === 'active' ? 'bg-secondary shadow-[0_0_8px_rgba(185,199,224,0.6)]' : 'bg-tertiary shadow-[0_0_8px_rgba(222,194,154,0.6)]'}`}></div>
                    <div className="flex-1 pr-6">
                      <h4 className="font-label-md text-label-md text-on-surface font-semibold">{booking.title}</h4>
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1">{booking.location}</p>
                    </div>
                  </div>
                  <div className="pl-5 flex items-center gap-2 text-on-surface-variant text-sm">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>{booking.time} {booking.period}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <button className="w-full mt-6 bg-transparent border border-[#334155] hover:border-primary text-on-surface py-2 rounded-DEFAULT font-label-md text-label-md transition-colors flex justify-center items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">history</span>
            Xem lịch sử đặt phòng
          </button>
        </div>

        {/* Quick Stats Mini Widget */}
        <div className="bg-[#334155]/20 backdrop-blur-[12px] border border-[#334155] rounded-xl p-6 shadow-sm mt-auto">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-4">Tổng kết Tuần</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-display-lg text-display-lg text-on-surface">12<span className="text-xl text-on-surface-variant">h</span></p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Giờ họp</p>
            </div>
            <div>
              <p className="font-display-lg text-display-lg text-primary">{bookings.length}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Phòng đã đặt</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MySchedule;
