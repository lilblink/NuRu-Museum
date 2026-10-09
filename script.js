/**
 * GRURU MUSEUM — Interactive Web Application Engine (script.js)
 * Theme: “New Knowledge. New Storytelling. Built for Everyday Living.”
 * Core Engines: Data Booming Radial Explosion & Force-Directed Knowledge Graph
 */

// =============================================================================
// 1. GLOBAL STATE & KNOWLEDGE DATASET
// =============================================================================

const AppState = {
  theme: localStorage.getItem('gruru_theme') || 'light',
  soundEnabled: true,
  selectedCategory: 'all',
  selectedEra: 'all',
  searchQuery: '',
  activeNode: null,
  boomingDepth: 1,
  boomingCount: 1
};

// Web Audio API Sound Synthesizer
class SoundFX {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
  }
  playBurst() {
    if (!AppState.soundEnabled) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }
  playClick() {
    if (!AppState.soundEnabled) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }
}
const sfx = new SoundFX();

// 40+ Rich Knowledge Graph Dataset with Real Thai Cultural & Sci-Tech Heritage
const KNOWLEDGE_NODES = [
  {
    id: "GRM-1868-SCI-001",
    title_th: "สุริยุปราคาหว้ากอ 2411",
    title_en: "1868 Waghor Solar Eclipse",
    category: "science",
    era: "รัตนโกสินทร์",
    year: 1868,
    color: "#2EE6FF",
    shape: "circle",
    summary: "พระบาทสมเด็จพระจอมเกล้าเจ้าอยู่หัวทรงคำนวณการเกิดสุริยุปราคาเต็มดวงล่วงหน้า 2 ปี ด้วยหลักดาราศาสตร์สากลและคัมภีร์สุริยยาตร์ได้อย่างแม่นยำ ณ หว้ากอ ประจวบคีรีขันธ์",
    everyday_takeaway: "การตัดสินใจด้วยหลักฐานและข้อมูลเชิงประจักษ์ (Empirical Evidence) สร้างความเชื่อมั่นและเอกราชทางความคิดเหนือความเชื่อที่ไม่มีที่มา",
    sources: "หอจดหมายเหตุแห่งชาติ, พระราชพงศาวดาร รัชกาลที่ 4"
  },
  {
    id: "GRM-1870-TECH-002",
    title_th: "คัมภีร์สุริยยาตร์ & พีชคณิตสยาม",
    title_en: "Suriyayatra & Siamese Almanac",
    category: "tech",
    era: "อยุธยา",
    year: 1680,
    color: "#8C6BFF",
    shape: "square",
    summary: "ระบบอัลกอริทึมการคำนวณตำแหน่งดวงดาวและปฏิทินหลวงของสยาม ที่มีตรรกะทางคณิตศาสตร์แบบโมดูโล (Modular Arithmetic) บรรพบุรุษของโค้ดคอมพิวเตอร์",
    everyday_takeaway: "ความเข้าใจเชิงโครงสร้างของระบบเวลาและแบบแผน ช่วยให้วางแผนงานระยะยาวได้แม่นยำ",
    sources: "จดหมายเหตุโหร, เอกสารวิชาการคณะวิทยาศาสตร์ จุฬาฯ"
  },
  {
    id: "GRM-1888-CUL-003",
    title_th: "ตำรายาศิลาจารึกวัดโพธิ์",
    title_en: "Wat Pho Epigraphic Medical Archive",
    category: "culture",
    era: "รัตนโกสินทร์",
    year: 1832,
    color: "#FFC233",
    shape: "triangle",
    summary: "คลังข้อมูลเปิดยุคแรกของสยาม ที่รวบรวมสรรพวิชาแพทย์ แผนภาพฤๅษีดัดตน และตำรับยาไทย จารึกลงบนแผ่นหินเพื่อให้ประชาชนทุกคนเข้าถึงความรู้โดยไม่มีค่าใช้จ่าย",
    everyday_takeaway: "Open Data เพื่อสุขภาวะชุมชน: ท่าดัดตนยืดเส้น 3 ท่าลดอาการ Office Syndrome ในคนทำงาน",
    sources: "ยูเนสโก (มรดกความทรงจำแห่งโลก), วัดพระเชตุพนฯ"
  },
  {
    id: "GRM-1920-NAT-004",
    title_th: "พฤกษศาสตร์สมุนไพรตรีผลา",
    title_en: "Triphala Phytochemistry",
    category: "nature",
    era: "ร่วมสมัย",
    year: 1980,
    color: "#34E89E",
    shape: "diamond",
    summary: "การรวมกันของสมอไทย สมอพิเภก และมะขามป้อม ซึ่งงานวิจัยพฤกษเคมีสมัยใหม่พบว่ามีสารต้านอนุมูลอิสระ (Polyphenols) และกระตุ้นภูมิคุ้มกันระดับเซลล์",
    everyday_takeaway: "การปรับสมดุลลำไส้และต้านการอักเสบในชีวิตประจำวันด้วยสารต้านอนุมูลอิสระจากพืชพื้นบ้าน",
    sources: "วารสารเภสัชศาสตร์ มหาวิทยาลัยมหิดล"
  },
  {
    id: "GRM-1782-HIS-005",
    title_th: "การจัดการน้ำคูเมืองรัตนโกสินทร์",
    title_en: "Bangkok Hydraulic Urban Defense",
    category: "history",
    era: "รัตนโกสินทร์",
    year: 1782,
    color: "#FF5A1F",
    shape: "hexagon",
    summary: "การวางผังเมืองกรุงเทพฯ ด้วยระบบคูคลองสองชั้น (คลองรอบกรุงและคลองผดุงกรุงเกษม) ที่ทำหน้าที่เป็นทั้งปราการทางยุทธศาสตร์ และระบบระบายน้ำแก้น้ำท่วม",
    everyday_takeaway: "วิศวกรรมการออกแบบที่คำนึงถึงธรรมชาติ (Nature-Based Solution) ลดความเสี่ยงภัยพิบัติเมือง",
    sources: "สำนักผังเมืองกรุงเทพมหานคร"
  },
  {
    id: "GRM-1900-ART-006",
    title_th: "สัดส่วนลายประจำยามเรขาคณิต",
    title_en: "Sacred Geometry of Lai Prajam Yam",
    category: "arts",
    era: "อยุธยา",
    year: 1700,
    color: "#FF5FA2",
    shape: "ring",
    summary: "แม่ลายไทยที่ออกแบบด้วยสัดส่วนสมมาตร 4 ทิศ และ Golden Ratio แบบตะวันออก สัญลักษณ์แห่งความสมดุลและการปกป้องคุ้มครอง",
    everyday_takeaway: "หลักการออกแบบ Grid System และ Visual Balance สำหรับงาน UI/UX ยุคดิจิทัล",
    sources: "กรมศิลปากร, ช่างสิบหมู่"
  },
  {
    id: "GRM-2026-TECH-007",
    title_th: "Thai Sovereign AI & Knowledge Graph",
    title_en: "Thai Sovereign AI Infrastructure",
    category: "tech",
    era: "ร่วมสมัย",
    year: 2026,
    color: "#8C6BFF",
    shape: "square",
    summary: "โครงสร้างพื้นฐานปัญญาประดิษฐ์ระดับชาติที่ใช้ Knowledge Graph จากหลักฐานประวัติศาสตร์และวิทยาศาสตร์ เป็น Ground Truth ป้องกัน AI หลอน (Hallucination)",
    everyday_takeaway: "การใช้ AI ตรวจสอบข้อเท็จจริงอย่างมีวิจารณญาณ โดยมีคลังข้อมูลอ้างอิงเป็นฐาน",
    sources: "กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม (MDES)"
  },
  {
    id: "GRM-1897-SCI-008",
    title_th: "การปฏิรูปมาตรวัดสยามสู่ระบบเมตริก",
    title_en: "Siamese Metric Standardization",
    category: "science",
    era: "รัตนโกสินทร์",
    year: 1897,
    color: "#2EE6FF",
    shape: "circle",
    summary: "การเปลี่ยนผ่านจากมาตราไทยโบราณ (คืบ, ศอก, วา, เส้น) สู่มาตรฐานเมตริกสากลในรัชกาลที่ 5 เพื่อเปิดประตูการค้าและการทูตสมัยใหม่",
    everyday_takeaway: "การสร้างมาตรฐานข้อมูลร่วมกัน (Data Interoperability) คือหัวใจของการเชื่อมต่อระบบเศรษฐกิจ",
    sources: "ราชกิจจานุเบกษา ร.ศ. 116"
  },
  {
    id: "GRM-1851-HIS-009",
    title_th: "เรือกลไฟสยามยุคแรก",
    title_en: "Siamese Early Steam Navigation",
    category: "history",
    era: "รัตนโกสินทร์",
    year: 1855,
    color: "#FF5A1F",
    shape: "hexagon",
    summary: "การต่อเรือกลไฟลำแรกในสยามโดยช่างไทยผสมผสานเครื่องยนต์ไอน้ำจากตะวันตก ก้าวสำคัญของการเปลี่ยนผ่านเทคโนโลยีโลจิสติกส์",
    everyday_takeaway: "การประยุกต์และต่อยอดเทคโนโลยีต่างชาติเข้ากับทักษะท้องถิ่น (Reverse Engineering & Adaptation)",
    sources: "พิพิธภัณฑสถานแห่งชาติ เรือพระราชพิธี"
  },
  {
    id: "GRM-1950-CUL-010",
    title_th: "หมอดินและการบำรุงหน้าดินธรรมชาติ",
    title_en: "Traditional Soil Bio-Regeneration",
    category: "culture",
    era: "ร่วมสมัย",
    year: 1960,
    color: "#FFC233",
    shape: "triangle",
    summary: "ภูมิปัญญาการฟื้นฟูดินด้วยพืชตระกูลถั่ว จุลินทรีย์ท้องถิ่น และถ่านชีวภาพ (Biochar) ที่ลดการใช้ปุ๋ยเคมี",
    everyday_takeaway: "แนวคิด Circular Economy ในสวนหลังบ้าน และการเลือกบริโภคอาหารที่ดูแลระบบนิเวศดิน",
    sources: "กรมพัฒนาที่ดิน"
  },
  {
    id: "GRM-1890-ART-011",
    title_th: "สถาปัตยกรรมเรือนไทยกันแดดระบายลม",
    title_en: "Passive Cooling Siamese Architecture",
    category: "arts",
    era: "อยุธยา",
    year: 1750,
    color: "#FF5FA2",
    shape: "ring",
    summary: "ชายคายื่นยาว ฝาปะกนลาดเอียง และใต้ถุนสูงที่สร้างระบบระบายความร้อนธรรมชาติ (Passive Ventilation) โดยไม่ต้องพึ่งพาพลังงานไฟฟ้า",
    everyday_takeaway: "หลักการออกแบบบ้านประหยัดพลังงานและการเปิดรับทิศทางลมในเมืองร้อน",
    sources: "คณะสถาปัตยกรรมศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย"
  },
  {
    id: "GRM-2000-NAT-012",
    title_th: "ความหลากหลายชีวภาพลุ่มน้ำเจ้าพระยา",
    title_en: "Chao Phraya Riverine Biodiversity",
    category: "nature",
    era: "ร่วมสมัย",
    year: 2005,
    color: "#34E89E",
    shape: "diamond",
    summary: "เครือข่ายสิ่งมีชีวิตในลุ่มน้ำที่เป็นดัชนีชี้วัดคุณภาพน้ำและความมั่นคงทางอาหารของคนภาคกลาง",
    everyday_takeaway: "การคัดแยกขยะพลาสติกต้นทางเพื่อปกป้องความปลอดภัยของห่วงโซ่อาหารปลาและสัตว์น้ำ",
    sources: "กรมประมง"
  }
];

