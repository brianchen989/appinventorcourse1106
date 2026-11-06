export function uid(prefix='t') { return `${prefix}-${globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2,11)}`; }
export function localDate(date=new Date()) { const y=date.getFullYear(); const m=String(date.getMonth()+1).padStart(2,'0'); const d=String(date.getDate()).padStart(2,'0'); return `${y}-${m}-${d}`; }
export function dayOffset(date, amount) { const d=new Date(`${date}T12:00:00`); d.setDate(d.getDate()+amount); return localDate(d); }
export function dateLabel(date, opts={weekday:'short',month:'short',day:'numeric'}) { const [y,m,d]=date.split('-').map(Number); return new Intl.DateTimeFormat('zh-TW',opts).format(new Date(y,m-1,d,12)); }
export function fullDateLabel(date) { const [y,m,d]=date.split('-').map(Number); return new Intl.DateTimeFormat('zh-TW',{year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(new Date(y,m-1,d,12)); }
export function startOfWeek(date) { const [y,m,d]=date.split('-').map(Number); const x=new Date(y,m-1,d,12); x.setDate(x.getDate()-((x.getDay()+6)%7)); return localDate(x); }
export function addDays(date,n) { return dayOffset(date,n); }
export function isOverdue(task, now=new Date()) { if(task.completed)return false; const due=new Date(`${task.dueDate}T${task.dueTime||'23:59'}:00`); return due.getTime()<now.getTime(); }
export function compareDue(a,b) { return `${a.dueDate}T${a.dueTime||'23:59'}:00`.localeCompare(`${b.dueDate}T${b.dueTime||'23:59'}:00`) || (a.createdAt||'').localeCompare(b.createdAt||''); }
export function groupTasks(tasks, now=new Date()) { const today=localDate(now); const past=tasks.filter(t=>!t.completed&&(t.dueDate<today||t.dueDate===today&&isOverdue(t,now))).sort(compareDue);const current=tasks.filter(t=>!t.completed&&t.dueDate>=today&&!isOverdue(t,now)).sort(compareDue);const complete=tasks.filter(t=>t.completed).sort((a,b)=>(a.completedAt||'').localeCompare(b.completedAt||''));return {past,now:current,complete}; }
export function dueLabel(task, today=localDate()) { if(task.dueDate<today)return '已逾期'; if(task.dueDate===today)return `今天 · ${task.dueTime||'23:59'}`; if(task.dueDate===dayOffset(today,1))return `明天 · ${task.dueTime||'23:59'}`; return `${dateLabel(task.dueDate)} · ${task.dueTime||'23:59'}`; }
export function formatReward(value) { return new Intl.NumberFormat('zh-TW').format(Number(value)||0); }
export const REPEAT_LABELS={none:'不重複',daily:'每天',weekdays:'每個平日',weekly:'每週'};
export function formatDuration(seconds) { const h=Math.floor(seconds/3600); const m=Math.floor(seconds%3600/60); const s=seconds%60; return `${h?`${h} 小時 `:''}${m?`${m} 分 `:''}${s} 秒`; }


