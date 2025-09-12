import React, { useState, useCallback } from 'react';

// --- Helper Components ---

const PlusIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

// CHANGED: TaskRow now has an empty 6th cell to match the new header
const TaskRow = ({ task, onAddClick, onUpdateTask }) => {
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentText, setCommentText] = useState(task.comment || '');
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [scoreText, setScoreText] = useState(task.score || '');

  const handleStatusChange = (newStatus) => {
    onUpdateTask({ ...task, status: newStatus });
  };

  const handleCommentSave = () => {
    onUpdateTask({ ...task, comment: commentText });
    setIsEditingComment(false);
  };

  const handleCommentCancel = () => {
    setCommentText(task.comment || '');
    setIsEditingComment(false);
  };

  const handleScoreSave = () => {
    onUpdateTask({ ...task, score: scoreText });
    setIsEditingScore(false);
  };

  const handleScoreCancel = () => {
    setScoreText(task.score || '');
    setIsEditingScore(false);
  };
  
  if (task.name.startsWith('+ Add')) {
      return (
          <tr 
            onClick={onAddClick} 
            className="border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
          >
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3 text-sm text-blue-600 flex items-center space-x-2 whitespace-nowrap">
                  <PlusIcon className="w-4 h-4" />
                  <span>{task.name.replace('+ ', '')}</span>
              </td>
              <td colSpan="4"></td>
          </tr>
      );
  }

  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="px-4 py-3 text-sm text-gray-500">{task.id}</td>
      <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">{task.name}</td>
      <td className="px-4 py-3 text-sm text-gray-500">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="bg-transparent border-0 text-sm text-gray-500 focus:ring-0 p-0 font-normal"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Not Completed">Not Completed</option>
        </select>
      </td>
      <td className="px-4 py-3">
        {isEditingComment ? (
          <div className="flex items-center space-x-1">
            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} className="text-sm border border-gray-300 rounded px-2 py-1 flex-1 font-normal" autoFocus />
            <button onClick={handleCommentSave} className="px-2 py-1 text-xs bg-blue-600 text-white rounded">Save</button>
            <button onClick={handleCommentCancel} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">Cancel</button>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-800">{task.comment || ''}</span>
            <button onClick={() => setIsEditingComment(true)} className="text-xs text-blue-600 hover:text-blue-800 ml-2">{task.comment ? 'Edit' : 'Add Comment'}</button>
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        {isEditingScore ? (
          <div className="flex items-center space-x-1">
            <input type="text" value={scoreText} onChange={(e) => setScoreText(e.target.value)} className="text-sm border border-gray-300 rounded px-2 py-1 flex-1 font-normal" autoFocus />
            <button onClick={handleScoreSave} className="px-2 py-1 text-xs bg-blue-600 text-white rounded">Save</button>
            <button onClick={handleScoreCancel} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">Cancel</button>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-800 font-semibold">{task.score || ''}</span>
            <button onClick={() => setIsEditingScore(true)} className="text-xs text-blue-600 hover:text-blue-800 ml-2">{task.score ? 'Edit' : 'Add Score'}</button>
          </div>
        )}
      </td>
      {/* Empty cell for the 'Actions' column in display rows */}
      <td className="px-4 py-3"></td>
    </tr>
  );
};

