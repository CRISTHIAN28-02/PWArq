import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatbotWindow from "./ChatbotWindow";

const ChatbotButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón flotante del chatbot */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-40 right-6 bg-teal-600 hover:bg-teal-700 text-white p-6 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50"
      >
        {open ? <X size={34} /> : <MessageCircle size={34} />}
      </button>

      {/* Ventana del chat */}
      {open && <ChatbotWindow onClose={() => setOpen(false)} />}
    </>
  );
};

export default ChatbotButton;
