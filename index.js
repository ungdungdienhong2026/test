/* Đặt phòng họp — meeting.html
   Dữ liệu: Firestore  meeting_bookings_<room>/<YYYY-MM-DD>  =>  { "08:00 - 08:30": {name, purpose, department}, ... }
   Phòng VIP cũ (collection phong_vip) được hiển thị là "Phòng Họp Vừa". */
const { $, pad, ds, parseDs, addDays, mondayOf, isoWeek, esc, fm, nowMin, todayStr, DS, DL, store, toast } = VPT;

const START_HOUR = 8, END_HOUR = 18, SLOT_DURATION = 30;
const START = START_HOUR * 60, END = END_HOUR * 60, STEP = SLOT_DURATION, ROW = 46;
const SLOTS = []; for (let m = START; m < END; m += STEP) SLOTS.push({ s: m, e: m + STEP, key: `${fm(m)} - ${fm(m + STEP)}` });
const N = SLOTS.length;

const ROOMS = [
    { id: 'phong_hop_nho', name: 'Phòng Họp Nhỏ', floor: 'Tầng 2', icon: 'group', c: '#b48cff' },
    { id: 'phong_vip', name: 'Phòng Họp Vừa', floor: 'Tầng 3', icon: 'groups', c: '#e9a23b' },
    { id: 'phong_hop_lon', name: 'Phòng Họp Lớn', floor: 'Tầng 3', icon: 'meeting_room', c: '#8f91ff' }];
const roomById = id => ROOMS.find(r => r.id === id);
const colOf = room => db.collection('meeting_bookings_' + room);

const DEPTS = [['IT', '#2b9fd9'], ['Marketing', '#d14d9c'], ['Kế toán', '#c9a227'], ['ISO', '#e0702c'], ['Công tác xã hội', '#35a866'], ['Nhân sự', '#e0485f'], ['Hành chính', '#8b5cf6'], ['Ban Tổng Giám đốc', '#7d8db0'], ['Chánh văn phòng', '#b0763c']];
const deptColor = d => (DEPTS.find(x => x[0] === d) || [0, '#52d2a6'])[1];

