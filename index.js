// Constants
const START_HOUR = 8;
const END_HOUR = 18;
const SLOT_DURATION = 30;

// Elements
const datesContainer = document.getElementById('dates-container');
const slotsContainer = document.getElementById('slots-container');
const currentMonthDisplay = document.getElementById('current-month-display');
const nextBtn = document.getElementById('next-btn');
const counterEl = document.getElementById('selected-count');
const monthBtn = document.getElementById('month-btn');
const datePicker = document.getElementById('date-picker');

// State
let selectedDateStr = ''; // YYYY-MM-DD
let selectedSlots = []; // Array of slot strings like "08:00 - 08:30"
let currentListener = null; // Quản lý Firebase listener

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    initCalendar(new Date());
    
    // Gọi lịch khi bấm nút
    monthBtn.addEventListener('click', () => {
        try {
            datePicker.showPicker();
        } catch (e) {
            datePicker.focus();
            datePicker.click();
        }
    });
    
    datePicker.addEventListener('change', (e) => {
        if (e.target.value) {
            initCalendar(new Date(e.target.value));
        }
    });
});

function initCalendar(startDate) {
    const today = startDate || new Date();
    
    // Set current month display
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    currentMonthDisplay.textContent = `${monthNames[today.getMonth()]}, ${today.getFullYear()}`;

    // Generate next 7 days
    datesContainer.innerHTML = '';
    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        
        const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
        const dayStr = dayNames[d.getDay()];
        const dateNum = d.getDate().toString().padStart(2, '0');
        
        // Mặc định chọn ngày đầu tiên
        if (i === 0) selectedDateStr = dateStr;

        const isSelected = (i === 0);
        
        const btn = document.createElement('button');
        btn.className = `date-btn flex-shrink-0 w-20 h-28 glass-card rounded-2xl flex flex-col items-center justify-center gap-2 group transition-all duration-300 ${isSelected ? 'border-primary/50 bg-primary/10 selected-glow' : ''}`;
        btn.innerHTML = `
            <span class="font-label-caps text-label-caps group-hover:text-primary ${isSelected ? 'text-primary' : 'text-on-surface-variant'}">${dayStr}</span>
            <span class="font-display-lg text-headline-lg text-on-surface">${dateNum}</span>
        `;
        
        btn.onclick = () => selectDate(dateStr, btn);
        datesContainer.appendChild(btn);
    }
    
    renderSlots();
}

function selectDate(dateStr, clickedBtn) {
    selectedDateStr = dateStr;
    selectedSlots = []; // Reset selected slots khi đổi ngày
    updateSelectedCounter();
    
    // Update active class on buttons
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.className = 'date-btn flex-shrink-0 w-20 h-28 glass-card rounded-2xl flex flex-col items-center justify-center gap-2 group transition-all duration-300';
        btn.querySelector('span:first-child').className = 'font-label-caps text-label-caps group-hover:text-primary text-on-surface-variant';
    });
    
    clickedBtn.className = 'date-btn flex-shrink-0 w-20 h-28 glass-card rounded-2xl flex flex-col items-center justify-center gap-2 group transition-all duration-300 border-primary/50 bg-primary/10 selected-glow';
    clickedBtn.querySelector('span:first-child').className = 'font-label-caps text-label-caps group-hover:text-primary text-primary';
    
    renderSlots();
}

function generateTimeSlots() {
    const slots = [];
    for (let h = START_HOUR; h < END_HOUR; h++) {
        for (let m = 0; m < 60; m += SLOT_DURATION) {
            const startTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            let nextH = h;
            let nextM = m + SLOT_DURATION;
            if (nextM >= 60) {
                nextH += 1;
                nextM -= 60;
            }
            const endTime = `${nextH.toString().padStart(2, '0')}:${nextM.toString().padStart(2, '0')}`;
            slots.push(`${startTime} - ${endTime}`);
        }
    }
    return slots;
}

