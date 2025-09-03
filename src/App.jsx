// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import AdminPanel from "./AdminPanel.jsx";

// --- Sign In ---
function SignIn({ onLogin, users }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      users[username] &&
      users[username].password === password &&
      users[username].approved
    ) {
      onLogin({ username });
    } else {
      setError("Invalid credentials or user not approved yet");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#007bff",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "300px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sign In</h2>
        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: "8px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "8px" }}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              background: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Calendar ---
function Calendar({ legend, year }) {
  const months = [
    "January","February","March",
    "April","May","June",
    "July","August","September",
    "October","November","December",
  ];

  const colors = ["", "yellow", "red", "green", "blue", "purple"];

  const daysInMonth = (monthIndex, year) =>
    new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfMonth = (monthIndex, year) =>
    new Date(year, monthIndex, 1).getDay();

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>{year} Work Schedule</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {months.map((month, idx) => {
          const days = daysInMonth(idx, year);
          const startDay = firstDayOfMonth(idx, year);

          return (
            <div
              key={idx}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <h3 style={{ textAlign: "center" }}>{month} {year}</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "2px",
                }}
              >
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => (
                  <div key={day} style={{ fontWeight: "bold", textAlign: "center" }}>{day}</div>
                ))}
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ border: "1px solid transparent" }}></div>
                ))}
                {Array.from({ length: days }, (_, i) => (
                  <Day key={i} day={i + 1} colors={colors} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Legend</h3>
        <ul>
          {colors.slice(1).map((color, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
              <div style={{ width: "20px", height: "20px", backgroundColor: color, marginRight: "10px" }}></div>
              <span>{legend[i] || `Event ${i + 1}`}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Day({ day, colors }) {
  const [colorIndex, setColorIndex] = useState(0);
  return (
    <div
      onClick={() => setColorIndex((prev) => (prev + 1) % colors.length)}
      style={{
        border: "1px solid #ddd",
        textAlign: "center",
        padding: "5px",
        cursor: "pointer",
        backgroundColor: colors[colorIndex],
      }}
    >
      {day}
    </div>
  );
}

// --- User Settings ---
function SettingsPanel({ user, setUsers }) {
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = () => {
    if (newPassword.trim() !== "") {
      setUsers((prev) => {
        const updated = {
          ...prev,
          [user.username]: { ...prev[user.username], password: newPassword },
        };
        localStorage.setItem("users", JSON.stringify(updated));
        return updated;
      });
      setNewPassword("");
      alert("Password changed successfully!");
    }
  };

  return (
    <div>
      <h3>User Settings</h3>
      <div style={{ marginTop: "10px" }}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ padding: "5px", width: "100%", marginBottom: "10px" }}
        />
        <button
          onClick={handleChangePassword}
          style={{
            padding: "8px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            width: "100%",
          }}
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [user, setUser] = useState(null);
  const [legend, setLegend] = useState(["Work", "Vacation", "Sick", "Holiday", "Other"]);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [year, setYear] = useState(new Date().getFullYear());
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [users, setUsers] = useState({
    Admin: { password: "Admin1", approved: true },
  });

  const adminRef = useRef(null);
  const settingsRef = useRef(null);

  // --- Load from localStorage ---
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    const storedLegend = localStorage.getItem("legend");
    const storedBg = localStorage.getItem("bgColor");

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedLegend) setLegend(JSON.parse(storedLegend));
    if (storedBg) setBgColor(storedBg);
  }, []);

  // --- Save to localStorage ---
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("legend", JSON.stringify(legend));
  }, [legend]);

  useEffect(() => {
    localStorage.setItem("bgColor", bgColor);
  }, [bgColor]);

  // --- Close dropdowns on outside click ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (adminRef.current && !adminRef.current.contains(event.target)) setShowAdmin(false);
      if (settingsRef.current && !settingsRef.current.contains(event.target)) setShowSettings(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return <SignIn onLogin={setUser} users={users} />;
  }

  return (
    <div style={{ backgroundColor: bgColor, minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px" }}>
        <button onClick={() => setUser(null)} style={{ padding: "5px 10px" }}>Sign Out</button>
        <div>
          <button onClick={() => setYear(year - 1)} style={{ marginRight: "10px" }}>◀</button>
          <span style={{ fontWeight: "bold" }}>{year}</span>
          <button onClick={() => setYear(year + 1)} style={{ marginLeft: "10px" }}>▶</button>
        </div>
        <button onClick={() => window.print()} style={{ padding: "5px 10px" }}>🖨 Print</button>

        {user.username === "Admin" && (
          <div style={{ position: "relative", marginLeft: "20px" }} ref={adminRef}>
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              style={{
                padding: "5px 10px",
                background: "#007bff",
                color: "white",
                borderRadius: "5px",
              }}
            >
              ⚙️ Admin Menu
            </button>
            {showAdmin && (
              <div
                style={{
                  position: "absolute",
                  top: "40px",
                  right: "0",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  width: "320px",
                  zIndex: 10,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
              >
                <AdminPanel
                  legend={legend}
                  setLegend={setLegend}
                  setBgColor={setBgColor}
                  users={users}
                  setUsers={setUsers}
                />
              </div>
            )}
          </div>
        )}

        <div style={{ position: "relative", marginLeft: "20px" }} ref={settingsRef}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: "5px 10px",
              background: "#6c757d",
              color: "white",
              borderRadius: "5px",
            }}
          >
            ⚙️ Settings
          </button>
          {showSettings && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: "0",
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                width: "300px",
                zIndex: 10,
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
            >
              <SettingsPanel user={user} setUsers={setUsers} />
            </div>
          )}
        </div>
      </div>

      <Calendar legend={legend} year={year} />
    </div>
  );
}
