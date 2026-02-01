// Dashboard.jsx - Comprehensive STR Performance Dashboard
import React, { useState, useMemo } from "react";
import {
  Home,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  MapPin,
  Building,
  Wrench,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import "./Dashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";

// ==================== HELPERS ====================
const formatCurrency = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const formatPercent = (value) => `${value.toFixed(1)}%`;

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

// ==================== MOCK DATA ====================
// Revenue Data
const monthlyRevenueData = [
  { month: "Jan", revenue: 45000, profit: 12000, costs: 33000 },
  { month: "Feb", revenue: 52000, profit: 15000, costs: 37000 },
  { month: "Mar", revenue: 61000, profit: 18000, costs: 43000 },
  { month: "Apr", revenue: 58000, profit: 16500, costs: 41500 },
  { month: "May", revenue: 72000, profit: 22000, costs: 50000 },
  { month: "Jun", revenue: 85000, profit: 28000, costs: 57000 },
  { month: "Jul", revenue: 92000, profit: 32000, costs: 60000 },
  { month: "Aug", revenue: 98000, profit: 35000, costs: 63000 },
  { month: "Sep", revenue: 88000, profit: 30000, costs: 58000 },
  { month: "Oct", revenue: 76000, profit: 25000, costs: 51000 },
  { month: "Nov", revenue: 68000, profit: 21000, costs: 47000 },
  { month: "Dec", revenue: 82000, profit: 27000, costs: 55000 },
];

const revenueByArea = [
  { name: "Downtown", value: 285000 },
  { name: "Plateau", value: 198000 },
  { name: "Old Port", value: 156000 },
  { name: "Mile End", value: 124000 },
  { name: "Griffintown", value: 114000 },
];

const revenueByClient = [
  { name: "Client A", revenue: 185000, profit: 55500, properties: 5 },
  { name: "Client B", revenue: 152000, profit: 45600, properties: 4 },
  { name: "Client C", revenue: 128000, profit: 38400, properties: 3 },
  { name: "Client D", revenue: 95000, profit: 28500, properties: 3 },
  { name: "Client E", revenue: 72000, profit: 21600, properties: 2 },
  { name: "Client F", revenue: 65000, profit: 19500, properties: 2 },
];

const revenueByPlatform = [
  { name: "Airbnb", value: 520000, percent: 60 },
  { name: "Booking.com", value: 260000, percent: 30 },
  { name: "Direct", value: 87000, percent: 10 },
];

const occupancyTrend = [
  { month: "Jan", occupancy: 62, adr: 165 },
  { month: "Feb", occupancy: 68, adr: 170 },
  { month: "Mar", occupancy: 72, adr: 175 },
  { month: "Apr", occupancy: 70, adr: 172 },
  { month: "May", occupancy: 78, adr: 185 },
  { month: "Jun", occupancy: 85, adr: 195 },
  { month: "Jul", occupancy: 92, adr: 210 },
  { month: "Aug", occupancy: 95, adr: 218 },
  { month: "Sep", occupancy: 82, adr: 195 },
  { month: "Oct", occupancy: 75, adr: 180 },
  { month: "Nov", occupancy: 65, adr: 168 },
  { month: "Dec", occupancy: 78, adr: 188 },
];

const costBreakdown = [
  { name: "Cleaning", value: 85000, percent: 35 },
  { name: "Maintenance", value: 48000, percent: 20 },
  { name: "Supplies", value: 24000, percent: 10 },
  { name: "Platform Fees", value: 60000, percent: 25 },
  { name: "Overhead", value: 24000, percent: 10 },
];

const maintenanceTrend = [
  { month: "Jan", cost: 3200, tickets: 12 },
  { month: "Feb", cost: 2800, tickets: 10 },
  { month: "Mar", cost: 4100, tickets: 15 },
  { month: "Apr", cost: 3600, tickets: 13 },
  { month: "May", cost: 4500, tickets: 16 },
  { month: "Jun", cost: 5200, tickets: 18 },
  { month: "Jul", cost: 4800, tickets: 17 },
  { month: "Aug", cost: 5500, tickets: 20 },
  { month: "Sep", cost: 4200, tickets: 15 },
  { month: "Oct", cost: 3800, tickets: 14 },
  { month: "Nov", cost: 3400, tickets: 12 },
  { month: "Dec", cost: 2900, tickets: 11 },
];

const propertyPerformance = [
  {
    id: 1,
    address: "123 Main St",
    area: "Downtown",
    client: "Client A",
    revenue: 42500,
    occupancy: 85,
    adr: 210,
    profit: 12750,
    profitMargin: 30,
    status: "excellent",
  },
  {
    id: 2,
    address: "456 Oak Ave",
    area: "Plateau",
    client: "Client B",
    revenue: 38200,
    occupancy: 82,
    adr: 185,
    profit: 11460,
    profitMargin: 30,
    status: "good",
  },
  {
    id: 3,
    address: "789 Pine Rd",
    area: "Old Port",
    client: "Client A",
    revenue: 35800,
    occupancy: 78,
    adr: 195,
    profit: 10740,
    profitMargin: 30,
    status: "good",
  },
  {
    id: 4,
    address: "321 Elm St",
    area: "Mile End",
    client: "Client C",
    revenue: 28500,
    occupancy: 65,
    adr: 155,
    profit: 5700,
    profitMargin: 20,
    status: "warning",
  },
  {
    id: 5,
    address: "654 Cedar Ln",
    area: "Downtown",
    client: "Client D",
    revenue: 45000,
    occupancy: 88,
    adr: 225,
    profit: 15750,
    profitMargin: 35,
    status: "excellent",
  },
  {
    id: 6,
    address: "987 Birch Blvd",
    area: "Griffintown",
    client: "Client B",
    revenue: 32100,
    occupancy: 72,
    adr: 175,
    profit: 8025,
    profitMargin: 25,
    status: "good",
  },
  {
    id: 7,
    address: "147 Maple Dr",
    area: "Plateau",
    client: "Client E",
    revenue: 24800,
    occupancy: 58,
    adr: 145,
    profit: 4960,
    profitMargin: 20,
    status: "poor",
  },
  {
    id: 8,
    address: "258 Walnut Way",
    area: "Old Port",
    client: "Client C",
    revenue: 36900,
    occupancy: 80,
    adr: 190,
    profit: 11070,
    profitMargin: 30,
    status: "good",
  },
];

const maintenanceByCategory = [
  { category: "HVAC", cost: 12500, tickets: 25 },
  { category: "Plumbing", cost: 8200, tickets: 32 },
  { category: "Electrical", cost: 6800, tickets: 18 },
  { category: "Appliances", cost: 9500, tickets: 28 },
  { category: "General", cost: 5400, tickets: 45 },
  { category: "Furniture", cost: 5600, tickets: 15 },
];

const losDistribution = [
  { nights: "1", bookings: 45 },
  { nights: "2", bookings: 120 },
  { nights: "3", bookings: 85 },
  { nights: "4", bookings: 62 },
  { nights: "5", bookings: 48 },
  { nights: "6", bookings: 35 },
  { nights: "7+", bookings: 55 },
];

// ==================== COMPONENTS ====================

// KPI Card Component
function KPICard({ title, value, change, changeType, icon: Icon, color = "green", subtext }) {
  const isPositive = changeType === "positive";
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        <div className={`kpi-icon-container ${color}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="kpi-value">{value}</div>
      {change && (
        <div className={`kpi-change ${isPositive ? "positive" : "negative"}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{change}</span>
        </div>
      )}
      {subtext && <div className="kpi-subtext">{subtext}</div>}
    </div>
  );
}

