import React, { useState } from "react";
import { Application } from "../types";
import { CheckCircle2, ChevronRight, FileText, Send, Sparkles, Upload } from "lucide-react";

interface ApplicationFormProps {
  initialEmail: string;
  onSubmit: (formData: Partial<Application>) => void;
  onLogout: () => void;
}

export default function ApplicationForm({ initialEmail, onSubmit, onLogout }: ApplicationFormProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email] = useState(initialEmail);
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("Gonzaga High School");
  const [grade, setGrade] = useState("Grade 11");
  const [resumeName, setResumeName] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [personalStatement, setPersonalStatement] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState("");
  const [careerGoals, setCareerGoals] = useState("");

  const SKILLS_PRESETS = [
    "HTML", "CSS", "JavaScript", "React", "TypeScript", "Node.js", "Java", "Python", "SQL", "Git", "Figma Design", "Technical Writing"
  ];

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedData: Partial<Application> = {
      firstName: firstName || "Student",
      lastName: lastName || "Applicant",
      email,
      phone: phone || "(709) 555-0199",
      school,
      grade,
      resumeName: resumeName || "student_uploaded_resume.pdf",
      portfolioUrl,
      linkedInUrl,
      personalStatement: personalStatement || "Eager to learn and work in technology.",
      skills: selectedSkills,
      interests,
      careerGoals,
    };

    onSubmit(formattedData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div id="application-submitted-pane" className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6 relative overflow-hidden">
          {/* Accent light decoration */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-violet-500 to-indigo-600" />
          
          <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 animate-bounce">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Application Submitted Successfully!</h1>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest text-[11px] bg-indigo-50 inline-block px-3 py-1 rounded-full">
              Status: Pending Review
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Thank you for your application, {firstName}!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your application has been received successfully.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              The TechNL team will review your submission and contact you if selected for the internship program.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 border-t border-slate-200 pt-3">
              <li>• <strong>Verification Email:</strong> Sent to {email}</li>
              <li>• <strong>Program Cycle:</strong> Fall / Summer Tech Co-op NL</li>
              <li>• <strong>Next Review Round:</strong> Within 5 days</li>
            </ul>
          </div>

          <p className="text-xs text-slate-400">
            For security reasons, your student account has been locked in <strong>Pending Review</strong> status. You will receive access to the Skills Analyzer, Duolingo Learning Hub, and Internship loggers immediately following TechNL review.
          </p>

          <div className="flex space-x-4">
            <button
              onClick={onLogout}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-all text-xs"
            >
              Sign Out Securely
            </button>
            <a
              href="https://technl.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all text-xs flex items-center justify-center space-x-1"
            >
              <span>Visit TechNL Website</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="application-form-hud" className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* TOP BRAND EMBLEM */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-5">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-extrabold text-sm">𝝙</div>
            <div>
              <span className="font-extrabold text-slate-800 tracking-tight text-lg">TalentBridge</span>
              <span className="text-xs text-slate-500 block">Bridge Talent. Build Futures.</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 py-1.5 px-3 rounded-lg transition-all"
          >
            Cancel & Go Back
          </button>
        </div>

        {/* STEPPER ROADMAP */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className={step >= 1 ? "text-violet-600" : ""}>Step 1: Contact & School</span>
            <ChevronRight className="h-4 w-4" />
            <span className={step >= 2 ? "text-violet-600" : ""}>Step 2: Skills & Links</span>
            <ChevronRight className="h-4 w-4" />
            <span className={step >= 3 ? "text-violet-600" : ""}>Step 3: Personal Statement</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-violet-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* INTERACTIVE FORM SCROLLER */}
        <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* STEP 1: PERSONAL & SCHOOL */}
            {step === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-bold text-slate-800">Tell us about yourself</h2>
                  <p className="text-xs text-slate-500">Provide basic school details and phone numbers.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Aisha"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Rahman"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Registered Email</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. (709) 555-7890"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">School (Newfoundland & Labrador)</label>
                    <select
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm font-medium"
                    >
                      <option value="Holy Heart of Mary High">Holy Heart of Mary High</option>
                      <option value="Gonzaga High School">Gonzaga High School</option>
                      <option value="Prince of Wales Collegiate">Prince of Wales Collegiate</option>
                      <option value="O'Donel High School">O'Donel High School</option>
                      <option value="Mount Pearl Senior High">Mount Pearl Senior High</option>
                      <option value="Waterford Valley High">Waterford Valley High</option>
                      <option value="Other School / Career Center">Other school / Career Center</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Current Grade Level</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm font-medium"
                    >
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                      <option value="First Year Student">First Year College/University</option>
                    </select>
                  </div>
                </div>

                {/* RESUME DRAG-AND-DROP SIMULATOR */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest">Resume Upload</label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-2xl bg-slate-50/50 p-6 text-center cursor-pointer transition-all space-y-2">
                    <div className="h-10 w-10 bg-violet-50 rounded-full flex items-center justify-center text-violet-500 mx-auto">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700">Drag & drop your resume file or click to select</span>
                      <p className="text-[10px] text-slate-400">PDF, DOCX formats accepted up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setResumeName(e.target.files[0].name);
                        }
                      }}
                      className="hidden"
                      id="raw-resume-input"
                    />
                    <label
                      htmlFor="raw-resume-input"
                      className="inline-block py-1 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-[11px] font-bold text-slate-600 cursor-pointer"
                    >
                      Pick File
                    </label>
                    {resumeName && (
                      <div className="flex items-center justify-center space-x-1.5 text-xs text-indigo-600 bg-white border border-indigo-100 rounded-lg p-2 max-w-xs mx-auto">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="font-semibold truncate">{resumeName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SKILLS & PORTFOLIO */}
            {step === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-bold text-slate-800">Choose Skills & Work Portfolios</h2>
                  <p className="text-xs text-slate-500 font-medium">Highlight your current capabilities and enter showcase urls.</p>
                </div>

                {/* SKILLS PRESET */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Core Competencies (* Select all that apply)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SKILLS_PRESETS.map(skill => {
                      const active = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleSkill(skill)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                            active
                              ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Portfolio or GitHub URL</label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="e.g. https://your-profile.dev"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={linkedInUrl}
                      onChange={(e) => setLinkedInUrl(e.target.value)}
                      placeholder="e.g. https://linkedin.com/in/username"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: STATEMENTS & GOALS */}
            {step === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-bold text-slate-800">Your Aspirations & Statements</h2>
                  <p className="text-xs text-slate-500">Provide short answers about your technical journey.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Personal Statement</label>
                  <textarea
                    rows={4}
                    value={personalStatement}
                    onChange={(e) => setPersonalStatement(e.target.value)}
                    placeholder="Briefly describe why you are interested in technology and what you hope to get out of this internship program."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm leading-relaxed"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">A genuine, clear statement helps TechNL staff evaluate your dedication.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Your Technical Interests</label>
                    <input
                      type="text"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="e.g. Game mechanics, Web app coding"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Career Ambitions</label>
                    <input
                      type="text"
                      value={careerGoals}
                      onChange={(e) => setCareerGoals(e.target.value)}
                      placeholder="e.g. Backend Lead, System Architect"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="bg-violet-50/60 rounded-xl p-4 border border-violet-100 flex items-start space-x-3 text-slate-700">
                  <Sparkles className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-violet-900 block mb-1">Final Submission Guidelines</span>
                    By clicking submit, you authorize TechNL program coordinators to check your grades, portfolio assets, and communicate with potential employer mentors on behalf of your credentials.
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* BOTTOM BUTTON BAR */}
          <div className="bg-slate-50 px-6 py-5 border-t border-slate-200 flex justify-between items-center">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="py-2.5 px-4 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all"
                >
                  Previous Step
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <span>Continue</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  id="final-apply-submit"
                  className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 flex items-center space-x-1.5"
                >
                  <Send className="h-3.5 w-3.5 animate-pulse" />
                  <span>Submit Application to TechNL</span>
                </button>
              )}
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
