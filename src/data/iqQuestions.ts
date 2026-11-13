import { AssessmentMode, IQQuestion } from '../types/iq';

export const IQ_QUESTIONS: IQQuestion[] = [
  // =========================================================================
  // 01. AKIŞKAN ZEKÂ (Gf) — 6 Görsel Mantık ve Örüntü Sorusu
  // =========================================================================
  {
    id: 'gf-01',
    order: 1,
    domain: 'Gf',
    difficulty: -1.35,
    discrimination: 1.15,
    title: 'Şekil ve Dolgu Matrisi',
    prompt: 'Satır ve sütunlardaki değişimi izleyerek soru işareti (?) yerine gelecek şekli seçin.',
    ruleTag: 'Sütun: Şekil · Satır: Dolgu',
    stimulus: {
      type: 'matrix3x3',
      cells: [
        { kind: 'shape', shape: 'circle', fill: 'outline' },
        { kind: 'shape', shape: 'triangle', fill: 'outline' },
        { kind: 'shape', shape: 'square', fill: 'outline' },

        { kind: 'shape', shape: 'circle', fill: 'striped' },
        { kind: 'shape', shape: 'triangle', fill: 'striped' },
        { kind: 'shape', shape: 'square', fill: 'striped' },

        { kind: 'shape', shape: 'circle', fill: 'solid' },
        { kind: 'shape', shape: 'triangle', fill: 'solid' },
      ],
    },
    options: [
      { kind: 'shape', shape: 'square', fill: 'outline' },
      { kind: 'shape', shape: 'square', fill: 'solid' },
      { kind: 'shape', shape: 'square', fill: 'striped' },
      { kind: 'shape', shape: 'circle', fill: 'solid' },
      { kind: 'shape', shape: 'triangle', fill: 'solid' },
      { kind: 'shape', shape: 'diamond', fill: 'solid' },
    ],
    correctIndex: 1,
    explanation:
      'Her sütunda şekil aynı kalır (daire, üçgen, kare). Her satırda ise dolgu boş, çizgili ve dolu şeklinde ilerler. Sağ alt köşeye içi dolu kare gelmelidir.',
  },
  {
    id: 'gf-02',
    order: 2,
    domain: 'Gf',
    difficulty: -0.75,
    discrimination: 1.25,
    title: 'Farklı Olanı Bulun',
    prompt: 'Seçeneklerden beşi aynı parçanın farklı açılardan görünümüdür. Ters çevrilmiş (ayna görüntüsü) farklı parçayı bulun.',
    ruleTag: 'Görsel Sınıflandırma',
    stimulus: {
      type: 'odd-one-out',
      caption: 'Aşağıdaki 6 şekilden 5’i yalnızca döndürülmüştür; 1 tanesi aynalanmıştır.',
    },
    options: [
      // 0°
      { kind: 'polyomino', cells: [[0, 0], [0, 1], [0, 2], [1, 2]], anchor: [1, 2] },
      // 90° CW
      { kind: 'polyomino', cells: [[2, 0], [1, 0], [0, 0], [0, 1]], anchor: [0, 1] },
      // 180°
      { kind: 'polyomino', cells: [[2, 2], [2, 1], [2, 0], [1, 0]], anchor: [1, 0] },
      // MIRRORED (Odd one out!)
      { kind: 'polyomino', cells: [[2, 0], [2, 1], [2, 2], [1, 2]], anchor: [1, 2] },
      // 270° CW
      { kind: 'polyomino', cells: [[0, 2], [1, 2], [2, 2], [2, 1]], anchor: [2, 1] },
      // 0° shifted right by 1 column
      { kind: 'polyomino', cells: [[1, 0], [1, 1], [1, 2], [2, 2]], anchor: [2, 2] },
    ],
    correctIndex: 3,
    explanation:
      'A, B, C, E ve F seçeneklerinin hepsi aynı L biçimli parçanın düzlemde döndürülmüş veya kaydırılmış hâlleridir (uzun kenardan uçtaki mavi kareye doğru dönüş hep aynı yöndedir). D seçeneği ise parçanın ters yüz edilmiş ayna görüntüsüdür.',
  },
  {
    id: 'gf-03',
    order: 3,
    domain: 'Gf',
    difficulty: -0.2,
    discrimination: 1.35,
    title: 'Eksik Üçlü Desen',
    prompt: 'Her satırda üç şekil, üç dolgu türü ve 1-2-3 nokta birer kez kullanılmaktadır. Eksik kareyi tamamlayın.',
    ruleTag: 'Üçlü Dağılım Kuralı',
    stimulus: {
      type: 'matrix3x3',
      cells: [
        { kind: 'shape', shape: 'circle', fill: 'outline', dots: 1 },
        { kind: 'shape', shape: 'triangle', fill: 'striped', dots: 2 },
        { kind: 'shape', shape: 'square', fill: 'solid', dots: 3 },

        { kind: 'shape', shape: 'triangle', fill: 'striped', dots: 2 },
        { kind: 'shape', shape: 'square', fill: 'solid', dots: 3 },
        { kind: 'shape', shape: 'circle', fill: 'outline', dots: 1 },

        { kind: 'shape', shape: 'square', fill: 'solid', dots: 3 },
        { kind: 'shape', shape: 'circle', fill: 'outline', dots: 1 },
      ],
    },
    options: [
      { kind: 'shape', shape: 'triangle', fill: 'solid', dots: 2 },
      { kind: 'shape', shape: 'triangle', fill: 'outline', dots: 2 },
      { kind: 'shape', shape: 'square', fill: 'striped', dots: 2 },
      { kind: 'shape', shape: 'triangle', fill: 'striped', dots: 2 },
      { kind: 'shape', shape: 'triangle', fill: 'striped', dots: 3 },
      { kind: 'shape', shape: 'circle', fill: 'striped', dots: 2 },
    ],
    correctIndex: 3,
    explanation:
      'Son satırda içi dolu 3 noktalı kare ile içi boş 1 noktalı daire yer almaktadır. Eksik kalan nitelikler üçgen şekil, çizgili dolgu ve 2 noktadır.',
  },
  {
    id: 'gf-04',
    order: 4,
    domain: 'Gf',
    difficulty: 0.45,
    discrimination: 1.45,
    title: 'Nokta Birleştirme Matrisi',
    prompt: 'Her satırda ilk iki kutudaki noktalar üst üste birleştirilerek üçüncü kutuyu oluşturuyor. Son kutu nasıl görünür?',
    ruleTag: 'Üst Üste Birleştirme',
    stimulus: {
      type: 'matrix3x3',
      cells: [
        { kind: 'dotgrid', active: [0, 3, 6] },
        { kind: 'dotgrid', active: [1, 3, 4] },
        { kind: 'dotgrid', active: [0, 1, 3, 4, 6] },

        { kind: 'dotgrid', active: [2, 4, 8] },
        { kind: 'dotgrid', active: [0, 2, 5] },
        { kind: 'dotgrid', active: [0, 2, 4, 5, 8] },

        { kind: 'dotgrid', active: [1, 4, 7] },
        { kind: 'dotgrid', active: [3, 4, 5] },
      ],
    },
    options: [
      { kind: 'dotgrid', active: [4] },
      { kind: 'dotgrid', active: [1, 3, 4, 5, 7] },
      { kind: 'dotgrid', active: [1, 3, 5, 7] },
      { kind: 'dotgrid', active: [0, 1, 3, 4, 5, 7] },
      { kind: 'dotgrid', active: [1, 2, 3, 4, 5, 7] },
      { kind: 'dotgrid', active: [0, 2, 6, 8] },
    ],
    correctIndex: 1,
    explanation:
      '1. sütundaki dikey orta çizgi (üst-orta, merkez, alt-orta) ile 2. sütundaki yatay orta çizgi (sol-orta, merkez, sağ-orta) birleştiğinde tam bir artı (+) biçimi oluşur.',
  },
  {
    id: 'gf-05',
    order: 5,
    domain: 'Gf',
    difficulty: 1.05,
    discrimination: 1.55,
    title: 'Ortak Noktaları Eleme Matrisi',
    prompt: 'İlk iki kutu üst üste konduğunda aynı yerdeki noktalar birbirini siler, yalnızca tek olan noktalar kalır. Eksik kutuyu bulun.',
    ruleTag: 'Karşılıklı Eleme Kuralı',
    stimulus: {
      type: 'matrix3x3',
      cells: [
        { kind: 'dotgrid', active: [0, 2, 4, 6] },
        { kind: 'dotgrid', active: [2, 4, 7, 8] },
        { kind: 'dotgrid', active: [0, 6, 7, 8] },

        { kind: 'dotgrid', active: [1, 3, 4, 5] },
        { kind: 'dotgrid', active: [1, 4, 6, 8] },
        { kind: 'dotgrid', active: [3, 5, 6, 8] },

        { kind: 'dotgrid', active: [0, 1, 4, 7] },
        { kind: 'dotgrid', active: [1, 2, 4, 6] },
      ],
    },
    options: [
      { kind: 'dotgrid', active: [1, 4] },
      { kind: 'dotgrid', active: [0, 2, 6, 7] },
      { kind: 'dotgrid', active: [0, 1, 2, 4, 6, 7] },
      { kind: 'dotgrid', active: [0, 2, 4, 7] },
      { kind: 'dotgrid', active: [2, 6, 7, 8] },
      { kind: 'dotgrid', active: [0, 3, 6, 7] },
    ],
    correctIndex: 1,
    explanation:
      '3. satırdaki iki kutuda üst-orta ve merkez noktalar ortaktır; bu iki nokta elenir. Yalnızca birinde bulunan sol-üst, sağ-üst, sol-alt ve alt-orta noktalar sonuç kutusunda kalır.',
  },
  {
    id: 'gf-06',
    order: 6,
    domain: 'Gf',
    difficulty: 1.75,
    discrimination: 1.7,
    title: 'Dönen İbreli Çokgen Matrisi',
    prompt: 'Dış çokgenin, dolgu renginin ve ortadaki ibrenin yön değişimini izleyerek soru işareti yerine gelecek şekli seçin.',
    ruleTag: 'Çoklu Dönüşüm Kuralı',
    stimulus: {
      type: 'matrix3x3',
      cells: [
        { kind: 'shape', shape: 'pentagon', fill: 'outline', needleAngle: 0 },
        { kind: 'shape', shape: 'hexagon', fill: 'solid', needleAngle: 45 },
        { kind: 'shape', shape: 'diamond', fill: 'outline', needleAngle: 90 },

        { kind: 'shape', shape: 'hexagon', fill: 'solid', needleAngle: 90 },
        { kind: 'shape', shape: 'diamond', fill: 'outline', needleAngle: 135 },
        { kind: 'shape', shape: 'pentagon', fill: 'solid', needleAngle: 180 },

        { kind: 'shape', shape: 'diamond', fill: 'outline', needleAngle: 180 },
        { kind: 'shape', shape: 'pentagon', fill: 'solid', needleAngle: 225 },
      ],
    },
    options: [
      { kind: 'shape', shape: 'hexagon', fill: 'solid', needleAngle: 270 },
      { kind: 'shape', shape: 'hexagon', fill: 'outline', needleAngle: 315 },
      { kind: 'shape', shape: 'hexagon', fill: 'outline', needleAngle: 270 },
      { kind: 'shape', shape: 'pentagon', fill: 'outline', needleAngle: 270 },
      { kind: 'shape', shape: 'hexagon', fill: 'outline', needleAngle: 90 },
      { kind: 'shape', shape: 'diamond', fill: 'outline', needleAngle: 270 },
    ],
    correctIndex: 2,
    explanation:
      'Her satırda beşgen, altıgen ve eşkenar dörtgen birer kez bulunur; dolayısıyla son şekil altıgendir. Dolgu boş-dolu şeklinde değiştiğinden içi boş olur. İbre sağa giderken +45° döndüğünden 225° → 270° (sola yatay) konumuna gelir.',
  },

  // =========================================================================
  // 02. GÖRSEL-UZAMSAL İŞLEMLEME (Gv) — 6 Uzamsal Beceri Sorusu
  // =========================================================================
  {
    id: 'gv-01',
    order: 7,
    domain: 'Gv',
    difficulty: -1.2,
    discrimination: 1.25,
    title: '90° Saat Yönünde Döndürme',
    prompt: 'Soldaki şekli ters çevirmeden yalnızca saat yönünde 90° (bir çeyrek tur) döndürdüğünüzde hangisini elde edersiniz?',
    ruleTag: 'Zihinsel Döndürme',
    stimulus: {
      type: 'rotation',
      instruction: 'Saat yönünde 90° döndürün',
      reference: {
        kind: 'polyomino',
        cells: [[1, 0], [2, 0], [1, 1], [1, 2], [0, 2]],
        anchor: [2, 0],
      },
    },
    options: [
      { kind: 'polyomino', cells: [[0, 1], [0, 0], [1, 1], [2, 1], [2, 2]], anchor: [0, 0] },
      { kind: 'polyomino', cells: [[2, 1], [2, 0], [1, 1], [0, 1], [0, 2]], anchor: [2, 0] },
      { kind: 'polyomino', cells: [[2, 1], [2, 2], [1, 1], [0, 1], [0, 0]], anchor: [2, 2] },
      { kind: 'polyomino', cells: [[1, 2], [0, 2], [1, 1], [1, 0], [2, 0]], anchor: [0, 2] },
      { kind: 'polyomino', cells: [[2, 1], [2, 2], [1, 1], [0, 1], [0, 0]], anchor: [0, 0] },
      { kind: 'polyomino', cells: [[1, 0], [0, 0], [1, 1], [1, 2], [2, 2]], anchor: [0, 0] },
    ],
    correctIndex: 2,
    explanation:
      'Şekli saat yönünde çeyrek tur çevirdiğinizde sağ üstteki mavi noktalı uç sağ alt köşeye, sol alttaki çıkıntı ise sol üst köşeye döner.',
  },
  {
    id: 'gv-02',
    order: 8,
    domain: 'Gv',
    difficulty: -0.65,
    discrimination: 1.3,
    title: 'Dikey Ayna Yansıması',
    prompt: 'Referans şeklin ortadaki dikey aynadaki tam yansıması nasıl görünür?',
    ruleTag: 'Ayna Simetrisi',
    stimulus: {
      type: 'mirror',
      axis: 'vertical',
      reference: { kind: 'asymmetric', stemDir: 0, flagSide: 'right', dotPos: 'bl' },
    },
    options: [
      { kind: 'asymmetric', stemDir: 0, flagSide: 'right', dotPos: 'br' },
      { kind: 'asymmetric', stemDir: 0, flagSide: 'left', dotPos: 'bl' },
      { kind: 'asymmetric', stemDir: 0, flagSide: 'left', dotPos: 'br' },
      { kind: 'asymmetric', stemDir: 180, flagSide: 'left', dotPos: 'tr' },
      { kind: 'asymmetric', stemDir: 0, flagSide: 'left', dotPos: 'tl' },
      { kind: 'asymmetric', stemDir: 180, flagSide: 'right', dotPos: 'br' },
    ],
    correctIndex: 2,
    explanation:
      'Dikey aynada yukarı bakan okun yönü değişmez; sağa uzanan bayrak kolu sola geçer ve sol alttaki mavi nokta sağ alt köşeye yansır.',
  },
  {
    id: 'gv-03',
    order: 9,
    domain: 'Gv',
    difficulty: 0.05,
    discrimination: 1.35,
    title: 'Tek Katlı Kâğıt Açılımı',
    prompt: 'Kare kâğıt ortadan sağa doğru katlanıp iki yerden delinmiştir. Kâğıt geri açıldığında delikler nerede görünür?',
    ruleTag: 'Tek Eksenli Katlama',
    stimulus: {
      type: 'paperfold',
      folds: 'one-fold-r',
    },
    options: [
      { kind: 'paperfold', holes: [[75, 25], [62, 72]] },
      { kind: 'paperfold', holes: [[25, 25], [75, 25], [25, 72], [75, 72]] },
      { kind: 'paperfold', holes: [[25, 25], [75, 25], [38, 72], [62, 72]] },
      { kind: 'paperfold', holes: [[25, 75], [75, 75], [38, 28], [62, 28]] },
      { kind: 'paperfold', holes: [[25, 25], [62, 72], [38, 25], [75, 72]] },
      { kind: 'paperfold', holes: [[18, 25], [82, 25], [18, 72], [82, 72]] },
    ],
    correctIndex: 2,
    explanation:
      'Kâğıt dikey orta çizgiden sağa katlandığı için açıldığında sol yarıda sağ yarının ayna simetriği oluşur: üstteki dış delik iki dış üstte, alttaki merkeze yakın delik ise iki iç altta belirir.',
  },
  {
    id: 'gv-04',
    order: 10,
    domain: 'Gv',
    difficulty: 0.65,
    discrimination: 1.45,
    title: 'Çift Katlı Kâğıt Açılımı',
    prompt: 'Kare kâğıt önce aşağı, sonra sağa katlanarak iki noktadan deliniyor. Kâğıt tamamen açıldığında görünümü hangisi olur?',
    ruleTag: 'Çift Eksenli Katlama',
    stimulus: {
      type: 'paperfold',
      folds: 'two-fold-br',
    },
    options: [
      { kind: 'paperfold', holes: [[18, 18], [82, 18], [18, 82], [82, 82]] },
      { kind: 'paperfold', holes: [[40, 40], [60, 40], [40, 60], [60, 60], [18, 82], [82, 82]] },
      {
        kind: 'paperfold',
        holes: [
          [40, 40], [60, 40], [40, 60], [60, 60],
          [18, 18], [82, 18], [18, 82], [82, 82],
        ],
      },
      { kind: 'paperfold', holes: [[40, 18], [60, 18], [40, 82], [60, 82], [18, 40], [82, 40]] },
      { kind: 'paperfold', holes: [[60, 60], [82, 82], [40, 60], [18, 82]] },
      { kind: 'paperfold', holes: [[40, 40], [60, 60], [18, 18], [82, 82], [18, 82], [82, 18]] },
    ],
    correctIndex: 2,
    explanation:
      'İki katlama kâğıdı 4 katlı yapar. Katlı karenin iç köşesine yakın delik açılınca ortada 4’lü bir kare, dış köşedeki delik ise açılınca kâğıdın 4 dış köşesinde birer delik oluşturur (toplam 8 delik).',
  },
  {
    id: 'gv-05',
    order: 11,
    domain: 'Gv',
    difficulty: 1.25,
    discrimination: 1.5,
    title: '180° Yarım Tur Döndürme',
    prompt: 'Referans şekli düzlemde 180° (yarım tur) döndürdüğünüzde aşağıdaki görünümlerden hangisi oluşur?',
    ruleTag: 'Yarım Tur Rotasyon',
    stimulus: {
      type: 'mirror',
      axis: 'horizontal',
      reference: { kind: 'asymmetric', stemDir: 0, flagSide: 'right', dotPos: 'bl' },
    },
    options: [
      { kind: 'asymmetric', stemDir: 180, flagSide: 'left', dotPos: 'tr' },
      { kind: 'asymmetric', stemDir: 180, flagSide: 'right', dotPos: 'tl' },
      { kind: 'asymmetric', stemDir: 180, flagSide: 'right', dotPos: 'tr' },
      { kind: 'asymmetric', stemDir: 180, flagSide: 'right', dotPos: 'br' },
      { kind: 'asymmetric', stemDir: 90, flagSide: 'right', dotPos: 'tl' },
      { kind: 'asymmetric', stemDir: 180, flagSide: 'left', dotPos: 'br' },
    ],
    correctIndex: 2,
    explanation:
      'Şekli 180° döndürdüğünüzde yukarı bakan ok aşağı bakar; okun ucundan bakıldığında sağ taraftaki bayrak yine ok yönüne göre sağda (ekranda sola doğru) kalır ve sol alttaki mavi nokta çapraz karşı köşeye (sağ üst) taşınır.',
  },
  {
    id: 'gv-06',
    order: 12,
    domain: 'Gv',
    difficulty: 1.85,
    discrimination: 1.65,
    title: '3B Küp Katlama',
    prompt: 'Açık küp şablonu desenler dışta kalacak şekilde katlandığında aşağıdaki küplerden hangisi oluşabilir?',
    ruleTag: '3B Yüzey Komşuluğu',
    stimulus: {
      type: 'cubenet',
      faces: {
        top: 'filled-circle',
        left: 'diagonal-slash',
        center: 'square-outline',
        right: 'triangle-up',
        bottom: 'cross-plus',
        back: 'two-dots',
      },
    },
    options: [
      { kind: 'cubeview', front: 'square-outline', top: 'filled-circle', right: 'cross-plus' },
      { kind: 'cubeview', front: 'square-outline', top: 'two-dots', right: 'triangle-up' },
      { kind: 'cubeview', front: 'diagonal-slash', top: 'filled-circle', right: 'triangle-up' },
      { kind: 'cubeview', front: 'square-outline', top: 'filled-circle', right: 'triangle-up' },
      { kind: 'cubeview', front: 'square-outline', top: 'cross-plus', right: 'triangle-up' },
      { kind: 'cubeview', front: 'two-dots', top: 'filled-circle', right: 'triangle-up' },
    ],
    correctIndex: 3,
    explanation:
      'Karşılıklı yüzeyler (dolu daire ↔ artı, mavi kare ↔ iki nokta, eğik çizgi ↔ üçgen) yan yana görünemez. Ön yüzde mavi kare varken üstte dolu daire ve sağda üçgen yalnızca D seçeneğinde doğru komşulukla bir aradadır.',
  },

  // =========================================================================
  // 03. NİCEL AKIL YÜRÜTME (Gq) — 6 Sayısal ve İlişkisel Sorular
  // =========================================================================
  {
    id: 'gq-01',
    order: 13,
    domain: 'Gq',
    difficulty: -1.3,
    discrimination: 1.2,
    title: 'Artan Farklı Sayı Dizisi',
    prompt: 'Sayılar arasındaki artış düzenini bularak soru işareti (?) yerine gelecek sayıyı seçin.',
    ruleTag: 'Düzenli Artan Farklar',
    stimulus: {
      type: 'numseq',
      values: [3, 7, 13, 21, 31, '?'],
    },
    options: [
      { kind: 'text', label: '39' },
      { kind: 'text', label: '41' },
      { kind: 'text', label: '43' },
      { kind: 'text', label: '45' },
      { kind: 'text', label: '47' },
      { kind: 'text', label: '51' },
    ],
    correctIndex: 2,
    explanation:
      'Sayılar sırasıyla +4, +6, +8, +10 artmaktadır. Bir sonraki artış +12 olacağı için 31 + 12 = 43 bulunur.',
  },
  {
    id: 'gq-02',
    order: 14,
    domain: 'Gq',
    difficulty: -0.7,
    discrimination: 1.25,
    title: 'Dönüşümlü Çarpma Dizisi',
    prompt: 'Dizideki çarpma örüntüsünü izleyerek sıradaki sayıyı bulun.',
    ruleTag: '×3, ×2 Örüntüsü',
    stimulus: {
      type: 'numseq',
      values: [2, 6, 12, 36, 72, '?'],
    },
    options: [
      { kind: 'text', label: '108' },
      { kind: 'text', label: '144' },
      { kind: 'text', label: '180' },
      { kind: 'text', label: '216' },
      { kind: 'text', label: '240' },
      { kind: 'text', label: '288' },
    ],
    correctIndex: 3,
    explanation:
      'Terimler sırayla ×3 ve ×2 ile büyümektedir: 2×3=6, 6×2=12, 12×3=36, 36×2=72. Sıradaki işlem ×3 olduğundan 72 × 3 = 216 olur.',
  },
  {
    id: 'gq-03',
    order: 15,
    domain: 'Gq',
    difficulty: -0.1,
    discrimination: 1.4,
    title: 'Terazi Ağırlık Denkliği',
    prompt: 'İlk iki satırdaki şekiller birbirine eşittir. Üçüncü satırdaki eşliği sağlamak için soru işareti yerine hangisi gelmelidir?',
    ruleTag: 'Sembolik Denge',
    stimulus: {
      type: 'scale',
      equations: [
        { left: ['square'], right: ['triangle', 'triangle'] },
        { left: ['circle'], right: ['square', 'triangle'] },
      ],
      targetLeft: ['circle', 'square'],
    },
    options: [
      { kind: 'text', label: '1 Daire + 1 Üçgen', sublabel: '● + ▲' },
      { kind: 'text', label: '2 Daire', sublabel: '● + ●' },
      { kind: 'text', label: '1 Kare + 2 Üçgen', sublabel: '■ + ▲ + ▲' },
      { kind: 'text', label: '2 Kare + 1 Üçgen', sublabel: '■ + ■ + ▲' },
      { kind: 'text', label: '4 Üçgen', sublabel: '▲ + ▲ + ▲ + ▲' },
      { kind: 'text', label: '2 Kare + 2 Üçgen', sublabel: '■ + ■ + ▲ + ▲' },
    ],
    correctIndex: 3,
    explanation:
      '1 Üçgen = 1 birim dersek, Kare = 2 birim ve Daire = 2 + 1 = 3 birim olur. Sorulan Daire + Kare = 5 birimdir. 2 Kare + 1 Üçgen = 4 + 1 = 5 birim ederek dengeyi sağlar.',
  },
  {
    id: 'gq-04',
    order: 16,
    domain: 'Gq',
    difficulty: 0.55,
    discrimination: 1.45,
    title: '3×3 Sayı Matrisi',
    prompt: 'Her satırdaki ilk iki sayıdan üçüncü sayıyı elde eden ortak kuralı bularak eksik sayıyı seçin.',
    ruleTag: 'Satır İlişkisi',
    stimulus: {
      type: 'nummatrix',
      values: [4, 5, 13, 7, 3, 17, 6, 9],
    },
    options: [
      { kind: 'text', label: '18' },
      { kind: 'text', label: '19' },
      { kind: 'text', label: '21' },
      { kind: 'text', label: '23' },
      { kind: 'text', label: '24' },
      { kind: 'text', label: '27' },
    ],
    correctIndex: 2,
    explanation:
      'Her satırda ilk sayının iki katı ile ikinci sayı toplanmaktadır: (4×2)+5 = 13 ve (7×2)+3 = 17. Son satırda (6×2)+9 = 21 elde edilir.',
  },
  {
    id: 'gq-05',
    order: 17,
    domain: 'Gq',
    difficulty: 1.2,
    discrimination: 1.55,
    title: 'Sayı Üçgenleri',
    prompt: 'İlk iki üçgendeki köşe sayılarından ortadaki sayıyı üreten kuralı bulun ve üçüncü üçgenin merkezini hesaplayın.',
    ruleTag: 'Köşe-Merkez İlişkisi',
    stimulus: {
      type: 'numtriangles',
      triangles: [
        { left: 3, right: 5, bottom: 2, center: 16 },
        { left: 4, right: 2, bottom: 5, center: 30 },
        { left: 6, right: 3, bottom: 4, center: '?' },
      ],
    },
    options: [
      { kind: 'text', label: '24' },
      { kind: 'text', label: '28' },
      { kind: 'text', label: '32' },
      { kind: 'text', label: '36' },
      { kind: 'text', label: '40' },
      { kind: 'text', label: '42' },
    ],
    correctIndex: 3,
    explanation:
      'Üstteki iki köşe toplanıp alttaki köşe ile çarpıldığında ortadaki sayı elde edilir: (3+5)×2 = 16 ve (4+2)×5 = 30. Buna göre (6+3)×4 = 36 bulunur.',
  },
  {
    id: 'gq-06',
    order: 18,
    domain: 'Gq',
    difficulty: 1.9,
    discrimination: 1.75,
    title: 'Üç Katlı Fark Dizisi',
    prompt: 'Terimler arasındaki farkların büyüme hızını bularak soru işareti yerine gelecek sayıyı seçin.',
    ruleTag: 'Katlanarak Artan Farklar',
    stimulus: {
      type: 'numseq',
      values: [2, 3, 6, 15, 42, '?'],
    },
    options: [
      { kind: 'text', label: '108' },
      { kind: 'text', label: '114' },
      { kind: 'text', label: '121' },
      { kind: 'text', label: '123' },
      { kind: 'text', label: '126' },
      { kind: 'text', label: '129' },
    ],
    correctIndex: 3,
    explanation:
      'Sayılar arasındaki farklar +1, +3, +9, +27 biçiminde her adımda 3 ile çarpılmaktadır. Sıradaki fark +81 olacağından 42 + 81 = 123 olur.',
  },

  // =========================================================================
  // 04. ÇALIŞMA BELLEĞİ VE KURAL TAKİBİ (Gwm) — 6 Görsel Takip Sorusu
  // =========================================================================
  {
    id: 'gwm-01',
    order: 19,
    domain: 'Gwm',
    difficulty: -1.05,
    discrimination: 1.25,
    title: 'Çeyrek Kare ve Merkez Döngüsü',
    prompt: 'Mavi bölgenin saat yönünde dönüşünü ve ortadaki şeklin sırasını izleyerek 5. adımı seçin.',
    ruleTag: 'İkili Görsel Döngü',
    stimulus: {
      type: 'quadrant-seq',
      steps: [
        { kind: 'quadrant', quadrant: 0, centerShape: 'circle' },
        { kind: 'quadrant', quadrant: 1, centerShape: 'triangle' },
        { kind: 'quadrant', quadrant: 2, centerShape: 'square' },
        { kind: 'quadrant', quadrant: 3, centerShape: 'circle' },
      ],
    },
    options: [
      { kind: 'quadrant', quadrant: 0, centerShape: 'circle' },
      { kind: 'quadrant', quadrant: 0, centerShape: 'triangle' },
      { kind: 'quadrant', quadrant: 1, centerShape: 'triangle' },
      { kind: 'quadrant', quadrant: 0, centerShape: 'square' },
      { kind: 'quadrant', quadrant: 2, centerShape: 'triangle' },
      { kind: 'quadrant', quadrant: 3, centerShape: 'square' },
    ],
    correctIndex: 1,
    explanation:
      'Mavi kare saat yönünde bir çeyrek ilerlediği için 5. adımda tekrar sol üst köşeye döner. Ortadaki şekil ise Daire → Üçgen → Kare döngüsünü izlediğinden 5. adımda Üçgen olur.',
  },
  {
    id: 'gwm-02',
    order: 20,
    domain: 'Gwm',
    difficulty: -0.4,
    discrimination: 1.35,
    title: 'Sembolik İşlem Zinciri',
    prompt: 'Yukarıdaki sembollerin temsil ettiği işlemleri soldan sağa sırasıyla uygulayarak sonucu bulun.',
    ruleTag: 'Ardışık Bellek İşlemi',
    stimulus: {
      type: 'cipher-ops',
      legend: [
        { symbol: 'triangle', label: '+2 Ekle' },
        { symbol: 'circle', label: '×3 Çarp' },
        { symbol: 'square', label: '−4 Çıkar' },
      ],
      startValue: 5,
      chain: ['triangle', 'circle', 'square'],
    },
    options: [
      { kind: 'text', label: '11' },
      { kind: 'text', label: '13' },
      { kind: 'text', label: '15' },
      { kind: 'text', label: '17' },
      { kind: 'text', label: '19' },
      { kind: 'text', label: '21' },
    ],
    correctIndex: 3,
    explanation:
      'Başlangıç değeri 5’e önce üçgen (+2) uygulanır = 7; ardından daire (×3) uygulanır = 21; son olarak kare (−4) çıkarılır = 17.',
  },
  {
    id: 'gwm-03',
    order: 21,
    domain: 'Gwm',
    difficulty: 0.2,
    discrimination: 1.45,
    title: 'Izgara Üzerinde Rota Takibi',
    prompt: 'B3 karesinden ve yukarı (↑) yönden başlayarak adımları zihinde takip edin. Bitiş karesi ve son yön hangisidir?',
    ruleTag: 'Uzamsal Rota Belleği',
    stimulus: {
      type: 'gridpath',
      startCol: 'B',
      startRow: 3,
      startDir: 'Kuzey',
      commands: [
        '1. 2 kare ileri git',
        '2. Saat yönünde 90° dön, 2 kare ileri git',
        '3. Saat yönünde 90° dön, 1 kare ileri git',
        '4. Saat yönünde 90° dön, 1 kare ileri git',
      ],
    },
    options: [
      { kind: 'text', label: 'C2 · Batı (←)' },
      { kind: 'text', label: 'C2 · Doğu (→)' },
      { kind: 'text', label: 'D2 · Güney (↓)' },
      { kind: 'text', label: 'C3 · Batı (←)' },
      { kind: 'text', label: 'B2 · Kuzey (↑)' },
      { kind: 'text', label: 'C1 · Batı (←)' },
    ],
    correctIndex: 0,
    explanation:
      'B3’ten yukarı 2 kare → B1. Sağa dönüp 2 kare → D1. Aşağı dönüp 1 kare → D2. Sola dönüp 1 kare → C2 karesinde Batı (←) yönüne bakılır.',
  },
  {
    id: 'gwm-04',
    order: 22,
    domain: 'Gwm',
    difficulty: 0.8,
    discrimination: 1.5,
    title: 'Kaydırmalı Şekil Dizisi',
    prompt: 'Her adımda şekillerin nasıl kaydığını ve renklerinin nasıl değiştiğini gözlemleyerek 4. adımı seçin.',
    ruleTag: 'Görsel Kaydırma + Dolgu',
    stimulus: {
      type: 'slots-seq',
      steps: [
        {
          kind: 'slots',
          slots: [
            { shape: 'triangle', fill: 'solid' },
            { shape: 'circle', fill: 'solid' },
            { shape: 'square', fill: 'solid' },
          ],
        },
        {
          kind: 'slots',
          slots: [
            { shape: 'square', fill: 'outline' },
            { shape: 'triangle', fill: 'solid' },
            { shape: 'circle', fill: 'solid' },
          ],
        },
        {
          kind: 'slots',
          slots: [
            { shape: 'circle', fill: 'outline' },
            { shape: 'square', fill: 'outline' },
            { shape: 'triangle', fill: 'solid' },
          ],
        },
      ],
    },
    options: [
      {
        kind: 'slots',
        slots: [
          { shape: 'triangle', fill: 'solid' },
          { shape: 'circle', fill: 'outline' },
          { shape: 'square', fill: 'outline' },
        ],
      },
      {
        kind: 'slots',
        slots: [
          { shape: 'triangle', fill: 'outline' },
          { shape: 'circle', fill: 'outline' },
          { shape: 'square', fill: 'outline' },
        ],
      },
      {
        kind: 'slots',
        slots: [
          { shape: 'square', fill: 'outline' },
          { shape: 'triangle', fill: 'outline' },
          { shape: 'circle', fill: 'outline' },
        ],
      },
      {
        kind: 'slots',
        slots: [
          { shape: 'triangle', fill: 'outline' },
          { shape: 'square', fill: 'outline' },
          { shape: 'circle', fill: 'solid' },
        ],
      },
      {
        kind: 'slots',
        slots: [
          { shape: 'circle', fill: 'solid' },
          { shape: 'square', fill: 'outline' },
          { shape: 'triangle', fill: 'outline' },
        ],
      },
      {
        kind: 'slots',
        slots: [
          { shape: 'triangle', fill: 'outline' },
          { shape: 'circle', fill: 'solid' },
          { shape: 'square', fill: 'outline' },
        ],
      },
    ],
    correctIndex: 1,
    explanation:
      'Her adımda en sağdaki şekil en başa geçerken içi boşalmaktadır. 3. adımda en sağda bulunan dolu üçgen başa geçip boşaldığında sıra [boş üçgen, boş daire, boş kare] olur.',
  },
  {
    id: 'gwm-05',
    order: 23,
    domain: 'Gwm',
    difficulty: 1.4,
    discrimination: 1.6,
    title: 'Çift Parçalı Izgara Hareketi',
    prompt: 'Mavi daire ve koyu kare 3×3 ızgarada kendi hızlarıyla kenar boyunca hareket ediyor. 5. adımdaki konumlarını bulun.',
    ruleTag: 'İki Hareketli Nesne Takibi',
    stimulus: {
      type: 'dualtoken-seq',
      steps: [
        { kind: 'dualtoken', circlePos: 0, squarePos: 7 },
        { kind: 'dualtoken', circlePos: 1, squarePos: 5 },
        { kind: 'dualtoken', circlePos: 2, squarePos: 1 },
        { kind: 'dualtoken', circlePos: 5, squarePos: 3 },
      ],
    },
    // Circle: +1 CW along perimeter [0,1,2,5,8,7,6,3] -> 0->1->2->5->8
    // Square: +2 CCW along perimeter [7,5,1,3,7] -> 7
    options: [
      { kind: 'dualtoken', circlePos: 8, squarePos: 6 },
      { kind: 'dualtoken', circlePos: 7, squarePos: 7 },
      { kind: 'dualtoken', circlePos: 8, squarePos: 7 },
      { kind: 'dualtoken', circlePos: 8, squarePos: 1 },
      { kind: 'dualtoken', circlePos: 6, squarePos: 7 },
      { kind: 'dualtoken', circlePos: 2, squarePos: 5 },
    ],
    correctIndex: 2,
    explanation:
      'Mavi daire dış çerçevede saat yönünde her adımda 1 kare ilerler (sol-üst → üst-orta → sağ-üst → sağ-orta → sağ-alt). Koyu kare ise saat yönünün tersinde her adımda 2 kare sıçrar (alt-orta → sağ-orta → üst-orta → sol-orta → alt-orta).',
  },
  {
    id: 'gwm-06',
    order: 24,
    domain: 'Gwm',
    difficulty: 2.0,
    discrimination: 1.8,
    title: 'İvmeli Saat Halkası',
    prompt: 'Dış halkadaki mavi noktanın sıçrama mesafesini ve merkez şeklin dönüşümünü izleyerek 5. adımı seçin.',
    ruleTag: 'Artan Adımlı Döngü',
    stimulus: {
      type: 'clockring-seq',
      steps: [
        { kind: 'clockring', pos: 0, centerShape: 'circle', centerFill: 'solid' },
        { kind: 'clockring', pos: 1, centerShape: 'triangle', centerFill: 'outline' },
        { kind: 'clockring', pos: 3, centerShape: 'square', centerFill: 'solid' },
        { kind: 'clockring', pos: 6, centerShape: 'circle', centerFill: 'outline' },
      ],
    },
    // pos: 0 ->(+1) 1 ->(+2) 3 ->(+3) 6 ->(+4) 10%8 = 2 (3 o'clock)
    // shape: circle -> triangle -> square -> circle -> triangle
    // fill: solid -> outline -> solid -> outline -> solid
    options: [
      { kind: 'clockring', pos: 2, centerShape: 'triangle', centerFill: 'outline' },
      { kind: 'clockring', pos: 1, centerShape: 'triangle', centerFill: 'solid' },
      { kind: 'clockring', pos: 2, centerShape: 'square', centerFill: 'solid' },
      { kind: 'clockring', pos: 2, centerShape: 'triangle', centerFill: 'solid' },
      { kind: 'clockring', pos: 3, centerShape: 'triangle', centerFill: 'solid' },
      { kind: 'clockring', pos: 2, centerShape: 'circle', centerFill: 'solid' },
    ],
    correctIndex: 3,
    explanation:
      'Mavi nokta saat yönünde sırasıyla +1, +2, +3 adım sıçramıştır; sıradaki sıçrama +4 adım olduğundan 6’dan 2 konumuna (saat 3 yönü) ulaşır. Merkezdeki şekil Daire → Üçgen → Kare döngüsü ve dolu-boş değişimiyle içi dolu üçgen olur.',
  },
];

export function getQuestionsForMode(mode: AssessmentMode): IQQuestion[] {
  if (mode === 'standard') {
    return IQ_QUESTIONS;
  }
  // Quick mode: 12 balanced items (3 per domain: easy, medium, challenging)
  const quickIds = new Set([
    'gf-01', 'gf-04', 'gf-05',
    'gv-01', 'gv-03', 'gv-06',
    'gq-01', 'gq-03', 'gq-05',
    'gwm-01', 'gwm-03', 'gwm-05',
  ]);
  return IQ_QUESTIONS.filter((q) => quickIds.has(q.id)).map((q, idx) => ({
    ...q,
    order: idx + 1,
  }));
}
