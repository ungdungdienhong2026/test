/* Xác nhận đặt phòng — booking.html
   Đọc nháp 'bookingDraft' { date, slots:["08:00 - 08:30",...], room, roomName } do meeting.html lưu,
   kiểm tra trùng rồi ghi vào Firestore meeting_bookings_<room>/<date> bằng set(..., {merge:true}). */
const { $, pad, parseDs, esc, fm, store, toast, DL } = VPT;

const DEPTS = [['IT', '#2b9fd9'], ['Marketing', '#d14d9c'], ['Kế toán', '#c9a227'], ['ISO', '#e0702c'], ['Công tác xã hội', '#35a866'], ['Nhân sự', '#e0485f'], ['Hành chính', '#8b5cf6'], ['Ban Tổng Giám đốc', '#7d8db0'], ['Chánh văn phòng', '#b0763c']];
const TPL = {
    'IT': ['Triển khai phần mềm', 'Đào tạo hệ thống', 'Họp team IT tuần'],
    'Marketing': ['Kế hoạch truyền thông tháng', 'Duyệt nội dung fanpage', 'Họp với đối tác quảng cáo'],
    'Kế toán': ['Đối soát chi phí vận hành', 'Họp ngân sách', 'Rà soát công nợ nhà cung cấp'],
    'ISO': ['Rà soát quy trình ISO 9001', 'Đánh giá nội bộ quy trình chăm sóc'],
    'Công tác xã hội': ['Kế hoạch văn nghệ cho các cụ', 'Tư vấn gia đình người cao tuổi'],
    'Nhân sự': ['Phỏng vấn ứng viên', 'Đào tạo hội nhập nhân viên mới'],
    'Hành chính': ['Giao ban khối văn phòng', 'Kế hoạch mua sắm vật tư'],
    'Ban Tổng Giám đốc': ['Giao ban giám đốc các cơ sở', 'Họp chiến lược'],
    'Chánh văn phòng': ['Chuẩn bị hồ sơ đoàn kiểm tra', 'Họp điều phối lịch công tác']
};

let draft = null, dept = 'IT';
const slotMin = s => { const [h, m] = s.split(' - ')[0].split(':').map(Number); return h * 60 + m; };
const groupSlots = slots => { // gộp các khung liền nhau: [{from,to,count}]
    const ms = slots.map(slotMin).sort((a, b) => a - b), out = [];
    ms.forEach(m => { const l = out[out.length - 1]; if (l && l.to === m) { l.to = m + 30; l.count++; } else out.push({ from: m, to: m + 30, count: 1 }); });
    return out;
};
const durTx = n => { const m = n * 30, h = Math.floor(m / 60), r = m % 60; return h ? (r ? `${h} giờ ${r} phút` : `${h} giờ`) : `${r} phút`; };

