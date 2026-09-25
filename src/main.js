import * as THREE from 'three';
import './styles.css';

const GAME = {
  goalWidth: 7.32,
  goalHeight: 2.44,
  goalZ: -13,
  goalBackZ: -15,
  targetZ: -12.78,
  ballStart: new THREE.Vector3(0, 0.235, 5.35),
  kicksPerRound: 5,
};

const copy = {
  ar: {
    title: 'أساطير الركلات',
    kicker: 'PENALTY LEGENDS',
    round: 'الركلة', score: 'الأهداف', best: 'أفضل نتيجة',
    aimEyebrow: 'دقة التسديد', aimTitle: 'وجّه المؤشر نحو المرمى',
    aimHint: 'انقر أو حرّك المؤشر داخل المرمى لاختيار الزاوية.',
    power: 'قوة التسديد', shoot: 'سدّد الآن',
    footer: 'انقر داخل المرمى للتصويب • SPACE للتسديد',
    startEyebrow: 'بطولة ركلات الجزاء',
    startTitle: 'هل تملك أعصاب البطل؟',
    startCopy: 'اختر زاوية التسديد، اضبط قوتك، وتغلّب على الحارس في خمس ركلات حاسمة.',
    tipAim: 'حدّد الزاوية داخل المرمى', tipPower: 'اضبط القوة المناسبة', tipShoot: 'سدّد واصنع الفارق',
    start: 'ابدأ البطولة', footnote: 'لعبة أصلية • دون شعارات أو أسماء أندية حقيقية',
    goal: 'هـــــدف!', save: 'تصدى لها الحارس!', ready: 'اختر زاوية التسديد',
    finalEyebrow: 'نتيجة البطولة', finalPerfect: 'أداء أسطوري!', finalGreat: 'نتيجة قوية!', finalTry: 'البطولة التالية بانتظارك',
    finalPerfectCopy: 'خمس ركلات، خمس أهداف. لقد صنعت ليلة لا تُنسى!',
    finalGreatCopy: 'قرارات ذكية تحت الضغط. اقتربت كثيرًا من الكمال.',
    finalTryCopy: 'الحارس كان صعبًا، لكن كل بطل يعود أقوى في الجولة التالية.',
    playAgain: 'العب من جديد', finalScore: 'سجلت {score} من 5',
    soundOn: 'إيقاف الصوت', soundOff: 'تشغيل الصوت', fullScreen: 'ملء الشاشة',
    canvas: 'ملعب لعبة ركلات الجزاء ثلاثي الأبعاد',
  },
  en: {
    title: 'Penalty Legends',
    kicker: 'PENALTY LEGENDS',
    round: 'KICK', score: 'GOALS', best: 'BEST',
    aimEyebrow: 'SHOT PRECISION', aimTitle: 'Aim anywhere in the goal',
    aimHint: 'Click or move across the goal to choose your corner.',
    power: 'SHOT POWER', shoot: 'TAKE THE SHOT',
    footer: 'Click inside the goal to aim • SPACE to shoot',
    startEyebrow: 'PENALTY SHOOTOUT',
    startTitle: 'Do you have champion nerves?',
    startCopy: 'Pick a corner, set your power, and beat the keeper across five decisive kicks.',
    tipAim: 'Pick your corner', tipPower: 'Set your power', tipShoot: 'Make your moment',
    start: 'START THE SHOOTOUT', footnote: 'Original game • no real club names or logos',
    goal: 'GOAL!', save: 'SAVED BY THE KEEPER!', ready: 'Choose your corner',
    finalEyebrow: 'SHOOTOUT RESULT', finalPerfect: 'Legendary performance!', finalGreat: 'A strong finish!', finalTry: 'The next shootout awaits',
    finalPerfectCopy: 'Five kicks, five goals. You made it a night to remember.',
    finalGreatCopy: 'Smart choices under pressure. You came very close to perfection.',
    finalTryCopy: 'The keeper was tough, but every champion returns stronger next round.',
    playAgain: 'PLAY AGAIN', finalScore: 'You scored {score} out of 5',
    soundOn: 'Mute sound', soundOff: 'Enable sound', fullScreen: 'Fullscreen',
    canvas: '3D penalty shootout stadium',
  },
};

const ui = {
  canvas: document.querySelector('#game-canvas'),
  brandKicker: document.querySelector('#brandKicker'),
  brandTitle: document.querySelector('#brandTitle'),
  roundLabel: document.querySelector('#roundLabel'),
  roundValue: document.querySelector('#roundValue'),
  roundTotal: document.querySelector('#roundTotal'),
  scoreLabel: document.querySelector('#scoreLabel'),
  scoreValue: document.querySelector('#scoreValue'),
  bestLabel: document.querySelector('#bestLabel'),
  bestValue: document.querySelector('#bestValue'),
  shotsTrack: document.querySelector('#shotsTrack'),
  aimCard: document.querySelector('.aim-card'),
  aimEyebrow: document.querySelector('#aimEyebrow'),
  aimTitle: document.querySelector('#aimTitle'),
  aimHint: document.querySelector('#aimHint'),
  powerLabel: document.querySelector('#powerLabel'),
  powerRange: document.querySelector('#powerRange'),
  powerValue: document.querySelector('#powerValue'),
  shootButton: document.querySelector('#shootButton'),
  shootText: document.querySelector('#shootText'),
  shootShortcut: document.querySelector('#shootShortcut'),
  overlay: document.querySelector('#overlay'),
  overlayEyebrow: document.querySelector('#overlayEyebrow'),
  overlayTitle: document.querySelector('#overlayTitle'),
  overlayCopy: document.querySelector('#overlayCopy'),
  howTo: document.querySelector('#howTo'),
  tipAim: document.querySelector('#tipAim'),
  tipPower: document.querySelector('#tipPower'),
  tipShoot: document.querySelector('#tipShoot'),
  startButton: document.querySelector('#startButton'),
  startText: document.querySelector('#startText'),
  overlayFootnote: document.querySelector('#overlayFootnote'),
  footer: document.querySelector('#footerNote'),
  status: document.querySelector('#statusMessage'),
  languageToggle: document.querySelector('#languageToggle'),
  soundToggle: document.querySelector('#soundToggle'),
  soundIcon: document.querySelector('#soundIcon'),
  fullscreenToggle: document.querySelector('#fullscreenToggle'),
};

