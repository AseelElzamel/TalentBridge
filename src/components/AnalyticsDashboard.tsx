import React, { useState } from "react";
import { METRIC_ANALYTICS } from "../data";
import { Award, BarChart3, CheckSquare, GraduationCap, TrendingUp, Users } from "lucide-react";

export default function AnalyticsDashboard() {
  const [hoveredReason, setHoveredReason] = useState<number | null>(null);
  const [hoveredSchool, setHoveredSchool] = useState<number | null>(null);

  return (
    <div id="analytics-panel" className="space-y-6 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports & Program Analytics</h1>
          <p className="text-xs text-slate-500 font-medium">Analyze Newfoundland & Labrador High School technical internship KPIs.</p>
        </div>
        <div className="flex space-x-2 shrink-0">
          <span className="text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-100 rounded-full px-3 py-1 flex items-center space-x-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>2026 Current Cohort</span>
          </span>
          <span className="text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
            Region: NL (St. John's)
          </span>
        </div>
      </div>

      {/* TOP ANALYTICAL TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="h-11 w-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <Users className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest block">Total Cohort Growth</span>
            <span className="text-2xl font-black text-slate-800 block">325</span>
            <span className="text-[10px] text-emerald-600 font-bold block">▲ +33% since last year</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="h-11 w-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <GraduationCap className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest block">Primary High School</span>
            <span className="text-lg font-extrabold text-slate-800 block">Holy Heart High</span>
            <span className="text-[10px] text-slate-500 font-bold block">34% of overall applicant roster</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-650 flex items-center justify-center font-bold">
            <Award className="h-5.5 w-5.5 text-emerald-500" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest block">Reapplicant Success Rate</span>
            <span className="text-2xl font-black text-slate-800 block">72%</span>
            <span className="text-[10px] text-emerald-600 font-bold block">▲ Direct learning hub correlation</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CheckSquare className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest block">Active Placements</span>
            <span className="text-2xl font-black text-slate-800">47 Interns</span>
            <span className="text-[10px] text-slate-500 font-bold block">96% on-time attendance</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: COHORT APPLICANTS PER YEAR */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Applicants Roster Growth (Year-over-Year)</h3>
            <p className="text-[11px] text-slate-450 leading-normal">Growth tracking indicating strong rising interest in NL tech co-ops.</p>
          </div>

          {/* Interactive SVG Column Chart */}
          <div className="h-52 w-full bg-slate-50/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-end justify-around h-40 border-b border-slate-250 pb-1 relative">
              {/* background grid guide lines */}
              <div className="absolute inset-x-0 top-1/4 border-t border-slate-200/50 pointer-events-none" />
              <div className="absolute inset-x-0 top-1/2 border-t border-slate-200/50 pointer-events-none" />
              <div className="absolute inset-x-0 top-3/4 border-t border-slate-200/50 pointer-events-none" />

              {METRIC_ANALYTICS.applicantsPerYear.map((item, idx) => {
                const maxVal = 350;
                const percentHeight = (item.count / maxVal) * 100;
                return (
                  <div key={item.year} className="flex flex-col items-center w-20 group relative z-10">
                    <span className="text-[10px] font-black text-slate-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count} applicants
                    </span>
                    <div
                      className="w-12 bg-gradient-to-t from-violet-600 to-indigo-500 rounded-t-lg transition-all duration-500 shadow-sm hover:from-violet-500 hover:to-indigo-400 cursor-pointer"
                      style={{ height: `${percentHeight}%`, minHeight: "20px" }}
                    />
                    <span className="text-xs font-bold text-slate-500 mt-2">{item.year}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold px-2 pt-2">
              <span>Primary Source: TechNL Application Database</span>
              <span>Metric: Submitted Registrations</span>
            </div>
          </div>
        </div>

        {/* CHART 2: COMMON REJECTION REASONS ANALYSIS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Main Skill Gaps / Rejection Factors</h3>
            <p className="text-[11px] text-slate-450 leading-normal">Frequency analysis specifying reasons for initial candidates rejection.</p>
          </div>

          <div className="space-y-3.5">
            {METRIC_ANALYTICS.rejectionReasons.map((item, idx) => {
              const maxFrequency = 50;
              const ratio = (item.frequency / maxFrequency) * 100;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredReason(idx)}
                  onMouseLeave={() => setHoveredReason(null)}
                  className={`space-y-1 transition-all ${hoveredReason === idx ? "translate-x-1" : ""}`}
                >
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700">{item.reason}</span>
                    <span className="font-extrabold text-slate-600">{item.frequency} times cited</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0 ? "bg-rose-500" : idx === 1 ? "bg-orange-500" : "bg-violet-500"
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CHART 3: SCHOOL REPRESENTATIVE RATIOS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Applications By Regional School</h3>
            <p className="text-[11px] text-slate-450 leading-normal">Distribution indicating geographic student registrations around St. John's.</p>
          </div>

          <div className="space-y-3">
            {METRIC_ANALYTICS.schoolsDistribution.map((item, idx) => {
              const colors = ["#5B4BFF", "#7C6BFF", "#A78BFA", "#F43F5E", "#10B981"];
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredSchool(idx)}
                  onMouseLeave={() => setHoveredSchool(null)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                    hoveredSchool === idx ? "bg-slate-50 scale-[1.01]" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                    <span className="text-xs font-bold text-slate-700">{item.school}</span>
                  </div>
                  <div className="text-right flex items-center space-x-4">
                    <span className="text-xs font-semibold text-slate-500">{item.count} students</span>
                    <span className="text-xs font-black text-slate-800 bg-slate-100 rounded-md px-1.5 py-0.5">{item.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 4: REAPPLICATIONS GROWTH EFFECT */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Reapplication Success Rate Correlation</h3>
            <p className="text-[11px] text-slate-450 leading-normal">Comparing initial application approval yields vs. candidates who reapplied after the gamified gaps learning.</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-around h-44">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Cohort 1st-Try Acceptance</span>
                <span className="text-2xl font-black text-slate-700 block">38%</span>
              </div>
              <div className="w-1/2 bg-slate-200 h-3 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full w-[38%]" />
              </div>
            </div>

            <div className="border-t border-slate-200/75 my-2" />

            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-600 block uppercase tracking-wider">Reapplied & Placed successfully</span>
                <span className="text-3.5xl font-black text-emerald-600 block">72%</span>
              </div>
              <div className="w-1/2 bg-slate-200 h-4 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[72%] shadow-sm animate-pulse" />
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start space-x-2.5">
            <Award className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-800 leading-normal">
              <strong>Direct correlation:</strong> Students who review rejected feedback reports and complete at least 3 levels in the <strong>Gamified Learning Hub</strong> double their baseline acceptance chances on the subsequent program cycle.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
