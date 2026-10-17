import { HeartHotspot, CirculationStep, PatientCase, QuizQuestion, RubricDimension } from '../types/biology';

export const HEART_HOTSPOTS: HeartHotspot[] = [
  {
    id: 'atrium-kanan',
    nameId: 'Atrium Kanan',
    nameLatin: 'Atrium Dextrum',
    category: 'ruang',
    position: [-1.1, 0.6, 0.4],
    color: '#3A86FF',
    oxygenated: false,
    pressureRange: '2 – 6 mmHg',
    structureDescription: 'Ruang penerima berdinding tipis (2–3 mm) dengan nodus sinoatrial (SA node) sebagai pemacu alami jantung di dekat muara vena kava superior.',
    functionDescription: 'Menerima darah miskin oksigen (deoksigenasi) berkadar CO2 tinggi dari seluruh jaringan tubuh melalui vena kava superior dan inferior.',
    anatomicalPhysiologicalRelation: 'Dindingnya yang elastis dan bertekanan rendah sangat ideal sebagai penampung darah balik venosa tanpa membebani aliran balik kapiler perifer.',
    clinicalNote: 'Gangguan seperti fibrilasi atrium dapat menyebabkan turbulensi aliran dan risiko pembentukan bekuan darah (trombus).'
  },
  {
    id: 'ventrikel-kanan',
    nameId: 'Ventrikel Kanan',
    nameLatin: 'Ventriculus Dexter',
    category: 'ruang',
    position: [-0.6, -0.6, 0.8],
    color: '#3A86FF',
    oxygenated: false,
    pressureRange: 'Sistol: 20–25 mmHg | Diastol: 0–5 mmHg',
    structureDescription: 'Ruang pompa berotot dengan ketebalan miokardium 3–5 mm, berbentuk bulan sabit yang melingkupi sebagian ventrikel kiri.',
    functionDescription: 'Memompa darah deoksigenasi melalui katup semilunar pulmonal menuju arteri pulmonalis untuk aerasi di paru-paru.',
    anatomicalPhysiologicalRelation: 'Miokardiumnya relatif tipis karena resistensi vaskular pulmonal hanya sekitar 1/6 hingga 1/10 dari resistensi pembuluh darah sistemik tubuh.',
    clinicalNote: 'Hipertensi pulmonal kronis dapat memicu hipertrofi ventrikel kanan yang berujung pada gagal jantung kanan (Cor Pulmonale).'
  },
  {
    id: 'atrium-kiri',
    nameId: 'Atrium Kiri',
    nameLatin: 'Atrium Sinistrum',
    category: 'ruang',
    position: [0.9, 0.7, -0.4],
    color: '#EF233C',
    oxygenated: true,
    pressureRange: '4 – 8 mmHg',
    structureDescription: 'Ruang posterior atas dengan 4 muara vena pulmonalis independen (2 dari paru kanan, 2 dari paru kiri).',
    functionDescription: 'Menerima darah segar kaya oksigen (saturasi O2 ~98%) yang baru selesai menjalani difusi gas di kapiler alveolus paru-paru.',
    anatomicalPhysiologicalRelation: 'Permukaan dalam atrium kiri sangat halus untuk meminimalkan hambatan gesekan saat menyalurkan darah ke ventrikel kiri.',
    clinicalNote: 'Peningkatan tekanan atrium kiri akibat stenosis mitral dapat memicu kongesti pembuluh darah paru dan edema paru akut.'
  },
  {
    id: 'ventrikel-kiri',
    nameId: 'Ventrikel Kiri',
    nameLatin: 'Ventriculus Sinister',
    category: 'ruang',
    position: [0.7, -0.7, 0.5],
    color: '#EF233C',
    oxygenated: true,
    pressureRange: 'Sistol: 100–120 mmHg | Diastol: 60–80 mmHg',
    structureDescription: 'Ruang pompa berbentuk kerucut dengan dinding miokardium tertebal (10–15 mm), sekitar 3 kali lebih tebal dibanding ventrikel kanan.',
    functionDescription: 'Memompa darah teroksigenasi dengan tekanan hidrostatik tinggi ke seluruh sistem arteri tubuh melalui katup aorta ke aorta.',
    anatomicalPhysiologicalRelation: 'Ketebalan otot yang luar biasa menghasilkan tekanan ejeksi tinggi untuk mengatasi hambatan resistensi vaskular sistemik (TPR) dari otak hingga ujung jari kaki.',
    clinicalNote: 'Beban kerja berlebih jangka panjang akibat hipertensi kronis memicu hipertrofi konsentrik ventrikel kiri (LVH).'
  },
  {
    id: 'katup-trikuspid',
    nameId: 'Katup Trikuspidalis',
    nameLatin: 'Valvula Tricuspidalis',
    category: 'katup',
    position: [-0.7, 0.0, 0.6],
    color: '#48CAE4',
    oxygenated: false,
    pressureRange: 'Gradien: < 3 mmHg',
    structureDescription: 'Katup atrioventrikular kanan yang terdiri atas 3 daun katup fibrosa (anterior, posterior, septal) diikat oleh korda tendinea ke muskulus papilaris.',
    functionDescription: 'Mencegah aliran balik darah dari ventrikel kanan ke atrium kanan saat fase sistol ventrikel.',
    anatomicalPhysiologicalRelation: 'Korda tendinea menahan daun katup agar tidak mengalami eversi (terbalik masuk) ke dalam atrium saat tekanan intraventrikular melonjak.',
    clinicalNote: 'Insufisiensi trikuspid menyebabkan darah menyembur balik ke atrium kanan saat sistol, menghasilkan gelombang vena jugularis yang membesar.'
  },
  {
    id: 'katup-mitral',
    nameId: 'Katup Bikuspidalis (Mitral)',
    nameLatin: 'Valvula Bicuspidalis / Mitralis',
    category: 'katup',
    position: [0.4, -0.1, 0.3],
    color: '#48CAE4',
    oxygenated: true,
    pressureRange: 'Gradien: < 4 mmHg',
    structureDescription: 'Katup berdaun ganda (anterior dan posterior) dengan cincin anulus fibrosa kokoh dan korda tendinea berdensitas tinggi.',
    functionDescription: 'Menutup rapat saat sistol ventrikel kiri agar seluruh volume darah terdorong maju ke aorta dan tidak bocor kembali ke atrium kiri.',
    anatomicalPhysiologicalRelation: 'Dua daun katup yang tebal mampu menahan lonjakan gradien tekanan sistolik ventrikel kiri hingga 120 mmHg tanpa rembesan.',
    clinicalNote: 'Regurgitasi mitral menimbulkan bising pansistolik dan mengurangi volume sekuncup (stroke volume) yang mencapai aorta.'
  },
  {
    id: 'katup-aorta',
    nameId: 'Katup Semilunar Aorta',
    nameLatin: 'Valvula Semilunaris Aortae',
    category: 'katup',
    position: [0.1, 0.3, 0.5],
    color: '#48CAE4',
    oxygenated: true,
    pressureRange: 'Membuka saat tekanan LV > 80 mmHg',
    structureDescription: 'Tiga daun katup berbentuk kantong setengah bulan (semilunar) tanpa korda tendinea di muara orifisium aorta.',
    functionDescription: 'Mencegah darah yang telah masuk ke aorta mengalir kembali ke ventrikel kiri saat fase relaksasi diastol.',
    anatomicalPhysiologicalRelation: 'Saat diastol, tekanan balik di pangkal aorta mengisi kantong semilunar sehingga ketiga tepi daun katup saling mengunci rapat secara pasif.',
    clinicalNote: 'Stenosis aorta (penyempitan katup) memaksa ventrikel kiri menghasilkan tekanan sistolik ekstrem (>180 mmHg) untuk memompa darah.'
  },
  {
    id: 'katup-pulmonal',
    nameId: 'Katup Semilunar Pulmonal',
    nameLatin: 'Valvula Semilunaris Trunci Pulmonalis',
    category: 'katup',
    position: [-0.2, 0.5, 0.7],
    color: '#48CAE4',
    oxygenated: false,
    pressureRange: 'Membuka saat tekanan RV > 10 mmHg',
    structureDescription: 'Tiga daun semilunar tipis elastis di pintu masuk arteri pulmonalis utama.',
    functionDescription: 'Mencegah aliran balik darah dari trunkus pulmonalis ke ventrikel kanan selama diastol.',
    anatomicalPhysiologicalRelation: 'Merespons pembukaan pada ambang tekanan rendah (sekitar 10 mmHg) sesuai dengan sirkuit pulmonal yang bertekanan rendah.',
    clinicalNote: 'Regurgitasi pulmonal jarang terjadi tetapi dapat memperberat beban volume pada ventrikel kanan.'
  },
  {
    id: 'aorta',
    nameId: 'Aorta Ascendens & Arkus',
    nameLatin: 'Aorta Ascendens et Arcus Aortae',
    category: 'pembuluh',
    position: [0.1, 1.4, 0.1],
    color: '#EF233C',
    oxygenated: true,
    pressureRange: '120 / 80 mmHg',
    structureDescription: 'Arteri terbesar berdiameter ~2.5 cm dengan lapisan tunika media kaya serat elastin (efek Windkessel elastis).',
    functionDescription: 'Mendistribusikan darah teroksigenasi ke kepala, ekstremitas atas via cabang arkus (brakiosefalika, karotis, subklavia), dan seluruh tubuh.',
    anatomicalPhysiologicalRelation: 'Dinding elastisnya mengembang saat sistol untuk meredam lonjakan tekanan dan recoil (kembali memampat) saat diastol untuk menjaga aliran darah tetap kontinu.',
    clinicalNote: 'Aterosklerosis dan hilangnya elastisitas aorta pada lansia menyebabkan peningkatan tekanan darah sistolik terisolasi.'
  },
  {
    id: 'vena-kava',
    nameId: 'Vena Kava Superior & Inferior',
    nameLatin: 'Vena Cava Superior et Inferior',
    category: 'pembuluh',
    position: [-1.4, 0.8, -0.2],
    color: '#3A86FF',
    oxygenated: false,
    pressureRange: 'Central Venous Pressure: 2 – 8 mmHg',
    structureDescription: 'Pembuluh vena berkapasitansi besar dengan tunika adventisia tebal dan lumen lebar.',
    functionDescription: 'Mengumpulkan darah balik deoksigenasi dari tubuh bagian atas (kepala, leher, lengan) dan bawah (abdomen, tungkai) menuju atrium kanan.',
    anatomicalPhysiologicalRelation: 'Diameter lumen yang lebar meminimalkan hambatan hidrolik agar darah bertekanan rendah dapat kembali lancar ke jantung dibantu pompa otot rangka.',
    clinicalNote: 'Peningkatan tekanan vena kava dapat diamati secara klinis melalui pembengkakan vena jugularis di leher.'
  },
  {
    id: 'arteri-pulmonalis',
    nameId: 'Truncus & Arteri Pulmonalis',
    nameLatin: 'Truncus Pulmonalis',
    category: 'pembuluh',
    position: [-0.3, 1.2, 0.4],
    color: '#3A86FF',
    oxygenated: false,
    pressureRange: '25 / 10 mmHg (Rata-rata 15 mmHg)',
    structureDescription: 'Pembuluh arteri berotot pendek yang bercabang menjadi arteri pulmonalis dekstra dan sinistra menuju paru-paru.',
    functionDescription: 'Membawa darah deoksigenasi dari ventrikel kanan ke kapiler paru-paru untuk pertukaran gas.',
    anatomicalPhysiologicalRelation: 'Dindingnya jauh lebih tipis dan lebih distensibel dibanding aorta, memfasilitasi aliran darah bertekanan rendah agar cairan tidak merembes ke alveolus.',
    clinicalNote: 'Emboli paru (sumbatan bekuan darah di arteri pulmonalis) merupakan kondisi darurat medis yang dapat menghentikan sirkulasi.'
  },
  {
    id: 'vena-pulmonalis',
    nameId: 'Vena Pulmonalis',
    nameLatin: 'Venae Pulmonales',
    category: 'pembuluh',
    position: [1.2, 0.5, -0.6],
    color: '#EF233C',
    oxygenated: true,
    pressureRange: '5 – 10 mmHg',
    structureDescription: 'Empat pembuluh vena pendek yang mengalirkan darah langsung dari jaringan paru ke atrium kiri.',
    functionDescription: 'Mengalirkan darah yang telah diisi ulang oksigen (O2 murni ~98%) menuju ruang jantung kiri.',
    anatomicalPhysiologicalRelation: 'Tidak memiliki katup internal karena aliran darah dibantu oleh gradien tekanan kontinu dari mikrosirkulasi paru menuju atrium kiri.',
    clinicalNote: 'Muara vena pulmonalis sering menjadi titik asal pemicu aritmia fibrilasi atrium.'
  }
];