const state = {
  language: getStored('pl3d-language', 'ar'),
  bestScore: Number.parseInt(getStored('pl3d-best-score', '0'), 10) || 0,
  phase: 'intro',
  kick: 1,
  score: 0,
  results: [],
  power: 68,
  target: { x: 0, y: 1.34 },
  shot: null,
  statusTimer: null,
  advanceTimer: null,
  audioContext: null,
  soundEnabled: true,
};

function getStored(key, fallback) {
  try { return window.localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

function setStored(key, value) {
  try { window.localStorage.setItem(key, String(value)); } catch { /* storage is optional */ }
}

function t() { return copy[state.language]; }

function setLanguage(language) {
  state.language = language;
  setStored('pl3d-language', language);
  const text = t();
  const rtl = language === 'ar';
  document.documentElement.lang = language;
  document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  document.title = language === 'ar' ? 'أساطير الركلات 3D' : 'Penalty Legends 3D';
  ui.canvas.setAttribute('aria-label', text.canvas);
  ui.brandKicker.textContent = text.kicker;
  ui.brandTitle.innerHTML = `${text.title} <em>3D</em>`;
  ui.roundLabel.textContent = text.round;
  ui.scoreLabel.textContent = text.score;
  ui.bestLabel.textContent = text.best;
  ui.aimEyebrow.textContent = text.aimEyebrow;
  ui.aimTitle.textContent = text.aimTitle;
  ui.aimHint.textContent = text.aimHint;
  ui.powerLabel.textContent = text.power;
  ui.shootText.textContent = text.shoot;
  ui.shootShortcut.textContent = 'SPACE';
  ui.footer.textContent = text.footer;
  ui.tipAim.textContent = text.tipAim;
  ui.tipPower.textContent = text.tipPower;
  ui.tipShoot.textContent = text.tipShoot;
  ui.overlayFootnote.textContent = text.footnote;
  ui.languageToggle.textContent = rtl ? 'EN' : 'ع';
  ui.languageToggle.setAttribute('aria-label', rtl ? 'Switch to English' : 'التبديل إلى العربية');
  ui.soundToggle.setAttribute('aria-label', state.soundEnabled ? text.soundOn : text.soundOff);
  ui.fullscreenToggle.setAttribute('aria-label', text.fullScreen);
  updateOverlay();
  renderUI();
}

function renderUI() {
  const text = t();
  ui.roundValue.textContent = state.kick;
  ui.roundTotal.textContent = `/ ${GAME.kicksPerRound}`;
  ui.scoreValue.textContent = state.score;
  ui.bestValue.textContent = state.bestScore;
  ui.powerValue.textContent = `${state.power}%`;
  ui.powerRange.value = state.power;
  ui.shootButton.disabled = state.phase !== 'ready';
  ui.aimCard.classList.toggle('is-disabled', state.phase !== 'ready');

  const slots = Array.from({ length: GAME.kicksPerRound }, (_, index) => {
    const result = state.results[index];
    const slot = document.createElement('span');
    slot.className = `shot-slot ${result || ''} ${index === state.results.length && state.phase !== 'finished' ? 'current' : ''}`;
    slot.title = result === 'goal' ? text.goal : result === 'save' ? text.save : '';
    return slot;
  });
  ui.shotsTrack.replaceChildren(...slots);
}

function updateOverlay() {
  const text = t();
  if (state.phase === 'finished') {
    const score = state.score;
    ui.overlayEyebrow.textContent = text.finalEyebrow;
    ui.overlayTitle.textContent = score === 5 ? text.finalPerfect : score >= 3 ? text.finalGreat : text.finalTry;
    ui.overlayCopy.textContent = score === 5 ? text.finalPerfectCopy : score >= 3 ? text.finalGreatCopy : text.finalTryCopy;
    ui.startText.textContent = text.playAgain;
    ui.howTo.hidden = true;
    ui.overlayFootnote.textContent = text.finalScore.replace('{score}', score);
  } else {
    ui.overlayEyebrow.textContent = text.startEyebrow;
    ui.overlayTitle.textContent = text.startTitle;
    ui.overlayCopy.textContent = text.startCopy;
    ui.startText.textContent = text.start;
    ui.howTo.hidden = false;
    ui.overlayFootnote.textContent = text.footnote;
  }
}

function showOverlay() { ui.overlay.classList.remove('is-hidden'); }
function hideOverlay() { ui.overlay.classList.add('is-hidden'); }

function showStatus(message, kind) {
  window.clearTimeout(state.statusTimer);
  ui.status.textContent = message;
  ui.status.className = `status-message show ${kind}`;
  state.statusTimer = window.setTimeout(() => ui.status.className = 'status-message', 1180);
}

// ----- Three.js scene ------------------------------------------------------

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x071b14);
scene.fog = new THREE.FogExp2(0x071b14, 0.021);

const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 150);
camera.position.set(0, 2.45, 11.8);
const cameraLook = new THREE.Vector3(0, 1.28, -5.7);

