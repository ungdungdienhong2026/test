/* Bảng tổng hợp lịch họp theo tháng — summary.html
   Đọc realtime cả 3 collection meeting_bookings_<room>, lọc theo documentId trong khoảng tháng. */
const { $, pad, parseDs, esc, fm, nowMin, todayStr, DL, toast, isoWeek } = VPT;

const ROOMS = [
    { id: 'phong_hop_nho', name: 'Phòng Họp Nhỏ', floor: 'Tầng 2', icon: 'group', c: '#b48cff' },
    { id: 'phong_vip', name: 'Phòng Họp Vừa', floor: 'Tầng 3', icon: 'groups', c: '#e9a23b' },
    { id: 'phong_hop_lon', name: 'Phòng Họp Lớn', floor: 'Tầng 3', icon: 'meeting_room', c: '#8f91ff' }];
const roomById = id => ROOMS.find(r => r.id === id);
const DEPTS = [['IT', '#2b9fd9'], ['Marketing', '#d14d9c'], ['Kế toán', '#c9a227'], ['ISO', '#e0702c'], ['Công tác xã hội', '#35a866'], ['Nhân sự', '#e0485f'], ['Hành chính', '#8b5cf6'], ['Ban Tổng Giám đốc', '#7d8db0'], ['Chánh văn phòng', '#b0763c']];
const deptColor = d => (DEPTS.find(x => x[0] === d) || [0, '#52d2a6'])[1];

const slotMin = s => { const [h, m] = s.split(' - ')[0].split(':').map(Number); return h * 60 + m; };
const durTx = n => { const m = n * 30, h = Math.floor(m / 60), r = m % 60; return h ? (r ? `${h} giờ ${r} phút` : `${h} giờ`) : `${r} phút`; };

const S = { month: { y: new Date().getFullYear(), m: new Date().getMonth() + 1 }, roomF: 'all', deptF: '', q: '' };
const DOCS = {}; ROOMS.forEach(r => DOCS[r.id] = {});   // DOCS[room][date] = slots map
let unsubs = [], pending = 0;

function subscribe() {
    unsubs.forEach(u => u()); unsubs = []; ROOMS.forEach(r => DOCS[r.id] = {});
    const { y, m } = S.month, last = new Date(y, m, 0).getDate();
    const start = `${y}-${pad(m)}-01`, end = `${y}-${pad(m)}-${pad(last)}`;
    pending = ROOMS.length;
    $('#table-body').innerHTML = '<tr><td colspan="7"><div class="loading"><span class="ms">progress_activity</span>Đang tải dữ liệu…</div></td></tr>';
    unsubs = ROOMS.map(r => db.collection('meeting_bookings_' + r.id)
        .where(firebase.firestore.FieldPath.documentId(), '>=', start)
        .where(firebase.firestore.FieldPath.documentId(), '<=', end)
        .onSnapshot(qs => {
            DOCS[r.id] = {}; qs.forEach(doc => DOCS[r.id][doc.id] = doc.data() || {});
            if (pending > 0) pending--;
            render();
        }, err => { pending = 0; toast('Lỗi tải dữ liệu: ' + err.message, 'bad'); render(); }));
}

// Gộp các khung liền nhau cùng người/nội dung thành một cuộc họp
function meetingsOf(room, date) {
    const day = DOCS[room][date] || {}, keys = Object.keys(day).sort((a, b) => slotMin(a) - slotMin(b)), out = []; let cur = null;
    keys.forEach(k => {
        const b = day[k], m = slotMin(k), sig = (b.name || '') + '|' + (b.department || '') + '|' + (b.purpose || '');
        if (cur && cur.sig === sig && cur.to === m) { cur.to = m + 30; cur.n++; }
        else { cur = { sig, from: m, to: m + 30, n: 1, b, room, date }; out.push(cur); }
    });
    return out;
}

