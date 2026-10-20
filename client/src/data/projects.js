export const projects = [
  {
    id: 'webdrop',
    slug: 'webdrop',
    title: 'WebDrop',
    tagline: 'Drop. Connect. Transfer.',
    category: 'Computer Networks / Peer-to-Peer File Sharing',
    filters: ['Full Stack', 'Real-Time', 'Networking'],
    status: 'Completed',
    year: '2024',
    duration: '3 months',
    role: 'Full-Stack Developer',
    team: 'Solo',
    shortDescription:
      'A browser-based file-sharing application that establishes peer connections and transfers files through WebRTC DataChannels.',
    description:
      'WebDrop is a peer-to-peer file sharing tool that lets two devices connect via a short room code or QR code and transfer files directly using WebRTC DataChannels. A lightweight signaling server coordinates discovery; actual file data travels peer-to-peer when a connection can be established.',
    technologies: [
      'React',
      'Vite',
      'Tailwind CSS',
      'Node.js',
      'Express.js',
      'Socket.IO',
      'WebRTC',
      'STUN',
      'html5-qrcode',
    ],
    techCategories: [
      {
        category: 'Frontend',
        description: 'Client UI and room management',
        items: ['React', 'Vite', 'Tailwind CSS'],
      },
      {
        category: 'Backend',
        description: 'Signaling and coordination',
        items: ['Node.js', 'Express.js', 'Socket.IO'],
      },
      {
        category: 'Networking',
        description: 'Peer-to-peer transport',
        items: ['WebRTC', 'STUN', 'DataChannels'],
      },
      {
        category: 'Tooling',
        description: 'QR scanning in the browser',
        items: ['html5-qrcode'],
      },
    ],
    metrics: [
      { value: '2', label: 'Peers per room', description: 'Hard limit' },
      { value: '5-char', label: 'Room codes', description: 'Short & shareable' },
      { value: 'P2P', label: 'Direct transfer', description: 'No cloud relay' },
      { value: 'QR', label: 'Pairing', description: 'Scan to connect' },
    ],
    links: {
      github: 'https://github.com/Suraj1819/web-drop',
      live: 'https://webdrop-eight.vercel.app',
      backend: 'https://bambibackend.onrender.com',
      docs: 'https://github.com/Suraj1819/web-drop#readme',
    },
    image: null,
    preview: [
      '/projects/webdrop/preview-1.png',
      { src: '/projects/webdrop/preview-2.png', caption: 'Room creation flow' },
      '/projects/webdrop/preview-3.png',
    ],
    gallery: [
      { src: '/projects/webdrop/home.png', caption: 'Home screen with send/receive options' },
      { src: '/projects/webdrop/room.png', caption: 'Room code generation' },
      { src: '/projects/webdrop/qr.png', caption: 'QR code pairing' },
      { src: '/projects/webdrop/transfer.png', caption: 'Active file transfer' },
      { src: '/projects/webdrop/complete.png', caption: 'Transfer completed state' },
    ],
    video: {
      url: '/projects/webdrop/demo.mp4',
      title: 'WebDrop walkthrough',
      description:
        'A 90-second tour showing room creation, QR pairing, and live peer-to-peer file transfer between two devices.',
      poster: '/projects/webdrop/poster.png',
    },
    problem:
      'Sharing large files between nearby devices often requires cloud uploads, accounts, or platform-specific tools. Browser-native peer-to-peer transfer can reduce friction when both parties are online and a direct or relay path is available.',
    goals: [
      'Enable two devices to form a room with a short code or QR scan',
      'Transfer files via WebRTC DataChannels with chunking and backpressure',
      'Provide clear connection and transfer status in a responsive UI',
      'Limit rooms to two participants and expire unused rooms',
    ],
    architecture: {
      summary:
        'The signaling server (Node.js + Socket.IO) coordinates peer discovery and WebRTC negotiation (offer/answer/ICE). File bytes travel over WebRTC DataChannels when a connection is established; STUN servers assist NAT traversal. The system does not guarantee a direct path on every network.',
      components: [
        { name: 'React client', description: 'Send/receive UI, room codes, QR scanning' },
        { name: 'Express + Socket.IO signaling server', description: 'Coordinates peer discovery and negotiation' },
        { name: 'WebRTC DataChannels', description: 'Direct peer-to-peer file chunk transport' },
        { name: 'STUN servers', description: 'ICE candidate discovery for NAT traversal' },
      ],
      dataFlow:
        'Client A creates a room → server assigns a 5-char code → Client B joins via code or scans QR → signaling exchanges SDP offer/answer + ICE candidates → DataChannel opens → file is chunked and sent with bufferedAmount backpressure → receiver reassembles and saves.',
    },
    features: [
      { name: 'Five-character room codes', status: 'Completed' },
      { name: 'QR-based room pairing', status: 'Completed' },
      { name: 'Max two devices per room', status: 'Completed' },
      { name: 'WebRTC DataChannels for transfer', status: 'Completed' },
      { name: 'Chunked file transfer', status: 'Completed' },
      { name: 'Backpressure management', status: 'Completed' },
      { name: 'Connection and transfer status', status: 'Completed' },
      { name: 'Host controls', status: 'Completed' },
      { name: 'Room expiry', status: 'Completed' },
      { name: 'Responsive send/receive interface', status: 'Completed' },
    ],
    challenges: [
      {
        title: 'NAT traversal limitations',
        description:
          'NAT traversal and firewall restrictions prevent direct peer connections on some restrictive networks.',
      },
      {
        title: 'Reliable chunking',
        description:
          'Reliable chunking and reassembly with backpressure under variable bandwidth required careful DataChannel lifecycle management.',
      },
      {
        title: 'Connection state UX',
        description:
          'Clear UX for connection states (connecting, connected, failed, transferring) was essential to avoid user confusion.',
      },
    ],
    learnings: [
      'WebRTC signaling vs data plane separation',
      'DataChannel lifecycle and bufferedAmount for backpressure',
      'Practical limits of browser P2P on restrictive networks',
    ],
    limitations: [
      'Not all network environments allow a successful peer connection',
      'Currently designed for two participants per room',
      'Large file transfers depend on connection quality and browser limits',
    ],
    future: [
      { title: 'TURN fallback', description: 'Add TURN relay fallback for restricted networks where direct peer connection fails.' },
      { title: 'Multi-file queue', description: 'Improve queue handling for sending multiple files in sequence with progress tracking.' },
      { title: 'Room authentication', description: 'Stronger room authentication options including optional passwords and expiry controls.' },
    ],
    testimonial: {
      quote:
        'WebDrop is one of the cleanest implementations of browser-native P2P transfer I have seen from a student. The signaling layer is minimal and the UX is honest about connection limits.',
      author: 'Project Mentor',
      role: 'Senior Engineer',
    },
  },
  {
    id: 'bambi',
    slug: 'bambi',
    title: 'Bambi',
    tagline: 'Conversations, connected.',
    category: 'Full-Stack / Real-Time Messaging',
    filters: ['Full Stack', 'Real-Time'],
    status: 'In Progress',
    year: '2024 — 2025',
    duration: 'Ongoing',
    role: 'Full-Stack Developer',
    team: 'Solo',
    shortDescription:
      'A messaging application with a responsive chat interface and real-time communication features, under active development.',
    description:
      'Bambi is a full-stack messaging app focused on one-to-one and group conversations, delivery states, typing indicators, and presence. It combines a React frontend with a Node.js/Express backend, Socket.IO for real-time events, and PostgreSQL/Supabase for persistence.',
    technologies: [
      'React',
      'Vite',
      'Node.js',
      'Express.js',
      'Socket.IO',
      'PostgreSQL',
      'Supabase',
      'Tailwind CSS',
      'lucide-react',
    ],
    techCategories: [
      {
        category: 'Frontend',
        description: 'Chat interface and state',
        items: ['React', 'Vite', 'Tailwind CSS', 'lucide-react'],
      },
      {
        category: 'Backend',
        description: 'Auth, REST APIs, real-time layer',
        items: ['Node.js', 'Express.js', 'Socket.IO'],
      },
      {
        category: 'Database',
        description: 'Users, conversations, messages',
        items: ['PostgreSQL', 'Supabase'],
      },
    ],
    metrics: [
      { value: '15+', label: 'Features planned', description: 'Across chat, presence, media' },
      { value: 'OTP', label: 'Auth', description: 'Phone-based' },
      { value: 'Real-time', label: 'Socket.IO', description: 'Live events' },
      { value: 'In Progress', label: 'Status', description: 'Active development' },
    ],
    links: {
      github: null,
      live: null,
      backend: 'https://bambibackend.onrender.com',
    },
    image: null,
    preview: [
      '/projects/bambi/preview-1.png',
      { src: '/projects/bambi/preview-2.png', caption: 'Chat conversation view' },
      '/projects/bambi/preview-3.png',
    ],
    gallery: [
      { src: '/projects/bambi/login.png', caption: 'OTP login screen' },
      { src: '/projects/bambi/chatlist.png', caption: 'Conversation list' },
      { src: '/projects/bambi/chat.png', caption: 'Active conversation' },
      { src: '/projects/bambi/typing.png', caption: 'Typing indicator' },
      { src: '/projects/bambi/profile.png', caption: 'Profile and theme settings' },
    ],
    video: {
      url: '/projects/bambi/demo.mp4',
      title: 'Bambi demo',
      description:
        'Walkthrough of OTP login, friend discovery, real-time messaging with typing indicators, and theme switching.',
      poster: '/projects/bambi/poster.png',
    },
    problem:
      'Building a messaging product requires coordinating authentication, presence, delivery acknowledgements, and a responsive UI that stays consistent across devices.',
    goals: [
      'Phone-based OTP authentication and unique usernames',
      'Friend requests, one-to-one and group messaging',
      'Delivery states, read receipts, typing indicators, online/offline',
      'Attachments, avatars, themes, and wallpapers where implemented',
    ],
    architecture: {
      summary:
        'Client connects via REST for auth and profile operations and via Socket.IO for real-time messaging and presence. PostgreSQL stores users, conversations, and messages. Feature status is tracked as Completed, In Progress, or Planned.',
      components: [
        { name: 'React + Vite client', description: 'Chat UI, theme system, friend management' },
        { name: 'Express REST API', description: 'Auth, profile, conversation management' },
        { name: 'Socket.IO real-time layer', description: 'Messages, presence, typing indicators' },
        { name: 'PostgreSQL / Supabase', description: 'Users, conversations, messages persistence' },
      ],
      dataFlow:
        'Client authenticates via OTP → REST issues a session token → Socket.IO connects with the token for real-time events → messages persist to PostgreSQL and emit via Socket.IO to active participants → delivery/read receipts flow back through the same channel.',
    },
    features: [
      { name: 'Phone-based OTP authentication', status: 'In Progress' },
      { name: 'Unique usernames', status: 'In Progress' },
      { name: 'User search', status: 'In Progress' },
      { name: 'Friend requests', status: 'Planned' },
      { name: 'One-to-one messaging', status: 'In Progress' },
      { name: 'Group conversations', status: 'Planned' },
      { name: 'Message delivery states', status: 'In Progress' },
      { name: 'Read receipts', status: 'Planned' },
      { name: 'Typing indicators', status: 'In Progress' },
      { name: 'Online/offline status', status: 'In Progress' },
      { name: 'Last seen', status: 'Planned' },
      { name: 'Attachments', status: 'Planned' },
      { name: 'Avatar synchronization', status: 'Planned' },
      { name: 'Chat wallpapers', status: 'Planned' },
      { name: 'Theme settings', status: 'In Progress' },
    ],
    challenges: [
      {
        title: 'Delivery and read state consistency',
        description:
          'Consistent delivery and read state across multiple clients requires careful event ordering and reconciliation logic.',
      },
      {
        title: 'Secure OTP and session handling',
        description:
          'Secure OTP delivery, rate limiting, and session token rotation without breaking active Socket.IO connections is non-trivial.',
      },
      {
        title: 'Scaling presence',
        description:
          'Scaling Socket.IO presence without excessive database load or stale online states is an ongoing concern.',
      },
    ],
    learnings: [
      'Real-time event design for chat systems',
      'Auth and session boundaries between REST and sockets',
      'UI patterns for offline and reconnect states',
    ],
    limitations: [
      'Group calls, voice, and video are not implemented',
      'End-to-end encryption is not implemented',
      'Several features remain Planned or In Progress',
    ],
    future: [
      { title: 'Friend and group flows', description: 'Complete friend request lifecycle and group conversation creation with admin controls.' },
      { title: 'Attachments and media', description: 'Image, audio, and document attachments with thumbnail generation and storage.' },
      { title: 'Presence hardening', description: 'Strengthen presence and delivery guarantees with reconnection and retry logic.' },
    ],
    testimonial: {
      quote:
        'Working with Suraj on Bambi was seamless. He cares deeply about the chat UX and writes very maintainable React state for real-time events.',
      author: 'Hackathon Teammate',
      role: 'Full-Stack Developer',
    },
  },
  {
    id: 'bambisync',
    slug: 'bambisync',
    title: 'BambiSync',
    tagline: 'Nearby transfer, simplified.',
    category: 'Desktop / Nearby Transfer',
    filters: ['Desktop/Experimental', 'Networking'],
    status: 'Prototype',
    year: '2024',
    duration: 'Exploratory',
    role: 'Developer',
    team: 'Solo',
    shortDescription:
      'An experimental nearby-transfer concept for sharing text, links, and eventually images between Windows and Android devices.',
    description:
      'BambiSync explores Bluetooth-preferred nearby transfer between a Windows desktop (WPF) and Android devices. The current scope is a prototype aimed at text and link transfer, with photo/screenshot transfer planned.',
    technologies: ['WPF', 'Windows', 'Bluetooth', 'Android (planned)'],
    techCategories: [
      {
        category: 'Desktop',
        description: 'Windows client UI',
        items: ['WPF', 'Windows'],
      },
      {
        category: 'Connectivity',
        description: 'Nearby device pairing',
        items: ['Bluetooth'],
      },
      {
        category: 'Mobile (planned)',
        description: 'Android counterpart',
        items: ['Android (planned)'],
      },
    ],
    metrics: [
      { value: 'WPF', label: 'Desktop', description: 'Windows client' },
      { value: 'BT', label: 'Pairing', description: 'Bluetooth-preferred' },
      { value: 'Prototype', label: 'Status', description: 'Early stage' },
      { value: 'Cross-platform', label: 'Goal', description: 'Windows + Android' },
    ],
    links: {
      github: null,
      live: null,
    },
    image: null,
    preview: [
      '/projects/bambisync/preview-1.png',
      { src: '/projects/bambisync/preview-2.png', caption: 'Windows desktop UI' },
    ],
    gallery: [
      { src: '/projects/bambisync/desktop.png', caption: 'WPF desktop client' },
      { src: '/projects/bambisync/discovery.png', caption: 'Bluetooth device discovery' },
      { src: '/projects/bambisync/transfer.png', caption: 'Text/link transfer flow' },
    ],
    video: null,
    problem:
      'Moving short content (text, links, screenshots) between a PC and a phone often requires cloud intermediaries or USB. A nearby, low-friction path can reduce friction for day-to-day tasks.',
    goals: [
      'Discover nearby devices with a Bluetooth-preferred approach',
      'Transfer text and links between Windows and Android',
      'Extend to photos and screenshots when the pipeline is stable',
    ],
    architecture: {
      summary:
        'Windows client built with WPF; connection model prefers Bluetooth for nearby discovery and transfer. Android counterpart and full cross-platform pipeline are part of the future plan. Labelled Prototype until verified end-to-end.',
      components: [
        { name: 'WPF Windows UI', description: 'Desktop interface for sending and receiving content' },
        { name: 'Bluetooth discovery and transfer', description: 'Preferred pairing and transport mechanism' },
        { name: 'Android client (planned)', description: 'Cross-platform counterpart under development' },
      ],
      dataFlow:
        'Windows client scans for nearby Bluetooth devices → user selects a target device → Bluetooth pairing established → text/link payload sent → Android counterpart (planned) receives and displays → future: image and screenshot transfer.',
    },
    features: [
      { name: 'Windows desktop UI (WPF)', status: 'In Progress' },
      { name: 'Bluetooth-preferred connection', status: 'Planned' },
      { name: 'Text and link transfer', status: 'Planned' },
      { name: 'Photo/screenshot transfer', status: 'Planned' },
    ],
    challenges: [
      {
        title: 'Bluetooth API fragmentation',
        description:
          'Platform differences in Bluetooth APIs and permissions between Windows and Android complicate a unified transfer path.',
      },
      {
        title: 'Discovery vs battery',
        description:
          'Reliable discovery without excessive battery impact requires careful scanning strategy trade-offs.',
      },
      {
        title: 'Consistent cross-platform UX',
        description:
          'Consistent UX across Windows and Android requires shared interaction patterns despite different UI toolkits.',
      },
    ],
    learnings: [
      'Desktop UI patterns with WPF',
      'Constraints of nearby device APIs',
      'Cross-platform transport design trade-offs',
    ],
    limitations: [
      'Not a complete cross-platform transfer system yet',
      'Android side and full transfer path are planned',
      'Bluetooth reliability varies by device and OS version',
    ],
    future: [
      { title: 'Text/link path completion', description: 'Finish the core text and link transfer pipeline between Windows and Android.' },
      { title: 'Image transfer', description: 'Extend the pipeline to photos and screenshots with size and format handling.' },
      { title: 'Discovery UX', description: 'Improved device discovery and pairing with clearer state feedback.' },
    ],
  },
  {
    id: 'portfolio',
    slug: 'portfolio',
    title: 'Developer Portfolio',
    tagline: 'Editorial design meets full-stack engineering.',
    category: 'Creative Development',
    filters: ['Full Stack'],
    status: 'Completed',
    year: '2024',
    duration: 'Ongoing',
    role: 'Designer & Developer',
    team: 'Solo',
    shortDescription:
      'This portfolio itself — a multi-page React application with theme system, project case studies, and a contact backend.',
    description:
      'A production-oriented personal portfolio built with React, Vite, and a Node.js/Express contact API backed by PostgreSQL. Features light/dark themes, accessible navigation, detailed project case studies, and secure form handling.',
    technologies: [
      'React',
      'Vite',
      'Tailwind CSS',
      'React Router',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Zod',
      'Three.js',
    ],
    techCategories: [
      {
        category: 'Frontend',
        description: 'SPA client with routing',
        items: ['React', 'Vite', 'Tailwind CSS', 'React Router'],
      },
      {
        category: 'Backend',
        description: 'Contact API and validation',
        items: ['Node.js', 'Express', 'Zod'],
      },
      {
        category: 'Database',
        description: 'Message persistence',
        items: ['PostgreSQL'],
      },
      {
        category: 'Visuals',
        description: '3D hero element',
        items: ['Three.js'],
      },
    ],
    metrics: [
      { value: '7', label: 'Primary pages', description: 'Shared design system' },
      { value: '2', label: 'Themes', description: 'Light + dark' },
      { value: 'Live', label: 'Deployed', description: 'Production' },
      { value: '3D', label: 'Hero', description: 'Three.js' },
    ],
    links: {
      github: null,
      live: 'https://surajzxrt.netlify.app',
    },
    image: null,
    preview: [
      '/projects/portfolio/preview-1.png',
      { src: '/projects/portfolio/preview-2.png', caption: 'Project case study page' },
      { src: '/projects/portfolio/preview-3.png', caption: 'Dark theme mode' },
    ],
    gallery: [
      { src: '/projects/portfolio/home.png', caption: 'Home page hero' },
      { src: '/projects/portfolio/projects.png', caption: 'Projects listing' },
      { src: '/projects/portfolio/casestudy.png', caption: 'Project case study' },
      { src: '/projects/portfolio/about.png', caption: 'About page' },
      { src: '/projects/portfolio/contact.png', caption: 'Contact form' },
      { src: '/projects/portfolio/darkmode.png', caption: 'Dark theme variant' },
    ],
    video: {
      url: '/projects/portfolio/demo.mp4',
      title: 'Portfolio walkthrough',
      description:
        'Tour of the homepage, projects page, a sample case study, theme switching, and the contact form submission flow.',
      poster: '/projects/portfolio/poster.png',
    },
    problem:
      'A developer portfolio needs to communicate technical depth and project quality without generic template aesthetics or unsupported claims.',
    goals: [
      'Seven distinct primary pages with shared design system',
      'Working contact form with validation, storage, and email',
      'Accessible, responsive, theme-aware UI',
    ],
    architecture: {
      summary:
        'SPA client with React Router; separate Express API for contact submissions; PostgreSQL for message persistence; optional transactional email for notifications.',
      components: [
        { name: 'Vite + React client', description: 'Multi-page SPA with routing and theming' },
        { name: 'Express API', description: 'Contact form submission and validation' },
        { name: 'PostgreSQL', description: 'Message storage and retrieval' },
        { name: 'Resend (or similar)', description: 'Transactional email notifications' },
      ],
      dataFlow:
        'User fills contact form → client validates with Zod → POST to Express API → server re-validates and stores in PostgreSQL → optional email sent via Resend → user sees success state.',
    },
    features: [
      { name: 'Responsive multi-page layout', status: 'Completed' },
      { name: 'Light/dark theme with persistence', status: 'Completed' },
      { name: 'Project case studies', status: 'Completed' },
      { name: 'Contact form + backend', status: 'Completed' },
      { name: 'Optional 3D hero visual', status: 'Completed' },
    ],
    challenges: [
      {
        title: 'Visual identity vs performance',
        description:
          'Balancing a distinctive visual identity with performance and accessibility required careful asset and animation choices.',
      },
      {
        title: 'Honest project status',
        description:
          'Presenting honest feature and project status without overclaiming was an intentional editorial decision throughout the site.',
      },
    ],
    learnings: [
      'Design tokens and theme systems in Tailwind',
      'Secure contact API patterns with Zod validation',
      'Editorial design decisions for technical content',
    ],
    limitations: [
      'Admin dashboard is optional and only shipped if fully secured',
      '3D hero is optional and disabled on low-power devices',
    ],
    future: [
      { title: 'Richer project media', description: 'Add screenshots, slideshows, and video demos as media becomes available.' },
      { title: 'Privacy-first analytics', description: 'Refined analytics without compromising visitor privacy.' },
      { title: 'Admin dashboard', description: 'Optional admin for managing contact submissions, only if fully secured.' },
    ],
    testimonial: {
      quote:
        'Suraj\'s portfolio reflects real engineering thought — not a template. The case studies explain the why, not just the what.',
      author: 'Peer Reviewer',
      role: 'Open Source Contributor',
    },
  },
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

export function getAdjacentProjects(slug) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}