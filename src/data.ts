import { Application, StudentProfile, LearningPath } from "./types";

// Standard Newfoundland representation for realistic TechNL local feel
export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "app-aisha-2026",
    year: 2026,
    program: "TechNL High School Tech Internships",
    date: "2026-05-11",
    status: "Internship Active",
    firstName: "Aisha",
    lastName: "Rahman",
    email: "aisha.rahman@email.com",
    phone: "(709) 555-7890",
    school: "Holy Heart of Mary High",
    grade: "Grade 11",
    resumeName: "aisha_rahman_resume.pdf",
    portfolioUrl: "https://aisha.dev",
    linkedInUrl: "https://linkedin.com/in/aisharahman-nl",
    personalStatement: "I have always wanted to combine my passion for creative art and frontend programming. Serving the local tech community in St. John's is my ultimate career goal.",
    skills: ["HTML", "CSS", "JavaScript", "Figma Design"],
    interests: "UI/UX, Frontend Web Development, Web Design",
    careerGoals: "Software Product Designer",
    ratingScore: 5,
    evaluationNotes: "Excellent problem solving skills. Strong passion for UI design and React interfaces. Interview scheduled with local startup.",
    staffNotes: "Highly recommended by her technology lead teacher. Energetic and very focused.",
    replicationCount: 0,
    skillScores: {
      java: 35,
      git: 80,
      problemSolving: 90,
      communication: 95,
      teamwork: 90,
      portfolio: 95
    },
    reapplicationCount: 0
  } as unknown as Application, // handled with unknown as needed
  {
    id: "app-emma-2025",
    year: 2025,
    program: "TechNL Summer Tech Co-op",
    date: "2025-05-10",
    status: "Rejected",
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma.wilson@email.com",
    phone: "(709) 333-1234",
    school: "Gonzaga High School",
    grade: "Grade 10",
    resumeName: "emma_wilson_v1_resume.pdf",
    personalStatement: "I'm interested in database engineering and web apps, but I haven't done much coding yet.",
    skills: ["HTML Basics", "Scratch"],
    interests: "Databases, Web Scraping",
    careerGoals: "Backend Developer",
    ratingScore: 2,
    evaluationNotes: "Has foundational thinking, but lack of projects, portfolio, and programming expertise. Needs to complete core prerequisites.",
    staffNotes: "A bit quiet, but eager to learn. Advised her to use our Learning Hub resources.",
    reapplicationCount: 0,
    rejectionReasons: ["Low Java Knowledge", "No Portfolio", "Limited Technical Experience"],
    skillScores: {
      java: 20,
      git: 30,
      problemSolving: 45,
      communication: 70,
      teamwork: 75,
      portfolio: 10
    }
  } as unknown as Application,
  {
    id: "app-emma-2026",
    year: 2026,
    program: "TechNL High School Tech Internships",
    date: "2026-05-10",
    status: "Pending Review",
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma.wilson@email.com",
    phone: "(709) 333-1234",
    school: "Gonzaga High School",
    grade: "Grade 11",
    resumeName: "emma_wilson_software_resume.pdf",
    portfolioUrl: "https://emmawilson.github.io",
    linkedInUrl: "https://linkedin.com/in/emmawilson-nl",
    personalStatement: "After my rejection last year, I spent the whole winter working on the TalentBridge Learning Hub! I have built several projects, increased my Git skills, and mastered programming fundamentals.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git", "SQL"],
    interests: "Web Apps, Full-Stack Coding",
    careerGoals: "Full Stack Engineer",
    ratingScore: 4,
    evaluationNotes: "Incredible year-over-year improvement. She showed remarkable dedication to coding through the gamified portal. Active portfolio online.",
    staffNotes: "Review comparison timeline in applicant profile to confirm acceptance decision.",
    reapplicationCount: 1,
    skillScores: {
      java: 65,
      git: 85,
      problemSolving: 75,
      communication: 90,
      teamwork: 85,
      portfolio: 80
    }
  } as unknown as Application,
  {
    id: "app-david-2026",
    year: 2026,
    program: "TechNL High School Tech Internships",
    date: "2026-05-13",
    status: "Pending Review",
    firstName: "David",
    lastName: "Kim",
    email: "david.kim@email.com",
    phone: "(709) 888-9900",
    school: "Prince of Wales Collegiate",
    grade: "Grade 12",
    resumeName: "david_kim_builder.pdf",
    portfolioUrl: "https://davidkim.codes",
    personalStatement: "Creating software that solves workflow problems is what drives me. I built a classroom booking system for PWC.",
    skills: ["React", "TypeScript", "NodeJS", "Git"],
    interests: "Systems Programming, APIs",
    careerGoals: "Cloud Systems Architect",
    ratingScore: 4.5,
    evaluationNotes: "Highly advanced technical skills. Ready for senior internship placement.",
    staffNotes: "Should highlight for competitive interview placements.",
    reapplicationCount: 0,
    skillScores: {
      java: 80,
      git: 90,
      problemSolving: 95,
      communication: 80,
      teamwork: 85,
      portfolio: 90
    }
  } as unknown as Application,
  {
    id: "app-james-2026",
    year: 2026,
    program: "TechNL High School Tech Internships",
    date: "2026-05-09",
    status: "Rejected",
    firstName: "James",
    lastName: "Martinez",
    email: "james.martinez@email.com",
    phone: "(709) 777-6655",
    school: "O'Donel High School",
    grade: "Grade 11",
    resumeName: "james_martinez_resume.pdf",
    personalStatement: "Looking for an internship. I like playing games and want to learn coding.",
    skills: ["HTML Basics"],
    interests: "Gaming, Technical Hardware",
    careerGoals: "Game Designer",
    rejectionReasons: ["Low Java Knowledge", "Weak Communication", "No Portfolio"],
    ratingScore: 2,
    evaluationNotes: "Limited communication readiness and general coding experience. Advised to focus on web development pre-requisites and reapply next session.",
    reapplicationCount: 0,
    skillScores: {
      java: 15,
      git: 20,
      problemSolving: 35,
      communication: 50,
      teamwork: 65,
      portfolio: 0
    }
  } as unknown as Application
];

