// ClientDashboard.jsx - Dashboard for property owners (clients)
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Home,
  Building,
  Percent,
  Clock,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Area,
  AreaChart,
  Legend,
} from "recharts";

// ==================== STYLES ====================
const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "24px",
  },
  greeting: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 4px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  kpiCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
  },
  kpiHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  kpiTitle: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  kpiIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  kpiValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "4px",
  },
  kpiChange: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
  kpiSubtext: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },
  chartCard: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  chartHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
  },
  chartTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
  },
  chartSubtitle: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "2px",
  },
  chartBody: {
    padding: "20px",
  },
  propertyCard: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    marginBottom: "20px",
  },
  propertyHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  propertyTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e2e8f0",
    background: "#f8fafc",
  },
  td: {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
  },
  propertyName: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "500",
    color: "#0f172a",
  },
  propertyIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "#dcfce7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#16a34a",
  },
  occupancyBar: {
    width: "100%",
    height: "8px",
    background: "#e2e8f0",
    borderRadius: "4px",
    overflow: "hidden",
  },
  occupancyFill: {
    height: "100%",
    borderRadius: "4px",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },
};

// ==================== HELPERS ====================
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value) => `${value.toFixed(1)}%`;

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

// ==================== MOCK DATA ====================
const clientData = {
  name: "Bechir",
  totalProperties: 4,
  totalRevenue: 128500,
  mtdRevenue: 32400,
  ytdRevenue: 128500,
  ownerPayout: 102800,
  grossProfit: 38550,
  occupancyRate: 78.5,
  adr: 185,
  avgLOS: 3.2,
  cancelRate: 3.8,
  revPAN: 145,
};

const monthlyRevenue = [
  { month: "Jul", revenue: 28500, payout: 22800 },
  { month: "Aug", revenue: 32000, payout: 25600 },
  { month: "Sep", revenue: 29500, payout: 23600 },
  { month: "Oct", revenue: 26100, payout: 20880 },
  { month: "Nov", revenue: 24400, payout: 19520 },
  { month: "Dec", revenue: 32400, payout: 25920 },
];

const revenueByPlatform = [
  { name: "Airbnb", value: 72000, percent: 56 },
  { name: "Booking.com", value: 38500, percent: 30 },
  { name: "Direct", value: 18000, percent: 14 },
];

const occupancyTrend = [
  { month: "Jul", occupancy: 82 },
  { month: "Aug", occupancy: 88 },
  { month: "Sep", occupancy: 79 },
  { month: "Oct", occupancy: 72 },
  { month: "Nov", occupancy: 68 },
  { month: "Dec", occupancy: 78 },
];

const properties = [
  {
    id: 1,
    address: "123 Main St, Downtown",
    revenue: 42500,
    occupancy: 85,
    adr: 195,
    nights: 52,
    status: "excellent",
  },
  {
    id: 2,
    address: "456 Oak Ave, Plateau",
    revenue: 35200,
    occupancy: 78,
    adr: 175,
    nights: 48,
    status: "good",
  },
  {
    id: 3,
    address: "789 Pine Rd, Old Port",
    revenue: 32100,
    occupancy: 75,
    adr: 185,
    nights: 45,
    status: "good",
  },
  {
    id: 4,
    address: "321 Elm St, Mile End",
    revenue: 18700,
    occupancy: 62,
    adr: 165,
    nights: 32,
    status: "attention",
  },
];

const upcomingBookings = [
  {
    id: 1,
    property: "123 Main St",
    guest: "John D.",
    checkin: "2026-01-22",
    checkout: "2026-01-25",
    nights: 3,
    revenue: 585,
  },
  {
    id: 2,
    property: "456 Oak Ave",
    guest: "Sarah M.",
    checkin: "2026-01-23",
    checkout: "2026-01-26",
    nights: 3,
    revenue: 525,
  },
  {
    id: 3,
    property: "789 Pine Rd",
    guest: "Mike R.",
    checkin: "2026-01-25",
    checkout: "2026-01-28",
    nights: 3,
    revenue: 555,
  },
];

// ==================== COMPONENTS ====================
function KPICard({ title, value, change, changeType, icon: Icon, color, subtext }) {
  const colorMap = {
    green: { bg: "#dcfce7", fg: "#16a34a" },
    blue: { bg: "#dbeafe", fg: "#2563eb" },
    purple: { bg: "#ede9fe", fg: "#7c3aed" },
    orange: { bg: "#ffedd5", fg: "#ea580c" },
    teal: { bg: "#ccfbf1", fg: "#0d9488" },
  };
  const colors = colorMap[color] || colorMap.green;
  const isPositive = changeType === "positive";

  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiHeader}>
        <span style={styles.kpiTitle}>{title}</span>
        <div style={{ ...styles.kpiIcon, background: colors.bg }}>
          <Icon size={18} color={colors.fg} />
        </div>
      </div>
      <div style={{ ...styles.kpiValue, color: colors.fg }}>{value}</div>
      {change && (
        <div style={{ ...styles.kpiChange, color: isPositive ? "#16a34a" : "#dc2626" }}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
        </div>
      )}
      {subtext && <div style={styles.kpiSubtext}>{subtext}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    excellent: { bg: "#dcfce7", color: "#166534", label: "Excellent" },
    good: { bg: "#dbeafe", color: "#1e40af", label: "Good" },
    attention: { bg: "#fef3c7", color: "#92400e", label: "Needs Attention" },
  };
  const { bg, color, label } = config[status] || config.good;
  return <span style={{ ...styles.statusBadge, background: bg, color }}>{label}</span>;
}

