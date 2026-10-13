export type CategoryId = 'all' | 'teknologi' | 'sains' | 'matematika' | 'fisika' | 'desain';

export type CourseLevel = 'Pemula' | 'Menengah' | 'Lanjutan';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'simulation' | 'code_sandbox' | 'quiz' | 'reading';
  summary: string;
  content: string;
  interactiveLabId?: 'bohr_sim' | 'code_runner' | 'projectile_sim' | 'calculus_sim';
  quizQuestions?: QuizQuestion[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  category: CategoryId;
  categoryLabel: string;
  level: CourseLevel;
  duration: string;
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  thumbnail: string;
  overview: string;
  skillsGained: string[];
  modules: CourseModule[];
}

export type ForumChannel = 'all' | 'tanya-materi' | 'proyek-portofolio' | 'tips-belajar' | 'lingkar-diskusi';

export interface ForumComment {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    badge?: string;
  };
  content: string;
  createdAt: string;
  upvotes: number;
  isSolution?: boolean;
}

export interface ForumThread {
  id: string;
  title: string;
  channel: ForumChannel;
  channelLabel: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    school: string;
  };
  createdAt: string;
  content: string;
  codeSnippet?: string;
  tags: string[];
  upvotes: number;
  userVote?: 'up' | 'down' | null;
  viewsCount: number;
  comments: ForumComment[];
  isSolved: boolean;
  bookmarked?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  xpPoints: number;
  completedLessons: string[];
  enrolledCourseIds: string[];
  completedCourseIds: string[];
  streakDays: number;
  badges: Array<{
    id: string;
    title: string;
    icon: string;
    date: string;
  }>;
}
