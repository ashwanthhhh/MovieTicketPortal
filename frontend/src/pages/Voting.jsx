import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Voting() {
    const { user } = useContext(AuthContext);
    const [vote, setVote] = useState(null);
    const [moviesList, setMoviesList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef(null);

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/movies?status=upcoming");
                const data = await res.json();
                if (data && data.length > 0) {
                    setMoviesList(data.map(m => ({
                        id: m._id,
                        name: m.title,
                        img: m.image || m.img || "/images/voting/default.jpg",
                        votes: m.votesCount || 0,
                        type: "Re-release"
                    })));
                } else {
                    // Fallback to mock data if empty
                    setMoviesList([
                        { id: 1, name: "Sivaji: The Boss", img: "/images/voting/sivaji.webp", votes: 45, type: "Re-release" },
                        { id: 2, name: "Vettaiyaadu Vilaiyaadu", img: "/images/voting/vv.webp", votes: 32, type: "Re-release" },
                        { id: 3, name: "Paiyaa", img: "/images/voting/paiyaa.jpg", votes: 12, type: "Re-release" },
                        { id: 4, name: "Vinnaithaandi Varuvaayaa", img: "/images/voting/vtv.jpg", votes: 11, type: "Re-release" },
                        { id: 5, name: "Billa", img: "/images/voting/billa.jpg", votes: 20, type: "Re-release" }
                    ]);
                }
            } catch (err) {
                console.error("Error fetching candidates:", err);
            }
        };
        fetchUpcoming();
    }, []);

    const castVote = async (movieId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to vote");
                return;
            }
            const res = await fetch("http://localhost:5000/api/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ movieId })
            });
            const data = await res.json();
            if (res.ok) {
                setVote(movieId);
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Error casting vote:", err);
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/chat");
                if (res.ok) {
                    const data = await res.json();
                    setMessages([
                        { user: "Admin", text: "Suggest the next re release movie" },
                        ...data.map(m => ({ user: m.user, text: m.text }))
                    ]);
                }
            } catch (err) {
                console.error("Chat fetch err:", err);
            }
        };
        fetchChat();
        const interval = setInterval(fetchChat, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) {
            if (!user) alert("Please login to chat");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ text: newMessage })
            });
            if (res.ok) {
                const newMsg = await res.json();
                setMessages(prev => [...prev, newMsg]);
                setNewMessage("");
            } else {
                const errData = await res.json();
                alert(errData.message);
            }
        } catch (err) {
            console.error("Error sending message", err);
        }
    };

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>

            {/* CINEMATIC HERO HEADER */}
            <div style={{
                height: "350px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/voting-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}>
                <button
                    onClick={() => window.history.back()}
                    style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", backdropFilter: "blur(5px)" }}
                >
                    ← Back
                </button>
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ fontSize: "3.5rem", color: "var(--accent-primary)", marginBottom: "10px" }}>CineVerse Voting</h1>
                    <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", letterSpacing: "2px" }}>Bring Back Your Favorite Classics</p>
                </div>
            </div>

            <div style={{ padding: "60px 20px", maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h2 style={{ color: "var(--accent-primary)", marginBottom: "40px", fontSize: "2rem", textTransform: "uppercase", letterSpacing: "2px" }}>Re-release Candidates</h2>

                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "30px", width: "100%", marginBottom: "80px" }}>
                    {moviesList.map((m, i) => (
                        <div key={m.id || i} style={{
                            background: "var(--bg-secondary)",
                            borderRadius: "24px",
                            overflow: "hidden",
                            border: vote === m.id ? "2px solid var(--accent-primary)" : "1px solid var(--bg-input)",
                            boxShadow: vote === m.id ? "0 0 30px rgba(229, 9, 20, 0.4)" : "0 15px 35px rgba(0,0,0,0.3)",
                            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            transform: vote === m.id ? "translateY(-10px)" : "translateY(0)"
                        }}>
                            <div style={{ position: "relative" }}>
                                <img
                                    src={m.img}
                                    alt={m.name}
                                    style={{ width: "100%", height: "400px", objectFit: "cover", opacity: vote && vote !== m.id ? 0.4 : 1, transition: "opacity 0.3s" }}
                                />
                                <div style={{ position: "absolute", top: "15px", right: "15px", background: "var(--accent-secondary)", padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem", color: "black", fontWeight: "bold" }}>{m.type}</div>
                            </div>
                            <div style={{ padding: "25px", textAlign: "center" }}>
                                <h4 style={{ marginBottom: "20px", fontSize: "1.3rem", fontWeight: "bold" }}>{m.name}</h4>

                                {vote === m.id ? (
                                    <div style={{ background: "var(--status-success)", color: "black", padding: "12px", borderRadius: "12px", fontWeight: "bold" }}>
                                        Voted
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => castVote(m.id)}
                                        disabled={!!vote}
                                        style={{
                                            width: "100%",
                                            padding: "14px",
                                            borderRadius: "12px",
                                            background: "var(--accent-primary)",
                                            color: "white",
                                            border: "none",
                                            cursor: vote ? "default" : "pointer",
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            opacity: vote ? 0.3 : 1,
                                            transition: "all 0.2s",
                                            boxShadow: "0 5px 15px rgba(229, 9, 20, 0.3)"
                                        }}
                                        onMouseOver={(e) => !vote && (e.currentTarget.style.transform = "scale(1.05)")}
                                        onMouseOut={(e) => !vote && (e.currentTarget.style.transform = "scale(1)")}
                                    >
                                        Vote
                                    </button>
                                )}

                                {vote && (
                                    <div style={{ marginTop: "25px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "10px" }}>
                                            <span style={{ color: "var(--text-secondary)" }}>Live Support</span>
                                            <span style={{ color: "var(--accent-secondary)", fontWeight: "bold" }}>{m.votes}%</span>
                                        </div>
                                        <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", overflow: "hidden" }}>
                                            <div style={{ width: `${m.votes}%`, height: "100%", background: "var(--accent-secondary)", borderRadius: "10px", boxShadow: "0 0 15px var(--accent-secondary)" }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* MOVIE REQUEST CHAT */}
                <h2 style={{ color: "var(--accent-primary)", marginBottom: "40px", fontSize: "2rem", textTransform: "uppercase", letterSpacing: "2px" }}>Community Lobby</h2>
                <div style={{ width: "100%", maxWidth: "900px", background: "var(--bg-secondary)", borderRadius: "30px", border: "1px solid var(--bg-input)", overflow: "hidden", display: "flex", flexDirection: "column", height: "550px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
                    <div style={{ padding: "20px 30px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--bg-input)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: "1.2rem", color: "var(--text-primary)" }}>Request Hub</h3>
                            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Ask for your favorites to be re-released!</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "10px", height: "10px", background: "var(--status-success)", borderRadius: "50%" }}></div>
                            <span style={{ fontSize: "0.9rem", color: "var(--status-success)", fontWeight: "bold" }}>124 Cinephiles Online</span>
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: "30px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px", background: "rgba(0,0,0,0.2)" }}>
                        {messages.map((msg, i) => {
                            const isMe = msg.user === user?.name;
                            const isAdmin = msg.user === "Admin";
                            return (
                                <div key={i} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                                    <div style={{ fontSize: "0.8rem", color: isAdmin ? "var(--status-success)" : "var(--text-muted)", marginBottom: "6px", textAlign: isMe ? "right" : "left", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                        {isMe ? "You" : msg.user}
                                    </div>
                                    <div style={{
                                        background: isMe ? "var(--accent-primary)" : isAdmin ? "rgba(0, 255, 234, 0.1)" : "var(--bg-input)",
                                        color: isAdmin ? "var(--accent-secondary)" : "white",
                                        padding: "14px 20px",
                                        borderRadius: isMe ? "20px 20px 2px 20px" : "20px 20px 20px 2px",
                                        fontSize: "1rem",
                                        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                                        lineHeight: "1.5",
                                        border: isAdmin ? "1px solid var(--accent-secondary)" : "none"
                                    }}>
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>

                    <div style={{ padding: "25px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid var(--bg-input)", display: "flex", gap: "15px" }}>
                        <input
                            placeholder="Request a classic movie re-release..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            style={{
                                flex: 1,
                                background: "rgba(0,0,0,0.3)",
                                border: "1px solid var(--bg-input)",
                                borderRadius: "15px",
                                padding: "16px 25px",
                                color: "white",
                                outline: "none",
                                fontSize: "1rem",
                                transition: "all 0.3s"
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent-secondary)"}
                            onBlur={(e) => e.currentTarget.style.borderColor = "var(--bg-input)"}
                        />
                        <button
                            onClick={handleSendMessage}
                            style={{
                                background: "var(--accent-primary)",
                                color: "white",
                                border: "none",
                                borderRadius: "15px",
                                padding: "0 35px",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                cursor: "pointer",
                                boxShadow: "0 5px 15px rgba(229, 9, 20, 0.3)",
                                transition: "all 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Voting;
