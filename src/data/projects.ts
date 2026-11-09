import stars from './stars.json';

type Link = { label: string; href: string };
export type Project = {
  id: string;
  name: string;
  summary: string;
  stack: string;
  stars?: number;
  details: string[];
  links: Link[];
  images: { src: string; alt: string }[];
  eink?: boolean;
};

export const projects: Project[] = [
  {
    id: 'unidex',
    name: 'unidex',
    summary:
      'A pocket e-ink computer that clips to your keys or uni lanyard. It shows your next class with a live countdown, records voice notes, has a Pet that meets your friends\' Pets, and plays one-button games.',
    stack: 'C++, Lua, ESP32-S3',
    stars: stars.unidex,
    eink: true,
    details: [
      'It has two buttons and a battery, and sleeps whenever you aren\'t pressing one. Apps are a few lines of Lua, and installing takes about a minute from a browser.',
      'I designed the case too, and sold assembled units. The code is on GitHub, free for non-commercial use, and XDA wrote it up.',
    ],
    links: [
      { label: 'unidex.shop', href: 'https://www.unidex.shop' },
      { label: 'GitHub', href: 'https://github.com/Forrest404/unidex' },
      { label: 'XDA', href: 'https://www.xda-developers.com/open-source-os-waveshare-esp32-s3-epaper/' },
    ],
    images: [
      { src: '/img/unidex-colours.avif', alt: 'Five unidex devices in blue, pink, purple, green and white, each with a different Pet on its e-ink screen' },
    ],
  },
  {
    id: 'forrestos',
    name: 'Forrest OS',
    summary:
      'The operating system for the Forrest Phone, a handheld built on an ESP32 touchscreen board. It has a tiled home screen, 20+ apps, a plain-text browser and SD storage.',
    stack: 'C++, ESP32',
    stars: stars.ForrestOS,
    details: ['Apps include weather, browser, clock, calculator and settings, and you can pin your own web tiles to the home screen.'],
    links: [{ label: 'GitHub', href: 'https://github.com/Forrest404/ForrestOS' }],
    images: [{ src: '/img/forrestos.avif', alt: 'The Forrest Phone, a handheld with a tiled Forrest OS home screen of app icons' }],
  },
  {
    id: 'glasses',
    name: 'Clip-on HUD glasses',
    summary:
      'AR glasses that clip onto my Meta glasses and show an image in front of you. A small OLED is reflected off a mirror, through a lens, onto a clear glass in your line of sight.',
    stack: 'C++, ESP32, OLED, laser-cut acrylic',
    details: [
      'I designed the laser-cut case and checked the optics with a ray-trace script before cutting anything.',
      'The firmware is my own: a home clock, and a teleprompter you upload text to from your phone over the glasses\' own WiFi hotspot. Next I\'m making it run wirelessly with my phone as the controller.',
    ],
    links: [],
    images: [{ src: '/img/glasses.avif', alt: 'The clip-on HUD prototype fixed to the arm of a pair of black glasses, with a clear glass angled out in front' }],
  },
  {
    id: 'sumo',
    name: 'Sumo robot',
    summary:
      'A robot I built that won a robotics sumo hackathon. It finds the other robot with ultrasonic sensors and pushes it out of the ring.',
    stack: 'Arduino, C++, 3D printing',
    details: ['It has a 3D-printed body and scoop, ultrasonic sensors for eyes, and cardboard arms.'],
    links: [],
    images: [{ src: '/img/sumo.avif', alt: 'A small green robot with two ultrasonic sensors for eyes, a yellow scoop at the front and red cardboard arms, held up in a workshop' }],
  },
  {
    id: 'drone',
    name: 'FPV drone',
    summary: 'A drone I built in my hotel room while travelling around China.',
    stack: 'FPV, carbon fibre, LiPo',
    details: ['It has a carbon-fibre frame, four motors with three-blade props, a camera on the front and a 3-cell LiPo battery.'],
    links: [],
    images: [{ src: '/img/drone.avif', alt: 'A carbon-fibre drone with four teal three-blade propellers and a camera on the front, on a concrete floor while a hand tightens a motor nut with a wrench' }],
  },
  {
    id: 'firesim',
    name: 'Wildfire Sim',
    summary:
      'A 3D wildfire simulator I built in four hours at a Google hackathon. Light a fire on real terrain, send in hand crews, engines, dozers and aircraft, and compare the burn with and without them.',
    stack: 'TypeScript, CesiumJS, Google 3D Tiles',
    details: [
      'It has a real-fire check that re-runs the 2024 Crozier Fire with its recorded weather, and a live tab that shows NASA satellite fire detections. It is a simplified model, not for real decisions.',
    ],
    links: [
      { label: 'Try it', href: 'https://forrest404.github.io/Forrest-Labs-firesim/' },
      { label: 'GitHub', href: 'https://github.com/Forrest404/Forrest-Labs-firesim' },
      { label: 'Demo video', href: 'https://youtu.be/-StYhqkgOZU' },
    ],
    images: [{ src: '/img/firesim.avif', alt: 'A simulated wildfire spreading across forested hills above a town, drawn as a red and yellow overlay with burnt ground behind it' }],
  },
  {
    id: 'vision',
    name: 'FaceVision',
    summary:
      'Face recognition and real-time object segmentation from your camera, all offline. Detection, embeddings and the face database stay on your machine.',
    stack: 'Python, OpenCV, YOLO11-seg, FastSAM',
    stars: stars.vision,
    details: ['The web interface does live recognition, enrolls people from photos, identifies faces in an image, and searches stored photos by face.'],
    links: [{ label: 'GitHub', href: 'https://github.com/Forrest404/vision' }],
    images: [],
  },
  {
    id: 'whisper',
    name: 'Whisper Board',
    summary: 'Anonymous boards for schools. Sign in with a school email and you get a board only your school can see.',
    stack: 'TypeScript',
    details: ['Posts expire after 48 hours. Author IDs stay on the server for moderation and are never sent to other users.'],
    links: [{ label: 'whisperboard.uk', href: 'https://www.whisperboard.uk' }],
    images: [{ src: '/img/whisper.avif', alt: 'The Whisper Board sign-in page: a school email field under the title Say it anonymously' }],
  },
  {
    id: 'notes',
    name: 'Forrest Notes',
    summary:
      'Hold a button, talk, let go. A few seconds later a tidy Markdown note is in your Obsidian vault, with the raw transcript kept underneath.',
    stack: 'C, ESP32-S3, Whisper, GPT',
    stars: stars['forrest-notes'],
    details: ['It\'s built on the original Pala Note firmware. The device, drivers and recording engine are its author\'s work; I added the AI clean-up and the GitHub sync.'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Forrest404/forrest-notes' },
    ],
    images: [{ src: '/img/notes.avif', alt: 'A Forrest Notes Markdown note: a one-line summary, the cleaned-up text and a collapsed original transcript' }],
  },
  {
    id: 'infonest',
    name: 'InfoNest',
    summary: 'An AI knowledge base for teams. It answers questions from your documents and shows the passages it used and how confident it is.',
    stack: 'TypeScript, pgvector, RAG',
    details: ['It\'s part of a longer experiment: build a complete product in five months, then see whether it can actually be sold.'],
    links: [{ label: 'infonest.app', href: 'https://infonest.app' }],
    images: [{ src: '/img/infonest.avif', alt: 'The InfoNest home page, headed Your Intelligence Infrastructure' }],
  },
];
