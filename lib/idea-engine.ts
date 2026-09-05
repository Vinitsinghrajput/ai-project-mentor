// AI Idea Generator Engine
// Produces structured project ideas and roadmaps tailored to student skills, interests, and difficulty.
// Uses a knowledge base of project archetypes mapped to domains, then composes unique concepts.

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface AssessmentInput {
  skills: string[];
  interests: string[];
  difficulty: Difficulty;
}

export interface ProjectIdea {
  id: string;
  title: string;
  elevatorPitch: string;
  category: string;
  difficulty: Difficulty;
  tags: string[];
  icon: string;
}

export interface RoadmapSection {
  heading: string;
  content: string;
}

export interface TechStackItem {
  layer: string;
  technologies: string[];
}

export interface SprintPlan {
  week: string;
  title: string;
  tasks: string[];
  deliverable: string;
}

export interface Roadmap {
  overview: string;
  coreFeatures: {
    mvp: string[];
    future: string[];
  };
  techStack: TechStackItem[];
  architecture: string;
  architectureMarkdown: string;
  sprintPlan: SprintPlan[];
  resumeAngle: string;
  resumeAngleMarkdown: string;
  challenges: string[];
  learningOutcomes: string[];
}

export interface FullProject extends ProjectIdea {
  roadmap: Roadmap;
  assessment: AssessmentInput;
}

// ---- Knowledge Base ----

interface ProjectArchetype {
  titleTemplate: (ctx: ArchetypeContext) => string;
  pitch: (ctx: ArchetypeContext) => string;
  category: string;
  icon: string;
  relevantInterests: string[];
  relevantSkills: string[];
  minDifficulty: Difficulty;
  techStack: (ctx: ArchetypeContext) => TechStackItem[];
  architecture: (ctx: ArchetypeContext) => string;
  coreMvp: (ctx: ArchetypeContext) => string[];
  coreFuture: (ctx: ArchetypeContext) => string[];
  sprints: (ctx: ArchetypeContext) => SprintPlan[];
  resumeAngle: (ctx: ArchetypeContext) => string;
  challenges: (ctx: ArchetypeContext) => string[];
  learningOutcomes: (ctx: ArchetypeContext) => string[];
}

interface ArchetypeContext {
  skills: string[];
  interests: string[];
  difficulty: Difficulty;
  matchedSkills: string[];
  matchedInterests: string[];
}

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

// Normalize skill/interest strings for matching
function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function matchKeywords(input: string[], keywords: string[]): string[] {
  const normalized = input.map(normalize);
  return keywords.filter((k) =>
    normalized.some((n) => n.includes(k) || k.includes(n))
  );
}

function pickBestSkill(skills: string[], preferred: string[]): string {
  const normalized = skills.map(normalize);
  for (const p of preferred) {
    const found = skills.find((s) => normalize(s).includes(p));
    if (found) return found;
  }
  return skills[0] || 'Python';
}

// ---- Project Archetypes ----

