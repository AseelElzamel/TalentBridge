import React, { useState } from "react";
import { UserRole } from "../types";
import { Award, Briefcase, GraduationCap, ShieldAlert, Sparkles } from "lucide-react";

interface LoginProps {
  onLogin: (role: UserRole, email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<UserRole>("TechNL Staff");
  const [email, setEmail] = useState("staff@technl.ca");
  const [password, setPassword] = useState("••••••••");

  const handleQuickLogin = (selectedRole: UserRole, selectedEmail: string) => {
    onLogin(selectedRole, selectedEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role, email);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === "TechNL Staff") {
      setEmail("staff@technl.ca");
    } else {
      setEmail("aisha.rahman@email.com"); // default student
    }
  };

  return (
    <div id="login-container" className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* LEFT SIDE: ILLUSTRATIVE BRAND HUB */}
      <div className="lg:w-1/2 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden" style={{backgroundImage: 'linear-gradient(to right, #991E72, #74C8CB)'}}>
        {/* Ambient light effects representing modern premium portals */}
        <div className="absolute top-[-20%] left-[-25%] w-[80%] h-[80%] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white/5 blur-3xl" />

        {/* TOP BRAND HEADER */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-xl font-bold tracking-wider text-white">𝝙</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight">TalentBridge</span>
            <p className="text-xs text-indigo-300 font-medium">TechNL Co-op & Internships</p>
          </div>
        </div>

        {/* MAIN EMBODIMENT & TAGLINE */}
        <div className="my-auto py-12 relative z-10 max-w-md">
          <div className="inline-flex items-center space-x-2 bg-white/15 border border-white/30 px-3 py-1.5 rounded-full text-xs text-white font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Empowering NL's Next Generation of Tech</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Bridge Talent.<br />Build Futures.
          </h1>
          <p className="text-white/90 text-lg font-light leading-relaxed mb-8">
            The exclusive SaaS placement portal connecting Newfoundland & Labrador high school students with premium technical internships, direct mentor pipelines, and custom learning paths.
          </p>

          {/* CUSTOM VECTOR ART STATS REPRESENTATION */}
          <div className="backdrop-blur-md rounded-2xl border border-white/20 p-6 space-y-4" style={{backgroundColor: 'rgba(255, 255, 255, 0.08)'}}>
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">Newfoundland Talent Impact</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-3xl font-extrabold text-white">325+</span>
                <p className="text-xs text-white/80">Registered Students</p>
              </div>
              <div className="border-l border-white/20 pl-4">
                <span className="text-3xl font-extrabold text-emerald-300">72%</span>
                <p className="text-xs text-white/80">Reapplicant Success</p>
              </div>
              <div className="border-l border-white/20 pl-4">
                <span className="text-3xl font-extrabold text-cyan-200">12K+</span>
                <p className="text-xs text-white/80">Skills XP Earned</p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="relative z-10 text-xs text-white/70 flex justify-between items-center border-t border-white/20 pt-6">
          <span>© 2026 TechNL. All rights reserved.</span>
          <span className="hover:text-white cursor-pointer transition-colors">Support Center</span>
        </div>
      </div>

      {/* RIGHT SIDE: PROFESSIONAL LOGIN FLOW */}
      <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 bg-slate-50">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign in to your account</h2>
            <p className="text-sm text-slate-500 mt-2">Access your student internship timeline or manage candidate pipelines.</p>
          </div>

          {/* ROLE SELECTOR CARDS */}
          <div className="grid grid-cols-2 gap-4">
            <button
              id="role-btn-student"
              onClick={() => handleRoleChange("Student")}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                role === "Student"
                  ? "bg-white border-violet-500 ring-2 ring-violet-500/10 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <GraduationCap className={`h-6 w-6 ${role === "Student" ? "text-violet-500" : "text-slate-400"}`} />
                {role === "Student" && <span className="h-2 w-2 rounded-full bg-violet-500" />}
              </div>
              <span className="block font-bold text-slate-800 text-sm">Student Portal</span>
              <span className="block text-xs text-slate-500 mt-0.5">Submit journals, track goals, and earn XP</span>
            </button>

            <button
              id="role-btn-staff"
              onClick={() => handleRoleChange("TechNL Staff")}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                role === "TechNL Staff"
                  ? "bg-white border-violet-500 ring-2 ring-violet-500/10 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Briefcase className={`h-6 w-6 ${role === "TechNL Staff" ? "text-violet-500" : "text-slate-400"}`} />
                {role === "TechNL Staff" && <span className="h-2 w-2 rounded-full bg-violet-500" />}
              </div>
              <span className="block font-bold text-slate-800 text-sm">TechNL Staff</span>
              <span className="block text-xs text-slate-500 mt-0.5">Approve placements, stats, & guide mentors</span>
            </button>
          </div>

          {/* PHYSICAL FORM CONTAINER */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email address</label>
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium text-slate-800 text-sm"
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-semibold text-violet-600 hover:text-violet-700">Forgot password?</a>
              </div>
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium text-slate-800 text-sm"
                required
              />
            </div>

            <button
              id="submit-login-btn"
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all text-sm flex items-center justify-center space-x-2"
            >
              <span>Sign In to Dashboard</span>
            </button>
          </form>

          {/* QUICK-ACCESS TEST SUITE */}
          <div className="bg-violet-50/70 border border-violet-100 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4.5 w-4.5 text-violet-600" />
              <span className="text-xs font-bold text-violet-900 tracking-wide uppercase">Developer Sandbox & Test Accounts</span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              Directly login into specific programmatic student workflow states as defined by the application requirements:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin("TechNL Staff", "staff@technl.ca")}
                className="py-2.5 px-3 bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-lg text-slate-700 text-left transition-all"
              >
                <span className="block font-bold text-indigo-700">💻 TechNL Staff Panel</span>
                <span className="text-[10px] text-slate-500">Pipeline, Kanban, Analytics, Reappliants</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("Student", "aisha.rahman@email.com")}
                className="py-2.5 px-3 bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-lg text-slate-700 text-left transition-all"
              >
                <span className="block font-bold text-violet-700">🎓 Accepted Student</span>
                <span className="text-[10px] text-slate-500">Aisha: 2026 Active, Journal, Weekly Check-in</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("Student", "marmie@gmail.com")}
                className="py-2.5 px-3 bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-lg text-slate-700 text-left transition-all"
              >
                <span className="block font-bold text-rose-700">🎯 Rejected / Improvement</span>
                <span className="text-[10px] text-slate-500">Marmie: Skill Gap Radar & Improvement Plan</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("Student", "Laila@gmail.com")}
                className="py-2.5 px-3 bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-lg text-slate-700 text-left transition-all"
              >
                <span className="block font-bold text-emerald-700">✅ Accepted Student</span>
                <span className="text-[10px] text-slate-500">Laila: Active placement and my internship</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
