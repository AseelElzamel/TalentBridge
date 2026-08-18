import React, { useState } from "react";
import { LearningPath, StudentProfile } from "../types";
import { LEARNING_PATHS } from "../data";
import { Award, BookOpen, Check, Flame, HelpCircle, Lock, Play, Star, Trophy, Zap } from "lucide-react";

interface LearningHubProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
}

export default function LearningHub({ profile, onUpdateProfile }: LearningHubProps) {
  const [selectedPath, setSelectedPath] = useState<LearningPath>(LEARNING_PATHS[0]);
  const [activeQuizLevel, setActiveQuizLevel] = useState<any | null>(null);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string>("");
  const [quizResult, setQuizResult] = useState<"correct" | "incorrect" | null>(null);
  const [toastMsg, setToastMsg] = useState<string>("");

  // Helper checked levels status
  const isLevelCompleted = (pathId: string, levelId: string) => {
    return profile.lessonsCompleted[pathId]?.includes(levelId) || false;
  };

  const isLevelLocked = (pathId: string, idx: number) => {
    // Level 1 is always unlocked. Others unlocked only if previous is completed.
    if (idx === 0) return false;
    const prevLevelId = selectedPath.levels[idx - 1].id;
    return !isLevelCompleted(pathId, prevLevelId);
  };

  const handleLaunchQuiz = (level: any, idx: number) => {
    if (isLevelLocked(selectedPath.id, idx)) {
      setToastMsg("🔐 This level is locked. Complete previous levels first!");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }
    setActiveQuizLevel(level);
    setQuizSelectedOption("");
    setQuizResult(null);
  };

  const launchActivity = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCheckQuizAnswer = () => {
    if (!activeQuizLevel) return;
    const isCorrect = quizSelectedOption === activeQuizLevel.quiz.correctAnswer;
    if (isCorrect) {
      setQuizResult("correct");
      
      // Update student profile state
      const completedArray = profile.lessonsCompleted[selectedPath.id] || [];
      if (!completedArray.includes(activeQuizLevel.id)) {
        const nextCompleted = [...completedArray, activeQuizLevel.id];
        const nextXP = profile.xp + 100;
        let nextStreak = profile.streak;
        if (nextStreak === 0) nextStreak = 1;

        // Earn new badges optionally
        const nextBadges = [...profile.badges];
        if (nextXP >= 1000 && !nextBadges.includes("XP Millennial")) {
          nextBadges.push("XP Millennial");
        }
        
        onUpdateProfile({
          ...profile,
          xp: nextXP,
          streak: nextStreak,
          badges: nextBadges,
          lessonsCompleted: {
            ...profile.lessonsCompleted,
            [selectedPath.id]: nextCompleted
          }
        });
      }
    } else {
      setQuizResult("incorrect");
    }
  };

  return (
    <div id="learning-hub-hud" className="space-y-6 font-sans relative">
      
      {/* TOAST SYSTEM */}
      {toastMsg && (
        <div className="fixed top-5 right-5 bg-slate-900 text-white font-bold text-xs py-3.5 px-6 rounded-xl shadow-2xl border border-slate-700 z-50 animate-slideIn">
          {toastMsg}
        </div>
      )}

      {/* DUAL STAT PANEL */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* XP CARD */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
            <Zap className="h-6 w-6 text-violet-500 fill-violet-500 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Gamification XP</span>
            <span className="text-2.5xl font-extrabold text-slate-800 block">{profile.xp} <span className="text-xs text-slate-400 font-normal">Points</span></span>
            <span className="text-[10px] text-indigo-600 font-bold block">Earn 100 XP per level completed</span>
          </div>
        </div>

        {/* STREAK CARD */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="h-12 w-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center font-bold">
            <Flame className="h-6 w-6 text-orange-500 fill-orange-500" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Daily Active Streak</span>
            <span className="text-2.5xl font-extrabold text-slate-800 block">{profile.streak} <span className="text-xs text-slate-400 font-normal">Days</span></span>
            <span className="text-[10px] text-orange-600 font-bold block">Keep practicing tomorrow!</span>
          </div>
        </div>

        {/* COMPLETED BADGES */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="h-12 w-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center font-bold">
            <Trophy className="h-6 w-6 text-emerald-500 fill-emerald-100" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Earned Achievements</span>
            <div className="flex space-x-1.5 mt-1 overflow-x-auto pb-1 max-w-[200px]">
              {profile.badges.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No badges earned.</span>
              ) : (
                profile.badges.map(b => (
                  <span
                    key={b}
                    className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-1.5 py-0.5 whitespace-nowrap"
                  >
                    🏆 {b}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* MAIN GAMIFIED GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* PATH SELECTION SIDEBAR */}
        <div className="lg:col-span-1 space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest block ml-1 mb-2">Subject Pathways</span>
          {LEARNING_PATHS.map((path) => {
            const isSelected = selectedPath.id === path.id;
            // Calculate progress percentage
            const total = path.levels.length;
            const completed = path.levels.filter(lvl => isLevelCompleted(path.id, lvl.id)).length;
            const percent = Math.round((completed / total) * 100);

            return (
              <button
                key={path.id}
                onClick={() => setSelectedPath(path)}
                className={`w-full p-3.5 rounded-xl text-left transition-all border block ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 shadow-sm text-white"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-extrabold text-xs block leading-tight">{path.title}</span>
                  <BookOpen className={`h-4 w-4 ${isSelected ? "text-white" : "text-slate-400"}`} />
                </div>
                <div className="w-full bg-slate-200/50 rounded-full h-1 mt-2.5">
                  <div
                    className={`h-1 rounded-full ${isSelected ? "bg-white" : "bg-indigo-500"}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] mt-1.5 font-bold">
                  <span className={isSelected ? "text-indigo-200" : "text-slate-400"}>
                    {completed}/{total} Completed
                  </span>
                  <span className={isSelected ? "text-indigo-150" : "text-indigo-600"}>
                    {percent}% Complete
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* LEVELS ROADMAP VERTICAL TREE (DUOLINGO MAP) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* COURSE DECORATION CONTAINER */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div>
              <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-widest">Active Curriculum Track</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedPath.title}</h2>
              <p className="text-xs text-slate-500 font-light mt-1">{selectedPath.description}</p>
            </div>
          </div>

          {/* PLAYABLE MAP TRACK */}
          <div className="bg-slate-100/50 p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-inner flex flex-col items-center space-y-8 relative overflow-hidden">
            {/* Curved dashed lane guide background */}
            <div className="absolute inset-y-0 w-1 border-r-2 border-dashed border-indigo-200 pointer-events-none" />

            {selectedPath.levels.map((level, idx) => {
              const completed = isLevelCompleted(selectedPath.id, level.id);
              const locked = isLevelLocked(selectedPath.id, idx);
              
              // Duolingo offset positioning logic for serpentine road
              const offsetStyle = idx % 2 === 0 ? "sm:translate-x-12 animate-pulseStepL" : "sm:-translate-x-12 animate-pulseStepR";

              return (
                <div key={level.id} className={`flex flex-col items-center relative z-10 transition-transform ${offsetStyle}`}>
                  {/* LEVEL ORB */}
                  <button
                    onClick={() => handleLaunchQuiz(level, idx)}
                    className={`h-[72px] w-[72px] rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all outline-none ${
                      completed
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white scale-[1.05]"
                        : locked
                        ? "bg-slate-300 border-2 border-slate-400/30 text-slate-500 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.06] text-white ring-4 ring-indigo-500/10 cursor-pointer"
                    }`}
                  >
                    {completed ? (
                      <Check className="h-6 w-6 stroke-[3]" />
                    ) : locked ? (
                      <Lock className="h-5.5 w-5.5" />
                    ) : (
                      <Play className="h-5.5 w-5.5 fill-white" />
                    )}
                  </button>

                  {/* MINI LABEL CHIPS */}
                  <div className="bg-white border border-slate-200/90 py-1.5 px-3.5 rounded-full mt-2.5 shadow-xs text-center max-w-[220px]">
                    <span className="block font-black text-slate-800 text-[10px] uppercase tracking-wider">{level.title}</span>
                    <span className="block text-[9px] text-slate-450 truncate max-w-[150px]">{level.description}</span>
                    {level.activity && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (level.activity?.url) launchActivity(level.activity.url);
                        }}
                        className="mt-2 inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-[8px] font-bold text-violet-700 border border-violet-200 hover:bg-violet-100"
                      >
                        {level.activity.type === "game" ? "Play Game" : "Watch Lesson"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* QUIZ DRAWER MODAL BOX */}
      {activeQuizLevel && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden relative animate-scaleUp">
            
            {/* Header branding info */}
            <div className="bg-indigo-600 p-5 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span className="font-extrabold text-sm tracking-tight">QUIZ CHALLENGE: {activeQuizLevel.title}</span>
              </div>
              <button
                onClick={() => setActiveQuizLevel(null)}
                className="text-white hover:text-indigo-200 font-bold text-xs bg-indigo-700/60 py-1 px-3 rounded-lg"
              >
                Exit
              </button>
            </div>

            <div className="p-6 space-y-5">
              {activeQuizLevel.activity && (
                <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 space-y-2">
                  <span className="text-[10px] font-extrabold text-violet-700 uppercase tracking-wider block">Learning activity</span>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{activeQuizLevel.activity.title}</p>
                      <p className="text-[11px] text-slate-600">{activeQuizLevel.activity.description}</p>
                    </div>
                    {activeQuizLevel.activity.url && (
                      <button
                        type="button"
                        onClick={() => launchActivity(activeQuizLevel.activity.url!)}
                        className="shrink-0 rounded-lg bg-violet-600 px-3 py-2 text-[10px] font-bold text-white hover:bg-violet-700"
                      >
                        {activeQuizLevel.activity.type === "game" ? "Open Game" : "Open Lesson"}
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-1.5 border-b border-slate-100 pb-3">
                <span className="text-[10px] font-extrabold text-violet-600 block uppercase tracking-wider">Instructions: Answer correctly to earn 100 XP</span>
                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                  {activeQuizLevel.quiz.question}
                </p>
              </div>

              {/* ANSWER OPTIONS */}
              <div className="space-y-2.5">
                {activeQuizLevel.quiz.options.map((opt: string) => {
                  const selected = quizSelectedOption === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        if (quizResult === null) setQuizSelectedOption(opt);
                      }}
                      disabled={quizResult !== null}
                      className={`w-full p-3 rounded-2xl border text-left text-xs font-semibold select-none transition-all ${
                        selected
                          ? "bg-indigo-50 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/10"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* FEEDBACK STATE SHOWCASE */}
              {quizResult !== null && (
                <div className={`p-4 rounded-xl text-xs space-y-1.5 ${
                  quizResult === "correct"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                    : "bg-rose-50 text-rose-800 border border-rose-100"
                }`}>
                  <span className="font-bold flex items-center space-x-1.5">
                    {quizResult === "correct" ? (
                      <span>🎉 Spot on! Beautiful work!</span>
                    ) : (
                      <span>❌ Incorrect answer, try again!</span>
                    )}
                  </span>
                  <p className="text-[11px] opacity-90 leading-normal">
                    <strong>Hint / Guide:</strong> {activeQuizLevel.quiz.hint}
                  </p>
                </div>
              )}

            </div>

            {/* ACTION TRIGGERS IN FOOTER */}
            <div className="bg-slate-50 p-4 border-t border-slate-105 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold">Value: 100 XP Point Award</span>
              
              <div className="flex space-x-2">
                {quizResult === "correct" ? (
                  <button
                    onClick={() => setActiveQuizLevel(null)}
                    className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                  >
                    Continue Journey
                  </button>
                ) : (
                  <>
                    {quizResult === "incorrect" && (
                      <button
                        onClick={() => {
                          setQuizResult(null);
                          setQuizSelectedOption("");
                        }}
                        className="py-2 px-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600"
                      >
                        Try Again
                      </button>
                    )}
                    <button
                      onClick={handleCheckQuizAnswer}
                      disabled={!quizSelectedOption || quizResult !== null}
                      className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                    >
                      Check Answer
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
