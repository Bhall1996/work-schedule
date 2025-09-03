// src/SettingsPanel.jsx
import React, { useState } from "react";

export default function SettingsPanel({ user, users, setUsers, setUser }) {
  const [password, setPassword] = useState("");

  const changePassword = () => {
    if (!password) return;
    setUsers(
      users.map((u) =>
        u.username === user.username ? { ...u, password } : u
      )
    );
    setUser({ ...user, password });
    setPassword("");
    alert("Password changed successfully!");
  };

  return (
    <div>
      <h3>User Settings</h3>
      <p>Logged in as <b>{user.username}</b></p>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={changePassword}>Change Password</button>
    </div>
  );
}
