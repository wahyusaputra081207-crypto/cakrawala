import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client safely
const getGeminiClient = () => {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
                 (import.meta as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY ||
                 '';
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export async function askAiTutor(
  userQuestion: string,
  contextCourseTitle?: string,
  conversationHistory?: Array<{ sender: 'user' | 'ai'; text: string }>
): Promise<string> {
  const ai = getGeminiClient();

  if (ai) {
    try {
      const systemInstruction = `Kamu adalah 'Tutor Pintar Cakrawala', asisten pendidik interaktif berkebangsaan Indonesia yang ramah, jelas, metodis, dan menggunakan pendekatan Socrates (membantu siswa memahami prinsip dasar alih-alih sekadar memberikan jawaban langsung).
Materi yang dipelajari siswa saat ini: ${contextCourseTitle || 'Umum (Sains, Teknologi, Matematika)'}.
Gunakan Bahasa Indonesia yang komunikatif, terstruktur, jelas, dengan bullet point jika diperlukan.
Jika pertanyaan berkaitan dengan rumus atau sains, jelaskan logika di balik rumus tersebut.`;

      const prompt = `Pertanyaan Pelajar: ${userQuestion}\n\nJawablah dengan terstruktur, mudah dipahami, dan berikan pertanyaan balik reflektif untuk menguji pemahaman siswa.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn('Gemini API call encountered an issue, falling back to local tutor engine:', err);
    }
  }

  // Fallback intelligent pedagogical response generator
  const q = userQuestion.toLowerCase();
  if (q.includes('bohr') || q.includes('hemoglobin') || q.includes('oksigen') || q.includes('ph')) {
    return `Halo! Pertanyaan yang sangat esensial dalam fisiologi. 

**Efek Bohr** menjelaskan bagaimana keasaman (pH) dan kadar CO₂ memengaruhi seberapa erat hemoglobin mengikat oksigen:
1. **Saat Jaringan Aktif Bekerja (misal: Otot Berlari)**: Metabolisme menghasilkan CO₂ dan ion H⁺ (asam laktat). Hal ini membuat pH lingkungan jaringan turun (lebih asam).
2. **Respon Hemoglobin**: Keasaman ini mengubah struktur 3 dimensi hemoglobin sehingga ikatannya dengan O₂ melemah (*afinitas menurun*).
3. **Hasil**: Oksigen segera 'dilepaskan' dari darah masuk ke sel-sel otot yang membutuhkan energi.

*Pertanyaan Reflektif untukmu*: Menurutmu, apa yang terjadi jika seseorang mengalami hiperventilasi (bernapas sangat cepat sehingga CO₂ darah terkuras keluar)? Apakah kurva bergeser ke kiri atau ke kanan?`;
  }

  if (q.includes('parabola') || q.includes('fisika') || q.includes('sudut') || q.includes('gravitasi')) {
    return `Pertanyaan luar biasa mengenai kinematika gerak dua dimensi!

Kunci utama menyelesaikan soal **Gerak Parabola**:
- **Sumbu X (Horizontal)**: Tidak ada gaya percepatan (kecepatan tetap / GLB). $v_x = v_0 \\cos(\\theta)$. Jarak tempuh: $x = v_x \\cdot t$.
- **Sumbu Y (Vertikal)**: Dipengaruhi perlambatan gravitasi $g$ (GLBB). $v_y = v_0 \\sin(\\theta) - g \\cdot t$.

Mengapa sudut 45° menghasilkan jangkauan terjauh? Karena rumus jarak total adalah $R = \\frac{v_0^2 \\sin(2\\theta)}{g}$. Nilai maksimum $\\sin(2\\theta) = 1$, yang tercapai ketika $2\\theta = 90^\\circ$ atau $\\theta = 45^\\circ$!

Coba buktikan sendiri di simulator Lab Kinematika Cakrawala untuk melihat lintasan parabolanya secara visual!`;
  }

  if (q.includes('react') || q.includes('state') || q.includes('props') || q.includes('kode') || q.includes('web')) {
    return `Menarik sekali membahas arsitektur web modern!

Dalam React dan frontend modern:
1. **State adalah Memori Komponen**: State menyimpan data lokal yang jika nilainya diperbarui, akan memicu pembaruan antarmuka secara otomatis (*re-render*).
2. **Props adalah Argumen Fungsi**: Props dikirim dari komponen induk ke komponen anak dan sifatnya mutlak *read-only* (tidak boleh diubah oleh penerima).
3. **Mengapa tidak boleh mutasi langsung?** React menggunakan perbandingan shallow (\`Object.is\`). Jika Anda menulis \`data.push(newItem)\`, referensi array di memori tetap sama, sehingga React tidak mendeteksi adanya perubahan! Selalu gunakan salinan baru: \`setData([...data, newItem])\`.

Apakah kamu sedang mengalami error tertentu di kode komponenmu? Silakan tempelkan kodenya di sini!`;
  }

  return `Pertanyaan yang bagus sekali! Sebagai tutor belajarmu di Cakrawala Akademi, mari kita telusuri konsep ini bersama.

Untuk memahami "${userQuestion}", pendekatan terbaik adalah membedah prinsip intinya terlebih dahulu:
1. **Identifikasi Komponen Utama**: Apa variabel input atau premis dasar dari masalah ini?
2. **Hukum / Logika yang Berlaku**: Mengapa fenomena atau kode tersebut bekerja demikian?
3. **Eksperimen Langsung**: Coba uji perubahan satu variabel saja di simulator atau editor kode kami untuk melihat dampaknya secara langsung.

Apakah ada bagian tertentu dari kursus atau modul yang ingin kamu bedah lebih dalam bersama saya?`;
}
