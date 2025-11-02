import React, { useState, useRef, useEffect } from "react";
// Importamos íconos de 'lucide-react', que es compatible con el entorno de React de archivo único.
import { Bot, Send, Loader2, Search } from "lucide-react";

// Parámetros para la función de retroceso exponencial (Exponential Backoff)
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

const Chatbot = () => {
  // La API key debe ser una cadena vacía ("") para que funcione en este entorno
  const API_KEY = "";
  // Usamos el modelo más reciente recomendado y la estructura de URL requerida.
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "¡Hola! Soy tu Asistente Gemini. Pregúntame lo que necesites, puedo buscar información en la web.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll automático al final del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Función auxiliar para mapear el historial al formato de la API y corregir la secuencia de roles.
  const historyToContents = (history) => {
    // La API de Gemini requiere que la conversación comience con el rol 'user'.
    // Si el primer mensaje es del 'bot' (nuestro saludo inicial), lo omitimos
    // de la carga útil de la API, pero lo mantenemos en la UI.
    const conversation = history[0].role === "bot" ? history.slice(1) : history;

    return conversation.map((msg) => ({
      role: msg.role === "user" ? "user" : "model", // Los roles de la API son "user" y "model"
      parts: [{ text: msg.text }],
    }));
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", text: input };
    // 1. Agrega el mensaje del usuario al historial
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // 2. Prepara el historial completo para la API, OMITIENDO el saludo inicial del bot si existe.
    const history = [...messages, userMessage];
    const contents = historyToContents(history);

    // Payload de la API, ahora incluye la herramienta de Google Search
    const payload = {
      contents: contents,
      tools: [{ google_search: {} }],
    };

    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          const botText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No pude procesar tu mensaje 😅. Intenta de nuevo.";

          // 3. Agrega la respuesta del bot al historial
          setMessages((prev) => [...prev, { role: "bot", text: botText }]);
          setIsLoading(false);
          return; // Éxito, salir de la función
        } else if (response.status === 429 || response.status >= 500) {
          // Reintentar en caso de Rate Limit o error del servidor
          const delay = BASE_DELAY_MS * 2 ** i + Math.random() * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          // Error no reintentable (ej. 400 Bad Request debido a formato o autenticación)
          const errorDetails = await response.text();
          console.error(
            `Error no reintentable (${response.status}): ${errorDetails}`
          );
          throw new Error(`Error no reintentable: ${response.status}`);
        }
      } catch (error) {
        if (i === MAX_RETRIES - 1) {
          console.error(
            "Gemini API Error después de varios reintentos:",
            error
          );
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              text: "Ocurrió un error grave al conectar con la IA. Por favor, verifica tu conexión o intenta más tarde.",
            },
          ]);
          setIsLoading(false);
          return; // Error final, salir
        }
      }
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 sm:w-16 sm:h-16 
                           bg-teal-600 rounded-full shadow-2xl flex items-center justify-center 
                           cursor-pointer hover:scale-105 transition-transform duration-300 transform hover:shadow-teal-500/50"
        style={{ zIndex: 1000 }}
      >
        {/* Ícono de Robot compatible */}
        <Bot className="text-white w-2/3 h-2/3" />
      </div>

      {/* Ventana del chatbot */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-full max-w-sm h-[80vh] max-h-[500px] 
                               bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 transform transition-all duration-300 ease-in-out"
          style={{ zIndex: 1100 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 flex justify-between items-center shadow-md">
            <span className="font-extrabold text-lg flex items-center">
              {/* Ícono de Robot compatible */}
              <Search className="mr-2 h-5 w-5" /> Asistente con búsqueda
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold hover:text-teal-200"
            >
              &times;
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] text-sm shadow-md ${
                    msg.role === "user"
                      ? "bg-teal-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Indicador de carga */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-xl max-w-[85%] bg-white text-gray-800 text-sm shadow-md border border-gray-200 flex items-center">
                  {/* Ícono de Spinner compatible */}
                  <Loader2 className="animate-spin mr-2 h-4 w-4 text-teal-500" />
                  <span>Buscando y respondiendo...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input y Botón de Envío */}
          <div className="flex items-center p-3 border-t border-gray-200 bg-white">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !isLoading && sendMessage()
              }
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className={`ml-2 p-3 rounded-full transition duration-150 shadow-md ${
                isLoading || !input.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-teal-500 text-white hover:bg-teal-600"
              }`}
            >
              {/* Ícono de Papel Avión compatible */}
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
