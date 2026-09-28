import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("cineverse_chat");
        return saved ? JSON.parse(saved) : [{ role: "ai", text: "Hello! I am CineVerse AI. 🤖\n\nI can help you check movie showtimes, theatre locations, and seat availability. Try asking: 'Is Thalapathi available in Ram Theatre?'" }];
    });
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("cineverse_chat", JSON.stringify(messages));
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:5000/api/ai/chat",
                { message: currentInput },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessages(prev => [...prev, { role: "ai", text: res.data.reply }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: "ai", text: "I'm having a bit of a technical glitch. Please make sure you're logged in and try again! 🛠️" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 99999, fontFamily: "inherit" }}>
            <style>{`
                @keyframes bounceIn {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes slideInUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .ai-msg {
                    align-self: flex-start;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #fff;
                    border-radius: 15px 15px 15px 2px;
                }
                .user-msg {
                    align-self: flex-end;
                    background: var(--accent-primary, #F53966);
                    color: #fff;
                    border-radius: 15px 15px 2px 15px;
                    box-shadow: 0 4px 15px rgba(245, 57, 102, 0.3);
                }
            `}</style>

            {/* Chat Trigger Button */}
            {!isOpen && (
                <div
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: "65px",
                        height: "65px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--accent-primary, #F53966), #c2185b)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                        cursor: "pointer",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(245, 57, 102, 0.3)",
                        animation: "bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        transition: "all 0.3s ease",
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
                        e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.6), 0 0 30px rgba(245, 57, 102, 0.5)";
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = "scale(1) rotate(0)";
                        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(245, 57, 102, 0.3)";
                    }}
                >
                    🤖
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: "380px",
                    height: "550px",
                    background: "rgba(10, 15, 25, 0.95)",
                    backdropFilter: "blur(25px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "24px",
                    boxShadow: "0 25px 80px rgba(0,0,0,0.8)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    animation: "slideInUp 0.4s ease-out"
                }}>
                    {/* Header */}
                    <div style={{
                        padding: "20px 25px",
                        background: "rgba(255, 255, 255, 0.03)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 10px #4ade80" }}></div>
                            <span style={{ fontWeight: "800", fontSize: "1.1rem", color: "#fff", letterSpacing: "1px" }}>CineVerse AI</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "1.5rem", cursor: "pointer", transition: "color 0.2s" }}
                            onMouseOver={e => e.currentTarget.style.color = "#fff"}
                            onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                        >✕</button>
                    </div>

                    {/* Chat Messages */}
                    <div ref={chatRef} style={{
                        flex: 1,
                        padding: "20px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                        scrollbarWidth: "none"
                    }}>
                        {messages.map((m, i) => (
                            <div key={i} className={m.role === "ai" ? "ai-msg" : "user-msg"} style={{
                                padding: "12px 18px",
                                maxWidth: "80%",
                                fontSize: "0.95rem",
                                lineHeight: "1.5",
                                whiteSpace: "pre-wrap"
                            }}>
                                {m.text}
                            </div>
                        ))}
                        {loading && (
                            <div className="ai-msg" style={{ padding: "12px 18px", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
                                CineVerse AI is thinking...
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: "20px",
                        background: "rgba(0,0,0,0.2)",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        display: "flex",
                        gap: "10px"
                    }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={e => e.key === "Enter" && handleSend()}
                            placeholder="Type your question..."
                            style={{
                                flex: 1,
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "12px",
                                padding: "12px 15px",
                                color: "#fff",
                                outline: "none",
                                fontSize: "0.95rem"
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            style={{
                                width: "45px",
                                height: "45px",
                                borderRadius: "12px",
                                background: "var(--accent-primary, #F53966)",
                                border: "none",
                                color: "#fff",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                opacity: loading || !input.trim() ? 0.5 : 1,
                                transition: "all 0.2s"
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChat;