const durTx = n => { const m = n * STEP, h = Math.floor(m / 60), r = m % 60; return h ? (r ? `${h} giờ ${r} phút` : `${h} giờ`) : `${r} phút`; };
const rangeTx = (a, b) => `${fm(SLOTS[a].s)}–${fm(SLOTS[b].e)}`;
const dayLabel = s => { const t = todayStr(); if (s === t) return 'Hôm nay'; if (s === ds(addDays(new Date(), 1))) return 'Ngày mai'; const d = parseDs(s); return `${DS[d.getDay()]} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
const groupRanges = arr => { const s = [...arr].sort((a, b) => a - b), out = []; s.forEach(i => { const l = out[out.length - 1]; if (l && l.b === i - 1) l.b = i; else out.push({ a: i, b: i }); }); return out; };

/* ---------- cache dữ liệu theo phòng / ngày ---------- */
const DAY = {}; ROOMS.forEach(r => DAY[r.id] = {});          // DAY[room][date] = slots map
const LOADED = {}; ROOMS.forEach(r => LOADED[r.id] = new Set()); // ngày đã tải (kể cả ngày không có doc)
const getDay = (room, date) => DAY[room][date] || {};

// Tải một khoảng ngày của một phòng bằng 1 truy vấn theo documentId
function loadRange(room, from, to) {
    const need = []; for (let d = parseDs(from); ds(d) <= to; d = addDays(d, 1)) if (!LOADED[room].has(ds(d))) need.push(ds(d));
    if (!need.length) return Promise.resolve();
    return colOf(room)
        .where(firebase.firestore.FieldPath.documentId(), '>=', from)
        .where(firebase.firestore.FieldPath.documentId(), '<=', to)
        .get().then(qs => {
            need.forEach(d => { LOADED[room].add(d); if (!DAY[room][d]) DAY[room][d] = {}; });
            qs.forEach(doc => { DAY[room][doc.id] = doc.data() || {}; });
        });
}

const isPast = (date, i) => { const t = todayStr(); if (date < t) return true; if (date > t) return false; return SLOTS[i].e <= nowMin(); };
function meetingsOf(room, date) {
    const day = getDay(room, date), out = []; let cur = null;
    SLOTS.forEach((sl, i) => {
        const b = day[sl.key]; if (!b) { cur = null; return; }
        const k = (b.name || '') + '|' + (b.department || '') + '|' + (b.purpose || '');
        if (cur && cur.k === k && cur.end === i - 1) { cur.end = i; cur.keys.push(sl.key); }
        else { cur = { k, start: i, end: i, keys: [sl.key], b, room, date }; out.push(cur); }
    });
    return out;
}
function firstFree(room, date, len) {
    const day = getDay(room, date);
    for (let i = 0; i + len <= N; i++) { let ok = true; for (let j = i; j < i + len; j++) { if (day[SLOTS[j].key] || isPast(date, j)) { ok = false; i = j; break; } } if (ok) return i; }
    return -1;
}
function findAhead(room, len) {
    for (let off = 0; off < 14; off++) { const d = addDays(new Date(), off); if (d.getDay() === 0) continue; const s = ds(d), i = firstFree(room, s, len); if (i >= 0) return { date: s, i }; }
    return null;
}

/* ---------- trạng thái giao diện ---------- */
const S = { view: 'rooms', room: null, date: todayStr(), week: mondayOf(new Date()), sel: new Set(), last: null, finderLen: 2, modal: null, finderReady: false };
let todayUnsubs = [], dayUnsub = null;

function show(view) {
    S.view = view;
    ['rooms', 'booking'].forEach(v => $('#view-' + v).hidden = v !== view);
    $('#bottom-action-bar').hidden = view !== 'booking';
    renderCrumbs();
    window.scrollTo({ top: 0 });
    if (view === 'rooms') renderRooms();
    if (view === 'booking') renderBooking();
}
function renderCrumbs() {
    const r = S.room && roomById(S.room); let items = [];
    if (S.view === 'rooms') items = [['Chọn phòng họp']];
    if (S.view === 'booking') items = [['Phòng họp', 'rooms'], [`${r.name} (${r.floor})`]];
    const back = items.length > 1 ? `<button class="icon-btn" data-go="${items[items.length - 2][1]}" aria-label="Quay lại"><span class="ms">arrow_back</span></button>` : '';
    $('#crumbs').innerHTML = back + items.map((it, i) => i === items.length - 1 ? `<span class="cur">${esc(it[0])}</span>` : `<button data-go="${it[1]}">${esc(it[0])}</button><span class="sep">/</span>`).join('');
}
document.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) show(g.dataset.go); });

/* ---------- màn chọn phòng ---------- */
function renderRooms() {
    const t = todayStr(), nm = nowMin(), td = new Date();
    $('#rooms-eyebrow').textContent = `Hôm nay · ${DL[td.getDay()]}, ${pad(td.getDate())}/${pad(td.getMonth() + 1)}/${td.getFullYear()} · ${fm(nm)}`;
    $('#rooms').innerHTML = ROOMS.map(r => {
        const loaded = LOADED[r.id].has(t), ms = meetingsOf(r.id, t), day = getDay(r.id, t), booked = Object.keys(day).length;
        const live = ms.find(m => SLOTS[m.start].s <= nm && nm < SLOTS[m.end].e);
        let st;
        if (!loaded) st = ['idle', 'Đang tải…'];
        else if (nm >= END) st = ['idle', 'Hết giờ làm việc'];
        else if (nm < START) st = ['idle', 'Chưa đến giờ làm việc'];
        else if (live) st = ['busy', `Đang họp · đến ${fm(SLOTS[live.end].e)}`];
        else { const nx = ms.find(m => SLOTS[m.start].s > nm); st = ['free', nx ? `Trống · đến ${fm(SLOTS[nx.start].s)}` : 'Trống đến hết ngày']; }
        const freeLeft = SLOTS.filter((s, i) => !day[s.key] && !isPast(t, i)).length;
        const strip = SLOTS.map((s, i) => { const b = day[s.key]; return `<i class="${b ? 'b' : ''} ${isPast(t, i) ? 'p' : ''} ${s.s <= nm && nm < s.e ? 'cur' : ''}" ${b ? `style="--c:${deptColor(b.department)}"` : ''}></i>`; }).join('');
        const up = ms.filter(m => SLOTS[m.end].e > nm).slice(0, 2);
        const upHtml = up.length ? up.map(m => `<div class="rn"><span class="dot" style="--c:${deptColor(m.b.department)}"></span><span class="mono">${rangeTx(m.start, m.end)}</span><span>${esc(m.b.purpose)}</span></div>`).join('') : `<div class="rn" style="color:var(--muted)">${loaded ? 'Không còn cuộc họp nào hôm nay' : '…'}</div>`;
        return `<button class="room" data-room="${r.id}" style="--rc:${r.c}">
      <div class="room-top"><span class="room-ic"><span class="ms">${r.icon}</span></span>
        <div class="room-name"><h3>${r.name}</h3><p><span class="ms">location_on</span>${r.floor}</p></div>
        <span class="pill ${st[0]}"><i></i>${st[1]}</span></div>
      <div><div class="strip" aria-hidden="true">${strip}</div><div class="strip-scale"><span>08:00</span><span>13:00</span><span>18:00</span></div></div>
      <div class="room-stats"><span>Đã đặt hôm nay <b>${booked ? durTx(booked) : '0 phút'}</b></span><span>Còn <b>${freeLeft}</b> khung trống</span></div>
      <div class="room-next"><span class="lbl">Sắp diễn ra</span>${upHtml}</div>
      <div class="room-cta"><span>Xem lịch & đặt phòng</span><span class="ms">arrow_forward</span></div>
    </button>`;
    }).join('');
    renderFinder();
}
function renderFinder() {
    document.querySelectorAll('#finder-seg button').forEach(b => b.classList.toggle('on', +b.dataset.len === S.finderLen));
    if (!S.finderReady) return;
    const len = S.finderLen;
    const res = ROOMS.map(r => ({ r, f: findAhead(r.id, len) })).filter(x => x.f).sort((a, b) => a.f.date.localeCompare(b.f.date) || a.f.i - b.f.i);
    $('#finder-res').innerHTML = res.length ? res.map((x, k) => `<button class="fr ${k === 0 ? 'best' : ''}" data-pick="${x.r.id}|${x.f.date}|${x.f.i}|${len}">
    <div class="fr-main"><b>${x.r.name}</b><span>${x.r.floor} · ${dayLabel(x.f.date)}</span></div>
    <div class="fr-time">${rangeTx(x.f.i, x.f.i + len - 1)}${k === 0 ? '<small>Sớm nhất</small>' : ''}</div><span class="ms" style="color:var(--accent)">chevron_right</span></button>`).join('') : `<p class="empty">Không tìm thấy khung trống ${durTx(len)} trong 2 tuần tới.</p>`;
}
$('#finder-seg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.finderLen = +b.dataset.len; renderFinder(); });
$('#finder-res').addEventListener('click', e => { const b = e.target.closest('[data-pick]'); if (!b) return; const [room, date, i, len] = b.dataset.pick.split('|'); const sel = []; for (let k = +i; k < +i + +len; k++) sel.push(k); openRoom(room, date, sel); });
$('#rooms').addEventListener('click', e => { const b = e.target.closest('[data-room]'); if (b) openRoom(b.dataset.room); });

function openRoom(id, date, sel) {
    S.room = id; S.date = date || todayStr(); S.week = mondayOf(parseDs(S.date)); S.sel = new Set(sel || []); S.last = null;
    show('booking');
}

/* ---------- màn lịch phòng ---------- */
function renderBooking() {
    const r = roomById(S.room);
    $('#bk-floor').textContent = r.floor; $('#bk-room').textContent = r.name;
    const mid = parseDs(S.date);
    $('#wk-text').textContent = `Tuần ${isoWeek(mid)} · Tháng ${mid.getMonth() + 1}, ${mid.getFullYear()}`;
    const d = parseDs(S.date);
    $('#tl-title').textContent = `${DL[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
    renderDates(); renderTimeline(); renderSide(); renderBar();
    // Tải cả tuần (1 truy vấn) rồi theo dõi realtime ngày đang chọn
    const from = ds(S.week), to = ds(addDays(S.week, 6));
    loadRange(S.room, from, to).then(() => { if (S.view === 'booking') { renderDates(); renderTimeline(); renderSide(); renderBar(); } }).catch(err => toast('Không tải được lịch: ' + err.message, 'bad'));
    watchDay(S.room, S.date);
}
function watchDay(room, date) {
    if (dayUnsub) { dayUnsub(); dayUnsub = null; }
    dayUnsub = colOf(room).doc(date).onSnapshot(doc => {
        DAY[room][date] = doc.exists ? (doc.data() || {}) : {}; LOADED[room].add(date);
        if (S.view === 'booking' && S.room === room && S.date === date) { renderDates(); renderTimeline(); renderSide(); renderBar(); }
        if (S.modal && S.modal.room === room && S.modal.date === date && !meetingsOf(room, date).find(m => m.start === S.modal.start)) closeModal();
    }, err => toast('Mất kết nối lịch: ' + err.message, 'bad'));
}
function renderDates() {
    const t = todayStr();
    $('#dates').innerHTML = Array.from({ length: 7 }, (_, k) => {
        const d = addDays(S.week, k), s = ds(d), loaded = LOADED[S.room].has(s), cnt = Object.keys(getDay(S.room, s)).length;
        const lt = s < t ? 'Đã qua' : !loaded ? '…' : cnt === 0 ? 'Trống cả ngày' : cnt >= N ? 'Kín lịch' : `${N - cnt}/${N} trống`;
        return `<button class="date ${s === S.date ? 'on' : ''} ${s < t ? 'past' : ''} ${s === t ? 'today' : ''} ${d.getDay() === 0 ? 'sun' : ''}" data-d="${s}" aria-pressed="${s === S.date}">
      <span class="dw">${s === t ? 'HÔM NAY' : DS[d.getDay()]}</span><span class="dn">${pad(d.getDate())}</span>
      <span class="load"><b style="width:${cnt / N * 100}%"></b></span><span class="lt">${lt}</span></button>`;
    }).join('');
}
function renderTimeline() {
    if (!LOADED[S.room].has(S.date)) { $('#timeline').innerHTML = '<div class="loading"><span class="ms">progress_activity</span>Đang tải lịch…</div>'; return; }
    const day = getDay(S.room, S.date), ms = meetingsOf(S.room, S.date), nm = nowMin(), isToday = S.date === todayStr();
    [...S.sel].forEach(i => { if (day[SLOTS[i].key] || isPast(S.date, i)) S.sel.delete(i); });
    const cols = [{ n: 'Buổi sáng', a: 0, b: 8 }, { n: 'Buổi chiều', a: 8, b: N }];
    $('#timeline').innerHTML = cols.map(c => {
        let h = '';
        for (let i = c.a; i < c.b; i++) {
            const row = i - c.a + 1;
            h += `<span class="tl-time" style="grid-row:${row}">${fm(SLOTS[i].s)}</span>`;
            if (day[SLOTS[i].key]) {
                const m = ms.find(m => m.start <= i && i <= m.end);
                if (i === m.start || i === c.a) {
                    const span = Math.min(m.end, c.b - 1) - i + 1, done = isPast(S.date, m.end), col = deptColor(m.b.department);
                    const cont = i !== m.start ? ' (tiếp)' : '';
                    h += span === 1
                        ? `<button class="mtg one ${done ? 'done' : ''}" style="grid-row:${row} / span 1;--c:${col}" data-m="${m.start}"><span class="tag" style="--c:${col}">${esc(m.b.department || 'Đã đặt')}</span><span class="mtg-title">${esc(m.b.purpose || 'Không có nội dung')}${cont}</span></button>`
                        : `<button class="mtg ${done ? 'done' : ''}" style="grid-row:${row} / span ${span};--c:${col}" data-m="${m.start}"><span class="tag" style="--c:${col}">${esc(m.b.department || 'Đã đặt')}</span><span class="mtg-title">${esc(m.b.purpose || 'Không có nội dung')}${cont}</span><span class="mtg-meta"><span class="mono">${rangeTx(m.start, m.end)}</span> · ${esc(m.b.name)}</span></button>`;
                }
                continue;
            }
            const past = isPast(S.date, i), on = S.sel.has(i);
            h += `<button class="slot ${on ? 'on' : ''}" style="grid-row:${row}" data-i="${i}" ${past ? 'disabled' : ''} aria-pressed="${on}"><span class="mono">${fm(SLOTS[i].s)} – ${fm(SLOTS[i].e)}</span>${past ? '<span class="slot-note">Đã qua</span>' : `<span class="ms chk">${on ? 'check_circle' : 'add_circle'}</span>`}</button>`;
        }
        let now = '';
        if (isToday && nm >= SLOTS[c.a].s && nm < SLOTS[c.b - 1].e) now = `<div class="now" style="top:${(nm - SLOTS[c.a].s) / STEP * ROW}px"><span>${fm(nm)}</span></div>`;
        return `<div class="tl-col"><div class="tl-cap"><span>${c.n}</span><span class="mono">${fm(SLOTS[c.a].s)}–${fm(SLOTS[c.b - 1].e)}</span></div><div class="tl-grid" style="grid-template-rows:repeat(${c.b - c.a},${ROW}px)">${h}${now}</div></div>`;
    }).join('');
}
function renderSide() {
    const loaded = LOADED[S.room].has(S.date), day = getDay(S.room, S.date), free = SLOTS.filter((s, i) => !day[s.key] && !isPast(S.date, i)).length;
    $('#free-count').textContent = loaded ? `${free}/${N} khung còn trống` : '';
    $('#suggest').innerHTML = !loaded ? '' : [[1, '30 phút'], [2, '1 giờ'], [4, '2 giờ']].map(([len, l]) => {
        const i = firstFree(S.room, S.date, len);
        return i < 0 ? `<div class="sg none"><b>${l}</b>Không còn khung liền</div>` : `<button class="sg" data-a="${i}" data-len="${len}"><b>${l}</b><span class="mono">${rangeTx(i, i + len - 1)}</span><span class="ms">add_circle</span></button>`;
    }).join('');
    const ms = meetingsOf(S.room, S.date);
    $('#day-count').textContent = ms.length ? `${ms.length} cuộc` : '';
    $('#day-list').innerHTML = ms.length ? ms.map(m => `<button data-m="${m.start}"><span class="dot" style="--c:${deptColor(m.b.department)}"></span><b>${esc(m.b.purpose || 'Không có nội dung')}</b><small><span class="mono">${rangeTx(m.start, m.end)}</span> · ${esc(m.b.department || '')}</small></button>`).join('') : `<p class="empty">${loaded ? 'Chưa có cuộc họp nào. Cả ngày đang trống.' : '…'}</p>`;
}
function renderBar() {
    const r = roomById(S.room), d = parseDs(S.date), rg = groupRanges(S.sel);
    $('#bar-cap').textContent = `${r.name} · ${DS[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
    if (rg.length) {
        const txt = rg.map(x => rangeTx(x.a, x.b)).join(', ');
        $('#selected-count').innerHTML = `<span class="mono">${txt}</span> <em>· ${durTx(S.sel.size)}</em>`;
    } else $('#selected-count').textContent = 'Chọn khung giờ trống trên lịch';
    $('#next-btn').disabled = !rg.length; $('#bar-clear').hidden = !rg.length;
}
function gotoDate(s) { S.date = s; S.week = mondayOf(parseDs(s)); S.sel.clear(); S.last = null; renderBooking(); }
$('#dates').addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (!b) return; gotoDate(b.dataset.d); });
$('#wk-prev').onclick = () => gotoDate(ds(addDays(S.week, -7)));
$('#wk-next').onclick = () => gotoDate(ds(addDays(S.week, 7)));
$('#wk-today').onclick = () => gotoDate(todayStr());
$('#timeline').addEventListener('click', e => {
    const s = e.target.closest('.slot');
    if (s && !s.disabled) {
        const i = +s.dataset.i, day = getDay(S.room, S.date);
        if (e.shiftKey && S.last != null) { const a = Math.min(S.last, i), b = Math.max(S.last, i); for (let j = a; j <= b; j++) if (!day[SLOTS[j].key] && !isPast(S.date, j)) S.sel.add(j); }
        else S.sel.has(i) ? S.sel.delete(i) : S.sel.add(i);
        S.last = i; renderTimeline(); renderBar(); return;
    }
    const m = e.target.closest('[data-m]'); if (m) openModal(S.room, S.date, +m.dataset.m);
});
$('#day-list').addEventListener('click', e => { const m = e.target.closest('[data-m]'); if (m) openModal(S.room, S.date, +m.dataset.m); });
$('#suggest').addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (!b) return; S.sel.clear(); for (let k = +b.dataset.a; k < +b.dataset.a + +b.dataset.len; k++) S.sel.add(k); renderTimeline(); renderBar(); toast(`Đã chọn ${rangeTx(+b.dataset.a, +b.dataset.a + +b.dataset.len - 1)}`); });
$('#bar-clear').onclick = () => { S.sel.clear(); renderTimeline(); renderBar(); };
$('#next-btn').onclick = () => {
    if (!S.sel.size) return;
    const r = roomById(S.room), idx = [...S.sel].sort((a, b) => a - b);
    // Giữ nguyên định dạng nháp để booking.js đọc
    const bookingDraft = { date: S.date, slots: idx.map(i => SLOTS[i].key), room: S.room, roomName: `${r.name} (${r.floor})` };
    localStorage.setItem('bookingDraft', JSON.stringify(bookingDraft));
    window.location.href = 'booking.html';
};

/* ---------- chi tiết / hủy ---------- */
function openModal(room, date, start) {
    const m = meetingsOf(room, date).find(x => x.start === start); if (!m) return;
    S.modal = m; const col = deptColor(m.b.department), d = parseDs(date), r = roomById(room);
    const tg = $('#modal-dept'); tg.textContent = m.b.department || 'Không rõ'; tg.style.setProperty('--c', col);
    $('#md-title').textContent = m.b.purpose || 'Không có nội dung';
    $('#modal-time').textContent = `${rangeTx(m.start, m.end)} · ${DS[d.getDay()]} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
    $('#modal-room').textContent = `${r.name} (${r.floor})`;
    $('#modal-name').textContent = m.b.name || 'Không rõ';
    const past = isPast(date, m.end);
    $('#md-cancel').hidden = past; $('#md-past').hidden = !past;
    $('#cancel-name-input').value = ''; $('#cancel-err').hidden = true; $('#cancel-name-input').classList.remove('bad');
    const btn = $('#confirm-cancel-btn'); btn.disabled = false; btn.textContent = 'Hủy cuộc họp';
    $('#info-modal').hidden = false;
    if (!past) setTimeout(() => $('#cancel-name-input').focus(), 50);
}
function closeModal() { $('#info-modal').hidden = true; S.modal = null; }
$('#info-modal').addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#info-modal').hidden) closeModal(); });
$('#cancel-name-input').addEventListener('keydown', e => { if (e.key === 'Enter') $('#confirm-cancel-btn').click(); });
$('#confirm-cancel-btn').onclick = () => {
    const m = S.modal; if (!m) return;
    const norm = s => (s || '').normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase();
    const inp = $('#cancel-name-input');
    if (norm(inp.value) !== norm(m.b.name)) {
        $('#cancel-err').hidden = false; $('#cancel-err').textContent = inp.value.trim() ? 'Tên không khớp. Chỉ người đặt mới hủy được cuộc họp này.' : 'Nhập tên người đặt để hủy.';
        inp.classList.add('bad'); const dlg = $('.dialog'); dlg.classList.remove('shake'); void dlg.offsetWidth; dlg.classList.add('shake'); return;
    }
    const btn = $('#confirm-cancel-btn'); btn.disabled = true; btn.textContent = 'Đang hủy…';
    const updates = {}; m.keys.forEach(k => updates[k] = firebase.firestore.FieldValue.delete());
    colOf(m.room).doc(m.date).update(updates).then(() => {
        closeModal(); toast(`Đã hủy cuộc họp ${rangeTx(m.start, m.end)}`);
    }).catch(err => { btn.disabled = false; btn.textContent = 'Hủy cuộc họp'; $('#cancel-err').hidden = false; $('#cancel-err').textContent = 'Lỗi khi hủy: ' + err.message; });
};

/* ---------- khởi động ---------- */
(function init() {
    const t = todayStr();
    // Theo dõi realtime lịch hôm nay của cả 3 phòng (cho thẻ phòng)
    todayUnsubs = ROOMS.map(r => colOf(r.id).doc(t).onSnapshot(doc => {
        DAY[r.id][t] = doc.exists ? (doc.data() || {}) : {}; LOADED[r.id].add(t);
        if (S.view === 'rooms') renderRooms();
    }, err => toast('Không kết nối được Firebase: ' + err.message, 'bad')));
    // Tải 14 ngày tới của cả 3 phòng cho "Tìm khung trống sớm nhất" (3 truy vấn)
    Promise.all(ROOMS.map(r => loadRange(r.id, t, ds(addDays(new Date(), 13)))))
        .then(() => { S.finderReady = true; if (S.view === 'rooms') renderFinder(); })
        .catch(err => { $('#finder-res').innerHTML = `<div class="err-box"><b>Không dò được lịch.</b> ${esc(err.message)}</div>`; });
    // Quay lại từ trang xác nhận: mở đúng phòng / ngày vừa đặt
    const ret = store.get('mrb_return');
    if (ret && roomById(ret.room)) { localStorage.removeItem('mrb_return'); openRoom(ret.room, ret.date); }
    else show('rooms');
    // Làm mới trạng thái theo giờ mỗi phút
    setInterval(() => { if (!$('#info-modal').hidden) return; if (S.view === 'rooms') renderRooms(); if (S.view === 'booking') { renderTimeline(); renderSide(); renderBar(); } }, 60000);
})();