function render() {
    const { y, m } = S.month, last = new Date(y, m, 0).getDate(), t = todayStr();
    $('#table-title').textContent = `Lịch đăng ký sử dụng phòng họp tháng ${m}.${y}`;
    $('#m-text').textContent = `Tháng ${m}/${y}`;
    $('#room-filter').innerHTML = [['all', 'Tất cả phòng'], ...ROOMS.map(r => [r.id, r.name])].map(([id, n]) => `<button data-rf="${id}" class="${S.roomF === id ? 'on' : ''}">${esc(n)}</button>`).join('');
    if (!$('#dept-filter').options.length) $('#dept-filter').innerHTML = `<option value="">Mọi phòng ban</option>` + DEPTS.map(([n]) => `<option>${esc(n)}</option>`).join('');

    let all = [];
    for (let d = 1; d <= last; d++) { const s = `${y}-${pad(m)}-${pad(d)}`; ROOMS.forEach(r => meetingsOf(r.id, s).forEach(x => all.push(x))); }
    const q = S.q.trim().toLowerCase();
    const rows = all.filter(x => (S.roomF === 'all' || x.room === S.roomF) && (!S.deptF || x.b.department === S.deptF) && (!q || ((x.b.purpose || '') + ' ' + (x.b.name || '')).toLowerCase().includes(q)))
        .sort((a, b) => a.date.localeCompare(b.date) || a.from - b.from || ROOMS.findIndex(r => r.id === a.room) - ROOMS.findIndex(r => r.id === b.room));

    const hrs = rows.reduce((s, x) => s + x.n * 30, 0) / 60;
    const byRoom = {}, byDept = {};
    rows.forEach(x => { byRoom[x.room] = (byRoom[x.room] || 0) + x.n; byDept[x.b.department || 'Không rõ'] = (byDept[x.b.department || 'Không rõ'] || 0) + 1; });
    const topR = Object.entries(byRoom).sort((a, b) => b[1] - a[1])[0], topD = Object.entries(byDept).sort((a, b) => b[1] - a[1])[0];
    const upcoming = rows.filter(x => x.date > t || (x.date === t && x.to > nowMin())).length;
    $('#stats').innerHTML = `
    <div class="stat"><span class="lbl">Cuộc họp</span><div class="v">${rows.length}</div><small>${upcoming} cuộc sắp diễn ra</small></div>
    <div class="stat"><span class="lbl">Giờ sử dụng</span><div class="v">${hrs.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} giờ</div><small>Tính theo khung 30 phút</small></div>
    <div class="stat"><span class="lbl">Phòng dùng nhiều nhất</span><div class="v sm">${topR ? esc(roomById(topR[0]).name) : '—'}</div><small>${topR ? durTx(topR[1]) : 'Chưa có dữ liệu'}</small></div>
    <div class="stat"><span class="lbl">Phòng ban đặt nhiều nhất</span><div class="v sm">${topD ? esc(topD[0]) : '—'}</div><small>${topD ? topD[1] + ' cuộc họp' : 'Chưa có dữ liệu'}</small></div>`;

    if (pending > 0 && !rows.length) return;
    if (!rows.length) {
        $('#table-body').innerHTML = `<tr><td colspan="7" class="empty" style="text-align:center;padding:36px">Không có lịch họp nào khớp bộ lọc trong tháng này.</td></tr>`;
        $('#sum-cards').innerHTML = `<p class="empty">Không có lịch họp nào khớp bộ lọc trong tháng này.</p>`; return;
    }
    const wkCount = {}, dCount = {};
    rows.forEach(x => { x.w = isoWeek(parseDs(x.date)); wkCount[x.w] = (wkCount[x.w] || 0) + 1; dCount[x.date] = (dCount[x.date] || 0) + 1; });
    let cw = null, cd = null, html = '';
    rows.forEach(x => {
        const d = parseDs(x.date), r = roomById(x.room), col = deptColor(x.b.department);
        html += '<tr>';
        if (x.w !== cw) { cw = x.w; html += `<td class="wk" rowspan="${wkCount[x.w]}">${x.w}</td>`; }
        if (x.date !== cd) { cd = x.date; html += `<td class="dy ${x.date === t ? 'today' : ''}" rowspan="${dCount[x.date]}"><b>${d.getDate()}/${d.getMonth() + 1}</b><small>${x.date === t ? 'Hôm nay' : DL[d.getDay()]}</small></td>`; }
        html += `<td class="mono">${fm(x.from)}–${fm(x.to)}</td><td><span class="room-chip" style="--rc:${r.c}"><span class="ms">${r.icon}</span>${r.name}</span></td><td><span class="tag" style="--c:${col}">${esc(x.b.department || 'Không rõ')}</span></td><td>${esc(x.b.purpose || '')}</td><td class="who">${esc(x.b.name || '')}</td></tr>`;
    });
    $('#table-body').innerHTML = html;
    let cards = '', cur = null;
    rows.forEach(x => {
        const d = parseDs(x.date), r = roomById(x.room), col = deptColor(x.b.department);
        if (x.date !== cur) { if (cur) cards += '</div>'; cur = x.date; cards += `<div class="sc-day"><h4 class="${x.date === t ? 'today' : ''}">${x.date === t ? 'Hôm nay' : DL[d.getDay()]} · ${pad(d.getDate())}/${pad(d.getMonth() + 1)}<span class="mono" style="font-weight:400">· Tuần ${x.w}</span></h4>`; }
        cards += `<div class="sc-item"><div class="sc-row"><span class="mono">${fm(x.from)}–${fm(x.to)}</span><span class="room-chip" style="--rc:${r.c}"><span class="ms">${r.icon}</span>${r.name}</span></div><b>${esc(x.b.purpose || '')}</b><div class="sc-row"><span class="tag" style="--c:${col}">${esc(x.b.department || 'Không rõ')}</span><span class="who">${esc(x.b.name || '')}</span></div></div>`;
    });
    $('#sum-cards').innerHTML = cards + '</div>';
}

$('#room-filter').addEventListener('click', e => { const b = e.target.closest('[data-rf]'); if (!b) return; S.roomF = b.dataset.rf; render(); });
$('#dept-filter').addEventListener('change', e => { S.deptF = e.target.value; render(); });
$('#sum-search').addEventListener('input', e => { S.q = e.target.value; render(); });
$('#m-prev').onclick = () => { let { y, m } = S.month; m--; if (m < 1) { m = 12; y--; } S.month = { y, m }; subscribe(); render(); };
$('#m-next').onclick = () => { let { y, m } = S.month; m++; if (m > 12) { m = 1; y++; } S.month = { y, m }; subscribe(); render(); };

subscribe(); render();