// ==================== MAIN COMPONENT ====================
export default function ClientDashboard() {
  const [user, setUser] = useState({ first_name: "Client" });

  useEffect(() => {
    const stored = localStorage.getItem("me");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.greeting}>Welcome back, {user.first_name || "Client"}!</h1>
        <p style={styles.subtitle}>Here's how your properties are performing</p>
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        <KPICard
          title="Total Revenue"
          value={formatCurrency(clientData.totalRevenue)}
          change="+12.5% vs last period"
          changeType="positive"
          icon={DollarSign}
          color="green"
        />
        <KPICard
          title="Your Payout"
          value={formatCurrency(clientData.ownerPayout)}
          change="+10.2% vs last period"
          changeType="positive"
          icon={TrendingUp}
          color="blue"
        />
        <KPICard
          title="Occupancy Rate"
          value={formatPercent(clientData.occupancyRate)}
          change="+5.3% vs last month"
          changeType="positive"
          icon={Calendar}
          color="purple"
        />
        <KPICard
          title="Avg Daily Rate"
          value={formatCurrency(clientData.adr)}
          subtext="Per night"
          icon={BarChart3}
          color="orange"
        />
      </div>

      {/* Secondary KPIs */}
      <div
        style={{ ...styles.kpiGrid, gridTemplateColumns: "repeat(5, 1fr)", marginBottom: "24px" }}
      >
        <KPICard
          title="Properties"
          value={clientData.totalProperties}
          icon={Building}
          color="teal"
        />
        <KPICard
          title="MTD Revenue"
          value={formatCurrency(clientData.mtdRevenue)}
          icon={DollarSign}
          color="green"
        />
        <KPICard title="Avg Stay" value={`${clientData.avgLOS} nights`} icon={Clock} color="blue" />
        <KPICard
          title="Cancel Rate"
          value={formatPercent(clientData.cancelRate)}
          icon={Percent}
          color="orange"
        />
        <KPICard
          title="RevPAN"
          value={formatCurrency(clientData.revPAN)}
          subtext="Revenue per available night"
          icon={PieChart}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Revenue & Payout Trend</h3>
            <p style={styles.chartSubtitle}>Last 6 months</p>
          </div>
          <div style={styles.chartBody}>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  fill="#10b98133"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="payout"
                  name="Your Payout"
                  fill="#3b82f633"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Revenue by Platform</h3>
            <p style={styles.chartSubtitle}>Booking source breakdown</p>
          </div>
          <div style={styles.chartBody}>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie>
                <Pie
                  data={revenueByPlatform}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${percent}%`}
                >
                  {revenueByPlatform.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Occupancy Trend</h3>
            <p style={styles.chartSubtitle}>Monthly occupancy rate</p>
          </div>
          <div style={styles.chartBody}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={occupancyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line
                  type="monotone"
                  dataKey="occupancy"
                  name="Occupancy"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Revenue by Property</h3>
            <p style={styles.chartSubtitle}>Performance comparison</p>
          </div>
          <div style={styles.chartBody}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={properties} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis
                  type="category"
                  dataKey="address"
                  stroke="#6b7280"
                  width={130}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div style={styles.propertyCard}>
        <div style={styles.propertyHeader}>
          <h3 style={styles.propertyTitle}>Your Properties</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Property</th>
              <th style={styles.th}>Revenue</th>
              <th style={styles.th}>Occupancy</th>
              <th style={styles.th}>ADR</th>
              <th style={styles.th}>Nights Booked</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id}>
                <td style={styles.td}>
                  <div style={styles.propertyName}>
                    <div style={styles.propertyIcon}>
                      <Home size={16} />
                    </div>
                    {p.address}
                  </div>
                </td>
                <td style={{ ...styles.td, fontWeight: "600", color: "#16a34a" }}>
                  {formatCurrency(p.revenue)}
                </td>
                <td style={styles.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={styles.occupancyBar}>
                      <div
                        style={{
                          ...styles.occupancyFill,
                          width: `${p.occupancy}%`,
                          background:
                            p.occupancy >= 75
                              ? "#10b981"
                              : p.occupancy >= 60
                              ? "#f59e0b"
                              : "#ef4444",
                        }}
                      />
                    </div>
                    <span style={{ fontWeight: "500" }}>{p.occupancy}%</span>
                  </div>
                </td>
                <td style={styles.td}>{formatCurrency(p.adr)}</td>
                <td style={styles.td}>{p.nights}</td>
                <td style={styles.td}>
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming Bookings */}
      <div style={styles.propertyCard}>
        <div style={styles.propertyHeader}>
          <h3 style={styles.propertyTitle}>Upcoming Bookings</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Property</th>
              <th style={styles.th}>Guest</th>
              <th style={styles.th}>Check-in</th>
              <th style={styles.th}>Check-out</th>
              <th style={styles.th}>Nights</th>
              <th style={styles.th}>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {upcomingBookings.map((b) => (
              <tr key={b.id}>
                <td style={{ ...styles.td, fontWeight: "500" }}>{b.property}</td>
                <td style={styles.td}>{b.guest}</td>
                <td style={styles.td}>{b.checkin}</td>
                <td style={styles.td}>{b.checkout}</td>
                <td style={styles.td}>{b.nights}</td>
                <td style={{ ...styles.td, fontWeight: "600", color: "#16a34a" }}>
                  {formatCurrency(b.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
