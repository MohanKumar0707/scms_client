import React, { useState } from "react";

// Professional Dashboard Variation
const UltraProTable = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const stats = [
    { label: "Total Members", value: "4,250", change: "+12%", color: "#6366F1" },
    { label: "Active Now", value: "125", change: "Live", color: "#10B981" },
    { label: "Pending", value: "12", change: "-2%", color: "#F59E0B" },
  ];

  return (
    <div style={xp.wrapper}>
      {/* 1. Stats Row */}
      <div style={xp.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} style={xp.statCard}>
            <span style={xp.statLabel}>{s.label}</span>
            <div style={xp.statValueRow}>
              <span style={xp.statValue}>{s.value}</span>
              <span style={{...xp.statBadge, color: s.color}}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={xp.tableCard}>
        {/* 2. Header with dynamic actions */}
        <div style={xp.tableHeader}>
          <div style={xp.searchBox}>
            <input type="text" placeholder="Filter by name, role, or email..." style={xp.searchInput} />
          </div>
          <div style={xp.actions}>
            {selectedUsers.length > 0 ? (
              <button style={xp.deleteBtn}>Delete ({selectedUsers.length})</button>
            ) : (
              <button style={xp.primaryBtn}>+ Invite Member</button>
            )}
          </div>
        </div>

        {/* 3. The Table */}
        <table style={xp.table}>
          <thead>
            <tr style={xp.thRow}>
              <th style={xp.th}><input type="checkbox" /></th>
              <th style={xp.th}>Member</th>
              <th style={xp.th}>Status</th>
              <th style={xp.th}>Access Level</th>
              <th style={xp.th}>Last Active</th>
              <th style={xp.th}></th>
            </tr>
          </thead>
          <tbody>
            <UserRow name="Dianne Russell" email="dianne.r@example.com" status="Active" role="Admin" last="2 mins ago" />
            <UserRow name="Guy Hawkins" email="guy.h@example.com" status="Inactive" role="Editor" last="4 hours ago" />
            <UserRow name="Kristin Watson" email="k.watson@example.com" status="Pending" role="Viewer" last="Never" />
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserRow = ({ name, email, status, role, last }) => (
  <tr style={xp.tr}>
    <td style={xp.td}><input type="checkbox" /></td>
    <td style={xp.td}>
      <div style={xp.userMedia}>
        <div style={xp.miniAvatar}>{name.charAt(0)}</div>
        <div>
          <div style={xp.mainName}>{name}</div>
          <div style={xp.subText}>{email}</div>
        </div>
      </div>
    </td>
    <td style={xp.td}>
      <div style={xp.indicatorRow}>
        <div style={{...xp.dot, backgroundColor: status === 'Active' ? '#10B981' : '#94A3B8'}} />
        <span style={xp.statusText}>{status}</span>
      </div>
    </td>
    <td style={xp.td}><span style={xp.roleBadge}>{role}</span></td>
    <td style={xp.td}><span style={xp.subText}>{last}</span></td>
    <td style={xp.td}><button style={xp.moreBtn}>•••</button></td>
  </tr>
);

const xp = {
  wrapper: { padding: "32px", backgroundColor: "#F8FAFC", minHeight: "100vh", fontFamily: 'Inter, system-ui, sans-serif' },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" },
  statCard: { backgroundColor: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
  statLabel: { fontSize: "13px", color: "#64748B", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.025em" },
  statValueRow: { display: "flex", alignItems: "baseline", gap: "8px", marginTop: "8px" },
  statValue: { fontSize: "24px", fontWeight: "700", color: "#0F172A" },
  statBadge: { fontSize: "12px", fontWeight: "600", padding: "2px 6px", backgroundColor: "#F1F5F9", borderRadius: "6px" },
  tableCard: { backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", overflow: "hidden" },
  tableHeader: { padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F1F5F9" },
  searchInput: { padding: "10px 16px", width: "300px", borderRadius: "10px", border: "1px solid #E2E8F0", outline: "none", fontSize: "14px" },
  primaryBtn: { backgroundColor: "#0F172A", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", fontWeight: "600", cursor: "pointer" },
  deleteBtn: { backgroundColor: "#EF4444", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", fontWeight: "600", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "16px 20px", textAlign: "left", fontSize: "12px", color: "#64748B", fontWeight: "600", backgroundColor: "#FBFDFF" },
  tr: { borderBottom: "1px solid #F1F5F9", transition: "0.2s" },
  td: { padding: "16px 20px", verticalAlign: "middle" },
  userMedia: { display: "flex", alignItems: "center", gap: "12px" },
  miniAvatar: { width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "#475569" },
  mainName: { fontSize: "14px", fontWeight: "600", color: "#1E293B" },
  subText: { fontSize: "13px", color: "#64748B" },
  indicatorRow: { display: "flex", alignItems: "center", gap: "8px" },
  dot: { width: "6px", height: "6px", borderRadius: "50%" },
  statusText: { fontSize: "13px", fontWeight: "500", color: "#334155" },
  roleBadge: { fontSize: "12px", fontWeight: "600", color: "#475569", backgroundColor: "#F1F5F9", padding: "4px 10px", borderRadius: "6px" },
  moreBtn: { background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "16px" }
};

export default UltraProTable;