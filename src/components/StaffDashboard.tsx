import React, { useState } from "react";
import { Application, ApplicationStatus } from "../types";
import { AlertCircle, Calendar, Check, ClipboardCopy, Clock, Eye, FileText, Send, Star, Trash2, X, XCircle } from "lucide-react";

interface StaffDashboardProps {
  applications: Application[];
  onUpdateStatus: (id: string, newStatus: ApplicationStatus, reasons?: string[], evalNotes?: string, rating?: number) => void;
  onAddStaffNotes: (id: string, notes: string) => void;
}

export default function StaffDashboard({ applications, onUpdateStatus, onAddStaffNotes }: StaffDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("All");
  const [activePipelineStage, setActivePipelineStage] = useState<string>("All");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<"Accept" | "Reject">("Accept");
  
  // Decision Form Fields
  const [ratingScore, setRatingScore] = useState(4);
  const [evaluationNotes, setEvaluationNotes] = useState("");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [newStaffNote, setNewStaffNote] = useState("");

  const REJECTION_REASONS_LIST = [
    "Low Java Knowledge",
    "Poor Resume",
    "Weak Communication",
    "No Portfolio",
    "Limited Technical Experience"
  ];

  // Pipeline columns representation
  const PIPELINE_COLUMNS: { label: string; status: ApplicationStatus }[] = [
    { label: "Applied/Pending", status: "Pending Review" },
    { label: "Shortlisted/Accepted", status: "Accepted" },
    { label: "Active Interns", status: "Internship Active" },
    { label: "Completed co-ops", status: "Internship Completed" }
  ];

  const filteredApps = applications.filter(app => {
    const matchesSearch = `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = schoolFilter === "All" || app.school === schoolFilter;
    const matchesStage = activePipelineStage === "All" || app.status === activePipelineStage;
    return matchesSearch && matchesSchool && matchesStage;
  });

  // Calculate top visual KPI cards
  const totalCount = applications.length;
  const pendingCount = applications.filter(a => a.status === "Pending Review").length;
  const acceptedCount = applications.filter(a => a.status === "Accepted").length;
  const activeCount = applications.filter(a => a.status === "Internship Active").length;
  const rejectedCount = applications.filter(a => a.status === "Rejected").length;

  const handleToggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleOpenDecisionModal = (type: "Accept" | "Reject") => {
    setDecisionType(type);
    setEvaluationNotes("");
    setSelectedReasons([]);
    setIsDecisionModalOpen(true);
  };

  const handleSubmitDecision = () => {
    if (!selectedApp) return;
    
    // Status translation map
    const nextStatus: ApplicationStatus = decisionType === "Accept" ? "Accepted" : "Rejected";
    onUpdateStatus(selectedApp.id, nextStatus, selectedReasons, evaluationNotes, ratingScore);
    
    // Sync UI detail preview immediately
    setSelectedApp({
      ...selectedApp,
      status: nextStatus,
      rejectionReasons: selectedReasons,
      evaluationNotes: evaluationNotes,
      ratingScore: ratingScore
    });

    setIsDecisionModalOpen(false);
  };

  const handlePostStaffNote = () => {
    if (!selectedApp || !newStaffNote.trim()) return;
    onAddStaffNotes(selectedApp.id, newStaffNote);
    
    // update detail state
    setSelectedApp({
      ...selectedApp,
      staffNotes: selectedApp.staffNotes 
        ? `${selectedApp.staffNotes}\n[New Note]: ${newStaffNote}` 
        : `[New Note]: ${newStaffNote}`
    });
    setNewStaffNote("");
  };

  // Find all historical other filings for this student (same email)
  const getStudentHistory = (email: string) => {
    return applications.filter(app => app.email === email).sort((a,b) => a.year - b.year);
  };

  return (
    <div id="staff-pipeline-panel" className="space-y-6 font-sans">
      
      {/* SaaS STATS KPI COUNTERS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Candidates</span>
          <span className="text-xl font-extrabold text-slate-800 block mt-1">{totalCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-amber-500 block uppercase tracking-wider">Pending Review</span>
          <span className="text-xl font-extrabold text-amber-600 block mt-1">{pendingCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-indigo-500 block uppercase tracking-wider">Accepted Offers</span>
          <span className="text-xl font-extrabold text-indigo-600 block mt-1">{acceptedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-emerald-505 block uppercase tracking-wider">Active Co-ops</span>
          <span className="text-xl font-extrabold text-emerald-600 block mt-1">{activeCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-rose-500 block uppercase tracking-wider">Unselected Lists</span>
          <span className="text-xl font-extrabold text-rose-600 block mt-1">{rejectedCount}</span>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search candidate names or school databases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-xs text-slate-800 font-medium"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <select
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold"
          >
            <option value="All">All High Schools</option>
            <option value="Holy Heart of Mary High">Holy Heart</option>
            <option value="Gonzaga High School">Gonzaga High</option>
            <option value="Prince of Wales Collegiate">PWC</option>
            <option value="O'Donel High School">O'Donel</option>
          </select>

          <select
            value={activePipelineStage}
            onChange={(e) => setActivePipelineStage(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold"
          >
            <option value="All">All Pipeline Stages</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Accepted">Accepted Offer</option>
            <option value="Rejected">Unselected / Skills Gaps</option>
            <option value="Internship Active">Active Interns</option>
          </select>
        </div>
      </div>

      {/* PIPELINE COLUMNS BOARD AND APPLICANT SELECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PIPELINE COMPONENT */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Active Registries list ({filteredApps.length})</h3>
          
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredApps.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 text-center">No matching students found.</p>
            ) : (
              filteredApps.map(app => {
                const active = selectedApp?.id === app.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => {
                      setSelectedApp(app);
                      setNewStaffNote("");
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      active
                        ? "bg-violet-50/75 border-violet-500 ring-2 ring-violet-500/10 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-extrabold text-xs text-slate-800 block">
                        {app.firstName} {app.lastName}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        app.status === "Pending Review"
                          ? "bg-amber-100 text-amber-800"
                          : app.status === "Accepted"
                          ? "bg-indigo-100 text-indigo-800"
                          : app.status === "Rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {app.status === "Pending Review" ? "Pending" : app.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>{app.school}</span>
                      <span className="font-semibold text-slate-700">{app.grade}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] border-t border-slate-200/50 mt-2 pt-1.5 text-slate-400">
                      <span>Sub: {app.date}</span>
                      <span className="text-indigo-600 font-bold hover:underline">View details</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* CANDIDATE COMPREHENSIVE DETAIL COMPONENT */}
        <div className="lg:col-span-8">
          {selectedApp ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-5">
              
              {/* TOP HEADER PREVIEW */}
              <div className="bg-slate-50 p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">Candidate Workspace File</span>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">
                    {selectedApp.firstName} {selectedApp.lastName}
                  </h2>
                  <p className="text-xs text-slate-500 font-light mt-0.5">{selectedApp.school} • {selectedApp.grade}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {selectedApp.status === "Pending Review" && (
                    <>
                      <button
                        onClick={() => handleOpenDecisionModal("Accept")}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Accept Offer</span>
                      </button>

                      <button
                        onClick={() => handleOpenDecisionModal("Reject")}
                        className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                  {selectedApp.status !== "Pending Review" && (
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full uppercase">
                      Decision Completed
                    </span>
                  )}
                </div>
              </div>

              {/* TWO PANEL SECTOR */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* LEFT DETAIL CELL: FORMS DATA */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Application Summary</h4>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-755 font-medium">
                    <li><strong className="text-slate-400">Email:</strong> {selectedApp.email}</li>
                    <li><strong className="text-slate-400">Phone:</strong> {selectedApp.phone}</li>
                    <li><strong className="text-slate-400">LinkedIn:</strong> <a href={selectedApp.linkedInUrl} target="_blank" className="text-indigo-600 underline truncate">{selectedApp.linkedInUrl || "Not listed"}</a></li>
                    <li><strong className="text-slate-400">Portfolio:</strong> <a href={selectedApp.portfolioUrl} target="_blank" className="text-indigo-600 underline truncate">{selectedApp.portfolioUrl || "Not listed"}</a></li>
                    <li><strong className="text-slate-400">Personal Statement:</strong> <p className="text-[11px] text-slate-500 italic mt-1 leading-relaxed bg-slate-50 border border-slate-150 p-3 rounded-lg font-light">{selectedApp.personalStatement}</p></li>
                    <li><strong className="text-slate-400">Aspirations & Goals:</strong> {selectedApp.careerGoals}</li>
                  </ul>
                </div>

                {/* RIGHT DETAIL CELL: TIMELINE COMPARISON CO-OP (THE CORE THREADS EXPLANATION) */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                    <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Applicant Academic History</h4>
                    <span className="text-[10px] font-bold text-indigo-600">Multi-year tracking audit</span>
                  </div>

                  {/* Multi year applications comparative timeline widget */}
                  <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {getStudentHistory(selectedApp.email).map((hist, idx) => (
                      <div key={hist.id} className="flex space-x-3 items-start relative z-10 pl-1.5 select-none">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                          hist.status === "Rejected"
                            ? "bg-rose-50 border-rose-300 text-rose-600"
                            : "bg-emerald-50 border-emerald-300 text-emerald-600"
                        }`}>
                          {hist.year === 2025 ? "25" : "26"}
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-[11px] flex-1">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{hist.year} Application Filing</span>
                            <span className={hist.status === "Rejected" ? "text-rose-600" : "text-emerald-600"}>
                              {hist.status}
                            </span>
                          </div>
                          {hist.rejectionReasons && hist.rejectionReasons.length > 0 && (
                            <div className="mt-1 pt-1 border-t border-slate-200/50">
                              <span className="text-[9px] font-semibold text-rose-500">Reasons Cited: {hist.rejectionReasons.join(", ")}</span>
                            </div>
                          )}
                          <div className="mt-1 flex justify-between text-[9px] text-slate-500">
                            <span>Java Score: {hist.skillScores.java}%</span>
                            <span>Git: {hist.skillScores.git}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* STAFF NOTE LOG ADDITIONS */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Evaluation / Staff notes</h4>
                    <pre className="text-[10px] leading-relaxed text-slate-600 bg-amber-50/50 p-2 border border-amber-100 rounded-lg max-h-24 overflow-y-auto whitespace-pre-wrap font-sans">
                      {selectedApp.staffNotes || "No staff logs on file yet."}
                    </pre>

                    {/* NEW STAFF NOTE CREATION */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Log comment..."
                        value={newStaffNote}
                        onChange={(e) => setNewStaffNote(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                      <button
                        onClick={handlePostStaffNote}
                        className="py-1 px-3 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-900 transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                </div>

              </div>
              
            </div>
          ) : (
            <div className="bg-slate-50 p-12 text-center rounded-2xl border border-dashed border-slate-350 text-slate-400">
              <Eye className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-bold">Select a student applicant from the sidebar to review logs, rating levels, and process co-op evaluations.</p>
            </div>
          )}
        </div>

      </div>

      {/* DETAILED REJECTION/APPROVALS DECISION MODAL PROCESS */}
      {isDecisionModalOpen && selectedApp && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden relative animate-scaleUp">
            
            {/* Header branding */}
            <div className={`p-5 text-white ${decisionType === "Accept" ? "bg-emerald-600" : "bg-rose-600"}`}>
              <span className="font-black text-sm tracking-wide uppercase">
                {decisionType === "Accept" ? "Confirm Placement Acceptance" : "Cite Gaps Rejection Checklist"}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                You are executing a permanent decision for <strong>{selectedApp.firstName} {selectedApp.lastName}</strong>. This status will apply immediately across their Student Dashboard.
              </p>

              {decisionType === "Accept" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Intern Performance Rating (1-5 Stars)</label>
                    <select
                      value={ratingScore}
                      onChange={(e) => setRatingScore(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Excellent Applicant</option>
                      <option value="4">⭐⭐⭐⭐ Meets Standards</option>
                      <option value="3">⭐⭐⭐ Neutral</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Placement Notes / Matching Company suggestions</label>
                    <textarea
                      rows={3}
                      value={evaluationNotes}
                      onChange={(e) => setEvaluationNotes(e.target.value)}
                      placeholder="e.g. Excellent frontend skills, matches TechNova Solutions UI projects."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-rose-900 uppercase tracking-wider mb-2">Select Reasons for Rejection (* Select multiple)</label>
                    <div className="space-y-2">
                      {REJECTION_REASONS_LIST.map(reason => {
                        const isSelected = selectedReasons.includes(reason);
                        return (
                          <button
                            key={reason}
                            onClick={() => handleToggleReason(reason)}
                            className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                              isSelected ? "bg-rose-50 border-rose-400 text-rose-800" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{reason}</span>
                            <span className={`h-4 w-4 rounded-full border ${isSelected ? "bg-rose-500 border-rose-500" : "bg-white border-slate-300"}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Growth Actionable Notes (Constructive feedback)</label>
                    <textarea
                      rows={3}
                      value={evaluationNotes}
                      onChange={(e) => setEvaluationNotes(e.target.value)}
                      placeholder="e.g. Focus on completing Level 1-4 Java loops in the Learning hub. Master git conflict resolution."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                </div>
              )}

            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-105 flex justify-end space-x-2">
              <button
                onClick={() => setIsDecisionModalOpen(false)}
                className="py-2 px-4 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDecision}
                disabled={decisionType === "Reject" && selectedReasons.length === 0}
                className={`py-2 px-5 text-white font-bold text-xs rounded-lg ${
                  decisionType === "Accept" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                }`}
              >
                Save Decision
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
