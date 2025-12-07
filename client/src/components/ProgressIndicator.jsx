import React from 'react';

const ProgressIndicator = ({ todos }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.is_completed).length;
  const pendingTodos = totalTodos - completedTodos;
  
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="bg-white rounded-lg border border-[#e9d8fd] p-5 mb-5 box-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-black">Progress Overview</h3>
        <span className="text-2xl font-bold text-[#9e4aff]">{completionPercentage}%</span>
      </div>
      
      <div className="h-3 bg-[#f5f3ff] rounded-full overflow-hidden mb-5">
        <div 
          className="h-full bg-[#9e4aff] rounded-full transition-all duration-300" 
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-center">
        <div className="flex-1">
          <span className="block text-xl font-bold text-black">{completedTodos}</span>
          <span className="block text-sm text-[#666666] mt-1">Completed</span>
        </div>
        <div className="flex-1">
          <span className="block text-xl font-bold text-black">{pendingTodos}</span>
          <span className="block text-sm text-[#666666] mt-1">Pending</span>
        </div>
        <div className="flex-1">
          <span className="block text-xl font-bold text-black">{totalTodos}</span>
          <span className="block text-sm text-[#666666] mt-1">Total</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;