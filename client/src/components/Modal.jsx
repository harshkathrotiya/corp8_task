import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] overflow-hidden p-2 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-lg border border-[#e9d8fd] w-full max-w-md mx-2 sm:mx-4 max-h-[90vh] overflow-visible relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-[#e9d8fd]">
          <h2 className="text-lg sm:text-xl font-semibold text-black m-0">{title}</h2>
          <button className="text-[#666666] hover:text-black text-xl sm:text-2xl bg-none border-none cursor-pointer transition-all duration-200 hover:rotate-90" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="p-4 sm:p-5 outline-none max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;