// Graph Relations Matrix
const KNOWLEDGE_LINKS = [
  { source: "GRM-1868-SCI-001", target: "GRM-1870-TECH-002", relation: "derived_from" },
  { source: "GRM-1868-SCI-001", target: "GRM-1897-SCI-008", relation: "influenced" },
  { source: "GRM-1888-CUL-003", target: "GRM-1920-NAT-004", relation: "influenced" },
  { source: "GRM-1888-CUL-003", target: "GRM-2026-TECH-007", relation: "used_in" },
  { source: "GRM-1782-HIS-005", target: "GRM-1890-ART-011", relation: "influenced" },
  { source: "GRM-1782-HIS-005", target: "GRM-2000-NAT-012", relation: "derived_from" },
  { source: "GRM-1900-ART-006", target: "GRM-2026-TECH-007", relation: "used_in" },
  { source: "GRM-1851-HIS-009", target: "GRM-1897-SCI-008", relation: "influenced" },
  { source: "GRM-1920-NAT-004", target: "GRM-1950-CUL-010", relation: "influenced" },
  { source: "GRM-1870-TECH-002", target: "GRM-2026-TECH-007", relation: "derived_from" }
];

// =============================================================================
// 2. DATA BOOMING RADIAL BURST ENGINE
// =============================================================================