function renderSlots() {
    slotsContainer.innerHTML = '';
    const slots = generateTimeSlots();
    
    if (currentListener) {
        currentListener();
    }
    
    currentListener = db.collection('meeting_bookings').doc(selectedDateStr).onSnapshot((doc) => {
        const dayBookings = doc.exists ? doc.data() : {};
        slotsContainer.innerHTML = ''; 
        
        slots.forEach(slot => {
            const isBooked = dayBookings[slot];
            
            if (isBooked) {
                const div = document.createElement('div');
                div.className = 'glass-card rounded-xl py-5 px-6 flex justify-between items-center opacity-50 cursor-pointer border-none hover:opacity-80 transition-soft';
                div.innerHTML = `
                    <span class="font-mono-data text-mono-data text-on-surface-variant line-through italic">${slot}</span>
                    <span class="font-label-caps text-[10px] text-error uppercase border border-error/30 px-2 py-0.5 rounded truncate max-w-[120px]">${isBooked.name || 'Booked'}</span>
                `;
                div.onclick = () => cancelBooking(slot, isBooked.name);
                slotsContainer.appendChild(div);
            } else {
                const btn = document.createElement('button');
                const isSelected = selectedSlots.includes(slot);
                btn.className = `time-slot glass-card rounded-xl py-5 px-6 flex justify-between items-center group time-slot-transition cursor-pointer ${isSelected ? 'selected-glow bg-primary/5 border-primary/40' : 'border-transparent'}`;
                btn.innerHTML = `
                    <span class="font-mono-data text-mono-data ${isSelected ? 'text-primary' : 'text-on-surface group-hover:text-primary'}">${slot}</span>
                    <span class="material-symbols-outlined text-primary transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-[.selected-glow]:opacity-100'}" style="${isSelected ? "font-variation-settings: 'FILL' 1;" : "font-variation-settings: 'FILL' 0;"}">check_circle</span>
                `;
                btn.onclick = () => toggleSlot(btn, slot);
                slotsContainer.appendChild(btn);
            }
        });
    });
}

function toggleSlot(el, slotTime) {
    const isSelected = selectedSlots.includes(slotTime);
    const timeText = el.querySelector('span:first-child');
    const icon = el.querySelector('.material-symbols-outlined');
    
    if (isSelected) {
        // Deselect
        el.classList.remove('selected-glow', 'bg-primary/5', 'border-primary/40');
        el.classList.add('border-transparent');
        timeText.className = 'font-mono-data text-mono-data text-on-surface group-hover:text-primary';
        icon.classList.replace('opacity-100', 'opacity-0');
        icon.style.fontVariationSettings = "'FILL' 0";
        selectedSlots = selectedSlots.filter(s => s !== slotTime);
    } else {
        // Select
        el.classList.remove('border-transparent');
        el.classList.add('selected-glow', 'bg-primary/5', 'border-primary/40');
        timeText.className = 'font-mono-data text-mono-data text-primary';
        icon.classList.replace('opacity-0', 'opacity-100');
        icon.style.fontVariationSettings = "'FILL' 1";
        selectedSlots.push(slotTime);
    }
    
    selectedSlots.sort();
    updateSelectedCounter();
}

function cancelBooking(slotTime, bookerName) {
    const inputName = prompt(`Khung giờ này đã được đặt bởi: ${bookerName}\n\nĐể hủy đặt phòng, vui lòng nhập chính xác tên người đặt:`);
    if (inputName === null) return;
    
    if (inputName.trim().toLowerCase() === bookerName.toLowerCase()) {
        db.collection('meeting_bookings').doc(selectedDateStr).update({
            [slotTime]: firebase.firestore.FieldValue.delete()
        })
            .then(() => {
                alert('Đã hủy lịch đặt phòng thành công!');
            })
            .catch((error) => {
                alert('Có lỗi xảy ra khi hủy: ' + error.message);
            });
    } else {
        alert('Tên không khớp! Chỉ người đặt mới có quyền hủy.');
    }
}

function updateSelectedCounter() {
    if (selectedSlots.length > 0) {
        // Lấy ngày tháng để hiển thị dưới giờ
        const dateObj = new Date(selectedDateStr);
        const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
        const dayStr = dayNames[dateObj.getDay()];
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
        
        let displayStr = selectedSlots.length === 1 ? selectedSlots[0] : `${selectedSlots[0]}... (+${selectedSlots.length-1})`;
        
        counterEl.innerHTML = `
            ${displayStr}
            <span class="w-1 h-1 rounded-full bg-on-surface-variant mx-2 inline-block align-middle"></span>
            <span class="text-body-sm text-on-surface font-normal">${dayStr}, ${formattedDate}</span>
        `;
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        counterEl.innerText = 'Chưa chọn khung giờ';
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

nextBtn.addEventListener('click', () => {
    if (selectedSlots.length === 0) return;
    
    const bookingDraft = {
        date: selectedDateStr,
        slots: selectedSlots
    };
    localStorage.setItem('bookingDraft', JSON.stringify(bookingDraft));
    
    window.location.href = 'booking.html';
});
