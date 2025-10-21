import React from "react";
import { MessageCircle } from "lucide-react";

const MessengerButton = () => {
  // Replace this with your actual Facebook Page ID or Messenger link
  const FACEBOOK_PAGE_ID = "CAMCOContainerHouseCDO"; // Your Facebook page username
  const MESSENGER_LINK = `https://m.me/${FACEBOOK_PAGE_ID}`;

  const handleClick = () => {
    window.open(MESSENGER_LINK, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        className="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center"
        aria-label="Chat with us on Messenger"
      >
        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-30 animate-ping"></div>

        {/* Messenger Icon */}
        <svg
          className="h-8 w-8 relative z-10 group-hover:scale-110 transition-transform duration-200"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.912 1.446 5.51 3.707 7.227V22l3.398-1.866c.906.25 1.87.383 2.895.383 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm1.093 12.45l-2.546-2.714-4.967 2.714 5.464-5.798 2.607 2.714L18.618 8.85l-5.525 5.6z" />
        </svg>

        {/* Online indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-20 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
          Chat with us on Messenger
          <div className="absolute -bottom-1 right-6 w-2 h-2 bg-slate-900 transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default MessengerButton;
