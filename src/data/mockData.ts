import { Course, ForumThread, UserProfile } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_interactive_learning_1791877808265.jpg';
export const COMMUNITY_HERO_IMAGE = '/src/assets/images/community_study_group_1791877811165.jpg';

export const INITIAL_USER: UserProfile = {
  name: 'Fahri Wahyu',
  email: 'fahriwahyusaputra@gmail.com',
  role: 'Pelajar Aktif',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  xpPoints: 850,
  completedLessons: ['web-1-1', 'bio-1-1'],
  enrolledCourseIds: ['web-dev-modern', 'biologi-seluler', 'kalkulus-visual'],
  completedCourseIds: [],
  streakDays: 7,
  badges: [
    { id: 'b1', title: 'Penjelajah Kode', icon: 'Code', date: '10 Okt 2026' },
    { id: 'b2', title: 'Analis Seluler', icon: 'Atom', date: '12 Okt 2026' },
    { id: 'b3', title: 'Diskusi Aktif', icon: 'MessageSquare', date: '13 Okt 2026' }
  ]
};

export const COURSES: Course[] = [
  {
    id: 'web-dev-modern',
    title: 'Rekayasa Frontend Modern & React 19',
    category: 'teknologi',
    categoryLabel: 'Teknologi & Web',
    level: 'Menengah',
    duration: '8 Modul · 16 Jam',
    studentsCount: 2840,
    rating: 4.9,
    reviewsCount: 342,
    instructor: {
      name: 'Rian Pratama, M.Kom.',
      role: 'Principal Frontend Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'
    },
    thumbnail: '/src/assets/images/course_web_development_1791877808935.jpg',
    overview: 'Kuasai paradigma reaktif, state management, dan arsitektur UI modern dengan simulasi live-code runner interaktif.',
    skillsGained: ['React 19 Hooks', 'TypeScript Strict', 'Tailwind CSS Modern', 'DOM Performance', 'Algoritma State'],
    modules: [
      {
        id: 'mod-web-1',
        title: 'Fondasi Komponen & Reaktivitas',
        lessons: [
          {
            id: 'web-1-1',
            title: '01. Memahami Siklus Hidup Reaktivitas UI',
            duration: '15 Menit',
            type: 'reading',
            summary: 'Pelajari bagaimana virtual DOM memetakan perubahan status ke tampilan nyata secara optimal.',
            content: `Dalam pengembangan web modern, UI adalah fungsi dari status (State). Ketika status berubah, framework seperti React akan memicu proses rekonsiliasi untuk memperbarui bagian DOM yang terdampak tanpa perlu memuat ulang seluruh halaman.

Prinsip Utama:
1. Immutability: Jangan pernah mengubah state secara langsung; buat salinan baru agar sistem melacak perubahan referensi memori.
2. Unidirectional Data Flow: Data mengalir dari komponen induk ke komponen anak melalui props.
3. Pure Components: Fungsi render harus deterministik — input yang sama menghasilkan output yang sama tanpa efek samping tak terduga.`
          },
          {
            id: 'web-1-2',
            title: '02. Lab Interaktif: Editor Kode Komponen Langsung',
            duration: '30 Menit',
            type: 'code_sandbox',
            interactiveLabId: 'code_runner',
            summary: 'Tulis dan jalankan kode JavaScript / HTML interaktif di sandbox terisolasi dengan tinjauan langsung.',
            content: `Gunakan playground di bawah untuk bereksperimen dengan logika interaktif. Ubah kode di panel editor dan klik "Jalankan Kode" untuk melihat hasil seketika pada preview stage.`
          },
          {
            id: 'web-1-3',
            title: '03. Evaluasi Pemahaman: Kuis State & Props',
            duration: '10 Menit',
            type: 'quiz',
            summary: 'Uji pemahaman konsep aliran data searah dan manajemen state.',
            content: 'Jawab pertanyaan berikut untuk memverifikasi pemahaman Anda sebelum melangkah ke modul berikutnya.',
            quizQuestions: [
              {
                id: 'qw-1',
                question: 'Mengapa mutasi langsung pada array state (misal: state.push(x)) tidak disarankan dalam React?',
                options: [
                  'Karena React tidak dapat mendeteksi perubahan referensi objek untuk memicu re-render',
                  'Karena JavaScript tidak mendukung metode push pada browser modern',
                  'Karena akan membuat ukuran file JavaScript membengkak',
                  'Karena browser akan langsung melempar error sintaksis fatal'
                ],
                correctIndex: 0,
                explanation: 'React membandingkan referensi memori (shallow equality). Jika array dimutasi langsung, referensi objek tetap sama sehingga React tidak menyadari ada perubahan yang membutuhkan render ulang.'
              },
              {
                id: 'qw-2',
                question: 'Apa fungsi utama dari hook useEffect dalam siklus komponen?',
                options: [
                  'Untuk menyinkronkan komponen dengan sistem eksternal (API, timer, DOM event)',
                  'Untuk mempercepat kompilasi file TypeScript di dev server',
                  'Untuk menggantikan seluruh fungsi HTML di browser',
                  'Untuk mengatur warna tema CSS tanpa stylesheet'
                ],
                correctIndex: 0,
                explanation: 'useEffect digunakan untuk menangani side effects seperti request data, subscription WebSocket, atau manipulasi manual DOM yang berada di luar alur render murni.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'biologi-seluler',
    title: 'Fisiologi Molekuler & Simulasi Efek Bohr',
    category: 'sains',
    categoryLabel: 'Sains Hayat',
    level: 'Menengah',
    duration: '6 Modul · 12 Jam',
    studentsCount: 1650,
    rating: 4.95,
    reviewsCount: 215,
    instructor: {
      name: 'dr. Nadya Kusuma, Sp.PK',
      role: 'Peneliti Fisiologi & Dosen Kedokteran',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80'
    },
    thumbnail: '/src/assets/images/course_cellular_biology_1791877809628.jpg',
    overview: 'Simulasi interaktif kurva disosiasi hemoglobin, transportasi gas darah, dan respons respirasi seluler terhadap variasi pH & CO2.',
    skillsGained: ['Afinitas Hemoglobin', 'Keseimbangan Asam-Basa', 'Kurva Disosiasi Oksigen', 'Kinetika Enzim', 'Metabolisme Seluler'],
    modules: [
      {
        id: 'mod-bio-1',
        title: 'Transportasi Gas & Pengikatan Oksigen',
        lessons: [
          {
            id: 'bio-1-1',
            title: '01. Konsep Efek Bohr & Afinitas Hemoglobin',
            duration: '20 Menit',
            type: 'reading',
            summary: 'Pelajari bagaimana konsentrasi ion H+ dan pCO2 mengubah konformasi molekul hemoglobin.',
            content: `Efek Bohr adalah fenomena fisiologis di mana penurunan pH darah (peningkatan keasaman/ion H+) atau peningkatan tekanan parsial karbon dioksida (pCO2) menurunkan afinitas hemoglobin terhadap oksigen.

Implikasi Klinis:
Pada jaringan otot yang sedang aktif bekerja keras, metabolisme menghasilkan asam laktat dan CO2 dalam jumlah tinggi. Kondisi asam ini melemahkan ikatan hemoglobin-oksigen, sehingga oksigen dilepaskan lebih efisien tepat ke jaringan yang paling membutuhkannya.`
          },
          {
            id: 'bio-1-2',
            title: '02. Lab Interaktif: Simulasi Kurva Disosiasi Bohr',
            duration: '25 Menit',
            type: 'simulation',
            interactiveLabId: 'bohr_sim',
            summary: 'Manipulasi pH, pCO2, dan temperatur untuk melihat pergeseran kurva disosiasi hemoglobin secara real-time.',
            content: 'Gunakan panel kontrol di bawah untuk mengatur pH darah dan pCO2. Amati pergeseran kurva ke kanan (pelepasan O2 meningkat) atau ke kiri (afinitas O2 meningkat).'
          },
          {
            id: 'bio-1-3',
            title: '03. Evaluasi: Kuis Fisiologi Respirasi',
            duration: '10 Menit',
            type: 'quiz',
            summary: 'Uji kemampuan analisa fisiologi sistem pernapasan dan keseimbangan gas.',
            content: 'Pilih jawaban yang paling tepat berdasarkan prinsip Efek Bohr.',
            quizQuestions: [
              {
                id: 'qb-1',
                question: 'Apa akibat pergeseran kurva disosiasi hemoglobin ke arah KANAN (Right Shift)?',
                options: [
                  'Hemoglobin melepaskan oksigen lebih mudah ke jaringan tubuh',
                  'Hemoglobin mengikat oksigen lebih kuat dan sulit dilepaskan',
                  'Jumlah sel darah merah dalam sirkulasi berkurang drastis',
                  'Tekanan parsial CO2 turun menjadi nol'
                ],
                correctIndex: 0,
                explanation: 'Pergeseran ke kanan menurunkan afinitas Hb terhadap O2, memudahkan pelepasan oksigen ke jaringan aktif dengan kebutuhan metabolik tinggi.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'kalkulus-visual',
    title: 'Matematika Interaktif: Kalkulus & Aljabar Geometris',
    category: 'matematika',
    categoryLabel: 'Matematika & Kalkulus',
    level: 'Pemula',
    duration: '10 Modul · 18 Jam',
    studentsCount: 3120,
    rating: 4.88,
    reviewsCount: 410,
    instructor: {
      name: 'Dr. Hendra Wijaya, M.Sc.',
      role: 'Matematikawan & Edukator Sains',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80'
    },
    thumbnail: '/src/assets/images/course_visual_calculus_1791877810811.jpg',
    overview: 'Pahami turunan, integral, dan geometri koordinat bukan dengan hafalan rumus rumit, melainkan visualisasi lereng garis singgung interaktif.',
    skillsGained: ['Garis Singgung & Turunan', 'Laju Perubahan Sesaat', 'Visualisasi Fungsi Non-Linear', 'Optimasi Aljabar', 'Vektor Bidang'],
    modules: [
      {
        id: 'mod-math-1',
        title: 'Geometri Turunan & Garis Singgung',
        lessons: [
          {
            id: 'math-1-1',
            title: '01. Intuisi Geometris Turunan Pertama',
            duration: '15 Menit',
            type: 'reading',
            summary: 'Memahami turunan sebagai kemiringan (gradien) garis singgung di sebuah titik tunggal.',
            content: `Jika kecepatan rata-rata adalah perbandingan jarak terhadap selang waktu tertentu, maka kecepatan sesaat adalah limit ketika selang waktu mendekati nol.

Secara geometris pada kurva y = f(x):
Turunan f'(a) merepresentasikan kemiringan sudut kemiringan (slope m) garis singgung yang menyentuh titik (a, f(a)).`
          },
          {
            id: 'math-1-2',
            title: '02. Lab Interaktif: Eksplorasi Garis Singgung Dinamis',
            duration: '25 Menit',
            type: 'simulation',
            interactiveLabId: 'calculus_sim',
            summary: 'Geser titik x0 untuk melihat garis singgung kurva berputar dan menghitung gradien turunan sesaat.',
            content: 'Gerakkan slider nilai x0 untuk melihat perubahan kemiringan garis singgung f\'(x) secara real-time.'
          }
        ]
      }
    ]
  },
  {
    id: 'fisika-kinematika',
    title: 'Fisika Eksperimental: Kinematika & Gravitasi',
    category: 'fisika',
    categoryLabel: 'Fisika Interaktif',
    level: 'Pemula',
    duration: '7 Modul · 14 Jam',
    studentsCount: 1980,
    rating: 4.92,
    reviewsCount: 189,
    instructor: {
      name: 'Budi Santoso, S.Si.',
      role: 'Pengembang Media Sains Fisika',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80'
    },
    thumbnail: '/src/assets/images/hero_interactive_learning_1791877808265.jpg',
    overview: 'Laboratorium simulasi gerak parabola: kendalikan sudut elevasi, kecepatan awal, hambatan udara, dan medan gravitasi.',
    skillsGained: ['Gerak Parabola', 'Vektor Kecepatan 2D', 'Dinamika Newton', 'Analisis Energi Mekanik', 'Eksperimen Virtual'],
    modules: [
      {
        id: 'mod-phys-1',
        title: 'Gerak Peluru dalam Medan Gravitasi',
        lessons: [
          {
            id: 'phys-1-1',
            title: '01. Teori Pemisahan Komponen Horizontal & Vertikal',
            duration: '15 Menit',
            type: 'reading',
            summary: 'Membedakan GLB pada sumbu X dan GLBB dengan perlambatan g pada sumbu Y.',
            content: `Kunci memahami gerak peluru adalah memisahkan kedua dimensi:
1. Sumbu Horizontal (X): Tidak ada percepatan (jika mengabaikan gesekan udara). Jarak = v0 * cos(θ) * t.
2. Sumbu Vertikal (Y): Mengalami percepatan gravitasi g ke bawah. Vy = v0 * sin(θ) - g * t.`
          },
          {
            id: 'phys-1-2',
            title: '02. Lab Interaktif: Meriam Parabola Virtual',
            duration: '30 Menit',
            type: 'simulation',
            interactiveLabId: 'projectile_sim',
            summary: 'Luncurkan peluru virtual dengan variasi sudut dan gravitasi, hitung jangkauan maksimum.',
            content: 'Atur sudut luncur dan kecepatan awal, lalu klik Luncurkan untuk melihat lintasan parabola.'
          }
        ]
      }
    ]
  }
];

export const FORUM_THREADS: ForumThread[] = [
  {
    id: 'thread-1',
    title: 'Bagaimana cara membuktikan secara matematis bahwa sudut 45° memberikan jarak peluru terjauh?',
    channel: 'tanya-materi',
    channelLabel: 'Tanya Materi',
    author: {
      name: 'Dimas Satria',
      role: 'Siswa SMA Kelas 12',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80',
      school: 'SMAN 3 Bandung'
    },
    createdAt: '3 jam yang lalu',
    content: `Halo teman-teman, saat mencoba simulasi Gerak Parabola di Lab Fisika, saya perhatikan bahwa jarak tempuh terjauh (R max) selalu terjadi ketika sudut peluncuran tepat di angka 45°. 

Bisa tolong bantu jelaskan penurunan rumus trigonometrinya dari persamaan jarak horizontal?`,
    codeSnippet: `// Rumus jarak horizontal:
R = (v0^2 * sin(2*theta)) / g;
// Mengapa turunan dR/d(theta) bernilai nol saat theta = 45 derajat?`,
    tags: ['Fisika', 'Kinematika', 'Trigonometri', 'Simulasi'],
    upvotes: 24,
    userVote: 'up',
    viewsCount: 182,
    isSolved: true,
    comments: [
      {
        id: 'c1-1',
        author: {
          name: 'Sarah Amalia',
          role: 'Mahasiswi Fisika ITB',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
          badge: 'Kontributor Utama'
        },
        content: `Halo Dimas! Pertanyaan yang bagus sekali.
Perhatikan suku sin(2θ) pada rumus: R = (v₀² · sin(2θ)) / g.

Nilai maksimum dari fungsi sinus trigonometri apa pun adalah 1.
Agar sin(2θ) bernilai maksimum (= 1):
2θ = 90°
θ = 90° / 2 = 45°!

Jadi tanpa turunan pun terbukti bahwa saat θ = 45°, nilai sin(2θ) mencapai puncak tertingginya yaitu 1, menghasilkan jarak R terjauh!`,
        createdAt: '2 jam yang lalu',
        upvotes: 31,
        isSolution: true
      },
      {
        id: 'c1-2',
        author: {
          name: 'Budi Santoso, S.Si.',
          role: 'Instruktur Lab Fisika',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80',
          badge: 'Instruktur'
        },
        content: `Penjelasan Sarah tepat sekali. Catatan tambahan: pembuktian 45° ini berlaku untuk lintasan simetris di mana ketinggian titik awal sama dengan titik akhir jatuhnya peluru (y₀ = y_akhir = 0). Coba eksperimen di simulator dengan ketinggian tebing awal berbeda!`,
        createdAt: '1 jam yang lalu',
        upvotes: 12
      }
    ]
  },
  {
    id: 'thread-2',
    title: 'Showcase Proyek: Aplikasi Visualisasi Sistem Respirasi dengan SVG & React',
    channel: 'proyek-portofolio',
    channelLabel: 'Review Proyek',
    author: {
      name: 'Aulia Rahman',
      role: 'Alumni Bootcamp',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
      school: 'Universitas Indonesia'
    },
    createdAt: 'Kemarin',
    content: `Setelah menyelesaikan modul fisiologi dan frontend di Cakrawala Akademi, saya membuat proyek portofolio mini berupa visualisator pertukaran O2 dan CO2 di alveolus paru-paru.

Fitur:
- Animasi aliran eritrosit berbasis requestAnimationFrame
- Slider kontrol frekuensi napas dan tekanan parsial
- Responsif di layar tablet dan laptop

Mohon masukan teman-teman terkait optimasi rendering dan tata letak UI-nya!`,
    codeSnippet: `// Contoh custom hook untuk interpolasi koordinat partikel O2:
function useParticleFlow(speed = 1.0) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let animId: number;
    const loop = (t: number) => {
      setPos({ x: (t * 0.05 * speed) % 800, y: Math.sin(t * 0.003) * 20 + 100 });
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [speed]);
  return pos;
}`,
    tags: ['React', 'Portofolio', 'Biologi', 'OpenSource'],
    upvotes: 42,
    userVote: null,
    viewsCount: 340,
    isSolved: false,
    comments: [
      {
        id: 'c2-1',
        author: {
          name: 'Rian Pratama, M.Kom.',
          role: 'Instruktur Frontend',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
          badge: 'Instruktur'
        },
        content: `Karya yang luar biasa Aulia! Satu tips optimasi: untuk ratusan partikel mengambang, render ke Canvas 2D atau WebGL lebih hemat memori daripada re-render state React per frame. Namun untuk prototype ini kodenya sudah sangat rapi dan bersih.`,
        createdAt: '18 jam yang lalu',
        upvotes: 18
      }
    ]
  },
  {
    id: 'thread-3',
    title: 'Strategi Manajemen Waktu Belajar: Teknik Pomodoro 50/10 vs 25/5 saat Mengerjakan Coding & Sains',
    channel: 'tips-belajar',
    channelLabel: 'Tips Belajar',
    author: {
      name: 'Nadia Prameswari',
      role: 'Pelajar Mandiri',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
      school: 'SMAN 1 Yogyakarta'
    },
    createdAt: '2 hari yang lalu',
    content: `Bagi teman-teman yang sedang belajar coding atau memecahkan soal kalkulus bertingkat, apakah lebih efektif menggunakan siklus 25 menit fokus + 5 menit istirahat, atau 50 menit fokus + 10 menit istirahat?

Seringkali saat baru mulai paham konsep abstrak (flow state), timer 25 menit sudah berbunyi dan memotong konsentrasi. Bagaimana pengalaman kalian?`,
    tags: ['Produktivitas', 'Pomodoro', 'FlowState', 'Mindset'],
    upvotes: 38,
    userVote: null,
    viewsCount: 425,
    isSolved: true,
    comments: [
      {
        id: 'c3-1',
        author: {
          name: 'Kevin Jonathan',
          role: 'Mahasiswa Teknik Komputer',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&q=80'
        },
        content: `Untuk tugas analitis berat seperti coding dan problem solving matematika, siklus 50 menit kerja + 10 menit istirahat jauh lebih cocok karena otak butuh sekitar 10-15 menit pemanasan hanya untuk masuk ke 'deep flow'. Siklus 25/5 lebih pas untuk menghafal kosakata atau membaca review cepat.`,
        createdAt: '1 hari yang lalu',
        upvotes: 27,
        isSolution: true
      }
    ]
  },
  {
    id: 'thread-4',
    title: 'Informasi Kompetisi Karya Ilmiah Remaja & Hackathon Edukasi Pelajar 2026',
    channel: 'lingkar-diskusi',
    channelLabel: 'Lingkar Diskusi',
    author: {
      name: 'Tegar Wicaksono',
      role: 'Moderator Komunitas',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80',
      school: 'Komunitas Cakrawala'
    },
    createdAt: '3 hari yang lalu',
    content: `Halo rekan-rekan pembelajar! Berikut adalah daftar kompetisi sains, inovasi teknologi, dan olimpiade terbuka tingkat nasional bulan ini yang bisa diikuti secara individu maupun tim.

Jika ada yang sedang mencari partner tim (coder + pembuat konsep + presenter), silakan perkenalkan diri dan keahlian di kolom komentar di bawah!`,
    tags: ['Kompetisi', 'Lomba', 'Kolaborasi', 'Beasiswa'],
    upvotes: 56,
    userVote: null,
    viewsCount: 680,
    isSolved: false,
    comments: []
  }
];

export const STUDY_LOUNGE_PARTICIPANTS = [
  { id: 'u1', name: 'Rani Safitri', status: 'Fokus Belajar React 19', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', minutes: 42 },
  { id: 'u2', name: 'Farel Pratama', status: 'Mengerjakan Kuis Efek Bohr', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', minutes: 28 },
  { id: 'u3', name: 'Dewi Lestari', status: 'Simulasi Garis Singgung Kalkulus', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', minutes: 65 },
  { id: 'u4', name: 'Arka Maulana', status: 'Eksperimen Gerak Parabola', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', minutes: 14 }
];