const renderer = new THREE.WebGLRenderer({ canvas: ui.canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const world = new THREE.Group();
scene.add(world);

const hemisphere = new THREE.HemisphereLight(0xbde6ff, 0x0b3e21, 2.35);
world.add(hemisphere);
const keyLight = new THREE.DirectionalLight(0xfff0c5, 2.4);
keyLight.position.set(-10, 17, 8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = -22;
keyLight.shadow.camera.right = 22;
keyLight.shadow.camera.top = 18;
keyLight.shadow.camera.bottom = -8;
world.add(keyLight);
const rimLight = new THREE.DirectionalLight(0x92eec2, 1.1);
rimLight.position.set(13, 9, -18);
world.add(rimLight);

const materials = {
  grass: new THREE.MeshStandardMaterial({ color: 0x146437, roughness: 0.97, metalness: 0 }),
  grassAlt: new THREE.MeshStandardMaterial({ color: 0x0e4f2d, roughness: 1 }),
  line: new THREE.MeshStandardMaterial({ color: 0xf2ffe7, roughness: 0.84, emissive: 0x263926, emissiveIntensity: 0.12 }),
  post: new THREE.MeshStandardMaterial({ color: 0xf8fff5, metalness: 0.15, roughness: 0.32, emissive: 0x3d553e, emissiveIntensity: 0.12 }),
  net: new THREE.LineBasicMaterial({ color: 0xd9f8ce, transparent: true, opacity: 0.34 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x07170f, roughness: 0.9 }),
  stand: new THREE.MeshStandardMaterial({ color: 0x092217, roughness: 0.85 }),
};

function addCylinderBetween(parent, a, b, radius, material) {
  const direction = new THREE.Vector3().subVectors(b, a);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 10), material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addFieldLine(x, z, width, depth) {
  const line = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), materials.line);
  line.rotation.x = -Math.PI / 2;
  line.position.set(x, 0.012, z);
  line.receiveShadow = true;
  world.add(line);
  return line;
}

function createPitch() {
  const field = new THREE.Mesh(new THREE.PlaneGeometry(48, 88), materials.grass);
  field.rotation.x = -Math.PI / 2;
  field.position.z = -6;
  field.receiveShadow = true;
  world.add(field);

  for (let index = 0; index < 18; index += 1) {
    const stripe = new THREE.Mesh(new THREE.PlaneGeometry(48, 4.9), index % 2 ? materials.grassAlt : materials.grass);
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(0, 0.004, 35.5 - index * 4.9);
    stripe.receiveShadow = true;
    world.add(stripe);
  }

  addFieldLine(0, GAME.goalZ + 0.12, GAME.goalWidth + 0.1, 0.11);
  addFieldLine(0, -7.55, 14.6, 0.12);
  addFieldLine(-7.24, -10.27, 0.12, 5.55);
  addFieldLine(7.24, -10.27, 0.12, 5.55);
  addFieldLine(0, -3.85, 8.6, 0.1);
  addFieldLine(-4.26, -5.69, 0.1, 3.78);
  addFieldLine(4.26, -5.69, 0.1, 3.78);
  const spot = new THREE.Mesh(new THREE.CircleGeometry(0.14, 22), materials.line);
  spot.rotation.x = -Math.PI / 2;
  spot.position.set(0, 0.017, 5.28);
  world.add(spot);
  const arc = new THREE.Mesh(new THREE.RingGeometry(4.75, 4.86, 56, 1, 0.28, Math.PI - 0.56), materials.line);
  arc.rotation.x = -Math.PI / 2;
  arc.position.set(0, 0.012, 0.43);
  world.add(arc);
}

function createStadiumSign(text, width = 12) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0b2719';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#b6f475';
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 6;
  ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#e8ffba';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 78px sans-serif';
  ctx.fillText(text, canvas.width / 2, 80);
  ctx.font = '600 23px sans-serif';
  ctx.fillStyle = '#ffce58';
  ctx.fillText('FIVE KICKS · ONE MOMENT', canvas.width / 2, 135);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(width, width * 0.176), new THREE.MeshBasicMaterial({ map: texture }));
  sign.position.set(0, 5.25, -21.7);
  world.add(sign);
}

