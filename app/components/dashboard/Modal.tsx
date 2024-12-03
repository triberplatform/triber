import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black shadow-md shadow-white border-white border rounded-lg p-6 w-11/12 max-w-[40rem]">
        <h2 className="text-lg text-left font-bold mb-4">{title}</h2>
        <p className="mb-6 text-left">{message}</p>
        <button
          onClick={onClose}
          className="py-2 px-4 bg-mainGreen text-right text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
