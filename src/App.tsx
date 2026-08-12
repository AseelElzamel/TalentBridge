import React, { useState, useEffect } from "react";
import { UserRole, Application, StudentProfile, ApplicationStatus } from "./types";
import { INITIAL_APPLICATIONS, INITIAL_STUDENT_PROFILES, LEARNING_PATHS } from "./data";

// Subcomponents
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import ApplicationForm from "./components/ApplicationForm";
import StaffDashboard from "./components/StaffDashboard";
import InternshipPortal from "./components/InternshipPortal";
import SkillsGapView from "./components/SkillsGapView";
import LearningHub from "./components/LearningHub";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

// Icons
import {
  Bell,
  BookOpen,
  Briefcase,
  Compass,
  Laptop,
  Monitor,
  Smartphone,
  Sparkles,
  ToggleLeft,
  UserCheck
} from "lucide-react";

export default function App() {
  // PERSISTENCE STATE WRAPPERS
  const [allApplications, setAllApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem("talentbridge_applications");
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [allStudentProfiles, setAllStudentProfiles] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem("talentbridge_profiles");
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILES;
  });

  const [currentUser, setCurrentUser] = useState<{ role: UserRole; email: string } | null>(() => {
    const saved = localStorage.getItem("talentbridge_logged_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Presentation State
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [mobileTab, setMobileTab] = useState<"portal" | "learn" | "gaps" | "profile">("portal");
  const [notifications, setNotifications] = useState<string[]>([
    "🔔 TechNL Staff: New Goal assigned: 'Master Git Flow'.",
    "🎉 Achievement unlocked: 'Duolingo Legend' badge earned!"
  ]);
  const [newNotifyCount, setNewNotifyCount] = useState(2);

  // Sync back to LocalStorage
  useEffect(() => {
    localStorage.setItem("talentbridge_applications", JSON.stringify(allApplications));
  }, [allApplications]);

  useEffect(() => {
    localStorage.setItem("talentbridge_profiles", JSON.stringify(allStudentProfiles));
  }, [allStudentProfiles]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("talentbridge_logged_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("talentbridge_logged_user");
    }
  }, [currentUser]);

  // Handle Dynamic Login Logic
  const handleLogin = (role: UserRole, email: string) => {
    setCurrentUser({ role, email });
    
    if (role === "TechNL Staff") {
      setActiveTab("dashboard");
    } else {
      // Find latest state for student
      const userLatestApp = allApplications
        .filter(a => a.email === email)
        .sort((a, b) => b.year - a.year)[0];

      if (!userLatestApp) {
        // Brand new candidate - direct to Application Form!
        setActiveTab("apply-form");
      } else if (userLatestApp.status === "Rejected") {
        setActiveTab("skills-gap");
      } else {
        // Accepted / Internship active
        setActiveTab("my-internship");
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("dashboard");
  };

  // Student Profile Updates (Streaks, XP, Badges, Journals, Checkins, Goals)
  const handleUpdateStudentProfile = (updatedProfile: StudentProfile) => {
    const nextProfiles = allStudentProfiles.map(p =>
      p.studentEmail === updatedProfile.studentEmail ? updatedProfile : p
    );
    setAllStudentProfiles(nextProfiles);

    // Sync state: If last updated journal indicates struggle, let's push a friendly advice notification
    const lastJournal = updatedProfile.journals[0];
    if (lastJournal && lastJournal.mood === "struggling") {
      setNotifications(prev => [
        `💡 Support alert: We noticed you flagged some blockages in your day journal. Reach out to advisors!`,
        ...prev
      ]);
      setNewNotifyCount(prev => prev + 1);
    }
  };

  // Staff status decider
  const handleUpdateStatus = (
    id: string,
    newStatus: ApplicationStatus,
    reasons?: string[],
    evalNotes?: string,
    rating?: number
  ) => {
    const nextApps = allApplications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status: newStatus,
          rejectionReasons: reasons,
          evaluationNotes: evalNotes,
          ratingScore: rating,
          staffNotes: app.staffNotes 
            ? `${app.staffNotes}\n[Review Decision]: Switched status code to ${newStatus}. Rating ${rating}/5.`
            : `[Review Decision]: Switched status code to ${newStatus}. Rating ${rating}/5.`
        };
      }
      return app;
    });
    setAllApplications(nextApps);

    // If candidate status became accepted/active, let's initialize a physical student profile if not exists
    const app = allApplications.find(a => a.id === id);
    if (app && (newStatus === "Accepted" || newStatus === "Internship Active")) {
      const email = app.email;
      if (!allStudentProfiles.some(p => p.studentEmail === email)) {
        const freshProfile: StudentProfile = {
          studentEmail: email,
          applications: [app],
          xp: 100,
          streak: 1,
          badges: ["First Code"],
          lessonsCompleted: {},
          journals: [],
          checkins: [],
          goals: [
            {
              id: "g-init-1",
              title: "Onboarding & Tooling",
              description: "Configure local staging, git policies and register in the Duolingo code center.",
              dueDate: "2026-06-30",
              status: "in-progress",
              progress: 25
            }
          ]
        };
        setAllStudentProfiles([...allStudentProfiles, freshProfile]);
      }
    }

    setNotifications(prev => [
      `🔔 Placement Board update: Application ${id} changed to status ${newStatus}.`,
      ...prev
    ]);
    setNewNotifyCount(prev => prev + 1);
  };

  const handleAddStaffNotes = (id: string, noteText: string) => {
    const nextApps = allApplications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          staffNotes: app.staffNotes ? `${app.staffNotes}\n[Staff Note]: ${noteText}` : `[Staff Note]: ${noteText}`
        };
      }
      return app;
    });
    setAllApplications(nextApps);
  };

  // Action for new Student registration flows
  const handleNewRegistrationDetailsSubmit = (formDetails: Partial<Application>) => {
    const newApp: Application = {
      id: `app-signup-${Date.now()}`,
      year: 2126, // current simulation year
      program: "TechNL High School Tech Internships",
      date: new Date().toISOString().split("T")[0],
      status: "Pending Review",
      feedback: "",
      firstName: formDetails.firstName || "Student",
      lastName: formDetails.lastName || "Applicant",
      email: formDetails.email || "student@email.com",
      phone: formDetails.phone || "",
      school: formDetails.school || "Gonzaga High School",
      grade: formDetails.grade || "Grade 11",
      resumeName: formDetails.resumeName || "uploaded_resume.pdf",
      portfolioUrl: formDetails.portfolioUrl || "",
      linkedInUrl: formDetails.linkedInUrl || "",
      personalStatement: formDetails.personalStatement || "",
      skills: formDetails.skills || [],
      interests: formDetails.interests || "",
      careerGoals: formDetails.careerGoals || "",
      skillScores: {
        java: 30,
        git: 40,
        problemSolving: 50,
        communication: 70,
        teamwork: 80
      },
      reapplicationCount: 0
    };

    setAllApplications([newApp, ...allApplications]);
  };

  // Find logged student dataset variables
  const getLoggedStudentLatestApp = () => {
    if (!currentUser || currentUser.role !== "Student") return null;
    return allApplications
      .filter(a => a.email === currentUser.email)
      .sort((a,b) => b.year - a.year)[0] || null;
  };

  const getLoggedStudentProfileSnapshot = () => {
    if (!currentUser || currentUser.role !== "Student") return null;
    let prof = allStudentProfiles.find(p => p.studentEmail === currentUser.email);
    if (!prof) {
      // Return safe standard fallback
      prof = {
        studentEmail: currentUser.email,
        applications: [],
        xp: 150,
        streak: 3,
        badges: ["First Step"],
        lessonsCompleted: {},
        journals: [],
        checkins: [],
        goals: []
      };
    }
    return prof;
  };

  const latestApp = getLoggedStudentLatestApp();
  const studentProfile = getLoggedStudentProfileSnapshot();

  // Determine at risk calculations for alerts badge
  const calcAtRiskCount = () => {
    return allStudentProfiles.filter(p => {
      const hasActive = p.journals.length > 0 || p.checkins.length > 0;
      if (!hasActive) return false;
      return p.goals.length > 0 && p.checkins.length === 0;
    }).length;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      
      {/* 1. LOGIN WALL OUTPOST */}
      {!currentUser ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          {/* TOP DUAL PRESENTATION FRAME SECTOR CONTROL BAR */}
          <header className="bg-slate-900 border-b border-slate-850 py-3.5 px-6 flex justify-between items-center text-white z-40 select-none">
            <div className="flex items-center space-x-3.5">
              <span className="text-sm font-black bg-indigo-600 rounded-lg px-2.5 py-1 flex items-center space-x-1.5 shadow-sm">
                <Sparkles className="h-4 w-4 text-amber-300 animate-spin" />
                <span>TalentBridge v1.5</span>
              </span>
              <p className="text-xs text-slate-400 hidden md:block">
                Region: Newfoundland & Labrador Co-op Portal • Simulated Date: June 18, 2026
              </p>
            </div>

            {/* DUSTY SIMULATOR TOGGLE */}
            <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  deviceMode === "desktop"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                <span>Laptop Desktop View</span>
              </button>

              <button
                onClick={() => {
                  setDeviceMode("mobile");
                  if (currentUser.role === "TechNL Staff") {
                    // Mobile is best suited for students. Force login as a student for demo simplicity
                    setCurrentUser({ role: "Student", email: "aisha.rahman@email.com" });
                  }
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  deviceMode === "mobile"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Student Mobile App</span>
              </button>
            </div>
          </header>

          {/* 2. LAPTOP DESKTOP CO-OP APP RUNTIME CLIENT */}
          {deviceMode === "desktop" && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* SIDEBAR CELL */}
              <Sidebar
                role={currentUser.role}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userName={currentUser.role === "TechNL Staff" ? "Staff Coordinator" : (latestApp?.firstName || "Student")}
                userEmail={currentUser.email}
                onLogout={handleLogout}
                pendingCount={allApplications.filter(a => a.status === "Pending Review").length}
                atRiskCount={calcAtRiskCount()}
              />

              {/* DYNAMIC SCROLL CONTAINER ROW */}
              <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-6.5xl mx-auto space-y-6">
                  
                  {/* MULTI_ROUTING TAB CONTROL CHANGER PANEL */}
                  {activeTab === "apply-form" && (
                    <ApplicationForm
                      initialEmail={currentUser.email}
                      onSubmit={handleNewRegistrationDetailsSubmit}
                      onLogout={handleLogout}
                    />
                  )}

                  {activeTab === "dashboard" && currentUser.role === "TechNL Staff" && (
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h1 className="text-2.5xl font-black text-slate-800 tracking-tight">Welcome back, Coordinator Aseel! 🍁</h1>
                          <p className="text-xs text-slate-500 font-medium">Here contains Newfoundland & Labrador’s high school co-op pipeline overview diagnostics.</p>
                        </div>
                        <div className="h-9 font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl px-4 flex items-center text-xs">
                          Role: TechNL Co-op Program Administrator
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                          <h3 className="font-extrabold text-sm text-slate-900">Placement Pipelines Overview</h3>
                          <p className="text-xs text-slate-500">Quickly assign candidates to partner employers like TechNova, CodeVerse, and InnovateX.</p>
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
                            <span className="text-[11px] text-slate-450 uppercase font-black block tracking-widest">Active Placed partners</span>
                            <div className="grid grid-cols-3 gap-2 text-xs font-bold text-slate-700">
                              <span className="bg-white p-2 rounded-lg border border-slate-200">TechNova (12)</span>
                              <span className="bg-white p-2 rounded-lg border border-slate-200">CodeVerse (8)</span>
                              <span className="bg-white p-2 rounded-lg border border-slate-200">InnovateX (6)</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-indigo-950 text-white p-6 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
                          <div className="absolute top-[-10%] right-[-10%] h-32 w-32 bg-indigo-500/10 rounded-full blur-xl" />
                          <h3 className="font-extrabold text-sm text-indigo-200 tracking-tight">Active Advisory Broadcast Notifications</h3>
                          <div className="space-y-2 max-h-24 overflow-y-auto">
                            {notifications.slice(0, 3).map((n, idx) => (
                              <p key={idx} className="text-xs text-indigo-150 leading-relaxed font-light">{n}</p>
                            ))}
                          </div>
                        </div>
                      </div>

                      <AnalyticsDashboard />
                    </div>
                  )}

                  {activeTab === "applicants" && currentUser.role === "TechNL Staff" && (
                    <StaffDashboard
                      applications={allApplications}
                      onUpdateStatus={handleUpdateStatus}
                      onAddStaffNotes={handleAddStaffNotes}
                    />
                  )}

                  {activeTab === "pipeline" && currentUser.role === "TechNL Staff" && (
                    <StaffDashboard
                      applications={allApplications}
                      onUpdateStatus={handleUpdateStatus}
                      onAddStaffNotes={handleAddStaffNotes}
                    />
                  )}

                  {activeTab === "internships" && currentUser.role === "TechNL Staff" && (
                    <InternshipPortal
                      role="TechNL Staff"
                      studentProfiles={allStudentProfiles}
                      onUpdateProfile={handleUpdateStudentProfile}
                    />
                  )}

                  {activeTab === "skills-gap" && (
                    <SkillsGapView
                      application={latestApp}
                      onGoToHub={() => setActiveTab("learning-hub")}
                    />
                  )}

                  {activeTab === "learning-hub" && studentProfile && (
                    <LearningHub
                      profile={studentProfile}
                      onUpdateProfile={handleUpdateStudentProfile}
                    />
                  )}

                  {activeTab === "analytics" && currentUser.role === "TechNL Staff" && (
                    <AnalyticsDashboard />
                  )}

                  {activeTab === "my-internship" && studentProfile && (
                    <div className="space-y-6">
                      
                      {/* LATEST STATUS BANNER ACCORDING TO REJECTION */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5">
                            Status: Active Co-op Placement
                          </span>
                          <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1.5">
                            Welcome back, {latestApp?.firstName || "Student"}! 👋
                          </h1>
                          <p className="text-xs text-slate-500 font-light mt-0.5">Verify checkins, log hours and write your daily journals below.</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-bold text-slate-400 block uppercase">CO-OP SPONSOR</span>
                          <span className="text-sm font-extrabold text-slate-800">TechNova Solutions NL</span>
                        </div>
                      </div>

                      <InternshipPortal
                        role="Student"
                        studentProfiles={allStudentProfiles}
                        onUpdateProfile={handleUpdateStudentProfile}
                      />
                    </div>
                  )}

                  {activeTab === "my-profile" && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                      <h2 className="text-lg font-black text-slate-800 tracking-tight border-b border-slate-100 pb-3">My Registered Credentials</h2>
                      {latestApp ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-600">
                          <div className="space-y-2">
                            <p><strong>Filing ID:</strong> {latestApp.id}</p>
                            <p><strong>First Name:</strong> {latestApp.firstName}</p>
                            <p><strong>Last Name:</strong> {latestApp.lastName}</p>
                            <p><strong>School:</strong> {latestApp.school}</p>
                            <p><strong>Grade Level:</strong> {latestApp.grade}</p>
                          </div>
                          <div className="space-y-2">
                            <p><strong>Email Address:</strong> {latestApp.email}</p>
                            <p><strong>Phone Connection:</strong> {latestApp.phone}</p>
                            <p><strong>Submitted Resume:</strong> {latestApp.resumeName}</p>
                            <p><strong>LinkedIn Port:</strong> {latestApp.linkedInUrl || "None entered"}</p>
                            <p><strong>Portfolio Host:</strong> {latestApp.portfolioUrl || "None entered"}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">No application file submitted yet. Go over to signup form.</p>
                      )}
                    </div>
                  )}

                </div>
              </main>

            </div>
          )}

          {/* 3. MOBILE DEVICE EMULATOR SKIN (Accurate iPhone simulation frame) */}
          {deviceMode === "mobile" && studentProfile && (
            <div className="flex-1 bg-slate-900/50 flex items-center justify-center py-6 select-none animate-fadeIn font-sans">
              
              {/* ACCURATE PHONE CONTAINER SKIN */}
              <div className="relative w-[370px] h-[760px] bg-slate-950 rounded-[48px] border-[10px] border-slate-850 shadow-2xl flex flex-col overflow-hidden relative">
                
                {/* Physical Top Speaker & Notch representation */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-40 h-5.5 bg-slate-950 rounded-b-xl z-50 flex items-center justify-center">
                  <div className="h-1.5 w-12 bg-slate-800 rounded-full" />
                  <div className="h-2 w-2 rounded-full bg-slate-900 ml-3" />
                </div>

                {/* MOBILE STATUS HEADER BAR */}
                <div className="bg-slate-950 text-white pt-6 pb-2 px-6 flex justify-between items-center text-[10px] font-bold z-40 shrink-0">
                  <span>10:34 AM</span>
                  <div className="flex items-center space-x-1.5 text-[8px]">
                    <span className="bg-slate-800 px-1 rounded text-slate-400">LTE</span>
                    <span>🔋 96%</span>
                  </div>
                </div>

                {/* APP BAR HEADER AND NOTIFICATIONS CHIP */}
                <div className="bg-indigo-950 p-4 text-white flex justify-between items-center shrink-0 border-b border-indigo-900/40">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-lg bg-violet-600 flex items-center justify-center font-extrabold text-xs">𝝙</div>
                    <span className="text-xs font-black tracking-tight">TalentBridge Mobile</span>
                  </div>
                  
                  {/* Notifications bell click logs pop alerts */}
                  <div className="relative cursor-pointer" onClick={() => {
                    setNewNotifyCount(0);
                    alert(notifications.join("\n\n"));
                  }}>
                    <Bell className="h-4.5 w-4.5 text-indigo-300 hover:text-white" />
                    {newNotifyCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-rose-600 border border-indigo-950 rounded-full text-[8px] font-bold flex items-center justify-center">
                        {newNotifyCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* PHYSICAL INNER SCREEN VIEW SCROLL CONTAINER */}
                <div className="flex-1 bg-slate-50 overflow-y-auto px-4 py-4 space-y-4">
                  
                  {/* MOBILE VIEW COMPILING ROUTER */}
                  {mobileTab === "portal" && (
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                        <span className="text-[8px] uppercase tracking-wider font-extrabold text-emerald-600 block">Placement Logged</span>
                        {latestApp?.status === "Rejected" ? (
                          <>
                            <h3 className="font-extrabold text-xs text-slate-800">Review & Improvement Plan</h3>
                            <p className="text-[10px] text-slate-450 leading-relaxed">Let's build skills inside the gaps roadmap simulator to improve next year!</p>
                            <button
                              onClick={() => setMobileTab("gaps")}
                              className="mt-2 w-full py-1.5 px-3 bg-indigo-600 text-white font-bold text-[10px] rounded-lg"
                            >
                              Open Gaps Analyzer
                            </button>
                          </>
                        ) : (
                          <>
                            <h3 className="font-extrabold text-xs text-slate-800">My Internship Status</h3>
                            <p className="text-[10px] text-slate-450 leading-relaxed">TechNova Solutions NL Co-op Active</p>
                          </>
                        )}
                      </div>

                      {latestApp?.status !== "Rejected" ? (
                        <InternshipPortal
                          role="Student"
                          studentProfiles={[studentProfile]}
                          onUpdateProfile={handleUpdateStudentProfile}
                        />
                      ) : (
                        <div className="bg-white p-4 rounded-xl border border-slate-205 text-center space-y-2">
                          <p className="text-[10px] text-slate-500 italic font-medium">As an unselected candidate, utilize the Learning center or Analyzer from the footer tabs.</p>
                          <button
                            onClick={() => setMobileTab("learn")}
                            className="py-1.5 px-4 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold rounded-lg w-full"
                          >
                            Go to Duolingo Learning Paths
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {mobileTab === "learn" && (
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <span className="text-[9px] text-indigo-600 font-bold block">Duolingo Skill builder</span>
                        <h4 className="font-bold text-xs text-slate-800">Gamified Learn track</h4>
                      </div>
                      <LearningHub
                        profile={studentProfile}
                        onUpdateProfile={handleUpdateStudentProfile}
                      />
                    </div>
                  )}

                  {mobileTab === "gaps" && (
                    <div className="space-y-4">
                      {latestApp ? (
                        <SkillsGapView
                          application={latestApp}
                          onGoToHub={() => setMobileTab("learn")}
                        />
                      ) : (
                        <p className="text-xs text-slate-400 italic">No historical evaluations found.</p>
                      )}
                    </div>
                  )}

                  {mobileTab === "profile" && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                      <h4 className="font-bold text-xs text-slate-800 border-b border-slate-100 pb-2">Student Mobile Account</h4>
                      <div className="text-[10px] text-slate-600 space-y-1.5 leading-relaxed">
                        <p><strong>Name:</strong> {latestApp?.firstName} {latestApp?.lastName}</p>
                        <p><strong>Current School:</strong> {latestApp?.school}</p>
                        <p><strong>Filing Email:</strong> {currentUser.email}</p>
                        <p className="pt-2 italic text-slate-400 text-[9.5px]">Your profile persists locally on this device.</p>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] rounded-lg mt-3"
                      >
                        Sign Out of App Mobile
                      </button>
                    </div>
                  )}

                </div>

                {/* BOTTOM NATIVE iOS NAVIGATION BAR TABS */}
                <div className="bg-white border-t border-slate-250 py-3 px-3 flex justify-around items-center shrink-0">
                  <button
                    onClick={() => setMobileTab("portal")}
                    className={`flex flex-col items-center space-y-0.5 text-[9px] font-bold ${
                      mobileTab === "portal" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Briefcase className="h-4.5 w-4.5" />
                    <span>My Co-op</span>
                  </button>

                  <button
                    onClick={() => setMobileTab("learn")}
                    className={`flex flex-col items-center space-y-0.5 text-[9px] font-bold ${
                      mobileTab === "learn" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <BookOpen className="h-4.5 w-4.5" />
                    <span>Duolingo Hub</span>
                  </button>

                  <button
                    onClick={() => setMobileTab("gaps")}
                    className={`flex flex-col items-center space-y-0.5 text-[9px] font-bold ${
                      mobileTab === "gaps" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Compass className="h-4.5 w-4.5" />
                    <span>Gaps analysis</span>
                  </button>

                  <button
                    onClick={() => setMobileTab("profile")}
                    className={`flex flex-col items-center space-y-0.5 text-[9px] font-bold ${
                      mobileTab === "profile" ? "text-indigo-600" : "text-slate-300 hover:text-slate-600"
                    }`}
                  >
                    <UserCheck className="h-4.5 w-4.5" />
                    <span>Account</span>
                  </button>
                </div>

                {/* iPhone tactile home indicator bar */}
                <div className="bg-slate-950 pb-2 px-1 flex justify-center items-center shrink-0">
                  <div className="h-1 w-28 bg-slate-800 rounded-full" />
                </div>

              </div>

            </div>
          )}

        </>
      )}

    </div>
  );
}