// CHANGED: AddTaskRow is now split into 6 cells
const AddTaskRow = ({ onAddTask, onCancel, category }) => {
    const [taskName, setTaskName] = useState('');
    const [taskStatus, setTaskStatus] = useState('Pending');
    const [taskComment, setTaskComment] = useState('');
    const [taskScore, setTaskScore] = useState('');
    
    const handleAdd = () => {
        if (taskName.trim()) {
            onAddTask({ name: taskName, status: taskStatus, comment: taskComment, score: taskScore });
            setTaskName(''); setTaskStatus('Pending'); setTaskComment(''); setTaskScore('');
        }
    };

    const handleKeyDown = (event) => { if (event.key === 'Enter') { handleAdd(); } };

    return (
        <tr className="bg-blue-50">
            <td className="px-4 py-2"><div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full"><PlusIcon className="w-4 h-4" /></div></td>
            <td className="px-4 py-2"><input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} onKeyDown={handleKeyDown} placeholder={`New task for ${category}...`} className="w-full bg-transparent border-0 focus:ring-0 p-1 text-sm" autoFocus /></td>
            <td className="px-4 py-2"><select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)} className="bg-transparent border-0 text-sm text-gray-500 focus:ring-0 p-0"><option value="Pending">Pending</option><option value="Completed">Completed</option><option value="Not Completed">Not Completed</option></select></td>
            <td className="px-4 py-2"><input type="text" value={taskComment} onChange={(e) => setTaskComment(e.target.value)} onKeyDown={handleKeyDown} placeholder="Add comment..." className="w-full bg-transparent border-0 focus:ring-0 p-1 text-sm flex-1" /></td>
            <td className="px-4 py-2"><input type="text" value={taskScore} onChange={(e) => setTaskScore(e.target.value)} onKeyDown={handleKeyDown} placeholder="Add score..." className="w-full bg-transparent border-0 focus:ring-0 p-1 text-sm flex-1" /></td>
            <td className="px-4 py-2"><button onClick={onCancel} className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">Cancel</button></td>
        </tr>
    );
};

// CHANGED: TaskTable header now has 6 columns
const TaskTable = ({ title, tasks, onAddTask, onUpdateTask }) => {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddTask = (newTaskData) => {
        const realTasks = tasks.filter(t => !t.name.startsWith('+ Add'));
        const newId = realTasks.length > 0 ? Math.max(...realTasks.map(t => t.id)) + 1 : 1;
        const taskWithId = { id: newId, ...newTaskData };
        onAddTask(taskWithId);
        setIsAdding(false);
    };

    return (
        <table className="w-full">
            <thead>
                <tr className="bg-gray-50">
                    <th className="w-12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                    <th className="w-32 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="w-48 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                    <th className="w-24 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="w-24 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100"> 
                {tasks.map(task => ( <TaskRow key={task.id + task.name} task={task} onAddClick={() => setIsAdding(true)} onUpdateTask={onUpdateTask} /> ))}
                {isAdding && ( <AddTaskRow onAddTask={handleAddTask} onCancel={() => setIsAdding(false)} category={title} /> )}
            </tbody>
        </table>
    );
};

const getInitialDates = (numDays) => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < numDays; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formattedDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        dates.push({
            id: i,
            date: formattedDate,
            todayTasks: [{ id: 999, name: '+ Add to today', status: '', comment: '', score: '' }],
            emergencyTasks: [{ id: 9999, name: '+ Add to Emergency', status: '', comment: '', score: '' }],
        });
    }
    return dates;
};

