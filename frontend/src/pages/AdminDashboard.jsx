import React, { useEffect, useState } from "react";
import axios from "axios";
import { MOVIES_URL, TRANSFER_URL } from "../api/config";

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [voteResults, setVoteResults] = useState([]);
  const [detailedVotes, setDetailedVotes] = useState([]);

  // Movie Form State
  const [movieForm, setMovieForm] = useState({ 
    title: "", 
    genre: "", 
    date: "", 
    time: "", 
    location: "", 
    theatreName: "", 
    rating: 8.0,
    isCurrent: true,
    isUpcoming: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Fetch movies + pending transfers
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { "Authorization": `Bearer ${token}` } };
      
      const moviesRes = await axios.get(MOVIES_URL);
      setMovies(moviesRes.data);

      const transfersRes = await axios.get(TRANSFER_URL);
      setTransfers(transfersRes.data);

      const chatRes = await axios.get("http://localhost:5000/api/chat");
      setMessages(chatRes.data);

      const voteRes = await axios.get("http://localhost:5000/api/vote/results", config);
      setVoteResults(voteRes.data);

      const listRes = await axios.get("http://localhost:5000/api/vote/list", config);
      setDetailedVotes(listRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitMovie = async () => {
    if (!movieForm.title || !movieForm.genre) return alert("Fill all required fields (Title, Genre)");

    // Using FormData to support image uploads
    const formData = new FormData();
    formData.append("title", movieForm.title);
    formData.append("genre", movieForm.genre);
    formData.append("date", movieForm.date);
    formData.append("time", movieForm.time);
    formData.append("location", movieForm.location);
    formData.append("theatreName", movieForm.theatreName);
    formData.append("rating", movieForm.rating);
    formData.append("isCurrent", movieForm.isCurrent);
    formData.append("isUpcoming", movieForm.isUpcoming);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingId) {
        await axios.put(`${MOVIES_URL}/${editingId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        alert("Movie Updated ✅");
      } else {
        await axios.post(MOVIES_URL, formData, { headers: { "Content-Type": "multipart/form-data" } });
        alert("Movie Added ✅");
      }

      // Reset form
      setMovieForm({ title: "", genre: "", date: "", time: "", location: "", theatreName: "", rating: 8.0, isCurrent: true, isUpcoming: false });
      setImageFile(null);
      setEditingId(null);

      // Refresh list
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error saving movie.");
    }
  };

  const handleEditClick = (movie) => {
    setEditingId(movie._id);
    setMovieForm({
      title: movie.title || "",
      genre: movie.genre || "",
      date: movie.date || "",
      time: movie.time || "",
      location: movie.location || "",
      theatreName: movie.theatreName || "",
      rating: movie.rating || 8.0,
      isCurrent: movie.isCurrent ?? true,
      isUpcoming: movie.isUpcoming ?? false
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this movie?")) return;
    try {
      await axios.delete(`${MOVIES_URL}/${id}`);
      alert("Movie Deleted ✅");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error deleting movie.");
    }
  };

  const handleApproveTransfer = async (id) => {
    try {
      await axios.post(`${TRANSFER_URL}/approve`, { transferId: id });
      alert("Transfer Approved ✅");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error approving transfer.");
    }
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>

      {/* CINEMATIC HERO HEADER */}
      <div style={{
        height: "300px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/images/admin-bg.jpg')",
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
          <h1 style={{ fontSize: "3rem", color: "var(--accent-primary)", marginBottom: "10px" }}>CineVerse Console</h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", letterSpacing: "2px" }}>Engine Room of the Portal</p>
        </div>
      </div>

      <div style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "40px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          {/* ADD / EDIT MOVIE SECTION */}
          <section style={{
            background: "var(--bg-secondary)",
            padding: "40px",
            borderRadius: "24px",
            border: "1px solid var(--bg-input)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)"
          }}>
            <h3 style={{ color: "var(--accent-primary)", marginBottom: "30px", fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px" }}>
              {editingId ? "Edit Movie" : "Build the Cinema"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "bold" }}>MOVIE POSTER (IMAGE)</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ ...inputStyle, padding: "8px" }} />
                {editingId && !imageFile && <small style={{ color: "var(--text-secondary)" }}>Leave empty to keep existing image</small>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "bold" }}>MOVIE TITLE</label>
                <input placeholder="Ex: Deadpool & Wolverine" value={movieForm.title} onChange={e => setMovieForm({ ...movieForm, title: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "bold" }}>GENRE</label>
                <input placeholder="Action, Thriller, etc." value={movieForm.genre} onChange={e => setMovieForm({ ...movieForm, genre: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "bold" }}>DATE</label>
                  <input type="date" value={movieForm.date} onChange={e => setMovieForm({ ...movieForm, date: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "bold" }}>TIME</label>
                  <input type="time" value={movieForm.time} onChange={e => setMovieForm({ ...movieForm, time: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "bold" }}>LOCATION</label>
                  <input placeholder="City, Area" value={movieForm.location} onChange={e => setMovieForm({ ...movieForm, location: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "bold" }}>THEATRE NAME</label>
                  <input placeholder="INOX, PVR, etc." value={movieForm.theatreName} onChange={e => setMovieForm({ ...movieForm, theatreName: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "bold" }}>RATING / 10</label>
                  <input type="number" step="0.1" value={movieForm.rating} onChange={e => setMovieForm({ ...movieForm, rating: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "30px", background: "rgba(255,255,255,0.02)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.9rem" }}>
                  <input type="checkbox" checked={movieForm.isCurrent} onChange={e => setMovieForm({ ...movieForm, isCurrent: e.target.checked })} style={{ width: "18px", height: "18px", accentColor: "var(--accent-secondary)" }} />
                  Now Running
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.9rem" }}>
                  <input type="checkbox" checked={movieForm.isUpcoming} onChange={e => setMovieForm({ ...movieForm, isUpcoming: e.target.checked })} style={{ width: "18px", height: "18px", accentColor: "var(--accent-primary)" }} />
                  Upcoming (Re-release)
                </label>
              </div>

              <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                <button
                  onClick={handleSubmitMovie}
                  style={{ ...btnStyle, flex: 2 }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  {editingId ? "Update Movie" : "Publish to CineVerse"}
                </button>
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setMovieForm({ title: "", genre: "", date: "", time: "", location: "", theatreName: "", rating: 8.0, isCurrent: true, isUpcoming: false });
                      setImageFile(null);
                    }}
                    style={{ ...btnStyle, flex: 1, background: "var(--bg-input)" }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* TRANSFERS SECTION */}
          <section style={{
            background: "var(--bg-secondary)",
            padding: "40px",
            borderRadius: "24px",
            border: "1px solid var(--bg-input)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column"
          }}>
            <h3 style={{ color: "var(--accent-primary)", marginBottom: "30px", fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px" }}>Ticket Integrity</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1, overflowY: "auto", paddingRight: "10px" }}>
              {transfers.filter(t => t.status === "pending").map(t => (
                <div key={t._id} style={{ border: "1px solid rgba(255,255,255,0.05)", padding: "20px", borderRadius: "16px", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "1rem", fontWeight: "bold", color: "white", marginBottom: "5px" }}>ID: {t.booking ? t.booking._id.substring(0, 8) : "N/A"}...</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>From: <span style={{ color: "var(--accent-secondary)" }}>{t.fromUser ? t.fromUser.name : "Unknown"}</span></div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Recipient: <span style={{ color: "var(--accent-primary)" }}>{t.toUserEmail}</span></div>
                  </div>
                  <button
                    onClick={() => handleApproveTransfer(t._id)}
                    style={{ ...btnStyle, width: "auto", padding: "10px 25px", marginTop: 0, fontSize: "0.9rem" }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    Approve
                  </button>
                </div>
              ))}
              {transfers.filter(t => t.status === "pending").length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "20px" }}></div>
                  <p style={{ fontSize: "1.1rem" }}>All transfer queues are clear.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* COMMUNITY HUDDLE & VOTING SECTION */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          
          {/* COMMUNITY LOBBY MONITOR */}
          <section style={{
            background: "var(--bg-secondary)",
            padding: "40px",
            borderRadius: "24px",
            border: "1px solid var(--bg-input)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            height: "500px"
          }}>
            <h3 style={{ color: "white", marginBottom: "20px", fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px" }}>Community Chat Monitor</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", overflowY: "auto", paddingRight: "10px" }}>
              {messages.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No community messages yet.</p> : messages.map((msg, idx) => (
                <div key={idx} style={{ background: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", borderLeft: msg.user === "Admin" ? "3px solid var(--status-success)" : "3px solid var(--accent-primary)" }}>
                  <div style={{ fontSize: "0.85rem", color: msg.user === "Admin" ? "var(--status-success)" : "var(--accent-secondary)", fontWeight: "bold", marginBottom: "5px", textTransform: "uppercase" }}>{msg.user}</div>
                  <div style={{ fontSize: "1rem", color: "white", lineHeight: "1.4" }}>{msg.text}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "8px", textAlign: "right" }}>{new Date(msg.createdAt || Date.now()).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </section>

          {/* VOTING LEADERBOARD */}
          <section style={{
            background: "var(--bg-secondary)",
            padding: "40px",
            borderRadius: "24px",
            border: "1px solid var(--bg-input)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            height: "500px"
          }}>
            <h3 style={{ color: "white", marginBottom: "20px", fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px" }}>Voting Leaderboard</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", overflowY: "auto", paddingRight: "10px" }}>
              {voteResults.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No votes have been cast yet.</p> : voteResults.map((v, idx) => {
                const voters = detailedVotes.filter(dv => dv.movie && (dv.movie._id === v.movieId || dv.movie.title === v.title));
                return (
                  <div key={idx} style={{ background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: "1.2rem", color: "white", fontWeight: "bold" }}>{v.title}</div>
                      <div style={{ background: "rgba(245, 57, 102, 0.1)", color: "var(--accent-primary)", padding: "8px 16px", borderRadius: "20px", fontWeight: "bold", fontSize: "0.9rem" }}>{v.votes} Votes</div>
                    </div>
                    {voters.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "10px", background: "rgba(255,255,255,0.02)", borderRadius: "10px" }}>
                        {voters.map((dv, i) => (
                          <div key={i} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", justifyContent: "space-between" }}>
                            <span><span style={{ color: "var(--accent-secondary)" }}>{dv.user ? dv.user.name : "Anonymous"}</span></span>
                            <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>voted for {v.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* NOW RUNNING MOVIES */}
        <section style={{
          background: "var(--bg-secondary)",
          padding: "40px",
          borderRadius: "24px",
          border: "1px solid var(--bg-input)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          backdropFilter: "blur(10px)"
        }}>
          <h3 style={{ color: "var(--accent-primary)", marginBottom: "30px", fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px" }}>
            Now Running
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)", textAlign: "left", color: "var(--text-muted)" }}>
                  <th style={{ padding: "15px" }}>Poster</th>
                  <th style={{ padding: "15px" }}>Title</th>
                  <th style={{ padding: "15px" }}>Genre</th>
                  <th style={{ padding: "15px" }}>Theatre</th>
                  <th style={{ padding: "15px" }}>Location</th>
                  <th style={{ padding: "15px" }}>Rating</th>
                  <th style={{ padding: "15px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.filter(m => m.isCurrent).map(movie => (
                  <tr key={movie._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "15px" }}>
                      <div style={{ width: "50px", height: "70px", borderRadius: "8px", overflow: "hidden", background: "#222" }}>
                        <img src={movie.image || movie.img} alt={movie.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: movie.image ? 1 : 0.5 }} />
                      </div>
                    </td>
                    <td style={{ padding: "15px", fontWeight: "bold" }}>{movie.title}</td>
                    <td style={{ padding: "15px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>{movie.genre}</td>
                    <td style={{ padding: "15px", color: "var(--text-secondary)" }}>{movie.theatreName || "-"}</td>
                    <td style={{ padding: "15px", color: "var(--text-secondary)" }}>{movie.location || "-"}</td>
                    <td style={{ padding: "15px", fontWeight: "bold", color: "gold" }}>⭐ {movie.rating || "N/A"}</td>
                    <td style={{ padding: "15px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleEditClick(movie)}
                          style={{ background: "transparent", border: "1px solid var(--accent-secondary)", color: "var(--accent-secondary)", padding: "6px 15px", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s" }}
                          onMouseOver={e => { e.currentTarget.style.background = "var(--accent-secondary)"; e.currentTarget.style.color = "black"; }}
                          onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-secondary)"; }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(movie._id)}
                          style={{ background: "transparent", border: "1px solid var(--accent-primary)", color: "var(--accent-primary)", padding: "6px 15px", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s" }}
                          onMouseOver={e => { e.currentTarget.style.background = "var(--accent-primary)"; e.currentTarget.style.color = "white"; }}
                          onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-primary)"; }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RE-RELEASE CANDIDATES (UPCOMING) */}
        <section style={{
          background: "var(--bg-secondary)",
          padding: "40px",
          borderRadius: "24px",
          border: "1px solid var(--bg-input)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          backdropFilter: "blur(10px)"
        }}>
          <h3 style={{ color: "var(--accent-primary)", marginBottom: "30px", fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px" }}>
            Re-release candidates
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)", textAlign: "left", color: "var(--text-muted)" }}>
                  <th style={{ padding: "15px" }}>Poster</th>
                  <th style={{ padding: "15px" }}>Title</th>
                  <th style={{ padding: "15px" }}>Genre</th>
                  <th style={{ padding: "15px" }}>Rating</th>
                  <th style={{ padding: "15px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.filter(m => m.isUpcoming).map(movie => (
                  <tr key={movie._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "15px" }}>
                      <div style={{ width: "50px", height: "70px", borderRadius: "8px", overflow: "hidden", background: "#222" }}>
                        <img src={movie.image || movie.img} alt={movie.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: movie.image ? 1 : 0.5 }} />
                      </div>
                    </td>
                    <td style={{ padding: "15px", fontWeight: "bold" }}>{movie.title}</td>
                    <td style={{ padding: "15px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>{movie.genre}</td>
                    <td style={{ padding: "15px", fontWeight: "bold", color: "gold" }}>⭐ {movie.rating || "N/A"}</td>
                    <td style={{ padding: "15px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleEditClick(movie)}
                          style={{ background: "transparent", border: "1px solid var(--accent-secondary)", color: "var(--accent-secondary)", padding: "6px 15px", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s" }}
                          onMouseOver={e => { e.currentTarget.style.background = "var(--accent-secondary)"; e.currentTarget.style.color = "black"; }}
                          onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-secondary)"; }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(movie._id)}
                          style={{ background: "transparent", border: "1px solid var(--accent-primary)", color: "var(--accent-primary)", padding: "6px 15px", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s" }}
                          onMouseOver={e => { e.currentTarget.style.background = "var(--accent-primary)"; e.currentTarget.style.color = "white"; }}
                          onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-primary)"; }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid var(--bg-input)",
  background: "var(--bg-input)",
  color: "white",
  outline: "none",
  fontSize: "0.9rem"
};

const btnStyle = {
  width: "100%",
  padding: "14px",
  background: "var(--accent-primary)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
  boxShadow: "0 4px 15px rgba(229, 9, 20, 0.4)"
};

export default AdminDashboard;
