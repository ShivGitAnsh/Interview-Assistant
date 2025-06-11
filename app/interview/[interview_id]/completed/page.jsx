'use client';

import React from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

function InterviewComplete() {
  const handleCloseTab = () => {
    // Attempt to close the tab (works if opened via window.open())
    if (!window.close()) {
      // Fallback for tabs that can't be closed programmatically
      alert('You can safely close this tab now');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative">
      {/* Close Button (Top Right Corner) */}
      <button 
        onClick={handleCloseTab}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close interview"
      >
        <FaTimes className="text-xl" />
      </button>

      {/* Main Content */}
      <div className="text-center max-w-md mx-auto">
        {/* Green Checkmark */}
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6 animate-bounce" />
        
        {/* Completion Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Interview Completed!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for completing the interview. You can now close this window.
        </p>
      </div>
    </div>
  );
}

export default InterviewComplete;
