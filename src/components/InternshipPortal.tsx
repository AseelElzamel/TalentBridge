import React, { useState } from "react";
import { JournalEntry, StudentProfile } from "../types";
import { AlertCircle, Calendar, CheckSquare, ClipboardList, Clock, FileText, Heart, Plus, Send, ShieldAlert, Sparkles, Star, Users } from "lucide-react";

interface InternshipPortalProps {
  role: "Student" | "TechNL Staff";
  studentProfiles: StudentProfile[];
  onUpdateProfile: (updated: StudentProfile) => void;
  onPostNewGoal?: (email: string, goalTitle: string, dueDate: string) => void;
  allStaffApplications?: any[];
}

export default function InternshipPortal({
  role,
  studentProfiles,
  onUpdateProfile,
  onPostNewGoal,
  allStaffApplications = []
}: InternshipPortalProps) {
  const [selectedStudentEmail, setSelectedStudentEmail] = useState(studentProfiles[0]?.studentEmail || "");
  
  // Student form state
  const [journalContent, setJournalContent] = useState("");
  const [journalHours, setJournalHours] = useState(8);
  const [journalMood, setJournalMood] = useState<"excellent" | "good" | "neutral" | "struggling">("good");

  // Weekly check-in form state
  const [weeklyAccomplish, setWeeklyAccomplish] = useState("");
  const [weeklyChallenges, setWeeklyChallenges] = useState("");
  const [weeklySupport, setWeeklySupport] = useState("");

  // Staff additions
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDate, setNewGoalDate] = useState("2026-06-30");
  const [atRiskOnly, setAtRiskOnly] = useState(false);

  const activeProfile = studentProfiles.find(p => p.studentEmail === selectedStudentEmail) || studentProfiles[0];

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim() || !activeProfile) return;

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      content: journalContent,
      hoursSpent: Number(journalHours),
      mood: journalMood
    };

    onUpdateProfile({
      ...activeProfile,
      journals: [newEntry, ...activeProfile.journals]
    });

    setJournalContent("");
    setJournalHours(8);
  };

  const handleSubmitCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;

    const newCheckin = {
      id: `ch-${Date.now()}`,
      weekNumber: activeProfile.checkins.length + 1,
      date: new Date().toISOString().split("T")[0],
      accomplishments: weeklyAccomplish,
      challenges: weeklyChallenges,
      supportNeeded: weeklySupport,
      submitted: true,
      attendanceVerified: true
    };

    onUpdateProfile({
      ...activeProfile,
      checkins: [newCheckin, ...activeProfile.checkins]
    });

    setWeeklyAccomplish("");
    setWeeklyChallenges("");
    setWeeklySupport("");
  };

  const handleToggleGoal = (goalId: string) => {
    if (!activeProfile) return;
    const nextGoals = activeProfile.goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          status: g.status === "completed" ? "in-progress" : "completed",
          progress: g.status === "completed" ? 40 : 100
        } as any;
      }
      return g;
    });

    onUpdateProfile({
      ...activeProfile,
      goals: nextGoals
    });
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !activeProfile) return;

    const newG = {
      id: `goal-${Date.now()}`,
      title: newGoalTitle,
      description: "Goal added by TechNL staff",
      dueDate: newGoalDate,
      status: "in-progress" as const,
      progress: 0
    };

    onUpdateProfile({
      ...activeProfile,
      goals: [...activeProfile.goals, newG]
    });

    setNewGoalTitle("");
  };

  // RISK ALGORITHM CALCULATOR
  // Flags student if journals total hours is low, or last checkin reviews is struggling, or attendance rate < 95%
  const isStudentAtRisk = (profile: StudentProfile) => {
    if (profile.goals.length > 0 && profile.checkins.length === 0) return true; // Missed checkins!
    if (profile.journals.some(j => j.mood === "struggling")) return true; // Flag struggling mood
    return false;
  };

  const filteredProfiles = studentProfiles.filter(p => {
    // Only show active student/accepted ones (ruler status check)
    const hasActiveInternship = p.journals.length > 0 || p.checkins.length > 0 || p.goals.length > 0;
    if (atRiskOnly) {
      return hasActiveInternship && isStudentAtRisk(p);
    }
    return hasActiveInternship;
  });

  return (
    <div id="internships-portal-hud" className="space-y-6 font-sans">
      
      {/* 1. STUDENT VIEW PORTAL LAYOUT */}
      {role === "Student" && activeProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* COL 1 & 2: JOURNAL & CHECKINS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* GOALS CHECKLIST PANEL */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Cocurricular Objectives & Goals</h3>
                  <p className="text-[11px] text-slate-450 leading-normal">Goals defined by your TechNL program coordinator.</p>
                </div>
                <span className="text-xs bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 font-bold">
                  {activeProfile.goals.filter(g => g.status === "completed").length} / {activeProfile.goals.length} Finished
                </span>
              </div>

              <div className="space-y-3">
                {activeProfile.goals.map((g) => (
                  <div key={g.id} className="p-3.5 bg-slate-50 border border-slate-200 hover:border-violet-300 rounded-xl flex items-center justify-between transition-all">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={g.status === "completed"}
                        onChange={() => handleToggleGoal(g.id)}
                        className="mt-1 h-4 w-4 rounded text-violet-600 focus:ring-violet-500 cursor-pointer"
                      />
                      <div>
                        <span className={`text-xs font-bold block ${g.status === "completed" ? "line-through text-slate-400" : "text-slate-800"}`}>
                          {g.title}
                        </span>
                        <p className="text-[10px] text-slate-400">Due Date: {g.dueDate}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      g.status === "completed" ? "bg-emerald-50 text-emerald-800" : "bg-violet-50 text-violet-800"
                    }`}>
                      {g.progress}% Complete
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* DAILY PROGRESS LOG BOOK */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 tracking-tight font-sans">Submit Daily co-op Progress Journal</h3>
                <p className="text-[11px] text-slate-450">Maintain high placement records by logging your co-op observations.</p>
              </div>

              <form onSubmit={handleAddJournal} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <textarea
                  rows={3}
                  placeholder="Record summary of hours worked, figma templates completed, or code challenges faced today..."
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                  required
                />
                
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Hours Logged</label>
                    <input
                      type="number"
                      value={journalHours}
                      onChange={(e) => setJournalHours(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      min={1}
                      max={12}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Today's Placement Mood</label>
                    <select
                      value={journalMood}
                      onChange={(e) => setJournalMood(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      <option value="excellent">🔥 Energetic & Excellent</option>
                      <option value="good">😊 Good & On-track</option>
                      <option value="neutral">😐 Neutral Progress</option>
                      <option value="struggling">⚠️ Facing block / Struggling</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                  >
                    <Send className="h-3 w-3" />
                    <span>Submit Day Log</span>
                  </button>
                </div>
              </form>

              {/* JOURNAL STREAM HISTORIES */}
              <div className="space-y-3.5 border-t border-slate-100 pt-5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Logged Journal Feed</span>
                {activeProfile.journals.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No days filed yet. Submit your first logger above!</p>
                ) : (
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {activeProfile.journals.map((j) => (
                      <div key={j.id} className="p-3 bg-slate-50 border border-slate-250/60 rounded-xl relative">
                        <div className="flex justify-between items-center text-[10px] text-slate-450 font-bold mb-1.5">
                          <span>📅 Filed: {j.date}</span>
                          <span className="text-indigo-600 font-bold uppercase tracking-wider">{j.hoursSpent} Hours Tracked</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-light">{j.content}</p>
                        <span className={`text-[9px] font-black uppercase mt-2 inline-block px-2 py-0.5 rounded-md ${
                          j.mood === "excellent" ? "bg-emerald-50 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          Mood: {j.mood}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* COL 3 STUDENT SIDEBAR: SUBMIT WEEKLY FORM */}
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Active Weekly Survey Report</h3>
              </div>

              <form onSubmit={handleSubmitCheckin} className="space-y-3 text-xs text-slate-600">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Challenges faced this week?</label>
                  <input
                    type="text"
                    value={weeklyChallenges}
                    onChange={(e) => setWeeklyChallenges(e.target.value)}
                    placeholder="e.g. Getting used to pull requests"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Core accomplishments achieved?</label>
                  <input
                    type="text"
                    value={weeklyAccomplish}
                    onChange={(e) => setWeeklyAccomplish(e.target.value)}
                    placeholder="e.g. Completed responsive grid component"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">What helper support do you need?</label>
                  <input
                    type="text"
                    value={weeklySupport}
                    onChange={(e) => setWeeklySupport(e.target.value)}
                    placeholder="e.g. Code review from high-level engineers"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 mt-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Submit Weekly Check-In</span>
                </button>
              </form>
            </div>

            {/* UPCOMING MEETINGS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Upcoming Mentor Syncs</span>
              <div className="space-y-2.5">
                <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100 flex items-start space-x-3">
                  <Calendar className="h-4.5 w-4.5 text-violet-600 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-extrabold text-slate-800 block">Weekly Advisor Sync</span>
                    <span className="text-[10px] text-slate-500 font-bold block">Friday, June 20 at 11:00 AM</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. STAFF VIEW PORTAL LAYOUT */}
      {role === "TechNL Staff" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn">
          
          {/* LEFT SIDEBAR: MANAGE CO-OP STUDENTS */}
          <div className="lg:col-span-1 space-y-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm h-fit">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest">Active Placements</span>
              
              {/* AT-RISK FILTER FILTER */}
              <button
                onClick={() => setAtRiskOnly(!atRiskOnly)}
                className={`py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 ${
                  atRiskOnly ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
              >
                <ShieldAlert className="h-3 w-3" />
                <span>Show At-Risk</span>
              </button>
            </div>

            <div className="space-y-2">
              {filteredProfiles.map(p => {
                const isSelected = selectedStudentEmail === p.studentEmail;
                const atRisk = isStudentAtRisk(p);

                return (
                  <button
                    key={p.studentEmail}
                    onClick={() => setSelectedStudentEmail(p.studentEmail)}
                    className={`w-full p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-950 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block font-bold text-xs truncate">{p.studentEmail.split("@")[0]}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">XP Earned: {p.xp} XP</span>
                    
                    {atRisk && (
                      <span className="absolute top-2 right-2 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md flex items-center space-x-0.5 animate-pulse">
                        <AlertCircle className="h-2 w-2" />
                        <span>AT-RISK</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANELS: INTERNSHIP FEEDBACKS AND WORK MONITOR */}
          <div className="lg:col-span-3 space-y-6">
            
            {activeProfile ? (
              <>
                {/* ACTIVE PROFILE SUMMARY HEADER */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-violet-600 uppercase tracking-widest block">Coordinator Workspace Panel</span>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{activeProfile.studentEmail}</h2>
                    <p className="text-xs text-slate-500 font-light mt-0.5">Internship tracker & daily journal inspector</p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <div className="text-center bg-indigo-50 border border-indigo-100 rounded-xl py-1 px-3">
                      <span className="text-[9px] text-indigo-700 font-bold block uppercase">Weekly attendance</span>
                      <span className="text-sm font-black text-slate-800">96.7% rate</span>
                    </div>

                    <div className="text-center bg-emerald-50 border border-emerald-100 rounded-xl py-1 px-3">
                      <span className="text-[9px] text-emerald-800 font-bold block uppercase">Check-ins filed</span>
                      <span className="text-sm font-black text-slate-800">{activeProfile.checkins.length} submitted</span>
                    </div>
                  </div>
                </div>

                {/* AT RISK NOTIFIER LOGIC PANEL */}
                {isStudentAtRisk(activeProfile) && (
                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start space-x-3 text-rose-800">
                    <ShieldAlert className="h-5.5 w-5.5 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
                    <div className="text-xs space-y-1">
                      <span className="font-extrabold block">At-Risk Student Trigger Flagged</span>
                      <p className="text-rose-700 leading-normal">
                        This applicant has been highlighted by our automated monitoring algorithm because of a struggling placement journal entry or missed check-ins. Please verify details and contact the user immediately.
                      </p>
                    </div>
                  </div>
                )}

                {/* CREATE DIRECT GOALS FOR STUDENT */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-sm text-slate-800 tracking-tight font-sans">Active Placement Goals Checklist</h3>
                    <span className="text-[10px] text-slate-400 font-bold">Manage objectives dynamically</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Goal Lister */}
                    <div className="space-y-2">
                      <span className="text-[10.5px] font-bold text-slate-450 uppercase block">Existing Goals</span>
                      {activeProfile.goals.map(g => (
                        <div key={g.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800">{g.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            g.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>{g.status}</span>
                        </div>
                      ))}
                    </div>

                    {/* Goal Creator Form */}
                    <form onSubmit={handleCreateGoal} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                      <span className="text-[10px] font-extrabold text-slate-450 uppercase block">Add Dynamic placement Goal</span>
                      
                      <div>
                        <input
                          type="text"
                          placeholder="Goal Title (e.g. Master React routing)"
                          value={newGoalTitle}
                          onChange={(e) => setNewGoalTitle(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                          required
                        />
                      </div>

                      <div>
                        <input
                          type="date"
                          value={newGoalDate}
                          onChange={(e) => setNewGoalDate(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-1.5 px-3 bg-slate-850 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1"
                      >
                        <Plus className="h-4.5 w-4.5" />
                        <span>Log New Goal</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* AUDITING DAILY JOURNALS SUBMISSIONS */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Active Work Journals Inspector</h3>
                  {activeProfile.journals.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No days logged by this student yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                      {activeProfile.journals.map((j) => (
                        <div key={j.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-black text-slate-800">📅 Date: {j.date}</span>
                              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-black uppercase">{j.hoursSpent} Hours</span>
                            </div>
                            <p className="text-xs text-slate-500 font-light mt-1.5 leading-relaxed">{j.content}</p>
                          </div>
                          <span className={`text-[9px] font-black uppercase text-center shrink-0 border rounded px-2 py-0.5 ${
                            j.mood === "excellent" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}>{j.mood}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AUDITING WEEKLY SURVEY SUBMISSIONS */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Submitted weekly Surveys List</h3>
                  {activeProfile.checkins.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No weekly checkins submitted by this student yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {activeProfile.checkins.map((ch) => (
                        <div key={ch.id} className="p-4 bg-slate-50 border border-slate-250/60 rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between items-center border-b border-slate-200/55 pb-1.5">
                            <span className="font-black text-slate-800">Week #{ch.weekNumber} Report</span>
                            <span className="text-[9px] text-slate-400">Submitted: {ch.date}</span>
                          </div>
                          <p><strong>Accomplishments:</strong> {ch.accomplishments}</p>
                          <p><strong>Challenges Faced:</strong> {ch.challenges}</p>
                          <p><strong>Advisory Support Asked:</strong> {ch.supportNeeded}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-slate-50 p-12 text-center rounded-2xl border border-dashed border-slate-350 text-slate-400">
                <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-bold">Select a placed intern from the left panel to inspect journals, goals, and flag-risk statuses.</p>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
