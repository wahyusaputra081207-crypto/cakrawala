import React, { useState } from 'react';
import { Course, ForumThread, UserProfile } from './types';
import { COURSES, FORUM_THREADS, INITIAL_USER } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CourseCatalog } from './components/CourseCatalog';
import { InteractiveLabs } from './components/InteractiveLabs';
import { CommunityForum } from './components/CommunityForum';
import { StudyLounge } from './components/StudyLounge';
import { CoursePlayerModal } from './components/CoursePlayerModal';
import { CertificateModal } from './components/CertificateModal';
import { AiTutorDrawer } from './components/AiTutorDrawer';
import { Footer } from './components/Footer';

export default function App() {
  const [courses] = useState<Course[]>(COURSES);
  const [threads, setThreads] = useState<ForumThread[]>(FORUM_THREADS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  // Modal & Drawer visibility states
  const [activeCourseForPlayer, setActiveCourseForPlayer] = useState<Course | null>(null);
  const [activeCourseForCert, setActiveCourseForCert] = useState<Course | null>(null);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [aiTutorContext, setAiTutorContext] = useState<string>('');

  // Smooth scroll helper
  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open AI Tutor with specific context
  const handleOpenAiTutor = (contextTitle?: string) => {
    setAiTutorContext(contextTitle || '');
    setIsAiTutorOpen(true);
  };

  // Lesson Completion & XP reward
  const handleCompleteLesson = (lessonId: string, courseId: string) => {
    setUser((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const updatedLessons = [...prev.completedLessons, lessonId];
      const updatedXp = prev.xpPoints + 50;

      // Check if all lessons of this course are completed
      const course = courses.find((c) => c.id === courseId);
      const allLessonIds = course ? course.modules.flatMap((m) => m.lessons.map((l) => l.id)) : [];
      const isCourseDone = allLessonIds.length > 0 && allLessonIds.every((id) => updatedLessons.includes(id));

      const updatedCompletedCourses = isCourseDone && !prev.completedCourseIds.includes(courseId)
        ? [...prev.completedCourseIds, courseId]
        : prev.completedCourseIds;

      return {
        ...prev,
        completedLessons: updatedLessons,
        xpPoints: updatedXp,
        completedCourseIds: updatedCompletedCourses
      };
    });
  };

  // Upvote / Downvote Forum Thread
  const handleVoteThread = (threadId: string, direction: 'up' | 'down') => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;

        let newVoteStatus = t.userVote;
        let delta = 0;

        if (direction === 'up') {
          if (t.userVote === 'up') {
            newVoteStatus = null;
            delta = -1;
          } else if (t.userVote === 'down') {
            newVoteStatus = 'up';
            delta = 2;
          } else {
            newVoteStatus = 'up';
            delta = 1;
          }
        } else {
          if (t.userVote === 'down') {
            newVoteStatus = null;
            delta = 1;
          } else if (t.userVote === 'up') {
            newVoteStatus = 'down';
            delta = -2;
          } else {
            newVoteStatus = 'down';
            delta = -1;
          }
        }

        return {
          ...t,
          upvotes: Math.max(0, t.upvotes + delta),
          userVote: newVoteStatus
        };
      })
    );
  };

  // Add Comment to Forum Thread
  const handleAddComment = (threadId: string, commentText: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author: {
        name: user.name,
        role: user.role,
        avatar: user.avatar
      },
      content: commentText,
      createdAt: 'Baru saja',
      upvotes: 0
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        return {
          ...t,
          comments: [...t.comments, newComment]
        };
      })
    );

    // Reward user with 20 XP for active discussion
    setUser((prev) => ({
      ...prev,
      xpPoints: prev.xpPoints + 20
    }));
  };

  // Mark Comment as Verified Solution
  const handleMarkSolution = (threadId: string, commentId: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        return {
          ...t,
          isSolved: true,
          comments: t.comments.map((c) => ({
            ...c,
            isSolution: c.id === commentId
          }))
        };
      })
    );
  };

  // Create New Thread
  const handleAddThread = (
    newThreadData: Omit<ForumThread, 'id' | 'createdAt' | 'upvotes' | 'viewsCount' | 'comments' | 'isSolved'>
  ) => {
    const thread: ForumThread = {
      ...newThreadData,
      id: `thread-${Date.now()}`,
      createdAt: 'Baru saja',
      upvotes: 1,
      userVote: 'up',
      viewsCount: 1,
      comments: [],
      isSolved: false
    };

    setThreads((prev) => [thread, ...prev]);

    // Reward user with 35 XP for initiating good questions
    setUser((prev) => ({
      ...prev,
      xpPoints: prev.xpPoints + 35
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
      {/* 3-Zone Strict Top Bar Navigation */}
      <Navbar
        user={user}
        onOpenAiTutor={() => handleOpenAiTutor()}
        onScrollTo={handleScrollTo}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <HeroSection
          onExploreCourses={() => handleScrollTo('kursus')}
          onExploreLabs={() => handleScrollTo('laboratorium')}
          onExploreCommunity={() => handleScrollTo('komunitas')}
        />

        {/* Course Catalog */}
        <CourseCatalog
          courses={courses}
          onSelectCourse={(course) => setActiveCourseForPlayer(course)}
          enrolledCourseIds={user.enrolledCourseIds}
        />

        {/* Standalone Interactive Simulation Labs */}
        <InteractiveLabs />

        {/* Student Community Forum */}
        <CommunityForum
          threads={threads}
          onAddThread={handleAddThread}
          onVoteThread={handleVoteThread}
          onAddComment={handleAddComment}
          onMarkSolution={handleMarkSolution}
        />

        {/* Virtual Study Lounge & Pomodoro */}
        <StudyLounge />
      </main>

      {/* Institutional Educational Footer */}
      <Footer />

      {/* Course Player Modal */}
      {activeCourseForPlayer && (
        <CoursePlayerModal
          course={activeCourseForPlayer}
          onClose={() => setActiveCourseForPlayer(null)}
          completedLessonIds={user.completedLessons}
          onCompleteLesson={handleCompleteLesson}
          onOpenCertificate={(course) => {
            setActiveCourseForPlayer(null);
            setActiveCourseForCert(course);
          }}
          onOpenAiTutor={(ctx) => handleOpenAiTutor(ctx)}
        />
      )}

      {/* Verified Certificate Modal */}
      {activeCourseForCert && (
        <CertificateModal
          course={activeCourseForCert}
          studentName={user.name}
          onClose={() => setActiveCourseForCert(null)}
        />
      )}

      {/* AI Tutor Slide-over Drawer */}
      <AiTutorDrawer
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        contextTitle={aiTutorContext}
      />
    </div>
  );
}