// Section Header Component
function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header">
      <h3 className="section-title">{title}</h3>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}

// Chart Card Component
function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <div className={`chart-card ${className}`}>
      <div className="chart-header">
        <h4 className="chart-title">{title}</h4>
        {subtitle && <span className="chart-subtitle">{subtitle}</span>}
      </div>
      <div className="chart-body">{children}</div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const config = {
    excellent: { label: "Excellent", color: "#10b981", bg: "#dcfce7" },
    good: { label: "Good", color: "#3b82f6", bg: "#dbeafe" },
    warning: { label: "Warning", color: "#f59e0b", bg: "#fef3c7" },
    poor: { label: "Needs Action", color: "#ef4444", bg: "#fee2e2" },
  };
  const { label, color, bg } = config[status] || config.good;
  return (
    <span className="status-badge" style={{ color, backgroundColor: bg }}>
      {label}
    </span>
  );
}

// ==================== MAIN DASHBOARD ====================
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("executive");
  const [dateRange, setDateRange] = useState("ytd");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedClient, setSelectedClient] = useState("all");

  // Calculate summary KPIs
  const kpis = useMemo(
    () => ({
      totalRevenue: 877000,
      ytdRevenue: 877000,
      mtdRevenue: 98000,
      totalProfit: 281500,
      grossMargin: 32.1,
      netMargin: 28.5,
      totalUnits: 17,
      activeUnits: 17,
      avgOccupancy: 76.8,
      avgADR: 186,
      revPAN: 143,
      revPAR: 143,
      totalBookings: 450,
      avgLOS: 3.2,
      cancelRate: 4.2,
      avgLeadTime: 12,
      totalTurnovers: 380,
      avgCleaningCost: 85,
      totalMaintenanceCost: 48000,
      avgMaintenancePerUnit: 2823,
      maintenanceTickets: 163,
      avgResponseTime: 4.2,
      cleaningCostPercent: 9.7,
      maintenanceCostPercent: 5.5,
      supplyCostPercent: 2.7,
      momGrowth: 12.5,
      yoyGrowth: 18.2,
    }),
    []
  );

  const tabs = [
    { id: "executive", label: "Executive Snapshot", icon: BarChart3 },
    { id: "property", label: "Property Performance", icon: Building },
    { id: "client", label: "Client Performance", icon: Users },
    { id: "costs", label: "Costs & Operations", icon: Wrench },
    { id: "booking", label: "Booking Analytics", icon: Calendar },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">STR Performance Dashboard</h1>
          <p className="dashboard-subtitle">Comprehensive analytics for your rental portfolio</p>
        </div>
        <div className="dashboard-filters">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="mtd">Month to Date</option>
            <option value="ytd">Year to Date</option>
            <option value="q1">Q1 2026</option>
            <option value="q2">Q2 2026</option>
            <option value="last12">Last 12 Months</option>
          </select>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Areas</option>
            <option value="downtown">Downtown</option>
            <option value="plateau">Plateau</option>
            <option value="oldport">Old Port</option>
            <option value="mileend">Mile End</option>
          </select>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Clients</option>
            <option value="clienta">Client A</option>
            <option value="clientb">Client B</option>
            <option value="clientc">Client C</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {/* ==================== EXECUTIVE SNAPSHOT ==================== */}
        {activeTab === "executive" && (
          <>
            {/* Revenue KPIs */}
            <SectionHeader title="Revenue KPIs" subtitle="Financial performance overview" />
            <div className="kpi-grid-6">
              <KPICard
                title="Total Revenue"
                value={formatCurrency(kpis.totalRevenue)}
                change="+18.2% YoY"
                changeType="positive"
                icon={DollarSign}
                color="green"
              />
              <KPICard
                title="YTD Revenue"
                value={formatCurrency(kpis.ytdRevenue)}
                change="+15.3% vs target"
                changeType="positive"
                icon={TrendingUp}
                color="blue"
              />
              <KPICard
                title="MTD Revenue"
                value={formatCurrency(kpis.mtdRevenue)}
                change="+12.5% MoM"
                changeType="positive"
                icon={Activity}
                color="purple"
              />
              <KPICard
                title="Gross Profit"
                value={formatCurrency(kpis.totalProfit)}
                change="+22.1% YoY"
                changeType="positive"
                icon={TrendingUp}
                color="green"
              />
              <KPICard
                title="Gross Margin"
                value={formatPercent(kpis.grossMargin)}
                subtext="Target: 30%"
                icon={PieChart}
                color="teal"
              />
              <KPICard
                title="Net Margin"
                value={formatPercent(kpis.netMargin)}
                subtext="After overhead"
                icon={BarChart3}
                color="orange"
              />
            </div>

            {/* Occupancy & Hotel KPIs */}
            <SectionHeader
              title="Occupancy & Hotel-Style KPIs"
              subtitle="Booking and rate metrics"
            />
            <div className="kpi-grid-6">
              <KPICard
                title="Avg Occupancy"
                value={formatPercent(kpis.avgOccupancy)}
                change="+5.2% YoY"
                changeType="positive"
                icon={Calendar}
                color="blue"
              />
              <KPICard
                title="ADR"
                value={formatCurrency(kpis.avgADR)}
                change="+$12 MoM"
                changeType="positive"
                icon={DollarSign}
                color="green"
              />
              <KPICard
                title="RevPAN"
                value={formatCurrency(kpis.revPAN)}
                subtext="Revenue per available night"
                icon={Activity}
                color="purple"
              />
              <KPICard
                title="RevPAR"
                value={formatCurrency(kpis.revPAR)}
                subtext="Revenue per available room"
                icon={Building}
                color="teal"
              />
              <KPICard
                title="Avg LOS"
                value={`${kpis.avgLOS} nights`}
                subtext="Average length of stay"
                icon={Clock}
                color="orange"
              />
              <KPICard
                title="Cancel Rate"
                value={formatPercent(kpis.cancelRate)}
                change="-1.2% MoM"
                changeType="positive"
                icon={XCircle}
                color="red"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="charts-grid-2">
              <ChartCard title="Revenue & Profit Trend" subtitle="12-month performance">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      name="Profit"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6" }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Revenue by Area" subtitle="Geographic distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={revenueByArea}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueByArea.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                  </RechartsPie>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="charts-grid-2">
              <ChartCard title="Revenue by Platform" subtitle="Booking source breakdown">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueByPlatform} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" tickFormatter={(v) => `$${v / 1000}k`} />
                    <YAxis type="category" dataKey="name" stroke="#6b7280" width={100} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Bar dataKey="value" name="Revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Occupancy & ADR Trend" subtitle="12-month trends">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={occupancyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis yAxisId="left" stroke="#10b981" tickFormatter={(v) => `${v}%`} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#f59e0b"
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="occupancy"
                      name="Occupancy %"
                      fill="#10b98133"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="adr"
                      name="ADR"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ fill: "#f59e0b" }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}

        {/* ==================== PROPERTY PERFORMANCE ==================== */}
        {activeTab === "property" && (
          <>
            <SectionHeader title="Property Performance" subtitle="Detailed metrics by property" />

            {/* Property KPIs */}
            <div className="kpi-grid-4">
              <KPICard
                title="Total Properties"
                value={kpis.totalUnits}
                icon={Building}
                color="blue"
              />
              <KPICard
                title="Best Performer"
                value="654 Cedar Ln"
                subtext="$45,000 revenue"
                icon={TrendingUp}
                color="green"
              />
              <KPICard
                title="Needs Attention"
                value="147 Maple Dr"
                subtext="58% occupancy"
                icon={AlertTriangle}
                color="orange"
              />
              <KPICard
                title="Avg Profit/Unit"
                value={formatCurrency(kpis.totalProfit / kpis.totalUnits)}
                icon={DollarSign}
                color="purple"
              />
            </div>

            {/* Property Table */}
            <ChartCard
              title="All Properties"
              subtitle="Revenue, occupancy, and profitability metrics"
              className="full-width"
            >
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Area</th>
                      <th>Client</th>
                      <th>Revenue</th>
                      <th>Occupancy</th>
                      <th>ADR</th>
                      <th>Profit</th>
                      <th>Margin</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyPerformance.map((p) => (
                      <tr key={p.id}>
                        <td className="property-cell">
                          <Home size={14} />
                          {p.address}
                        </td>
                        <td>{p.area}</td>
                        <td>{p.client}</td>
                        <td className="currency-cell">{formatCurrency(p.revenue)}</td>
                        <td>
                          <div className="progress-cell">
                            <div
                              className="progress-bar"
                              style={{
                                width: `${p.occupancy}%`,
                                backgroundColor:
                                  p.occupancy >= 75
                                    ? "#10b981"
                                    : p.occupancy >= 60
                                    ? "#f59e0b"
                                    : "#ef4444",
                              }}
                            />
                            <span>{p.occupancy}%</span>
                          </div>
                        </td>
                        <td>{formatCurrency(p.adr)}</td>
                        <td className="currency-cell positive">{formatCurrency(p.profit)}</td>
                        <td>{p.profitMargin}%</td>
                        <td>
                          <StatusBadge status={p.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>

            {/* Property Charts */}
            <div className="charts-grid-2">
              <ChartCard title="Revenue by Property" subtitle="Top performing units">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={propertyPerformance.sort((a, b) => b.revenue - a.revenue).slice(0, 6)}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" tickFormatter={(v) => `$${v / 1000}k`} />
                    <YAxis
                      type="category"
                      dataKey="address"
                      stroke="#6b7280"
                      width={120}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Profit by Property" subtitle="Profitability ranking">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={propertyPerformance.sort((a, b) => b.profit - a.profit).slice(0, 6)}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" tickFormatter={(v) => `$${v / 1000}k`} />
                    <YAxis
                      type="category"
                      dataKey="address"
                      stroke="#6b7280"
                      width={120}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Bar dataKey="profit" name="Profit" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}

        {/* ==================== CLIENT PERFORMANCE ==================== */}
        {activeTab === "client" && (
          <>
            <SectionHeader title="Client Performance" subtitle="Owner profitability and rankings" />

            {/* Client KPIs */}
            <div className="kpi-grid-4">
              <KPICard title="Total Clients" value="6" icon={Users} color="blue" />
              <KPICard
                title="Top Client Revenue"
                value="Client A"
                subtext="$185,000"
                icon={TrendingUp}
                color="green"
              />
              <KPICard
                title="Avg Revenue/Client"
                value={formatCurrency(697000 / 6)}
                icon={DollarSign}
                color="purple"
              />
              <KPICard
                title="Management Fee Earned"
                value={formatCurrency(69700)}
                subtext="10% avg fee"
                icon={DollarSign}
                color="teal"
              />
            </div>

            {/* Client Charts */}
            <div className="charts-grid-2">
              <ChartCard title="Revenue by Client" subtitle="Client ranking by total revenue">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueByClient}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" name="Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Profit by Client" subtitle="Profit contribution">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={revenueByClient}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="profit"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueByClient.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                  </RechartsPie>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Client Table */}
            <ChartCard
              title="Client Details"
              subtitle="Complete client overview"
              className="full-width"
            >
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Properties</th>
                      <th>Total Revenue</th>
                      <th>Gross Profit</th>
                      <th>Profit Margin</th>
                      <th>Mgmt Fee Earned</th>
                      <th>Owner Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueByClient.map((c, i) => (
                      <tr key={i}>
                        <td className="property-cell">
                          <Users size={14} />
                          {c.name}
                        </td>
                        <td>{c.properties}</td>
                        <td className="currency-cell">{formatCurrency(c.revenue)}</td>
                        <td className="currency-cell positive">{formatCurrency(c.profit)}</td>
                        <td>{((c.profit / c.revenue) * 100).toFixed(1)}%</td>
                        <td className="currency-cell">{formatCurrency(c.revenue * 0.1)}</td>
                        <td className="currency-cell">{formatCurrency(c.revenue * 0.6)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </>
        )}

        {/* ==================== COSTS & OPERATIONS ==================== */}
        {activeTab === "costs" && (
          <>
            <SectionHeader
              title="Cost & Operations Analytics"
              subtitle="Expense tracking and operational metrics"
            />

            {/* Cost KPIs */}
            <div className="kpi-grid-6">
              <KPICard
                title="Total Costs"
                value={formatCurrency(241000)}
                change="+8.2% YoY"
                changeType="negative"
                icon={DollarSign}
                color="red"
              />
              <KPICard
                title="Cleaning Cost"
                value={formatCurrency(85000)}
                subtext={`${kpis.cleaningCostPercent}% of revenue`}
                icon={Sparkles}
                color="purple"
              />
              <KPICard
                title="Maintenance Cost"
                value={formatCurrency(48000)}
                subtext={`${kpis.maintenanceCostPercent}% of revenue`}
                icon={Wrench}
                color="orange"
              />
              <KPICard
                title="Supply Cost"
                value={formatCurrency(24000)}
                subtext={`${kpis.supplyCostPercent}% of revenue`}
                icon={Activity}
                color="blue"
              />
              <KPICard
                title="Maintenance Tickets"
                value={kpis.maintenanceTickets}
                subtext="This year"
                icon={AlertTriangle}
                color="teal"
              />
              <KPICard
                title="Avg Response Time"
                value={`${kpis.avgResponseTime} hrs`}
                change="-0.8 hrs MoM"
                changeType="positive"
                icon={Clock}
                color="green"
              />
            </div>

            {/* Cost Charts */}
            <div className="charts-grid-2">
              <ChartCard title="Cost Breakdown" subtitle="Expense distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${percent}%`}
                    >
                      {costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                  </RechartsPie>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Maintenance Trend" subtitle="Monthly costs and tickets">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={maintenanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis yAxisId="left" stroke="#ef4444" tickFormatter={(v) => `$${v / 1000}k`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="cost"
                      name="Cost"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="tickets"
                      name="Tickets"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6" }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div className="charts-grid-2">
              <ChartCard title="Maintenance by Category" subtitle="Cost and ticket distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={maintenanceByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="category" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip formatter={(v, name) => (name === "cost" ? formatCurrency(v) : v)} />
                    <Legend />
                    <Bar dataKey="cost" name="Cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Operational KPIs" subtitle="Key operational metrics">
                <div className="ops-kpis">
                  <div className="ops-kpi-item">
                    <span className="ops-kpi-label">Total Turnovers</span>
                    <span className="ops-kpi-value">{kpis.totalTurnovers}</span>
                  </div>
                  <div className="ops-kpi-item">
                    <span className="ops-kpi-label">Avg Cleaning Cost</span>
                    <span className="ops-kpi-value">${kpis.avgCleaningCost}</span>
                  </div>
                  <div className="ops-kpi-item">
                    <span className="ops-kpi-label">Cost per Booking</span>
                    <span className="ops-kpi-value">${(241000 / 450).toFixed(0)}</span>
                  </div>
                  <div className="ops-kpi-item">
                    <span className="ops-kpi-label">Maintenance/Unit</span>
                    <span className="ops-kpi-value">${kpis.avgMaintenancePerUnit}</span>
                  </div>
                  <div className="ops-kpi-item">
                    <span className="ops-kpi-label">Cost per Ticket</span>
                    <span className="ops-kpi-value">${(48000 / 163).toFixed(0)}</span>
                  </div>
                  <div className="ops-kpi-item">
                    <span className="ops-kpi-label">Deep Cleans</span>
                    <span className="ops-kpi-value">34</span>
                  </div>
                </div>
              </ChartCard>
            </div>
          </>
        )}

        {/* ==================== BOOKING ANALYTICS ==================== */}
        {activeTab === "booking" && (
          <>
            <SectionHeader
              title="Booking & Occupancy Analytics"
              subtitle="Reservation patterns and trends"
            />

            {/* Booking KPIs */}
            <div className="kpi-grid-6">
              <KPICard
                title="Total Bookings"
                value={kpis.totalBookings}
                change="+15% YoY"
                changeType="positive"
                icon={Calendar}
                color="blue"
              />
              <KPICard
                title="Avg Length of Stay"
                value={`${kpis.avgLOS} nights`}
                icon={Clock}
                color="purple"
              />
              <KPICard
                title="Avg Lead Time"
                value={`${kpis.avgLeadTime} days`}
                icon={Activity}
                color="teal"
              />
              <KPICard
                title="Cancellation Rate"
                value={formatPercent(kpis.cancelRate)}
                change="-1.2% MoM"
                changeType="positive"
                icon={XCircle}
                color="red"
              />
              <KPICard title="Nights Booked" value="4,850" icon={CheckCircle} color="green" />
              <KPICard
                title="Nights Blocked"
                value="320"
                subtext="Owner + maintenance"
                icon={AlertTriangle}
                color="orange"
              />
            </div>

            {/* Booking Charts */}
            <div className="charts-grid-2">
              <ChartCard title="Occupancy Trend" subtitle="12-month occupancy rate">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={occupancyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Area
                      type="monotone"
                      dataKey="occupancy"
                      name="Occupancy"
                      fill="#10b98133"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Length of Stay Distribution" subtitle="Booking duration patterns">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={losDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="nights"
                      stroke="#6b7280"
                      label={{ value: "Nights", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="bookings" name="Bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div className="charts-grid-2">
              <ChartCard title="ADR Trend" subtitle="Average daily rate over time">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={occupancyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" tickFormatter={(v) => `$${v}`} domain={[150, 230]} />
                    <Tooltip formatter={(v) => `$${v}`} />
                    <Line
                      type="monotone"
                      dataKey="adr"
                      name="ADR"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ fill: "#f59e0b", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Booking Source Mix" subtitle="Platform distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={revenueByPlatform}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="percent"
                      label={({ name, percent }) => `${name} ${percent}%`}
                    >
                      {revenueByPlatform.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
