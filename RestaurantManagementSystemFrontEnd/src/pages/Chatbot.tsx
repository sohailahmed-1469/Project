import React, { useState } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi 👋 I am your Restaurant AI Assistant!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });

      const data = await res.text();

      setMessages([
        ...updatedMessages,
        { role: "bot", text: data }
      ]);
    } catch {
      setMessages([
        ...updatedMessages,
        { role: "bot", text: "❌ Error connecting to server" }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* 💬 Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#8458ea",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          border: "none",
          fontSize: "22px",
          cursor: "pointer",
          zIndex: 9999
        }}
      >
        💬
      </button>

      {/* 📦 Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            height: "420px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "10px",
              background: "#8458ea",
              color: "white",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              fontWeight: "bold"
            }}
          >
            🍽️ AI Assistant
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              background: "#f5f5f5"
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background: msg.role === "user" ? "#DCF8C6" : "#fff",
                  padding: "8px",
                  borderRadius: "8px",
                  maxWidth: "70%"
                }}
              >
                {msg.text}
              </div>
            ))}

            {loading && <div style={{ fontStyle: "italic" }}>Typing...</div>}
          </div>

          {/* Input */}
          <div style={{ display: "flex", padding: "8px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "8px",
                padding: "8px 12px",
                background: "#8458ea", // ✅ updated
                color: "white",
                border: "none",
                borderRadius: "6px"
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};