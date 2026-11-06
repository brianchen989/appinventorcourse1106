import {icon,iconButton} from '../icons.js';
import {dueLabel,formatReward,REPEAT_LABELS} from '../utils/tasks.js';
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function taskCard(task, today) {
 const subs=task.subtasks||[]; const done=subs.filter(s=>s.done).length; const overdue=!task.completed&&task.dueDate<today;
 const tag=overdue?`<span class="task-tag overdue">逾期</span>`:task.repeat&&task.repeat!=='none'?`<span class="task-tag recurring">${icon('repeat',12)} ${REPEAT_LABELS[task.repeat]||'重複'}</span>`:'';
 const desc=task.description?`<p class="task-description ${task.completed?'crossed':''}">${safe(task.description)}</p>`:'';
 const subBlock=subs.length?`<div class="subtask-progress"><span>${icon('list-checks',14)}</span><span>${done}/${subs.length} 子任務</span><span class="subtask-track"><i style="width:${Math.round(done/subs.length*100)}%"></i></span><button class="subtask-peek" data-action="toggle-subtask-list" data-id="${task.id}">${task.subtasksOpen?'收合':'查看'}</button></div><div class="subtask-peek-list">${subs.map(s=>`<button class="subtask-peek-item ${s.done?'checked':''}" data-action="toggle-subtask" data-parent-id="${task.id}" data-id="${s.id}"><span>${s.done?icon('check',11):''}</span>${escapeHtml(s.title)}</button>`).join('')}</div>`:'';
 const created=task.createdAt?new Date(task.createdAt):new Date();
 const initials=['藍','青','紫','杏','綠']; const hue=(String(task.title).length+created.getDate())%initials.length;
 return `<article class="task-card ${task.subtasksOpen?'subtasks-open':''} ${task.completed?'is-complete':''} ${overdue?'is-overdue':''}" data-task-id="${task.id}"><div class="task-main"><button class="task-check ${task.completed?'checked':''}" data-action="toggle-task" data-id="${task.id}" aria-label="${task.completed?'取消完成':'標記完成'}">${task.completed?icon('check',14):''}</button><div class="task-content"><div class="task-title-row"><h3 class="task-title ${task.completed?'crossed':''}">${safe(task.title)}</h3>${tag}</div>${desc}${subBlock}</div><div class="task-actions">${iconButton('pencil','編輯任務','data-action="edit-task" data-id="'+task.id+'"')}${iconButton('trash','刪除任務','data-action="delete-task" data-id="'+task.id+'"')}</div></div><div class="task-meta"><div class="task-due ${overdue?'text-overdue':''}">${icon(overdue?'clock':'calendar-days',14)}<span>${dueLabel(task,today)}</span></div><div class="task-spacer"></div><span class="owner-avatar avatar-${hue}">${initials[hue]}</span><span class="task-reward">${icon('coins',14)}<b>${formatReward(task.reward)}</b></span></div></article>`;
}
function section(title,subtitle,items,cls,today,collapsed=false) {
 return `<section class="task-column ${cls} ${collapsed?'collapsed':''}" data-column="${cls}"><header class="column-header"><div class="column-heading"><span class="column-dot"></span><h2>${title}</h2><span class="column-count">${items.length}</span></div><div class="column-tools">${subtitle?`<span class="column-subtitle">${subtitle}</span>`:''}<button class="icon-button mini collapse-toggle" data-action="toggle-column" data-column="${cls}" aria-label="${collapsed?'展開':'收合'}${title}">${icon(collapsed?'chevron-down':'chevron-up',15)}</button></div></header><div class="column-list">${items.length?items.map(t=>taskCard(t,today)).join(''):`<div class="empty-state"><div class="empty-mark">${icon(cls==='complete'?'sparkles':'circle-check',21)}</div><span>${cls==='past'?'沒有逾期任務，很棒！':cls==='complete'?'完成的任務會收集在這裡':'安排一件今天想完成的事吧'}</span>${cls==='now'?`<button class="empty-add" data-action="add-task">${icon('plus',14)} 新增任務</button>`:''}</div>`}</div>${items.length&&cls!=='complete'?`<button class="column-add" data-action="add-task">${icon('plus',15)} 新增任務</button>`:''}</section>`;
}
export function renderTaskBoard(state) {
 const groups=state.groups; const today=state.today;
 return `<div class="board-wrap"><div class="board-caption"><div><span class="caption-kicker">你的節奏</span><h2>把今天，過成喜歡的樣子。</h2></div><div class="board-legend"><span><i class="legend-dot past"></i>需要留意</span><span><i class="legend-dot now"></i>進行中</span><span><i class="legend-dot done"></i>已完成</span></div></div><div class="task-board" id="task-board">${section('Past','需要留意',groups.past,'past',today,state.collapsed.past)}${section('Now','接下來要做',groups.now,'now',today,state.collapsed.now)}${section('Complete','已經完成',groups.complete,'complete',today,state.collapsed.complete)}</div></div>`;
}




