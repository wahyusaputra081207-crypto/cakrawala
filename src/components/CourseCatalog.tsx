import React, { useState } from 'react';
import { Course, CategoryId } from '../types';
import { Search, Star, BookOpen, Clock, Users, ArrowRight } from 'lucide-react';

interface CourseCatalogProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  enrolledCourseIds: string[];
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  onSelectCourse,
  enrolledCourseIds
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const categories = [
    { id: 'all' as CategoryId, label: 'Semua Bidang' },
    { id: 'teknologi' as CategoryId, label: 'Teknologi & Web' },
    { id: 'sains' as CategoryId, label: 'Sains Hayat' },
    { id: 'matematika' as CategoryId, label: 'Matematika & Kalkulus' },
    { id: 'fisika' as CategoryId, label: 'Fisika Interaktif' }
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <section id="kursus" className="py-12 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="text-xs font-semibold text-sky-600 uppercase tracking-wider mb-1">
              Kurikulum Berbasis Eksperimen
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Katalog Kursus Daring Interaktif
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Setiap kursus dilengkapi modul teori ringkas, laboratorium simulasi langsung, dan proyek terpandu untuk menguji pemahaman konsep.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono tabular-nums">
            Menampilkan {filteredCourses.length} dari {courses.length} Kursus
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 my-6">
          {/* Category Tabs (Segmented Controls) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Level Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Level Select */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 w-full sm:w-auto">
              <span>Tingkat:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-slate-100 border border-slate-200 text-slate-800 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="all">Semua Tingkat</option>
                <option value="Pemula">Pemula</option>
                <option value="Menengah">Menengah</option>
                <option value="Lanjutan">Lanjutan</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kursus atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-9 pr-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">Tidak ada kursus yang cocok</h3>
            <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci lain atau ubah kategori filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col overflow-hidden group shadow-xs hover:shadow-md"
                >
                  {/* Thumbnail Image Container with Fallback */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {isEnrolled && (
                      <div className="absolute top-3 right-3 bg-sky-950/80 text-sky-200 text-[11px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs border border-sky-700/50">
                        Sedang Diikuti
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Zero-Pill Metadata Discipline: unboxed text with typographic separators */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                        <span className="font-medium text-sky-700">{course.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{course.level}</span>
                        <span aria-hidden="true">·</span>
                        <span>{course.duration}</span>
                      </div>

                      {/* Course Title */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Course Overview */}
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {course.overview}
                      </p>

                      {/* Skills Gained Tags (Clean unboxed inline list) */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="text-[11px] font-medium text-slate-400 mb-1.5">Fokus Kompetensi:</div>
                        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-600">
                          {course.skillsGained.slice(0, 3).map((skill, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5">
                              {i > 0 && <span className="text-slate-300">/</span>}
                              <span>{skill}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata & Primary Action */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      {/* Instructor & Rating */}
                      <div className="flex items-center gap-2">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div className="text-[11px]">
                          <div className="font-semibold text-slate-800 line-clamp-1">{course.instructor.name}</div>
                          <div className="text-slate-400 flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="font-mono font-medium text-slate-700">{course.rating}</span>
                            <span className="tabular-nums font-mono">({course.reviewsCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => onSelectCourse(course)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs shrink-0"
                      >
                        <span>{isEnrolled ? 'Lanjut Belajar' : 'Buka Kursus'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
