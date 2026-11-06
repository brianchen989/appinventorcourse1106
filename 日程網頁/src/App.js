import {icon} from './icons.js';
import {renderHeader} from './modules/Header.js';
import {renderSidebar} from './components/Sidebar.js';
import {renderTaskBoard} from './modules/Tasks.js';
import {renderInsights} from './modules/Insights.js';
import {renderTaskForm} from './modules/TaskForm.js';
import {loadTasks,saveTasks,seedTasks,clearTasks} from './utils/storage.js';
import {uid,localDate,dayOffset,startOfWeek,groupTasks} from './utils/tasks.js';
const app=document.querySelector('#app');
const stored=loadTasks();
const state={tasks:stored||seedTasks.map(t=>({...t,subtasks:t.subtasks.map(s=>({...s}))})),today:localDate(),selectedDate:localDate(),weekStart:startOfWeek(localDate()),calendarDate:new Date(),collapsed:{past:false,now:false,complete:true},formOpen:false,editing:null,toast:'',timerInterval:null,pomodoro:{running:false,seconds:0,minutes:25},sidebarOpen:false,searchOpen:false,searchQuery:''};
let toastTimer;
function getStats(){const complete=state.tasks.filter(t=>t.completed);const weekEnd=dayOffset(state.weekStart,6);const weekDone=complete.filter(t=>t.completedAt&&localDate(new Date(t.completedAt))>=state.weekStart&&localDate(new Date(t.completedAt))<=weekEnd).length;const today=state.today;let streak=0;let cursor=today;for(let i=0;i<365;i++){if(complete.some(t=>t.completedAt&&localDate(new Date(t.completedAt))===cursor)){streak++;cursor=dayOffset(cursor,-1);}else if(i===0){cursor=dayOffset(cursor,-1);}else break;}return {tokens:complete.reduce((n,t)=>n+Number(t.reward||0),0),weekDone,streak,subtasks:state.tasks.reduce((n,t)=>n+(t.subtasks?.length||0),0)};}
function render(){state.today=localDate();state.stats=getStats();state.groups=groupTasks(state.tasks);const list=(state.searchQuery?state.tasks.filter(t=>`${t.title} ${t.description||''}`.toLowerCase().includes(state.searchQuery.toLowerCase())):state.tasks).filter(t=>!state.selectedDate||t.dueDate===state.selectedDate);const filteredGroups=groupTasks(list);const finishedToday=state.tasks.filter(t=>t.completed&&t.completedAt&&localDate(new Date(t.completedAt))===state.today).length;app.innerHTML=`<div class="app-shell ${state.sidebarOpen?'sidebar-open':''}">${renderSidebar(state)}<main class="main-shell">${renderHeader(state)}<div class="main-scroll"><div class="main-content">${state.searchOpen?`<div class="search-row">${icon('search',17)}<input id="task-search" placeholder="搜尋任務…" value="${escapeHtml(state.searchQuery)}"/><button class="icon-button" data-action="close-search">${icon('x',17)}</button></div>`:''}${renderTaskBoard({...state,groups:filteredGroups})}<div class="section-divider"><span>一點點進度，也很值得</span><i></i></div>${renderInsights({...state,finishedToday})}</div><footer class="app-footer"><span>DAYMARK <b>·</b> 把日子，過成自己的節奏。</span><span>每一天，都值得好好安排。</span></footer></div></main><button class="mobile-scrim" data-action="close-sidebar"></button>${state.formOpen?renderTaskForm({editing:state.editing}):''}<div class="toast ${state.toast?'show':''}" role="status">${icon('circle-check',17)}<span>${escapeHtml(state.toast)}</span></div></div>`;}
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function save(){saveTasks(state.tasks);render();}
function showToast(message){state.toast=message;render();clearTimeout(toastTimer);toastTimer=setTimeout(()=>{state.toast='';render();},2400);}
function openForm(task=null){state.editing=task;state.formOpen=true;render();requestAnimationFrame(()=>document.querySelector('#task-title')?.focus());}
function closeForm(){state.formOpen=false;state.editing=null;render();}
function handleAction(action,el){const id=el.dataset.id;const task=state.tasks.find(t=>t.id===id);switch(action){
 case 'add-task':openForm();break;
 case 'focus-add':openForm();break;
 case 'close-form':closeForm();break;
 case 'backdrop-close':closeForm();break;
 case 'toggle-task':if(task){if(task.completed){task.completed=false;delete task.completedAt;save();showToast('已取消完成狀態');}else{task.completed=true;task.completedAt=new Date().toISOString();save();showToast(`完成任務，獲得 ${task.reward} 枚代幣`);}}break;
 case 'toggle-column':state.collapsed[el.dataset.column]=!state.collapsed[el.dataset.column];render();break;
 case 'toggle-subtask-list':break;
 case 'toggle-subtask':{const parent=state.tasks.find(t=>t.id===el.dataset.parentId);const sub=parent?.subtasks?.find(s=>s.id===id);if(sub){sub.done=!sub.done;save();showToast(sub.done?'子任務完成':'已更新子任務');}break;}
 case 'select-day':state.selectedDate=el.dataset.date;state.weekStart=startOfWeek(el.dataset.date);state.calendarDate=new Date(el.dataset.date+'T12:00:00');render();break;
 case 'week-prev':state.weekStart=dayOffset(state.weekStart,-7);state.selectedDate=state.weekStart;render();break;
 case 'week-next':state.weekStart=dayOffset(state.weekStart,7);state.selectedDate=state.weekStart;render();break;
 case 'month-prev':state.calendarDate=new Date(state.calendarDate.getFullYear(),state.calendarDate.getMonth()-1,1);render();break;
 case 'month-next':state.calendarDate=new Date(state.calendarDate.getFullYear(),state.calendarDate.getMonth()+1,1);render();break;
 case 'today':state.selectedDate=localDate();state.weekStart=startOfWeek(localDate());state.calendarDate=new Date();render();break;
 case 'search-open':state.searchOpen=true;render();document.querySelector('#task-search')?.focus();break;
 case 'edit-task':if(task)openForm(task);break;
 case 'delete-task':if(task&&confirm(`確定要刪除「${task.title}」嗎？`)){state.tasks=state.tasks.filter(t=>t.id!==id);save();showToast('任務已刪除');}break;
 case 'open-task-menu':if(task){const choice=prompt(`任務：${task.title}\n輸入 1 編輯、2 刪除，或取消`);if(choice==='1')openForm(task);else if(choice==='2')handleAction('delete-task',el);}break;
 case 'add-subtask':{const list=document.querySelector('[data-subtask-list]');const current=list.querySelectorAll('.subtask-edit-row').length;if(current>=100){setError('subtasks','每項任務最多可新增 100 個子任務。');break;}list.querySelector('.subtask-placeholder')?.remove();const sid=uid('s');list.insertAdjacentHTML('beforeend',`<div class="subtask-edit-row"><span class="subtask-grip">${icon('grip',14)}</span><input class="subtask-edit-input" maxlength="100" placeholder="子任務 ${current+1}" data-subtask-id="${sid}"/><button type="button" class="subtask-remove" data-action="remove-subtask" data-id="${sid}" aria-label="刪除子任務">${icon('x',14)}</button></div>`);document.querySelector(`[data-subtask-id="${sid}"]`)?.focus();document.querySelector('[data-subtask-count]').textContent=`${current+1} / 100`;break;}
 case 'remove-subtask':{const row=el.closest('.subtask-edit-row');if(row?.querySelector('[data-subtask-id]')?.dataset.subtaskId)row.remove();if(document.querySelectorAll('.subtask-edit-row').length===0)document.querySelector('[data-subtask-list]').innerHTML='<div class="subtask-placeholder">把大目標，拆成幾個小步驟。</div>';document.querySelector('[data-subtask-count]').textContent=`${document.querySelectorAll('.subtask-edit-row').length} / 100`;break;}
 case 'reset-data':if(confirm('將任務資料重設為原始示範內容？此操作會清除目前在本瀏覽器儲存的任務。')){clearTasks();state.tasks=seedTasks.map(t=>({...t,subtasks:t.subtasks.map(s=>({...s}))}));state.collapsed.complete=true;state.selectedDate=localDate();state.weekStart=startOfWeek(localDate());render();showToast('示範資料已重設');}break;
 case 'timer-toggle':if(state.pomodoro.running){clearInterval(state.timerInterval);state.pomodoro.running=false;state.pomodoro.seconds=0;}else{state.pomodoro.running=true;state.pomodoro.seconds=state.pomodoro.minutes*60;state.timerInterval=setInterval(()=>{state.pomodoro.seconds--;const target=document.querySelector('[data-timer]');if(target){const n=Math.max(0,state.pomodoro.seconds);target.textContent=`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}if(state.pomodoro.seconds<=0){clearInterval(state.timerInterval);state.pomodoro.running=false;showToast('專注時段完成，休息一下吧！');}},1000);}render();break;
 case 'timer-reset':clearInterval(state.timerInterval);state.pomodoro.running=false;state.pomodoro.seconds=0;render();break;
 case 'timer-settings':{const value=prompt('設定專注時間（分鐘）',String(state.pomodoro.minutes));const n=Number(value);if(value!==null&&Number.isInteger(n)&&n>0&&n<=180){state.pomodoro.minutes=n;state.pomodoro.seconds=0;render();}else if(value!==null)showToast('請輸入 1–180 的整數分鐘');break;}
 case 'toggle-sidebar':state.sidebarOpen=!state.sidebarOpen;render();break;
 case 'close-sidebar':state.sidebarOpen=false;render();break;
 case 'jump-complete':state.collapsed.complete=false;render();document.querySelector('.complete')?.scrollIntoView({behavior:'smooth'});break;
 case 'all-tasks':state.selectedDate='';render();break;
 case 'search':state.searchOpen=true;render();document.querySelector('#task-search')?.focus();break;
 case 'close-search':state.searchOpen=false;state.searchQuery='';render();break;
 }}
function setError(name,text){const node=document.querySelector(`[data-error="${name}"]`);if(node)node.textContent=text;}
app.addEventListener('click',e=>{const card=e.target.closest('.task-card');if(card&&e.target.closest('[data-action="toggle-subtask-list"]')){const task=state.tasks.find(t=>t.id===card.dataset.taskId);if(task)task.subtasksOpen=!task.subtasksOpen;render();return;}const actionEl=e.target.closest('[data-action]');if(!actionEl)return;if(actionEl.dataset.action==='backdrop-close'&&(e.target!==actionEl||!state.formOpen))return;handleAction(actionEl.dataset.action,actionEl);});
app.addEventListener('submit',e=>{if(e.target.id!=='task-form')return;e.preventDefault();const form=e.target;const data=new FormData(form);const title=String(data.get('title')||'').trim();const dueDate=String(data.get('dueDate')||'');const rawReward=String(data.get('reward')??'');const reward=Number(rawReward);let valid=true;if(!title){setError('title','請先為任務取個名字。');valid=false;}if(!dueDate){setError('dueDate','請選擇截止日期。');valid=false;}if(rawReward===''||!Number.isInteger(reward)||reward<0){setError('reward','請輸入大於或等於 0 的整數。');valid=false;}if(!valid)return;const rows=[...form.querySelectorAll('.subtask-edit-row')];if(rows.length>100){setError('subtasks','每項任務最多 100 個子任務。');return;}const existing=state.editing?.subtasks||[];const subtasks=rows.map(row=>{const sid=row.querySelector('.subtask-edit-input').dataset.subtaskId;const old=existing.find(s=>s.id===sid);return{id:sid||uid('s'),title:row.querySelector('.subtask-edit-input').value.trim(),done:old?.done||false};}).filter(s=>s.title);const values={title,description:String(data.get('description')||'').trim(),dueDate,dueTime:String(data.get('dueTime')||'23:59'),repeat:String(data.get('repeat')||'none'),reward,subtasks};if(state.editing){Object.assign(state.editing,values);state.tasks=[...state.tasks];state.formOpen=false;state.editing=null;save();showToast('任務已更新');}else{state.tasks.unshift({id:uid(),...values,completed:false,createdAt:new Date().toISOString()});state.formOpen=false;state.selectedDate=dueDate;state.weekStart=startOfWeek(dueDate);save();showToast('任務已建立，慢慢完成就好');}});
app.addEventListener('input',e=>{if(e.target.classList.contains('subtask-edit-input')&&state.editing?.id){const sub=state.editing.subtasks?.find(s=>s.id===e.target.dataset.subtaskId);if(sub)sub.title=e.target.value;}if(e.target.id==='task-title')setError('title','');if(e.target.id==='task-date')setError('dueDate','');if(e.target.id==='task-reward')setError('reward','');if(e.target.id==='task-search'){state.searchQuery=e.target.value;const q=state.searchQuery.toLowerCase();render();document.querySelector('#task-search')?.focus();document.querySelector('#task-search')?.setSelectionRange(q.length,q.length);}});
app.addEventListener('keydown',e=>{if(e.key==='Escape'){if(state.formOpen)closeForm();else if(state.sidebarOpen){state.sidebarOpen=false;render();}}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();state.searchOpen=true;render();document.querySelector('#task-search')?.focus();}if(e.key==='n'&&!state.formOpen&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){e.preventDefault();openForm();}});
export function renderApp(){render();}
render();