function createStadium() {
  const rearStand = new THREE.Mesh(new THREE.BoxGeometry(31, 4.3, 4.8), materials.stand);
  rearStand.position.set(0, 1.75, -23);
  rearStand.castShadow = true;
  rearStand.receiveShadow = true;
  world.add(rearStand);

  const seatGeometry = new THREE.BoxGeometry(0.46, 0.18, 0.42);
  const seatMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x355ea2, roughness: 0.74 }),
    new THREE.MeshStandardMaterial({ color: 0x1e8d66, roughness: 0.74 }),
    new THREE.MeshStandardMaterial({ color: 0xc76b45, roughness: 0.74 }),
    new THREE.MeshStandardMaterial({ color: 0xd2a83c, roughness: 0.74 }),
  ];
  for (let row = 0; row < 7; row += 1) {
    for (let column = -29; column <= 29; column += 1) {
      if (Math.abs(column) < 3 && row < 2) continue;
      const seat = new THREE.Mesh(seatGeometry, seatMaterials[(column + row * 2 + 40) % seatMaterials.length]);
      seat.position.set(column * 0.5, 0.58 + row * 0.36, -20.25 - row * 0.49);
      seat.rotation.x = -0.17;
      seat.castShadow = true;
      world.add(seat);
    }
  }

  const facade = new THREE.Mesh(new THREE.BoxGeometry(31.5, 0.42, 0.34), new THREE.MeshStandardMaterial({ color: 0x133d27, emissive: 0x123f26, emissiveIntensity: 0.4 }));
  facade.position.set(0, 4.65, -20.08);
  world.add(facade);
  createStadiumSign('PENALTY LEGENDS');

  [-14.5, 14.5].forEach((x) => {
    const tower = new THREE.Group();
    addCylinderBetween(tower, new THREE.Vector3(x, 0, -13), new THREE.Vector3(x, 8.2, -13), 0.1, new THREE.MeshStandardMaterial({ color: 0x244d3b, metalness: 0.3, roughness: 0.45 }));
    const lampFrame = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.75, 0.32), new THREE.MeshStandardMaterial({ color: 0x152c24, metalness: 0.35, roughness: 0.38 }));
    lampFrame.position.set(x, 8.15, -13);
    tower.add(lampFrame);
    for (let i = -2; i <= 2; i += 1) {
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.12), new THREE.MeshStandardMaterial({ color: 0xdfffc2, emissive: 0xdfffc2, emissiveIntensity: 2 }));
      lamp.position.set(x + i * 0.48, 8.16, -12.78);
      tower.add(lamp);
    }
    world.add(tower);
  });

  const sideWallMaterial = new THREE.MeshStandardMaterial({ color: 0x0b2a1c, roughness: 0.9 });
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.5, 47), sideWallMaterial);
  leftWall.position.set(-24.4, 1.65, -4.8);
  const rightWall = leftWall.clone();
  rightWall.position.x = 24.4;
  world.add(leftWall, rightWall);
}

function createGoal() {
  const goal = new THREE.Group();
  const half = GAME.goalWidth / 2;
  const front = GAME.goalZ;
  const back = GAME.goalBackZ;
  addCylinderBetween(goal, new THREE.Vector3(-half, 0, front), new THREE.Vector3(-half, GAME.goalHeight, front), 0.075, materials.post);
  addCylinderBetween(goal, new THREE.Vector3(half, 0, front), new THREE.Vector3(half, GAME.goalHeight, front), 0.075, materials.post);
  addCylinderBetween(goal, new THREE.Vector3(-half, GAME.goalHeight, front), new THREE.Vector3(half, GAME.goalHeight, front), 0.075, materials.post);
  addCylinderBetween(goal, new THREE.Vector3(-half, GAME.goalHeight, front), new THREE.Vector3(-half, GAME.goalHeight, back), 0.052, materials.post);
  addCylinderBetween(goal, new THREE.Vector3(half, GAME.goalHeight, front), new THREE.Vector3(half, GAME.goalHeight, back), 0.052, materials.post);
  addCylinderBetween(goal, new THREE.Vector3(-half, GAME.goalHeight, back), new THREE.Vector3(half, GAME.goalHeight, back), 0.052, materials.post);
  addCylinderBetween(goal, new THREE.Vector3(-half, 0, front), new THREE.Vector3(-half, 0, back), 0.052, materials.post);
  addCylinderBetween(goal, new THREE.Vector3(half, 0, front), new THREE.Vector3(half, 0, back), 0.052, materials.post);

  const netPoints = [];
  const addNetSegment = (a, b) => netPoints.push(a.x, a.y, a.z, b.x, b.y, b.z);
  for (let x = -half; x <= half + 0.01; x += 0.47) {
    addNetSegment(new THREE.Vector3(x, 0, back), new THREE.Vector3(x, GAME.goalHeight, back));
  }
  for (let y = 0; y <= GAME.goalHeight + 0.01; y += 0.35) {
    addNetSegment(new THREE.Vector3(-half, y, back), new THREE.Vector3(half, y, back));
  }
  for (let x = -half; x <= half + 0.01; x += 0.68) {
    addNetSegment(new THREE.Vector3(x, GAME.goalHeight, front), new THREE.Vector3(x, GAME.goalHeight, back));
    addNetSegment(new THREE.Vector3(x, 0, front), new THREE.Vector3(x, 0, back));
  }
  for (let y = 0; y <= GAME.goalHeight + 0.01; y += 0.47) {
    addNetSegment(new THREE.Vector3(-half, y, front), new THREE.Vector3(-half, y, back));
    addNetSegment(new THREE.Vector3(half, y, front), new THREE.Vector3(half, y, back));
  }
  const netGeometry = new THREE.BufferGeometry();
  netGeometry.setAttribute('position', new THREE.Float32BufferAttribute(netPoints, 3));
  goal.add(new THREE.LineSegments(netGeometry, materials.net));
  world.add(goal);
}

function createBallTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f8fff4';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#cbd5c7';
  ctx.lineWidth = 3;
  for (let x = 0; x <= 512; x += 64) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
  }
  for (let y = 0; y <= 256; y += 64) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
  }
  const pentagon = (x, y, radius) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i += 1) {
      const angle = -Math.PI / 2 + i * (Math.PI * 2 / 5);
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = '#123526';
    ctx.fill();
  };
  [[65, 46], [185, 116], [305, 42], [422, 123], [70, 206], [298, 205], [487, 230]].forEach(([x, y]) => pentagon(x, y, 22));
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createBall() {
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.23, 32, 24),
    new THREE.MeshStandardMaterial({ map: createBallTexture(), roughness: 0.46, metalness: 0.02 }),
  );
  ball.position.copy(GAME.ballStart);
  ball.castShadow = true;
  ball.receiveShadow = true;
  world.add(ball);
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.26, 28),
    new THREE.MeshBasicMaterial({ color: 0x001007, transparent: true, opacity: 0.4, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(GAME.ballStart.x, 0.019, GAME.ballStart.z);
  world.add(shadow);
  return { mesh: ball, shadow };
}

function createGoalkeeper() {
  const group = new THREE.Group();
  const kit = new THREE.MeshStandardMaterial({ color: 0xef714e, roughness: 0.6, metalness: 0.02 });
  const kitDark = new THREE.MeshStandardMaterial({ color: 0x17251e, roughness: 0.75 });
  const skin = new THREE.MeshStandardMaterial({ color: 0x9b5e3d, roughness: 0.75 });
  const gloves = new THREE.MeshStandardMaterial({ color: 0xe7ffd4, roughness: 0.5 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.33, 0.73, 5, 12), kit);
  body.position.y = 1.24;
  body.castShadow = true;
  group.add(body);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 8, 20), kitDark);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 1.68;
  group.add(collar);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 14), skin);
  head.position.y = 1.88;
  head.castShadow = true;
  group.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.245, 18, 8, 0, Math.PI * 2, 0, Math.PI * 0.45), new THREE.MeshStandardMaterial({ color: 0x16100c, roughness: 0.95 }));
  hair.position.y = 1.98;
  group.add(hair);
  const shorts = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.28, 0.34), kitDark);
  shorts.position.y = 0.82;
  shorts.castShadow = true;
  group.add(shorts);

  const leftArm = new THREE.Group();
  const rightArm = new THREE.Group();
  [leftArm, rightArm].forEach((arm, index) => {
    const sign = index === 0 ? -1 : 1;
    arm.position.set(sign * 0.34, 1.56, 0);
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.65, 10), kit);
    upper.position.y = -0.28;
    upper.castShadow = true;
    arm.add(upper);
    const glove = new THREE.Mesh(new THREE.SphereGeometry(0.145, 12, 10), gloves);
    glove.position.y = -0.64;
    glove.scale.set(1.15, 0.88, 0.94);
    glove.castShadow = true;
    arm.add(glove);
    group.add(arm);
  });

  const leftLeg = new THREE.Group();
  const rightLeg = new THREE.Group();
  [leftLeg, rightLeg].forEach((leg, index) => {
    const sign = index === 0 ? -1 : 1;
    leg.position.set(sign * 0.17, 0.72, 0);
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.12, 0.62, 10), kitDark);
    shin.position.y = -0.29;
    shin.castShadow = true;
    leg.add(shin);
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.33), new THREE.MeshStandardMaterial({ color: 0x0a1110, roughness: 0.68 }));
    boot.position.set(0, -0.62, 0.08);
    boot.castShadow = true;
    leg.add(boot);
    group.add(leg);
  });
  group.position.set(0, 0.64, -12.28);
  group.scale.set(1.08, 1.08, 1.08);
  group.traverse((node) => { if (node.isMesh) node.castShadow = true; });
  world.add(group);
  return { group, leftArm, rightArm, leftLeg, rightLeg, baseY: 0.64 };
}

function createTargeting() {
  const targetPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(GAME.goalWidth - 0.2, GAME.goalHeight - 0.1),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }),
  );
  targetPlane.position.set(0, GAME.goalHeight / 2, GAME.targetZ);
  world.add(targetPlane);

  const reticle = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.024, 8, 32), new THREE.MeshBasicMaterial({ color: 0xffd55e, transparent: true, opacity: 0.95 }));
  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.035, 18), new THREE.MeshBasicMaterial({ color: 0xfff4a7 }));
  dot.position.z = 0.01;
  reticle.add(ring, dot);
  reticle.position.set(0, 1.34, GAME.targetZ + 0.012);
  world.add(reticle);

  const aimGeometry = new THREE.BufferGeometry().setFromPoints([GAME.ballStart, reticle.position]);
  const aimLine = new THREE.Line(aimGeometry, new THREE.LineDashedMaterial({ color: 0xd9ff93, dashSize: 0.16, gapSize: 0.11, transparent: true, opacity: 0.52 }));
  aimLine.computeLineDistances();
  world.add(aimLine);
  return { targetPlane, reticle, ring, aimLine };
}

createPitch();
createStadium();
createGoal();
const ball = createBall();
const keeper = createGoalkeeper();
const aiming = createTargeting();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const confetti = [];
const tempVector = new THREE.Vector3();

function updateAimVisuals() {
  const { x, y } = state.target;
  aiming.reticle.position.set(x, y, GAME.targetZ + 0.012);
  aiming.aimLine.geometry.setFromPoints([ball.mesh.position, aiming.reticle.position]);
  aiming.aimLine.computeLineDistances();
}

