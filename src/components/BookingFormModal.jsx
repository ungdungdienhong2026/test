import React, { useState } from 'react';
import { X, Calendar, Clock, User, Briefcase } from 'lucide-react';

const BookingFormModal = ({ selectedTime, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    department: '',
    startTime: selectedTime || '08:00',
    endTime: selectedTime ? `${parseInt(selectedTime) + 1}:00` : '09:00'
  });

  const timeOptions = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
      <div className="glass-panel rounded-2xl w-full max-w-lg overflow-hidden transform transition-all shadow-2xl">
        <div className="bg-gradient-to-r from-primary to-primary-light p-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="opacity-80" />
            <h2 className="text-xl font-bold tracking-tight">Đặt Phòng Họp</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-full transition-colors backdrop-blur-md">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 bg-white/90">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">Tiêu đề cuộc họp <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="title" 
              required
              placeholder="VD: Họp giao ban tuần" 
              className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5"><User size={16} className="text-primary"/> Tên người đặt <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="name" 
              required
              placeholder="VD: Nguyễn Văn A" 
              className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5"><Briefcase size={16} className="text-primary"/> Phòng ban / Bộ phận <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="department" 
              required
              placeholder="VD: Phòng Marketing" 
              className="w-full border border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex gap-4 p-4 bg-gray-50/80 rounded-xl border border-gray-100">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5"><Clock size={16} className="text-primary"/> Giờ bắt đầu</label>
              <select 
                name="startTime" 
                className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm font-medium"
                value={formData.startTime}
                onChange={handleChange}
              >
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5"><Clock size={16} className="text-primary"/> Giờ kết thúc</label>
              <select 
                name="endTime" 
                className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm font-medium"
                value={formData.endTime}
                onChange={handleChange}
              >
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-2 flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="flex-1 btn-primary py-3 rounded-xl text-base"
            >
              Xác Nhận Đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingFormModal;