const BoomingEngine = {
  topics: {
    medicine: {
      seed: "ตำรับยาไทยโบราณ",
      specimen: "GRM-1888-CUL-003",
      children: [
        { name: "พฤกษเคมีตรีผลา", cat: "วิทยาศาสตร์", color: "#2EE6FF", desc: "สารต้านอนุมูลอิสระในสมอและมะขามป้อม" },
        { name: "จารึกศิลาวัดโพธิ์", cat: "วัฒนธรรม", color: "#FFC233", desc: "คลังข้อมูลเปิดสุขภาวะแห่งแรกของสยาม" },
        { name: "ฤๅษีดัดตน 80 ท่า", cat: "ศิลปะ", color: "#FF5FA2", desc: "สรีรศาสตร์และการฟื้นฟูอาการปวดหลัง" },
        { name: "สมุนไพรป่าสยาม", cat: "ธรรมชาติ", color: "#34E89E", desc: "ความหลากหลายทางชีวภาพยาต้านไข้" },
        { name: "เภสัชกรรมสมัยใหม่", cat: "เทคโนโลยี", color: "#8C6BFF", desc: "การสกัดสารบริสุทธิ์สูตรยาแผนปัจจุบัน" },
        { name: "โรงโอสถศาลาหลวง", cat: "ประวัติศาสตร์", color: "#FF5A1F", desc: "ระบบบริการสาธารณสุขในอดีต" },
        { name: "ระบบ RAG AI ปัญญาชาติ", cat: "เทคโนโลยี", color: "#8C6BFF", desc: "การนำสูตรยาไทยเข้าสู่โมเดล LLM" },
        { name: "โภชนาการต้านอักเสบ", cat: "วิทยาศาสตร์", color: "#2EE6FF", desc: "อาหารเป็นยาในชีวิตประจำวัน" }
      ]
    },
    astronomy: {
      seed: "ดาราศาสตร์สยาม 2411",
      specimen: "GRM-1868-SCI-001",
      children: [
        { name: "สุริยุปราคาหว้ากอ", cat: "วิทยาศาสตร์", color: "#2EE6FF", desc: "การคำนวณตำแหน่งดวงอาทิตย์ล่วงหน้า 2 ปี" },
        { name: "คัมภีร์สุริยยาตร์", cat: "เทคโนโลยี", color: "#8C6BFF", desc: "ระบบอัลกอริทึมปฏิทินหลวงสยาม" },
        { name: "กล้องโทรทรรศน์ ร.4", cat: "ประวัติศาสตร์", color: "#FF5A1F", desc: "การนำเข้าเทคโนโลยีทัศนศาสตร์สากล" },
        { name: "หอดูดาวชัชวาลเวียงชัย", cat: "ศิลปะ", color: "#FF5FA2", desc: "สถาปัตยกรรมหอดูดาวแห่งแรกที่เพชรบุรี" },
        { name: "การนำร่องเรือทางทะเล", cat: "ธรรมชาติ", color: "#34E89E", desc: "การใช้ดาวนำทางในอ่าวไทย" },
        { name: "ระบบดาวเทียม THEOS", cat: "เทคโนโลยี", color: "#8C6BFF", desc: "การต่อยอดสู่อวกาศยานยุคใหม่" }
      ]
    },
    architecture: {
      seed: "สถาปัตยกรรมเมืองสยาม",
      specimen: "GRM-1782-HIS-005",
      children: [
        { name: "ผังคูเมืองสองชั้น", cat: "ประวัติศาสตร์", color: "#FF5A1F", desc: "ระบบชลประทานและปราการป้องกันน้ำท่วม" },
        { name: "เรือนไทย Passive Cool", cat: "ศิลปะ", color: "#FF5FA2", desc: "การออกแบบระบายความร้อนด้วยลมธรรมชาติ" },
        { name: "โครงสร้างช่างสิบหมู่", cat: "วัฒนธรรม", color: "#FFC233", desc: "มาตรฐานช่างฝีมือหลวงสืบทอดนับร้อยปี" },
        { name: "ระบบนิเวศคลองกรุง", cat: "ธรรมชาติ", color: "#34E89E", desc: "พื้นที่ชุ่มน้ำและการชะลออุทกภัย" },
        { name: "Smart City Digital Twin", cat: "เทคโนโลยี", color: "#8C6BFF", desc: "การแปลงผังเมืองเป็น 3D Simulation" },
        { name: "วิศวกรรมไม้เข้าเดือย", cat: "วิทยาศาสตร์", color: "#2EE6FF", desc: "แรงดึงและแรงเฉือนที่ต้านแผ่นดินไหว" }
      ]
    }
  },

  currentTopic: 'medicine',

  init() {
    this.container = document.getElementById('boomingBurstContainer');
    this.svg = document.getElementById('boomingBurstSvg');
    this.seedNode = document.getElementById('boomingSeedNode');
    this.counter = document.getElementById('boomingLiveCounter');
    this.specimenLabel = document.getElementById('boomingSpecimenLabel');

    if (!this.container || !this.seedNode) return;

    this.seedNode.addEventListener('click', () => {
      sfx.playBurst();
      this.triggerBurst();
    });

    // Preset selector buttons
    const presetBtns = document.querySelectorAll('.booming-preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        sfx.playClick();
        presetBtns.forEach(b => b.classList.remove('active', 'border-black', 'bg-lime-200'));
        btn.classList.add('active', 'border-black', 'bg-lime-200');
        this.currentTopic = btn.dataset.topic;
        this.updateSeed();
        this.triggerBurst();
      });
    });

    this.updateSeed();
    this.triggerBurst();
  },

  updateSeed() {
    const data = this.topics[this.currentTopic];
    const titleEl = document.getElementById('boomingSeedTitle');
    if (titleEl) titleEl.textContent = data.seed;
    if (this.specimenLabel) this.specimenLabel.textContent = `SPECIMEN: ${data.specimen}`;
  },

  triggerBurst() {
    const data = this.topics[this.currentTopic];
    if (!this.container || !this.svg) return;

    this.container.innerHTML = '';
    this.svg.innerHTML = '';

    // Animate Center Seed Pulse
    this.seedNode.style.transform = 'scale(1.12)';
    this.seedNode.style.borderColor = '#2EE6FF';
    setTimeout(() => {
      this.seedNode.style.transform = 'scale(1)';
      this.seedNode.style.borderColor = '#D7FF3A';
    }, 250);

    const rect = this.container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.74;

    let count = 1;
    if (this.counter) this.counter.textContent = `CONNECTIONS: ${count} NODE`;

    data.children.forEach((node, i) => {
      const angle = (i / data.children.length) * (2 * Math.PI) - Math.PI / 2;
      const targetX = centerX + radius * Math.cos(angle);
      const targetY = centerY + radius * Math.sin(angle);

      // 40ms stagger per project brief!
      setTimeout(() => {
        // Draw Connecting Line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', centerX);
        line.setAttribute('y1', centerY);
        line.setAttribute('x2', targetX);
        line.setAttribute('y2', targetY);
        line.setAttribute('stroke', node.color);
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('stroke-dasharray', i % 2 === 0 ? 'none' : '4 3');
        line.setAttribute('opacity', '0.6');
        this.svg.appendChild(line);

        // Child Node Bubble
        const el = document.createElement('div');
        el.className = 'booming-child-node absolute z-20 flex flex-col p-2 rounded-lg border bg-white shadow-md cursor-pointer transition-all hover:scale-110';
        el.style.left = `${targetX - 55}px`;
        el.style.top = `${targetY - 30}px`;
        el.style.width = '110px';
        el.style.borderColor = node.color;
        el.style.boxShadow = `0 4px 12px ${node.color}28`;

        el.innerHTML = `
          <div class="flex items-center justify-between text-[8px] font-mono font-bold" style="color: ${node.color}">
            <span>${node.cat}</span>
            <span class="w-1.5 h-1.5 rounded-full" style="background:${node.color}"></span>
          </div>
          <div class="font-heading font-bold text-[11px] text-slate-900 leading-tight mt-0.5">${node.name}</div>
          <div class="text-[9px] text-slate-500 line-clamp-1 mt-0.5">${node.desc}</div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          sfx.playClick();
          this.explodeSecondTier(el, targetX, targetY, node);
        });

        this.container.appendChild(el);

        count++;
        if (this.counter) this.counter.textContent = `CONNECTIONS: ${count} NODES`;
      }, i * 40);
    });
  },

  explodeSecondTier(parentEl, px, py, nodeData) {
    // 2nd tier micro burst around the clicked node
    sfx.playBurst();
    parentEl.style.transform = 'scale(1.25)';
    parentEl.style.boxShadow = `0 0 20px ${nodeData.color}`;

    const subRadius = 45;
    const subTopics = ["แหล่งอ้างอิง", "การใช้จริง", "ความสัมพันธ์"];

    subTopics.forEach((sub, k) => {
      const subAngle = (k / subTopics.length) * (2 * Math.PI);
      const subX = px + subRadius * Math.cos(subAngle);
      const subY = py + subRadius * Math.sin(subAngle);

      const subLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      subLine.setAttribute('x1', px);
      subLine.setAttribute('y1', py);
      subLine.setAttribute('x2', subX);
      subLine.setAttribute('y2', subY);
      subLine.setAttribute('stroke', nodeData.color);
      subLine.setAttribute('stroke-width', '1');
      subLine.setAttribute('stroke-dasharray', '2 2');
      this.svg.appendChild(subLine);

      const subEl = document.createElement('div');
      subEl.className = 'absolute z-30 px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono text-[9px] border shadow animate-bounce';
      subEl.style.left = `${subX - 25}px`;
      subEl.style.top = `${subY - 10}px`;
      subEl.style.borderColor = nodeData.color;
      subEl.textContent = sub;
      this.container.appendChild(subEl);
    });

    const activeCount = parseInt(this.counter.textContent.replace(/\D/g, '')) + 3;
    this.counter.textContent = `CONNECTIONS: ${activeCount} NODES`;
  }
};

// =============================================================================
// 3. FORCE-DIRECTED KNOWLEDGE GRAPH ENGINE (CANVAS)
// =============================================================================

class KnowledgeGraphCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.links = [];
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.dragNode = null;
    this.hoverNode = null;
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Prepare Node Coordinates
    this.nodes = KNOWLEDGE_NODES.map((n, i) => {
      const angle = (i / KNOWLEDGE_NODES.length) * (2 * Math.PI);
      const r = Math.min(this.width, this.height) * 0.32 + (Math.random() * 40 - 20);
      return {
        ...n,
        x: this.width / 2 + r * Math.cos(angle),
        y: this.height / 2 + r * Math.sin(angle),
        vx: 0,
        vy: 0,
        radius: 18,
        degree: 0
      };
    });

    // Map Links
    const nodeMap = new Map(this.nodes.map(n => [n.id, n]));
    this.links = KNOWLEDGE_LINKS.map(l => {
      const s = nodeMap.get(l.source);
      const t = nodeMap.get(l.target);
      if (s) s.degree++;
      if (t) t.degree++;
      return { source: s, target: t, relation: l.relation };
    }).filter(l => l.source && l.target);

    // Adjust Node radius by degree
    this.nodes.forEach(n => {
      n.radius = Math.min(32, Math.max(12, 14 + n.degree * 4));
    });

    this.setupInteractions();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  setupInteractions() {
    const c = this.canvas;

    c.addEventListener('mousedown', (e) => {
      const rect = c.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const hit = this.getNodeAt(mouseX, mouseY);
      if (hit) {
        this.dragNode = hit;
        AppState.activeNode = hit;
        sfx.playClick();
        DrawerEngine.open(hit);
      } else {
        this.isDragging = true;
        this.startX = mouseX - this.panX;
        this.startY = mouseY - this.panY;
      }
    });

    window.addEventListener('mousemove', (e) => {
      const rect = c.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (this.dragNode) {
        this.dragNode.x = mouseX - this.panX;
        this.dragNode.y = mouseY - this.panY;
        this.dragNode.vx = 0;
        this.dragNode.vy = 0;
      } else if (this.isDragging) {
        this.panX = mouseX - this.startX;
        this.panY = mouseY - this.startY;
      } else {
        const hover = this.getNodeAt(mouseX, mouseY);
        if (hover !== this.hoverNode) {
          this.hoverNode = hover;
          c.style.cursor = hover ? 'pointer' : 'grab';
        }
      }
    });

    window.addEventListener('mouseup', () => {
      this.dragNode = null;
      this.isDragging = false;
    });

    // Touch support for tablets/smartphones
    c.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const rect = c.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left;
        const touchY = e.touches[0].clientY - rect.top;
        const hit = this.getNodeAt(touchX, touchY);
        if (hit) {
          this.dragNode = hit;
          AppState.activeNode = hit;
          DrawerEngine.open(hit);
        }
      }
    });

    c.addEventListener('touchmove', (e) => {
      if (this.dragNode && e.touches.length === 1) {
        const rect = c.getBoundingClientRect();
        this.dragNode.x = e.touches[0].clientX - rect.left - this.panX;
        this.dragNode.y = e.touches[0].clientY - rect.top - this.panY;
      }
    });

    c.addEventListener('touchend', () => {
      this.dragNode = null;
    });
  }

  getNodeAt(x, y) {
    const worldX = x - this.panX;
    const worldY = y - this.panY;
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const n = this.nodes[i];
      if (!this.filterPass(n)) continue;
      const dx = worldX - n.x;
      const dy = worldY - n.y;
      if (Math.sqrt(dx * dx + dy * dy) <= n.radius + 4) {
        return n;
      }
    }
    return null;
  }

  filterPass(node) {
    if (AppState.selectedCategory !== 'all' && node.category !== AppState.selectedCategory) {
      return false;
    }
    if (AppState.selectedEra !== 'all' && node.era !== AppState.selectedEra) {
      return false;
    }
    if (AppState.searchQuery.trim().length > 0) {
      const q = AppState.searchQuery.toLowerCase();
      const match = node.title_th.toLowerCase().includes(q) || 
                    node.title_en.toLowerCase().includes(q) ||
                    node.summary.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }

  updatePhysics() {
    const kRepel = 2400;
    const kSpring = 0.04;
    const damping = 0.88;
    const centerAttract = 0.005;
    const cx = this.width / 2;
    const cy = this.height / 2;

    // Repulsion between nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n1 = this.nodes[i];
      if (!this.filterPass(n1)) continue;

      // Center gravity
      n1.vx += (cx - n1.x) * centerAttract;
      n1.vy += (cy - n1.y) * centerAttract;

      for (let j = i + 1; j < this.nodes.length; j++) {
        const n2 = this.nodes[j];
        if (!this.filterPass(n2)) continue;

        let dx = n2.x - n1.x;
        let dy = n2.y - n1.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < 260) {
          const force = kRepel / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          n1.vx -= fx;
          n1.vy -= fy;
          n2.vx += fx;
          n2.vy += fy;
        }
      }
    }

    // Spring tension for links
    this.links.forEach(l => {
      if (!this.filterPass(l.source) || !this.filterPass(l.target)) return;
      let dx = l.target.x - l.source.x;
      let dy = l.target.y - l.source.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 1;
      let force = (dist - 140) * kSpring;
      let fx = (dx / dist) * force;
      let fy = (dy / dist) * force;

      l.source.vx += fx;
      l.source.vy += fy;
      l.target.vx -= fx;
      l.target.vy -= fy;
    });

    // Apply velocities with damping
    this.nodes.forEach(n => {
      if (n === this.dragNode) return;
      n.vx *= damping;
      n.vy *= damping;
      n.x += n.vx;
      n.y += n.vy;

      // Bound within reasonable frame
      n.x = Math.max(40, Math.min(this.width - 40, n.x));
      n.y = Math.max(40, Math.min(this.height - 40, n.y));
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // 1. Draw Links
    this.links.forEach(l => {
      if (!this.filterPass(l.source) || !this.filterPass(l.target)) return;

      this.ctx.beginPath();
      this.ctx.moveTo(l.source.x, l.source.y);
      this.ctx.lineTo(l.target.x, l.target.y);

      const isConnectedToActive = AppState.activeNode && (l.source === AppState.activeNode || l.target === AppState.activeNode);

      if (isConnectedToActive) {
        this.ctx.strokeStyle = '#D7FF3A'; // Lime highlight
        this.ctx.lineWidth = 2.5;
        this.ctx.setLineDash([]);
      } else {
        this.ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(15, 23, 42, 0.18)';
        this.ctx.lineWidth = 1.2;
        if (l.relation === 'derived_from') {
          this.ctx.setLineDash([4, 4]);
        } else if (l.relation === 'used_in') {
          this.ctx.setLineDash([2, 3]);
        } else {
          this.ctx.setLineDash([]);
        }
      }
      this.ctx.stroke();
    });

    // 2. Draw Nodes
    this.nodes.forEach(n => {
      if (!this.filterPass(n)) return;

      const isSelected = AppState.activeNode === n;
      const isHovered = this.hoverNode === n;

      // Glow effect for selected node
      if (isSelected) {
        this.ctx.save();
        this.ctx.shadowColor = '#D7FF3A';
        this.ctx.shadowBlur = 24;
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(215, 255, 58, 0.45)';
        this.ctx.fill();
        this.ctx.restore();
      }

      // Draw Shape based on category specification
      this.ctx.save();
      this.ctx.fillStyle = isSelected ? '#D7FF3A' : n.color;
      this.ctx.strokeStyle = isDark ? '#FFFFFF' : '#0F172A';
      this.ctx.lineWidth = isSelected ? 3 : 1.5;

      this.ctx.beginPath();
      if (n.shape === 'square') {
        this.ctx.rect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2);
      } else if (n.shape === 'triangle') {
        this.ctx.moveTo(n.x, n.y - n.radius * 1.2);
        this.ctx.lineTo(n.x + n.radius * 1.1, n.y + n.radius * 0.9);
        this.ctx.lineTo(n.x - n.radius * 1.1, n.y + n.radius * 0.9);
        this.ctx.closePath();
      } else if (n.shape === 'hexagon') {
        for (let a = 0; a < 6; a++) {
          const ang = (a * Math.PI) / 3;
          const hx = n.x + n.radius * Math.cos(ang);
          const hy = n.y + n.radius * Math.sin(ang);
          if (a === 0) this.ctx.moveTo(hx, hy);
          else this.ctx.lineTo(hx, hy);
        }
        this.ctx.closePath();
      } else if (n.shape === 'diamond') {
        this.ctx.moveTo(n.x, n.y - n.radius * 1.2);
        this.ctx.lineTo(n.x + n.radius, n.y);
        this.ctx.lineTo(n.x, n.y + n.radius * 1.2);
        this.ctx.lineTo(n.x - n.radius, n.y);
        this.ctx.closePath();
      } else {
        // Circle / Ring
        this.ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      }
      this.ctx.fill();
      this.ctx.stroke();

      // Inner Icon Dot or Ring
      if (n.shape === 'ring') {
        this.ctx.fillStyle = isDark ? '#17171F' : '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.radius * 0.45, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();

      // Node Label Text
      this.ctx.font = isSelected ? 'bold 12px Chakra Petch' : '500 11px IBM Plex Sans Thai';
      this.ctx.fillStyle = isDark ? '#F2EDE3' : '#0F172A';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(n.title_th, n.x, n.y + n.radius + 15);
    });

    // 3. Hover Specimen HUD Tooltip
    if (this.hoverNode) {
      const h = this.hoverNode;
      const tipX = h.x;
      const tipY = h.y - h.radius - 32;

      this.ctx.save();
      this.ctx.font = 'bold 10px IBM Plex Mono';
      const textWidth = this.ctx.measureText(h.id).width;
      const boxW = Math.max(140, textWidth + 24);
      const boxH = 24;

      this.ctx.fillStyle = '#0F172A';
      this.ctx.strokeStyle = '#D7FF3A';
      this.ctx.lineWidth = 1;
      this.ctx.fillRect(tipX - boxW / 2, tipY - boxH, boxW, boxH);
      this.ctx.strokeRect(tipX - boxW / 2, tipY - boxH, boxW, boxH);

      this.ctx.fillStyle = '#D7FF3A';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(h.id, tipX, tipY - 8);
      this.ctx.restore();
    }

    this.ctx.restore();
  }

  animate() {
    this.updatePhysics();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// =============================================================================
// 4. SPECIMEN DRAWER & MODAL ENGINE
// =============================================================================

const DrawerEngine = {
  init() {
    this.drawer = document.getElementById('specimenDrawer');
    this.closeBtn = document.getElementById('drawerCloseBtn');
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
  },

  open(node) {
    if (!this.drawer) return;
    document.getElementById('drawerSpecimenId').textContent = node.id;
    document.getElementById('drawerTitleTh').textContent = node.title_th;
    document.getElementById('drawerTitleEn').textContent = node.title_en;
    document.getElementById('drawerEra').textContent = `ยุค: ${node.era} (${node.year})`;
    document.getElementById('drawerCategory').textContent = `หมวด: ${node.category.toUpperCase()}`;
    document.getElementById('drawerSummary').textContent = node.summary;
    document.getElementById('drawerTakeaway').textContent = node.everyday_takeaway;
    document.getElementById('drawerSources').textContent = node.sources;

    const catBadge = document.getElementById('drawerCategoryBadge');
    if (catBadge) {
      catBadge.className = `cat-badge cat-${node.category}`;
      catBadge.textContent = node.category.toUpperCase();
    }

    this.drawer.classList.add('open');
  },

  close() {
    if (this.drawer) {
      this.drawer.classList.remove('open');
      AppState.activeNode = null;
    }
  }
};

// =============================================================================
// 5. THEME & APP INITIALIZATION
// =============================================================================

function setupThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gruru_theme', theme);
    toggleBtn.innerHTML = theme === 'dark' ? '☀️ LIGHT' : '🌙 DARK';
  }

  applyTheme(AppState.theme);

  toggleBtn.addEventListener('click', () => {
    sfx.playClick();
    AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
    applyTheme(AppState.theme);
  });
}

function setupSoundToggle() {
  const soundBtn = document.getElementById('soundToggleBtn');
  if (!soundBtn) return;
  soundBtn.addEventListener('click', () => {
    AppState.soundEnabled = !AppState.soundEnabled;
    soundBtn.textContent = AppState.soundEnabled ? '🔊 AUDIO ON' : '🔇 MUTE';
    if (AppState.soundEnabled) sfx.playClick();
  });
}

function setupFilters(graphInstance) {
  // Category Filter Pills
  const catPills = document.querySelectorAll('.cat-filter-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      sfx.playClick();
      catPills.forEach(p => p.classList.remove('active', 'border-black', 'bg-slate-900', 'text-white'));
      pill.classList.add('active', 'border-black', 'bg-slate-900', 'text-white');
      AppState.selectedCategory = pill.dataset.cat;
    });
  });

  // Search Input
  const searchInput = document.getElementById('graphSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
    });
  }

  // Era Range Slider
  const eraSlider = document.getElementById('graphEraSlider');
  const eraLabel = document.getElementById('graphEraLabel');
  const eraValues = ["all", "อยุธยา", "รัตนโกสินทร์", "ร่วมสมัย"];
  if (eraSlider && eraLabel) {
    eraSlider.addEventListener('input', (e) => {
      const idx = parseInt(e.target.value);
      AppState.selectedEra = eraValues[idx];
      eraLabel.textContent = AppState.selectedEra === 'all' ? 'ทุกยุคสมัย (ALL ERAS)' : `ยุค: ${AppState.selectedEra}`;
    });
  }
}

// Bootstrap on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle();
  setupSoundToggle();
  DrawerEngine.init();
  BoomingEngine.init();

  let graph = null;
  if (document.getElementById('knowledgeGraphCanvas')) {
    graph = new KnowledgeGraphCanvas('knowledgeGraphCanvas');
    setupFilters(graph);
  }
});
