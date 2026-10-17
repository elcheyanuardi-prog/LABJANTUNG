# BioLab AI 3D — Laboratorium Biologi Virtual Berbasis AI (Sistem Peredaran Darah Manusia)

Aplikasi laboratorium biologi virtual 3D interaktif untuk siswa SMA Kelas XI yang memadukan eksplorasi anatomi jantung 3D prosedural menggunakan Three.js, simulasi hemodinamika darah sistemik & pulmonal, dua misi investigasi ilmiah berbasis data empiris, serta AI Tutor berpedagogi Sokratik berbasis Gemini API untuk mengasah nalar kritis dan literasi sains siswa.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Keputusan Utama & Penyesuaian Kebutuhan Pengguna**:
> - **Visualisasi Jantung 3D Prosedural Realistis**: Menggunakan arsitektur procedural mesh Three.js bertingkat (3–12 parts: miokardium ventrikel, atrium, aorta ascendens & arkus, vena kava superior/inferior, truncus pulmonalis, katup atrioventrikular & semilunar) dengan animasi denyut sistol-diastol dan partikel sirkulasi terpadu, tanpa ketergantungan file eksternal yang rentan 404.
> - **Dua Misi Investigasi Berpikir Kritis**:
>   1. *Misi 1 (Struktur vs Fungsi)*: Menguji disparitas ketebalan dinding miokardium ventrikel kiri (~12-15 mm) vs ventrikel kanan (~3-5 mm) dikaitkan dengan gradien tekanan afterload sirkulasi sistemik vs pulmonal.
>   2. *Misi 2 (Patologi Kardiovaskular)*: Menganalisis dataset tanda vital dan hemodinamik pasien (hipertensi esensial, stenosis katup aorta, dan insufisiensi mitral) untuk menyusun hipotesis ilmiah dan kesimpulan berbasis bukti.
> - **AI Tutor Berbasis Sokratik**: AI tidak memberikan jawaban instan, melainkan mengajukan pertanyaan pemantik berjenjang, menantang asumsi, dan meminta bukti observasi dari simulasi maupun tabel data pasien.

---

### 1. Overview & Core Concept

