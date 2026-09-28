import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [location, setLocation] = useState(
    localStorage.getItem("location") || "Chennai"
  );
  const [search, setSearch] = useState("");
  const [dbMovies, setDbMovies] = useState([]);
  const [points, setPoints] = useState(0);
  const [showMoods, setShowMoods] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // New states for User personalized dash interactions
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [myTickets, setMyTickets] = useState([]);
  const [myTransfers, setMyTransfers] = useState([]);
  const [canClaimBonus, setCanClaimBonus] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Gamification DB Call
        const res = await fetch("http://localhost:5000/api/gamification/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.points !== undefined) {
          setPoints(data.points);
          if (data.lastBonusClaimAt) {
            const diffHours = (new Date() - new Date(data.lastBonusClaimAt)) / (1000 * 60 * 60);
            if (diffHours >= 24) setCanClaimBonus(true);
          } else {
            setCanClaimBonus(true);
          }
        }

        // Notifications DB Call
        const notifRes = await fetch("http://localhost:5000/api/users/notifications", { headers: { "Authorization": `Bearer ${token}` } });
        const notifData = await notifRes.json();
        if (Array.isArray(notifData)) setNotifications(notifData);

        // My Tickets DB Call
        const ticketRes = await fetch("http://localhost:5000/api/bookings", { headers: { "Authorization": `Bearer ${token}` } });
        const ticketData = await ticketRes.json();
        if (Array.isArray(ticketData)) setMyTickets(ticketData);

        // My Transfers Status Call 
        const transferRes = await fetch("http://localhost:5000/api/transfers/me", { headers: { "Authorization": `Bearer ${token}` } });
        const transferData = await transferRes.json();
        if (Array.isArray(transferData)) setMyTransfers(transferData);

      } catch (err) {
        console.error("Error fetching personalized dashboard APIs:", err);
      }
    };
    fetchUserData();
  }, [user]);

  const handleClaimBonus = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/gamification/daily-bonus", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        if (data.points !== undefined) setPoints(data.points);
        setCanClaimBonus(false);
        alert(data.message);
      } else {
        alert(data.message);
        setCanClaimBonus(false);
      }
    } catch(err) {
      console.error("Error claiming bonus:", err);
    }
  };

  const markNotificationsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/users/notifications/read", { method: 'PUT', headers: { "Authorization": `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (err) { }
  };

  const [upcomingMovies, setUpcomingMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/movies?status=current")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setDbMovies(data);
        }
      })
      .catch(err => console.error("Error fetching movies:", err));

    fetch("http://localhost:5000/api/movies?status=upcoming")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setUpcomingMovies(data);
        }
      })
      .catch(err => console.error("Error fetching upcoming movies:", err));
  }, []);

  /* MOVIES - Combined API (if available) and Local Fallback */
  const localMovies = [
    { title: "Ghilli", img: "/images/ghilli.jpeg", rating: 8.7, genre: "Action", language: "Tamil", locations: ["Chennai", "Coimbatore", "Madurai", "Trichy", "Ariyalur", "Perambalur", "Dindigul", "Thanjavur", "Theni", "Villuppuram", "Tiruppur", "Tirunelveli", "Tenkasi", "Salem", "Namakkal", "Nagapattinam", "Mayiladuthurai", "Karur", "Kanchipuram", "Erode"] },
    { title: "Mankatha", img: "/images/mankatha.jpg", rating: 8.9, genre: "Action Thriller", language: "Tamil", locations: ["Chennai", "Coimbatore", "Salem", "Tiruppur", "Namakkal", "Erode", "Madurai", "Trichy"] },
    { title: "Ayan", img: "/images/ayan.jpg", rating: 8.1, genre: "Action Crime", language: "Tamil", locations: ["Chennai", "Trichy", "Madurai", "Karur", "Nagapattinam", "Mayiladuthurai", "Coimbatore"] },
    { title: "Thalapathi", img: "/images/thalapathi.jpeg", rating: 8.5, genre: "Drama", language: "Tamil", locations: ["Chennai", "Madurai", "Thanjavur", "Dindigul", "Theni", "Trichy"] },
    { title: "Nayakan", img: "/images/nayakan.jpeg", rating: 9.0, genre: "Gangster", language: "Tamil", locations: ["Chennai", "Coimbatore", "Salem", "Villuppuram", "Kanchipuram", "Madurai"] },
    { title: "Polladhavan", img: "/images/polladhavan.jpeg", rating: 8.2, genre: "Action Thriller", language: "Tamil", locations: ["Chennai", "Erode", "Namakkal", "Salem", "Tiruppur", "Coimbatore"] },

  ];

  const movieMaster = dbMovies.length > 0
    ? [...dbMovies.map(m => ({ ...m, img: m.image || m.img })), ...localMovies]
    : localMovies;

  /* THEATRE MAP */
  const theatreMap = {
    Chennai: ["PVR", "INOX", "AGS", "Rohini", "Escape", "Kamala", "Albert", "Sangam", "Woodlands", "Udhayam"],
    Coimbatore: ["KG", "Fun Mall", "Broadway", "Archana", "PVR Cinema", "Karpagam Theatre", "Brookefields Mall"],
    Madurai: ["Thangam", "Guru", "Mathi", "Vetri Cinema", "INOX"],
    Trichy: ["LA", "Sona Mina", "Megastar", "Ramba", "Mariyam"],
    Ariyalur: ["Sri Theatre", "Mahasakthi Talkies", "CR Cinema Palace"],
    Perambalur: ["Ram Theatre", "Raja Theatre"],
    Dindigul: ["Aarthi", "Rajendra", "CINE LOUNGE"],
    Thanjavur: ["Vijaya", "Rani", "Vetri Cinemas"],
    Theni: ["Vasanth", "MSP Theatre", "Lucky cinemas"],
    Villuppuram: ["Kannan", "Janas"],
    Tiruppur: ["Usha", "Sangeetha"],
    Tirunelveli: ["PSS", "Central"],
    Tenkasi: ["Thai", "PSS Multiplex"],
    Salem: ["ARR", "KS"],
    Namakkal: ["LMR", "KS CINEPLEX"],
    Nagapattinam: ["Raja", "Devi Cinemas"],
    Mayiladuthurai: ["Pearless", "Vijaya Theatre"],
    Karur: ["Kavithalaya", "Kalaiarangam Kavithalaya"],
    Kanchipuram: ["Babu", "Siva Aruna"],
    Erode: ["Abirami", "Royal"]
  };

  /* THEATRES FOR CURRENT LOCATION */
  const theatres = theatreMap[location] || [];

  /* FILTER MOVIES BY LOCATION AND UNIQUENESS */
  const uniqueMovies = Array.from(new Set(movieMaster.map(m => m.title)))
    .map(title => movieMaster.find(m => m.title === title));

  const locationMovies = uniqueMovies.filter(m =>
    !m.locations || m.locations.includes(location)
  );

  /* SEARCH FILTER */
  const filteredMovies = locationMovies.filter(movie => {
    const searchText = search.toLowerCase();
    const movieMatch = movie.title.toLowerCase().includes(searchText);
    const genreMatch = movie.genre && movie.genre.toLowerCase().includes(searchText);
    const theatreMatch = theatres.some(theatre =>
      theatre.toLowerCase().includes(searchText)
    );
    return movieMatch || genreMatch || theatreMatch;
  });

  /* BANNERS - Dynamic count based on available location movies */
  const bannerMovies = filteredMovies.slice(0, Math.max(5, filteredMovies.length));

  /* SIDEBAR FEATURES */
  const features = [
    { name: "Movies", path: "/movies", icon: null },
    { name: "Stream", path: "/stream", icon: null },
    { name: "Events", path: "/events", icon: null },
    { name: "Sports", path: "/sports", icon: null },
    { name: "Plays", path: "/plays", icon: null },
    { name: "Buzz", path: "/buzz", icon: null },
    { name: "Gamification", path: "/gamification", icon: null },
    { name: "Transfer", path: "/transfer", icon: null },
    { name: "Voting", path: "/voting", icon: null }
  ];

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)" }}>
      {/* NAVBAR */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 35px",
        background: "var(--bg-primary)",
        borderBottom: "1px solid #1A1A1A"
      }}>
        <h2 style={{ color: "var(--accent-primary)", letterSpacing: "2px", margin: 0 }}>CineVerse</h2>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            background: "var(--bg-input)",
            padding: "12px 22px",
            borderRadius: "30px",
            width: "600px"
          }}>
            <span style={{ marginRight: "10px", opacity: 0.5 }}>Search</span>
            <input
              placeholder="Search for Movies, Events, Plays and Sports"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowMoods(true)}
              onBlur={() => setTimeout(() => setShowMoods(false), 200)}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                color: "white",
                width: "100%"
              }}
            />
          </div>
          {(showMoods || search) && (
            <div style={{
              display: "flex",
              gap: "15px",
              animation: "fadeIn 0.3s ease"
            }}>
              {["Sad", "Happy", "Romantic", "Action"].map((mood) => (
                <button
                  key={mood}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input from losing focus immediately
                    setSearch(mood);
                  }}
                  style={{
                    background: search === mood ? "var(--accent-primary)" : "var(--bg-input)",
                    color: "white",
                    border: "none",
                    padding: "5px 15px",
                    borderRadius: "15px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: search === mood ? "none" : "1px solid #444"
                  }}
                >
                    {mood}
                </button>
              ))}
              {search && (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearch("");
                  }}
                  style={{
                    background: "transparent",
                    color: "var(--text-muted)",
                    border: "none",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
          {user && (
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <div
                onClick={() => navigate("/gamification")}
                style={{
                  background: "rgba(0, 255, 234, 0.1)",
                  color: "var(--accent-secondary)",
                  padding: "8px 15px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  border: "1px solid rgba(0, 255, 234, 0.2)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                🪙 {points} CineCoins
              </div>
              <div style={{ color: "var(--text-primary)", fontWeight: "500", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "15px" }}>
                <span>Hi, <span style={{ color: "var(--accent-secondary)" }}>{user.name.split(' ')[0]}</span></span>

                  <div
                  style={{ position: 'relative', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' }}
                  onClick={() => { setShowNotif(!showNotif); if (!showNotif) markNotificationsRead(); }}
                >
                  🔔
                  {(notifications.filter(n => !n.read).length > 0 || canClaimBonus) && (
                    <div style={{ position: 'absolute', top: 0, right: -5, background: 'var(--accent-primary)', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {notifications.filter(n => !n.read).length + (canClaimBonus ? 1 : 0)}
                    </div>
                  )}
                  {showNotif && (
                    <div style={{ position: 'absolute', top: '45px', right: 0, width: '300px', background: 'var(--bg-secondary)', border: '1px solid #1A1A1A', borderRadius: '12px', padding: '15px', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.7)', textAlign: "left", cursor: "default" }} onClick={(e) => e.stopPropagation()}>
                      <h4 style={{ color: 'white', borderBottom: '1px solid #1A1A1A', paddingBottom: '10px', marginBottom: '10px', fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Recent Alerts</h4>
                      <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {canClaimBonus && (
                          <div 
                            onClick={handleClaimBonus}
                            style={{ background: 'var(--accent-primary)', padding: '10px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', color: 'white', fontWeight: 'bold' }}
                          >
                            Claim Daily Bonus +5 Points!
                          </div>
                        )}
                        {notifications.length === 0 && !canClaimBonus ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No alerts yet.</p> :
                          notifications.map((n, i) => (
                            <div key={i} style={{ background: n.read ? 'rgba(255,255,255,0.02)' : 'rgba(229, 9, 20, 0.05)', padding: '10px', borderRadius: '8px', borderLeft: n.read ? '2px solid #222' : '2px solid var(--accent-primary)' }}>
                              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: "1.4" }}>{n.message}</p>
                              <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: "block", marginTop: "5px" }}>{new Date(n.date).toLocaleString()}</small>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
          <div style={{
            display: "flex",
            alignItems: "center",
            background: "var(--bg-input)",
            padding: "8px 15px",
            borderRadius: "25px"
          }}>
            <span style={{ marginRight: "10px", opacity: 0.5 }}>Location</span>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                localStorage.setItem("location", e.target.value);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                outline: "none"
              }}
            >
              {Object.keys(theatreMap).map((d, i) => (
                <option key={i} style={{ color: "black" }}>{d}</option>
              ))}
            </select>
          </div>
          <div
            onClick={() => navigate("/profile")}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "var(--accent-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 0 15px rgba(245, 57, 102, 0.4)",
              fontSize: "1.2rem",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            👤
          </div>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{
          width: "240px",
          background: "var(--bg-primary)",
          padding: "20px 15px",
          borderRight: "1px solid #333",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <h3 style={{
              color: "var(--accent-secondary)",
              paddingLeft: "15px",
              marginBottom: "10px",
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              Menu
            </h3>
            {features.map((f, i) => (
              <div key={i}
                onClick={() => navigate(f.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  color: "var(--text-secondary)"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "var(--bg-secondary)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <span style={{ fontSize: "0.95rem", fontWeight: "400" }}>{f.name}</span>
              </div>
            ))}
          </div>
          <div
            onClick={() => navigate("/about")}
            style={{
              marginBottom: "20px",
              padding: "12px",
              background: "var(--bg-secondary)",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "center",
              fontWeight: "bold"
            }}>
            About Us
          </div>
        </div>
        <div style={{ flex: 1, padding: "20px" }}>
          <HeroBanner movies={bannerMovies} />
          <h2 style={{
            marginTop: "20px",
            marginBottom: "20px",
            textAlign: "center",
            color: "var(--accent-primary)",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "2px"
          }}>
            Now Running
          </h2>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "40px",
            padding: "20px 40px"
          }}>
            {filteredMovies.map((m, i) => (
              <div key={m._id || i} style={{
                background: "var(--bg-secondary)",
                borderRadius: "18px",
                width: "220px",
                textAlign: "center",
                overflow: "hidden",
                border: "1px solid var(--bg-input)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                transition: "transform 0.3s ease"
              }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-10px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <img
                  src={m.img}
                  style={{
                    width: "100%",
                    height: "330px", // Standardized height for 2:3 ratio approx
                    objectFit: "cover",
                    objectPosition: "center"
                  }}
                  alt={m.title}
                />
                <div style={{ padding: "20px" }}>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "8px", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{m.genre}</span>
                    <span style={{ color: "gold", fontWeight: "bold", fontSize: "0.8rem" }}>⭐ {m.rating}</span>
                  </div>
                  <button
                    onClick={() =>
                      navigate("/booking", {
                        state: {
                          movie: m,
                          location
                        }
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "var(--accent-primary)",
                      border: "none",
                      borderRadius: "10px",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      boxShadow: "0 5px 15px rgba(245, 57, 102, 0.4)",
                      transition: "all 0.2s"
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{
            marginTop: "60px",
            marginBottom: "20px",
            textAlign: "center",
            color: "var(--accent-secondary)",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "2px"
          }}>
            Upcoming Releases
          </h2>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "40px",
            padding: "20px 40px"
          }}>
            {upcomingMovies.length > 0 ? (
              upcomingMovies.map((m, i) => (
                <div key={m._id || i} style={{
                  background: "var(--bg-secondary)",
                  borderRadius: "18px",
                  width: "220px",
                  textAlign: "center",
                  overflow: "hidden",
                  border: "1px solid var(--bg-input)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                  transition: "transform 0.3s ease",
                  opacity: 0.8
                }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.opacity = 1; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = 0.8; }}
                >
                  <img
                    src={m.image || m.img}
                    style={{
                      width: "100%",
                      height: "300px", // Consistent height
                      objectFit: "cover",
                      objectPosition: "center",
                      filter: "grayscale(50%)"
                    }}
                    alt={m.title}
                  />
                  <div style={{ padding: "20px" }}>
                    <h4 style={{ fontSize: "1.1rem", marginBottom: "8px", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</h4>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "15px" }}>
                      <span style={{ color: "var(--accent-secondary)", fontSize: "0.85rem", fontWeight: "bold" }}>📅 Coming Soon</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--text-muted)" }}>Stay tuned for new releases!</p>
            )}
          </div>

          {/* USER DATA SECTIONS */}
          {user && (
            <div style={{ marginTop: "60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", padding: "0 40px" }}>

              {/* MY TICKETS */}
              <section style={{ background: "var(--bg-secondary)", borderRadius: "20px", padding: "30px", border: "1px solid var(--bg-input)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                <h3 style={{ color: "var(--accent-primary)", marginBottom: "20px", fontSize: "1.5rem" }}>My Tickets</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto", paddingRight: "10px" }}>
                  {myTickets.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No active bookings found.</p> : myTickets.map(t => (
                    <div key={t._id}
                      onClick={() => setSelectedTicket(t)}
                      style={{ cursor: "pointer", background: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}
                      onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                      onMouseOut={e => e.currentTarget.style.background = "rgba(0,0,0,0.3)"}>
                      <h4 style={{ color: "white", margin: "0 0 5px 0", fontSize: "1.1rem" }}>{t.movie?.title || "Unknown Movie"}</h4>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        <span>Seats: <span style={{ color: "var(--accent-primary)", fontWeight: "bold" }}>{t.seats?.join(", ") || t.seats?.length || 0}</span></span>
                        <span>ID: <span style={{ fontFamily: "monospace" }}>{t._id.substring(0, 8)}</span>...</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* TRANSFER STATUS */}
              <section style={{ background: "var(--bg-secondary)", borderRadius: "20px", padding: "30px", border: "1px solid var(--bg-input)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                <h3 style={{ color: "white", marginBottom: "20px", fontSize: "1.5rem" }}>Transfer Status</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto", paddingRight: "10px" }}>
                  {myTransfers.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No active transfers tracking.</p> : myTransfers.map(t => (
                    <div key={t._id} style={{ background: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"} onMouseOut={e => e.currentTarget.style.background = "rgba(0,0,0,0.3)"}>
                      <div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>To: <span style={{ color: "white", fontWeight: "bold" }}>{t.toUserEmail}</span></div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "3px" }}>Ticket: <span style={{ fontFamily: "monospace" }}>{t.booking?._id?.substring(0, 8) || "N/A"}</span></div>
                      </div>
                      <span style={{
                        fontSize: "0.75rem", fontWeight: "bold", padding: "5px 12px", borderRadius: "20px",
                        background: t.status === "approved" ? "rgba(0, 255, 234, 0.1)" : t.status === "rejected" ? "rgba(245, 57, 102, 0.1)" : "rgba(255, 165, 0, 0.1)",
                        color: t.status === "approved" ? "var(--accent-secondary)" : t.status === "rejected" ? "var(--accent-primary)" : "orange"
                      }}>{t.status.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          )}

        </div>
      </div>

      {/* TICKET POPUP MODAL */}
      {selectedTicket && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "rgba(20, 20, 30, 0.9)", padding: "40px", borderRadius: "30px",
            border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 30px 60px rgba(0,0,0,0.8)",
            textAlign: "center", maxWidth: "450px", width: "100%", position: "relative"
          }}>
            <button
              onClick={() => setSelectedTicket(null)}
              style={{ position: "absolute", top: "15px", right: "20px", background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer", transition: "color 0.2s" }}
              onMouseOver={e => e.currentTarget.style.color = "white"}
              onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}
            >✖</button>

            <h2 style={{ color: "var(--accent-primary)", marginBottom: "25px", fontSize: "1.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>Ticket Confirmed</h2>
            <div style={{ background: "var(--bg-secondary)", borderRadius: "20px", padding: "20px", textAlign: "left", boxShadow: "inset 0 0 20px rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <img src={selectedTicket.movie?.image || selectedTicket.movie?.img || "/images/admin-bg.jpg"} alt="Poster" style={{ width: "100%", height: "220px", objectFit: "cover", objectPosition: "center", borderRadius: "10px", marginBottom: "20px" }} />
              <p style={{ margin: "5px 0", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "bold", letterSpacing: "1px" }}>MOVIE / EVENT</p>
              <p style={{ margin: "0 0 15px 0", fontSize: "1.3rem", fontWeight: "bold", color: "white" }}>{selectedTicket.movie?.title}</p>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "15px" }}>
                <div>
                  <p style={{ margin: "5px 0", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "bold", letterSpacing: "1px" }}>DATE & SHOWTIME</p>
                  <p style={{ margin: "0", fontSize: "1.1rem", color: "white" }}>{selectedTicket.movie?.time || "N/A"}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "5px 0", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "bold", letterSpacing: "1px" }}>SEATS</p>
                  <p style={{ margin: "0", fontSize: "1.1rem", color: "var(--accent-secondary)", fontWeight: "bold" }}>{Array.isArray(selectedTicket.seats) ? selectedTicket.seats.join(", ") : selectedTicket.seats || "A1"}</p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: "5px 0", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "bold", letterSpacing: "1px" }}>BOOKING ID</p>
                  <p style={{ margin: "0 0 15px 0", fontSize: "1rem", color: "white", fontFamily: "monospace" }}>{selectedTicket._id}</p>
                </div>
                <div style={{ textAlign: "center", background: "white", padding: "5px", borderRadius: "10px", width: "70px", height: "70px" }}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CINEVERSE-${selectedTicket._id}`} alt="QR" style={{ width: "100%", height: "100%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div >
  );
}

export default Dashboard;
