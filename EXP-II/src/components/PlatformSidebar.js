import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllPlatforms, connectionToggled } from "../store/platformsSlice";

export default function PlatformSidebar() {
  const platforms = useSelector(selectAllPlatforms);
  const dispatch = useDispatch();

  return (
    <aside className="sidebar">
      <h3>Platforms</h3>
      <p className="sidebar-hint">Toggle a platform's connection. Only connected platforms appear as posting options.</p>
      <ul className="platform-list">
        {platforms.map((p) => (
          <li key={p.id} className="platform-item">
            <div className="platform-info">
              <span className="dot" style={{ background: p.color }} />
              <div>
                <div className="platform-name">{p.name}</div>
                <div className="platform-followers">{p.followers.toLocaleString()} followers</div>
              </div>
            </div>
            <button
              className={`toggle-btn ${p.connected ? "on" : "off"}`}
              onClick={() => dispatch(connectionToggled(p.id))}
            >
              {p.connected ? "Connected" : "Connect"}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
