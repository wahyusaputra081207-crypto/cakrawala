import React, { useState } from 'react';
import { ForumThread, ForumChannel, ForumComment } from '../types';
import { MessageSquare, ThumbsUp, ThumbsDown, CheckCircle2, Search, Plus, Eye, Share2, Bookmark, X, Code, Send } from 'lucide-react';
import { COMMUNITY_HERO_IMAGE } from '../data/mockData';

interface CommunityForumProps {
  threads: ForumThread[];
  onAddThread: (thread: Omit<ForumThread, 'id' | 'createdAt' | 'upvotes' | 'viewsCount' | 'comments' | 'isSolved'>) => void;
  onVoteThread: (threadId: string, direction: 'up' | 'down') => void;
  onAddComment: (threadId: string, commentText: string) => void;
  onMarkSolution: (threadId: string, commentId: string) => void;
}

export const CommunityForum: React.FC<CommunityForumProps> = ({
  threads,
  onAddThread,
  onVoteThread,
  onAddComment,
  onMarkSolution
}) => {
  const [selectedChannel, setSelectedChannel] = useState<ForumChannel>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'populer' | 'terbaru' | 'belum-terjawab'>('populer');
  const [activeThread, setActiveThread] = useState<ForumThread | null>(null);
  const [isCreatingThread, setIsCreatingThread] = useState<boolean>(false);

  // New Thread Form state
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState<ForumChannel>('tanya-materi');
  const [newContent, setNewContent] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newTags, setNewTags] = useState('');

  // Comment input state
  const [replyText, setReplyText] = useState('');

  const channels: Array<{ id: ForumChannel; label: string }> = [
    { id: 'all', label: 'Semua Diskusi' },
    { id: 'tanya-materi', label: '#tanya-materi' },
    { id: 'proyek-portofolio', label: '#proyek-portofolio' },
    { id: 'tips-belajar', label: '#tips-belajar' },
    { id: 'lingkar-diskusi', label: '#lingkar-diskusi' }
  ];

  // Filtering & Sorting
  const filteredThreads = threads
    .filter((t) => {
      const matchesChannel = selectedChannel === 'all' || t.channel === selectedChannel;
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSolved = sortBy === 'belum-terjawab' ? !t.isSolved : true;
      return matchesChannel && matchesSearch && matchesSolved;
    })
    .sort((a, b) => {
      if (sortBy === 'populer') return b.upvotes - a.upvotes;
      return 0; // Default order
    });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const channelObj = channels.find((c) => c.id === newChannel);
    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddThread({
      title: newTitle,
      channel: newChannel,
      channelLabel: channelObj?.label || 'Diskusi',
      author: {
        name: 'Fahri Wahyu',
        role: 'Pelajar Aktif',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        school: 'SMAN 1 Bandung'
      },
      content: newContent,
      codeSnippet: newCode.trim() ? newCode : undefined,
      tags: tagsArray.length > 0 ? tagsArray : ['Diskusi', 'Belajar']
    });

    setNewTitle('');
    setNewContent('');
    setNewCode('');
    setNewTags('');
    setIsCreatingThread(false);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !activeThread) return;
    onAddComment(activeThread.id, replyText);
    setReplyText('');

    // Update activeThread comments locally for instant feedback
    const newComment: ForumComment = {
      id: `c-local-${Date.now()}`,
      author: {
        name: 'Fahri Wahyu',
        role: 'Pelajar Aktif',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
      },
      content: replyText,
      createdAt: 'Baru saja',
      upvotes: 0
    };
    setActiveThread({
      ...activeThread,
      comments: [...activeThread.comments, newComment]
    });
  };

  return (
    <section id="komunitas" className="py-12 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner with real community photograph */}
        <div className="relative rounded-2xl overflow-hidden mb-10 border border-slate-200 bg-slate-900 text-white min-h-[180px] flex items-center">
          <img
            src={COMMUNITY_HERO_IMAGE}
            alt="Diskusi Komunitas Pelajar"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="relative z-10 p-6 sm:p-10 max-w-2xl">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              Forum Kolaboratif Pelajar Nusantara
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
              Ruang Diskusi & Saling Bantu Belajar
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Tanyakan materi yang membingungkan, dapatkan peer-review untuk proyek kodemu, diskusikan rumus fisika, dan temukan teman belajar satu frekuensi.
            </p>
          </div>
        </div>

        {/* Toolbar Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          {/* Channel Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedChannel === ch.id
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>

          {/* New Discussion CTA */}
          <button
            onClick={() => setIsCreatingThread(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg shadow transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Mulai Diskusi Baru
          </button>
        </div>

        {/* Secondary Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-5">
          {/* Sort tabs */}
          <div className="flex items-center gap-1 text-xs text-slate-600 w-full sm:w-auto">
            <span className="mr-1 text-slate-400">Urutkan:</span>
            <button
              onClick={() => setSortBy('populer')}
              className={`px-2.5 py-1 rounded transition-colors ${
                sortBy === 'populer' ? 'bg-slate-200 font-bold text-slate-900' : 'hover:text-slate-900'
              }`}
            >
              Populer
            </button>
            <button
              onClick={() => setSortBy('terbaru')}
              className={`px-2.5 py-1 rounded transition-colors ${
                sortBy === 'terbaru' ? 'bg-slate-200 font-bold text-slate-900' : 'hover:text-slate-900'
              }`}
            >
              Terbaru
            </button>
            <button
              onClick={() => setSortBy('belum-terjawab')}
              className={`px-2.5 py-1 rounded transition-colors ${
                sortBy === 'belum-terjawab' ? 'bg-slate-200 font-bold text-slate-900' : 'hover:text-slate-900'
              }`}
            >
              Belum Terjawab
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari topik diskusi atau tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-900 pl-8 pr-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="space-y-3.5">
          {filteredThreads.map((thread) => (
            <div
              key={thread.id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 transition-all shadow-xs flex flex-col sm:flex-row gap-4 items-start"
            >
              {/* Upvote Column */}
              <div className="flex sm:flex-col items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200 shrink-0">
                <button
                  onClick={() => onVoteThread(thread.id, 'up')}
                  className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                    thread.userVote === 'up' ? 'text-sky-600' : 'text-slate-500'
                  }`}
                  title="Dukung Naik"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs font-bold text-slate-800 tabular-nums px-1">
                  {thread.upvotes}
                </span>
                <button
                  onClick={() => onVoteThread(thread.id, 'down')}
                  className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                    thread.userVote === 'down' ? 'text-rose-600' : 'text-slate-500'
                  }`}
                  title="Dukung Turun"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main Content Info */}
              <div className="flex-1 min-w-0">
                {/* Zero-Pill Metadata Header */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1.5">
                  <span className="font-semibold text-sky-700">{thread.channelLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-slate-700">{thread.author.name}</span>
                  <span className="text-slate-400">({thread.author.school})</span>
                  <span aria-hidden="true">·</span>
                  <span>{thread.createdAt}</span>
                  {thread.isSolved && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Terpecahkan
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h3
                  onClick={() => setActiveThread(thread)}
                  className="text-sm sm:text-base font-bold text-slate-900 hover:text-sky-600 transition-colors cursor-pointer"
                >
                  {thread.title}
                </h3>

                {/* Content Excerpt */}
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {thread.content}
                </p>

                {/* Tags (Unboxed inline format with separators) */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
                  <span className="text-slate-400">Tag:</span>
                  {thread.tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-sky-600 font-medium">
                      {i > 0 && <span className="text-slate-300">·</span>}
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Action Counters */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 text-xs text-slate-400 shrink-0 gap-2">
                <button
                  onClick={() => setActiveThread(thread)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono tabular-nums">{thread.comments.length} Balasan</span>
                </button>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Eye className="w-3 h-3" />
                  <span className="font-mono tabular-nums">{thread.viewsCount} Dilihat</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create New Thread */}
      {isCreatingThread && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl border border-slate-200 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Mulai Topik Diskusi Baru</h3>
              <button
                onClick={() => setIsCreatingThread(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Pertanyaan / Topik</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Mengapa kurva disosiasi bergeser ke kanan saat asidosis?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Saluran Kategori</label>
                <select
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value as ForumChannel)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="tanya-materi">#tanya-materi (Pertanyaan seputar modul & teori)</option>
                  <option value="proyek-portofolio">#proyek-portofolio (Showcase & minta saran kode)</option>
                  <option value="tips-belajar">#tips-belajar (Manajemen waktu & produktivitas)</option>
                  <option value="lingkar-diskusi">#lingkar-diskusi (Info kompetisi, beasiswa & umum)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Lengkap Pertanyaan</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Uraikan detail masalah atau konsep yang ingin Anda diskusikan..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cuplikan Kode / Rumus (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="// Tempelkan potongan kode JavaScript, Python, atau LaTeX di sini jika ada"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 font-mono text-xs rounded-lg p-2.5 border border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tag (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  placeholder="Fisika, Kinematika, React, UI"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingThread(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow"
                >
                  Terbitkan Diskusi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Thread Details & Replies */}
      {activeThread && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
            {/* Thread Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-sky-700">
                  {activeThread.channelLabel}
                </span>
                {activeThread.isSolved && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    · <CheckCircle2 className="w-3.5 h-3.5" /> Terpecahkan
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveThread(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thread Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Author & Main Post */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={activeThread.author.avatar}
                    alt={activeThread.author.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{activeThread.author.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {activeThread.author.role} · {activeThread.author.school} · {activeThread.createdAt}
                    </div>
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {activeThread.title}
                </h2>

                <div className="text-xs sm:text-sm text-slate-700 mt-3 whitespace-pre-line leading-relaxed">
                  {activeThread.content}
                </div>

                {/* Code Snippet Box */}
                {activeThread.codeSnippet && (
                  <div className="mt-4 rounded-lg bg-slate-950 p-4 border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto">
                    <div className="text-[10px] text-slate-400 mb-2 flex items-center gap-1.5">
                      <Code className="w-3 h-3 text-sky-400" />
                      Cuplikan Kode / Notasi Terlampir
                    </div>
                    <pre className="text-emerald-400 leading-relaxed">{activeThread.codeSnippet}</pre>
                  </div>
                )}
              </div>

              {/* Replies Section */}
              <div className="pt-5 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                  <span>{activeThread.comments.length} Tanggapan dari Komunitas</span>
                </div>

                {activeThread.comments.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-500">
                    Belum ada balasan untuk diskusi ini. Jadilah yang pertama memberikan masukan atau solusi!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeThread.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-4 rounded-xl border transition-all ${
                          comment.isSolution
                            ? 'bg-emerald-50/70 border-emerald-300'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={comment.author.avatar}
                              alt={comment.author.name}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                {comment.author.name}
                                {comment.author.badge && (
                                  <span className="text-[10px] text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded font-medium">
                                    {comment.author.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">{comment.createdAt}</div>
                            </div>
                          </div>

                          {comment.isSolution ? (
                            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Solusi Terverifikasi
                            </span>
                          ) : (
                            <button
                              onClick={() => onMarkSolution(activeThread.id, comment.id)}
                              className="text-[11px] text-slate-400 hover:text-emerald-700 font-medium"
                            >
                              Tandai Solusi
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mt-2">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reply Input Box */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tulis balasan atau penjelasan untuk pertanyaan ini..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <button
                  onClick={handleSendReply}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