- **What It Does**: BioLab AI 3D menghadirkan laboratorium biologi virtual yang komprehensif bagi materi peredaran darah manusia kelas XI. Siswa dapat memanipulasi model jantung 3D (rotasi, zoom, pan, x-ray, dan bedah interior), mengamati hotspot anatomi beranotasi ilmiah, mengontrol simulasi aliran darah teroksigenasi (merah terang) dan terdeoksigenasi (biru tua), menjalankan dua stasiun investigasi berbasis data pasien realistis, berdialog dengan AI Socratic Tutor, serta menguji pemahaman dengan kuis berpikir kritis dan rubrik penilaian standar guru biologi.
- **Target Audience / Persona**: Siswa SMA Kelas XI (kurikulum Merdeka/K13) yang mempelajari sistem peredaran darah, serta guru Biologi yang membutuhkan media pembelajaran berbasis inquiry/STEM dengan instrumen asesmen autentik.
- **Key Value**: Mengubah materi abstrak biologi kardiovaskular menjadi pengalaman observasi visual-kinestetik nyata, membedakan secara tegas antara data empiris observasional vs ilustrasi model, serta melatih argumentasi ilmiah berbasis bukti (Claim-Evidence-Reasoning).

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Home & Laboratory Hub**: Pengenalan identitas BioLab AI 3D, overview capaian pembelajaran (CP/KD biologi), dan akses cepat ke 5 zona modul: Heart Explorer 3D, Blood Flow Simulator, Misi Investigasi 1 & 2, Socratic AI Tutor, dan Kuis & Rubrik Guru.
  2. **3D Heart Explorer & Hotspot Inspection**: Tampilan 3D interaktif viewport penuh dengan collapsible bottom dock. Siswa dapat memutar model 3D, memilih hotspot (atrium kanan/kiri, ventrikel kanan/kiri, katup trikuspid/bikuspid/semilunar, aorta, vena kava, arteri/vena pulmonalis), mengaktifkan mode transparan/potongan (cross-section), serta mengontrol laju denyut jantung (BPM).
  3. **Simulasi Sirkulasi Pulmonal & Sistemik**: Visualisasi interaktif partikel darah mengalir sesuai urutan biologis akurat:
     - Sirkulasi Pulmonal: Ventrikel Kanan → Katup Pulmonal → Arteri Pulmonalis → Paru-paru (pertukaran gas) → Vena Pulmonalis → Atrium Kiri.
     - Sirkulasi Sistemik: Atrium Kiri → Katup Bikuspid/Mitral → Ventrikel Kiri → Katup Aorta → Aorta → Seluruh Tubuh → Vena Kava → Atrium Kanan.
     - Penanda epistemologis jelas: label data simulasi matematis vs diagram model konseptual.
  4. **Stasiun Investigasi 1 (Struktur & Fungsi Ventrikel)**: Eksperimen virtual komparasi tekanan sistolik/diastolik aorta (120/80 mmHg) vs arteri pulmonalis (25/10 mmHg), ketebalan miokardium, resistensi vaskular sistemik, serta formulasi kesimpulan ilmiah.
  5. **Stasiun Investigasi 2 (Patologi Kardiovaskular & Vitals Pasien)**: Siswa menganalisis tabel data klinis 4 pasien (Tekanan Darah, Heart Rate, Cardiac Output, Ejection Fraction, Hasil Auskultasi Suara Jantung Murmur/Lub-Dub, dan Gejala Sesak). Siswa menyusun hipotesis dan menguji penalaran terhadap stenosis katup aorta vs hipertensi kronis vs regurgitasi katup.
  6. **Socratic AI Tutor**: Dialog tanya-jawab interaktif dengan AI Guru Biologi yang menuntun siswa menggunakan metode sokratik, menantang bias, menuntut bukti dari simulasi atau data pasien, tanpa memberikan "kunci jawaban" mentah.
  7. **Evaluasi Berpikir Kritis & Rubrik Guru**: 10 soal kuis penalaran tingkat tinggi (HOTS), dilengkapi matriks rubrik asesmen berpikir kritis (Interpretasi, Analisis, Evaluasi, Inferensi, Eksplanasi) yang siap dicetak/diekspor oleh pendidik.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Modern Scientific Research Laboratory — antarmuka clean, presisi laboratorium biologi futuristik, kontras tinggi, bebas dari elemen gimik atau dekorasi bising.
  - *Color Palette & Tokens*:
    - Background Utama: Deep Navy Slate (`#0B132B` / `#1C2541`) dengan aksen border tipis (`#3A506B`).
    - Luminous Accents: Cyan Ilmiah (`#48CAE4` / `#00B4D8`) untuk kontrol aktif dan highlight anatomi.
    - Darah Teroksigenasi: Crimson Red (`#E63946` / `#EF233C`).
    - Darah Terdeoksigenasi: Deep Cobalt Blue (`#1D3557` / `#3A86FF`).
    - Permukaan Kartu & Panel: Dark Navy Glass solid/opaque (`#111C38`) berbingkai halus 1px tanpa backdrop-blur yang membebani WebGL.
  - *Typography & Hierarchy*:
    - Display & Headers: `Plus Jakarta Sans` / `Outfit` (bersih, modern, tajam).
    - Body Text: `Plus Jakarta Sans` (keterbacaan prima pada mobile & desktop).
    - Metrik & Data Klinis: `JetBrains Mono` / `tabular-nums` untuk angka tekanan darah, laju aliran darah, dan ketebalan milimeter.
  - *Component Styling & Layout*:
    - Menerapkan arsitektur zero-pill discipline (tidak ada pill capsules bertumpuk atau badge dekoratif).
    - Header mematuhi kontrak 3-zona: Wordmark `BioLab AI 3D`, tautan navigasi 5 modul, dan tombol aksi "Mulai Eksplorasi".
    - 3D Viewport dilengkapi Collapsible Bottom Control Dock ergonomis yang tidak menutupi model 3D di tengah layar.

- **Interactive Feedback & Motion**:
  - Respon kontrol slider dan tombol $\le 150\text{ms}$.
  - Detak animasi 3D tersinkronisasi dengan indikator suara denyut Web Audio sintetis opsional (toggle Mute).
  - Indikator hotspot 3D interaktif yang memberikan highlight material seketika pada struktur jantung yang dipilih.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Procedural 3D Heart Model vs External GLB File**:
  - *Chosen Approach*: Membangun model jantung 3D prosedural komposit (8+ part geometris: ventrikel kiri/kanan, atrium kiri/kanan, aorta, arteri pulmonalis, vena kava superior/inferior, septum, dan katup) dengan material PBR Three.js dan shaders partikel denyut.
  - *Why*: Menjamin zero-404, performa 60 FPS instan tanpa latency loading CDN eksternal yang rawan error atau CORS, sekaligus menyediakan fallback dan slot yang siap menerima unggahan GLTF kustom jika guru/siswa memiliki model 3D sendiri.
  - *Alternatives Considered*: Mengunduh model GLB dari URL eksternal bebas lisensi (risiko gagal muat, CORS, dan ukuran puluhan megabyte yang memperlambat browser mobile).

- **Decision 2: Backend Gemini API Socratic Guidance via Server Proxy**:
  - *Chosen Approach*: Mengimplementasikan route Express `/api/gemini/socratic-tutor` dengan `@google/genai` SDK resmi dan model `gemini-3.8-flash`. Sistem prompt diatur ketat dengan pedagogi Sokratik: menyapa siswa ramah, memvalidasi ide awal, mengajukan 1 pertanyaan panduan bertahap, dan menolak membocorkan jawaban langsung.
  - *Why*: Memenuhi standard keamanan AI Studio (kunci API aman di backend, tidak pernah bocor ke client-side), performa respon instan, dan pedagogical guardrails yang kokoh.
  - *Alternatives Considered*: Client-side Gemini API (dilarang karena melanggar keamanan kunci API) atau rule-based bot statis (tidak adaptif terhadap penalaran siswa yang unik).

