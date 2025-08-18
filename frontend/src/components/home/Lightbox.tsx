// src/components/Lightbox.tsx
import React from 'react';
import { X } from 'lucide-react'; // Import the close icon from lucide-react

interface LightboxProps {
  imageUrl: string | null;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
      onClick={onClose} // Close when clicking outside the image
    >
      <div
        className="relative max-w-full max-h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image container
      >
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 z-50 p-2 bg-gray-800 rounded-full"
          onClick={onClose}
          aria-label="Close image"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={imageUrl}
          alt="Expanded view"
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-fade-in"
          style={{ animationDuration: '0.3s' }}
        />
      </div>
    </div>
  );
};

export default Lightbox;