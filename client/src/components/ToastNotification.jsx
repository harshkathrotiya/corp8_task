import React from 'react';

const ToastNotification = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d]';
      case 'error':
        return 'bg-[#fee2e2] border border-[#fecaca] text-[#b91c1c]';
      case 'warning':
        return 'bg-[#fef3c7] border border-[#fde68a] text-[#b45309]';
      default:
        return 'bg-[#ede9fe] border border-[#c4b5fd] text-black';
    }
  };

  return (
    <div className={`${getTypeClass()} flex justify-between items-center p-3 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)] min-w-[300px] max-w-md animate-slide-in`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-xl ml-3 bg-none border-none cursor-pointer p-0 opacity-70 transition-all duration-200 hover:opacity-100 hover:scale-110">&times;</button>
    </div>
  );
};

export default ToastNotification;