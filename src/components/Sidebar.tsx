import {
  Award,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Compass,
  FileBarChart2,
  GitBranch,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldAlert,
  Users
} from "lucide-react";
import React from "react";
import { UserRole } from "../types";

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userEmail: string;
  userName: string;
  onLogout: () => void;
  pendingCount?: number;
  atRiskCount?: number;
}

export default function Sidebar({
  role,
  activeTab,
  setActiveTab,
  userEmail,
  userName,
  onLogout,
  pendingCount = 0,
  atRiskCount = 0
}: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  interface SidebarItem {
    id: string;
    label: string;
    icon: any;
    badge?: number;
    badgeColor?: string;
  }

  // Define navigation items based on User Role limits
  const staffItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "applicants", label: "Applicants", icon: Users, badge: pendingCount > 0 ? pendingCount : undefined, badgeColor: "bg-indigo-600 text-white" },
    { id: "pipeline", label: "Pipeline Board", icon: GitBranch },
    { id: "internships", label: "Internships", icon: Briefcase, badge: atRiskCount > 0 ? atRiskCount : undefined, badgeColor: "bg-rose-500 text-white" },
    { id: "skills-gap", label: "Skills Gap", icon: Compass },
    { id: "learning-hub", label: "Learning Hub", icon: BookOpen },
    { id: "analytics", label: "Reports & Analytics", icon: FileBarChart2 },
  ];

  const studentItems: SidebarItem[] = [
    { id: "my-internship", label: "My Internship", icon: Briefcase },
    { id: "learning-hub", label: "Learning Hub", icon: BookOpen },
    { id: "skills-gap", label: "Skills Gap Analysis", icon: Compass },
    { id: "my-profile", label: "My Profile", icon: Settings },
  ];

  const currentItems = role === "TechNL Staff" ? staffItems : studentItems;

  return (
    <div
      className={`min-h-screen border-r border-slate-800 text-slate-300 flex flex-col justify-between transition-all duration-300 relative ${
        collapsed ? "w-20" : "w-64"
      }`}
      style={{backgroundImage: 'linear-gradient(to bottom, #991E72, #74C8CB)'}}
    >
      {/* COLLAPSE FLAGGING TOGGLER */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-6 right-[-14px] bg-indigo-600 hover:bg-indigo-700 text-white h-7 w-7 rounded-full flex items-center justify-center border border-slate-800 shadow-md cursor-pointer z-50 transition-transform"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div>
        {/* LOGO HUD CONTAINER */}
        <div className={`p-6 flex items-center space-x-3 border-b border-slate-800/80 ${collapsed ? "justify-center" : ""}`}>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
            <span className="text-white font-black text-base italic tracking-wider">𝝙</span>
          </div>
          {!collapsed && (
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-none">TalentBridge</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">TechNL SaaS</span>
            </div>
          )}
        </div>

        {/* ROLE INDICATOR COMPONENT */}
        {!collapsed && (
          <div className="mx-4 my-4 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-lg bg-indigo-950/80 flex items-center justify-center text-indigo-400 font-bold">
              {role === "TechNL Staff" ? <Briefcase className="h-4 w-4 text-violet-400" /> : <Award className="h-4 w-4 text-emerald-400" />}
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Logged in as</span>
              <span className="text-xs font-semibold text-slate-200 block truncate max-w-[140px]">{userName}</span>
            </div>
          </div>
        )}

        {/* PHYSICAL LIST MENU ITEMS */}
        <nav className="px-3 space-y-1 mt-4">
          {currentItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center py-3 px-4 rounded-xl text-sm font-semibold transition-all group relative ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 scale-[1.02]"
                    : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-100"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <IconComponent className={`h-5 w-5 shrink-0 ${isSelected ? "text-white" : "text-slate-400 group-hover:text-slate-200"} ${collapsed ? "" : "mr-3"}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                
                {/* NOTIFICATION BADGE */}
                {!collapsed && item.badge !== undefined && (
                  <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}

                {/* SLENT TOOLTIP FOR COLLAPSED VIEWS */}
                {collapsed && (
                  <div className="absolute left-20 bg-slate-900 border border-slate-700 text-white text-xs font-bold py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* USER BOTTOM FOOTER */}
      <div className="p-4 border-t border-slate-850 bg-slate-950/20 space-y-3">
        {!collapsed && (
          <div className="px-2 truncate">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Connected Account</span>
            <span className="text-xs text-slate-400 font-medium truncate block">{userEmail}</span>
          </div>
        )}

        <button
          onClick={onLogout}
          className={`w-full flex items-center py-2.5 px-4 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/15 transition-all outline-none ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className={`h-4.5 w-4.5 shrink-0 ${collapsed ? "" : "mr-2"}`} />
          {!collapsed && <span>Sign Out Securely</span>}
        </button>
      </div>
    </div>
  );
}
