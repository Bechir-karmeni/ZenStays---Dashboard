import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, Users, UserCheck, Trash2 } from "lucide-react";

// -----------------------
// Styles
// -----------------------
const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
  },
  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
  },
  toolbar: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  searchContainer: {
    flex: 1,
    minWidth: "250px",
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    height: "44px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    paddingLeft: "44px",
    paddingRight: "16px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  select: {
    height: "44px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    padding: "0 16px",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
    cursor: "pointer",
    minWidth: "140px",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  primaryButton: {
    background: "#10b981",
    color: "#fff",
  },
  secondaryButton: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    color: "#374151",
  },
  tableCard: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#374151",
    borderBottom: "1px solid #f3f4f6",
  },
  actionButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontSize: "13px",
    color: "#374151",
    cursor: "pointer",
    marginRight: "8px",
    transition: "all 0.2s",
  },
  deleteButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #fecaca",
    background: "#fef2f2",
    fontSize: "13px",
    color: "#dc2626",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },
  statusActive: {
    background: "#dcfce7",
    color: "#166534",
  },
  statusInactive: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContent: {
    background: "#fff",
    borderRadius: "16px",
    maxWidth: "500px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  modalBody: {
    padding: "24px",
  },
  modalFooter: {
    padding: "16px 24px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  formLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  },
  formInput: {
    width: "100%",
    height: "44px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    padding: "0 14px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#6b7280",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#9ca3af",
    cursor: "pointer",
    padding: "4px",
    lineHeight: 1,
  },
};

// Badge Component
function StatusBadge({ status }) {
  const isActive = status === "Active";
  return (
    <span
      style={{
        ...styles.statusBadge,
        ...(isActive ? styles.statusActive : styles.statusInactive),
      }}
    >
      {status}
    </span>
  );
}

