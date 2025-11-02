import React, { useState, useRef, useEffect } from "react";
import { FaRobot } from "react-icons/fa"; // Corregido: Usando Font Awesome para mayor compatibilidad

// URL del Webhook de n8n
const WEBHOOK_URL =
  "https://cristhian2004.app.n8n.cloud/webhook/e0e3c172-0aae-496b-8bcb-db9e38e28fdf/chat";

export default function N8nChatbot() {
  const [messages, setMessages] = useState([
    { id: 0, sender: "bot", text: "Hola — ¿en qué puedo ayudarte?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const listRef = useRef(null);
  const idRef = useRef(1); // -------------------- // ESTILOS (CSS-in-JS) // --------------------

  const styles = {
    header: {
      padding: "10px 14px",
      borderBottom: "1px solid #eee",
      fontWeight: 600,
      background: "#0b93f6",
      color: "white",
    },
    chatWindow: {
      padding: 12,
      height: 360,
      overflowY: "auto",
      background: "#fafafa",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    },
    userBubble: {
      alignSelf: "flex-end",
      background: "#0b93f6",
      color: "white",
      padding: "8px 12px",
      borderRadius: 12,
      maxWidth: "80%",
    },
    botBubble: {
      alignSelf: "flex-start",
      background: "#e5e5ea",
      color: "black",
      padding: "8px 12px",
      borderRadius: 12,
      maxWidth: "80%",
    },
    form: {
      display: "flex",
      gap: 8,
      padding: 10,
      borderTop: "1px solid #eee",
    },
    input: {
      flex: 1,
      padding: "8px 10px",
      borderRadius: 6,
      border: "1px solid #ccc",
    },
    button: {
      padding: "8px 12px",
      borderRadius: 6,
      border: "none",
      background: "#0b93f6",
      color: "white",
      cursor: "pointer",
    },
  };

  useEffect(() => {
    // Desplazamiento automático al final del chat
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(e) {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text) return; // Agregar mensaje del usuario

    const userId = idRef.current++;
    const userMsg = { id: userId, sender: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      let botText;
      let errorDetails = "";

      // 1. Verificar si la respuesta fue exitosa (código 2xx)
      if (!res.ok) {
        // Si no es exitosa, intentar obtener el cuerpo de la respuesta para el detalle del error
        try {
          errorDetails = await res.text();
        } catch {
          errorDetails = `Error HTTP ${res.status}`;
        }
        throw new Error(
          `n8n devolvió un error: ${res.status} ${
            res.statusText
          }. Detalles: ${errorDetails.substring(0, 100)}...`
        );
      } // 2. Intentar parsear como JSON y extraer el mensaje

      try {
        const data = await res.json();
        botText =
          data?.reply ||
          data?.response ||
          data?.message ||
          JSON.stringify(data); // Si no encuentra las propiedades comunes, usa todo el objeto.
      } catch (jsonError) {
        // Si falla el parseo de JSON, usa la respuesta como texto plano
        botText = await res.text();
        if (!botText.trim()) {
          botText = "Respuesta vacía del bot. (Error de parseo JSON)";
        }
      } // Agregar mensaje del bot

      const botId = idRef.current++;
      setMessages((m) => [...m, { id: botId, sender: "bot", text: botText }]);
    } catch (err) {
      // Manejo de errores de red o de la lógica (res.ok = false)
      const errId = idRef.current++;
      console.error("Error al enviar mensaje:", err);
      setMessages((m) => [
        ...m,
        {
          id: errId,
          sender: "bot",
          text: `Error: No se pudo obtener la respuesta. Revise su flujo de n8n. Detalle: ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
            {/* Botón flotante del chatbot */}     {" "}
      <div
        onClick={() => setOpen(!open)}
        // Añadimos aria-label para accesibilidad
        aria-label={open ? "Cerrar Chatbot" : "Abrir Chatbot"}
        className="fixed bottom-28 right-6 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 
                   bg-white rounded-full shadow-lg flex items-center justify-center 
                   cursor-pointer hover:scale-110 transition-transform duration-300"
        style={{ zIndex: 1000 }}
      >
               {" "}
        <FaRobot className="text-4xl sm:text-5xl md:text-6xl text-blue-600" /> 
           {" "}
      </div>
            {/* Ventana flotante del chat */}     {" "}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "130px", // Más arriba del carrito
            right: "24px",
            width: "360px",
            maxWidth: "90vw",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
                    <div style={styles.header}>Chat n8n</div>         {" "}
          <div style={styles.chatWindow} ref={listRef}>
                       {" "}
            {messages.map((m) => (
              <div
                key={m.id}
                style={
                  m.sender === "user" ? styles.userBubble : styles.botBubble
                }
              >
                                {m.text}             {" "}
              </div>
            ))}
                       {" "}
            {loading && <div style={styles.botBubble}>Escribiendo...</div>}     
               {" "}
          </div>
                   {" "}
          <form onSubmit={sendMessage} style={styles.form}>
                       {" "}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              style={styles.input}
              disabled={loading}
            />
                       {" "}
            <button
              type="submit"
              style={styles.button}
              disabled={loading || !input.trim()}
            >
                            Enviar            {" "}
            </button>
                     {" "}
          </form>
                 {" "}
        </div>
      )}
         {" "}
    </>
  );
}