function renderDepts() {
    $('#dept-pick').innerHTML = DEPTS.map(([n, c]) => `<button type="button" class="dp ${n === dept ? 'on' : ''}" role="radio" aria-checked="${n === dept}" data-dept="${esc(n)}" style="--c:${c}"><span class="dot"></span>${esc(n)}</button>`).join('');
    $('#quick').innerHTML = (TPL[dept] || []).map(p => `<button type="button" data-q="${esc(p)}">${esc(p)}</button>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    try { draft = JSON.parse(localStorage.getItem('bookingDraft')); } catch (e) { draft = null; }
    if (!draft || !draft.date || !Array.isArray(draft.slots) || !draft.slots.length) {
        $('#view-confirm').hidden = true; $('#no-draft').hidden = false; return;
    }
    const d = parseDs(draft.date), rg = groupSlots(draft.slots);
    $('#cf-room').textContent = draft.roomName || 'Phòng họp chung';
    $('#selected-date').textContent = `${DL[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    $('#selected-slots').innerHTML = rg.map(x => `<div class="rg"><span class="ms">schedule</span><span class="mono">${fm(x.from)}–${fm(x.to)}</span><small>${durTx(x.count)}</small></div>`).join('');
    $('#cf-total').textContent = durTx(draft.slots.length);

    const prof = store.get('mrb_profile');
    if (prof) { $('#name').value = prof.name || ''; if (DEPTS.find(x => x[0] === prof.department)) dept = prof.department; }
    renderDepts();
    setTimeout(() => $(prof && prof.name ? '#purpose' : '#name').focus(), 50);
});

$('#dept-pick').addEventListener('click', e => { const b = e.target.closest('[data-dept]'); if (!b) return; dept = b.dataset.dept; renderDepts(); });
$('#quick').addEventListener('click', e => { const b = e.target.closest('[data-q]'); if (!b) return; $('#purpose').value = b.dataset.q; $('#purpose').classList.remove('bad'); $('#purpose-err').hidden = true; });

$('#booking-form').addEventListener('submit', e => {
    e.preventDefault();
    if (!draft) return;
    const name = $('#name').value.trim().replace(/\s+/g, ' '), purpose = $('#purpose').value.trim();
    let bad = false;
    [['name', name], ['purpose', purpose]].forEach(([k, v]) => { const no = !v; $('#' + k).classList.toggle('bad', no); $('#' + k + '-err').hidden = !no; if (no && !bad) { $('#' + k).focus(); bad = true; } });
    if (bad) return;

    const btn = $('#submit-btn'), orig = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = `<span class="ms spin">progress_activity</span>Đang kiểm tra lịch…`;
    $('#conflict').hidden = true;

    const roomPrefix = draft.room ? `_${draft.room}` : '';
    const docRef = db.collection(`meeting_bookings${roomPrefix}`).doc(draft.date);

    // Đọc 1 lần để kiểm tra trùng trước khi ghi
    docRef.get().then(doc => {
        const current = doc.exists ? doc.data() : {};
        const taken = draft.slots.filter(s => current[s]);
        if (taken.length) {
            btn.disabled = false; btn.innerHTML = orig;
            const tg = groupSlots(taken).map(x => `${fm(x.from)}–${fm(x.to)}`).join(', ');
            $('#conflict').hidden = false;
            $('#conflict').innerHTML = `<span><b>Có khung giờ vừa được người khác đặt:</b> <span class="mono">${tg}</span>. Hãy chọn lại khung giờ khác.</span><a class="btn ghost" href="meeting.html"><span class="ms">edit_calendar</span>Chọn lại khung giờ</a>`;
            return null;
        }
        const updates = {};
        draft.slots.forEach(s => updates[s] = { name, purpose, department: dept });
        return docRef.set(updates, { merge: true }).then(() => true);
    }).then(ok => {
        if (!ok) return;
        localStorage.removeItem('bookingDraft');
        if ($('#remember').checked) store.set('mrb_profile', { name, department: dept });
        store.set('mrb_return', { room: draft.room, date: draft.date }); // meeting.html sẽ mở đúng phòng/ngày
        const d = parseDs(draft.date), rg = groupSlots(draft.slots);
        $('#booking-form').hidden = true; $('#success').hidden = false;
        $('#success').innerHTML = `<span class="success-ic"><span class="ms">check</span></span><h2 class="h2">Đã đặt ${esc(draft.roomName || 'phòng họp')}</h2>
      <p>${DL[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)} · <span class="mono">${rg.map(x => `${fm(x.from)}–${fm(x.to)}`).join(', ')}</span><br>${esc(purpose)} · ${esc(dept)}</p>
      <div class="row"><a class="btn primary" href="meeting.html"><span class="ms">calendar_view_day</span>Về lịch phòng</a><a class="btn ghost" href="summary.html"><span class="ms">table_chart</span>Xem bảng tổng hợp</a></div>`;
        toast('Đặt phòng thành công');
        window.scrollTo({ top: 0 });
    }).catch(err => {
        btn.disabled = false; btn.innerHTML = orig;
        $('#conflict').hidden = false;
        $('#conflict').innerHTML = `<span><b>Lỗi kết nối Firebase:</b> ${esc(err.message)}. Vui lòng thử lại.</span>`;
    });
});
