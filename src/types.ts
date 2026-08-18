export type UserRole = "Student" | "TechNL Staff";

export type ApplicationStatus =
  | "Pending Review"
  | "Rejected"
  | "Accepted"
  | "Internship Active"
  | "Internship Completed"
  | "Program Alumni";

export interface Application {
  id: string;
  year: number;
  program: string;
  date: string;
  status: ApplicationStatus;
  feedback: string;
  rejectionReasons?: string[];
  skillScores: {
    java: number;
    git: number;
    problemSolving: number;
    communication: number;
    teamwork: number;
    portfolio?: number;
  };
  reapplicationCount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  resumeName: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  personalStatement: string;
  skills: string[];
  interests: string;
  careerGoals: string;
  ratingScore?: number; // Staff rating 1-5
  evaluationNotes?: string;
  staffNotes?: string;
}

export interface StudentProfile {
  studentEmail: string;
  applications: Application[]; // History tracking
  xp: number;
  streak: number;
  badges: string[];
  lessonsCompleted: { [pathId: string]: string[] }; // pathId to level ids
  journals: JournalEntry[];
  checkins: WeeklyCheckin[];
  goals: InternshipGoal[];
  flaggedAtRisk?: boolean;
  profilePicture?: string; // Base64 encoded image
  assignedCourses?: string[]; // Course IDs assigned by staff
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  hoursSpent: number;
  mood: "excellent" | "good" | "neutral" | "struggling";
}

export interface WeeklyCheckin {
  id: string;
  weekNumber: number;
  date: string;
  challenges: string;
  accomplishments: string;
  supportNeeded: string;
  submitted: boolean;
  attendanceVerified: boolean;
  mentorRating?: number; // 1-5
}

export interface InternshipGoal {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  progress: number; // 0-100
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  xpValue: number;
  levels: {
    id: string;
    title: string;
    description: string;
    order: number;
    activity?: {
      type: "video" | "game" | "exercise";
      title: string;
      description: string;
      url?: string;
      provider?: string;
    };
    quiz?: {
      question: string;
      options: string[];
      correctAnswer: string;
      hint: string;
    };
  }[];
}
