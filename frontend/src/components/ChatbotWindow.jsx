import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatbotWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 ¡Hola! Soy el asistente de **ARQUITEC** 🏗️. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/essential/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error("Error al conectar con el servidor");

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: data.reply || "⚠️ No se recibió respuesta del servidor.",
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ No pude responder. Intenta más tarde." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl w-80 md:w-96 h-[460px] flex flex-col overflow-hidden border border-gray-200 z-[60]">
      {/* Header */}
      <div className="bg-teal-600 text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold">ARQUITEC Asistente 🤖</h3>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition"
        >
          ✕
        </button>
      </div>

      {/* Chat */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-xl text-sm leading-relaxed max-w-[90%] ${
              msg.from === "bot"
                ? "bg-white text-gray-800 shadow-sm self-start"
                : "bg-teal-500 text-white self-end ml-auto"
            }`}
          >
            {/* ✅ Renderizado seguro sin usar className directo */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p style={{ marginBottom: "0.4rem" }}>{children}</p>
                ),
                table: ({ children }) => (
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        fontSize: "0.85rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th
                    style={{
                      border: "1px solid #ccc",
                      padding: "4px 6px",
                      background: "#f4f4f4",
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "4px 6px",
                    }}
                  >
                    {children}
                  </td>
                ),
                img: ({ ...props }) => (
                  <img
                    {...props}
                    style={{
                      maxWidth: "100%",
                      borderRadius: "0.5rem",
                      margin: "4px 0",
                    }}
                    alt={props.alt || ""}
                  />
                ),
              }}
            >
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}

        {loading && (
          <p className="text-gray-500 text-sm animate-pulse">Escribiendo...</p>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatbotWindow;
