export const projects = [
  {
    id: "voxsense",
    slug: "voxsense",
    title: "VoxSense",
    tagline: "Hear the emotion in every voice.",
    category: "AI / ML / Speech Emotion Recognition",
    filters: ["AI / ML", "Full Stack"],
    featured: true,
    status: "Completed",
    year: "2025",
    duration: null,
    role: "ML Engineer & Full-Stack Developer",
    team: "Solo",
    audience: "Students, researchers, and developers",
    platform: "Web",

    shortDescription:
      "An AI/ML speech emotion recognition application that analyzes voice recordings and predicts emotional categories using audio features.",

    description:
      "VoxSense explores speech emotion recognition through audio preprocessing, feature extraction, machine learning, and a web-based interface. The intended workflow accepts a voice recording, extracts useful audio features, runs an emotion classification model, and presents the prediction with confidence information. Model performance depends on the training data, recording conditions, language, and speaker.",

    highlights: [
      "Speech emotion recognition workflow",
      "Audio preprocessing and feature extraction",
      "Machine learning model integration",
      "Browser-based interface concept",
      "Confidence-aware result presentation",
    ],

    technologies: [
      "Python",
      "librosa",
      "NumPy",
      "Pandas",
      "scikit-learn",
      "TensorFlow",
      "FastAPI",
      "React",
      "Tailwind CSS",
    ],

    techCategories: [
      {
        category: "Machine Learning",
        description: "Audio analysis and model development",
        items: [
          "Python",
          "librosa",
          "NumPy",
          "Pandas",
          "scikit-learn",
          "TensorFlow",
        ],
      },
      {
        category: "Backend",
        description: "Model serving through an API",
        items: ["FastAPI"],
      },
      {
        category: "Frontend",
        description: "Audio input and prediction interface",
        items: ["React", "Tailwind CSS"],
      },
    ],

    metrics: [
      {
        value: "Audio",
        label: "Input",
        description: "Voice recording or uploaded clip",
      },
      {
        value: "MFCC",
        label: "Feature Extraction",
        description: "Spectral audio representation",
      },
      {
        value: "ML",
        label: "Processing",
        description: "Emotion classification pipeline",
      },
      {
        value: "Prediction",
        label: "Output",
        description: "Predicted emotion category",
      },
    ],

    links: {
      github: null,
      live: null,
      backend: null,
    },

    image: null,
    preview: [],
    gallery: [
    ],
    video: null,
    videos: [
      {
        url: "https://www.youtube.com/watch?v=x7X9w_z3NUE",
        title: "Python for ML — Quick Overview",
        description: "A fast overview of Python for machine learning workflows.",
      },
      {
        url: "https://www.youtube.com/watch?v=5xj5vk2Qw1Y",
        title: "TensorFlow in 100 Seconds",
        description: "Quick intro to TensorFlow for emotion classification models.",
      },
      {
        url: "https://www.youtube.com/watch?v=4HKq4bZ4m5A",
        title: "Audio Feature Extraction with librosa",
        description: "How MFCC and spectral features are extracted from audio.",
      },
    ],

    problem:
      "Voice contains acoustic information that can help a model classify emotional expression. Extracting useful signals from audio requires preprocessing, suitable training data, careful evaluation, and clear communication of uncertainty.",

    goals: [
      "Develop a speech emotion classification workflow",
      "Explore MFCC and other spectral audio features",
      "Evaluate machine learning models on suitable datasets",
      "Present predictions through a clear interface",
      "Communicate model limitations and uncertainty",
    ],

    responsibilities: [
      "Explore audio preprocessing and feature extraction",
      "Develop or integrate a classification model",
      "Design the model-serving API where implemented",
      "Build the user interface where implemented",
      "Document limitations and evaluation requirements",
    ],

    architecture: {
      summary:
        "The intended architecture separates the web client, audio-processing API, feature extraction pipeline, and trained emotion classifier. The final architecture should reflect the components that are actually implemented and deployed.",

      components: [
        {
          name: "React Client",
          description: "Audio input and prediction result interface",
        },
        {
          name: "FastAPI Service",
          description: "Audio validation and model inference API",
        },
        {
          name: "Feature Extraction",
          description: "Audio preprocessing and spectral features",
        },
        {
          name: "Emotion Classifier",
          description: "Model that predicts emotion categories",
        },
      ],

      dataFlow:
        "Audio input → validation and preprocessing → feature extraction → model inference → prediction response → results interface",
    },

    features: [
      {
        name: "Audio recording or upload",
        status: "In Progress",
      },
      {
        name: "Audio preprocessing",
        status: "In Progress",
      },
      {
        name: "MFCC and spectral feature extraction",
        status: "In Progress",
      },
      {
        name: "Emotion classification",
        status: "In Progress",
      },
      {
        name: "Prediction confidence display",
        status: "Planned",
      },
      {
        name: "Prediction history",
        status: "Planned",
      },
    ],

    challenges: [
      {
        title: "Inconsistent audio quality",
        description:
          "Recordings may vary in volume, background noise, microphone quality, and duration.",
        solution:
          "Use consistent preprocessing, resampling, and input validation before inference.",
      },
      {
        title: "Speaker and accent variation",
        description:
          "A model may perform differently on speakers or accents that are not represented in its training data.",
        solution:
          "Evaluate using representative datasets and speaker-independent splits where possible.",
      },
      {
        title: "Interpreting emotional expression",
        description:
          "Emotion labels can be subjective and do not always correspond reliably to acoustic patterns.",
        solution:
          "Present predictions as estimates rather than definitive conclusions.",
      },
    ],

    learnings: [
      "Audio signal processing fundamentals",
      "MFCC and spectral feature extraction",
      "Machine learning model evaluation",
      "Separating frontend and model-serving responsibilities",
      "Communicating model limitations",
    ],

    limitations: [
      "No verified model accuracy figure is provided",
      "Predictions can be affected by accent, language, and noise",
      "Emotion classifications are estimates, not psychological diagnoses",
      "Live deployment and individual features require verification",
    ],

    future: [
      {
        title: "Model Evaluation",
        description:
          "Evaluate candidate models on representative, held-out audio datasets.",
      },
      {
        title: "Multilingual Support",
        description:
          "Explore additional languages and speaker diversity.",
      },
      {
        title: "Prediction History",
        description:
          "Allow users to review previous analysis results.",
      },
    ],

    faq: [
      {
        question: "What does VoxSense do?",
        answer:
          "It explores the use of machine learning to classify emotional expression from voice recordings.",
      },
      {
        question: "Are its predictions always accurate?",
        answer:
          "No. Accuracy depends on the model, dataset, speaker, language, and recording conditions.",
      },
    ],
  },

  {
    id: "buseasily",
    slug: "buseasily",
    title: "BusEasily",
    tagline: "Find your bus. Plan your journey.",
    category: "Full Stack / Travel & Transport",
    filters: ["Full Stack", "Web Application"],
    featured: true,
    status: "In Progress",
    year: null,
    duration: null,
    role: "Full-Stack Developer",
    team: "Solo",
    audience: "Passengers planning bus journeys",
    platform: "Responsive Web",

    shortDescription:
      "A bus journey planning application concept focused on route discovery, schedules, fares, and a straightforward passenger experience.",

    description:
      "BusEasily is designed to simplify bus journey planning by bringing route search and trip information into one interface. Its intended workflow allows passengers to select their origin, destination, and travel date, review available services, and proceed through the supported booking flow. Actual booking, schedule data, and payment capabilities must match the current implementation.",

    highlights: [
      "Journey search concept",
      "Route and schedule discovery",
      "Clear trip information",
      "Responsive passenger interface",
      "Potential booking workflow",
    ],

    technologies: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "PostgreSQL",
    ],

    techCategories: [
      {
        category: "Frontend",
        description: "Passenger-facing interface",
        items: ["React", "Vite", "Tailwind CSS"],
      },
      {
        category: "Backend",
        description: "Application API",
        items: ["Node.js", "Express.js"],
      },
      {
        category: "Database",
        description: "Relational data storage",
        items: ["PostgreSQL"],
      },
    ],

    metrics: [
      {
        value: "Route",
        label: "Discovery",
        description: "Journey search concept",
      },
      {
        value: "Schedule",
        label: "Planning",
        description: "Bus timing information",
      },
      {
        value: "Responsive",
        label: "Interface",
        description: "Mobile and desktop layouts",
      },
      {
        value: "Full Stack",
        label: "Architecture",
        description: "Client, API, and database",
      },
    ],

    links: {
      github: null,
      live: null,
      backend: null,
    },

    image: null,
    preview: [],
    gallery: [
      "/projects/buseasily/image/search.png",
      "/projects/buseasily/image/routes.png",
      "/projects/buseasily/image/trip-details.png",
    ],
    video: null,
    videos: [
      {
        url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        title: "React for Travel Apps — Quick Tour",
        description: "How React powers modern travel booking interfaces.",
      },
      {
        url: "https://www.youtube.com/watch?v=O6q5Bz3Bci8",
        title: "Node.js + Express for Booking APIs",
        description: "Building REST APIs for journey search and trip data.",
      },
      {
        url: "https://www.youtube.com/watch?v=bwf7gQ8afMQ",
        title: "PostgreSQL for Route Data",
        description: "Modelling bus routes, stops, and schedules in relational data.",
      },
    ],

    problem:
      "Passengers need an easy way to find suitable bus services, compare journey information, and plan trips without navigating confusing interfaces.",

    goals: [
      "Support origin, destination, and travel-date inputs",
      "Present bus schedules and trip information clearly",
      "Create a mobile-friendly search experience",
      "Use a maintainable API and data model",
      "Add booking features according to actual backend support",
    ],

    responsibilities: [
      "Design the passenger journey and search experience",
      "Develop the frontend components",
      "Develop backend endpoints where implemented",
      "Plan data structures for routes and schedules",
      "Test responsive layouts and form validation",
    ],

    architecture: {
      summary:
        "The planned full-stack structure uses a React client, an Express API, and PostgreSQL for relational application data. Deployment and operational features should only be documented as completed after verification.",

      components: [
        {
          name: "React Client",
          description: "Search form, journey results, and trip details",
        },
        {
          name: "Express API",
          description: "Route queries and supported booking operations",
        },
        {
          name: "PostgreSQL",
          description: "Structured storage for supported application records",
        },
      ],

      dataFlow:
        "Passenger enters journey details → client sends search request → API processes the request → supported results are returned → passenger reviews journey options",
    },

    features: [
      {
        name: "Origin and destination search",
        status: "In Progress",
      },
      {
        name: "Travel-date selection",
        status: "In Progress",
      },
      {
        name: "Bus schedules and fare display",
        status: "In Progress",
      },
      {
        name: "Trip details",
        status: "In Progress",
      },
      {
        name: "Seat availability",
        status: "Planned",
      },
      {
        name: "Booking management",
        status: "Planned",
      },
      {
        name: "Online payments",
        status: "Planned",
      },
      {
        name: "Live bus tracking",
        status: "Planned",
      },
    ],

    challenges: [
      {
        title: "Route and schedule modelling",
        description:
          "Journey search requires a consistent relationship between routes, stops, schedules, and available services.",
        solution:
          "Use a clear relational schema and validated search parameters.",
      },
      {
        title: "Mobile usability",
        description:
          "Passengers may use the application while travelling or standing at a bus stop.",
        solution:
          "Prioritize readable trip cards, clear labels, and touch-friendly controls.",
      },
    ],

    learnings: [
      "Full-stack application architecture",
      "REST API design",
      "Relational data modelling",
      "Responsive interface design",
      "Journey search and filtering workflows",
    ],

    limitations: [
      "Live inventory and schedules require a reliable data source",
      "Payment processing should not be presented as available until integrated",
      "Real-time bus tracking requires external location data",
    ],

    future: [
      {
        title: "Booking Flow",
        description:
          "Implement booking creation, confirmation, and cancellation where supported.",
      },
      {
        title: "Payment Integration",
        description:
          "Add a secure payment provider and verified transaction handling.",
      },
      {
        title: "Live Tracking",
        description:
          "Explore location-based tracking when a suitable data source is available.",
      },
    ],

    faq: [
      {
        question: "Can users book tickets?",
        answer:
          "Booking availability depends on the implemented version. Do not assume live booking or payment processing is active.",
      },
      {
        question: "Does it provide live bus locations?",
        answer:
          "Live tracking is a future capability unless a working tracking integration is confirmed.",
      },
    ],
  },

  {
    id: "webdrop",
    slug: "webdrop",
    title: "WebDrop",
    tagline: "Drop. Connect. Transfer.",
    category: "Computer Networks / Peer-to-Peer File Sharing",
    filters: ["Full Stack", "Real-Time", "Networking"],
    featured: true,
    status: "Completed",
    year: "2026",
    duration: null,
    role: "Full-Stack Developer",
    team: "Solo",
    audience: "Users transferring files between nearby devices",
    platform: "Web",

    shortDescription:
      "A browser-based peer-to-peer file-sharing application using WebRTC DataChannels and Socket.IO signaling to connect two devices.",

    description:
      "WebDrop lets two devices join a room using a short code or QR code and exchange files through WebRTC DataChannels. A Node.js signaling server coordinates peer discovery and WebRTC negotiation. File contents are sent over the peer connection rather than being uploaded to the signaling server for storage. Connection success depends on network conditions and ICE connectivity.",

    highlights: [
      "Peer-to-peer file transfer through WebRTC DataChannels",
      "Five-character room codes",
      "QR-based room joining",
      "Two-device room limit",
      "Chunked transfer with backpressure handling",
      "Responsive send and receive interface",
      "Host controls and room expiry",
    ],

    technologies: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "Socket.IO",
      "WebRTC",
      "WebRTC DataChannels",
      "STUN",
      "html5-qrcode",
      "JavaScript",
    ],

    techCategories: [
      {
        category: "Frontend",
        description: "Transfer interface and room management",
        items: ["React", "Vite", "Tailwind CSS", "JavaScript"],
      },
      {
        category: "Backend",
        description: "Signaling and peer coordination",
        items: ["Node.js", "Express.js", "Socket.IO"],
      },
      {
        category: "Networking",
        description: "Peer connection and file transport",
        items: ["WebRTC", "DataChannels", "STUN"],
      },
      {
        category: "Utilities",
        description: "Browser QR scanning",
        items: ["html5-qrcode"],
      },
    ],

    metrics: [
      {
        value: "2",
        label: "Devices",
        description: "Maximum participants per room",
      },
      {
        value: "5 Characters",
        label: "Room Code",
        description: "Short code for joining",
      },
      {
        value: "P2P",
        label: "Transfer",
        description: "File bytes travel over the peer connection",
      },
      {
        value: "QR",
        label: "Pairing",
        description: "Scan to join a room",
      },
    ],

    links: {
      github: "https://github.com/Suraj1819/web-drop",
      live: "https://webdrop-eight.vercel.app",
      backend: "https://bambibackend.onrender.com",
      docs: "https://github.com/Suraj1819/web-drop#readme",
    },

    image: null,
    preview: [],
    gallery: [
    ],
    video: null,
    videos: [
      {
        url: "https://www.youtube.com/watch?v=94g6g5Kwl5Q",
        title: "WebRTC DataChannels Explained",
        description: "How peer-to-peer file transfer works in the browser.",
      },
      {
        url: "https://www.youtube.com/watch?v=1SfSLL8DnZ8",
        title: "Socket.IO Signaling Server",
        description: "Coordinating WebRTC peer discovery with Socket.IO.",
      },
      {
        url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        title: "React + Vite Transfer UI",
        description: "Building the responsive send/receive interface.",
      },
    ],

    problem:
      "Transferring files between devices often requires accounts, cloud uploads, or separate applications. WebDrop aims to make device-to-device sharing accessible through a browser and a temporary room.",

    goals: [
      "Create a room using a short, shareable code",
      "Allow joining through a code or QR scan",
      "Establish a WebRTC peer connection",
      "Transfer file chunks with backpressure management",
      "Provide clear connection and transfer states",
      "Limit rooms to two participants",
      "Expire inactive rooms and provide host controls",
    ],

    responsibilities: [
      "Develop the React user interface",
      "Implement Socket.IO signaling",
      "Integrate WebRTC peer connections and DataChannels",
      "Implement chunked file transfer",
      "Manage transfer buffering and progress",
      "Implement room joining and QR workflows",
      "Build responsive desktop and mobile layouts",
    ],

    architecture: {
      summary:
        "The React client uses Socket.IO to communicate with the signaling backend. The signaling layer coordinates peer discovery and WebRTC negotiation. Once the DataChannel is open, file bytes travel through the peer connection. STUN assists ICE connectivity discovery, but does not guarantee successful connections on every network.",

      components: [
        {
          name: "React Client",
          description: "Room UI, file selection, QR scanning, and transfer progress",
        },
        {
          name: "Express and Socket.IO",
          description: "Room management and signaling coordination",
        },
        {
          name: "WebRTC DataChannel",
          description: "Peer-to-peer file transport",
        },
        {
          name: "STUN",
          description: "ICE connectivity discovery for NAT traversal",
        },
      ],

      dataFlow:
        "Host creates room → server issues room code → second device joins → signaling exchanges session descriptions and ICE candidates → DataChannel opens → file is divided into chunks → sender manages bufferedAmount → receiver reassembles and saves the file",
    },

    features: [
      {
        name: "Five-character room codes",
        status: "Completed",
      },
      {
        name: "QR-based room joining",
        status: "Completed",
      },
      {
        name: "Maximum two devices per room",
        status: "Completed",
      },
      {
        name: "WebRTC DataChannel transfer",
        status: "Completed",
      },
      {
        name: "Chunked file transfer",
        status: "Completed",
      },
      {
        name: "Backpressure management",
        status: "Completed",
      },
      {
        name: "Connection status",
        status: "Completed",
      },
      {
        name: "Transfer progress and completion state",
        status: "Completed",
      },
      {
        name: "Host room controls",
        status: "Completed",
      },
      {
        name: "Room expiration",
        status: "Completed",
      },
      {
        name: "Responsive send/receive interface",
        status: "Completed",
      },
      {
        name: "TURN relay fallback",
        status: "Planned",
      },
      {
        name: "Multi-file queue improvements",
        status: "Planned",
      },
    ],

    challenges: [
      {
        title: "NAT traversal",
        description:
          "Some firewalls and network configurations prevent direct peer connections.",
        solution:
          "Use WebRTC ICE negotiation and STUN-assisted connectivity discovery. A TURN service may be needed for additional connectivity.",
      },
      {
        title: "Large file transfer",
        description:
          "Sending large files requires careful handling of DataChannel buffers and incoming chunks.",
        solution:
          "Send data in chunks and pause transmission when the buffered amount exceeds the configured high-water mark.",
      },
      {
        title: "Connection-state feedback",
        description:
          "Users need to understand whether the other device has joined, connected, or started receiving data.",
        solution:
          "Present distinct room, connection, and transfer states in the interface.",
      },
    ],

    learnings: [
      "Difference between WebRTC signaling and data transport",
      "SDP offers, answers, and ICE candidate exchange",
      "DataChannel buffering and backpressure",
      "Peer-to-peer transfer limitations",
      "Responsive real-time interface design",
    ],

    limitations: [
      "Connection success depends on network and firewall configuration",
      "The room supports two devices",
      "Transfer speed depends on device performance and network conditions",
      "A signaling server is required to coordinate connection setup",
      "A TURN relay fallback is not listed as implemented",
    ],

    future: [
      {
        title: "TURN Relay Support",
        description:
          "Add TURN configuration for networks where direct peer connectivity fails.",
      },
      {
        title: "Transfer Queue",
        description:
          "Improve multi-file queue management and progress visibility.",
      },
      {
        title: "Room Security",
        description:
          "Explore optional room passwords and stronger room access controls.",
      },
    ],

    faq: [
      {
        question: "Are files stored on the backend?",
        answer:
          "The signaling backend coordinates the connection; file contents are intended to travel over the WebRTC peer connection rather than being stored by the signaling service.",
      },
      {
        question: "Will WebDrop work on every network?",
        answer:
          "No. Firewall rules, NAT behavior, and browser support can affect peer connectivity.",
      },
      {
        question: "How many devices can join one room?",
        answer:
          "The current room design supports up to two devices.",
      },
    ],
  },

  {
    id: "bambi",
    slug: "bambi",
    title: "Bambi",
    tagline: "Conversations, connected.",
    category: "Full Stack / Real-Time Messaging",
    filters: ["Full Stack", "Real-Time"],
    featured: true,
    status: "In Progress",
    year: "2026",
    duration: "Ongoing",
    role: "Full-Stack Developer",
    team: "Solo",
    audience: "Users who want a modern messaging experience",
    platform: "Responsive Web",

    shortDescription:
      "A messaging application in development, focused on real-time conversations, user discovery, presence, and a polished mobile-friendly interface.",

    description:
      "Bambi is a full-stack messaging application inspired by modern chat platforms. The project uses a React and Vite client, an Express backend, Socket.IO for real-time communication, and PostgreSQL-based persistence. Authentication, messaging, presence, media, and account settings are being developed in stages. Features that are not complete are explicitly marked as in progress or planned.",

    highlights: [
      "Real-time messaging architecture",
      "React-based chat interface",
      "Socket.IO event handling",
      "PostgreSQL persistence",
      "User discovery and profile features",
      "Mobile-friendly chat experience",
      "Theme and wallpaper customization plans",
    ],

    technologies: [
      "React",
      "Vite",
      "React Router",
      "Node.js",
      "Express.js",
      "Socket.IO",
      "PostgreSQL",
      "Supabase",
      "Multer",
      "Zod",
      "Helmet",
      "dotenv",
      "Tailwind CSS",
      "lucide-react",
    ],

    techCategories: [
      {
        category: "Frontend",
        description: "Chat UI and navigation",
        items: ["React", "Vite", "React Router", "Tailwind CSS", "lucide-react"],
      },
      {
        category: "Backend",
        description: "API, validation, and real-time events",
        items: ["Node.js", "Express.js", "Socket.IO", "Multer", "Zod", "Helmet"],
      },
      {
        category: "Database",
        description: "Persistent application data",
        items: ["PostgreSQL", "Supabase"],
      },
      {
        category: "Configuration",
        description: "Environment and application configuration",
        items: ["dotenv"],
      },
    ],

    metrics: [
      {
        value: "Real-time",
        label: "Messaging",
        description: "Socket.IO communication",
      },
      {
        value: "React",
        label: "Client",
        description: "Component-based interface",
      },
      {
        value: "PostgreSQL",
        label: "Persistence",
        description: "Relational data storage",
      },
      {
        value: "In Progress",
        label: "Status",
        description: "Active development",
      },
    ],

    links: {
      github: null,
      live: null,
      backend: null,
    },

    image: null,
    preview: [],
    gallery: [
      "/projects/bambi/image/chat-list.png",
      "/projects/bambi/image/conversation.png",
      "/projects/bambi/image/presence.png",
    ],
    video: null,
    videos: [
      {
        url: "https://www.youtube.com/watch?v=1SfSLL8DnZ8",
        title: "Socket.IO Real-Time Messaging",
        description: "How Socket.IO powers chat delivery and presence.",
      },
      {
        url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        title: "React Chat Interface Design",
        description: "Building a responsive, mobile-friendly chat UI in React.",
      },
      {
        url: "https://www.youtube.com/watch?v=bwf7gQ8afMQ",
        title: "PostgreSQL for Message Persistence",
        description: "Storing users, conversations, and message history.",
      },
    ],

    problem:
      "A messaging application must coordinate user identity, conversations, message persistence, real-time delivery, presence, and consistent state across multiple devices.",

    goals: [
      "Develop phone-based authentication",
      "Support unique usernames and user discovery",
      "Build one-to-one and group conversation workflows",
      "Implement delivery and read states",
      "Add typing indicators and online presence",
      "Support media and document sharing",
      "Provide profile, avatar, theme, and wallpaper settings",
      "Improve reconnection and mobile responsiveness",
    ],

    responsibilities: [
      "Develop the React chat interface",
      "Build Express API routes",
      "Integrate Socket.IO events",
      "Develop database-backed application features",
      "Implement profile and conversation workflows",
      "Improve responsive behavior and theme settings",
      "Test authentication, messaging, and error states",
    ],

    architecture: {
      summary:
        "The React client uses REST endpoints for supported account and application operations and Socket.IO for real-time events. PostgreSQL stores persistent data. Authentication and socket authorization must be validated by the backend before protected events are accepted.",

      components: [
        {
          name: "React and Vite Client",
          description: "Chat interface, user discovery, navigation, and settings",
        },
        {
          name: "Express REST API",
          description: "Account, profile, and conversation endpoints",
        },
        {
          name: "Socket.IO",
          description: "Real-time messaging, typing, and presence events",
        },
        {
          name: "PostgreSQL",
          description: "Persistent users, messages, and conversation records",
        },
      ],

      dataFlow:
        "User authenticates → client establishes an authorized session → client connects to Socket.IO → message is validated and persisted → event is delivered to connected recipients → delivery and read state are updated where implemented",
    },

    features: [
      {
        name: "Phone OTP authentication",
        status: "In Progress",
      },
      {
        name: "Unique usernames",
        status: "In Progress",
      },
      {
        name: "Search by username or phone",
        status: "In Progress",
      },
      {
        name: "Friend requests",
        status: "Planned",
      },
      {
        name: "One-to-one messaging",
        status: "In Progress",
      },
      {
        name: "Group conversations",
        status: "Planned",
      },
      {
        name: "Message delivery states",
        status: "In Progress",
      },
      {
        name: "Read receipts",
        status: "In Progress",
      },
      {
        name: "Typing indicators",
        status: "In Progress",
      },
      {
        name: "Online/offline status",
        status: "In Progress",
      },
      {
        name: "Last seen",
        status: "Planned",
      },
      {
        name: "Image and document attachments",
        status: "Planned",
      },
      {
        name: "Database-synced avatars",
        status: "Planned",
      },
      {
        name: "Real-time avatar updates",
        status: "Planned",
      },
      {
        name: "Chat wallpapers",
        status: "Planned",
      },
      {
        name: "Light/dark theme",
        status: "In Progress",
      },
      {
        name: "Voice and video calls",
        status: "Planned",
      },
      {
        name: "End-to-end encryption",
        status: "Planned",
      },
    ],

    challenges: [
      {
        title: "Consistent message state",
        description:
          "Messages must remain consistent across reconnects and multiple active clients.",
        solution:
          "Use persistent message records, stable message identifiers, and explicit delivery-state transitions.",
      },
      {
        title: "Authentication and real-time security",
        description:
          "Socket connections must not bypass account authentication or authorization rules.",
        solution:
          "Validate sessions and authorize protected socket events on the server.",
      },
      {
        title: "Presence and reconnection",
        description:
          "Temporary network interruptions can leave stale online states or missed events.",
        solution:
          "Develop reconnection handling and reconcile client state with persistent server data.",
      },
    ],

    learnings: [
      "Real-time event-driven application architecture",
      "REST and WebSocket responsibilities",
      "Database-backed messaging workflows",
      "Authentication and authorization boundaries",
      "Responsive chat UI design",
      "Handling reconnects and asynchronous application state",
    ],

    limitations: [
      "The application is still in development",
      "Some chat and account features are incomplete",
      "End-to-end encryption must not be claimed until implemented and verified",
      "Voice and video calling are planned",
      "OTP delivery depends on a configured and working provider",
    ],

    future: [
      {
        title: "Authentication",
        description:
          "Complete OTP verification, session handling, and account recovery.",
      },
      {
        title: "Group Messaging",
        description:
          "Add group creation, membership management, and administrator controls.",
      },
      {
        title: "Media Sharing",
        description:
          "Support image, document, and other attachment workflows.",
      },
      {
        title: "Account Synchronization",
        description:
          "Synchronize avatars and profile updates across active clients.",
      },
      {
        title: "Security",
        description:
          "Design, implement, and independently verify end-to-end encryption before advertising it as available.",
      },
    ],

    faq: [
      {
        question: "Is Bambi complete?",
        answer:
          "No. Bambi is under active development, and individual features may be incomplete.",
      },
      {
        question: "Does Bambi support end-to-end encryption?",
        answer:
          "End-to-end encryption is a planned feature and should not be represented as implemented until it has been built and verified.",
      },
      {
        question: "Does Bambi support group calls?",
        answer:
          "Voice and video calling are future features, not confirmed capabilities of the current version.",
      },
    ],
  },

  {
    id: "bambisync",
    slug: "bambisync",
    title: "BambiSync",
    tagline: "Your devices, connected.",
    category: "Desktop / Nearby Transfer",
    filters: ["Desktop", "Networking", "Experimental"],
    featured: true,
    status: "Prototype",
    year: "2026",
    duration: "Ongoing",
    role: "Developer",
    team: "Solo",
    audience: "Users sharing content between Windows and Android",
    platform: "Windows and Android concept",

    shortDescription:
      "An experimental nearby-transfer project exploring content sharing between a Windows desktop application and Android devices.",

    description:
      "BambiSync explores a convenient way to move short content between a Windows PC and an Android phone. The Windows desktop interface uses WPF, while Bluetooth-preferred connectivity and an Android counterpart form part of the broader design. The project remains a prototype until the complete device-discovery and transfer workflow is verified end to end.",

    highlights: [
      "Windows desktop interface using WPF",
      "Nearby-device transfer concept",
      "Bluetooth-preferred connectivity approach",
      "Text and link sharing as initial goals",
      "Photo and screenshot transfer planned",
    ],

    technologies: [
      "C#",
      "WPF",
      "XAML",
      "Windows",
      "Bluetooth",
      "Android",
    ],

    techCategories: [
      {
        category: "Desktop",
        description: "Windows desktop application",
        items: ["C#", "WPF", "XAML"],
      },
      {
        category: "Connectivity",
        description: "Nearby device communication",
        items: ["Bluetooth"],
      },
      {
        category: "Mobile",
        description: "Companion application",
        items: ["Android"],
      },
    ],

    metrics: [
      {
        value: "WPF",
        label: "Desktop UI",
        description: "Windows application",
      },
      {
        value: "Nearby",
        label: "Connectivity",
        description: "Cross-device transfer concept",
      },
      {
        value: "Prototype",
        label: "Stage",
        description: "Early development",
      },
      {
        value: "Windows + Android",
        label: "Goal",
        description: "Cross-platform workflow",
      },
    ],

    links: {
      github: null,
      live: null,
    },

    image: null,
    preview: [],
    gallery: [
      "/projects/bambisync/image/windows-client.png",
      "/projects/bambisync/image/device-discovery.png",
      "/projects/bambisync/image/transfer-concept.png",
    ],
    video: null,
    videos: [
      {
        url: "https://www.youtube.com/watch?v=7Lx2Qd1q3mI",
        title: "Bluetooth Low Energy Explained",
        description: "How BLE enables nearby device communication.",
      },
      {
        url: "https://www.youtube.com/watch?v=Z5Y3g5m5z5E",
        title: "WPF Desktop App Development",
        description: "Building the Windows client interface with WPF and XAML.",
      },
      {
        url: "https://www.youtube.com/watch?v=4HKq4bZ4m5A",
        title: "Cross-Platform Transfer Concepts",
        description: "Designing nearby-transfer workflows between Windows and Android.",
      },
    ],

    problem:
      "Moving text, links, and screenshots between a computer and a phone can involve cloud services, cables, or multiple manual steps. BambiSync explores a nearby-transfer workflow intended to reduce that friction.",

    goals: [
      "Develop a Windows desktop interface",
      "Explore nearby-device discovery",
      "Establish a reliable connection between Windows and Android",
      "Support text and link transfer",
      "Extend the transfer workflow to photos and screenshots",
    ],

    responsibilities: [
      "Explore the Windows desktop UI using WPF",
      "Design the device-discovery experience",
      "Investigate Bluetooth-based connectivity",
      "Plan the Windows-to-Android transfer workflow",
      "Identify cross-platform permissions and compatibility requirements",
    ],

    architecture: {
      summary:
        "The current project direction centers on a WPF Windows client and a planned Android counterpart. Bluetooth is the preferred nearby-connectivity direction, but the final transport and end-to-end capabilities should be documented only after implementation and testing.",

      components: [
        {
          name: "Windows Client",
          description: "WPF desktop interface",
        },
        {
          name: "Device Discovery",
          description: "Nearby device discovery and pairing concept",
        },
        {
          name: "Bluetooth Connectivity",
          description: "Potential nearby communication mechanism",
        },
        {
          name: "Android Companion",
          description: "Planned mobile-side application",
        },
      ],

      dataFlow:
        "Open Windows application → discover compatible nearby devices → select a device → establish a supported connection → exchange text or links when implemented → extend to photos and screenshots in a future version",
    },

    features: [
      {
        name: "WPF Windows interface",
        status: "In Progress",
      },
      {
        name: "Bluetooth device discovery",
        status: "Planned",
      },
      {
        name: "Device pairing",
        status: "Planned",
      },
      {
        name: "Text transfer",
        status: "Planned",
      },
      {
        name: "Link transfer",
        status: "Planned",
      },
      {
        name: "Photo transfer",
        status: "Planned",
      },
      {
        name: "Screenshot transfer",
        status: "Planned",
      },
      {
        name: "Android companion application",
        status: "Planned",
      },
    ],

    challenges: [
      {
        title: "Cross-platform connectivity",
        description:
          "Windows and Android have different APIs, permission models, and Bluetooth capabilities.",
        solution:
          "Evaluate compatible transport approaches and implement a clear connection lifecycle.",
      },
      {
        title: "Device discovery",
        description:
          "Nearby discovery must handle unavailable devices, permission failures, and interrupted connections.",
        solution:
          "Provide explicit permission handling and connection-state feedback.",
      },
      {
        title: "Transfer reliability",
        description:
          "Different content types require reliable payload handling and transfer confirmation.",
        solution:
          "Define payload formats, size limits, and transfer completion states before expanding the supported content types.",
      },
    ],

    learnings: [
      "Windows desktop UI development with WPF",
      "XAML layout and component behavior",
      "Cross-platform device communication constraints",
      "Nearby transfer architecture",
      "Device discovery and connection-state design",
    ],

    limitations: [
      "The project is still a prototype",
      "A complete Windows-to-Android transfer flow is not verified",
      "Bluetooth behavior depends on hardware and operating-system support",
      "Photo and screenshot transfer are planned",
    ],

    future: [
      {
        title: "Core Text Transfer",
        description:
          "Complete and test text transfer between compatible Windows and Android clients.",
      },
      {
        title: "Link Sharing",
        description:
          "Add a reliable workflow for transferring and opening shared links.",
      },
      {
        title: "Media Transfer",
        description:
          "Extend the transfer pipeline to photos and screenshots.",
      },
      {
        title: "Device Discovery",
        description:
          "Improve nearby-device discovery, pairing, and connection feedback.",
      },
    ],

    faq: [
      {
        question: "Is BambiSync production-ready?",
        answer:
          "No. It is an experimental project and needs end-to-end cross-device testing.",
      },
      {
        question: "Does it transfer files over Bluetooth right now?",
        answer:
          "Bluetooth is the preferred design direction, but working transfer capabilities should only be advertised after they are implemented and tested.",
      },
    ],
  },

  {
    id: "happylamb",
    slug: "happylamb",
    title: "HappyLamb",
    tagline: "A digital presence built for a real business.",
    category: "Production Website / Full Stack",
    filters: ["Full Stack", "Production", "Web Development"],
    featured: true,
    status: "Live",
    year: "2025",
    duration: "Ongoing",
    role: "Web Developer",
    team: "Project team",
    audience: "Business customers and website visitors",
    platform: "Responsive Web",

    shortDescription:
      "A production business website with service, work, team, client, and contact sections, built with a modern web stack.",

    description:
      "HappyLamb is a production website developed to present the business, its services, work, clients, and team. The site uses a modern React-based stack with a Vite-powered development workflow and a dedicated contact API. The visual identity uses orange, dark charcoal, and white to maintain a recognizable business-focused presentation.",

    highlights: [
      "Production website",
      "Business-focused visual identity",
      "Services and work presentation",
      "Client and team sections",
      "Contact form API integration",
      "Responsive website layout",
    ],

    technologies: [
      "React",
      "Vite",
      "TanStack Start",
      "TanStack Router",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "REST API",
      "Render",
      "Vercel",
      "Plesk",
      "Git",
      "GitHub",
    ],

    techCategories: [
      {
        category: "Frontend",
        description: "Business website and page navigation",
        items: ["React", "Vite", "TanStack Start", "TanStack Router", "Tailwind CSS"],
      },
      {
        category: "Backend",
        description: "Contact form API",
        items: ["Node.js", "Express.js", "REST API"],
      },
      {
        category: "Deployment",
        description: "Hosting and domain configuration",
        items: ["Vercel", "Render", "Plesk"],
      },
      {
        category: "Version Control",
        description: "Source code management",
        items: ["Git", "GitHub"],
      },
    ],

    metrics: [
      {
        value: "Production",
        label: "Status",
        description: "Live business website",
      },
      {
        value: "7",
        label: "Main Sections",
        description: "Home, About, Services, Work, Clients, Team, Contact",
      },
      {
        value: "REST",
        label: "Contact API",
        description: "Dedicated backend endpoint",
      },
      {
        value: "Responsive",
        label: "Design",
        description: "Modern web interface",
      },
    ],

    links: {
      live: "https://happylamb.in",
      github: "https://github.com/HappyLamb1/happylamb",
      backend: null,
    },

    image: null,
    preview: [],
    gallery: [
      "/projects/happylamb/image/home.png",
      "/projects/happylamb/image/services.png",
      "/projects/happylamb/image/contact.png",
    ],
    video: null,
    videos: [
      {
        url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        title: "React for Business Websites",
        description: "Building a production business website with React and Vite.",
      },
      {
        url: "https://www.youtube.com/watch?v=vPRIWfMM2Ew",
        title: "Tailwind CSS for Brand Identity",
        description: "Creating a consistent orange, charcoal, and white visual system.",
      },
      {
        url: "https://www.youtube.com/watch?v=O6q5Bz3Bci8",
        title: "Contact Form API with Express",
        description: "Processing contact submissions through a dedicated REST API.",
      },
    ],

    problem:
      "A business website needs to communicate its services, work, team, and brand identity clearly while giving visitors a straightforward way to make contact.",

    goals: [
      "Present business information in a structured layout",
      "Create dedicated service and work sections",
      "Communicate the brand through consistent visual design",
      "Provide a contact form connected to a backend API",
      "Maintain a responsive experience across devices",
    ],

    responsibilities: [
      "Contribute to website implementation",
      "Develop and maintain responsive UI components",
      "Work with page navigation and content sections",
      "Integrate the contact form with its API",
      "Work with hosting and domain deployment configuration",
      "Maintain the source code through Git",
    ],

    architecture: {
      summary:
        "The website uses a React-based frontend and a separate contact API. The frontend is deployed through the configured web hosting platform, while the contact endpoint is hosted separately. The domain configuration connects the public website to its deployment.",

      components: [
        {
          name: "Website Frontend",
          description: "Business pages and responsive UI",
        },
        {
          name: "Contact Form",
          description: "Visitor input and validation interface",
        },
        {
          name: "Contact REST API",
          description: "Processes contact submissions",
        },
        {
          name: "Hosting and Domain",
          description: "Frontend, API, and domain configuration",
        },
      ],

      dataFlow:
        "Visitor opens website → navigates to business sections → submits contact form → frontend sends request to contact API → API processes the submission and returns a response",
    },

    features: [
      {
        name: "Home page",
        status: "Completed",
      },
      {
        name: "About section",
        status: "Completed",
      },
      {
        name: "Services section",
        status: "Completed",
      },
      {
        name: "Work portfolio section",
        status: "Completed",
      },
      {
        name: "Clients section",
        status: "Completed",
      },
      {
        name: "Team section",
        status: "Completed",
      },
      {
        name: "Contact section",
        status: "Completed",
      },
      {
        name: "Contact REST API",
        status: "Completed",
      },
      {
        name: "Responsive layout",
        status: "Completed",
      },
    ],

    challenges: [
      {
        title: "Consistent visual identity",
        description:
          "The website needs a recognizable brand identity across different sections and screen sizes.",
        solution:
          "Use a consistent orange, charcoal, and white palette with shared UI patterns.",
      },
      {
        title: "Frontend and backend integration",
        description:
          "The contact form depends on a separately deployed API.",
        solution:
          "Configure the frontend API endpoint and handle submission states and API errors.",
      },
      {
        title: "Production deployment",
        description:
          "Domain routing and hosting configuration must work across the frontend and backend.",
        solution:
          "Maintain the appropriate deployment and domain configuration for each service.",
      },
    ],

    learnings: [
      "Production website development",
      "Component-based React UI",
      "Contact API integration",
      "Deployment and domain configuration",
      "Maintaining a consistent brand identity",
    ],

    limitations: [
      "Do not assume an admin dashboard or login system exists",
      "Do not claim database features without confirming the implementation",
      "Contact delivery depends on the configured API and its downstream services",
    ],

    future: [
      {
        title: "Performance Improvements",
        description:
          "Continue improving page loading, media handling, and responsive behavior.",
      },
      {
        title: "Accessibility",
        description:
          "Review keyboard navigation, focus states, semantics, and contrast.",
      },
      {
        title: "Content Management",
        description:
          "Explore a secure content management workflow if the business needs one.",
      },
    ],

    faq: [
      {
        question: "Is HappyLamb live?",
        answer:
          "The public website is available at happylamb.in.",
      },
      {
        question: "Does the website have an admin dashboard?",
        answer:
          "An admin dashboard should not be assumed to exist unless it has been separately implemented.",
      },
    ],
  },

  {
    id: "portfolio",
    slug: "portfolio",
    title: "Developer Portfolio",
    tagline: "Building and documenting real software projects.",
    category: "Personal Portfolio / Creative Development",
    filters: ["Frontend", "Full Stack", "UI/UX"],
    featured: true,
    status: "Live",
    year: "2025",
    duration: "Ongoing",
    role: "Designer & Full-Stack Developer",
    team: "Solo",
    audience: "Recruiters, clients, developers, and collaborators",
    platform: "Responsive Web",

    shortDescription:
      "A personal developer portfolio showcasing projects, skills, experience, and contact information through a responsive React application.",

    description:
      "The portfolio presents development projects, technical skills, experience, and professional information through a multi-page interface. It uses React, Vite, and Tailwind CSS, with shared components, responsive layouts, and theme support. Project details are organized so visitors can explore the purpose, stack, architecture, and status of individual projects.",

    highlights: [
      "Multi-page developer portfolio",
      "Project listings and detailed case studies",
      "Responsive interface",
      "Light and dark theme support",
      "Skills and experience sections",
      "Contact section",
    ],

    technologies: [
      "React",
      "Vite",
      "JavaScript",
      "Tailwind CSS",
      "React Router",
      "lucide-react",
      "Git",
      "GitHub",
    ],

    techCategories: [
      {
        category: "Frontend",
        description: "Application interface and routing",
        items: ["React", "Vite", "JavaScript", "React Router"],
      },
      {
        category: "Styling",
        description: "Responsive design and reusable styles",
        items: ["Tailwind CSS"],
      },
      {
        category: "Icons",
        description: "Interface iconography",
        items: ["lucide-react"],
      },
      {
        category: "Development",
        description: "Version control and collaboration",
        items: ["Git", "GitHub"],
      },
    ],

    metrics: [
      {
        value: "Multi-page",
        label: "Structure",
        description: "Dedicated professional sections",
      },
      {
        value: "2",
        label: "Themes",
        description: "Light and dark modes",
      },
      {
        value: "Responsive",
        label: "Layout",
        description: "Desktop and mobile",
      },
      {
        value: "Live",
        label: "Deployment",
        description: "Public portfolio",
      },
    ],

    links: {
      live: "https://surajzxrt.online",
      github: "https://github.com/Suraj1819",
    },

    image: null,
    preview: [],
    gallery: [
      "/projects/portfolio/image/home.png",
      "/projects/portfolio/image/projects.png",
      "/projects/portfolio/image/project-detail.png",
    ],
    video: null,
    videos: [
      {
        url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        title: "React Multi-Page Portfolio",
        description: "Building a multi-page developer portfolio with React Router.",
      },
      {
        url: "https://www.youtube.com/watch?v=KCrXgy8qtjM",
        title: "Vite for Fast Development",
        description: "Using Vite for instant HMR and fast builds.",
      },
      {
        url: "https://www.youtube.com/watch?v=vPRIWfMM2Ew",
        title: "Tailwind CSS Theme System",
        description: "Implementing light/dark theme support with Tailwind CSS.",
      },
    ],

    problem:
      "A developer portfolio should make it easy for recruiters and clients to understand a developer's skills, review real work, and find relevant contact information without navigating a generic template.",

    goals: [
      "Present technical skills clearly",
      "Show projects with meaningful descriptions",
      "Explain project architecture and technology choices",
      "Provide professional background and experience",
      "Maintain a responsive and accessible interface",
      "Offer a consistent light/dark theme experience",
    ],

    responsibilities: [
      "Design the overall portfolio structure",
      "Build reusable React components",
      "Create project listing and detail interfaces",
      "Organize technical skills and experience",
      "Implement responsive layouts",
      "Maintain navigation and theme consistency",
      "Deploy and maintain the public website",
    ],

    architecture: {
      summary:
        "The portfolio is a React and Vite application with reusable components, client-side routing, and Tailwind CSS styling. The project data is maintained separately from the page components so the portfolio can display project information consistently.",

      components: [
        {
          name: "React Application",
          description: "Page structure and reusable UI components",
        },
        {
          name: "React Router",
          description: "Client-side page navigation",
        },
        {
          name: "Project Data",
          description: "Structured project information and technology stacks",
        },
        {
          name: "Tailwind CSS",
          description: "Responsive styling and visual consistency",
        },
      ],

      dataFlow:
        "Visitor opens portfolio → navigates to a section → project listing reads structured project data → visitor opens a project detail page → project information is rendered through reusable components",
    },

    features: [
      {
        name: "Responsive homepage",
        status: "Completed",
      },
      {
        name: "Projects listing",
        status: "Completed",
      },
      {
        name: "Project detail information",
        status: "Completed",
      },
      {
        name: "Skills section",
        status: "Completed",
      },
      {
        name: "Experience section",
        status: "Completed",
      },
      {
        name: "About section",
        status: "Completed",
      },
      {
        name: "Contact section",
        status: "Completed",
      },
      {
        name: "Light/dark theme",
        status: "Completed",
      },
      {
        name: "Responsive navigation",
        status: "Completed",
      },
      {
        name: "Project screenshots and video galleries",
        status: "In Progress",
      },
    ],

    challenges: [
      {
        title: "Clear project presentation",
        description:
          "Technical projects need enough detail to demonstrate engineering work without overwhelming visitors.",
        solution:
          "Separate summaries, technology stacks, features, and architecture into structured project data.",
      },
      {
        title: "Consistent styling",
        description:
          "Different portfolio pages need to share a common visual language.",
        solution:
          "Use reusable components, shared styling conventions, and consistent theme behavior.",
      },
      {
        title: "Responsive design",
        description:
          "Dense project information must remain readable on smaller screens.",
        solution:
          "Use responsive layouts, clear hierarchy, and compact project summaries.",
      },
    ],

    learnings: [
      "Reusable React component design",
      "Client-side routing",
      "Responsive layout implementation",
      "Structured content-driven interfaces",
      "Theme-aware UI development",
      "Project documentation and presentation",
    ],

    limitations: [
      "Project media galleries depend on real screenshot assets",
      "Only verified features should be presented as completed",
      "Additional backend features should be documented only if implemented",
    ],

    future: [
      {
        title: "Project Media",
        description:
          "Add verified screenshots and demo videos for the featured projects.",
      },
      {
        title: "Case Study Improvements",
        description:
          "Document technical decisions, implementation challenges, and outcomes.",
      },
      {
        title: "Accessibility Review",
        description:
          "Continue improving keyboard access, semantic markup, and reduced-motion support.",
      },
    ],

    faq: [
      {
        question: "What is the purpose of the portfolio?",
        answer:
          "It presents professional experience, technical skills, and software projects in one place.",
      },
      {
        question: "Where can I find the source code?",
        answer:
          "The GitHub profile is available at github.com/Suraj1819. Individual repositories should be linked when verified.",
      },
    ],
  },

  {
    id: "wherewasit",
    slug: "wherewasit",
    title: "WhereWasIt?",
    tagline: "Remember where you left it.",
    category: "Product Concept / Productivity",
    filters: ["Product Concept", "Experimental"],
    featured: false,
    status: "Concept",
    year: null,
    duration: null,
    role: "Concept & Product Planning",
    team: "Solo",
    audience: "People who want to remember where they placed everyday objects",
    platform: "Planned",

    shortDescription:
      "A paused smart object-memory concept designed to help people record and retrieve where they last placed everyday belongings.",

    description:
      "WhereWasIt? is an early product concept focused on remembering the last known location of everyday objects. The idea is to reduce the time spent searching for frequently misplaced items by allowing users to record an object's location and retrieve that information later. The implementation approach and feature set remain subject to product planning.",

    highlights: [
      "Everyday object-memory concept",
      "Focus on reducing time spent searching",
      "Potential object records and location notes",
      "Early-stage product exploration",
    ],

    technologies: [],

    techCategories: [],

    metrics: [
      {
        value: "Concept",
        label: "Stage",
        description: "Product idea",
      },
      {
        value: "Object Memory",
        label: "Purpose",
        description: "Remember where items were last placed",
      },
    ],

    links: {
      github: null,
      live: null,
    },

    image: null,
    preview: [],
    gallery: [
      "/projects/wherewasit/image/concept.png",
      "/projects/wherewasit/image/record.png",
      "/projects/wherewasit/image/search.png",
    ],
    video: null,
    videos: [
      {
        url: "https://www.youtube.com/watch?v=4HKq4bZ4m5A",
        title: "Object Memory App Concept",
        description: "Designing an app to remember where everyday items were placed.",
      },
      {
        url: "https://www.youtube.com/watch?v=5xj5vk2Qw1Y",
        title: "Privacy-First App Design",
        description: "Minimising data collection for location-aware features.",
      },
      {
        url: "https://www.youtube.com/watch?v=7Lx2Qd1q3mI",
        title: "Smart Reminder Systems",
        description: "Exploring optional reminders based on saved object data.",
      },
    ],

    problem:
      "People sometimes forget where they last placed everyday belongings and spend time searching for them.",

    goals: [
      "Explore a simple way to record object locations",
      "Make saved information easy to retrieve",
      "Keep the concept practical for everyday use",
      "Evaluate possible privacy-friendly storage approaches",
    ],

    responsibilities: [
      "Develop the initial product concept",
      "Explore potential user workflows",
      "Identify the core problem and possible solutions",
    ],

    architecture: {
      summary:
        "The technical architecture has not yet been finalized. A future implementation could begin with a simple application for saving object names and their last-known locations.",

      components: [
        {
          name: "Object Records",
          description: "Potential storage for item names and notes",
        },
        {
          name: "Search Interface",
          description: "Potential workflow for finding saved records",
        },
        {
          name: "Location Notes",
          description: "Potential manual location descriptions",
        },
      ],

      dataFlow:
        "User records an object's name and location → application saves the record → user searches for the object later → application displays the saved information",
    },

    features: [
      {
        name: "Product concept",
        status: "Completed",
      },
      {
        name: "Object record creation",
        status: "Planned",
      },
      {
        name: "Search saved objects",
        status: "Planned",
      },
      {
        name: "Last-known location notes",
        status: "Planned",
      },
      {
        name: "Automatic location detection",
        status: "Planned",
      },
    ],

    challenges: [
      {
        title: "Keeping information useful",
        description:
          "Saved object locations can become outdated when items are moved.",
        solution:
          "Explore timestamps and clear last-updated information for saved records.",
      },
      {
        title: "Privacy",
        description:
          "Location-related information can be sensitive depending on how it is collected and stored.",
        solution:
          "Prefer transparent permissions and minimal data collection.",
      },
    ],

    learnings: [
      "Problem-first product planning",
      "Identifying core user workflows",
      "Evaluating privacy requirements early",
    ],

    limitations: [
      "This is a concept, not a completed application",
      "No production deployment is available",
      "No automatic tracking capability is confirmed",
      "The technology stack has not been finalized",
    ],

    future: [
      {
        title: "Minimum Viable Product",
        description:
          "Build a simple version for manually recording and searching object locations.",
      },
      {
        title: "Smart Reminders",
        description:
          "Explore optional reminders based on saved object information.",
      },
      {
        title: "Privacy-First Design",
        description:
          "Define clear data retention and permission behavior before adding location features.",
      },
    ],

    faq: [
      {
        question: "Is WhereWasIt? available to use?",
        answer:
          "No. It is an early-stage concept rather than a completed public application.",
      },
      {
        question: "Does it automatically track objects?",
        answer:
          "Automatic tracking has not been implemented or verified.",
      },
    ],
  },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug) ?? null;
}

export function getAdjacentProjects(slug) {
  const index = projects.findIndex((project) => project.slug === slug);

  if (index === -1) {
    return {
      prev: null,
      next: null,
    };
  }

  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}

const getProjectUrl = (project, ...keys) => {
  for (const key of keys) {
    const value = project?.links?.[key] ?? project?.[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

export const portfolioStats = {
  totalProjects: projects.length,

  completedProjects: projects.filter((project) =>
    /complete|done|live|deployed/i.test(project.status ?? "")
  ).length,

  totalTechnologies: new Set(
    projects.flatMap((project) =>
      (project.technologies ?? [])
        .map((tech) =>
          typeof tech === "string"
            ? tech
            : tech?.name ?? tech?.label ?? tech?.title ?? ""
        )
        .filter(Boolean)
    )
  ).size,

  liveDemos: projects.filter((project) =>
    getProjectUrl(project, "live", "demo", "website")
  ).length,

  repositories: projects.filter((project) =>
    getProjectUrl(project, "github", "repo", "source")
  ).length,

  yearsActive: new Set(
    projects
      .map((project) => Number(project.year))
      .filter((year) => Number.isFinite(year) && year > 0)
  ).size,
};