export const CIRCULATION_STEPS: CirculationStep[] = [
  // Siklus Pulmonal (1 - 5)
  {
    step: 1,
    circuit: 'pulmonal',
    title: 'Pengumpulan Darah Balik Tubuh',
    from: 'Vena Kava Superior & Inferior',
    through: 'Muara Vena Cava',
    to: 'Atrium Kanan',
    gasStatus: 'Deoksigenasi (Kaya CO2, Miskin O2)',
    o2Saturation: 75,
    co2Pressure: 45,
    pressureAvg: 4,
    description: 'Darah dari seluruh jaringan tubuh yang telah melepaskan O2 dan mengikat CO2 sisa metabolisme seluler kembali menuju ruang atrium kanan.'
  },
  {
    step: 2,
    circuit: 'pulmonal',
    title: 'Pengisian Ventrikel Kanan',
    from: 'Atrium Kanan',
    through: 'Katup Trikuspidalis (Membuka)',
    to: 'Ventrikel Kanan',
    gasStatus: 'Deoksigenasi',
    o2Saturation: 75,
    co2Pressure: 45,
    pressureAvg: 5,
    description: 'Atrium berkontraksi ringan (atrial kick) mendorong sisa darah melewati katup trikuspidalis yang membuka ke dalam ventrikel kanan saat diastol.'
  },
  {
    step: 3,
    circuit: 'pulmonal',
    title: 'Ejeksi Sistolik ke Paru-paru',
    from: 'Ventrikel Kanan',
    through: 'Katup Semilunar Pulmonal (Membuka)',
    to: 'Truncus & Arteri Pulmonalis',
    gasStatus: 'Deoksigenasi',
    o2Saturation: 75,
    co2Pressure: 45,
    pressureAvg: 22,
    description: 'Ventrikel kanan berkontraksi kuat (sistol). Katup trikuspid menutup (menghasilkan bunyi jantung I / Lub), katup pulmonal terbuka, darah dipompa ke paru-paru.'
  },
  {
    step: 4,
    circuit: 'pulmonal',
    title: 'Hematosis (Pertukaran Gas di Alveolus)',
    from: 'Arteri Pulmonalis',
    through: 'Anyaman Kapiler Paru-paru',
    to: 'Vena Pulmonalis',
    gasStatus: 'Transisi Oksigenasi (Difusi Gas)',
    o2Saturation: 98,
    co2Pressure: 40,
    pressureAvg: 12,
    description: 'Di membran alveolar-kapiler, CO2 berdifusi keluar darah menuju rongga alveolus untuk diekspirasi, dan O2 dari udara inspirasi diikat oleh hemoglobin eritrosit.'
  },
  {
    step: 5,
    circuit: 'pulmonal',
    title: 'Darah Segar Menuju Jantung Kiri',
    from: 'Kapiler Paru-paru',
    through: '4 Muara Vena Pulmonalis',
    to: 'Atrium Kiri',
    gasStatus: 'Teroksigenasi (Kaya O2, Merah Terang)',
    o2Saturation: 98,
    co2Pressure: 40,
    pressureAvg: 7,
    description: 'Empat vena pulmonalis mengalirkan darah yang telah penuh teroksigenasi kembali ke atrium kiri. Ini menyelesaikan siklus sirkulasi pulmonal.'
  },

  // Siklus Sistemik (6 - 10)
  {
    step: 6,
    circuit: 'sistemik',
    title: 'Pengisian Ventrikel Kiri',
    from: 'Atrium Kiri',
    through: 'Katup Bikuspidalis / Mitral (Membuka)',
    to: 'Ventrikel Kiri',
    gasStatus: 'Teroksigenasi',
    o2Saturation: 98,
    co2Pressure: 40,
    pressureAvg: 8,
    description: 'Darah beroksigen mengalir melintasi katup mitral yang terbuka menuju ventrikel kiri. Dinding tebal ventrikel kiri berelaksasi menampung volume akhir diastol (~120 ml).'
  },
  {
    step: 7,
    circuit: 'sistemik',
    title: 'Kontraksi Isovolumetrik & Ejeksi Aorta',
    from: 'Ventrikel Kiri',
    through: 'Katup Semilunar Aorta (Membuka)',
    to: 'Aorta Ascendens',
    gasStatus: 'Teroksigenasi Tekanan Tinggi',
    o2Saturation: 98,
    co2Pressure: 40,
    pressureAvg: 118,
    description: 'Miokardium ventrikel kiri berkontraksi masif. Katup mitral menutup rapat (bunyi Lub), tekanan melonjak hingga 120 mmHg membuka katup aorta dan menyemburkan ~70 ml darah.'
  },
  {
    step: 8,
    circuit: 'sistemik',
    title: 'Distribusi Sistemik ke Organ Vital',
    from: 'Aorta Ascendens & Arkus',
    through: 'Arteri Karotis, Subklavia, Celiac, Renalis',
    to: 'Otak, Ginjal, Saluran Cerna, Ekstremitas',
    gasStatus: 'Teroksigenasi Terdistribusi',
    o2Saturation: 97,
    co2Pressure: 40,
    pressureAvg: 95,
    description: 'Arteri elastis bercabang menjadi arteriol muskuler yang mengatur tahanan pembuluh darah perifer dan mendistribusikan nutrisi serta oksigen ke miliaran sel tubuh.'
  },
  {
    step: 9,
    circuit: 'sistemik',
    title: 'Pertukaran Nutrisi & Gas Jaringan',
    from: 'Arteriol Sistemik',
    through: 'Jaringan Kapiler Seluler Tubuh',
    to: 'Venula Sistemik',
    gasStatus: 'Transisi Pelepasan O2 ke Jaringan',
    o2Saturation: 75,
    co2Pressure: 46,
    pressureAvg: 20,
    description: 'Hemoglobin melepaskan O2 untuk respirasi seluler mitokondria, dan darah mengangkut CO2 serta sisa amonia/asam laktat dari jaringan ke dalam venula.'
  },
  {
    step: 10,
    circuit: 'sistemik',
    title: 'Aliran Balik Venosa ke Atrium Kanan',
    from: 'Venula & Vena Besar',
    through: 'Vena Cava Superior & Inferior',
    to: 'Atrium Kanan (Siklus Berulang)',
    gasStatus: 'Deoksigenasi',
    o2Saturation: 75,
    co2Pressure: 45,
    pressureAvg: 4,
    description: 'Katup vena searah dan pompa otot rangka mengembalikan darah miskin O2 ke atrium kanan. Sirkulasi sistemik selesai dan siklus peredaran berulang tanpa henti.'
  }
];

