// Elements
const monthPicker = document.getElementById('month-picker');
const tableTitle = document.getElementById('table-title');
const loadingText = document.getElementById('loading-text');
const tableBody = document.getElementById('table-body');

const deptColors = {
    "IT": { hex: "#00f0ff", rgb: "0, 240, 255" }, // Cyan
    "Marketing": { hex: "#ff00ff", rgb: "255, 0, 255" }, // Magenta
    "Kế toán": { hex: "#ffea00", rgb: "255, 234, 0" }, // Yellow
    "ISO": { hex: "#ff5e00", rgb: "255, 94, 0" }, // Orange
    "Công tác xã hội": { hex: "#00ff00", rgb: "0, 255, 0" }, // Green
    "Nhân sự": { hex: "#ff0055", rgb: "255, 0, 85" }, // Pink
    "Hành chính": { hex: "#b200ff", rgb: "178, 0, 255" }, // Purple
    "Ban tổng": { hex: "#ffffff", rgb: "255, 255, 255" }, // White
    "default": { hex: "#39ff14", rgb: "57, 255, 20" } // Neon green
};

let currentListener = null;

document.addEventListener('DOMContentLoaded', () => {
    // Set default month to current month
    const today = new Date();
    const currentMonthStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    monthPicker.value = currentMonthStr;
    
    loadData(currentMonthStr);
    
    monthPicker.addEventListener('change', (e) => {
        if (e.target.value) {
            loadData(e.target.value);
        }
    });
});

function getISOWeekNumber(d) {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

function loadData(monthStr) {
    // monthStr is YYYY-MM
    const [year, month] = monthStr.split('-');
    
    tableTitle.textContent = `LỊCH ĐĂNG KÝ SỬ DỤNG PHÒNG HỌP THÁNG ${parseInt(month)}.${year}`;
    loadingText.textContent = "Đang tải dữ liệu...";
    loadingText.classList.remove('hidden');
    tableBody.innerHTML = '';
    
    // Get first and last day of the month strings
    const startDate = `${year}-${month}-01`;
    // Find last day by going to next month day 0
    const lastDayObj = new Date(year, parseInt(month), 0);
    const endDate = `${year}-${month}-${lastDayObj.getDate().toString().padStart(2, '0')}`;
    
    if (currentListener) {
        currentListener();
    }
    
    currentListener = db.collection('meeting_bookings')
        .where(firebase.firestore.FieldPath.documentId(), '>=', startDate)
        .where(firebase.firestore.FieldPath.documentId(), '<=', endDate)
        .onSnapshot((querySnapshot) => {
            const allSlots = [];
            
            querySnapshot.forEach((doc) => {
                const dateStr = doc.id;
                const bookings = doc.data();
                
                // parse date
                const [y, m, d] = dateStr.split('-');
                const dateObj = new Date(y, parseInt(m)-1, d);
                const weekNum = getISOWeekNumber(dateObj);
                const dateDisplay = `${parseInt(d)}/${parseInt(m)}`;
                
                Object.keys(bookings).forEach(timeSlot => {
                    const b = bookings[timeSlot];
                    allSlots.push({
                        dateStr: dateStr,
                        dateObj: dateObj,
                        weekNum: weekNum,
                        dateDisplay: dateDisplay,
                        time: timeSlot,
                        department: b.department || 'Không rõ',
                        purpose: b.purpose || '',
                        name: b.name || ''
                    });
                });
            });
            
            // Sort chronologically (date, then time)
            allSlots.sort((a, b) => {
                if (a.dateStr !== b.dateStr) {
                    return a.dateStr.localeCompare(b.dateStr);
                }
                return a.time.localeCompare(b.time);
            });
            
            renderTable(allSlots);
        }, (error) => {
            console.error("Lỗi lấy dữ liệu:", error);
            loadingText.textContent = "Lỗi tải dữ liệu. Vui lòng thử lại.";
        });
}

function renderTable(data) {
    loadingText.classList.add('hidden');
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-on-surface-variant py-8">Chưa có lịch đặt phòng nào trong tháng này.</td></tr>`;
        return;
    }
    
    // Calculate rowspans
    // Group by week
    const weekGroups = {};
    const dateGroups = {};
    
    data.forEach(item => {
        if (!weekGroups[item.weekNum]) weekGroups[item.weekNum] = 0;
        weekGroups[item.weekNum]++;
        
        if (!dateGroups[item.dateStr]) dateGroups[item.dateStr] = 0;
        dateGroups[item.dateStr]++;
    });
    
    let currentWeek = null;
    let currentDate = null;
    
    data.forEach((item, index) => {
        const tr = document.createElement('tr');
        
        // Cột Tuần
        if (item.weekNum !== currentWeek) {
            currentWeek = item.weekNum;
            const tdWeek = document.createElement('td');
            tdWeek.rowSpan = weekGroups[item.weekNum];
            tdWeek.textContent = item.weekNum;
            tdWeek.className = "font-bold text-lg border-r border-white/10";
            tr.appendChild(tdWeek);
        }
        
        // Cột Ngày
        if (item.dateStr !== currentDate) {
            currentDate = item.dateStr;
            const tdDate = document.createElement('td');
            tdDate.rowSpan = dateGroups[item.dateStr];
            tdDate.textContent = item.dateDisplay;
            tdDate.className = "font-medium border-r border-white/10";
            tr.appendChild(tdDate);
        }
        
        // Cột Thời gian
        const tdTime = document.createElement('td');
        tdTime.textContent = item.time.replace(/ - /g, ' - '); // keep format
        tdTime.className = "font-mono-data";
        tr.appendChild(tdTime);
        
        // Cột Phòng ban
        const colorInfo = deptColors[item.department] || deptColors["default"];
        const tdDept = document.createElement('td');
        tdDept.innerHTML = `<span class="dept-tag" style="--dept-color: ${colorInfo.hex}; --dept-rgb: ${colorInfo.rgb}">${item.department}</span>`;
        tr.appendChild(tdDept);
        
        // Cột Nội dung
        const tdPurpose = document.createElement('td');
        tdPurpose.textContent = item.purpose;
        tdPurpose.className = "text-left";
        tr.appendChild(tdPurpose);
        
        // Cột Ghi chú (Người đặt)
        const tdNote = document.createElement('td');
        tdNote.textContent = item.name;
        tdNote.className = "text-on-surface-variant text-sm";
        tr.appendChild(tdNote);
        
        tableBody.appendChild(tr);
    });
}
