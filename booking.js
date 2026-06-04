// Elements
const selectedDateEl = document.getElementById('selected-date');
const selectedSlotsEl = document.getElementById('selected-slots');
const form = document.getElementById('booking-form');
const backBtn = document.getElementById('back-btn');

// State
let bookingDraft = null;

document.addEventListener('DOMContentLoaded', () => {
    // Tải dữ liệu nháp
    const draftStr = localStorage.getItem('bookingDraft');
    if (!draftStr) {
        alert("Không tìm thấy thông tin khung giờ đã chọn. Trở về trang chủ.");
        window.location.href = 'index.html';
        return;
    }
    
    bookingDraft = JSON.parse(draftStr);
    
    // Hiển thị ngày (định dạng DD/MM/YYYY)
    const dateObj = new Date(bookingDraft.date);
    const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const dateFormatted = `${dayNames[dateObj.getDay()]}, ${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
    selectedDateEl.textContent = dateFormatted;
    
    // Hiển thị khung giờ
    selectedSlotsEl.innerHTML = '';
    bookingDraft.slots.forEach(slot => {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 flex items-center gap-3';
        slotDiv.innerHTML = `
            <span class="material-symbols-outlined text-primary text-xl" style="font-variation-settings: 'FILL' 1;">schedule</span>
            <span class="font-mono-data text-mono-data text-primary">${slot}</span>
        `;
        selectedSlotsEl.appendChild(slotDiv);
    });
});

backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalContent = btn.innerHTML;
    
    // Get form data
    const name = document.getElementById('name').value;
    const purpose = document.getElementById('purpose').value;
    const department = document.getElementById('department').value;
    
    // Interaction: Loading state
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin material-symbols-outlined">progress_activity</span> <span>ĐANG XỬ LÝ...</span>`;
    
    const updates = {};
    let hasConflict = false;
    
    // Đọc dữ liệu 1 lần trước khi ghi để kiểm tra conflict
    const docRef = db.collection('meeting_bookings').doc(bookingDraft.date);
    
    docRef.get().then((doc) => {
        const currentBookings = doc.exists ? doc.data() : {};
        
        bookingDraft.slots.forEach(slot => {
            if (currentBookings[slot]) {
                hasConflict = true;
            } else {
                updates[slot] = { name, purpose, department };
            }
        });
        
        if (hasConflict) {
            alert('Có lỗi! Một số khung giờ bạn chọn vừa mới được người khác đặt. Vui lòng chọn lại.');
            window.location.href = 'index.html';
            return Promise.reject("Conflict"); // Ngăn chặn then() phía dưới chạy
        }
        
        // Nếu không có conflict, cập nhật tất cả slot cùng lúc (dùng set với merge: true)
        return docRef.set(updates, { merge: true });
    }).then(() => {
        // Thành công
        localStorage.removeItem('bookingDraft'); // Xóa nháp
        
        btn.classList.replace('bg-primary', 'bg-secondary');
        btn.innerHTML = `<span class="material-symbols-outlined">check</span> <span>THÀNH CÔNG!</span>`;
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }).catch((error) => {
        if (error !== "Conflict") {
            alert("Lỗi kết nối Firebase: " + error.message);
            btn.disabled = false;
            btn.classList.replace('bg-secondary', 'bg-primary');
            btn.innerHTML = originalContent;
        }
    });
});