export const INITIAL_STUDENT_PROFILES: StudentProfile[] = [
  {
    studentEmail: "aisha.rahman@email.com",
    applications: [INITIAL_APPLICATIONS[0]],
    xp: 940,
    streak: 12,
    badges: ["First Code", "Quiz Master", "7-Day Streak", "React Scholar"],
    lessonsCompleted: {
      "path-html": ["html-l1", "html-l2", "html-l3"],
      "path-git": ["git-l1", "git-l2"],
      "path-react": ["react-l2"]
    },
    journals: [
      {
        id: "journal-1",
        date: "2026-06-15",
        content: "Completed my first high-fidelity wireframe and synced state variables with the local layout. My senior tech teammate gave me excellent guidance on spacing rules.",
        hoursSpent: 7,
        mood: "excellent"
      },
      {
        id: "journal-2",
        date: "2026-06-16",
        content: "Met with the client to outline user experience goals. I presented my research paper on interactive form inputs and got great approval.",
        hoursSpent: 8,
        mood: "good"
      },
      {
        id: "journal-3",
        date: "2026-06-17",
        content: "Struggled slightly with responsive breakpoints in CSS. I spent an hour reading documentation and refactoring Tailwind flexible columns. Eventually sorted everything!",
        hoursSpent: 8,
        mood: "neutral"
      }
    ],
    checkins: [
      {
        id: "ch-1",
        weekNumber: 1,
        date: "2026-06-08",
        accomplishments: "Set up the local IDE environment, configured React routers, and learned core business values.",
        challenges: "Getting used to professional Git workflows and pull requests.",
        supportNeeded: "More code-reviews from seniors.",
        submitted: true,
        attendanceVerified: true,
        mentorRating: 5
      },
      {
        id: "ch-2",
        weekNumber: 2,
        date: "2026-06-15",
        accomplishments: "Coded dynamic components and interactive visual grids.",
        challenges: "Tackling screen resolution inconsistencies across mobile layouts.",
        supportNeeded: "None at this point, feeling very energetic.",
        submitted: true,
        attendanceVerified: true,
        mentorRating: 4
      }
    ],
    goals: [
      {
        id: "goal-1",
        title: "Build Responsive Dashboard",
        description: "Translate figma components to scalable react code with grid configurations",
        dueDate: "2026-06-25",
        status: "in-progress",
        progress: 80
      },
      {
        id: "goal-2",
        title: "Master Git Flow",
        description: "Submit 5 clean pull requests and handle code reviews professionally",
        dueDate: "2026-06-30",
        status: "in-progress",
        progress: 60
      },
      {
        id: "goal-3",
        title: "Final Showcase Presentation",
        description: "Present the built tech solution to TechNL staff and local employers",
        dueDate: "2026-08-14",
        status: "pending",
        progress: 0
      }
    ]
  },
  {
    studentEmail: "emma.wilson@email.com",
    applications: [INITIAL_APPLICATIONS[1], INITIAL_APPLICATIONS[2]],
    xp: 1450,
    streak: 28, // Long-lasting improvement streak!
    badges: ["Unstoppable", "Duolingo Legend", "Git Guru", "SQL Specialist"],
    lessonsCompleted: {
      "path-java": ["java-l1", "java-l2"],
      "path-git": ["git-l1", "git-l2", "git-l3"],
      "path-sql": ["sql-l1", "sql-l2"]
    },
    journals: [],
    checkins: [],
    goals: []
  },
  {
    studentEmail: "james.martinez@email.com",
    applications: [INITIAL_APPLICATIONS[4]],
    xp: 150,
    streak: 1,
    badges: ["First Step"],
    lessonsCompleted: {
      "path-html": ["html-l1"]
    },
    journals: [],
    checkins: [],
    goals: []
  },
  {
    studentEmail: "david.kim@email.com",
    applications: [INITIAL_APPLICATIONS[3]],
    xp: 0,
    streak: 0,
    badges: [],
    lessonsCompleted: {},
    journals: [],
    checkins: [],
    goals: []
  }
];

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "path-java",
    title: "Java Fundamentals",
    description: "Master Java programming from compilation basics to interfaces and Object-Oriented principles.",
    xpValue: 100,
    levels: [
      {
        id: "java-l1",
        title: "Level 1: Variables & Data Types",
        description: "Understand integers, float, char, boolean, type casting, and variable scoping.",
        order: 1,
        quiz: {
          question: "Which of the following data types represents a single 16-bit Unicode character in Java?",
          options: ["String", "char", "byte", "int"],
          correctAnswer: "char",
          hint: "Think about single characters vs. string collections or raw bytes."
        }
      },
      {
        id: "java-l2",
        title: "Level 2: Conditions",
        description: "Write structural branching logic with if-else blocks and switch cases.",
        order: 2,
        quiz: {
          question: "How do you evaluate equality of two String values (s1 and s2) in Java?",
          options: ["s1 == s2", "s1.compare(s2)", "s1.equals(s2)", "s1 === s2"],
          correctAnswer: "s1.equals(s2)",
          hint: "The == operator compares reference addresses, whereas we want value similarity."
        }
      },
      {
        id: "java-l3",
        title: "Level 3: Loops & Iteration",
        description: "Master for loops, nested loops, while loops, and break/continue keywords.",
        order: 3,
        quiz: {
          question: "How do you break out of a loop immediately in Java?",
          options: ["exit", "stop", "terminate", "break"],
          correctAnswer: "break",
          hint: "It shares the same keyword with switch statements."
        }
      },
      {
        id: "java-l4",
        title: "Level 4: Arrays",
        description: "Declare arrays, iterate through index bounds, and manipulate arrays.",
        order: 4,
        quiz: {
          question: "What is the index of the first element in a Java Array?",
          options: ["0", "1", "-1", "Depends on definition"],
          correctAnswer: "0",
          hint: "Java employs zero-based offset indexing."
        }
      },
      {
        id: "java-l5",
        title: "Level 5: Methods & Scope",
        description: "Define parameters, return types, public/private modifiers, and recursion.",
        order: 5,
        quiz: {
          question: "What keyword specifies that a method does not return any value in Java?",
          options: ["null", "void", "empty", "static"],
          correctAnswer: "void",
          hint: "It represents a vacant/absent return state."
        }
      },
      {
        id: "java-l6",
        title: "Level 6: Objects & Classes",
        description: "Understand instantiation, constructors, parameters, inheritance, and encapsulation.",
        order: 6,
        quiz: {
          question: "In Java, what keyword is used to access or invoke parent class constructors or methods?",
          options: ["parent", "super", "this", "base"],
          correctAnswer: "super",
          hint: "This refers to the super-class."
        }
      },
      {
        id: "java-l7",
        title: "Level 7: OOP Capstone Project",
        description: "Synthesize all knowledge by building an automated banking portal system.",
        order: 7,
        quiz: {
          question: "Which OOP concept protects an object's internal variables from external edits directly?",
          options: ["Polymorphism", "Abstraction", "Inheritance", "Encapsulation"],
          correctAnswer: "Encapsulation",
          hint: "Think: nesting details inside private fields and exposing custom getters/setters."
        }
      }
    ]
  },
  {
    id: "path-git",
    title: "Git & Version Control",
    description: "Learn professional Git branch policies, secure commits, status audits, and merge requests.",
    xpValue: 80,
    levels: [
      {
        id: "git-l1",
        title: "Level 1: commits & Status",
        description: "Configure your local environment, initialize repositories, track changes, and commit files.",
        order: 1,
        quiz: {
          question: "What terminal command checks which files have been modified or staged in Git?",
          options: ["git log", "git status", "git diff", "git check"],
          correctAnswer: "git status",
          hint: "It tells you the state of your working directory."
        }
      },
      {
        id: "git-l2",
        title: "Level 2: Branching Policy",
        description: "Create target feature branches, switch heads, and manage project separation.",
        order: 2,
        quiz: {
          question: "How do you create and instantly checkout a new target branch named 'feature-auth'?",
          options: ["git branch feature-auth", "git checkout -b feature-auth", "git checkout new feature-auth", "git merge feature-auth"],
          correctAnswer: "git checkout -b feature-auth",
          hint: "The -b flag is a shorthand for both branch creation and checkout."
        }
      },
      {
        id: "git-l3",
        title: "Level 3: Handling Conflicts",
        description: "Resolve code conflicts on rebase and perform clean fast-forward merges.",
        order: 3,
        quiz: {
          question: "What command pulls raw updates from a remote main branch and places your workspace commits on top?",
          options: ["git merge main", "git push remote", "git rebase main", "git reset main"],
          correctAnswer: "git rebase main",
          hint: "This applies your changes sequentially on top of the target base branch."
        }
      }
    ]
  },
  {
    id: "path-sql",
    title: "SQL & Databases",
    description: "Construct queries, JOIN target tables, perform filters, and understand normal forms.",
    xpValue: 120,
    levels: [
      {
        id: "sql-l1",
        title: "Level 1: Select & Filters",
        description: "Query basic columns, filter records with WHERE clauses, and sort outputs.",
        order: 1,
        quiz: {
          question: "How do you retrieve only applicants with school 'Holy Heart High' in SQL?",
          options: ["SELECT * FROM applicants HAVING school='Holy Heart High'", "SELECT * FROM applicants WHERE school='Holy Heart High'", "SELECT applicants WHERE school IS 'Holy Heart High'", "SELECT * school='Holy Heart High'"],
          correctAnswer: "SELECT * FROM applicants WHERE school='Holy Heart High'",
          hint: "The WHERE clause is used to filter records."
        }
      },
      {
        id: "sql-l2",
        title: "Level 2: Database Joins",
        description: "Join relational tables on keys, select aliases, and understand performance impacts.",
        order: 2,
        quiz: {
          question: "Which JOIN retrieves matching records AND all remaining rows from the left table?",
          options: ["INNER JOIN", "FULL OUTER JOIN", "RIGHT JOIN", "LEFT JOIN"],
          correctAnswer: "LEFT JOIN",
          hint: "It returns everything from the left (first mentioned) table."
        }
      }
    ]
  },
  {
    id: "path-react",
    title: "React Framework",
    description: "Deconstruct virtual DOM rendering, state updates, use hooks safely, and implement flex structures.",
    xpValue: 140,
    levels: [
      {
        id: "react-l1",
        title: "Level 1: Components & JSX",
        description: "Define modular functional visual blocks and integrate custom Tailwind classes.",
        order: 1,
        quiz: {
          question: "How must you write class attributes inside a React HTML component?",
          options: ["class", "className", "classList", "classes"],
          correctAnswer: "className",
          hint: "The word 'class' is a reserved keyword in JavaScript/TypeScript classes."
        }
      },
      {
        id: "react-l2",
        title: "Level 2: State Hooks",
        description: "Leverage useState and update custom states, avoiding redundant side effects.",
        order: 2,
        quiz: {
          question: "What function hook allows you to sync state changes inside a structural view lifecycle?",
          options: ["useEffect", "useState", "useRef", "useCallback"],
          correctAnswer: "useState",
          hint: "Think: adding state-management to functional blocks."
        }
      }
    ]
  }
];

export const METRIC_ANALYTICS = {
  applicantsPerYear: [
    { year: 2024, count: 180 },
    { year: 2025, count: 245 },
    { year: 2026, count: 325 }
  ],
  schoolsDistribution: [
    { school: "Holy Heart", count: 110, percentage: 34 },
    { school: "Gonzaga High", count: 95, percentage: 29 },
    { school: "Prince of Wales", count: 68, percentage: 21 },
    { school: "O'Donel High", count: 32, percentage: 10 },
    { school: "Other Programs", count: 20, percentage: 6 }
  ],
  rejectionReasons: [
    { reason: "Low Java / Programming Knowledge", frequency: 45 },
    { reason: "No Project Portfolio / Website", frequency: 32 },
    { reason: "Weak Resume Styling / Detail", frequency: 24 },
    { reason: "No Prior Git / Team Experience", frequency: 18 },
    { reason: "Poor Communication / Interview", frequency: 15 }
  ],
  reapplicationSuccessRate: [
    { label: "1st Attempt Acceptance", value: 38 },
    { label: "Reapplied & Accepted (Growth Hub)", value: 72 }
  ]
};