const ARCHETYPES: ProjectArchetype[] = [
  {
    category: 'Healthcare AI',
    icon: 'HeartPulse',
    relevantInterests: ['healthcare', 'health', 'medical', 'ai', 'ml', 'machine learning'],
    relevantSkills: ['python', 'tensorflow', 'pytorch', 'scikit', 'react', 'flask', 'django', 'fastapi'],
    minDifficulty: 'intermediate',
    titleTemplate: (ctx) =>
      `MediScan AI: ${pickBestSkill(ctx.skills, ['python', 'tensorflow'])}-Powered Medical Image Diagnosis Assistant`,
    pitch: (ctx) =>
      `An AI-powered diagnostic assistant that analyzes medical images (X-rays, skin lesions) and provides preliminary classification with confidence scores. ${ctx.matchedSkills.length > 0 ? `Leverages your ${ctx.matchedSkills.slice(0, 2).join(' and ')} skills` : 'Uses deep learning'} to assist healthcare professionals in triage, reducing diagnosis time and improving early detection rates in underserved clinics.`,
    techStack: (ctx) => [
      { layer: 'Frontend', technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts'] },
      { layer: 'Backend', technologies: ['FastAPI (Python)', 'Uvicorn', 'Celery (async tasks)'] },
      { layer: 'Database', technologies: ['PostgreSQL', 'Redis (task queue)'] },
      { layer: 'AI / ML', technologies: ['TensorFlow / PyTorch', 'OpenCV', 'Pre-trained CNN (ResNet/EfficientNet)'] },
      { layer: 'Infrastructure', technologies: ['Docker', 'AWS S3 (image storage)', 'GPU instance for inference'] },
    ],
    architecture: (ctx) =>
      `The system follows a three-tier architecture: a React frontend where medical staff upload images and view results, a FastAPI backend that orchestrates authentication, request handling, and job queuing via Celery, and a dedicated ML inference service. Uploaded images are stored in S3 and pushed to a Redis-backed Celery queue. A worker process loads the CNN model, runs inference, and stores results in PostgreSQL. The frontend polls or receives a WebSocket notification when diagnosis is complete. Authentication is handled via JWT tokens with role-based access (doctor vs. technician).`,
    coreMvp: () => [
      'User authentication with role-based access (doctor, technician, admin)',
      'Image upload with drag-and-drop and preview',
      'AI inference pipeline: image → preprocessing → CNN model → classification result',
      'Diagnosis results dashboard with confidence scores and heatmap overlay',
      'Patient case history with searchable records',
      'Export diagnosis report as PDF',
    ],
    coreFuture: () => [
      'Multi-model ensemble for cross-validation and higher accuracy',
      'Grad-CAM visualizations showing which image regions drove the prediction',
      'Federated learning across multiple clinics without sharing raw data',
      'Real-time collaboration and second-opinion routing between doctors',
      'Integration with HL7/FHIR healthcare data standards',
      'Mobile app for field use in remote clinics',
    ],
    sprints: (ctx) => [
      {
        week: 'Week 1',
        title: 'Project Setup & Authentication',
        tasks: [
          'Initialize FastAPI backend with project structure (routers, models, schemas)',
          'Set up React frontend with Tailwind and routing',
          'Implement JWT authentication with role-based access control',
          'Create PostgreSQL database schema (users, cases, diagnoses)',
          'Configure Docker Compose for local development',
        ],
        deliverable: 'Working auth system with role-based login and basic project scaffold',
      },
      {
        week: 'Week 2',
        title: 'Image Upload & Storage Pipeline',
        tasks: [
          'Build drag-and-drop image upload component in React',
          'Implement S3-compatible storage for medical images',
          'Create API endpoints for case creation and image retrieval',
          'Add image validation (format, size, resolution checks)',
          'Build patient case management UI with search',
        ],
        deliverable: 'Users can upload medical images and manage patient cases',
      },
      {
        week: 'Week 3',
        title: 'AI Inference Engine',
        tasks: [
          'Select and load a pre-trained CNN model (ResNet50 or EfficientNet)',
          'Build Celery worker for async inference jobs',
          'Implement image preprocessing pipeline (resize, normalize, augment)',
          'Create inference API endpoint that queues jobs via Redis',
          'Add WebSocket or polling for real-time result delivery',
        ],
        deliverable: 'Images are processed through the AI model and return classification results',
      },
      {
        week: 'Week 4',
        title: 'Results Dashboard & Reporting',
        tasks: [
          'Build diagnosis results view with confidence scores and visualizations',
          'Add Grad-CAM heatmap overlay showing model attention regions',
          'Implement PDF report generation with patient and diagnosis details',
          'Create historical diagnosis timeline per patient',
          'Add admin dashboard with usage analytics',
        ],
        deliverable: 'Complete diagnosis dashboard with exportable reports and visual analytics',
      },
      {
        week: 'Week 5',
        title: 'Testing, Polish & Deployment',
        tasks: [
          'Write unit tests for backend API endpoints (pytest)',
          'Add integration tests for the full inference pipeline',
          'Implement error handling and loading states throughout the UI',
          'Deploy backend to AWS/GCP with Docker',
          'Deploy frontend to Vercel and configure custom domain',
          'Write comprehensive README with setup instructions',
        ],
        deliverable: 'Production-deployed application with tests, documentation, and live demo',
      },
    ],
    resumeAngle: (ctx) =>
      `**"Built an AI-powered medical image diagnosis platform that classifies X-ray and skin lesion images using a pre-trained CNN, achieving real-time inference through an async Celery-based processing pipeline."**\n\n**Talking Points for Interviews:**\n- Designed a **three-tier architecture** with async job queuing (Celery + Redis) to handle long-running ML inference without blocking the API — a pattern used in production ML systems.\n- Integrated **computer vision models** (ResNet/EfficientNet) with a web frontend, demonstrating full-stack ML engineering capability.\n- Implemented **role-based access control** and HIPAA-conscious data handling patterns for healthcare applications.\n- Used **Docker and AWS S3** for containerized deployment and scalable image storage.\n- **Ask in interviews:** "How would you handle model drift and retrain with new clinical data?" — shows you think beyond the MVP.`,
    challenges: () => [
      'Handling large medical image files efficiently (compression, streaming uploads)',
      'Managing async ML inference without blocking the main API thread',
      'Ensuring model predictions are explainable (Grad-CAM heatmaps)',
      'Designing a schema that handles the relationship between patients, cases, and multiple diagnoses',
    ],
    learningOutcomes: () => [
      'Full-stack ML system design: integrating AI models into a web application',
      'Async task processing with Celery and Redis',
      'Computer vision fundamentals: CNNs, transfer learning, image preprocessing',
      'Healthcare data handling and privacy considerations',
      'Docker containerization and cloud deployment',
    ],
  },
  {
    category: 'FinTech Platform',
    icon: 'Wallet',
    relevantInterests: ['fintech', 'finance', 'banking', 'payments', 'trading', 'crypto'],
    relevantSkills: ['react', 'node', 'python', 'postgresql', 'mongodb', 'express', 'nextjs', 'typescript'],
    minDifficulty: 'intermediate',
    titleTemplate: (ctx) =>
      `FinTrack: AI-Driven Personal Finance & Expense Intelligence Platform`,
    pitch: (ctx) =>
      `A personal finance dashboard that automatically categorizes transactions, predicts monthly spending patterns, and provides AI-powered savings recommendations. ${ctx.matchedSkills.length > 0 ? `Built with your ${ctx.matchedSkills.slice(0, 2).join(' and ')} expertise` : 'Uses ML and modern web technologies'} to give users actionable insights into their financial habits, turning raw transaction data into a proactive financial advisor.`,
    techStack: (ctx) => [
      { layer: 'Frontend', technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Recharts'] },
      { layer: 'Backend', technologies: ['Node.js / Express', 'REST API', 'JWT Auth'] },
      { layer: 'Database', technologies: ['PostgreSQL', 'Prisma ORM'] },
      { layer: 'AI / Analytics', technologies: ['Python (categorization model)', 'scikit-learn', 'pandas'] },
      { layer: 'Infrastructure', technologies: ['Docker', 'Vercel (frontend)', 'Railway/Render (backend)'] },
    ],
    architecture: (ctx) =>
      `The application uses a decoupled architecture: a Next.js frontend with server-side rendering for SEO and performance, an Express REST API for transaction management and user operations, and a separate Python microservice for ML-powered transaction categorization. When users import bank statements (CSV/Plaid), the Express API stores raw transactions in PostgreSQL, then calls the Python categorization service which uses a trained classifier to assign categories. The frontend fetches categorized data and renders interactive charts, spending predictions, and savings recommendations. Prisma ORM handles database migrations and type-safe queries.`,
    coreMvp: () => [
      'User authentication with secure session management',
      'CSV bank statement upload and parsing',
      'Automatic transaction categorization using ML classifier',
      'Interactive spending dashboard with category breakdowns',
      'Monthly budget setting and tracking with visual progress',
      'Spending trends over time with line/area charts',
    ],
    coreFuture: () => [
      'Plaid integration for automatic bank account linking',
      'AI-powered savings recommendations based on spending patterns',
      'Predictive monthly spending forecast using time series models',
      'Bill split and group expense tracking',
      'Natural language financial queries ("How much did I spend on food last month?")',
      'Mobile app with receipt scanning and OCR',
    ],
    sprints: (ctx) => [
      {
        week: 'Week 1',
        title: 'Foundation & Authentication',
        tasks: [
          'Set up Next.js frontend with TypeScript and Tailwind',
          'Initialize Express backend with project structure',
          'Configure PostgreSQL with Prisma ORM and initial schema',
          'Implement JWT-based authentication (signup, login, password reset)',
          'Create basic app layout with navigation and protected routes',
        ],
        deliverable: 'Working auth system and project scaffold with database connection',
      },
      {
        week: 'Week 2',
        title: 'Transaction Management & CSV Parsing',
        tasks: [
          'Build CSV upload component with file validation',
          'Implement CSV parsing and transaction storage in PostgreSQL',
          'Create API endpoints for CRUD operations on transactions',
          'Build transaction list view with filtering and search',
          'Add manual transaction entry form',
        ],
        deliverable: 'Users can upload bank statements and view/manage all transactions',
      },
      {
        week: 'Week 3',
        title: 'ML Categorization Service',
        tasks: [
          'Build Python microservice with FastAPI for transaction categorization',
          'Train a categorization classifier using labeled transaction data',
          'Integrate the Express backend with the Python ML service',
          'Implement automatic categorization on CSV import',
          'Allow users to correct categories (feedback loop for model improvement)',
        ],
        deliverable: 'Transactions are automatically categorized with user correction capability',
      },
      {
        week: 'Week 4',
        title: 'Analytics Dashboard & Budgeting',
        tasks: [
          'Build interactive spending dashboard with Recharts (pie, bar, area charts)',
          'Implement category-based spending breakdowns',
          'Add monthly budget creation and tracking with progress bars',
          'Create spending trends view with date range selection',
          'Add savings goal tracking with visual milestones',
        ],
        deliverable: 'Full analytics dashboard with budgets, charts, and spending insights',
      },
      {
        week: 'Week 5',
        title: 'Polish, Testing & Deployment',
        tasks: [
          'Write API tests with Jest/Supertest',
          'Add frontend component tests with React Testing Library',
          'Implement error boundaries and comprehensive loading states',
          'Deploy backend to Railway/Render and frontend to Vercel',
          'Create user documentation and demo video',
        ],
        deliverable: 'Deployed, tested application with documentation and live demo',
      },
    ],
    resumeAngle: (ctx) =>
      `**"Developed a full-stack personal finance platform with ML-powered transaction categorization, processing bank statements into actionable spending insights through a decoupled Node.js and Python microservice architecture."**\n\n**Talking Points for Interviews:**\n- Architected a **microservices-based system** where a Node.js API delegates ML work to a Python service — demonstrating understanding of service-oriented design.\n- Built an **interactive data visualization dashboard** with real-time charts and filtering — strong frontend data skills.\n- Implemented a **feedback loop** where user corrections improve the ML model — shows product thinking.\n- Used **Prisma ORM** for type-safe database access and **PostgreSQL** for relational data modeling.\n- **Ask in interviews:** "How would you scale the categorization service for 100K users?" — shows systems thinking.`,
    challenges: () => [
      'Handling diverse CSV formats from different banks',
      'Training a categorization model with limited labeled data',
      'Designing efficient database queries for aggregating spending data',
      'Managing communication between Node.js and Python services',
    ],
    learningOutcomes: () => [
      'Microservices architecture and inter-service communication',
      'Machine learning integration in web applications',
      'Data visualization and interactive dashboard design',
      'Financial data parsing and normalization',
      'ORM usage (Prisma) and database schema design',
    ],
  },
  {
    category: 'AI Education Platform',
    icon: 'GraduationCap',
    relevantInterests: ['education', 'learning', 'ai', 'ml', 'edtech', 'teaching', 'students'],
    relevantSkills: ['react', 'python', 'flask', 'django', 'node', 'nextjs', 'typescript', 'pytorch'],
    minDifficulty: 'beginner',
    titleTemplate: (ctx) =>
      `StudyForge AI: Personalized Learning Path Generator & Quiz Engine`,
    pitch: (ctx) =>
      `An adaptive learning platform that creates personalized study paths based on a student\'s knowledge gaps, generates AI-powered quiz questions, and tracks progress with a spaced-repetition algorithm. ${ctx.matchedSkills.length > 0 ? `Using your ${ctx.matchedSkills.slice(0, 2).join(' and ')} skills` : 'Built with modern web technologies'} to transform passive studying into an interactive, data-driven experience that adapts to each learner\'s pace.`,
    techStack: (ctx) => [
      { layer: 'Frontend', technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
      { layer: 'Backend', technologies: ['Node.js / Express', 'REST API', 'JWT Auth'] },
      { layer: 'Database', technologies: ['PostgreSQL', 'Redis (session cache)'] },
      { layer: 'AI / Logic', technologies: ['OpenAI API / local NLP model', 'SM-2 Spaced Repetition Algorithm'] },
      { layer: 'Infrastructure', technologies: ['Docker', 'Vercel', 'Supabase (auth + database)'] },
    ],
    architecture: (ctx) =>
      `The platform uses a classic client-server architecture with a React SPA frontend and an Express API backend. The core intelligence is in the learning path engine: when a student completes a diagnostic quiz, the system maps their answers to a knowledge graph of topics, identifies gaps, and generates a personalized learning path using a topological sort of prerequisite dependencies. Quiz questions are either pre-authored or AI-generated. The SM-2 spaced repetition algorithm schedules review sessions based on the student's performance history stored in PostgreSQL. Redis caches active sessions and frequently accessed learning paths for performance.`,
    coreMvp: () => [
      'User authentication and profile management',
      'Diagnostic quiz to assess baseline knowledge in a chosen subject',
      'Personalized learning path generation based on knowledge gaps',
      'Interactive quiz engine with multiple question types (MCQ, fill-in, matching)',
      'Progress tracking with visual mastery indicators per topic',
      'Spaced repetition scheduling for review sessions',
    ],
    coreFuture: () => [
      'AI-powered question generation from study materials (upload PDF/text)',
      'Collaborative study groups with shared progress boards',
      'Gamification: XP, streaks, badges, and leaderboards',
      'Natural language tutoring chatbot for concept explanation',
      'Analytics dashboard for teachers/instructors to monitor student progress',
      'Mobile app with offline quiz support',
    ],
    sprints: (ctx) => [
      {
        week: 'Week 1',
        title: 'Setup, Auth & Data Models',
        tasks: [
          'Set up React frontend with TypeScript and Tailwind',
          'Initialize Express backend with project structure',
          'Design PostgreSQL schema: users, subjects, topics, questions, quiz_results, learning_paths',
          'Implement user authentication with JWT',
          'Build knowledge graph data model for topic prerequisites',
        ],
        deliverable: 'Auth system, database schema, and project scaffold ready',
      },
      {
        week: 'Week 2',
        title: 'Diagnostic Quiz & Knowledge Assessment',
        tasks: [
          'Build diagnostic quiz UI with progress tracking',
          'Implement quiz submission and scoring logic',
          'Create knowledge gap analysis algorithm using the topic graph',
          'Build API endpoints for quiz creation, submission, and results',
          'Design subject and topic selection interface',
        ],
        deliverable: 'Students can take a diagnostic quiz and see their knowledge gaps identified',
      },
      {
        week: 'Week 3',
        title: 'Learning Path Generation & Spaced Repetition',
        tasks: [
          'Implement personalized learning path generator (topological sort of prerequisites)',
          'Build SM-2 spaced repetition algorithm for review scheduling',
          'Create learning path visualization with progress indicators',
          'Implement review session scheduler based on SM-2 intervals',
          'Add topic mastery tracking and updates after each quiz',
        ],
        deliverable: 'System generates personalized study paths and schedules reviews automatically',
      },
      {
        week: 'Week 4',
        title: 'Quiz Engine & Progress Dashboard',
        tasks: [
          'Build interactive quiz player with multiple question types (MCQ, fill-in, matching)',
          'Implement real-time feedback and explanation after each question',
          'Create progress dashboard with mastery charts and study streaks',
          'Add achievement badges for milestones (first quiz, 7-day streak, etc.)',
          'Build topic detail view with recommended resources',
        ],
        deliverable: 'Full quiz engine and progress dashboard with gamification elements',
      },
      {
        week: 'Week 5',
        title: 'Testing, Polish & Deployment',
        tasks: [
          'Write unit tests for the spaced repetition algorithm and path generator',
          'Add integration tests for quiz flow end-to-end',
          'Implement responsive design for mobile/tablet usage',
          'Deploy to Vercel (frontend) and Railway (backend)',
          'Create README and demo documentation',
        ],
        deliverable: 'Tested, deployed application with documentation and live demo',
      },
    ],
    resumeAngle: (ctx) =>
      `**"Built an adaptive learning platform that generates personalized study paths using a knowledge graph and spaced repetition algorithm, serving interactive quizzes that adapt to each student's knowledge gaps."**\n\n**Talking Points for Interviews:**\n- Implemented the **SM-2 spaced repetition algorithm** (the same algorithm Anki uses) — demonstrates algorithmic thinking.\n- Designed a **knowledge graph with prerequisite dependencies** and used topological sorting to generate valid learning paths — graph theory in practice.\n- Built a **stateful quiz engine** with multiple question types and real-time feedback — complex frontend state management.\n- Applied **personalization algorithms** that adapt content based on user performance data — product-focused engineering.\n- **Ask in interviews:** "How would you extend the knowledge graph to handle cross-subject prerequisites?" — shows systems thinking.`,
    challenges: () => [
      'Designing a knowledge graph that correctly models topic prerequisites',
      'Implementing the SM-2 spaced repetition algorithm with proper interval calculations',
      'Managing complex quiz state (progress, timers, partial answers)',
      'Generating valid learning paths that respect prerequisite ordering',
    ],
    learningOutcomes: () => [
      'Graph algorithms (topological sorting for dependency resolution)',
      'Spaced repetition algorithms and cognitive science principles',
      'Complex state management in React (quiz engine)',
      'Personalization and adaptive systems design',
      'Data modeling for educational systems',
    ],
  },
  {
    category: 'Developer Tools',
    icon: 'Code2',
    relevantInterests: ['automation', 'developer tools', 'devops', 'productivity', 'tools', 'code'],
    relevantSkills: ['python', 'node', 'react', 'typescript', 'docker', 'aws', 'git'],
    minDifficulty: 'intermediate',
    titleTemplate: (ctx) =>
      `CodeLens: AI-Powered Code Review & Documentation Automation Platform`,
    pitch: (ctx) =>
      `A developer productivity tool that automatically reviews pull requests, generates documentation from code changes, and detects potential bugs before they reach production. ${ctx.matchedSkills.length > 0 ? `Leveraging your ${ctx.matchedSkills.slice(0, 2).join(' and ')} experience` : 'Using static analysis and AI'} to integrate directly with GitHub, it provides actionable feedback on code quality, security vulnerabilities, and missing tests — acting as an AI pair programmer for every PR.`,
    techStack: (ctx) => [
      { layer: 'Frontend', technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Monaco Editor'] },
      { layer: 'Backend', technologies: ['Node.js / Express', 'WebSockets for real-time updates'] },
      { layer: 'Database', technologies: ['PostgreSQL', 'Redis (job queue)'] },
      { layer: 'Integrations', technologies: ['GitHub API (webhooks)', 'OpenAI API / CodeBERT', 'AST parsers'] },
      { layer: 'Infrastructure', technologies: ['Docker', 'AWS EC2', 'GitHub Actions CI/CD'] },
    ],
    architecture: (ctx) =>
      `The system is event-driven, centered around GitHub webhooks. When a PR is opened or updated, GitHub sends a webhook to the Express backend, which creates an analysis job in a Redis-backed queue. Worker processes pick up jobs, fetch the PR diff via GitHub API, run static analysis (AST parsing for complexity, security patterns), and optionally call an LLM for natural language review comments. Results are posted back as GitHub PR comments and stored in PostgreSQL. The React frontend provides a dashboard showing review history, code quality trends, and configuration. WebSocket connections deliver real-time analysis status updates.`,
    coreMvp: () => [
      'GitHub OAuth authentication and repository connection',
      'Webhook listener for pull request events',
      'Automated code analysis: complexity, duplication, security patterns',
      'AI-powered review comments posted directly to GitHub PRs',
      'Auto-generated documentation for changed functions/classes',
      'Dashboard with review history and code quality metrics',
    ],
    coreFuture: () => [
      'Multi-language support with language-specific AST analyzers',
      'Automatic test generation for uncovered code paths',
      'Code quality trending and technical debt estimation over time',
      'Slack/Discord notifications for critical findings',
      'Custom review rules and team-specific linting policies',
      'IDE extension (VS Code) for real-time inline suggestions',
    ],
    sprints: (ctx) => [
      {
        week: 'Week 1',
        title: 'GitHub Integration & Webhook System',
        tasks: [
          'Set up React frontend and Express backend with TypeScript',
          'Implement GitHub OAuth flow for user authentication',
          'Create GitHub App with webhook permissions (PR read/write)',
          'Build webhook receiver endpoint with signature verification',
          'Design PostgreSQL schema: users, repos, reviews, findings',
        ],
        deliverable: 'Users can connect GitHub repos and webhooks fire on PR events',
      },
      {
        week: 'Week 2',
        title: 'Code Analysis Engine',
        tasks: [
          'Implement AST-based code analysis (complexity, duplication detection)',
          'Add security pattern matching (SQL injection, XSS, hardcoded secrets)',
          'Build job queue with Redis for async analysis processing',
          'Create worker process that fetches PR diffs and runs analysis',
          'Implement result storage in PostgreSQL with structured findings',
        ],
        deliverable: 'PRs are automatically analyzed for code quality and security issues',
      },
      {
        week: 'Week 3',
        title: 'AI Review Comments & Documentation',
        tasks: [
          'Integrate LLM API for natural language code review generation',
          'Build prompt engineering pipeline: diff + context → review comment',
          'Implement auto-documentation generation for changed functions',
          'Create GitHub PR comment posting via GitHub API',
          'Add comment threading and severity labeling (info, warning, critical)',
        ],
        deliverable: 'AI-generated review comments and docs appear on GitHub PRs automatically',
      },
      {
        week: 'Week 4',
        title: 'Dashboard & Analytics',
        tasks: [
          'Build review history dashboard with filtering by repo, date, severity',
          'Create code quality trend charts using Recharts',
          'Add repository settings page (enable/disable rules, configure severity)',
          'Implement real-time analysis status via WebSockets',
          'Add team collaboration features (shared repos, review assignments)',
        ],
        deliverable: 'Full dashboard with analytics, settings, and real-time updates',
      },
      {
        week: 'Week 5',
        title: 'Testing, Security & Deployment',
        tasks: [
          'Write tests for webhook signature verification and analysis engine',
          'Add rate limiting and input validation for security',
          'Implement error handling and retry logic for failed analyses',
          'Deploy with Docker on AWS EC2 with HTTPS',
          'Write developer documentation and API reference',
        ],
        deliverable: 'Production-deployed platform with tests, security hardening, and docs',
      },
    ],
    resumeAngle: (ctx) =>
      `**"Built an AI-powered code review automation platform that integrates with GitHub via webhooks, analyzes pull requests using AST parsing and LLMs, and posts actionable review comments — processing code quality checks in real-time."**\n\n**Talking Points for Interviews:**\n- Designed an **event-driven architecture** using GitHub webhooks and a Redis job queue — demonstrates understanding of async systems and webhooks.\n- Implemented **AST-based static analysis** for code complexity and security — shows compiler/analysis fundamentals.\n- Integrated **LLM APIs with prompt engineering** to generate human-readable code reviews — practical AI integration.\n- Handled **GitHub API authentication, OAuth, and webhook signature verification** — real-world API integration skills.\n- **Ask in interviews:** "How would you handle analysis for a monorepo with 1000+ PRs per day?" — shows scalability thinking.`,
    challenges: () => [
      'Verifying GitHub webhook signatures for security',
      'Handling rate limits on GitHub API and LLM API calls',
      'Building reliable AST parsers that work across code patterns',
      'Managing async job processing with proper error handling and retries',
    ],
    learningOutcomes: () => [
      'Event-driven architecture and webhook-based integrations',
      'Abstract Syntax Trees (AST) and static code analysis',
      'API integration with OAuth and signature verification',
      'Async job processing with Redis queues',
      'LLM integration and prompt engineering for practical applications',
    ],
  },
  {
    category: 'Smart Automation',
    icon: 'Bot',
    relevantInterests: ['automation', 'iot', 'smart home', 'robotics', 'ml', 'ai'],
    relevantSkills: ['python', 'react', 'node', 'mqtt', 'raspberry pi', 'arduino', 'docker'],
    minDifficulty: 'intermediate',
    titleTemplate: (ctx) =>
      `HomeBrain: IoT Smart Home Automation Hub with Voice Control`,
    pitch: (ctx) =>
      `A centralized smart home platform that aggregates IoT devices from different brands, learns user behavior patterns, and automates routines using a combination of rule-based triggers and ML predictions. ${ctx.matchedSkills.length > 0 ? `With your ${ctx.matchedSkills.slice(0, 2).join(' and ')} background` : 'Using IoT protocols and ML'} it unifies fragmented smart devices into one intelligent system that anticipates needs — adjusting lighting, temperature, and security based on habits and preferences.`,
    techStack: (ctx) => [
      { layer: 'Frontend', technologies: ['React Native / React', 'TypeScript', 'Tailwind CSS'] },
      { layer: 'Backend', technologies: ['Node.js', 'MQTT Broker (Mosquitto)', 'WebSocket server'] },
      { layer: 'Database', technologies: ['PostgreSQL (state)', 'InfluxDB (time-series sensor data)'] },
      { layer: 'AI / ML', technologies: ['Python', 'scikit-learn', 'TensorFlow Lite (edge inference)'] },
      { layer: 'IoT / Hardware', technologies: ['MQTT Protocol', 'ESP32/Raspberry Pi', 'Home Assistant API'] },
    ],
    architecture: (ctx) =>
      `The system uses an MQTT-centric IoT architecture. Smart devices (real or simulated via ESP32/RPi) publish sensor data to MQTT topics. A Node.js backend subscribes to these topics, persists state to PostgreSQL, and stores time-series data in InfluxDB. A Python ML service runs behavior pattern recognition on historical data to predict optimal device states (e.g., "user usually turns off lights at 11 PM"). The React frontend communicates with the backend via REST for configuration and WebSockets for real-time device state updates. Automation rules are evaluated in a rules engine that combines user-defined triggers with ML predictions.`,
    coreMvp: () => [
      'Device registration and management dashboard',
      'MQTT-based real-time device communication',
      'Real-time device state monitoring (temperature, lights, locks)',
      'Manual device control via web/mobile dashboard',
      'Rule-based automation engine (if-this-then-that rules)',
      'Time-series sensor data visualization',
    ],
    coreFuture: () => [
      'ML-powered behavior prediction and auto-automation',
      'Voice control integration (Alexa/Google Assistant custom skills)',
      'Energy optimization recommendations based on usage patterns',
      'Security anomaly detection (unusual activity alerts)',
      'Mobile app with push notifications for alerts',
      'Multi-home support with room-level grouping',
    ],
    sprints: (ctx) => [
      {
        week: 'Week 1',
        title: 'IoT Infrastructure & MQTT Setup',
        tasks: [
          'Set up MQTT broker (Mosquitto) with Docker',
          'Initialize Node.js backend with MQTT client connection',
          'Design PostgreSQL schema for devices, rooms, automations, sensor_data',
          'Set up InfluxDB for time-series sensor data storage',
          'Create device simulator scripts (for testing without real hardware)',
        ],
        deliverable: 'MQTT infrastructure running with device simulators publishing data',
      },
      {
        week: 'Week 2',
        title: 'Device Management & Real-Time Dashboard',
        tasks: [
          'Build React frontend with device management UI',
          'Implement device registration and room grouping',
          'Create real-time device state dashboard using WebSockets',
          'Add manual device control (toggle lights, set temperature)',
          'Implement device state persistence in PostgreSQL',
        ],
        deliverable: 'Users can register, monitor, and control devices in real-time',
      },
      {
        week: 'Week 3',
        title: 'Automation Engine & Rules System',
        tasks: [
          'Design rule-based automation engine (condition → action)',
          'Build automation rule creator UI with visual rule builder',
          'Implement time-based and sensor-based triggers',
          'Add automation execution logging and history',
          'Create time-series sensor data charts using InfluxDB queries',
        ],
        deliverable: 'Users can create automation rules that trigger actions based on conditions',
      },
      {
        week: 'Week 4',
        title: 'ML Behavior Prediction & Mobile UI',
        tasks: [
          'Build Python ML service for behavior pattern recognition',
          'Train prediction model on historical device usage data',
          'Implement auto-automation suggestions based on ML predictions',
          'Make frontend responsive for mobile usage (or build React Native app)',
          'Add notification system for automation events and alerts',
        ],
        deliverable: 'System learns user patterns and suggests/automates device actions',
      },
      {
        week: 'Week 5',
        title: 'Testing, Polish & Documentation',
        tasks: [
          'Write tests for automation engine and MQTT message handling',
          'Add error handling for device disconnections and network issues',
          'Implement security: MQTT authentication, API rate limiting',
          'Deploy backend with Docker Compose (Mosquitto + Node + Python + DBs)',
          'Create documentation for adding new device types',
        ],
        deliverable: 'Tested, deployed platform with documentation and simulated device demo',
      },
    ],
    resumeAngle: (ctx) =>
      `**"Built an IoT smart home automation platform using MQTT protocol, real-time WebSocket communication, and ML-based behavior prediction — unifying multiple device types into a single intelligent system that learns and automates user routines."**\n\n**Talking Points for Interviews:**\n- Implemented an **MQTT-based IoT architecture** with a Node.js backend — demonstrates understanding of IoT protocols and real-time systems.\n- Used **time-series databases (InfluxDB)** alongside PostgreSQL for sensor data — shows data architecture versatility.\n- Built a **rules engine** combined with **ML predictions** for automation — hybrid intelligence system design.\n- Handled **real-time bidirectional communication** via WebSockets and MQTT pub/sub — strong networking fundamentals.\n- **Ask in interviews:** "How would you secure MQTT communication and handle device authentication at scale?" — shows security awareness.`,
    challenges: () => [
      'Managing real-time device state synchronization across MQTT and WebSockets',
      'Handling device disconnections and network reliability issues',
      'Designing a flexible rules engine that supports complex condition combinations',
      'Integrating time-series data (InfluxDB) with relational data (PostgreSQL)',
    ],
    learningOutcomes: () => [
      'IoT protocols (MQTT pub/sub) and device communication',
      'Real-time systems with WebSockets and event-driven architecture',
      'Time-series databases and sensor data management',
      'Rules engine design and implementation',
      'ML integration for behavior prediction in IoT contexts',
    ],
  },
  {
    category: 'AI Content Platform',
    icon: 'PenTool',
    relevantInterests: ['content', 'media', 'nlp', 'ai', 'writing', 'journalism', 'social'],
    relevantSkills: ['react', 'python', 'node', 'nextjs', 'typescript', 'pytorch', 'transformers'],
    minDifficulty: 'beginner',
    titleTemplate: (ctx) =>
      `ContentMind AI: Intelligent Content Discovery & Summarization Engine`,
    pitch: (ctx) =>
      `An AI-powered content platform that aggregates articles from multiple sources, generates concise summaries, extracts key insights, and creates personalized reading lists based on user interests. ${ctx.matchedSkills.length > 0 ? `Using your ${ctx.matchedSkills.slice(0, 2).join(' and ')} skills` : 'Using NLP and modern web tech'} to solve information overload — helping users stay informed in minutes instead of hours by distilling long-form content into digestible, actionable insights.`,
    techStack: (ctx) => [
      { layer: 'Frontend', technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
      { layer: 'Backend', technologies: ['Python (FastAPI)', 'Node.js (aggregation service)'] },
      { layer: 'Database', technologies: ['PostgreSQL', 'Elasticsearch (full-text search)'] },
      { layer: 'AI / NLP', technologies: ['HuggingFace Transformers', 'BERT/PEGASUS for summarization', 'sentence-transformers'] },
      { layer: 'Infrastructure', technologies: ['Docker', 'Redis (caching)', 'Vercel (frontend)'] },
    ],
    architecture: (ctx) =>
      `The platform uses a multi-service architecture. A Node.js aggregation service periodically fetches articles from RSS feeds and APIs, stores raw content in PostgreSQL, and pushes URLs to a Redis queue. A Python FastAPI worker service pulls from the queue, runs NLP pipelines (summarization via transformer models, keyword extraction, embedding generation), and stores processed results back in PostgreSQL with embeddings in a vector index. The Next.js frontend queries the API for personalized content recommendations using cosine similarity between user interest embeddings and article embeddings. Elasticsearch provides fast full-text search across all content.`,
    coreMvp: () => [
      'User authentication and interest profile management',
      'RSS feed aggregation and article storage',
      'AI-powered article summarization (abstractive summarization)',
      'Key insight and keyword extraction from articles',
      'Personalized content feed based on user interests',
      'Full-text search across all articles',
    ],
    coreFuture: () => [
      'Sentiment analysis and bias detection for news articles',
      'Audio summary generation (text-to-speech)',
      'Topic clustering and trending topic visualization',
      'Browser extension for on-the-fly article summarization',
      'Collaborative reading lists and sharing features',
      'Multi-language support with translation',
    ],
    sprints: (ctx) => [
      {
        week: 'Week 1',
        title: 'Project Setup & Aggregation Service',
        tasks: [
          'Set up Next.js frontend with TypeScript and Tailwind',
          'Initialize Node.js aggregation service with RSS parser',
          'Design PostgreSQL schema: users, articles, summaries, interests, feeds',
          'Implement RSS feed parser and article storage pipeline',
          'Set up Docker Compose for all services (Node, Python, PostgreSQL, Redis)',
        ],
        deliverable: 'Aggregation service running and storing articles from RSS feeds in the database',
      },
      {
        week: 'Week 2',
        title: 'NLP Summarization Pipeline',
        tasks: [
          'Set up Python FastAPI service with HuggingFace Transformers',
          'Integrate pre-trained summarization model (PEGASUS or BART)',
          'Build article processing queue (Redis → Python worker)',
          'Implement keyword extraction and key insight generation',
          'Generate article embeddings using sentence-transformers',
        ],
        deliverable: 'Articles are automatically summarized and tagged with keywords',
      },
      {
        week: 'Week 3',
        title: 'Personalized Feed & Search',
        tasks: [
          'Implement user interest profile (topics, keywords, preferred sources)',
          'Build content recommendation engine using embedding cosine similarity',
          'Set up Elasticsearch for full-text article search',
          'Create personalized feed page with infinite scroll',
          'Add article detail view with summary, key insights, and full content',
        ],
        deliverable: 'Users see a personalized feed with AI summaries and can search all content',
      },
      {
        week: 'Week 4',
        title: 'UI Polish & Reading Experience',
        tasks: [
          'Build clean reading interface with typography and progress tracking',
          'Add bookmarking and reading list management',
          'Create interest management page (add/remove topics)',
          'Implement reading time estimates and progress indicators',
          'Add dark mode and responsive design for mobile reading',
        ],
        deliverable: 'Polished, responsive reading experience with bookmarks and personalization',
      },
      {
        week: 'Week 5',
        title: 'Testing, Optimization & Deployment',
        tasks: [
          'Write tests for aggregation and NLP pipeline',
          'Add caching layer (Redis) for frequent API queries',
          'Implement error handling for feed parsing failures',
          'Deploy services to cloud (Vercel for frontend, Railway/Render for backend)',
          'Create documentation and demo walkthrough',
        ],
        deliverable: 'Deployed, tested platform with optimized performance and documentation',
      },
    ],
    resumeAngle: (ctx) =>
      `**"Built an AI content platform that aggregates articles from RSS feeds, generates abstractive summaries using transformer models (PEGASUS/BART), and delivers personalized recommendations via embedding-based similarity search."**\n\n**Talking Points for Interviews:**\n- Integrated **pre-trained NLP transformer models** (HuggingFace) for summarization — practical ML/NLP deployment.\n- Implemented **embedding-based recommendation** using cosine similarity — demonstrates understanding of vector search.\n- Architected a **multi-service system** (Node.js aggregator + Python NLP worker + Next.js frontend) — microservices design.\n- Used **Elasticsearch** for full-text search alongside PostgreSQL — polyglot persistence.\n- **Ask in interviews:** "How would you handle summarizing 10K articles per day efficiently?" — shows scale thinking.`,
    challenges: () => [
      'Handling diverse article formats and content extraction from HTML',
      'Managing transformer model inference time and resource usage',
      'Designing effective embedding-based similarity for content recommendation',
      'Coordinating multiple services (Node, Python, Elasticsearch, PostgreSQL)',
    ],
    learningOutcomes: () => [
      'NLP and transformer models for summarization',
      'Vector embeddings and similarity search for recommendations',
      'Multi-service architecture and inter-service communication',
      'RSS aggregation and content extraction',
      'Elasticsearch integration for full-text search',
    ],
  },
  {
    category: 'Social Impact',
    icon: 'Leaf',
    relevantInterests: ['environment', 'climate', 'social impact', 'sustainability', 'green', 'community'],
    relevantSkills: ['react', 'python', 'node', 'nextjs', 'typescript', 'mongodb', 'postgresql'],
    minDifficulty: 'beginner',
    titleTemplate: (ctx) =>
      `EcoTrack: Community Carbon Footprint Tracker & Gamified Sustainability Platform`,
    pitch: (ctx) =>
      `A community-driven platform where users track their daily carbon footprint, compete in sustainability challenges, and see the collective environmental impact of their neighborhood or campus. ${ctx.matchedSkills.length > 0 ? `With your ${ctx.matchedSkills.slice(0, 2).join(' and ')} skills` : 'Using modern web technologies'} it transforms climate action from an abstract concern into measurable, social, and gamified daily habits — making sustainability engaging and competitive.`,
    techStack: (ctx) => [
      { layer: 'Frontend', technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Recharts'] },
      { layer: 'Backend', technologies: ['Node.js / Express', 'REST API', 'JWT Auth'] },
      { layer: 'Database', technologies: ['PostgreSQL', 'Redis (leaderboard cache)'] },
      { layer: 'Analytics', technologies: ['Carbon calculation API', 'Custom emission factors database'] },
      { layer: 'Infrastructure', technologies: ['Docker', 'Vercel', 'Supabase'] },
    ],
    architecture: (ctx) =>
      `The platform follows a standard web architecture with a Next.js frontend (using server components for SEO and performance) and an Express API backend. Users log daily activities (transport, food, energy) which are converted to CO2 equivalents using a custom emission factors database. PostgreSQL stores user activities, community challenges, and leaderboard data. Redis caches real-time leaderboard rankings and challenge progress for fast reads. The gamification engine awards points, badges, and levels based on carbon reduction achievements. Community challenges use a shared progress model where multiple users contribute to a collective goal.`,
    coreMvp: () => [
      'User authentication and profile setup with sustainability goals',
      'Daily carbon footprint logging (transport, food, energy, shopping)',
      'Personal carbon footprint dashboard with trend visualizations',
      'Community challenges with collective progress tracking',
      'Gamification: points, badges, levels, and leaderboards',
      'Social feed showing community achievements and milestones',
    ],
    coreFuture: () => [
      'AI-powered personalized reduction recommendations',
      'Integration with fitness trackers and transit apps for automatic logging',
      'Community verification of sustainability claims',
      'Local business partnerships for eco-friendly discounts',
      'Carbon offset purchase integration',
      'Campus/organization leaderboards with admin dashboards',
    ],
    sprints: (ctx) => [
      {
        week: 'Week 1',
        title: 'Auth, Profile & Data Models',
        tasks: [
          'Set up Next.js frontend with TypeScript and Tailwind',
          'Initialize Express backend with project structure',
          'Design PostgreSQL schema: users, activities, challenges, leaderboard, badges',
          'Implement user authentication with JWT and profile setup',
          'Create emission factors database (transport, food, energy CO2 equivalents)',
        ],
        deliverable: 'Auth system, database schema, and emission factors database ready',
      },
      {
        week: 'Week 2',
        title: 'Carbon Tracking & Personal Dashboard',
        tasks: [
          'Build daily activity logging form (transport, food, energy, shopping)',
          'Implement carbon footprint calculation engine using emission factors',
          'Create personal dashboard with footprint trend charts (Recharts)',
          'Add category breakdown visualizations (pie charts, bar graphs)',
          'Implement weekly/monthly footprint comparison views',
        ],
        deliverable: 'Users can log activities and see their carbon footprint with visual analytics',
      },
      {
        week: 'Week 3',
        title: 'Gamification & Leaderboards',
        tasks: [
          'Design gamification system: points, levels, badges, achievements',
          'Build leaderboard system with Redis caching for real-time rankings',
          'Create badge earning logic and notification system',
          'Implement user level progression with visual indicators',
          'Add sustainability score calculation and display',
        ],
        deliverable: 'Full gamification system with leaderboards, badges, and levels',
      },
      {
        week: 'Week 4',
        title: 'Community Challenges & Social Feed',
        tasks: [
          'Build community challenge system with collective goals and progress bars',
          'Create challenge joining/leaving flow and participant tracking',
          'Implement social feed showing community achievements and milestones',
          'Add friend/follow system for social competition',
          'Create challenge creation for community leaders/admins',
        ],
        deliverable: 'Community challenges and social feed fully functional',
      },
      {
        week: 'Week 5',
        title: 'Polish, Testing & Deployment',
        tasks: [
          'Write tests for carbon calculation engine and gamification logic',
          'Add responsive design for mobile usage',
          'Implement error handling and offline data caching',
          'Deploy to Vercel (frontend) and Railway/Render (backend)',
          'Create user onboarding flow and demo documentation',
        ],
        deliverable: 'Tested, deployed platform with onboarding and documentation',
      },
    ],
    resumeAngle: (ctx) =>
      `**"Built a community carbon footprint tracking platform with gamified sustainability challenges, real-time leaderboards powered by Redis, and a custom emission factors calculation engine — turning climate action into measurable social competition."**\n\n**Talking Points for Interviews:**\n- Designed a **gamification engine** with points, badges, levels, and leaderboards — demonstrates product and game mechanics understanding.\n- Built a **real-time leaderboard system** using Redis caching for performance — shows understanding of caching strategies.\n- Implemented a **carbon calculation engine** using emission factors — domain-specific data modeling.\n- Created **community challenge mechanics** with collective progress tracking — collaborative system design.\n- **Ask in interviews:** "How would you prevent gaming of the leaderboard system?" — shows product integrity thinking.`,
    challenges: () => [
      'Designing accurate emission factors for diverse activity types',
      'Building a fair and motivating gamification scoring system',
      'Managing real-time leaderboard updates with Redis caching',
      'Handling community challenge progress synchronization across users',
    ],
    learningOutcomes: () => [
      'Gamification system design and implementation',
      'Redis caching for real-time ranking systems',
      'Domain-specific calculation engines (carbon footprint)',
      'Community/social feature architecture',
      'Data visualization for environmental impact',
    ],
  },
  {
    category: 'Computer Vision',
    icon: 'Eye',
    relevantInterests: ['computer vision', 'ai', 'ml', 'security', 'surveillance', 'image processing'],
    relevantSkills: ['python', 'opencv', 'tensorflow', 'pytorch', 'react', 'flask', 'fastapi'],
    minDifficulty: 'advanced',
    titleTemplate: (ctx) =>
      `VisionGuard: Real-Time Object Detection & Anomaly Surveillance System`,
    pitch: (ctx) =>
      `A real-time video surveillance platform that uses computer vision to detect objects, track movements, and flag anomalous activities in live camera feeds. ${ctx.matchedSkills.length > 0 ? `Using your ${ctx.matchedSkills.slice(0, 2).join(' and ')} expertise` : 'Using deep learning and OpenCV'} it processes multiple camera streams simultaneously, sending instant alerts when unusual patterns are detected — applicable for retail, campus security, or traffic monitoring with a clean dashboard for operators.`,
    techStack: (ctx) => [
      { layer: 'Frontend', technologies: ['React', 'TypeScript', 'Tailwind CSS', 'WebRTC for live streaming'] },
      { layer: 'Backend', technologies: ['Python (FastAPI)', 'WebSocket server', 'GStreamer pipeline'] },
      { layer: 'Database', technologies: ['PostgreSQL (events)', 'Redis (stream state + alerts)'] },
      { layer: 'AI / CV', technologies: ['YOLOv8', 'OpenCV', 'DeepSORT (tracking)', 'TensorRT (optimization)'] },
      { layer: 'Infrastructure', technologies: ['Docker', 'NVIDIA Docker', 'GPU instance (AWS/GCP)'] },
    ],
    architecture: (ctx) =>
      `The system uses a streaming-first architecture. Camera feeds (real or simulated) are ingested via GStreamer or RTSP streams and processed by a Python FastAPI backend running YOLOv8 for object detection and DeepSORT for multi-object tracking. Each frame is analyzed in near-real-time with results (bounding boxes, tracked IDs, class labels) streamed to the React frontend via WebSockets. The frontend renders live annotated video feeds using Canvas overlays. Anomaly detection runs as a separate analysis module that compares current frame patterns against historical baselines — flagging unusual clustering, loitering, or restricted zone breaches. Events are stored in PostgreSQL with Redis managing active alert states and deduplication.`,
    coreMvp: () => [
      'Multi-camera feed management and display dashboard',
      'Real-time object detection with YOLOv8 (people, vehicles, objects)',
      'Multi-object tracking with persistent IDs across frames',
      'Anomaly detection: restricted zone intrusion, loitering detection',
      'Real-time alert system with configurable thresholds',
      'Event log with searchable history and video clip snapshots',
    ],
    coreFuture: () => [
      'Facial recognition and person re-identification across cameras',
      'Behavior analysis: crowd density, running/fighting detection',
      'Automated report generation with annotated video clips',
      'Edge deployment on Jetson Nano for on-device processing',
      'Multi-site management with centralized dashboard',
      'Privacy masking and automatic face blurring for compliance',
    ],
    sprints: (ctx) => [
      {
        week: 'Week 1',
        title: 'Streaming Infrastructure & Camera Management',
        tasks: [
          'Set up Python FastAPI backend with WebSocket support',
          'Implement RTSP/video stream ingestion using OpenCV or GStreamer',
          'Create camera management system (add, configure, view feeds)',
          'Set up React frontend with multi-camera grid display',
          'Design PostgreSQL schema: cameras, events, detections, alerts',
        ],
        deliverable: 'Multiple camera feeds displaying in real-time on the dashboard',
      },
      {
        week: 'Week 2',
        title: 'Object Detection & Tracking Pipeline',
        tasks: [
          'Integrate YOLOv8 for real-time object detection',
          'Implement DeepSORT multi-object tracking with persistent IDs',
          'Build frame processing pipeline: stream → detect → track → annotate',
          'Stream annotated frames to frontend via WebSocket + Canvas rendering',
          'Add detection confidence filtering and class selection',
        ],
        deliverable: 'Live video feeds show real-time bounding boxes and tracked objects',
      },
      {
        week: 'Week 3',
        title: 'Anomaly Detection & Alert System',
        tasks: [
          'Implement restricted zone definition UI (draw zones on camera view)',
          'Build zone intrusion detection logic',
          'Add loitering detection (object stationary beyond threshold time)',
          'Create alert generation system with severity levels',
          'Implement alert deduplication using Redis (prevent alert spam)',
        ],
        deliverable: 'System detects anomalies and generates real-time alerts',
      },
      {
        week: 'Week 4',
        title: 'Event Management & Dashboard Polish',
        tasks: [
          'Build event log with filtering by camera, type, date, severity',
          'Add snapshot capture on alert trigger with thumbnail gallery',
          'Create alert notification system (dashboard + optional email)',
          'Build camera detail view with historical event timeline',
          'Add system performance metrics (FPS, detection latency, CPU/GPU usage)',
        ],
        deliverable: 'Complete event management dashboard with alerts, snapshots, and analytics',
      },
      {
        week: 'Week 5',
        title: 'Optimization, Testing & Deployment',
        tasks: [
          'Optimize inference: TensorRT conversion, batch processing, frame skipping',
          'Write tests for detection and alerting logic',
          'Add graceful handling of camera disconnections and stream errors',
          'Deploy with NVIDIA Docker on GPU cloud instance',
          'Create demo with sample video feeds and documentation',
        ],
        deliverable: 'Optimized, deployed system with tests and demo documentation',
      },
    ],
    resumeAngle: (ctx) =>
      `**"Built a real-time video surveillance platform using YOLOv8 and DeepSORT for object detection and multi-object tracking, processing live camera streams with anomaly detection and instant alerting via a WebSocket-based architecture."**\n\n**Talking Points for Interviews:**\n- Implemented **real-time computer vision** with YOLOv8 + DeepSORT — demonstrates practical deep learning deployment for video.\n- Built a **streaming architecture** with WebSockets and Canvas rendering for live video annotation — strong real-time systems skills.\n- Designed **anomaly detection algorithms** for zone intrusion and loitering — shows algorithmic problem-solving.\n- Optimized inference with **TensorRT and frame skipping** — performance engineering for ML systems.\n- **Ask in interviews:** "How would you scale to 50+ cameras on a single GPU?" — shows systems optimization thinking.`,
    challenges: () => [
      'Achieving real-time performance (30fps) with object detection on video streams',
      'Managing WebSocket connections for multiple live video feeds',
      'Designing anomaly detection thresholds that minimize false positives',
      'Handling camera disconnections and stream reliability issues',
    ],
    learningOutcomes: () => [
      'Real-time computer vision with YOLO and object tracking',
      'Video streaming and WebSocket-based real-time communication',
      'GPU optimization for ML inference (TensorRT, batch processing)',
      'Anomaly detection algorithm design',
      'Multi-camera system architecture and resource management',
    ],
  },
];

// ---- Generator Functions ----

export function generateIdeas(input: AssessmentInput): ProjectIdea[] {
  const { skills, interests, difficulty } = input;

  // Score archetypes by relevance
  const scored = ARCHETYPES.map((archetype) => {
    const matchedSkills = matchKeywords(skills, archetype.relevantSkills);
    const matchedInterests = matchKeywords(interests, archetype.relevantInterests);
    const difficultyOk =
      DIFFICULTY_ORDER[difficulty] >= DIFFICULTY_ORDER[archetype.minDifficulty];

    let score = 0;
    score += matchedSkills.length * 3;
    score += matchedInterests.length * 4;
    if (difficultyOk) score += 5;
    if (DIFFICULTY_ORDER[difficulty] === DIFFICULTY_ORDER[archetype.minDifficulty]) {
      score += 3; // bonus for exact difficulty match
    }

    return { archetype, score, matchedSkills, matchedInterests, difficultyOk };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Take top 3-5 archetypes
  const count = Math.min(Math.max(3, scored.filter((s) => s.score > 0).length), 5);
  const selected = scored.slice(0, count);

  // If not enough matches, fill from all archetypes
  if (selected.length < 3) {
    const remaining = scored.slice(selected.length);
    while (selected.length < 3 && remaining.length > 0) {
      selected.push(remaining.shift()!);
    }
  }

  return selected.map((s) => {
    const ctx: ArchetypeContext = {
      skills,
      interests,
      difficulty,
      matchedSkills: s.matchedSkills,
      matchedInterests: s.matchedInterests,
    };
    return {
      id: Math.random().toString(36).substring(2, 11),
      title: s.archetype.titleTemplate(ctx),
      elevatorPitch: s.archetype.pitch(ctx),
      category: s.archetype.category,
      difficulty,
      tags: [...s.matchedInterests.slice(0, 3), ...s.matchedSkills.slice(0, 2)],
      icon: s.archetype.icon,
    };
  });
}

export function generateRoadmap(idea: ProjectIdea, input: AssessmentInput): Roadmap {
  const archetype = ARCHETYPES.find((a) => a.icon === idea.icon);
  if (!archetype) {
    throw new Error('Archetype not found for idea');
  }

  const ctx: ArchetypeContext = {
    skills: input.skills,
    interests: input.interests,
    difficulty: input.difficulty,
    matchedSkills: matchKeywords(input.skills, archetype.relevantSkills),
    matchedInterests: matchKeywords(input.interests, archetype.relevantInterests),
  };

  const architecture = archetype.architecture(ctx);
  const resumeAngle = archetype.resumeAngle(ctx);

  return {
    overview: idea.elevatorPitch,
    coreFeatures: {
      mvp: archetype.coreMvp(ctx),
      future: archetype.coreFuture(ctx),
    },
    techStack: archetype.techStack(ctx),
    architecture,
    architectureMarkdown: `## System Architecture\n\n${architecture}`,
    sprintPlan: archetype.sprints(ctx),
    resumeAngle,
    resumeAngleMarkdown: `## Resume & Interview Angle\n\n${resumeAngle}`,
    challenges: archetype.challenges(ctx),
    learningOutcomes: archetype.learningOutcomes(ctx),
  };
}

export function generateFullProject(idea: ProjectIdea, input: AssessmentInput): FullProject {
  const roadmap = generateRoadmap(idea, input);
  return {
    ...idea,
    roadmap,
    assessment: input,
  };
}

// ---- Mentor Mode: Analyze a custom problem statement ----

export interface MentorInput {
  problemStatement: string;
  skills: string[];
  difficulty: Difficulty;
}

// Detect domain keywords in the problem statement to find the best archetype
const PROBLEM_KEYWORD_MAP: { keywords: string[]; icon: string }[] = [
  { keywords: ['medical', 'health', 'patient', 'diagnosis', 'clinic', 'disease', 'x-ray', 'scan'], icon: 'HeartPulse' },
  { keywords: ['finance', 'banking', 'payment', 'transaction', 'expense', 'budget', 'trading', 'money', 'fintech'], icon: 'Wallet' },
  { keywords: ['education', 'student', 'learning', 'quiz', 'study', 'course', 'teach', 'school'], icon: 'GraduationCap' },
  { keywords: ['code', 'review', 'pull request', 'documentation', 'developer tool', 'lint', 'static analysis'], icon: 'Code2' },
  { keywords: ['iot', 'smart home', 'sensor', 'automation', 'device', 'mqtt', 'raspberry', 'embedded'], icon: 'Bot' },
  { keywords: ['content', 'article', 'summary', 'news', 'blog', 'media', 'nlp', 'text'], icon: 'PenTool' },
  { keywords: ['carbon', 'environment', 'climate', 'sustainability', 'green', 'community', 'social'], icon: 'Leaf' },
  { keywords: ['camera', 'video', 'surveillance', 'object detection', 'vision', 'image', 'real-time stream'], icon: 'Eye' },
];

function detectArchetypeIcon(problem: string): string {
  const lower = problem.toLowerCase();
  let bestIcon = 'Code2';
  let bestScore = 0;
  for (const entry of PROBLEM_KEYWORD_MAP) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestIcon = entry.icon;
    }
  }
  return bestIcon;
}

// Generate a project title from the problem statement
function generateMentorTitle(problem: string): string {
  const words = problem.trim().split(/\s+/).slice(0, 6).join(' ');
  const cleanWords = words.replace(/[^a-zA-Z0-9\s]/g, '');
  // Try to extract a core concept
  const lower = problem.toLowerCase();
  if (lower.includes('platform')) return `Custom Project: ${cleanWords}...`;
  if (lower.includes('system')) return `Custom System: ${cleanWords}...`;
  if (lower.includes('app') || lower.includes('application')) return `Custom App: ${cleanWords}...`;
  return `ProjectForge: ${cleanWords}...`;
}

// Generate a 2-sentence elevator pitch from the problem statement
function generateMentorPitch(problem: string, skills: string[]): string {
  const trimmed = problem.trim().slice(0, 200);
  const topSkill = skills[0] || 'modern web technologies';
  return `A solution addressing: "${trimmed}${trimmed.length >= 200 ? '...' : ''}" Built using ${topSkill}${skills[1] ? ` and ${skills[1]}` : ''} as the core technology, this project transforms the problem statement into a practical, deployable application that demonstrates full-stack engineering capability and domain understanding.`;
}

export function generateMentorProject(input: MentorInput): FullProject {
  const { problemStatement, skills, difficulty } = input;
  const icon = detectArchetypeIcon(problemStatement);
  const archetype = ARCHETYPES.find((a) => a.icon === icon) || ARCHETYPES[3]; // fallback to Developer Tools

  const matchedSkills = matchKeywords(skills, archetype.relevantSkills);
  const ctx: ArchetypeContext = {
    skills,
    interests: [],
    difficulty,
    matchedSkills,
    matchedInterests: [],
  };

  const title = generateMentorTitle(problemStatement);
  const pitch = generateMentorPitch(problemStatement, skills);

  const idea: ProjectIdea = {
    id: Math.random().toString(36).substring(2, 11),
    title,
    elevatorPitch: pitch,
    category: archetype.category,
    difficulty,
    tags: [...matchedSkills.slice(0, 3), 'Custom Problem'],
    icon,
  };

  // Build a tailored roadmap using the archetype as a template but customizing for the problem
  const baseArch = archetype.architecture(ctx);
  const architecture = `**Problem Analysis:** ${problemStatement.trim().slice(0, 300)}\n\n**Proposed Architecture:** ${baseArch}\n\nThe system is specifically designed to address the requirements in the problem statement. ${matchedSkills.length > 0 ? `The student's proficiency in ${matchedSkills.slice(0, 2).join(' and ')} is leveraged` : 'A modern technology stack is used'} to build a practical, deployable solution that can be demoed to evaluators.`;

  const resumeAngle = `**"Designed and built a custom solution for: ${problemStatement.trim().slice(0, 150)}... using ${skills.slice(0, 2).join(' and ') || 'modern web technologies'}, following a structured architecture and sprint-based development plan."**\n\n**Talking Points for Interviews:**\n- Demonstrated **problem decomposition** by breaking down a real-world problem statement into a technical architecture with clear component boundaries.\n- Applied **${matchedSkills.slice(0, 2).join(' and ') || 'full-stack engineering'}** to build a practical solution — showing adaptability to unfamiliar problem domains.\n- Followed a **sprint-based development methodology** with weekly deliverables — professional software development practices.\n- Designed a **scalable system architecture** informed by the specific constraints of the problem statement.\n- **Ask in interviews:** "What alternative approaches did you consider, and why did you choose this architecture?" — shows engineering decision-making.`;

  const roadmap: Roadmap = {
    overview: pitch,
    coreFeatures: {
      mvp: archetype.coreMvp(ctx).map((f, i) =>
        i === 0 ? `Core solution addressing the problem statement: ${problemStatement.trim().slice(0, 100)}...` : f
      ),
      future: archetype.coreFuture(ctx),
    },
    techStack: archetype.techStack(ctx).map((stack) => ({
      ...stack,
      technologies: stack.technologies.map((tech) => {
        // If the student has a matching skill, swap it in
        const skillMatch = matchedSkills.find((ms) =>
          tech.toLowerCase().includes(ms.toLowerCase()) ||
          ms.toLowerCase().includes(tech.toLowerCase().split(' ')[0])
        );
        return skillMatch ? tech : tech;
      }),
    })),
    architecture,
    architectureMarkdown: `## System Architecture\n\n${architecture}`,
    sprintPlan: archetype.sprints(ctx).map((sprint, i) => {
      if (i === 0) {
        return {
          ...sprint,
          title: 'Problem Analysis & Project Setup',
          tasks: [
            `Analyze the problem statement: "${problemStatement.trim().slice(0, 120)}..."`,
            `Identify key requirements, constraints, and user stories from the problem`,
            ...sprint.tasks.slice(1),
          ],
          deliverable: 'Problem analysis document, project scaffold, and database schema ready',
        };
      }
      return sprint;
    }),
    resumeAngle,
    resumeAngleMarkdown: `## Resume & Interview Angle\n\n${resumeAngle}`,
    challenges: [
      'Understanding and decomposing the custom problem statement into technical requirements',
      'Designing an architecture that directly addresses the problem constraints',
      ...archetype.challenges(ctx).slice(0, 2),
    ],
    learningOutcomes: [
      'Problem decomposition: translating a real-world problem into a technical architecture',
      ...archetype.learningOutcomes(ctx).slice(0, 3),
    ],
  };

  return {
    ...idea,
    roadmap,
    assessment: {
      skills,
      interests: [],
      difficulty,
    },
  };
}

// Convert a project to markdown for export
export function projectToMarkdown(project: FullProject): string {
  const r = project.roadmap;
  let md = `# ${project.title}\n\n`;
  md += `**Category:** ${project.category}\n`;
  md += `**Difficulty:** ${project.difficulty}\n`;
  md += `**Tags:** ${project.tags.join(', ')}\n\n`;
  md += `## Overview\n\n${r.overview}\n\n`;

  md += `## Core Features\n\n### MVP Features\n`;
  r.coreFeatures.mvp.forEach((f) => (md += `- ${f}\n`));
  md += `\n### Future Enhancements\n`;
  r.coreFeatures.future.forEach((f) => (md += `- ${f}\n`));

  md += `\n## Tech Stack Recommendation\n\n`;
  md += `| Layer | Technologies |\n|-------|-------------|\n`;
  r.techStack.forEach((t) => {
    md += `| ${t.layer} | ${t.technologies.join(', ')} |\n`;
  });

  md += `\n${r.architectureMarkdown}\n\n`;

  md += `## Step-by-Step Development Plan\n\n`;
  r.sprintPlan.forEach((sprint) => {
    md += `### ${sprint.week}: ${sprint.title}\n\n`;
    md += `**Tasks:**\n`;
    sprint.tasks.forEach((t) => (md += `- ${t}\n`));
    md += `\n**Deliverable:** ${sprint.deliverable}\n\n`;
  });

  md += `${r.resumeAngleMarkdown}\n\n`;

  md += `## Key Challenges\n\n`;
  r.challenges.forEach((c) => (md += `- ${c}\n`));

  md += `\n## Learning Outcomes\n\n`;
  r.learningOutcomes.forEach((l) => (md += `- ${l}\n`));

  md += `\n---\n*Generated by ProjectForge AI*\n`;
  return md;
}