function resetBall() {
  ball.mesh.position.copy(GAME.ballStart);
  ball.mesh.rotation.set(0.13, Math.random() * Math.PI, 0);
  ball.mesh.scale.setScalar(1);
  ball.shadow.position.set(GAME.ballStart.x, 0.019, GAME.ballStart.z);
  ball.shadow.scale.setScalar(1);
  ball.shadow.material.opacity = 0.4;
}

function resetKeeper() {
  keeper.group.position.set(0, keeper.baseY, -12.28);
  keeper.group.rotation.set(0, 0, 0);
  keeper.leftArm.rotation.set(0, 0, -0.12);
  keeper.rightArm.rotation.set(0, 0, 0.12);
  keeper.leftLeg.rotation.set(0, 0, 0);
  keeper.rightLeg.rotation.set(0, 0, 0);
}

function updateBallShadow() {
  const height = Math.max(0, ball.mesh.position.y);
  const scale = THREE.MathUtils.clamp(1.24 - height * 0.29, 0.38, 1.1);
  ball.shadow.position.set(ball.mesh.position.x, 0.019, ball.mesh.position.z);
  ball.shadow.scale.set(scale, scale * 0.62, 1);
  ball.shadow.material.opacity = THREE.MathUtils.clamp(0.46 - height * 0.1, 0.06, 0.42);
}

function setAimFromPointer(event) {
  if (state.phase !== 'ready') return;
  const bounds = ui.canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(aiming.targetPlane, false)[0];
  if (!hit) return;
  state.target.x = THREE.MathUtils.clamp(hit.point.x, -3.33, 3.33);
  state.target.y = THREE.MathUtils.clamp(hit.point.y, 0.28, 2.22);
  updateAimVisuals();
}

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value * value * value : 1 - ((-2 * value + 2) ** 3) / 2;
}

function flightPoint(from, to, progress, arc, output = new THREE.Vector3()) {
  output.lerpVectors(from, to, easeInOutCubic(progress));
  output.y += Math.sin(Math.PI * progress) * arc;
  return output;
}

function prepareKick() {
  window.clearTimeout(state.advanceTimer);
  state.phase = 'ready';
  state.shot = null;
  resetBall();
  resetKeeper();
  state.target = { x: THREE.MathUtils.randFloatSpread(0.9), y: THREE.MathUtils.randFloat(0.84, 1.8) };
  aiming.reticle.visible = true;
  aiming.aimLine.visible = true;
  updateAimVisuals();
  renderUI();
}

function startTournament() {
  window.clearTimeout(state.advanceTimer);
  window.clearTimeout(state.statusTimer);
  state.kick = 1;
  state.score = 0;
  state.results = [];
  state.phase = 'ready';
  hideOverlay();
  prepareKick();
  ensureAudio();
  playWhistle();
  window.setTimeout(() => showStatus(t().ready, 'goal'), 340);
}

function calculateSaveChance(target, power) {
  const horizontalCentrality = 1 - Math.min(1, Math.abs(target.x) / 3.33);
  const verticalCentrality = 1 - Math.min(1, Math.abs(target.y - 1.27) / 1.16);
  const centrality = horizontalCentrality * 0.64 + verticalCentrality * 0.36;
  const roundPressure = (state.kick - 1) * 0.058;
  const powerAdvantage = Math.max(0, power - 58) * 0.0024;
  return THREE.MathUtils.clamp(0.2 + centrality * 0.27 + roundPressure - powerAdvantage, 0.17, 0.7);
}

function takeShot() {
  if (state.phase !== 'ready') return;
  ensureAudio();
  state.phase = 'shooting';
  aiming.reticle.visible = false;
  aiming.aimLine.visible = false;
  const target = new THREE.Vector3(state.target.x, state.target.y, GAME.targetZ - 0.05);
  const saved = Math.random() < calculateSaveChance(state.target, state.power);
  const keeperStartX = keeper.group.position.x;
  const saveX = saved ? THREE.MathUtils.clamp(state.target.x + THREE.MathUtils.randFloat(-0.22, 0.22), -3.0, 3.0) : THREE.MathUtils.clamp(keeperStartX + THREE.MathUtils.randFloat(-2.4, 2.4), -2.9, 2.9);
  const saveY = saved ? THREE.MathUtils.clamp(state.target.y + THREE.MathUtils.randFloat(-0.16, 0.16), 0.45, 2.05) : THREE.MathUtils.randFloat(0.65, 1.8);
  const impact = saved ? new THREE.Vector3(saveX, saveY, -12.12) : target;
  const deflectionDirection = Math.sign(saveX || THREE.MathUtils.randFloatSpread(1)) || 1;
  const end = saved
    ? new THREE.Vector3(saveX + deflectionDirection * THREE.MathUtils.randFloat(0.7, 1.35), 0.2, -10.85)
    : new THREE.Vector3(target.x * 0.97, Math.max(0.27, target.y - 0.3), -14.38);
  const arc = 0.34 + (100 - state.power) * 0.009 + Math.max(0, target.y - 1.7) * 0.15;
  state.shot = {
    start: performance.now(),
    duration: 0.78 + (100 - state.power) * 0.0054,
    from: GAME.ballStart.clone(),
    impact,
    end,
    arc,
    saved,
    keeperStartX,
    keeperDiveX: saved ? saveX : saveX,
    keeperDiveY: saved ? saveY : saveY,
    resolved: false,
    lastProgress: 0,
  };
  playKick();
  renderUI();
}