export default function App() {
    const [days, setDays] = useState(getInitialDates(6));

    const handleAddTask = useCallback((dayId, taskType, newTask) => {
        setDays(currentDays => {
            return currentDays.map(day => {
                if (day.id === dayId) {
                    const addRow = day[taskType].find(t => t.name.startsWith('+ Add'));
                    const existingTasks = day[taskType].filter(t => !t.name.startsWith('+ Add'));
                    const updatedTasks = [...existingTasks, newTask, addRow];
                    return { ...day, [taskType]: updatedTasks };
                }
                return day;
            });
        });
    }, []);

    const handleUpdateTask = useCallback((dayId, taskType, updatedTask) => {
        setDays(currentDays => {
            return currentDays.map(day => {
                if (day.id === dayId) {
                    const updatedTasks = day[taskType].map(task => (task.id === updatedTask.id && !task.name.startsWith('+ Add')) ? updatedTask : task);
                    return { ...day, [taskType]: updatedTasks };
                }
                return day;
            });
        });
    }, []);

    const handleSubmitDay = (dayId) => {
        const dayToSubmit = days.find(day => day.id === dayId);
        console.log("Submitting data for:", dayToSubmit);
        alert(`Submitting all tasks for date: ${dayToSubmit.date}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase w-48">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">Today's Tasks</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">Emergency Tasks</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase w-40">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {days.map(day => (
                                <tr key={day.id}>
                                    <td className="px-6 py-4 align-top whitespace-nowrap text-center"><p className="font-semibold text-gray-800">{day.date}</p></td>
                                    <td className="p-0 align-top"><TaskTable title="Today's Tasks" tasks={day.todayTasks} onAddTask={(task) => handleAddTask(day.id, 'todayTasks', task)} onUpdateTask={(task) => handleUpdateTask(day.id, 'todayTasks', task)} /></td>
                                    <td className="p-0 align-top"><TaskTable title="Emergency Tasks" tasks={day.emergencyTasks} onAddTask={(task) => handleAddTask(day.id, 'emergencyTasks', task)} onUpdateTask={(task) => handleUpdateTask(day.id, 'emergencyTasks', task)} /></td>
                                    <td className="px-6 py-4 align-middle text-center"><button onClick={() => handleSubmitDay(day.id)} className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Submit Day</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
// import React, { useState, useCallback } from 'react';

// // --- Helper Components ---

// // SVG Icon for the plus symbol
// const PlusIcon = ({ className = "w-5 h-5" }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
//     <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
//   </svg>
// );

// // A single row for an existing task
// // TaskRow key={task.id} task={task} onAddClick={() => setIsAdding(true)}
// const TaskRow = ({ task, onAddClick, onUpdateTask }) => {
//   const [isEditingComment, setIsEditingComment] = useState(false);
//   const [commentText, setCommentText] = useState(task.comment || '');

//   const handleStatusChange = (newStatus) => {
//     onUpdateTask({ ...task, status: newStatus });
//   };

//   const handleCommentSave = () => {
//     onUpdateTask({ ...task, comment: commentText });
//     setIsEditingComment(false);
//   };

//   const handleCommentCancel = () => {
//     setCommentText(task.comment || '');
//     setIsEditingComment(false);
//   };

//   return (
//     <tr className="border-b border-gray-100 last:border-b-0">
//       <td className="px-4 py-3 text-sm text-gray-500">{task.id}</td>
//       <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">{task.name}</td>
//       <td className="px-4 py-3 text-sm text-gray-500">
//         <select
//           value={task.status}
//           onChange={(e) => handleStatusChange(e.target.value)}
//           className="bg-transparent border-0 text-sm text-gray-500 focus:ring-0 p-0"
//         >
//           <option value="Pending">Pending</option>
//           <option value="Completed">Completed</option>
//           <option value="Not Completed">Not Completed</option>
//         </select>
//       </td>
//       <td className="px-4 py-3">
//         {isEditingComment ? (
//           <div className="flex items-center space-x-1">
//             <input
//               type="text"
//               value={commentText}
//               onChange={(e) => setCommentText(e.target.value)}
//               className="text-sm border border-gray-300 rounded px-2 py-1 flex-1"
//               autoFocus
//             />
//             <button 
//               onClick={handleCommentSave}
//               className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
//             >
//               Save
//             </button>
//             <button 
//               onClick={handleCommentCancel}
//               className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         ) : task.comment ? (
//             //: Yeh ek JavaScript Ternary Operator hai, jo ek JSX Expression ke andar use ho raha hai.
//             //Matlab: Yeh JavaScript ka ek shortcut 'if-else' hai.
//             //task.comment ? : IF (Agar task.comment mein kuch hai...)
//             //(...) : THEN (...toh yeh wala code chalao.)
//             //: : ELSE (...warna...)
//             //(...) : (...yeh doosra wala code chalao.)
//             <div className="flex items-center space-x-1">
//               <span className="text-sm text-gray-800">{task.comment}</span>
//               <button 
//                 onClick={() => setIsEditingComment(true)}
//                 className="text-xs text-blue-600 hover:text-blue-800"
//               >
//                 Edit
//               </button>
//             </div>
//         ) : (
//             <button 
//                 onClick={onAddClick}
//                 className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200">
//                 <PlusIcon className="w-4 h-4" />
//                 <span>Add</span>
//             </button>
//         )}
//       </td>
//     </tr>
//   );
// };

// // The input row for adding a new task
// const AddTaskRow = ({ onAddTask, onCancel, category }) => {//   ya sb  tasktable se mil rha hai 
//     // onaddtask 
//     const [taskName, setTaskName] = useState('');
//     const [taskStatus, setTaskStatus] = useState('Pending');
//     const [taskComment, setTaskComment] = useState('');
    
//     const handleAdd = () => {
//         if (taskName.trim()) {
//             onAddTask({
//                 name: taskName,
//                 status: taskStatus,
//                 comment: taskComment
//                 // In a real app, status and comment would be handled here too
//             });
//             setTaskName('');
//             setTaskStatus('Pending');
//             setTaskComment('');
//         }
//     };

//     return (
//         <tr className="bg-gray-50">
//             <td className="px-4 py-2">
//                 <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full">
//                     <PlusIcon className="w-4 h-4" />
//                 </div>
//             </td>
//             <td className="px-4 py-2">
//                 <input
//                     type="text"
//                     value={taskName}
//                     onChange={(e) => setTaskName(e.target.value)}
//                     placeholder={`Add to ${category}...`}
//                     className="w-full bg-transparent border-0 focus:ring-0 p-1 text-sm"
//                     autoFocus
//                 />
//             </td>
//             <td className="px-4 py-2">
//                 <select
//                     value={taskStatus}
//                     onChange={(e) => setTaskStatus(e.target.value)}
//                     className="bg-transparent border-0 text-sm text-gray-400 italic focus:ring-0 p-0"
//                 >
//                     <option value="Pending">Pending</option>
//                     <option value="Completed">Completed</option>
//                     <option value="Not Completed">Not Completed</option>
//                 </select>
//             </td>
//             <td className="px-4 py-2">
//                 <div className="flex flex-col space-y-1">
//                     <input
//                         type="text"
//                         value={taskComment}
//                         onChange={(e) => setTaskComment(e.target.value)}
//                         placeholder="Add comment..."
//                         className="w-full bg-transparent border-0 focus:ring-0 p-1 text-sm"
//                     />
//                     <div className="flex items-center space-x-2">
//                         <button 
//                             onClick={handleAdd}
//                             className="px-4 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
//                         >
//                             Add
//                         </button>
//                         <button 
//                             onClick={onCancel}
//                             className="px-4 py-1 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-200"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             </td>
//         </tr>
//     );
// };


// // The table for a specific task category (e.g., "Today's Tasks")
// const TaskTable = ({ title, tasks, onAddTask, onUpdateTask }) => {// ya 3 cheez app may pass hogi  
//   // title=> jaise "Today's Tasks" ya "Emergency Tasks"
//   // tasks => details  of the task 
//   // onAddTask => jb koee naya aaya to tasktable update krna hai 
//     const [isAdding, setIsAdding] = useState(false);// isadding means abhi may form fill  kr rha  hu 
//     //  to true hoga  starting false means no new task is come 

//     const handleAddTask = (newTaskData) => {//  jb koee new task aays tb 
//         const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;// yaa jo aays hai usko 
//         // serial number deyna ka liya hai jo serial may bada hai usmay 1 add kr dey ga 
//         const taskWithDefaults = {
//             id: newId,// usko id de do 
//             status: 'Pending',// status shoow kr do 
//             comment: '', // ky comment show krna  hai 
//             ...newTaskData
//         };
//         onAddTask(taskWithDefaults);// sb ko ek may kr kr on addtasktask ko pakadaa  do
//         setIsAdding(false);// an new back ki  task ki entry ho  gee hai 
//     };

//     return (
//         <table className="w-full">
//             <thead className="bg-gray-50">
//                 <tr>
//                     <th className="w-12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
//                     <th className="w-24 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="w-40 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
//                 </tr>
//             </thead>
      
//             <tbody className="divide-y divide-gray-100"> 
//             {/* tasks.map ka matlab hai: 'List mein jitne bhi kaam hain, har ek kaam ke liye, screen par ek nayi line (row) banao.'" */}
//                 {tasks.map(task => <TaskRow key={task.id} task={task} onAddClick={() => setIsAdding(true)} onUpdateTask={onUpdateTask} />)}
//                 {/* task row  */}
//                 {isAdding && (
//                   //"AGAR isAdding waala switch ON (true) hai, TOH HI screen par naya task add karne wala form (<AddTaskRow>) dikhana."
//                     <AddTaskRow onAddTask={handleAddTask} onCancel={() => setIsAdding(false)} category={title} />
//                     //Jab tum kisi task ke aage + Add button dabate ho. Button dabte hi isAdding true ho jaata hai, aur yeh form screen par aa jaata hai.
//                 )}
//             </tbody>
//         </table>
//     );
// };

// // --- Main App Component ---

// // Function to get dates for the last few days
// const getInitialDates = (numDays) => {//  yaha hum jitma man utna unumber de skta hai 
//     const dates = [];
//     const today = new Date();// ya aaj ka date bata rha hai  aur usko hm ek box may band kr de rha hai 
//     for (let i = 0; i < numDays; i++) {
//         const date = new Date(today); // today wali box ka hm  cpoy banaa rha hai uska name dat rkh rha hai 
//         date.setDate(today.getDate() - i);// jo todya huaa hai uss may se hm - i   krr de rha hai 
//         const formattedDate = date.toLocaleDateString('en-US', {
//           // maya yaha se date banaa rha hu 
//             month: '2-digit',
//             day: '2-digit',
//             year: 'numeric'
//         });
//         dates.push({
//             id: i,
//             date: formattedDate,
//             todayTasks: [{ id: 1, name: '+ Add to today', status: 'Pending', comment: '' }],
//             emergencyTasks: [{ id: 1, name: '+ Add to Emergency', status: 'Pending', comment: '' }],//  array  hai 
//             // uss may object baana kr push kr de rha hai 
//         });// ek din ka sb kch baanaa kr   ek array may push kr de rha hai 
//     }
//     return dates;// return hm array ussmay oblect hai 
// };


// export default function App() {
//     const [days, setDays] = useState(getInitialDates(6));

//     const handleAddTask = useCallback((dayId, taskType, newTask) => {
//         setDays(currentDays => {
//             return currentDays.map(day => {
//                 if (day.id === dayId) {
//                     const updatedTasks = [...day[taskType], newTask];
//                     return { ...day, [taskType]: updatedTasks };
//                 }
//                 return day;
//             });
//         });
//     }, []);

//     const handleUpdateTask = useCallback((dayId, taskType, updatedTask) => {
//         setDays(currentDays => {
//             return currentDays.map(day => {
//                 if (day.id === dayId) {
//                     const updatedTasks = day[taskType].map(task => 
//                         task.id === updatedTask.id ? updatedTask : task
//                     );
//                     return { ...day, [taskType]: updatedTasks };
//                 }
//                 return day;
//             });
//         });
//     }, []);

//     return (
//         <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
//             <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//                 <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
//                     <table className="min-w-full">
//                         <thead className="bg-gray-100">
//                             <tr className="border-b border-gray-100">
//                                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider w-48">Date</th>
//                                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Today's Tasks</th>
//                                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Emergency Tasks</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {days.map(day => (
//                                 <tr key={day.id}>
//                                     <td className="px-6 py-4 align-top whitespace-nowrap text-center">
//                                         <p className="font-semibold text-gray-800">{day.date}</p>
//                                     </td>
//                                     <td className="p-4 align-top">
//                                         <TaskTable
//                                             title="Today's Tasks"
//                                             tasks={day.todayTasks}
//                                             onAddTask={(task) => handleAddTask(day.id, 'todayTasks', task)}
//                                             onUpdateTask={(task) => handleUpdateTask(day.id, 'todayTasks', task)}
//                                         />
//                                     </td>
//                                     <td className="p-4 align-top">
//                                         <TaskTable
//                                             title="Emergency Tasks"
//                                             tasks={day.emergencyTasks}
//                                             onAddTask={(task) => handleAddTask(day.id, 'emergencyTasks', task)}
//                                             onUpdateTask={(task) => handleUpdateTask(day.id, 'emergencyTasks', task)}
//                                         />
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </main>
//         </div>
//     );
// }