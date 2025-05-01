import React from 'react';
import { IoClose, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-70" onClick={onClose}></div>
      <div className="relative bg-zinc-900 rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <IoClose size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  actionText: string;
  actionButtonClass: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  actionText,
  actionButtonClass
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-6">
        <p className="text-white">Are you sure you want to {actionText.toLowerCase()} this proposal?</p>
        <div className="flex gap-4">
          <button 
            onClick={onClose} 
            className="flex-1 py-2 px-4 bg-zinc-800 rounded-md hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className={`flex-1 py-2 px-4 rounded-md ${actionButtonClass}`}
          >
            {actionText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isSuccess: boolean;
}

export const StatusModal: React.FC<StatusModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message,
  isSuccess
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center gap-4 py-4">
        {isSuccess ? (
          <IoCheckmarkCircle className="text-green-500" size={48} />
        ) : (
          <IoCloseCircle className="text-red-500" size={48} />
        )}
        <p className="text-center">{message}</p>
        <button 
          onClick={onClose} 
          className="mt-4 py-2 px-6 bg-mainGreen rounded-md hover:bg-green-600 text-white"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};