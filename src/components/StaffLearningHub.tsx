import React from "react";
import { BookOpen, Send, X } from "lucide-react";
import { StudentProfile, Application } from "../types";

const COURSE_LIBRARY = {
  technical: [
    {
      id: "python",
      title: "Python Fundamentals",
      description: "Master Python programming from basics to advanced concepts",
      levels: 7
    },
    {
      id: "java",
      title: "Java Development",
      description: "Complete Java programming course with enterprise patterns",
      levels: 7
    },
    {
      id: "html-css",
      title: "HTML/CSS Mastery",
      description: "Build responsive web interfaces with modern HTML and CSS",
      levels: 6
    }
  ],
  soft: [
    {
      id: "communication",
      title: "Professional Communication",
      description: "Enhance written and verbal communication skills",
      levels: 5
    },
    {
      id: "leadership",
      title: "Leadership Fundamentals",
      description: "Develop leadership and team management skills",
      levels: 5
    },
    {
      id: "time-management",
      title: "Time Management & Productivity",
      description: "Master productivity techniques and time management",
      levels: 4
    }
  ]
};

interface StaffLearningHubProps {
  allStudentProfiles: StudentProfile[];
  onUpdateProfile: (profile: StudentProfile) => void;
}

export default function StaffLearningHub({
  allStudentProfiles,
  onUpdateProfile,
}: StaffLearningHubProps) {
  const [selectedStudent, setSelectedStudent] = React.useState<StudentProfile | null>(null);
  const [confirmationMessage, setConfirmationMessage] = React.useState("");

  const handleAssignCourse = (courseId: string) => {
    if (!selectedStudent) return;

    const updatedProfile = {
      ...selectedStudent,
      assignedCourses: [
        ...(selectedStudent.assignedCourses || []),
        courseId
      ]
    };

    onUpdateProfile(updatedProfile);
    setSelectedStudent(updatedProfile);
    setConfirmationMessage("Course sent successfully");
    window.setTimeout(() => setConfirmationMessage(""), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-200">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">Staff Portal</p>
            <h2 className="text-2xl font-black text-slate-900">Learning Hub Library</h2>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          Assign courses to students to help them develop technical and soft skills. Courses are available for all students, whether accepted or rejected.
        </p>

        {confirmationMessage && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            {confirmationMessage}
          </div>
        )}

        <div className="mb-6">
          <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Select Student to Assign Courses
          </label>
          <select
            value={selectedStudent?.studentEmail || ""}
            onChange={(e) => {
              const student = allStudentProfiles.find(p => p.studentEmail === e.target.value);
              setSelectedStudent(student || null);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none ring-0 focus:border-violet-400"
          >
            <option value="">Choose a student...</option>
            {allStudentProfiles.map((student) => (
              <option key={student.studentEmail} value={student.studentEmail}>
                {student.applications[0]?.firstName || "Student"} {student.applications[0]?.lastName || ""} ({student.studentEmail})
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-bold text-violet-900 mb-2">Assigned Courses</p>
            {selectedStudent.assignedCourses && selectedStudent.assignedCourses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedStudent.assignedCourses.map((courseId) => {
                  const course = [
                    ...COURSE_LIBRARY.technical,
                    ...COURSE_LIBRARY.soft
                  ].find(c => c.id === courseId);
                  return course ? (
                    <span key={courseId} className="inline-flex items-center gap-2 bg-white border border-violet-300 rounded-lg px-3 py-1 text-xs font-bold text-violet-700">
                      {course.title}
                      <button
                        onClick={() => {
                          const updated = {
                            ...selectedStudent,
                            assignedCourses: (selectedStudent.assignedCourses || []).filter(id => id !== courseId)
                          };
                          onUpdateProfile(updated);
                          setSelectedStudent(updated);
                        }}
                        className="text-violet-500 hover:text-violet-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="text-xs text-violet-600">No courses assigned yet</p>
            )}
          </div>
        )}
      </div>

      {/* Technical Skills Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 mb-4 pb-3 border-b border-slate-200">
          📊 Technical Skills
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COURSE_LIBRARY.technical.map((course) => (
            <div key={course.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="font-bold text-slate-900 mb-2">{course.title}</h4>
              <p className="text-xs text-slate-600 mb-3">{course.description}</p>
              <p className="text-xs font-bold text-slate-700 mb-3">📚 {course.levels} Levels</p>
              <button
                onClick={() => {
                  setSelectedStudent(selectedStudent);
                  handleAssignCourse(course.id);
                }}
                disabled={!selectedStudent || (selectedStudent?.assignedCourses || []).includes(course.id)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-2 text-xs font-bold text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="h-3 w-3" />
                {selectedStudent && (selectedStudent?.assignedCourses || []).includes(course.id) ? "Sent" : "Send course"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Soft Skills Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 mb-4 pb-3 border-b border-slate-200">
          🎯 Soft Skills
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COURSE_LIBRARY.soft.map((course) => (
            <div key={course.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="font-bold text-slate-900 mb-2">{course.title}</h4>
              <p className="text-xs text-slate-600 mb-3">{course.description}</p>
              <p className="text-xs font-bold text-slate-700 mb-3">📚 {course.levels} Levels</p>
              <button
                onClick={() => {
                  setSelectedStudent(selectedStudent);
                  handleAssignCourse(course.id);
                }}
                disabled={!selectedStudent || (selectedStudent?.assignedCourses || []).includes(course.id)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-2 text-xs font-bold text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="h-3 w-3" />
                {selectedStudent && (selectedStudent?.assignedCourses || []).includes(course.id) ? "Sent" : "Send course"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
