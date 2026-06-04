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
const datePicker = document.getElementById('date-picker');

// State
let selectedDateStr = ''; // YYYY-MM-DD
let selectedSlots = []; // Array of slot strings like "08:00 - 08:30"
let currentListener = null; // Quản lý Firebase listener

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    initCalendar(new Date());
    
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
    currentMonthDisplay.textContent = monthNames[today.getMonth()];

    // Generate next 7 days
    datesContainer.innerHTML = '';
    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        
        const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
        const dayStr = dayNames[d.getDay()];
        const dateNum = d.getDate();
        
        // Mặc định chọn ngày đầu tiên
        if (i === 0) selectedDateStr = dateStr;

        const isSelected = (i === 0);
        
        const btn = document.createElement('button');
        btn.className = `date-btn flex-shrink-0 w-[64px] h-[80px] flex flex-col items-center justify-center rounded-xl transition-soft ${isSelected ? 'bg-primary text-on-primary shadow-md' : 'bg-white border border-outline-variant text-on-surface hover:border-primary'}`;
        btn.innerHTML = `
            <span class="text-label-md font-label-md ${isSelected ? 'opacity-80' : 'text-on-surface-variant'}">${dayStr}</span>
            <span class="text-title-md font-title-md">${dateNum}</span>
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
        btn.className = 'date-btn flex-shrink-0 w-[64px] h-[80px] flex flex-col items-center justify-center rounded-xl transition-soft bg-white border border-outline-variant text-on-surface hover:border-primary';
        btn.querySelector('span:first-child').className = 'text-label-md font-label-md text-on-surface-variant';
    });
    
    clickedBtn.className = 'date-btn flex-shrink-0 w-[64px] h-[80px] flex flex-col items-center justify-center rounded-xl transition-soft bg-primary text-on-primary shadow-md';
    clickedBtn.querySelector('span:first-child').className = 'text-label-md font-label-md opacity-80';
    
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
    
    // Gỡ listener cũ nếu có để tránh trùng lặp
    if (currentListener) {
        currentListener();
    }
    
    // Lắng nghe dữ liệu từ Firestore
    currentListener = db.collection('meeting_bookings').doc(selectedDateStr).onSnapshot((doc) => {
        const dayBookings = doc.exists ? doc.data() : {};
        slotsContainer.innerHTML = ''; // Clear lại khi có data mới
        
        slots.forEach(slot => {
            const isBooked = dayBookings[slot];
            
            if (isBooked) {
                // Render booked slot
                const btn = document.createElement('button');
                btn.className = 'p-4 rounded-xl bg-tertiary-fixed border border-tertiary text-tertiary font-title-md flex flex-col items-center justify-center transition-soft hover:opacity-80 hover:shadow-md cursor-pointer';
                btn.innerHTML = `
                    ${slot}
                    <span class="text-label-md font-label-md mt-1 truncate w-full text-center">Bởi: ${isBooked.name || 'Người khác'}</span>
                `;
                btn.onclick = () => cancelBooking(slot, isBooked.name);
                slotsContainer.appendChild(btn);
            } else {
                // Render available slot
                const btn = document.createElement('button');
                const isSelected = selectedSlots.includes(slot);
                btn.className = `slot-chip p-4 rounded-xl font-title-md flex flex-col items-center justify-center transition-soft hover:shadow-md border ${isSelected ? 'bg-primary text-on-primary border-primary' : 'bg-white text-secondary border-secondary'}`;
                btn.textContent = slot;
                btn.onclick = () => toggleSlot(btn, slot);
                slotsContainer.appendChild(btn);
            }
        });
    });
}

function toggleSlot(el, slotTime) {
    const isSelected = el.classList.contains('bg-primary');
    
    if (isSelected) {
        // Deselect
        el.classList.remove('bg-primary', 'text-on-primary', 'border-primary');
        el.classList.add('bg-white', 'text-secondary', 'border-secondary');
        selectedSlots = selectedSlots.filter(s => s !== slotTime);
    } else {
        // Select
        el.classList.remove('bg-white', 'text-secondary', 'border-secondary');
        el.classList.add('bg-primary', 'text-on-primary', 'border-primary');
        selectedSlots.push(slotTime);
    }
    
    // Sắp xếp lại giờ
    selectedSlots.sort();
    updateSelectedCounter();
}

function cancelBooking(slotTime, bookerName) {
    const inputName = prompt(`Khung giờ này đã được đặt bởi: ${bookerName}\n\nĐể hủy đặt phòng, vui lòng nhập chính xác tên người đặt:`);
    if (inputName === null) return; // User clicked cancel
    
    if (inputName.trim().toLowerCase() === bookerName.toLowerCase()) {
        db.collection('meeting_bookings').doc(selectedDateStr).update({
            [slotTime]: firebase.firestore.FieldValue.delete()
        })
            .then(() => {
                alert('Đã hủy lịch đặt phòng thành công!');
                // Không cần gọi renderSlots() vì 'onSnapshot' event listener sẽ tự động nhận update
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
        counterEl.innerText = `Đã chọn ${selectedSlots.length} khung giờ`;
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        counterEl.innerText = 'Chưa chọn khung giờ';
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

nextBtn.addEventListener('click', () => {
    if (selectedSlots.length === 0) return;
    
    // Save selection temporarily to pass to the next page
    const bookingDraft = {
        date: selectedDateStr,
        slots: selectedSlots
    };
    localStorage.setItem('bookingDraft', JSON.stringify(bookingDraft));
    
    window.location.href = 'booking.html';
});