// Modal Component
function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div style={styles.modalBody}>{children}</div>
        {footer && <div style={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
}

// -----------------------
// Main Component
// -----------------------
export default function Employees() {
  const API_BASE = "http://localhost:8000";

  const access = localStorage.getItem("access");
  const authHeader = access ? { Authorization: `Bearer ${access}` } : {};

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [invite, setInvite] = useState({ email: "", first_name: "", last_name: "" });
  const [inviteResult, setInviteResult] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);

  // Fetch users
  useEffect(() => {
    let ignore = false;
    async function run() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/users/`, {
          headers: { "Content-Type": "application/json", ...authHeader },
        });
        if (!res.ok) throw new Error("Failed to load clients");
        const data = await res.json();
        if (!ignore) {
          const mapped = data.map((u) => ({
            id: String(u.id),
            name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email,
            email: u.email,
            status: u.is_active ? "Active" : "Inactive",
          }));
          setRows(mapped);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, []);

  // View details
  function viewDetails(r) {
    setDetailRow(r);
    setDetailOpen(true);
  }

  // Delete user
  async function deleteUser() {
    if (!deleteRow) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/${deleteRow.id}/`, {
        method: "DELETE",
        headers: { ...authHeader },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to delete user");
      }
      // Remove from list
      setRows(rows.filter((r) => r.id !== deleteRow.id));
      setDeleteOpen(false);
      setDeleteRow(null);
    } catch (e) {
      alert("Error: " + e.message);
    }
  }

  // Create invite
  async function createInvite() {
    try {
      const res = await fetch(`${API_BASE}/api/invites/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({
          email: invite.email,
          first_name: invite.first_name,
          last_name: invite.last_name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.detail || data.email || data.non_field_errors || JSON.stringify(data);
        throw new Error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
      }
      setInviteResult(data);
    } catch (e) {
      alert("Error: " + e.message);
    }
  }

  // Filter rows
  const filtered = rows.filter((r) => {
    const matchSearch =
      !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const stats = useMemo(
    () => ({
      total: rows.length,
      active: rows.filter((r) => r.status === "Active").length,
    }),
    [rows]
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Client Management</h1>
        <p style={styles.subtitle}>Manage your clients and their information</p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>
            <Users size={18} color="#6b7280" />
            Total Clients
          </div>
          <div style={styles.statValue}>{stats.total}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>
            <UserCheck size={18} color="#10b981" />
            Active Clients
          </div>
          <div style={{ ...styles.statValue, color: "#10b981" }}>{stats.active}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.searchContainer}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name or email..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          style={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={() => {
            setInvite({ email: "", first_name: "", last_name: "" });
            setInviteResult(null);
            setAddOpen(true);
          }}
        >
          <Plus size={18} />
          Add Client
        </button>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        {loading ? (
          <div style={styles.emptyState}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <Users size={48} color="#d1d5db" style={{ marginBottom: "12px" }} />
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>No clients found</p>
            <p style={{ margin: "8px 0 0", fontSize: "14px" }}>
              Add your first client to get started
            </p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} style={{ transition: "background 0.2s" }}>
                  <td style={{ ...styles.td, fontWeight: "500", color: "#111827" }}>{r.name}</td>
                  <td style={styles.td}>{r.email}</td>
                  <td style={styles.td}>
                    <StatusBadge status={r.status} />
                  </td>
                  <td style={styles.td}>
                    <button style={styles.actionButton} onClick={() => viewDetails(r)}>
                      <Eye size={14} /> View
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => {
                        setDeleteRow(r);
                        setDeleteOpen(true);
                      }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        open={detailOpen}
        title={`Client: ${detailRow?.name}`}
        onClose={() => setDetailOpen(false)}
      >
        {detailRow && (
          <div>
            <div style={styles.formGroup}>
              <div style={styles.formLabel}>Name</div>
              <div style={{ color: "#374151" }}>{detailRow.name}</div>
            </div>
            <div style={styles.formGroup}>
              <div style={styles.formLabel}>Email</div>
              <div style={{ color: "#374151" }}>{detailRow.email}</div>
            </div>
            <div style={styles.formGroup}>
              <div style={styles.formLabel}>Status</div>
              <StatusBadge status={detailRow.status} />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteOpen}
        title="Delete Client"
        onClose={() => {
          setDeleteOpen(false);
          setDeleteRow(null);
        }}
        footer={
          <>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => {
                setDeleteOpen(false);
                setDeleteRow(null);
              }}
            >
              Cancel
            </button>
            <button
              style={{ ...styles.button, background: "#dc2626", color: "#fff" }}
              onClick={deleteUser}
            >
              Delete
            </button>
          </>
        }
      >
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <Trash2 size={48} color="#dc2626" style={{ marginBottom: "16px" }} />
          <p style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "500", color: "#111827" }}>
            Are you sure you want to delete this client?
          </p>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
            {deleteRow?.name} ({deleteRow?.email})
          </p>
          <p style={{ margin: "16px 0 0", fontSize: "13px", color: "#dc2626" }}>
            This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* Add Client Modal */}
      <Modal
        open={addOpen}
        title="Add New Client"
        onClose={() => {
          setAddOpen(false);
          setInviteResult(null);
        }}
        footer={
          !inviteResult && (
            <>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => setAddOpen(false)}
              >
                Cancel
              </button>
              <button style={{ ...styles.button, ...styles.primaryButton }} onClick={createInvite}>
                Create Invite
              </button>
            </>
          )
        }
      >
        {!inviteResult ? (
          <>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Email *</label>
              <input
                type="email"
                style={styles.formInput}
                value={invite.email}
                onChange={(e) => setInvite((f) => ({ ...f, email: e.target.value }))}
                placeholder="client@example.com"
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>First Name</label>
                <input
                  type="text"
                  style={styles.formInput}
                  value={invite.first_name}
                  onChange={(e) => setInvite((f) => ({ ...f, first_name: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Last Name</label>
                <input
                  type="text"
                  style={styles.formInput}
                  value={invite.last_name}
                  onChange={(e) => setInvite((f) => ({ ...f, last_name: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              background: "#f0fdf4",
              padding: "16px",
              borderRadius: "10px",
              border: "1px solid #bbf7d0",
            }}
          >
            <div style={{ color: "#166534", fontWeight: "500", marginBottom: "8px" }}>
              ✓ Invite created successfully!
            </div>
            <div style={{ fontSize: "14px", color: "#374151", marginBottom: "8px" }}>
              Send this link to the client:
            </div>
            <code
              style={{
                display: "block",
                padding: "12px",
                background: "#fff",
                borderRadius: "6px",
                fontSize: "13px",
                wordBreak: "break-all",
                border: "1px solid #e5e7eb",
              }}
            >
              {`${window.location.origin}/accept-invite?token=${inviteResult.id}`}
            </code>
          </div>
        )}
      </Modal>
    </div>
  );
}
