import React from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2, X, Clock } from "lucide-react";

type CalendarType = "invite" | "event" | "task";

type CalendarEntry = {
  id: string;
  title: string;
  date: string;
  time: string; // HH:mm format
  type: CalendarType;
};

const dayColors: Record<CalendarType, string> = {
  invite: "bg-violet-100 text-violet-700 border-violet-200",
  event: "bg-emerald-100 text-emerald-700 border-emerald-200",
  task: "bg-amber-100 text-amber-700 border-amber-200"
};

const defaultEntries: CalendarEntry[] = [
  { id: "mentor-sync", title: "Weekly Advisor Sync", date: "2026-06-02", time: "10:00", type: "invite" },
  { id: "portfolio-review", title: "Portfolio Review", date: "2026-06-08", time: "14:30", type: "event" },
  { id: "capstone-checkin", title: "Capstone Check-in", date: "2026-06-12", time: "09:00", type: "task" },
  { id: "mock-demo", title: "Mock Demo Prep", date: "2026-06-19", time: "13:00", type: "event" },
  { id: "all-hands", title: "TechNL All Hands", date: "2026-06-24", time: "11:00", type: "invite" },
];

interface StudentCalendarPageProps {
  userEmail: string;
}

export default function StudentCalendarPage({ userEmail }: StudentCalendarPageProps) {
  const storageKey = `talentbridge-calendar-${userEmail}`;

  const [monthCursor, setMonthCursor] = React.useState(() => new Date(2026, 5, 1));
  const [selectedDate, setSelectedDate] = React.useState("2026-06-12");
  const [draftTitle, setDraftTitle] = React.useState("");
  const [draftTime, setDraftTime] = React.useState("09:00");
  const [draftType, setDraftType] = React.useState<CalendarType>("event");
  const [showDayModal, setShowDayModal] = React.useState(false);

  const [entries, setEntries] = React.useState<CalendarEntry[]>(() => {
    if (typeof window === "undefined") return defaultEntries;
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultEntries;
    } catch {
      return defaultEntries;
    }
  });

  React.useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries, storageKey]);

  const monthLabel = monthCursor.toLocaleString("en-US", { month: "long", year: "numeric" });

  const calendarDays = React.useMemo(() => {
    const firstOfMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
    const startDay = new Date(firstOfMonth);
    const offset = (firstOfMonth.getDay() + 7) % 7;
    startDay.setDate(firstOfMonth.getDate() - offset);

    const days: Date[] = [];
    for (let index = 0; index < 42; index += 1) {
      const next = new Date(startDay);
      next.setDate(startDay.getDate() + index);
      days.push(next);
    }

    return days;
  }, [monthCursor]);

  const selectedDateEntries = React.useMemo(
    () => entries
      .filter((entry) => entry.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time)),
    [entries, selectedDate]
  );

  const addEntry = () => {
    const title = draftTitle.trim();
    if (!title || !draftTime) return;

    const nextEntry: CalendarEntry = {
      id: `entry-${Date.now()}`,
      title,
      date: selectedDate,
      time: draftTime,
      type: draftType,
    };

    setEntries((prev) => [...prev, nextEntry].sort((a, b) => a.date.localeCompare(b.date)));
    setDraftTitle("");
    setDraftTime("09:00");
    setDraftType("event");
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const goToPreviousMonth = () => {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-200">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">Student planner</p>
              <h2 className="text-2xl font-black text-slate-900">Calendar</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="min-w-[180px] text-center text-lg font-black text-slate-800">{monthLabel}</div>
            <button
              type="button"
              onClick={goToNextMonth}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayLabel) => (
              <div key={dayLabel} className="py-2">{dayLabel}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const key = day.toISOString().split('T')[0];
              const isCurrentMonth = day.getMonth() === monthCursor.getMonth();
              const isSelected = key === selectedDate;
              const dayEntries = entries.filter((entry) => entry.date === key);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedDate(key);
                    setShowDayModal(true);
                  }}
                  className={`min-h-[120px] rounded-xl border p-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-violet-400 bg-violet-50 shadow-sm"
                      : isCurrentMonth
                        ? "border-slate-200 bg-white hover:border-slate-300"
                        : "border-slate-100 bg-slate-50 text-slate-400"
                  }`}
                >
                  <div className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                    isSelected ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-700"
                  }`}>
                    {day.getDate()}
                  </div>

                  <div className="space-y-1.5">
                    {dayEntries.slice(0, 2).map((entry) => (
                      <div
                        key={entry.id}
                        className={`truncate rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${dayColors[entry.type]}`}
                      >
                        {entry.title}
                      </div>
                    ))}
                    {dayEntries.length > 2 && (
                      <div className="text-[9px] font-bold text-slate-500">+{dayEntries.length - 2} more</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day Modal */}
      {showDayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-6 sticky top-0 bg-white">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Day view</p>
                <h3 className="text-2xl font-black text-slate-900">
                  {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDayModal(false)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedDateEntries.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No events or tasks scheduled for this date.</p>
              ) : (
                <div className="space-y-4">
                  {selectedDateEntries.map((entry) => (
                    <div key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] ${dayColors[entry.type]}`}>
                              {entry.type}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm font-bold">{entry.time}</span>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-slate-900">{entry.title}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            removeEntry(entry.id);
                          }}
                          className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 transition-all shrink-0"
                          aria-label={`Remove ${entry.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Quick view</p>
              <h3 className="text-lg font-black text-slate-900">
                {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
            </div>
          </div>

          {selectedDateEntries.length === 0 ? (
            <p className="text-sm text-slate-500">No events or tasks scheduled for this date yet.</p>
          ) : (
            <div className="space-y-3">
              {selectedDateEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <div className="min-w-0">
                    <div className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] mb-1 ${dayColors[entry.type]}`}>
                      {entry.type}
                    </div>
                    <p className="text-sm font-bold text-slate-800 truncate">{entry.title}</p>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {entry.time}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 transition-all shrink-0"
                    aria-label={`Remove ${entry.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200">
            <div className="h-8 w-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
              <Plus className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Add an item</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Title</label>
              <input
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                placeholder="Mentor check-in"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none ring-0 focus:border-violet-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none ring-0 focus:border-violet-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Time</label>
              <input
                type="time"
                value={draftTime}
                onChange={(event) => setDraftTime(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none ring-0 focus:border-violet-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Type</label>
              <select
                value={draftType}
                onChange={(event) => setDraftType(event.target.value as CalendarType)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none ring-0 focus:border-violet-400"
              >
                <option value="event">Event</option>
                <option value="task">Task</option>
                <option value="invite">Invite</option>
              </select>
            </div>

            <button
              type="button"
              onClick={addEntry}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 hover:opacity-95 transition-all"
            >
              Add to calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
