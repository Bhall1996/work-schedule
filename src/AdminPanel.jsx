// src/AdminPanel.jsx
import React, { useState } from "react";

export default function AdminPanel({ legend, setLegend, setBgColor, users, setUsers }) {
  const [newLegend, setNewLegend] = useState(legend);
  const [newUser, setNewUser] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleLegendChange = (index, value) => {
    const updated = [...newLegend];
    updated[index] = value;
    setNewLegend(updated);
    setLegend(updated);
  };

  const handleAddUser = () => {
    if (newUser && newPassword) {
      setUsers((prev) => ({
        ...prev,
        [newUser]: { password: newPassword, approved: false },
      }));
      setNewUser("");
      setNewPassword("");
    }
  };

  const handleApproveUser = (username) => {
    setUsers((prev) => ({
      ...prev,
      [username]: { ...prev[username], approved: true },
    }));
  };

  const handleRemoveUser = (username) => {
    setUsers((prev) => {
      const updated = { ...prev };
      delete updated[username];
      return updated;
    });
  };

  return (
    <div>
      <h3 style={{ marginBottom: "10px" }}>Admin Settings</h3>

      {/* Background Color */}
      <div style={{ marginBottom: "15px" }}>
        <label>Background Color: </label>
        <input
          type="color"
          onChange={(e) => setBgColor(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {/* Legend Editor */}
      <div style={{ marginBottom: "15px" }}>
        <h4>Legend</h4>
        {newLegend.map((item, i) => (
          <div key={i} style={{ marginBottom: "5px" }}>
            <input
              type="text"
              value={item}
              onChange={(e) => handleLegendChange(i, e.target.value)}
              style={{ padding: "5px", width: "100%" }}
            />
          </div>
        ))}
      </div>

      {/* User Management */}
      <div style={{ marginBottom: "15px" }}>
        <h4>User Management</h4>
        <input
          type="text"
          placeholder="New Username"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          style={{ marginBottom: "5px", padding: "5px", width: "100%" }}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ marginBottom: "5px", padding: "5px", width: "100%" }}
        />
        <button
          onClick={handleAddUser}
          style={{
            padding: "5px 10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          ➕ Add User
        </button>

        <ul style={{ marginTop: "10px" }}>
          {Object.keys(users).map((u) => (
            <li key={u} style={{ marginBottom: "5px" }}>
              {u} -{" "}
              {users[u].approved ? (
                <span style={{ color: "green" }}>Approved</span>
              ) : (
                <span style={{ color: "red" }}>Pending</span>
              )}
              <div style={{ marginTop: "5px" }}>
                {!users[u].approved && (
                  <button
                    onClick={() => handleApproveUser(u)}
                    style={{
                      marginRight: "5px",
                      padding: "2px 6px",
                      background: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                    }}
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleRemoveUser(u)}
                  style={{
                    padding: "2px 6px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
