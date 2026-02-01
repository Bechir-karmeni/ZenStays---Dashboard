import React, { useMemo, useState } from "react";
import "./Scheduling.css";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// build a 6x7 grid (Mon-first) for a given month
function buildMonthGrid(year, monthIndex /* 0=Jan */) {
  // JS getDay(): 0=Sun..6=Sat, but we want Mon-first
  const first = new Date(year, monthIndex, 1);
  const firstDow = (first.getDay() + 6) % 7; // 0..6 with 0 = Monday
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells = [];
  // days from previous month to fill leading
  for (let i = 0; i < firstDow; i++) {
    const d = new Date(year, monthIndex, -i);
    cells.unshift({ date: d, inMonth: false });
  }
  // current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, monthIndex, d), inMonth: true });
  }
  // trailing cells to make 42 cells total
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    cells.push({ date: d, inMonth: false });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    cells.push({ date: d, inMonth: false });
  }
  return cells;
}

function fmtISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Scheduling() {
  // default to current month
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  // ---- STR EVENTS ----
  const events = useMemo(() => {
    const y = year;
    const m = String(month + 1).padStart(2, "0");
    return [
      // Check-ins
      { date: `${y}-${m}-01`, title: "Check-in: 123 Main St", type: "checkin" },
      { date: `${y}-${m}-03`, title: "Check-in: 456 Oak Ave", type: "checkin" },
      { date: `${y}-${m}-08`, title: "Check-in: 789 Pine Rd", type: "checkin" },
      { date: `${y}-${m}-12`, title: "Check-in: 321 Elm St", type: "checkin" },
      { date: `${y}-${m}-18`, title: "Check-in: 654 Cedar Ln", type: "checkin" },
      { date: `${y}-${m}-22`, title: "Check-in: 123 Main St", type: "checkin" },
      { date: `${y}-${m}-28`, title: "Check-in: 456 Oak Ave", type: "checkin" },

      // Check-outs
      { date: `${y}-${m}-04`, title: "Checkout: 123 Main St", type: "checkout" },
      { date: `${y}-${m}-07`, title: "Checkout: 456 Oak Ave", type: "checkout" },
      { date: `${y}-${m}-11`, title: "Checkout: 789 Pine Rd", type: "checkout" },
      { date: `${y}-${m}-16`, title: "Checkout: 321 Elm St", type: "checkout" },
      { date: `${y}-${m}-21`, title: "Checkout: 654 Cedar Ln", type: "checkout" },
      { date: `${y}-${m}-26`, title: "Checkout: 123 Main St", type: "checkout" },

      // Cleaning
      { date: `${y}-${m}-04`, title: "Cleaning: 123 Main St", type: "cleaning" },
      { date: `${y}-${m}-07`, title: "Cleaning: 456 Oak Ave", type: "cleaning" },
      { date: `${y}-${m}-11`, title: "Cleaning: 789 Pine Rd", type: "cleaning" },
      { date: `${y}-${m}-16`, title: "Cleaning: 321 Elm St", type: "cleaning" },
      { date: `${y}-${m}-21`, title: "Cleaning: 654 Cedar Ln", type: "cleaning" },

      // Maintenance
      { date: `${y}-${m}-05`, title: "AC Repair: 789 Pine Rd", type: "maintenance" },
      { date: `${y}-${m}-10`, title: "Plumbing: 321 Elm St", type: "maintenance" },
      { date: `${y}-${m}-19`, title: "HVAC Service: 123 Main St", type: "maintenance" },
      { date: `${y}-${m}-25`, title: "Appliance Check: 456 Oak Ave", type: "maintenance" },

      // Inspections
      { date: `${y}-${m}-02`, title: "Inspection: 654 Cedar Ln", type: "inspection" },
      { date: `${y}-${m}-15`, title: "Quarterly Inspection: Downtown", type: "inspection" },
      { date: `${y}-${m}-29`, title: "Inspection: 789 Pine Rd", type: "inspection" },

      // Client Meetings
      { date: `${y}-${m}-06`, title: "Meeting: Client A - Review", type: "meeting" },
      { date: `${y}-${m}-13`, title: "Meeting: Client B - Onboarding", type: "meeting" },
      { date: `${y}-${m}-20`, title: "Meeting: Client C - Quarterly", type: "meeting" },
      { date: `${y}-${m}-27`, title: "Meeting: New Property Owner", type: "meeting" },

      // Payments
      { date: `${y}-${m}-01`, title: "Owner Payout: Client A", type: "payment" },
      { date: `${y}-${m}-15`, title: "Owner Payout: All Clients", type: "payment" },
      { date: `${y}-${m}-30`, title: "Monthly Revenue Report", type: "payment" },
    ];
  }, [year, month]);

  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const e of events) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date).push(e);
    }
    return map;
  }, [events]);

  function go(delta) {
    const m = month + delta;
    if (m < 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else if (m > 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth(m);
    }
  }

  function goToToday() {
    setYear(currentYear);
    setMonth(currentMonth);
  }

  return (
    <div className="b5-container">
      <div className="sched-header">
        <div className="sched-title">
          <Calendar size={20} />
          <h2>{monthLabel}</h2>
        </div>
        <div className="sched-actions">
          <button className="b5-btn" onClick={() => go(-1)}>
            <ArrowLeft size={18} /> Prev
          </button>
          <button className="b5-btn" onClick={goToToday}>
            Today
          </button>
          <button className="b5-btn" onClick={() => go(1)}>
            Next <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="sched-grid">
        {WEEKDAYS.map((w) => (
          <div key={w} className="sched-weekday">
            {w}
          </div>
        ))}

        {grid.map((cell, idx) => {
          const iso = fmtISO(cell.date);
          const day = cell.date.getDate();
          const dayEvents = eventsByDay.get(iso) || [];
          const isToday = fmtISO(today) === iso;
          return (
            <div
              key={idx}
              className={`sched-cell ${cell.inMonth ? "" : "is-out"} ${isToday ? "is-today" : ""}`}
            >
              <div className={`sched-day ${isToday ? "today-marker" : ""}`}>{day}</div>
              <div className="sched-events">
                {dayEvents.map((e, i) => (
                  <div key={i} className={`sched-event tag-${e.type}`} title={e.title}>
                    {e.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="sched-legend">
        <span className="sched-pill tag-checkin">Check-in</span>
        <span className="sched-pill tag-checkout">Checkout</span>
        <span className="sched-pill tag-cleaning">Cleaning</span>
        <span className="sched-pill tag-maintenance">Maintenance</span>
        <span className="sched-pill tag-inspection">Inspection</span>
        <span className="sched-pill tag-meeting">Meeting</span>
        <span className="sched-pill tag-payment">Payment</span>
      </div>
    </div>
  );
}