export const PATIENT_CASES: PatientCase[] = [
  {
    id: 'case-1',
    code: 'PASIEN-A',
    name: 'Bapak Hartono',
    age: 56,
    gender: 'Laki-laki',
    chiefComplaint: 'Sering sakit kepala berdenyut di bagian tengkuk, telinga berdenging, dan mudah lelah saat naik tangga selama 6 bulan terakhir.',
    vitals: {
      bloodPressure: '168/104 mmHg',
      systolic: 168,
      diastolic: 104,
      heartRate: 84,
      cardiacOutput: 5.2,
      ejectionFraction: 62,
      respiratoryRate: 18,
      oxygenSaturation: 98
    },
    auscultation: {
      sound: 'Normal (Lub-Dub)',
      description: 'Bunyi jantung I dan II reguler, suara penutupan katup aorta (A2) terdengar mengeras/akcentuasi akibat tekanan diastolik tinggi, tanpa desis murmur.'
    },
    keySymptoms: [
      'Hipertensi arterial kronis (Stage 2)',
      'Tahanan perifer vaskular (TPR) meningkat tajam',
      'Penebalan dinding ventrikel kiri (hipertrofi kompensatori) pada USG kardiologi',
      'Tidak ada kelainan bentuk daun katup jantung'
    ],
    anatomicalImpact: 'Miokardium ventrikel kiri mengalami penambahan massa otot (hipertrofi konsentrik) untuk mengatasi beban afterload tinggi di aorta.',
    scientificHypothesisPrompt: 'Apakah gejala pasien ini diakibatkan oleh kebocoran katup atau peningkatan resistensi pembuluh darah sistemik?',
    correctCondition: 'Hipertensi Primer Kronis dengan Hipertrofi Ventrikel Kiri (LVH)',
    evidencePoints: [
      'Tekanan darah 168/104 mmHg jauh di atas batas normal (<120/80 mmHg).',
      'Tidak ada murmur katup, menandakan daun katup trikuspid/mitral/aorta membuka dan menutup rapat.',
      'Ejection fraction 62% masih terjaga karena otot ventrikel menebal sebagai respon adaptif terhadap afterload tinggi.'
    ]
  },
  {
    id: 'case-2',
    code: 'PASIEN-B',
    name: 'Ibu Ratna',
    age: 64,
    gender: 'Perempuan',
    chiefComplaint: 'Sesak napas progresif saat beraktivitas ringan, sering pusing berkunang-kunang, dan pernah pingsan mendadak (sinkop) saat berdiri terburu-buru.',
    vitals: {
      bloodPressure: '98/72 mmHg',
      systolic: 98,
      diastolic: 72,
      heartRate: 92,
      cardiacOutput: 3.6,
      ejectionFraction: 44,
      respiratoryRate: 24,
      oxygenSaturation: 93
    },
    auscultation: {
      sound: 'Murmur Sistolik Ejeksi',
      description: 'Terdengar bising sistolik keras berbentuk crescendo-decrescendo (desir kasar) di sela iga ke-2 kanan sternum yang menjalar ke arteri karotis leher.'
    },
    keySymptoms: [
      'Tekanan darah sistolik rendah (< 100 mmHg) akibat hambatan keluaran darah dari jantung',
      'Bising ejeksi sistolik kasar pada katup aorta',
      'Curah jantung (Cardiac Output) menurun drastis menjadi 3.6 L/menit',
      'Sesak napas saat beraktivitas (dyspnea on exertion)'
    ],
    anatomicalImpact: 'Daun katup semilunar aorta mengalami kalsifikasi dan penyempitan orifisium (orifisium < 1.0 cm² dibanding normal 3.0-4.0 cm²). Darah terhambat disemburkan ke aorta.',
    scientificHypothesisPrompt: 'Berdasarkan murmur sistolik di orifisium aorta dan penurunan curah jantung, apa kelainan anatomis katup yang dialami pasien?',
    correctCondition: 'Stenosis Katup Aorta Berat (Aortic Valve Stenosis)',
    evidencePoints: [
      'Murmur sistolik ejeksi kasar di area aorta membuktikan adanya turbulensi akibat katup semilunar aorta menyempit kaku.',
      'Tekanan darah rendah (98/72 mmHg) dan Cardiac Output rendah (3.6 L/menit) menunjukkan darah tidak leluasa keluar dari ventrikel kiri.',
      'Ventrikel kiri mengalami peningkatan tekanan intraventrikular sistolik ekstrem untuk memaksakan darah keluar melintasi katup sempit.'
    ]
  },
  {
    id: 'case-3',
    code: 'PASIEN-C',
    name: 'Pak Doni',
    age: 48,
    gender: 'Laki-laki',
    chiefComplaint: 'Sering batuk di malam hari saat berbaring telentang, sesak napas yang membaik jika tidur dengan 3 bantal, dan jantung terasa berdebar kencang.',
    vitals: {
      bloodPressure: '122/76 mmHg',
      systolic: 122,
      diastolic: 76,
      heartRate: 102,
      cardiacOutput: 4.1,
      ejectionFraction: 48,
      respiratoryRate: 22,
      oxygenSaturation: 94
    },
    auscultation: {
      sound: 'Murmur Pansistolik',
      description: 'Bising pansistolik meniup berfrekuensi tinggi di apeks jantung (sela iga 5 kiri) yang menjalar ke ketiak (aksila), menutupi bunyi jantung I.'
    },
    keySymptoms: [
      'Ortopnea (sesak napas posisi berbaring) akibat darah menumpuk ke pembuluh paru',
      'Murmur pansistolik meniup di apeks jantung',
      'Darah terdorong mundur dari ventrikel kiri ke atrium kiri saat sistol',
      'Pembesaran ruang atrium kiri (dilatasi atrium kiri)'
    ],
    anatomicalImpact: 'Daun katup mitral gagal menutup rapat akibat robekan korda tendinea atau disfungsi muskulus papilaris, menyebabkan darah bocor balik (regurgitasi).',
    scientificHypothesisPrompt: 'Mengapa kebocoran pada katup mitral kiri dapat menimbulkan gejala sesak napas dan batuk pada paru-paru pasien?',
    correctCondition: 'Regurgitasi / Insufisiensi Katup Mitral (Mitral Regurgitation)',
    evidencePoints: [
      'Murmur pansistolik meniup di apeks jantung adalah tanda patognomonik aliran balik turbulen dari ventrikel kiri ke atrium kiri.',
      'Aliran darah balik menaikkan tekanan vena pulmonalis dan kapiler paru, memicu kongesti cairan di paru-paru (batuk malam hari dan ortopnea).',
      'Katup aorta normal membuka, namun sebagian fraksi darah terbuang balik ke belakang sehingga efisiensi pompa jantung menurun.'
    ]
  },
  {
    id: 'case-4',
    code: 'KONTROL-ATLET',
    name: 'Dimas (Atlet Lari Maraton)',
    age: 22,
    gender: 'Laki-laki',
    chiefComplaint: 'Pemeriksaan kesehatan rutin pelatnas. Tidak ada keluhan sama sekali, stamina sangat prima, mampu berlari 20 km tanpa kendala.',
    vitals: {
      bloodPressure: '114/72 mmHg',
      systolic: 114,
      diastolic: 72,
      heartRate: 48,
      cardiacOutput: 5.4,
      ejectionFraction: 68,
      respiratoryRate: 14,
      oxygenSaturation: 99
    },
    auscultation: {
      sound: 'Normal (Lub-Dub)',
      description: 'Bunyi jantung Lub-Dub bersih, nada teratur, bradikardia fisiologis atletik, tidak ada suara murmur atau bising patologis.'
    },
    keySymptoms: [
      'Denyut jantung istirahat rendah (48 bpm - bradikardia atletis fisiologis)',
      'Volume sekuncup (Stroke Volume) sangat tinggi (~112 ml per denyut)',
      'Kapasitas aerobik dan oksigenasi optimal (Sat O2 99%)',
      'Fungsi katup dan elastisitas vaskular sempurna'
    ],
    anatomicalImpact: 'Hipertrofi ventrikel kiri fisiologis eksentrik: rongga ventrikel membesar secara proporsional dengan kontraktilitas miokardium yang sangat efisien.',
    scientificHypothesisPrompt: 'Mengapa atlet maraton memiliki denyut nadi istirahat hanya 48 bpm namun curah jantungnya tetap normal/tinggi?',
    correctCondition: 'Jantung Atlet Sehat (Athletic Heart - Bradikardia Fisiologis)',
    evidencePoints: [
      'Curah Jantung = Heart Rate × Stroke Volume. Karena Stroke Volume tinggi (112 ml), jantung cukup berdenyut 48 kali untuk menghasilkan 5.4 L/menit.',
      'Tekanan darah normal dan saturasi 99% membuktikan efisiensi sistem kardiorespirasi yang luar biasa.',
      'Kondisi ini merupakan adaptasi fisiologis positif, bukan penyakit atau kerusakan katup.'
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Berdasarkan pengamatan anatomi 3D, mengapa miokardium ventrikel kiri berukuran 3 kali lebih tebal (10–15 mm) dibandingkan miokardium ventrikel kanan (3–5 mm)?',
    options: [
      'Ventrikel kiri menampung volume darah yang 3 kali lebih banyak daripada ventrikel kanan.',
      'Ventrikel kiri harus memompa darah dengan tekanan tinggi melawan resistensi sirkulasi sistemik ke seluruh tubuh.',
      'Ventrikel kiri bekerja saat fase diastol sedangkan ventrikel kanan bekerja saat fase sistol.',
      'Ventrikel kiri memiliki banyak katup pembatas yang membutuhkan bantalan otot tebal.'
    ],
    correctIndex: 1,
    explanation: 'Kedua ventrikel memompa volume darah yang sama (~70 ml per denyut), namun ventrikel kiri harus menghasilkan tekanan sistolik ~120 mmHg melawan resistensi seluruh tubuh, sedangkan ventrikel kanan hanya menghasilkan tekanan ~25 mmHg untuk sirkulasi paru-paru berjarak dekat.',
    thinkingDimension: 'Analisis'
  },
  {
    id: 2,
    question: 'Seorang pasien mengalami stenosis (penyempitan kaku) pada katup semilunar aorta. Manakah kompensasi fisiologis yang paling mungkin terjadi pada otot jantung pasien tersebut dalam jangka panjang?',
    options: [
      'Atrium kanan mengalami atrofi (penyusutan ukuran otot).',
      'Ventrikel kiri mengalami hipertrofi konsentrik (penebalan otot dinding) untuk mengatasi hambatan keluaran darah.',
      'Ventrikel kanan berhenti memompa darah ke paru-paru.',
      'Katup trikuspidalis akan bertransformasi menjadi katup bikuspidalis.'
    ],
    correctIndex: 1,
    explanation: 'Stenosis aorta meningkatkan afterload ventrikel kiri secara drastis. Hukum Laplace menyatakan otot ventrikel akan menebal (hipertrofi) untuk mengurangi stres dinding dan menghasilkan tekanan ejeksi lebih tinggi.',
    thinkingDimension: 'Inferensi'
  },
  {
    id: 3,
    question: 'Urutan aliran eritrosit yang benar secara anatomis dari saat masuk ke jantung hingga mencapai alveolus paru-paru adalah...',
    options: [
      'Vena kava → Ventrikel kanan → Atrium kanan → Arteri pulmonalis → Kapiler alveolus',
      'Vena kava → Atrium kanan → Katup trikuspidalis → Ventrikel kanan → Katup pulmonal → Arteri pulmonalis → Kapiler alveolus',
      'Vena pulmonalis → Atrium kiri → Katup mitral → Ventrikel kiri → Aorta → Kapiler alveolus',
      'Vena kava → Atrium kanan → Katup mitral → Ventrikel kiri → Arteri pulmonalis → Kapiler alveolus'
    ],
    correctIndex: 1,
    explanation: 'Darah deoksigenasi dari vena kava masuk ke atrium kanan, melewati katup trikuspidalis menuju ventrikel kanan, lalu dipompa melintasi katup semilunar pulmonal ke truncus/arteri pulmonalis menuju alveolus.',
    thinkingDimension: 'Eksplanasi'
  },
  {
    id: 4,
    question: 'Pada pemeriksaan auskultasi stetoskop, suara jantung pertama ("LUB") terdengar tepat pada awal fase sistol. Suara ini ditimbulkan oleh mekanisme fisik...',
    options: [
      'Benturan darah ke dinding pembuluh aorta saat disemburkan.',
      'Getaran penutupan mendadak katup atrioventrikular (trikuspidalis dan mitral) akibat lonjakan tekanan intraventrikular.',
      'Penutupan katup semilunar aorta dan pulmonal saat relaksasi diastol.',
      'Gesekan antara lapisan perikardium parietal dan viseral.'
    ],
    correctIndex: 1,
    explanation: 'Bunyi Lub (S1) dihasilkan dari penutupan katup AV (mitral dan trikuspid) saat ventrikel mulai berkontraksi isovolumetrik. Bunyi Dub (S2) dihasilkan dari penutupan katup semilunar (aorta dan pulmonal) saat diastol dimulai.',
    thinkingDimension: 'Interpretasi'
  },
  {
    id: 5,
    question: 'Mengapa arteri pulmonalis memiliki kadar gas oksigen yang rendah dan CO2 tinggi, berbeda dengan arteri-arteri sistemik seperti arteri renalis atau brakialis?',
    options: [
      'Arteri pulmonalis telah mendistribusikan oksigennya ke jaringan otot jantung sebelum keluar.',
      'Definisi arteri adalah pembuluh yang mengalir meninggalkan jantung, bukan pembuluh yang selalu kaya oksigen.',
      'Arteri pulmonalis mengalami difusi terbalik di dalam miokardium.',
      'Arteri pulmonalis tidak memiliki lapisan endotel pelindung.'
    ],
    correctIndex: 1,
    explanation: 'Secara anatomis, arteri didefinisikan sebagai pembuluh darah yang membawa darah KELUAR dari jantung. Arteri pulmonalis membawa darah keluar dari ventrikel kanan menuju paru-paru sebelum darah tersebut sempat menyerap oksigen baru.',
    thinkingDimension: 'Evaluasi'
  },
  {
    id: 6,
    question: 'Jika korda tendinea pada katup mitral seorang pasien mengalami ruptur (putus) mendadak, apakah akibat hemodinamik langsung yang akan terjadi saat sistol ventrikel kiri?',
    options: [
      'Daun katup mitral akan terdorong balik (eversi) ke atrium kiri sehingga darah menyembur balik ke atrium kiri.',
      'Katup aorta akan macet dan tidak dapat terbuka.',
      'Darah akan mengalir masuk ke ventrikel kanan melalui septum interventrikular.',
      'Tekanan darah di aorta akan melonjak dua kali lipat.'
    ],
    correctIndex: 0,
    explanation: 'Korda tendinea berfungsi seperti tali parasut yang menahan daun katup AV agar tidak terbalik ke atrium saat ventrikel berkontraksi. Jika putus, terjadi insufisiensi mitral masif (regurgitasi akut) ke atrium kiri.',
    thinkingDimension: 'Inferensi'
  },
  {
    id: 7,
    question: 'Perhatikan data tanda vital Pasien A: Tekanan Darah 168/104 mmHg, Heart Rate 84 bpm, Auskultasi Lub-Dub normal tanpa bising. Kesimpulan ilmiah yang paling tepat berdasarkan bukti adalah...',
    options: [
      'Pasien mengalami kebocoran katup aorta yang parah.',
      'Pasien mengalami peningkatan resistensi pembuluh darah sistemik kronis dengan fungsi katup yang masih intak.',
      'Pasien mengalami gagal napas akibat penumpukan cairan di paru-paru.',
      'Pasien memiliki efisiensi jantung seperti atlet maraton.'
    ],
    correctIndex: 1,
    explanation: 'Tekanan darah 168/104 mmHg menunjukkan hipertensi berat (resistensi perifer tinggi). Tidak adanya murmur menegaskan daun katup bekerja normal dan tidak bocor/menyempit.',
    thinkingDimension: 'Evaluasi'
  },
  {
    id: 8,
    question: 'Apa perbedaan mendasar antara data yang diperoleh dari "Simulasi Komputer" dengan data dari "Observasi Klinis Empiris" pada laboratorium BioLab AI 3D?',
    options: [
      'Simulasi komputer selalu 100% identik dengan kondisi fisik manusia nyata tanpa penyederhanaan.',
      'Simulasi matematika merupakan pemodelan matematis berbasis rumus fisika teridealisasi, sedangkan observasi klinis adalah fakta biologis terukur dari subjek nyata.',
      'Observasi klinis tidak memerlukan pembuktian ilmiah.',
      'Data simulasi tidak memiliki nilai edukatif sama sekali.'
    ],
    correctIndex: 1,
    explanation: 'Dalam literasi sains kurikulum Biologi SMA, siswa harus memahami bahwa simulasi adalah abstraksi model dengan asumsi tertentu, sedangkan data klinis empiris adalah fakta terukur yang mencerminkan variabilitas biologis sesungguhnya.',
    thinkingDimension: 'Evaluasi'
  },
  {
    id: 9,
    question: 'Arteri aorta memiliki proporsi serat elastin (tunica media elastica) yang sangat tinggi. Peran fisik utama elastisitas ini dalam sirkulasi darah sistemik adalah...',
    options: [
      'Menyaring racun dan kolesterol sebelum mencapai otak.',
      'Menyerap gelombang tekanan sistolik dan recoil saat diastol sehingga aliran darah perifer tetap kontinu (efek Windkessel).',
      'Mencegah leukosit menempel pada dinding pembuluh darah.',
      'Mempercepat pelepasan oksigen dari eritrosit secara spontan.'
    ],
    correctIndex: 1,
    explanation: 'Efek Windkessel: Dinding aorta mengembang menampung energi potensial saat ejeksi sistolik, lalu saat diastol dinding aorta berkontraksi balik (recoil elastis) mendorong darah terus maju meski ventrikel sedang berelaksasi.',
    thinkingDimension: 'Analisis'
  },
  {
    id: 10,
    question: 'Seorang atlet memiliki laju denyut nadi istirahat hanya 48 bpm (bradikardia), namun memiliki curah jantung normal sebesar 5.4 L/menit. Fenomena fisiologis ini dapat dijelaskan melalui rumus Curah Jantung = HR × SV karena...',
    options: [
      'Darah atlet memiliki viskositas dua kali lebih encer.',
      'Volume sekuncup (Stroke Volume) per denyutan atlet sangat besar (~112 ml) akibat adaptasi hipertrofi eksentrik jantung sehat.',
      'Katup semilunar atlet membuka dua kali pada setiap sistol.',
      'Atlet tidak membutuhkan oksigen saat berada pada kondisi istirahat.'
    ],
    correctIndex: 1,
    explanation: 'Curah jantung (Cardiac Output) adalah hasil kali frekuensi denyut (HR) dengan volume sekuncup (SV). Dengan SV mencapai 112 ml per denyut (normal orang biasa ~70 ml), jantung atlet cukup berdenyut 48 kali/menit untuk memompa 5.4 liter darah.',
    thinkingDimension: 'Eksplanasi'
  }
];

export const CRITICAL_THINKING_RUBRIC: RubricDimension[] = [
  {
    dimension: '1. Interpretasi Data & Fenomena',
    definition: 'Kemampuan mengidentifikasi, mengkategorikan, dan memahami data anatomi 3D serta tanda vital pasien secara objektif.',
    levels: [
      { score: 4, descriptor: 'Sangat Mahir: Mampu menguraikan struktur 3D, membedakan katup dan ruang, serta membaca tanda vital (BP, HR, EF) tanpa kesalahan.' },
      { score: 3, descriptor: 'Mahir: Mampu mengidentifikasi sebagian besar struktur jantung dan mengartikan nilai tensi serta murmur dengan benar.' },
      { score: 2, descriptor: 'Berkembang: Mengenali struktur dasar namun terkadang keliru membedakan sirkulasi pulmonal vs sistemik.' },
      { score: 1, descriptor: 'Perlu Bimbingan: Kesulitan membaca nilai tanda vital atau membedakan atrium dan ventrikel.' }
    ]
  },
  {
    dimension: '2. Analisis Hubungan Struktur & Fungsi',
    definition: 'Kemampuan mengaitkan karakteristik anatomis (ketebalan dinding, katup searah, elastisitas pembuluh) dengan fungsi hidrodinamika darah.',
    levels: [
      { score: 4, descriptor: 'Sangat Mahir: Menganalisis secara mendalam mengapa ketebalan ventrikel kiri 3x lipat dibanding kanan dikaitkan dengan afterload TPR.' },
      { score: 3, descriptor: 'Mahir: Memahami kaitan otot tebal dengan tekanan tinggi, namun belum mengaitkan resistensi vaskular sistemik secara komprehensif.' },
      { score: 2, descriptor: 'Berkembang: Menyatakan ventrikel kiri lebih kuat hanya karena "memompa ke seluruh tubuh" tanpa konsep tekanan hidrostatik.' },
      { score: 1, descriptor: 'Perlu Bimbingan: Menganggap kedua ventrikel memiliki beban dan ketebalan yang sama.' }
    ]
  },
  {
    dimension: '3. Evaluasi Bukti & Epistemologi Sains',
    definition: 'Kemampuan menilai validitas hipotesis, menolak kesimpulan prematur, dan membedakan data simulasi dengan fakta empiris klinis.',
    levels: [
      { score: 4, descriptor: 'Sangat Mahir: Secara eksplisit menggunakan bukti auskultasi murmur dan EF untuk membuktikan diagnosis serta sadar batasan model simulasi.' },
      { score: 3, descriptor: 'Mahir: Mampu menolak hipotesis yang salah dengan menunjukkan bukti data tensi atau auskultasi.' },
      { score: 2, descriptor: 'Berkembang: Membuat kesimpulan yang benar namun tidak menyertakan bukti spesifik dari data tabel pasien.' },
      { score: 1, descriptor: 'Perlu Bimbingan: Menerima hipotesis tanpa bukti atau mengira simulasi komputer adalah data medis pasien asli.' }
    ]
  },
  {
    dimension: '4. Formulasi Inferensi & Hipotesis',
    definition: 'Kemampuan merumuskan dugaan ilmiah yang logis dan menarik kesimpulan berdasarkan premis fakta fisiologis.',
    levels: [
      { score: 4, descriptor: 'Sangat Mahir: Merumuskan hipotesis yang dapat diuji mengenai kaitan stenosis aorta dengan penurunan curah jantung dan hipotensi perifer.' },
      { score: 3, descriptor: 'Mahir: Merumuskan hipotesis yang runtut meski penalaran kausalitasnya belum sepenuhnya terurai.' },
      { score: 2, descriptor: 'Berkembang: Merumuskan hipotesis yang terlalu umum atau tidak spesifik pada penyakit kardiovaskular terkait.' },
      { score: 1, descriptor: 'Perlu Bimbingan: Kesulitan menarik kesimpulan logis dari data yang diberikan.' }
    ]
  },
  {
    dimension: '5. Eksplanasi Ilmiah (Claim-Evidence-Reasoning)',
    definition: 'Kemampuan menyajikan argumentasi ilmiah yang runtut menggunakan terminologi biologi yang tepat dan konsep terpadu.',
    levels: [
      { score: 4, descriptor: 'Sangat Mahir: Menyajikan argumen lengkap Claim-Evidence-Reasoning dengan istilah biologi baku (afterload, preload, regurgitasi, stenosis).' },
      { score: 3, descriptor: 'Mahir: Menyampaikan argumen ilmiah yang jelas dan benar dengan terminologi standar.' },
      { score: 2, descriptor: 'Berkembang: Penjelasan masih menggunakan bahasa sehari-hari yang kurang presisi secara biologi.' },
      { score: 1, descriptor: 'Perlu Bimbingan: Argumen tidak terstruktur atau membingungkan.' }
    ]
  }
];

export const SCIENTIFIC_REFERENCES = [
  {
    title: 'Campbell Biology (12th Edition)',
    authors: 'Urry, L. A., Cain, M. L., Wasserman, S. A., Minorsky, P. V., & Orr, R. B.',
    year: '2021',
    publisher: 'Pearson Education',
    chapter: 'Chapter 42: Circulation and Gas Exchange',
    relevance: 'Rujukan standar kurikulum Biologi SMA untuk urutan sirkulasi ganda dan anatomi jantung vertebrata.'
  },
  {
    title: 'Human Physiology: From Cells to Systems (9th Edition)',
    authors: 'Sherwood, Lauralee',
    year: '2016',
    publisher: 'Cengage Learning',
    chapter: 'Chapter 9: The Blood Vessels and Blood Pressure & Chapter 10: The Cardiac Cycle',
    relevance: 'Rujukan fisiologi konduksi nodus SA/AV, suara jantung Lub-Dub, dan mekanisme hemodinamika afterload.'
  },
  {
    title: 'Guyton and Hall Textbook of Medical Physiology (14th Edition)',
    authors: 'Hall, John E. & Hall, Michael E.',
    year: '2021',
    publisher: 'Elsevier',
    chapter: 'Unit III: The Heart & Unit IV: The Circulation',
    relevance: 'Rujukan validitas klinis untuk kurva tekanan-volume ventrikel, efek Windkessel aorta, dan patologi stenosis/insufisiensi katup.'
  }
];