function resolveShot() {
  const shot = state.shot;
  if (!shot || shot.resolved) return;
  shot.resolved = true;
  state.phase = 'result';
  const result = shot.saved ? 'save' : 'goal';
  state.results.push(result);
  if (!shot.saved) state.score += 1;
  renderUI();
  if (shot.saved) {
    showStatus(t().save, 'save');
    playSaveSound();
  } else {
    showStatus(t().goal, 'goal');
    playGoalSound();
    spawnConfetti(shot.impact);
  }

  state.advanceTimer = window.setTimeout(() => {
    if (state.kick < GAME.kicksPerRound) {
      state.kick += 1;
      prepareKick();
    } else {
      finishTournament();
    }
  }, 1480);
}

function finishTournament() {
  state.phase = 'finished';
  state.bestScore = Math.max(state.bestScore, state.score);
  setStored('pl3d-best-score', state.bestScore);
  updateOverlay();
  renderUI();
  showOverlay();
}

function updateKeeper(elapsed, delta) {
  const shot = state.shot;
  if (state.phase === 'ready') {
    const sway = Math.sin(elapsed * 1.58) * 1.12;
    keeper.group.position.x = THREE.MathUtils.lerp(keeper.group.position.x, sway, Math.min(1, delta * 3.6));
    keeper.group.position.y = keeper.baseY + Math.sin(elapsed * 3.2) * 0.018;
    keeper.group.rotation.z = Math.sin(elapsed * 2.9) * 0.023;
    keeper.leftArm.rotation.z = -0.12 - Math.sin(elapsed * 3.7) * 0.13;
    keeper.rightArm.rotation.z = 0.12 + Math.sin(elapsed * 3.7) * 0.13;
    keeper.leftLeg.rotation.x = Math.sin(elapsed * 2.6) * 0.05;
    keeper.rightLeg.rotation.x = -Math.sin(elapsed * 2.6) * 0.05;
    return;
  }
  if (!shot) return;
  const progress = THREE.MathUtils.clamp((performance.now() - shot.start) / shot.duration, 0, 1);
  const diveStart = 0.31;
  const diveProgress = THREE.MathUtils.clamp((progress - diveStart) / 0.42, 0, 1);
  const eased = easeInOutCubic(diveProgress);
  const sign = Math.sign(shot.keeperDiveX - shot.keeperStartX) || 1;
  keeper.group.position.x = THREE.MathUtils.lerp(shot.keeperStartX, shot.keeperDiveX, eased);
  keeper.group.position.y = keeper.baseY + Math.sin(Math.PI * diveProgress) * 0.5;
  keeper.group.rotation.z = sign * eased * (shot.saved ? 1.04 : 0.68);
  keeper.leftArm.rotation.z = -0.12 - sign * eased * 0.64;
  keeper.rightArm.rotation.z = 0.12 - sign * eased * 0.64;
  keeper.leftLeg.rotation.x = eased * 0.47;
  keeper.rightLeg.rotation.x = -eased * 0.33;
}

function updateShot() {
  const shot = state.shot;
  if (!shot || shot.resolved) return;
  const elapsed = performance.now() - shot.start;
  const progress = THREE.MathUtils.clamp(elapsed / shot.duration, 0, 1);
  const split = shot.saved ? 0.67 : 0.82;
  if (progress <= split) {
    const local = progress / split;
    flightPoint(shot.from, shot.impact, local, shot.arc, ball.mesh.position);
  } else {
    const local = (progress - split) / (1 - split);
    flightPoint(shot.impact, shot.end, local, shot.saved ? 0.22 : 0.04, ball.mesh.position);
  }
  const spin = (progress - shot.lastProgress) * (10 + state.power * 0.16);
  ball.mesh.rotation.x += spin;
  ball.mesh.rotation.z += spin * (state.target.x * 0.07);
  shot.lastProgress = progress;
  updateBallShadow();
  if (progress >= 1) resolveShot();
}

function spawnConfetti(origin) {
  const colors = [0xd7ff96, 0xffca4d, 0xfbf7e6, 0x6ee1ad, 0xff7f69];
  for (let index = 0; index < 66; index += 1) {
    const piece = new THREE.Mesh(
      new THREE.PlaneGeometry(THREE.MathUtils.randFloat(0.045, 0.095), THREE.MathUtils.randFloat(0.09, 0.17)),
      new THREE.MeshBasicMaterial({ color: colors[index % colors.length], side: THREE.DoubleSide, transparent: true }),
    );
    piece.position.copy(origin).add(new THREE.Vector3(THREE.MathUtils.randFloatSpread(0.4), THREE.MathUtils.randFloat(-0.1, 0.38), THREE.MathUtils.randFloat(-0.3, 0.1)));
    piece.userData.velocity = new THREE.Vector3(THREE.MathUtils.randFloatSpread(4.8), THREE.MathUtils.randFloat(2.1, 5.8), THREE.MathUtils.randFloat(-1.1, 3.7));
    piece.userData.spin = new THREE.Vector3(THREE.MathUtils.randFloatSpread(9), THREE.MathUtils.randFloatSpread(9), THREE.MathUtils.randFloatSpread(9));
    piece.userData.life = THREE.MathUtils.randFloat(1.35, 2.25);
    world.add(piece);
    confetti.push(piece);
  }
}

