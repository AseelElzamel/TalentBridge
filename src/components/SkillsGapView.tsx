import React, { useState } from "react";
import { Application } from "../types";
import { Award, BookOpen, ChevronRight, HelpCircle, Sparkles, Target, TrendingUp } from "lucide-react";

interface SkillsGapViewProps {
  application: Application | null;
  onGoToHub?: () => void;
}

export default function SkillsGapView({ application, onGoToHub }: SkillsGapViewProps) {
  const [estimateCompletePaths, setEstimateCompletePaths] = useState<string[]>([]);
  
  if (!application) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
        <p className="text-slate-500 font-medium">No application records found for evaluation analysis.</p>
      </div>
    );
  }

  // Define skill variables from the selected application
  const scores = application.skillScores || {
    java: 20,
    git: 30,
    problemSolving: 45,
    communication: 70,
    teamwork: 75,
    portfolio: 10
  };

  const rejectionReasons = application.rejectionReasons || [
    "Low Java Knowledge", "No Portfolio", "Limited Technical Experience"
  ];

  // Map reasons to advice
  const adviceMap: { [key: string]: { path: string; action: string; pathId: string } } = {
    "Low Java Knowledge": { path: "Java Fundamentals Path", action: "Complete Levels 1-5 (Variables, Loops, Conditions)", pathId: "path-java" },
    "No Portfolio": { path: "React and UI/UX Path", action: "Complete Portfolio Building level and compile a GitHub page", pathId: "path-react" },
    "Weak Communication": { path: "Professional Communication", action: "Work on the resume building and interview levels", pathId: "path-react" },
    "Limited Technical Experience": { path: "Git and Version Control", action: "Learn staging, commits, and PR merge conflicts", pathId: "path-git" },
  };

  const allInterests = [
    { name: "Java Programming", score: scores.java, key: "path-java" },
    { name: "Git & Branches", score: scores.git, key: "path-git" },
    { name: "Problem Solving", score: scores.problemSolving, key: "path-ps" },
    { name: "Professional Communication", score: scores.communication, key: "path-comm" },
    { name: "Github Portfolio", score: scores.portfolio || 0, key: "path-port" }
  ];

  const strengths = allInterests.filter(i => i.score >= 70);
  const weaknesses = allInterests.filter(i => i.score < 60);

  // Simulation calculations
  const baseRate = 38; // standard baseline
  const calcPredictedAcceptance = () => {
    let bonus = 0;
    if (estimateCompletePaths.includes("java")) bonus += 15;
    if (estimateCompletePaths.includes("git")) bonus += 10;
    if (estimateCompletePaths.includes("portfolio")) bonus += 20;
    if (estimateCompletePaths.includes("comms")) bonus += 10;
    return Math.min(baseRate + bonus, 95);
  };

  const handleToggleEstimate = (key: string) => {
    if (estimateCompletePaths.includes(key)) {
      setEstimateCompletePaths(estimateCompletePaths.filter(k => k !== key));
    } else {
      setEstimateCompletePaths([...estimateCompletePaths, key]);
    }
  };

  return (
    <div id="skills-gap-container" className="space-y-6 font-sans">
      
      {/* HEADER FEEDBACK BANNER */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center space-x-2 bg-indigo-900/40 border border-white/10 rounded-full px-3 py-1 text-xs text-violet-200 font-bold w-fit">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>TalentBridge Skills Gap Analyzer v1.2</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Hi, {application.firstName}! Here is your personalized development blueprint
        </h1>
        <p className="text-sm text-indigo-100 font-light leading-relaxed max-w-2xl">
          You were not selected this year, but we've analyzed your exact scoring metrics to prepare a personalized roadmap to double your chances of being accepted in our next co-op cycle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* COL 1 & 2: VISUAL CHART & DETAILED GAPS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STATS PROGRESS CHART */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Core Evaluation Scores Breakdown</h3>
              <p className="text-[11px] text-slate-450 leading-normal">Scores rated during your {application.year} submission cycle.</p>
            </div>

            <div className="space-y-4">
              {allInterests.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">{item.name}</span>
                    <span className={item.score >= 75 ? "text-emerald-600" : item.score < 50 ? "text-rose-500" : "text-amber-500"}>
                      {item.score}% {item.score >= 75 ? "• Strong" : item.score < 50 ? "• Needs Focus" : "• Standard"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.score >= 75 ? "bg-emerald-500" : item.score < 50 ? "bg-rose-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHECKLISTS OF STRENGTHS & WEAKNESSES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">🌟 Your Academic Strengths</h4>
              {strengths.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No highly rated skills flagged yet. Keep practicing in the learning hub!</p>
              ) : (
                <ul className="space-y-2">
                  {strengths.map(s => (
                    <li key={s.name} className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{s.name} ({s.score}%)</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
              <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">⚠️ Identified Gaps</h4>
              {weaknesses.map(w => (
                <li key={w.name} className="list-none bg-rose-50 text-rose-850 p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                  <span>{w.name} ({w.score}% score)</span>
                </li>
              ))}
            </div>
          </div>

          {/* LOGICAL ACTION PLAN CARD */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Next Steps: Personal Improvement Milestones</h3>
            <div className="space-y-3">
              {rejectionReasons.map((reason, idx) => {
                const advice = adviceMap[reason] || { path: "SaaS Fundamentals Component", action: "Complete Levels on overall development", pathId: "path-java" };
                return (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center group hover:border-violet-300 transition-all">
                    <div className="space-y-1 max-w-sm">
                      <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest block">GAP CITED: {reason}</span>
                      <span className="text-xs font-bold text-slate-800 block">Recommended Focus: {advice.path}</span>
                      <p className="text-xs text-slate-500 font-light">{advice.action}</p>
                    </div>
                    {onGoToHub && (
                      <button
                        onClick={onGoToHub}
                        className="py-1.5 px-3 bg-white hover:bg-violet-600 border border-violet-200 hover:border-violet-600 rounded-lg text-[11px] font-bold text-violet-700 hover:text-white transition-all flex items-center space-x-1 shrink-0"
                      >
                        <BookOpen className="h-3 w-3" />
                        <span>Go Learn</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* COL 3S: GAMIFIED PREDICTION CALCULATOR */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-50/50 rounded-bl-full flex items-center justify-center text-indigo-500">
              <HelpCircle className="h-4.5 w-4.5" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest block">VIRTUAL SIMULATOR</span>
              <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Readiness & Acceptance Estimator</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Check boxes to simulate completing those learning courses and watch your estimated acceptance rating grow.
              </p>
            </div>

            {/* PREDICTIVE TILES CHART */}
            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-450 font-bold block uppercase tracking-wider">Estimated 2027 Co-op Placement Probability</span>
              <span className="text-4xl font-extrabold text-indigo-600">{calcPredictedAcceptance()}%</span>
              <p className="text-[10px] text-slate-500 italic block">
                {calcPredictedAcceptance() >= 75 ? "🔥 Advanced Readiness Category!" : "🚀 Action needed to boost score"}
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">My Custom Learning Plan Completeness</span>
              
              <button
                onClick={() => handleToggleEstimate("java")}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex justify-between items-center ${
                  estimateCompletePaths.includes("java")
                    ? "bg-violet-50/50 border-violet-300 text-violet-950 font-bold"
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                <span>Complete Java levels (+15% score)</span>
                <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center text-[10px] ${
                  estimateCompletePaths.includes("java") ? "bg-violet-500 text-white" : "border-slate-300 bg-white"
                }`}>✓</span>
              </button>

              <button
                onClick={() => handleToggleEstimate("git")}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex justify-between items-center ${
                  estimateCompletePaths.includes("git")
                    ? "bg-violet-50/50 border-violet-300 text-violet-950 font-bold"
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                <span>Complete Git modules (+10% score)</span>
                <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center text-[10px] ${
                  estimateCompletePaths.includes("git") ? "bg-violet-500 text-white" : "border-slate-300 bg-white"
                }`}>✓</span>
              </button>

              <button
                onClick={() => handleToggleEstimate("portfolio")}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex justify-between items-center ${
                  estimateCompletePaths.includes("portfolio")
                    ? "bg-emerald-50/50 border-emerald-300 text-emerald-950 font-bold"
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                <span>Design React Portfolio (+20% score)</span>
                <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center text-[10px] ${
                  estimateCompletePaths.includes("portfolio") ? "bg-emerald-500 text-white" : "border-slate-300 bg-white"
                }`}>✓</span>
              </button>
            </div>
          </div>

          {/* ROADMAP GRAPH CARD */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest block">Development Timeline Roadmap</h4>
            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              
              <div className="flex space-x-3 items-start relative">
                <div className="h-7 w-7 rounded-full bg-violet-600 border border-white shadow-sm flex items-center justify-center text-white text-xs font-bold shrink-0 relative z-10">1</div>
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">Complete Skill Analysis</span>
                  <p className="text-[10px] text-slate-500">Read detailed coordinator feedback reasons logs.</p>
                </div>
              </div>

              <div className="flex space-x-3 items-start relative">
                <div className="h-7 w-7 rounded-full bg-indigo-50 border border-slate-200 text-slate-600 text-xs font-bold shrink-0 relative z-10">2</div>
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">Earn Badge levels</span>
                  <p className="text-[10px] text-slate-500">Earn at least 500 XP points inside the Java and Git pathways modules.</p>
                </div>
              </div>

              <div className="flex space-x-3 items-start relative">
                <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold shrink-0 relative z-10">3</div>
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">Submit Improved Portfolio</span>
                  <p className="text-[10px] text-slate-500">Upload live portfolio links before the Autumn deadline.</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
