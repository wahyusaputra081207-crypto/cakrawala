import React, { useState } from 'react';
import { Course, Lesson } from '../types';
import { X, CheckCircle2, ChevronRight, BookOpen, Award, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { BohrEffectSimulation } from './labs/BohrEffectSimulation';
import { CodeRunnerSimulation } from './labs/CodeRunnerSimulation';
import { ProjectilePhysicsSimulation } from './labs/ProjectilePhysicsSimulation';
import { CalculusTangentSimulation } from './labs/CalculusTangentSimulation';

interface CoursePlayerModalProps {
  course: Course;
  onClose: () => void;
  completedLessonIds: string[];
  onCompleteLesson: (lessonId: string, courseId: string) => void;
  onOpenCertificate: (course: Course) => void;
  onOpenAiTutor: (contextTitle: string) => void;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({
  course,
  onClose,
  completedLessonIds,
  onCompleteLesson,
  onOpenCertificate,
  onOpenAiTutor
}) => {
  // Flatten lessons
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const [currentLessonId, setCurrentLessonId] = useState<string>(allLessons[0]?.id || '');
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const currentLesson = allLessons.find((l) => l.id === currentLessonId) || allLessons[0];
  const isCurrentCompleted = completedLessonIds.includes(currentLessonId);

  // Check course completion status
  const completedCount = allLessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const isCourseFullyCompleted = completedCount === allLessons.length;
  const completionPercentage = Math.round((completedCount / allLessons.length) * 100);

  const handleNextLesson = () => {
    // Mark current as completed if not already
    if (!isCurrentCompleted) {
      onCompleteLesson(currentLessonId, course.id);
    }
    const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
    if (currentIndex < allLessons.length - 1) {
      setCurrentLessonId(allLessons[currentIndex + 1].id);
      setQuizSubmitted(false);
      setSelectedQuizAnswers({});
    }
  };

  const handleQuizAnswer = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
    onCompleteLesson(currentLessonId, course.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
              {course.categoryLabel}
            </span>
            <h2 className="text-sm font-bold text-white truncate max-w-md sm:max-w-xl">
              {course.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAiTutor(course.title)}
              className="text-xs font-medium text-sky-300 hover:text-white bg-sky-950/60 hover:bg-sky-900/80 px-2.5 py-1 rounded-md border border-sky-800/40 flex items-center gap-1.5 transition-colors"
            >
              <MessageCircleQuestion className="w-3.5 h-3.5" />
              Tanya Tutor AI
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Player Body: Sidebar Syllabus + Main Workspace Stage */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left / Sidebar Syllabus */}
          <div className="w-full lg:w-80 border-r border-slate-800 bg-slate-950/90 flex flex-col shrink-0 overflow-y-auto">
            {/* Course Progress Header */}
            <div className="p-4 border-b border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Kemajuan Kursus</span>
                <span className="font-mono text-sky-400 tabular-nums">{completionPercentage}% Selesai</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>

              {isCourseFullyCompleted && (
                <button
                  onClick={() => onOpenCertificate(course)}
                  className="w-full mt-3 py-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-colors"
                >
                  <Award className="w-4 h-4 text-amber-200" />
                  Klaim Sertifikat Kelulusan
                </button>
              )}
            </div>

            {/* Modules List */}
            <div className="p-3 space-y-4 flex-1">
              {course.modules.map((mod) => (
                <div key={mod.id}>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    {mod.title}
                  </div>
                  <div className="mt-1 space-y-1">
                    {mod.lessons.map((lesson) => {
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      const isCurrent = currentLessonId === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setCurrentLessonId(lesson.id);
                            setQuizSubmitted(false);
                            setSelectedQuizAnswers({});
                          }}
                          className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            isCurrent
                              ? 'bg-sky-950 text-sky-200 font-semibold border border-sky-800/60'
                              : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0"></div>
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono ml-2 shrink-0">
                            {lesson.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Main Stage */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-y-auto p-4 sm:p-6">
            {/* Current Lesson Header */}
            <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs text-sky-400 font-mono mb-1">
                  Pelajaran Aktif · {currentLesson.type.toUpperCase()}
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {currentLesson.title}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {currentLesson.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isCurrentCompleted ? (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tuntas +50 XP
                  </span>
                ) : (
                  <button
                    onClick={() => onCompleteLesson(currentLessonId, course.id)}
                    className="text-xs font-semibold text-sky-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                  >
                    Tandai Selesai
                  </button>
                )}
              </div>
            </div>

            {/* Lesson Content Body */}
            <div className="my-5 flex-1">
              {/* If Lesson includes an interactive lab */}
              {currentLesson.interactiveLabId && (
                <div className="mb-6">
                  {currentLesson.interactiveLabId === 'bohr_sim' && <BohrEffectSimulation />}
                  {currentLesson.interactiveLabId === 'code_runner' && <CodeRunnerSimulation />}
                  {currentLesson.interactiveLabId === 'projectile_sim' && <ProjectilePhysicsSimulation />}
                  {currentLesson.interactiveLabId === 'calculus_sim' && <CalculusTangentSimulation />}
                </div>
              )}

              {/* Theory Content (Plain text or markdown style) */}
              {currentLesson.type !== 'quiz' && (
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-sm leading-relaxed text-slate-300 space-y-3 font-sans">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <BookOpen className="w-4 h-4 text-sky-400" />
                    Uraian Modul
                  </div>
                  <div className="whitespace-pre-line text-slate-300 text-xs sm:text-sm">
                    {currentLesson.content}
                  </div>
                </div>
              )}

              {/* Quiz Module Solver */}
              {currentLesson.type === 'quiz' && currentLesson.quizQuestions && (
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-3">
                    <Sparkles className="w-4 h-4" />
                    Evaluasi Pemahaman Materi
                  </div>

                  {currentLesson.quizQuestions.map((q, qIndex) => {
                    const selected = selectedQuizAnswers[q.id];
                    const isAnswered = selected !== undefined;
                    const isCorrect = isAnswered && selected === q.correctIndex;

                    return (
                      <div key={q.id} className="space-y-3 p-4 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="text-sm font-semibold text-white">
                          {qIndex + 1}. {q.question}
                        </div>

                        <div className="space-y-2 mt-2">
                          {q.options.map((opt, optIdx) => {
                            const isChosen = selected === optIdx;
                            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                            if (quizSubmitted) {
                              if (optIdx === q.correctIndex) {
                                btnStyle = 'bg-emerald-950 border-emerald-600 text-emerald-200 font-semibold';
                              } else if (isChosen && !isCorrect) {
                                btnStyle = 'bg-rose-950 border-rose-600 text-rose-200';
                              }
                            } else if (isChosen) {
                              btnStyle = 'bg-sky-950 border-sky-500 text-sky-200 font-semibold';
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleQuizAnswer(q.id, optIdx)}
                                disabled={quizSubmitted}
                                className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && optIdx === q.correctIndex && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className={`p-3 rounded-md text-xs mt-3 ${isCorrect ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950/80 text-rose-300 border border-rose-800/50'}`}>
                            <strong>{isCorrect ? 'Tepat Sekali! 🎉' : 'Belum Tepat:'}</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {!quizSubmitted && (
                    <button
                      onClick={submitQuiz}
                      className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg text-xs shadow transition-colors"
                    >
                      Kirim & Periksa Jawaban Kuis
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Pelajaran {allLessons.findIndex((l) => l.id === currentLessonId) + 1} dari {allLessons.length}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleNextLesson}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow transition-colors"
                >
                  <span>Selesaikan & Lanjut</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