function updateConfetti(delta) {
  for (let index = confetti.length - 1; index >= 0; index -= 1) {
    const piece = confetti[index];
    piece.userData.life -= delta;
    if (piece.userData.life <= 0) {
      world.remove(piece);
      piece.geometry.dispose();
      piece.material.dispose();
      confetti.splice(index, 1);
      continue;
    }
    piece.userData.velocity.y -= 7.8 * delta;
    piece.position.addScaledVector(piece.userData.velocity, delta);
    piece.rotation.x += piece.userData.spin.x * delta;
    piece.rotation.y += piece.userData.spin.y * delta;
    piece.rotation.z += piece.userData.spin.z * delta;
    piece.material.opacity = Math.min(1, piece.userData.life * 1.5);
  }
}

function updateCamera(delta, elapsed) {
  const shotProgress = state.shot ? THREE.MathUtils.clamp((performance.now() - state.shot.start) / state.shot.duration, 0, 1) : 0;
  const targetX = state.phase === 'ready' ? state.target.x * 0.055 : state.target.x * 0.025;
  const desired = tempVector.set(targetX, 2.45 + Math.sin(elapsed * 0.75) * 0.015, 11.8 - shotProgress * 0.38);
  camera.position.lerp(desired, Math.min(1, delta * 2.7));
  cameraLook.set(state.target.x * 0.06, 1.27 + (state.phase === 'shooting' ? 0.04 : 0), -5.7);
  camera.lookAt(cameraLook);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, false);
}

// ----- Sound ---------------------------------------------------------------

function ensureAudio() {
  if (!state.soundEnabled) return null;
  if (!state.audioContext) {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return null;
    state.audioContext = new Audio();
  }
  if (state.audioContext.state === 'suspended') state.audioContext.resume();
  return state.audioContext;
}

function tone(frequency, duration, options = {}) {
  const context = ensureAudio();
  if (!context) return;
  const now = context.currentTime + (options.delay || 0);
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = options.type || 'sine';
  oscillator.frequency.setValueAtTime(frequency, now);
  if (options.endFrequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, options.endFrequency), now + duration);
  gain.gain.setValueAtTime(options.volume ?? 0.035, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function playWhistle() {
  tone(1580, 0.12, { type: 'square', volume: 0.026, endFrequency: 1840 });
  tone(1850, 0.12, { type: 'square', volume: 0.023, delay: 0.16, endFrequency: 1550 });
}

function playKick() {
  tone(82, 0.12, { type: 'triangle', volume: 0.095, endFrequency: 42 });
  tone(310, 0.07, { type: 'sine', volume: 0.025, delay: 0.01, endFrequency: 180 });
}

function playGoalSound() {
  tone(410, 0.16, { type: 'sawtooth', volume: 0.026, endFrequency: 580 });
  tone(620, 0.2, { type: 'sawtooth', volume: 0.022, delay: 0.12, endFrequency: 840 });
  tone(820, 0.28, { type: 'sine', volume: 0.019, delay: 0.25, endFrequency: 1040 });
}

function playSaveSound() {
  tone(150, 0.16, { type: 'square', volume: 0.035, endFrequency: 105 });
  tone(120, 0.19, { type: 'triangle', volume: 0.04, delay: 0.07, endFrequency: 65 });
}

// ----- Events and render loop --------------------------------------------

ui.powerRange.addEventListener('input', (event) => {
  state.power = Number(event.target.value);
  renderUI();
});
ui.shootButton.addEventListener('click', takeShot);
ui.startButton.addEventListener('click', startTournament);
ui.languageToggle.addEventListener('click', () => setLanguage(state.language === 'ar' ? 'en' : 'ar'));
ui.soundToggle.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  ui.soundIcon.textContent = state.soundEnabled ? '◖◗' : '×';
  ui.soundToggle.setAttribute('aria-label', state.soundEnabled ? t().soundOn : t().soundOff);
  if (state.soundEnabled) playWhistle();
});
ui.fullscreenToggle.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch { /* fullscreen is optional */ }
});
ui.canvas.addEventListener('pointermove', setAimFromPointer);
ui.canvas.addEventListener('pointerdown', (event) => {
  setAimFromPointer(event);
  if (state.phase === 'ready') ui.canvas.setPointerCapture?.(event.pointerId);
});
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !event.repeat) {
    event.preventDefault();
    takeShot();
  }
  if (event.key === 'Enter' && !ui.overlay.classList.contains('is-hidden')) startTournament();
});
window.addEventListener('resize', onResize);

function animate() {
  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.getElapsedTime();
  if (state.phase === 'ready') {
    ball.mesh.position.y = GAME.ballStart.y + Math.sin(elapsed * 3.1) * 0.008;
    ball.mesh.rotation.y += delta * 0.42;
    updateBallShadow();
    updateAimVisuals();
  }
  updateShot();
  updateKeeper(elapsed, delta);
  updateConfetti(delta);
  aiming.ring.scale.setScalar(1 + Math.sin(elapsed * 4.3) * 0.075);
  updateCamera(delta, elapsed);
  renderer.render(scene, camera);
}

const clock = new THREE.Clock();
resetBall();
resetKeeper();
setLanguage(state.language === 'en' ? 'en' : 'ar');
onResize();
renderer.setAnimationLoop(animate);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
