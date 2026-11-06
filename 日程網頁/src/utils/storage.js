const STORAGE_KEY = 'daymark.tasks.v1';
export function loadTasks() {
  try { const raw=localStorage.getItem(STORAGE_KEY); const value=raw?JSON.parse(raw):null; return Array.isArray(value)?value:null; }
  catch { return null; }
}
export function saveTasks(tasks) { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
export function clearTasks() { localStorage.removeItem(STORAGE_KEY); }
export const seedTasks = [
 {id:'seed-1',title:'完成期末專題提案',description:'整理研究問題與預計執行時程，完成提案初稿。',dueDate:'2026-11-06',dueTime:'23:59',repeat:'none',reward:80,subtasks:[{id:'s-11',title:'確認研究題目與範圍',done:true},{id:'s-12',title:'整理相關文獻',done:false},{id:'s-13',title:'撰寫研究方法',done:false}],completed:false,createdAt:'2026-11-05T09:00:00.000Z'},
 {id:'seed-2',title:'閱讀系統分析第三章',description:'複習需求分析與系統建模的重點。',dueDate:'2026-11-06',dueTime:'18:30',repeat:'none',reward:40,subtasks:[{id:'s-21',title:'閱讀課本內容',done:false},{id:'s-22',title:'整理課堂筆記',done:false}],completed:false,createdAt:'2026-11-05T10:00:00.000Z'},
 {id:'seed-3',title:'晨間伸展與散步',description:'用一段輕鬆的步行為新的一天暖身。',dueDate:'2026-11-06',dueTime:'08:00',repeat:'daily',reward:15,subtasks:[],completed:true,completedAt:'2026-11-06T00:28:00.000Z',createdAt:'2026-11-01T08:00:00.000Z'},
 {id:'seed-4',title:'繳交英文課作業',description:'上傳本週英文閱讀心得至課程平台。',dueDate:'2026-11-05',dueTime:'21:00',repeat:'none',reward:30,subtasks:[],completed:false,createdAt:'2026-11-04T09:00:00.000Z'},
 {id:'seed-5',title:'整理今日上課筆記',description:'將重點整理成日後複習時好查找的格式。',dueDate:'2026-11-06',dueTime:'20:00',repeat:'none',reward:25,subtasks:[{id:'s-51',title:'整理系統分析',done:true},{id:'s-52',title:'複習作業研究',done:true}],completed:true,completedAt:'2026-11-06T03:30:00.000Z',createdAt:'2026-11-06T02:00:00.000Z'},
 {id:'seed-6',title:'規劃下週讀書進度',description:'先確認各科作業和考試時間，再安排每日目標。',dueDate:'2026-11-09',dueTime:'19:00',repeat:'weekly',reward:35,subtasks:[],completed:false,createdAt:'2026-11-06T03:00:00.000Z'}
];
