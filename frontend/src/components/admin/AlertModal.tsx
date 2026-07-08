import React from 'react';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
  type?: 'success' | 'error' | 'info';
}

export default function AlertModal({
  isOpen,
  title,
  message,
  onClose,
  buttonText = 'OK',
  type = 'info'
}: AlertModalProps) {
  if (!isOpen) return null;

  const buttonColors = {
    success: 'bg-[#5795A7] hover:bg-[#437583] text-white',
    error: 'bg-red-600 hover:bg-red-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className={`px-6 py-2 font-medium rounded-lg transition shadow-sm ${buttonColors[type]}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