- **Decision 3: Pemisahan Jelas Status Epistemologis Data**:
  - *Chosen Approach*: Menyediakan label eksplisit di setiap panel: `[Model Konseptual]`, `[Data Simulasi Fisiologis]`, dan `[Data Klinis Pasien Terverifikasi]`.
  - *Why*: Menanamkan literasi sains SMA sesuai kurikulum bahwa simulasi komputer adalah abstraksi model matematika, bukan data empiris langsung tanpa batasan.

---

### 4. Technical Architecture & Data Strategy (Technical Reference)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BioLab AI 3D (React 19)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand · Modul Jantung · Sirkulasi · Misi 1 & 2 · Kuis)     │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 3D Heart Explorer & Simulator        │ Contextual Science Inspector         │
│  - Three.js WebGL Engine (useRef)    │  - Struktur & Fisiologi Organ        │
│  - Procedural Ventricles & Atria     │  - Urutan Sirkulasi Pulmonal/Sistemik │
│  - Dynamic Heart Valves & Pulsing    │  - Kontrol BPM, Transparansi, Mode   │
│  - Blood Particle Flow Pipeline      │  - Epistemological Provenance Badges │
├──────────────────────────────────────┴──────────────────────────────────────┤
│ Investigation Stations & Socratic AI Engine                                 │
│  - Misi 1: Komparasi Tekanan & Dinding Miokardium (Sistemik vs Pulmonal)    │
│  - Misi 2: Investigasi Patologi & Data Vitals (Hipertensi, Stenosis Katup)  │
│  - Socratic AI Chat Interface (Stateful session dialog bertahap)            │
│  - HOTS Quiz Engine (10 Soal Berpikir Kritis) & Teacher Assessment Rubric   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP POST /api/gemini/socratic-tutor
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Express Server (server.ts / Node.js)                                        │
│  - GoogleGenAI SDK (`@google/genai`) with model: "gemini-3.8-flash"         │
│  - Socratic Biological Pedagogy Prompt Injection                            │
│  - Safe Environment Access (`process.env.GEMINI_API_KEY`)                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Komponen Kunci & Manajemen State:
1. `src/components/Navigation.tsx`: Navigasi utama dengan 5 tab modul responsif.
2. `src/components/HeartViewer3D.tsx`: Kanvas Three.js terisolasi, orbit controls, material PBR RoomEnvironment, raycasting hotspot klik, animasi pulsasi sistol-diastol, serta partikel aliran darah.
3. `src/components/CirculationDiagram.tsx`: Visualisasi skema interaktif siklus peredaran darah besar & kecil dengan indikator saturasi $O_2$ dan $CO_2$.
4. `src/components/InvestigationMissionOne.tsx`: Lab virtual hubungan struktur miokardium ventrikel kiri vs kanan dengan gradien afterload sirkulasi sistemik.
5. `src/components/InvestigationMissionTwo.tsx`: Lab investigasi data 4 pasien penderita gangguan peredaran darah, perbandingan vitals terhadap batas normal, dan formulasi hipotesis medis terarah.
6. `src/components/SocraticAITutor.tsx`: Chat window interaktif dengan AI Guru Sokratik, tombol quick-prompt berpikir kritis, dan pelacakan riwayat penalaran siswa.
7. `src/components/QuizAndRubrics.tsx`: Bank soal HOTS dengan umpan balik formatif dan rubrik penilaian 5 dimensi berpikir kritis (Facione) untuk guru.
8. `src/components/ReferencesModal.tsx`: Daftar referensi ilmiah baku (Campbell Biology, Sherwood Human Physiology, Guyton and Hall Medical Physiology) dan panduan penggunaan lab.
9. `server.ts`: Backend Express dengan endpoint `/api/gemini/socratic-tutor` dan integrasi aman GoogleGenAI.

---

### Verification & Success Criteria

1. **Stabilitas Render 3D**: Scene Three.js berjalan lancar pada 60 FPS di desktop dan layar sentuh mobile tanpa WebGL leak atau memory crash saat beralih tab.
2. **Akurasi Ilmiah**: Urutan anatomi sirkulasi darah terbebas dari kekeliruan (arah aliran vena kava, atrium kanan, ventrikel kanan, arteri pulmonalis, vena pulmonalis, atrium kiri, ventrikel kiri, aorta).
3. **Dual Investigation Missions**: Siswa dapat menguji parameter, membaca data tabel pasien nyata, dan menyimpulkan hubungan struktur-fungsi serta patologi kardiovaskular.
4. **Respon Sokratik AI**: AI Tutor secara konsisten membimbing dengan pertanyaan pemantik dan menolak memberikan jawaban instan.
5. **Kompilasi Bersih**: `compile_applet` berhasil tanpa error TypeScript atau linting.
