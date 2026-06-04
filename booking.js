// Elements
const summaryDate = document.getElementById('summary-date');
const summaryTime = document.getElementById('summary-time');
const form = document.getElementById('booking-form');

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
    const dateFormatted = `${dayNames[dateObj.getDay()]}, ${dateObj.getDate()} Tháng ${dateObj.getMonth() + 1}, ${dateObj.getFullYear()}`;
    summaryDate.textContent = dateFormatted;
    
    // Hiển thị khung giờ
    if (bookingDraft.slots.length > 3) {
        summaryTime.innerHTML = `${bookingDraft.slots.length} khung giờ<br><span class="text-label-md text-outline font-normal">Từ ${bookingDraft.slots[0].split(' - ')[0]} đến ${bookingDraft.slots[bookingDraft.slots.length-1].split(' - ')[1]}</span>`;
    } else {
        summaryTime.innerHTML = bookingDraft.slots.join('<br>');
    }
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalContent = btn.innerHTML;
    
    // Get form data
    const name = document.getElementById('name').value;
    const purpose = document.getElementById('purpose').value;
    const attendees = document.getElementById('attendees').value;
    const department = document.getElementById('department').value;
    const notes = document.getElementById('notes').value;
    
    // Interaction: Loading state
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin material-symbols-outlined">progress_activity</span> <span>Đang xử lý...</span>`;
    
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
                updates[slot] = { name, purpose, attendees, department, notes };
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
        btn.innerHTML = `<span class="material-symbols-outlined">check</span> <span>Thành công!</span>`;
        
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
