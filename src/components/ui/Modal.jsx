import React, { useEffect, useRef } from 'react';
import Button from './Button';

/**
 * Modal component for popup dialogs
 * - Creates an overlay with a focus-trapped dialog
 * - Can be closed by clicking outside, pressing ESC, or with close button
 * - Animates in/out smoothly
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = "",
  showCloseButton = true
}) => {
  const modalRef = useRef(null);
  
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Focus trap and body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Save the previous active element to restore focus later
      const previousActiveElement = document.activeElement;
      
      // Focus the modal when it opens
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore focus when modal closes
        if (previousActiveElement) {
          previousActiveElement.focus();
        }
        
        // Re-enable scrolling
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);
  
  // Handle outside click
  const handleOverlayClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div 
      className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`modal-content bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="modal-header flex justify-between items-center p-4 border-b">
          <h3 id="modal-title" className="text-xl font-semibold">{title}</h3>
          {showCloseButton && (
            <button
              className="modal-close text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="modal-body p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;