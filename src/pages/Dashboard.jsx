import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { rooms, bookings, bookRoom } = useBooking();

  // Filter today's bookings for display
  const todayBookings = bookings.slice(0, 3); // Just show first 3 for simplicity

  return (
    <div className="pt-24 px-margin-mobile md:px-margin-desktop pb-24 w-full max-w-container-max mx-auto h-full overflow-y-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="font-display-lg text-display-lg text-on-surface mb-2">Chào buổi sáng, Alex.</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Bạn có 3 cuộc họp hôm nay. Cuộc họp tiếp theo trong 45 phút nữa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Today's Schedule */}
        <div className="lg:col-span-8">
          <section className="glass-panel rounded-xl p-6">
            <div className="flex justify-between items-end mb-6 border-b border-tech-slate pb-4">
              <div>
                <h3 className="font-headline-md text-headline-md text-primary">Lịch trình hôm nay</h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">HÔM NAY</p>
              </div>
              <button 
                onClick={() => navigate('/schedule')}
                className="text-tech-blue hover:text-primary transition-colors font-label-md text-label-md flex items-center gap-1"
              >
                Xem toàn bộ lịch <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {todayBookings.length === 0 ? (
                <p className="text-on-surface-variant">Không có lịch họp nào hôm nay.</p>
              ) : (
                todayBookings.map((booking, idx) => (
                  <div key={booking.id} className={`flex items-start gap-4 p-4 rounded-DEFAULT border ${booking.status === 'active' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 bg-surface/50'}`}>
                    <div className="flex flex-col items-center min-w-[60px]">
                      <span className={`font-body-lg text-body-lg font-bold ${booking.status === 'active' ? 'text-tech-blue' : 'text-on-surface'}`}>{booking.time}</span>
                      <span className={`font-label-sm text-label-sm ${booking.status === 'active' ? 'text-tech-blue/70' : 'text-on-surface-variant/50'}`}>{booking.period}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-body-md text-body-md font-semibold ${booking.status === 'past' ? 'text-on-surface line-through' : (booking.status === 'active' ? 'text-primary' : 'text-on-surface')}`}>{booking.title}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-on-surface-variant">location_on</span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">{booking.location}</span>
                        </div>
                        {booking.attendees && (
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-on-surface-variant">group</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">{booking.attendees} Người</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {booking.status === 'active' ? (
                      <div className="w-2 h-2 rounded-full bg-tech-emerald shadow-[0_0_8px_rgba(16,185,129,0.6)] mt-2"></div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-surface-variant mt-2"></div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column (Quick Actions & Widgets) */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          {/* Quick Actions */}
          <section className="glass-panel rounded-xl p-6">
            <h3 className="font-headline-md text-headline-md text-primary mb-6">Thao tác nhanh</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-DEFAULT bg-tech-blue/10 border border-tech-blue/30 hover:bg-tech-blue hover:border-tech-blue text-tech-blue hover:text-white transition-all group active:scale-95">
                <span className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform">add_circle</span>
                <span className="font-label-md text-label-md">Đặt ngay</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-DEFAULT bg-transparent border border-tech-slate hover:bg-surface-variant/30 text-on-surface transition-all group active:scale-95">
                <span className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform text-on-surface-variant group-hover:text-primary">person_add</span>
                <span className="font-label-md text-label-md">Mời thành viên</span>
              </button>
            </div>
          </section>

          {/* Mini Map/Location Widget Placeholder */}
          <section className="glass-panel rounded-xl p-6 flex-1 min-h-[200px] relative overflow-hidden flex flex-col justify-end">
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
              <img alt="Office Map" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE9kw8d1pAn3KySOmeXx4oBcGZbZ5F3me_lb1voe_jsOk9fKSq41QkZe9du2cl9aGccttH95zuk982oqZt3M1DD6GWBGxaETHWSVX0JHMrUv8COzmyxPLtPVaCVtEJwj-Jl8xQUxzG9TC7pxFgqSOxyCZmCzB2XFbycrVHcBihDRaj3o6UDOo7CZD0aaMHIc2HczGBjc3SndCkbGxcXlXa6tc_0DQXOtfIPnxRyzI8Lks5h__OW5yczDzDS9nuA06AVXWjLZUsBsI"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent"></div>
            </div>
            <div className="relative z-10">
              <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Vị trí của bạn</h4>
              <p className="font-body-md text-body-md text-primary font-semibold flex items-center gap-2">
                Tầng 42, Cánh Bắc
                <span className="w-2 h-2 rounded-full bg-tech-emerald shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Available Rooms Horizontal Scroll */}
      <section className="mt-gutter">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline-md text-headline-md text-primary">Đang trống ngay lúc này</h3>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-tech-slate flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/30 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-full border border-tech-slate flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/30 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto pb-4 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0 gap-6 snap-x hide-scrollbar">
          {rooms.map(room => (
            <div key={room.id} className="min-w-[280px] max-w-[320px] flex-shrink-0 glass-panel rounded-xl overflow-hidden snap-start group cursor-pointer hover:border-primary transition-colors">
              <div className="h-40 relative overflow-hidden">
                <img alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={room.image}/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-80"></div>
                <div className={`absolute top-3 left-3 backdrop-blur-md px-2 py-1 rounded-DEFAULT border flex items-center gap-1.5 ${room.status === 'Available' ? 'bg-surface-dim/80 border-tech-slate/50' : 'bg-error/80 border-error'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${room.status === 'Available' ? 'bg-tech-emerald shadow-[0_0_4px_rgba(16,185,129,0.6)]' : 'bg-error'}`}></span>
                  <span className="font-label-sm text-label-sm text-on-surface">{room.status === 'Available' ? 'Trống' : 'Đã đặt'}</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-body-lg text-body-lg text-primary font-semibold mb-1">{room.name}</h4>
                <div className="flex items-center justify-between text-on-surface-variant font-label-md text-label-md">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">group</span> Tối đa {room.capacity}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">{room.features === 'Polycom' ? 'videocam' : room.features === 'Smart Board' ? 'tv' : 'wifi_tethering'}</span> {room.features}</span>
                </div>
                <button 
                  onClick={() => bookRoom(room.id)}
                  disabled={room.status !== 'Available'}
                  className={`w-full mt-4 py-2 border rounded-DEFAULT font-label-md text-label-md transition-colors ${room.status === 'Available' ? 'border-tech-blue text-tech-blue hover:bg-tech-blue hover:text-white' : 'border-surface-variant text-surface-variant cursor-not-allowed'}`}
                >
                  {room.status === 'Available' ? 'Đặt ngay lập tức' : 'Không khả dụng'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
