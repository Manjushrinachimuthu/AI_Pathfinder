// API Base URL
const BACKEND_URL = 'https://ai-pathfinder-t2gn.vercel.app';
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '/api'
    : `${BACKEND_URL}/api`;

// Track current company context
let currentCompany = null;
let currentRole = null;
let codingMode = 'career-tools';
let selectedCodingLanguage = null;
const codingTopicDetailCache = {};
const codingChallengeCache = {};
const interviewSession = {
    category: 'technical',
    questions: [],
    answers: [],
    currentIndex: 0,
    completed: false,
    requestedCount: 5
};
const companyMockQuestionPrefs = {
    aptitude: 10,
    coding: 2
};
const CAREER_STATE_STORAGE_KEY = 'ai_pathfinder_career_state_v1';
const USER_HISTORY_STORAGE_KEY = 'ai_pathfinder_user_history_v1';
const careerToolsCatalog = [
    {
        key: 'resume',
        title: 'Resume Builder + Checker',
        description: 'Build ATS-friendly resume content, check quality scores, and get actionable improvement tips.',
        statLabel: 'Resume readiness',
        scoreField: 'resumeScore',
        cta: 'Open Resume Tool'
    }
];
let careerToolState = {
    activeTool: null,
    resumeScore: 0,
    coverLetterScore: 0,
    jobApplyScore: 0,
    applicationsSent: 0,
    weeklyTarget: 20,
    interviewsScheduled: 0,
    tasksCompleted: 1,
    tasksTotal: 8
};
let firebaseAppInstance = null;
let firebaseAuth = null;
let firestoreDb = null;
let activeUserId = null;
let currentAuthMode = 'login';
let userHistoryState = {
    mncMockTests: [],
    aiInterviews: []
};

const defaultSectionCopy = {
    aptitude: {
        title: 'Aptitude Practice',
        context: 'Practice quantitative, logical, and verbal questions across common placement topics.'
    },
    mnc: {
        title: 'MNC Mock Tests',
        context: 'Select a company to practice company-specific aptitude questions and view their preparation roadmap.'
    },
    coding: {
        title: 'Career Tools',
        context: 'Use resume, cover letter, and auto-apply tools with a live dashboard to track job search progress.'
    },
    interview: {
        title: 'Interview Preparation',
        context: 'Prepare for technical and HR rounds with focused question sets.'
    },
    analysis: {
        title: 'Performance Analysis',
        context: 'Check your current readiness level using aptitude, coding, and interview scores.',
        button: 'Analyze'
    }
};

const roleExplorerItems = [
    { name: 'Frontend Developer', key: 'frontend_developer', status: 'available', track: 'Web Development' },
    { name: 'Backend Developer', key: 'backend_developer', status: 'available', track: 'APIs and Systems' },
    { name: 'Full Stack Developer', key: 'full_stack_developer', status: 'available', track: 'End-to-End Apps' },
    { name: 'Data Analyst', key: 'data_analyst', status: 'available', track: 'Data and BI' },
    { name: 'Data Scientist', key: 'data_scientist', status: 'available', track: 'ML and Analytics' },
    { name: 'Machine Learning Engineer', key: 'ml_engineer', status: 'available', track: 'AI Engineering' },
    { name: 'DevOps Engineer', key: 'devops_engineer', status: 'available', track: 'CI/CD and Infra' },
    { name: 'Cloud Engineer', key: 'cloud_engineer', status: 'available', track: 'Cloud Platforms' },
    { name: 'Cybersecurity Analyst', key: 'cybersecurity_analyst', status: 'available', track: 'Security' },
    { name: 'QA Automation Engineer', key: 'qa_automation_engineer', status: 'available', track: 'Testing' },
    { name: 'Mobile App Developer', key: 'mobile_developer', status: 'available', track: 'Android and iOS' },
    { name: 'UI/UX Designer', key: 'uiux_designer', status: 'available', track: 'Product Design' }
];

// MNC Company Explorer Data
const companyExplorerItems = [
    { name: 'TCS', key: 'tcs', status: 'available', track: 'IT Services', color: '#0089d6', level: 'Beginner', badge: 'Popular', tests: '12 tests', learners: '148K', rating: '4.9' },
    { name: 'Infosys', key: 'infosys', status: 'available', track: 'IT Services', color: '#007cc3', level: 'Intermediate', badge: 'Popular', tests: '11 tests', learners: '92K', rating: '4.8' },
    { name: 'Wipro', key: 'wipro', status: 'available', track: 'IT Services', color: '#303890', level: 'Beginner', badge: 'Core', tests: '10 tests', learners: '67K', rating: '4.7' },
    { name: 'Accenture', key: 'accenture', status: 'available', track: 'Consulting', color: '#a100ff', level: 'Intermediate', badge: 'Popular', tests: '13 tests', learners: '104K', rating: '4.8' },
    { name: 'Cognizant', key: 'cognizant', status: 'available', track: 'IT Services', color: '#00b0f0', level: 'Beginner', badge: 'Fast Track', tests: '9 tests', learners: '59K', rating: '4.6' },
    { name: 'HCL Technologies', key: 'hcl', status: 'available', track: 'IT Services', color: '#ff4d4d', level: 'Beginner', badge: 'New', tests: '12 tests', learners: '48K', rating: '4.6' },
    { name: 'Tech Mahindra', key: 'tech_mahindra', status: 'available', track: 'IT Services', color: '#00a9ce', level: 'Intermediate', badge: 'New', tests: '11 tests', learners: '53K', rating: '4.7' },
    { name: 'Capgemini', key: 'capgemini', status: 'available', track: 'Consulting', color: '#00a8e8', level: 'Beginner', badge: 'New', tests: '10 tests', learners: '62K', rating: '4.7' },
    { name: 'Amazon', key: 'amazon', status: 'available', track: 'E-Commerce', color: '#ff9900', level: 'Advanced', badge: 'New', tests: '14 tests', learners: '136K', rating: '4.9' },
    { name: 'Google', key: 'google', status: 'available', track: 'Tech', color: '#4285f4', level: 'Advanced', badge: 'New', tests: '14 tests', learners: '142K', rating: '4.9' },
    { name: 'Microsoft', key: 'microsoft', status: 'available', track: 'Tech', color: '#00a4ef', level: 'Advanced', badge: 'New', tests: '14 tests', learners: '133K', rating: '4.9' },
    { name: 'IBM', key: 'ibm', status: 'available', track: 'Tech', color: '#0530ad', level: 'Intermediate', badge: 'New', tests: '11 tests', learners: '71K', rating: '4.8' }
];

const roleLearningPaths = {
    frontend_developer: {
        title: 'Frontend Developer',
        intro: 'Master modern UI engineering, responsive design, and frontend architecture.',
        skillGroups: [
            { heading: 'Core Web Foundations', skills: ['HTML5 Semantics', 'CSS3 Layouts (Flexbox/Grid)', 'JavaScript ES6+', 'DOM and Events', 'Accessibility Basics'] },
            { heading: 'Frameworks and State', skills: ['React Fundamentals', 'State Management', 'Routing', 'API Integration', 'Performance Optimization'] },
            { heading: 'Developer Workflow', skills: ['Git and GitHub', 'Package Managers', 'Build Tools', 'Unit Testing', 'Deployment Basics'] }
        ]
    },
    backend_developer: {
        title: 'Backend Developer',
        intro: 'Build scalable APIs, data layers, and secure backend systems.',
        skillGroups: [
            { heading: 'Backend Fundamentals', skills: ['One Backend Language', 'Data Structures', 'OOP and Design Principles', 'Error Handling', 'Logging'] },
            { heading: 'APIs and Databases', skills: ['REST API Design', 'Authentication and Authorization', 'SQL and NoSQL', 'ORM Usage', 'Caching Basics'] },
            { heading: 'System Readiness', skills: ['Scalability Concepts', 'Message Queues', 'Testing APIs', 'Monitoring', 'Cloud Deployment'] }
        ]
    },
    full_stack_developer: {
        title: 'Full Stack Developer',
        intro: 'Combine frontend and backend skills to deliver complete products.',
        skillGroups: [
            { heading: 'Frontend Stack', skills: ['HTML/CSS/JavaScript', 'React or Similar Framework', 'UI Components', 'Form Handling', 'Client-side Validation'] },
            { heading: 'Backend Stack', skills: ['Server-side Development', 'API Design', 'Database Modeling', 'Auth Flows', 'Session Management'] },
            { heading: 'Product Delivery', skills: ['End-to-End Project Building', 'Version Control', 'CI/CD Basics', 'Testing Strategy', 'Deployment and Monitoring'] }
        ]
    },
    data_analyst: {
        title: 'Data Analyst',
        intro: 'Turn raw data into clear insights and business decisions.',
        skillGroups: [
            { heading: 'Analysis Basics', skills: ['Excel Advanced Functions', 'Statistics Basics', 'Data Cleaning', 'Exploratory Analysis', 'Data Storytelling'] },
            { heading: 'Tools and Querying', skills: ['SQL Queries', 'Python for Analysis', 'Pandas', 'Data Visualization Tools', 'Dashboard Design'] },
            { heading: 'Business Impact', skills: ['KPI Definition', 'Reporting Automation', 'A/B Testing Basics', 'Presentation Skills', 'Domain Understanding'] }
        ]
    },
    data_scientist: {
        title: 'Data Scientist',
        intro: 'Develop data-driven models and insights using statistics and machine learning.',
        skillGroups: [
            { heading: 'Math and Stats', skills: ['Probability', 'Inferential Statistics', 'Linear Algebra Basics', 'Hypothesis Testing', 'Feature Engineering'] },
            { heading: 'ML Pipeline', skills: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Cross Validation', 'Model Explainability'] },
            { heading: 'Production Mindset', skills: ['Experiment Tracking', 'Model Serving Basics', 'Data Versioning', 'Cloud ML Basics', 'Communication of Results'] }
        ]
    },
    ml_engineer: {
        title: 'Machine Learning Engineer',
        intro: 'Build and deploy robust machine learning systems in production.',
        skillGroups: [
            { heading: 'ML Engineering Core', skills: ['ML Algorithms', 'Feature Stores', 'Model Training Pipelines', 'Model Versioning', 'Inference Optimization'] },
            { heading: 'MLOps', skills: ['CI/CD for ML', 'Monitoring Drift', 'Containerization', 'Orchestration', 'Model Retraining Strategy'] },
            { heading: 'System Integration', skills: ['API Serving', 'Batch vs Real-time Inference', 'Cloud GPU Basics', 'Scalability', 'Cost Optimization'] }
        ]
    },
    devops_engineer: {
        title: 'DevOps Engineer',
        intro: 'Automate software delivery and operate reliable infrastructure.',
        skillGroups: [
            { heading: 'Infrastructure Basics', skills: ['Linux Administration', 'Networking Basics', 'Scripting', 'Configuration Management', 'Infrastructure as Code'] },
            { heading: 'Delivery Pipelines', skills: ['CI/CD Tools', 'Build and Release Management', 'Artifact Management', 'Automated Testing', 'Rollback Strategies'] },
            { heading: 'Operations', skills: ['Docker', 'Kubernetes Basics', 'Monitoring and Alerting', 'Incident Response', 'Security Best Practices'] }
        ]
    },
    cloud_engineer: {
        title: 'Cloud Engineer',
        intro: 'Design, deploy, and secure cloud infrastructure and services.',
        skillGroups: [
            { heading: 'Cloud Foundations', skills: ['Core Cloud Services', 'IAM and Security', 'Storage Options', 'Compute Services', 'Virtual Networking'] },
            { heading: 'Architecture and Reliability', skills: ['High Availability', 'Load Balancing', 'Disaster Recovery', 'Cost Management', 'Observability'] },
            { heading: 'Automation', skills: ['Terraform Basics', 'Cloud CI/CD', 'Serverless Concepts', 'Container Services', 'Policy and Governance'] }
        ]
    },
    cybersecurity_analyst: {
        title: 'Cybersecurity Analyst',
        intro: 'Protect systems, detect threats, and respond to incidents effectively.',
        skillGroups: [
            { heading: 'Security Fundamentals', skills: ['Network Security Basics', 'Cryptography Basics', 'OWASP Top Risks', 'Identity Security', 'Secure Configuration'] },
            { heading: 'Threat Detection', skills: ['SIEM Tools', 'Log Analysis', 'Threat Intelligence', 'Vulnerability Assessment', 'Basic Incident Triage'] },
            { heading: 'Response and Governance', skills: ['Incident Response Process', 'Security Policies', 'Risk Assessment', 'Compliance Basics', 'Security Reporting'] }
        ]
    },
    qa_automation_engineer: {
        title: 'QA Automation Engineer',
        intro: 'Ensure software quality through automated test design and execution.',
        skillGroups: [
            { heading: 'Testing Fundamentals', skills: ['Test Case Design', 'Bug Lifecycle', 'Functional Testing', 'Regression Testing', 'API Testing Basics'] },
            { heading: 'Automation Stack', skills: ['Automation Frameworks', 'Scripting Language', 'UI Automation', 'API Automation', 'Test Data Management'] },
            { heading: 'Quality Engineering', skills: ['CI Integration', 'Performance Testing Basics', 'Reporting and Metrics', 'Flaky Test Handling', 'Shift-left Testing'] }
        ]
    },
    mobile_developer: {
        title: 'Mobile App Developer',
        intro: 'Build smooth, reliable mobile applications for Android and iOS.',
        skillGroups: [
            { heading: 'Mobile Fundamentals', skills: ['Platform Basics', 'App Lifecycle', 'UI Components', 'Navigation Patterns', 'State Management'] },
            { heading: 'Data and APIs', skills: ['REST/GraphQL Integration', 'Local Storage', 'Authentication', 'Offline-first Concepts', 'Push Notifications'] },
            { heading: 'Release Readiness', skills: ['Testing Mobile Apps', 'Performance Tuning', 'Crash Monitoring', 'Store Deployment', 'Versioning Strategy'] }
        ]
    },
    uiux_designer: {
        title: 'UI/UX Designer',
        intro: 'Craft intuitive, user-centered experiences with strong visual systems.',
        skillGroups: [
            { heading: 'UX Foundations', skills: ['User Research', 'Personas and Journeys', 'Information Architecture', 'Wireframing', 'Interaction Design'] },
            { heading: 'UI Design Skills', skills: ['Visual Hierarchy', 'Typography and Color', 'Design Systems', 'Responsive Design', 'Accessibility in UI'] },
            { heading: 'Validation and Handoff', skills: ['Usability Testing', 'Prototyping', 'Design Critique', 'Developer Handoff', 'Iterative Improvement'] }
        ]
    }
};

let companyExplorerFilter = 'all';

function getCurrentRoleName() {
    return currentRole;
}

function initCompanyExplorer() {
    console.log('initCompanyExplorer called');
    renderCompanyExplorer();
}

function renderCompanyExplorer() {
    console.log('renderCompanyExplorer called');
    const grid = document.getElementById('mnc-grid');
    if (!grid) {
        console.log('MNC grid not found');
        return;
    }
    
    console.log('Rendering MNC grid with', companyExplorerItems.length, 'companies');
    
    grid.innerHTML = companyExplorerItems.map(item => {
        const isAvailable = item.status === 'available';
        const logoLetter = item.name.substring(0, 2).toUpperCase();
        const levelClass = (item.level || 'Beginner').toLowerCase().replace(/\s+/g, '-');
        const description = `${item.track} mock pattern with aptitude, coding, and interview round practice.`;
        
        if (isAvailable) {
            return `
                <button type="button" class="mnc-company-card" data-key="${item.key}" style="--company-color: ${item.color}">
                    <div class="mnc-card-top">
                        <span class="mnc-company-logo" style="background: ${item.color}20; color: ${item.color}; border-color: ${item.color}40;">
                            ${logoLetter}
                        </span>
                    </div>
                    <div class="mnc-card-body">
                        <div class="mnc-card-tags">
                            <span class="mnc-tag level ${levelClass}">${item.level}</span>
                            <span class="mnc-tag status">${item.badge}</span>
                        </div>
                        <h3>${item.name}</h3>
                        <p>${description}</p>
                        <div class="mnc-card-meta">
                            <span>ðŸ“š ${item.tests}</span>
                            <span>ðŸ‘¥ ${item.learners}</span>
                            <span>â­ ${item.rating}</span>
                        </div>
                        <span class="mnc-card-cta">Start Learning â†’</span>
                    </div>
                </button>
            `;
        }
        
        return `
            <div class="mnc-company-card" style="--company-color: ${item.color}; opacity: 0.6;">
                <div class="mnc-card-top">
                    <span class="mnc-company-logo" style="background: ${item.color}20; color: ${item.color}; border-color: ${item.color}40;">
                        ${logoLetter}
                    </span>
                </div>
                <div class="mnc-card-body">
                    <div class="mnc-card-tags">
                        <span class="mnc-tag level ${levelClass}">${item.level}</span>
                        <span class="mnc-tag coming">Coming Soon</span>
                    </div>
                    <h3>${item.name}</h3>
                    <p>${description}</p>
                    <div class="mnc-card-meta">
                        <span>ðŸ“š ${item.tests}</span>
                        <span>ðŸ‘¥ ${item.learners}</span>
                        <span>â­ ${item.rating}</span>
                    </div>
                    <span class="mnc-card-cta disabled">Coming Soon</span>
                </div>
            </div>
        `;
    }).join('');

    // Add click handlers for available companies
    grid.querySelectorAll('.mnc-company-card[data-key]').forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            console.log('Company clicked:', key);
            showCompanyRoadmap(key);
        });
    });
}

function showCompanyRoadmap(companyKey) {
    console.log('showCompanyRoadmap called with:', companyKey);
    currentCompany = companyKey;
    startCompanyMockTest(companyKey, 'aptitude');
}

function startCompanyMockTest(companyKey, testType) {
    console.log('startCompanyMockTest called with:', companyKey);
    
    currentCompany = companyKey;
    const mockTestContent = document.getElementById('mocktest-content');
    const mockTestTitle = document.getElementById('mocktest-title');
    const mockTestContext = document.getElementById('mocktest-context');
    
    if (!mockTestContent || !mockTestTitle || !mockTestContext) {
        console.log('Mock test elements not found');
        return;
    }
    
    const companyName = companyRoadmaps[companyKey]?.name || companyKey;
    
    mockTestTitle.textContent = `${companyName} Mock Test`;
    mockTestContext.textContent = `Choose how many Aptitude and Coding questions you want for ${companyName}.`;

    currentMockTestType = testType || 'combined';
    const defaultAptitude = currentMockTestType === 'coding' ? 0 : companyMockQuestionPrefs.aptitude;
    const defaultCoding = currentMockTestType === 'aptitude' ? 0 : companyMockQuestionPrefs.coding;
    showCompanyMockConfigurator(companyKey, defaultAptitude, defaultCoding);
    
    showSection('mocktest');
}

let currentMockTestType = null;
let companyMockTestQuestions = [];
let companyMockTestAnswers = {};
let companyMockTestScore = 0;
let currentQuestionIndex = 0;

function clampQuestionCount(value, minValue, maxValue, fallback) {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
        return fallback;
    }
    return Math.max(minValue, Math.min(maxValue, parsed));
}

function showCompanyMockConfigurator(companyKey, defaultAptitude = 10, defaultCoding = 2) {
    const container = document.getElementById('mocktest-content');
    if (!container) {
        return;
    }

    const companyName = companyRoadmaps[companyKey]?.name || companyKey;
    const aptitudeValue = clampQuestionCount(defaultAptitude, 0, 30, 10);
    const codingValue = clampQuestionCount(defaultCoding, 0, 15, 2);

    container.innerHTML = `
        <div class="mocktest-question">
            <h3>${companyName} Test Setup</h3>
            <p>Choose how many questions you want in each section.</p>
            <div class="score-input">
                <label for="company-aptitude-count" class="mocktest-count-label mocktest-count-label-aptitude">Aptitude Questions (0-30)</label>
                <input type="number" id="company-aptitude-count" min="0" max="30" value="${aptitudeValue}">
                <label for="company-coding-count" class="mocktest-count-label mocktest-count-label-coding">Coding Questions (0-15)</label>
                <input type="number" id="company-coding-count" min="0" max="15" value="${codingValue}">
            </div>
            <div class="mocktest-actions">
                <button class="submit-btn" onclick="beginCompanyMockTest('${companyKey}')">Start Test</button>
            </div>
        </div>
    `;
}

function beginCompanyMockTest(companyKey) {
    const aptitudeInput = document.getElementById('company-aptitude-count');
    const codingInput = document.getElementById('company-coding-count');
    const aptitudeCount = clampQuestionCount(aptitudeInput ? aptitudeInput.value : 10, 0, 30, 10);
    const codingCount = clampQuestionCount(codingInput ? codingInput.value : 2, 0, 15, 2);

    if (aptitudeCount + codingCount <= 0) {
        alert('Choose at least one question to start the test.');
        return;
    }

    companyMockQuestionPrefs.aptitude = aptitudeCount;
    companyMockQuestionPrefs.coding = codingCount;

    const companyName = companyRoadmaps[companyKey]?.name || companyKey;
    const mockTestContext = document.getElementById('mocktest-context');
    if (mockTestContext) {
        mockTestContext.textContent = `Complete ${companyName}'s assessment: ${aptitudeCount} Aptitude + ${codingCount} Coding Questions.`;
    }

    loadCompanyCombinedTest(companyKey, aptitudeCount, codingCount);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

async function loadCompanyCombinedTest(companyKey, aptitudeCount = 10, codingCount = 2) {
    const container = document.getElementById('mocktest-content');
    container.innerHTML = '<p>Loading assessment...</p>';
    
    try {
        const allQuestions = [];
        const aptitudeTarget = clampQuestionCount(aptitudeCount, 0, 30, 10);
        const codingTarget = clampQuestionCount(codingCount, 0, 15, 2);

        if (aptitudeTarget > 0) {
            const topicsResponse = await fetch(`${API_BASE}/company/${companyKey}/aptitude/topics`);
            const topics = await topicsResponse.json();

            if (Array.isArray(topics) && topics.length > 0) {
                const aptitudePool = [];
                for (const topic of topics) {
                    const qResponse = await fetch(`${API_BASE}/company/${companyKey}/aptitude/${topic.key}`);
                    const questions = await qResponse.json();
                    if (Array.isArray(questions) && questions.length > 0) {
                        aptitudePool.push(...questions.map(q => ({
                            ...q,
                            type: 'aptitude',
                            topic: topic.label
                        })));
                    }
                }
                allQuestions.push(...shuffleArray(aptitudePool).slice(0, aptitudeTarget));
            }
        }

        if (codingTarget > 0) {
            const codingResponse = await fetch(`${API_BASE}/company/${companyKey}/coding`);
            const codingQuestions = await codingResponse.json();

            if (Array.isArray(codingQuestions) && codingQuestions.length > 0) {
                const selectedCoding = shuffleArray(codingQuestions).slice(0, codingTarget);
                allQuestions.push(...selectedCoding.map(q => ({
                    ...q,
                    type: 'coding'
                })));
            }
        }
        
        if (allQuestions.length === 0) {
            container.innerHTML = '<p>No questions available. Please try another company.</p>';
            return;
        }
        
        companyMockTestQuestions = shuffleArray(allQuestions);
        companyMockTestAnswers = {};
        companyMockTestScore = 0;
        currentQuestionIndex = 0;
        
        renderMockTestQuestion();
    } catch (error) {
        container.innerHTML = '<p>Error loading questions. Please try again.</p>';
        console.error('Error loading company test:', error);
    }
}

function renderMockTestQuestion() {
    const container = document.getElementById('mocktest-content');
    const question = companyMockTestQuestions[currentQuestionIndex];
    
    if (!question) {
        showMockTestResults();
        return;
    }
    
    const isCoding = question.type === 'coding';
    const progressText = `Question ${currentQuestionIndex + 1} of ${companyMockTestQuestions.length}`;
    const progressPercent = ((currentQuestionIndex) / companyMockTestQuestions.length) * 100;
    
    if (isCoding) {
        container.innerHTML = `
            <div class="mocktest-progress">
                <div class="mocktest-progress-bar" style="width: ${progressPercent}%"></div>
            </div>
            <p class="mocktest-progress-text">${progressText}</p>
            <div class="mocktest-question">
                <span class="mocktest-topic-badge">Coding Challenge</span>
                <h3>${question.title || question.question}</h3>
                ${question.description ? `<p>${question.description}</p>` : ''}
                ${question.examples ? `<div class="mocktest-examples"><pre>${question.examples}</pre></div>` : ''}
                <div class="mocktest-difficulty">
                    <span class="difficulty ${question.difficulty || 'easy'}">${question.difficulty || 'Easy'}</span>
                </div>
                <div class="mocktest-code-area">
                    <textarea id="code-input" class="code-editor" placeholder="Write your code here..." oninput="companyMockTestAnswers[${currentQuestionIndex}] = this.value">${companyMockTestAnswers[currentQuestionIndex] || ''}</textarea>
                </div>
                <div class="mocktest-actions">
                    ${currentQuestionIndex > 0 ? `<button class="back-btn" onclick="prevMockTestQuestion()">Previous</button>` : ''}
                    <button class="submit-btn" onclick="submitMockTestAnswer()">Submit Answer</button>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="mocktest-progress">
                <div class="mocktest-progress-bar" style="width: ${progressPercent}%"></div>
            </div>
            <p class="mocktest-progress-text">${progressText}</p>
            <div class="mocktest-question">
                <span class="mocktest-topic-badge">${question.topic}</span>
                <h3>${question.question}</h3>
                <div class="mocktest-options">
                    ${question.options ? question.options.map((opt, idx) => `
                        <button class="mocktest-option ${companyMockTestAnswers[currentQuestionIndex] === opt ? 'selected' : ''}" 
                                onclick="selectMockTestOption('${escapeJsString(opt)}')">${opt}</button>
                    `).join('') : ''}
                </div>
                <div class="mocktest-actions">
                    ${currentQuestionIndex > 0 ? `<button class="back-btn" onclick="prevMockTestQuestion()">Previous</button>` : ''}
                    <button class="submit-btn" onclick="submitMockTestAnswer()">Submit Answer</button>
                </div>
            </div>
        `;
    }
}

function selectMockTestOption(option) {
    companyMockTestAnswers[currentQuestionIndex] = option;
    renderMockTestQuestion();
}

function submitMockTestAnswer() {
    const question = companyMockTestQuestions[currentQuestionIndex];
    const userAnswer = companyMockTestAnswers[currentQuestionIndex];
    
    if (!userAnswer && question.type !== 'coding') {
        alert('Please select an answer before submitting.');
        return;
    }
    
    if (question.type !== 'coding') {
        if (userAnswer === question.answer) {
            companyMockTestScore++;
        }
    } else {
        if (userAnswer && userAnswer.trim() !== '') {
            companyMockTestScore++;
        }
    }
    
    if (currentQuestionIndex < companyMockTestQuestions.length - 1) {
        currentQuestionIndex++;
        renderMockTestQuestion();
    } else {
        showMockTestResults();
    }
}

function prevMockTestQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderMockTestQuestion();
    }
}

function showMockTestResults() {
    const container = document.getElementById('mocktest-content');
    const companyName = companyRoadmaps[currentCompany]?.name || currentCompany;
    const totalQuestions = companyMockTestQuestions.length;
    const percentage = Math.round((companyMockTestScore / totalQuestions) * 100);
    
    const aptitudeQuestions = companyMockTestQuestions.filter(q => q.type !== 'coding');
    const codingQuestions = companyMockTestQuestions.filter(q => q.type === 'coding');
    
    let aptitudeCorrect = 0;
    let codingCorrect = 0;
    
    for (let i = 0; i < companyMockTestQuestions.length; i++) {
        const q = companyMockTestQuestions[i];
        const userAns = companyMockTestAnswers[i];
        if (q.type !== 'coding' && userAns === q.answer) {
            aptitudeCorrect++;
        } else if (q.type === 'coding' && userAns && userAns.trim() !== '') {
            codingCorrect++;
        }
    }
    
    const aptitudePercent = aptitudeQuestions.length > 0 ? Math.round((aptitudeCorrect / aptitudeQuestions.length) * 100) : 0;
    const codingPercent = codingQuestions.length > 0 ? Math.round((codingCorrect / codingQuestions.length) * 100) : 0;
    
    let level = 'Beginner';
    if (percentage >= 80) level = 'Expert';
    else if (percentage >= 60) level = 'Advanced';
    else if (percentage >= 40) level = 'Intermediate';

    recordMncMockTestHistory({
        companyKey: currentCompany,
        companyName,
        totalQuestions,
        aptitudeQuestions: aptitudeQuestions.length,
        codingQuestions: codingQuestions.length,
        score: companyMockTestScore,
        percentage,
        level
    });
    
    container.innerHTML = `
        <div class="mocktest-results">
            <h2>Test Completed!</h2>
            <div class="mocktest-score">
                <span class="score-percentage">${percentage}%</span>
                <span class="score-label">${companyMockTestScore} out of ${totalQuestions} correct</span>
            </div>
            
            <div class="mocktest-graph">
                <h3>Performance Breakdown</h3>
                <div class="graph-container">
                    <div class="graph-bar-group">
                        <div class="graph-label">Aptitude</div>
                        <div class="graph-bar-container">
                            <div class="graph-bar" style="width: ${aptitudePercent}%; background: linear-gradient(90deg, #22d3ee, #0891b2);">
                                <span class="graph-value">${aptitudePercent}%</span>
                            </div>
                        </div>
                        <div class="graph-detail">${aptitudeCorrect}/${aptitudeQuestions.length} correct</div>
                    </div>
                    <div class="graph-bar-group">
                        <div class="graph-label">Coding</div>
                        <div class="graph-bar-container">
                            <div class="graph-bar" style="width: ${codingPercent}%; background: linear-gradient(90deg, #f59e0b, #d97706);">
                                <span class="graph-value">${codingPercent}%</span>
                            </div>
                        </div>
                        <div class="graph-detail">${codingCorrect}/${codingQuestions.length} submitted</div>
                    </div>
                </div>
                <div class="graph-summary">
                    <div class="summary-item">
                        <span class="summary-label">Total Questions:</span>
                        <span class="summary-value">${totalQuestions}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Correct Answers:</span>
                        <span class="summary-value">${companyMockTestScore}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Your Level:</span>
                        <span class="summary-value level-badge ${level.toLowerCase()}">${level}</span>
                    </div>
                </div>
            </div>
            
            <p class="mocktest-feedback">
                ${percentage >= 70 ? 'Great job! You are well prepared for ' + companyName + '!' : 
                  percentage >= 40 ? 'Good effort! Keep practicing to improve your score.' : 
                  'Keep learning! Review the topics and try again.'}
            </p>
            <div class="mocktest-actions">
                <button class="retry-btn" onclick="startCompanyMockTest('${currentCompany}', 'combined')">Try Again</button>
                <button class="back-btn" onclick="showSection('mnc')">Back to Companies</button>
            </div>
        </div>
    `;
}

function selectRolePath(roleKey) {
    const selectedRole = roleExplorerItems.find(item => item.key === roleKey);
    if (!selectedRole) {
        return;
    }

    currentRole = selectedRole.name;
    currentCompany = null;
    updateSectionContext();
    showRoleLearningPath(roleKey);
}

function openRandomRole() {
    const availableRoles = roleExplorerItems.filter(item => item.status === 'available' && item.key);
    if (!availableRoles.length) {
        return;
    }

    const randomRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];
    selectRolePath(randomRole.key);
}

function openRandomCompany() {
    const availableCompanies = companyExplorerItems.filter(item => item.status === 'available' && item.key);
    if (!availableCompanies.length) {
        return;
    }

    const randomCompany = availableCompanies[Math.floor(Math.random() * availableCompanies.length)];
    showCompanyRoadmap(randomCompany.key);
}

function showRoleLearningPath(roleKey) {
    const rolePath = roleLearningPaths[roleKey];
    const roleSection = document.getElementById('company-info');
    const roleContent = document.getElementById('company-content');
    if (!rolePath || !roleSection || !roleContent) {
        return;
    }

    showSection('company-info');
    roleContent.innerHTML = `
        <div class="company-detail role-learning-detail">
            <h1>${rolePath.title} Learning Path</h1>
            <p>${rolePath.intro}</p>
            <div class="roadmap-groups">
                ${rolePath.skillGroups.map(group => `
                    <article class="roadmap-group">
                        <h4>${group.heading}</h4>
                        <ul class="roadmap-list">
                            ${group.skills.map(skill => `<li>${skill}</li>`).join('')}
                        </ul>
                    </article>
                `).join('')}
            </div>
            <div class="roadmap-actions">
                <button type="button" onclick="showSection('aptitude')">Start Aptitude Practice</button>
                <button type="button" onclick="showSection('coding')">Start Coding Practice</button>
                <button type="button" onclick="showSection('interview')">Start Interview Prep</button>
            </div>
        </div>
    `;
}

function updateSectionContext() {
    const roleName = getCurrentRoleName();
    const aptitudeTitle = document.getElementById('aptitude-title');
    const aptitudeContext = document.getElementById('aptitude-context');
    const mncTitle = document.getElementById('mnc-title');
    const mncContext = document.getElementById('mnc-context');
    const codingTitle = document.getElementById('coding-title');
    const codingContext = document.getElementById('coding-context');
    const interviewTitle = document.getElementById('interview-title');
    const interviewContext = document.getElementById('interview-context');
    const analysisTitle = document.getElementById('analysis-title');
    const analysisContext = document.getElementById('analysis-context');
    const analysisButton = document.getElementById('analysis-button');

    if (mncTitle) mncTitle.textContent = defaultSectionCopy.mnc.title;
    if (mncContext) mncContext.textContent = defaultSectionCopy.mnc.context;

    if (!roleName) {
        aptitudeTitle.textContent = defaultSectionCopy.aptitude.title;
        aptitudeContext.textContent = defaultSectionCopy.aptitude.context;
        codingTitle.textContent = defaultSectionCopy.coding.title;
        codingContext.textContent = defaultSectionCopy.coding.context;
        interviewTitle.textContent = defaultSectionCopy.interview.title;
        interviewContext.textContent = defaultSectionCopy.interview.context;
        analysisTitle.textContent = defaultSectionCopy.analysis.title;
        analysisContext.textContent = defaultSectionCopy.analysis.context;
        analysisButton.textContent = defaultSectionCopy.analysis.button;
        return;
    }

    aptitudeTitle.textContent = `${roleName} Aptitude Path`;
    aptitudeContext.textContent = `Practice aptitude topics aligned to the ${roleName} learning path.`;
    codingTitle.textContent = `${roleName} Career Toolkit`;
    codingContext.textContent = `Use resume, cover letter, auto-apply, and coding support aligned to the ${roleName} role track.`;
    interviewTitle.textContent = `${roleName} Interview Path`;
    interviewContext.textContent = `Prepare technical and HR questions relevant to the ${roleName} role path.`;
    analysisTitle.textContent = `${roleName} Readiness Analysis`;
    analysisContext.textContent = `Enter your scores to check readiness for the ${roleName} role path.`;
    analysisButton.textContent = `Analyze ${roleName}`;
}

// â”€â”€ Glassmorphism Aptitude Topic Picker â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const aptitudeTopicData = {
    quantitative: {
        label: 'Quantitative Aptitude',
        icon: '∑',
        color: '#4f8ef7',
        topics: [
            { id: 'percentages', title: 'Percentages', sub: 'Core · High Priority', apiKey: 'percentages' },
            { id: 'profit_loss', title: 'Profit & Loss', sub: 'Core · High Priority', apiKey: 'profit_loss' },
            { id: 'ratio_proportion', title: 'Ratio & Proportion', sub: 'Core · Medium', apiKey: 'ratio_proportion' },
            { id: 'time_work', title: 'Time & Work', sub: 'Core · High Priority', apiKey: 'time_work' },
            { id: 'speed_distance', title: 'Speed & Distance', sub: 'Core · High Priority', apiKey: 'time_speed_distance' },
            { id: 'simple_compound_interest', title: 'Simple & Compound Interest', sub: 'Core · Medium', apiKey: 'simple_compound_interest' },
            { id: 'averages', title: 'Averages', sub: 'Core · Medium', apiKey: 'averages' },
            { id: 'mixtures_alligations', title: 'Mixtures & Alligations', sub: 'Advanced · Medium', apiKey: 'mixtures_alligations' },
            { id: 'permutations_combinations', title: 'Permutations & Combinations', sub: 'Advanced · High Priority', apiKey: 'permutations_combinations' },
            { id: 'probability', title: 'Probability', sub: 'Advanced · High Priority', apiKey: 'probability' },
            { id: 'number_system', title: 'Number System', sub: 'Core · Medium', apiKey: 'number_system' },
            { id: 'data_interpretation', title: 'Data Interpretation', sub: 'Applied · High Priority', apiKey: 'data_interpretation' },
            { id: 'geometry_mensuration', title: 'Geometry & Mensuration', sub: 'Applied · Low', apiKey: 'geometry_mensuration' },
        ]
    },
    logical: {
        label: 'Logical Reasoning',
        icon: '🧠',
        color: '#5DCAA5',
        topics: [
            { id: 'coding_decoding', title: 'Coding & Decoding', sub: 'Pattern · High Priority', apiKey: 'coding_decoding' },
            { id: 'blood_relations', title: 'Blood Relations', sub: 'Verbal · Medium', apiKey: 'blood_relations' },
            { id: 'syllogism', title: 'Syllogism', sub: 'Deductive · High Priority', apiKey: 'syllogism' },
            { id: 'direction_sense', title: 'Direction Sense', sub: 'Spatial · Medium', apiKey: 'direction_sense' },
            { id: 'seating_arrangement', title: 'Seating Arrangement', sub: 'Puzzle · High Priority', apiKey: 'seating_arrangement' },
            { id: 'puzzles', title: 'Puzzles', sub: 'Mixed · High Priority', apiKey: 'puzzles' },
            { id: 'pattern_recognition', title: 'Pattern Recognition', sub: 'Visual · Medium', apiKey: 'pattern_recognition' },
            { id: 'series', title: 'Series (Number & Alphabet)', sub: 'Pattern · High Priority', apiKey: 'series' },
        ]
    },
    verbal: {
        label: 'Verbal Ability',
        icon: '📖',
        color: '#f97316',
        topics: [
            { id: 'reading_comprehension', title: 'Reading Comprehension', sub: 'Core · High Priority', apiKey: 'reading_comprehension' },
            { id: 'error_detection', title: 'Error Detection', sub: 'Grammar · Medium', apiKey: 'error_detection' },
            { id: 'sentence_correction', title: 'Sentence Correction', sub: 'Grammar · Medium', apiKey: 'sentence_correction' },
            { id: 'synonyms_antonyms', title: 'Synonyms & Antonyms', sub: 'Vocabulary · High Priority', apiKey: 'synonyms_antonyms' },
            { id: 'para_jumbles', title: 'Para Jumbles', sub: 'Comprehension · Medium', apiKey: 'para_jumbles' },
            { id: 'vocabulary', title: 'Vocabulary', sub: 'Core · High Priority', apiKey: 'vocabulary' },
        ]
    }
};

const aptitudeConceptNotes = {
    percentages: {
        formula: 'Percentage = (Part / Whole) × 100',
        keyPoints: [
            'To find X% of N: (X/100) × N',
            'Percentage increase: [(New − Old) / Old] × 100',
            'Percentage decrease: [(Old − New) / Old] × 100',
            'If a value increases by X% then decreases by X%, net change = −(X²/100)%',
            'To keep expenditure same after P% price rise, reduce consumption by P/(100+P) × 100%',
        ],
        tip: 'Always identify the base (denominator) carefully — most mistakes come from using the wrong base.'
    },
    profit_loss: {
        formula: 'Profit% = (Profit / CP) × 100 | Loss% = (Loss / CP) × 100',
        keyPoints: [
            'SP = CP × (1 + Profit%/100) or CP × (1 − Loss%/100)',
            'CP = SP / (1 + Profit%/100)',
            'Marked Price with discount: SP = MP × (1 − Discount%/100)',
            'Two successive discounts d1 and d2: Net discount = d1 + d2 − (d1×d2)/100',
            'If SP of n items = CP of m items: Profit% = (m−n)/n × 100',
        ],
        tip: 'Always work with CP as the base for profit/loss percentage, not SP.'
    },
    ratio_proportion: {
        formula: 'a:b = c:d ⟹ ad = bc (cross multiplication)',
        keyPoints: [
            'To combine A:B and B:C, make B equal in both ratios',
            'Divide amount in ratio a:b:c → shares = Total × a/(a+b+c) etc.',
            'Mean proportional of a and b = √(ab)',
            'If ratio of speeds is a:b, ratio of time for same distance = b:a',
            'Compound ratio of a:b and c:d = ac:bd',
        ],
        tip: 'When combining two ratios, always equalize the common term first.'
    },
    time_work: {
        formula: '1-day work = 1/Total days | Combined rate = 1/A + 1/B',
        keyPoints: [
            'If A takes a days and B takes b days, together they finish in ab/(a+b) days',
            'Work done = Rate × Time',
            "If A is n times as efficient as B, A takes 1/n of B's time",
            'Remaining work after partial completion = 1 − work done',
            'Pipes: filling pipe adds rate, emptying pipe subtracts rate',
        ],
        tip: 'Convert everything to "work per day" fractions first, then add/subtract rates.'
    },
    speed_distance: {
        formula: 'Speed = Distance / Time | Distance = Speed × Time',
        keyPoints: [
            'Convert km/h to m/s: multiply by 5/18',
            'Average speed for equal distances = 2ab/(a+b)',
            'Train crossing a pole: distance = length of train',
            'Train crossing a platform: distance = length of train + length of platform',
            'Relative speed (same direction) = |S1 − S2|; opposite = S1 + S2',
        ],
        tip: 'Always convert units consistently before calculating — mixing km/h and m/s is the most common error.'
    },
    simple_compound_interest: {
        formula: 'SI = PRT/100 | CI = P(1 + R/100)ⁿ − P',
        keyPoints: [
            'Simple Interest grows linearly; Compound Interest grows exponentially',
            'CI − SI for 2 years = P(R/100)²',
            'Effective annual rate for CI compounded half-yearly: use R/2 and 2n',
            'Rule of 72: years to double ≈ 72/R (for CI)',
            'If money doubles in n years at SI: R = 100/n %',
        ],
        tip: 'For CI problems, always check the compounding frequency — annual, half-yearly, or quarterly changes the formula.'
    },
    averages: {
        formula: 'Average = Sum of all values / Number of values',
        keyPoints: [
            'If one value is replaced: new sum = old sum − removed + added',
            'Average of n consecutive integers starting from a = a + (n−1)/2',
            'Weighted average = (w1×v1 + w2×v2) / (w1 + w2)',
            'If average increases by x after adding a new value: new value = old average + x×(n+1)',
            'Average of first n natural numbers = (n+1)/2',
        ],
        tip: 'Work with sums, not averages, when combining groups — convert average × count to get the sum.'
    },
    mixtures_alligations: {
        formula: 'Alligation ratio = (Higher − Mean) : (Mean − Lower)',
        keyPoints: [
            'Alligation finds the ratio in which two ingredients must be mixed to get a desired mean value',
            'After removing x litres from n litres and replacing with water k times: pure liquid = n × (1 − x/n)^k',
            'Mean price must lie between the two ingredient prices',
            'Works for prices, concentrations, speeds, or any measurable quantity',
        ],
        tip: 'Draw the alligation cross: put the two values on top, the mean in the middle, and cross-subtract diagonally.'
    },
    permutations_combinations: {
        formula: 'P(n,r) = n!/(n−r)! | C(n,r) = n!/[r!(n−r)!]',
        keyPoints: [
            'Use Permutation when order matters; Combination when order does not',
            'Circular permutation of n objects = (n−1)!',
            'Number of ways to arrange n objects with p identical = n!/p!',
            'C(n,r) = C(n, n−r) — choosing r is same as rejecting n−r',
            'Total subsets of n elements = 2ⁿ',
        ],
        tip: 'Ask yourself: "Does the order of selection matter?" — Yes → Permutation, No → Combination.'
    },
    probability: {
        formula: 'P(E) = Favourable outcomes / Total outcomes',
        keyPoints: [
            'P(A or B) = P(A) + P(B) − P(A and B)',
            'P(A and B) = P(A) × P(B) for independent events',
            'P(not A) = 1 − P(A)',
            'Conditional probability: P(A|B) = P(A∩B) / P(B)',
            'For a fair die: P(any face) = 1/6; for a coin: P(H) = P(T) = 1/2',
        ],
        tip: 'Always list or count total outcomes carefully before counting favourable ones.'
    },
    number_system: {
        formula: 'LCM × HCF = Product of two numbers',
        keyPoints: [
            'Divisibility rules: 2 (last digit even), 3 (digit sum ÷3), 9 (digit sum ÷9), 11 (alternating sum)',
            'Unit digit of powers follows a cycle: find n mod cycle-length',
            'Number of factors of N = (a+1)(b+1)… where N = pᵃ × qᵇ…',
            'Sum of factors = (p^(a+1)−1)/(p−1) × (q^(b+1)−1)/(q−1) …',
            'Remainder theorem: (a×b) mod m = [(a mod m) × (b mod m)] mod m',
        ],
        tip: 'For unit digit problems, find the cycle length for that base (2→4, 3→4, 7→4, 9→2) then use remainder.'
    },
    data_interpretation: {
        formula: '% change = (New − Old)/Old × 100 | Ratio = Part/Whole',
        keyPoints: [
            'Read the chart/table title and units carefully before calculating',
            'For bar/line charts: read values precisely at the marked points',
            'Pie chart: value = (angle/360) × total or (percentage/100) × total',
            'Approximate when exact calculation is slow — eliminate wrong options first',
            'Compare ratios by cross-multiplication to avoid decimal errors',
        ],
        tip: 'In exams, approximate first to eliminate 2-3 options, then calculate precisely for the remaining ones.'
    },
    geometry_mensuration: {
        formula: 'Area of circle = πr² | Volume of cylinder = πr²h',
        keyPoints: [
            'Triangle area = ½ × base × height',
            'Rectangle: Area = l×b, Perimeter = 2(l+b)',
            'Circle: Area = πr², Circumference = 2πr',
            'Cube: Volume = a³, Surface area = 6a²',
            'Cylinder: Volume = πr²h, Curved SA = 2πrh',
        ],
        tip: 'Memorize the key formulas and always check whether the question asks for area, perimeter, or volume.'
    },
};

// ── Logical & Verbal concept notes ─────────────────────────────────────────
Object.assign(aptitudeConceptNotes, {
    coding_decoding: {
        intro: 'Coding-Decoding questions give you a rule used to encode a word or number, then ask you to apply the same rule to decode or encode another. The rule is always consistent — find the pattern first.',
        formula: 'Shift value = Encoded letter position − Original letter position',
        keyPoints: [
            'Letter shift: each letter is moved forward or backward by a fixed number (e.g. A→D means +3)',
            'Reverse coding: the word is written backwards before applying a shift',
            'Number coding: each letter is replaced by its position (A=1, B=2 … Z=26)',
            'Symbol coding: letters are replaced by symbols — find the mapping from the example',
            'Mixed coding: a combination of shift + reversal + position — decode step by step',
        ],
        workedExample: 'If CAT is coded as FDW, find the code for DOG.\nC→F (+3), A→D (+3), T→W (+3). Same rule: D→G, O→R, G→J. Answer: GRJ',
        tip: 'Always verify your rule on the given example before applying it to the question.'
    },
    blood_relations: {
        intro: 'Blood relation questions describe family relationships in words or through a conversation. You need to identify how two people are related by building a family tree.',
        formula: 'Draw a tree: boxes for people, lines for parent-child, = for couples',
        keyPoints: [
            'Father/Mother → Son/Daughter (one generation down)',
            'Brother/Sister → same generation, same parents',
            'Uncle/Aunt → parent\'s sibling',
            'Nephew/Niece → sibling\'s child',
            '"Pointing to X, Y says: X is the son of my father\'s only son" → X is Y\'s son',
        ],
        workedExample: 'A is B\'s father. C is A\'s sister. D is C\'s son. How is D related to B?\nA is B\'s father → B is A\'s child. C is A\'s sister → C is B\'s aunt. D is C\'s son → D is B\'s cousin.',
        tip: 'Always draw the family tree — never try to solve blood relation problems in your head.'
    },
    syllogism: {
        intro: 'Syllogism gives you two or more statements (premises) and asks which conclusions logically follow. Use Venn diagrams to visualise the relationship between sets.',
        formula: 'All A are B + All B are C → All A are C (valid)\nAll A are B + Some B are C → Some A are C (NOT always valid)',
        keyPoints: [
            '"All A are B" → draw A completely inside B',
            '"Some A are B" → draw A and B overlapping',
            '"No A is B" → draw A and B completely separate',
            '"Some A are not B" → part of A is outside B',
            'A conclusion is valid only if it holds in ALL possible Venn diagrams',
        ],
        workedExample: 'All cats are animals. Some animals are dogs.\nConclusion: Some cats are dogs — INVALID (cats and dogs may not overlap).\nConclusion: Some animals are cats — VALID.',
        tip: 'If a conclusion holds in some diagrams but not all, it is NOT valid. Always check the "worst case" diagram.'
    },
    direction_sense: {
        intro: 'Direction sense questions track a person\'s movement across a grid. You need to find the final position, distance from start, or direction faced.',
        formula: 'Net displacement = √(horizontal² + vertical²)  (Pythagoras for diagonal distance)',
        keyPoints: [
            'Standard compass: North is up, South is down, East is right, West is left',
            'Right turn from North → East; Left turn from North → West',
            'Track X (East-West) and Y (North-South) movements separately',
            'Final distance from start = √(net-X² + net-Y²)',
            'Shadow direction: morning sun is in the East (shadow falls West); evening sun is West (shadow falls East)',
        ],
        workedExample: 'Start facing North. Walk 5m North, turn right, walk 3m East, turn right, walk 2m South.\nNet North-South: 5−2 = 3m North. Net East-West: 3m East.\nDistance from start = √(3²+3²) = √18 = 3√2 m.',
        tip: 'Draw the path on paper — direction problems are almost impossible to solve mentally.'
    },
    seating_arrangement: {
        intro: 'Seating arrangement questions place people in a row, circle, or around a table and give clues about their relative positions. Build the arrangement step by step using the most definite clues first.',
        formula: 'Circular arrangement: n people → (n−1)! arrangements (one person fixed as reference)',
        keyPoints: [
            'Start with absolute clues ("A sits at the extreme left") before relative ones',
            'In a row: "immediate left/right" means adjacent; "second to the left" means two seats away',
            'In a circle: "to the left" means clockwise when viewed from above',
            'Use a table or diagram — never solve in your head',
            'Eliminate options as you place each person to narrow down faster',
        ],
        workedExample: '5 people A B C D E in a row. A is at one end. B is next to A. C is not next to B.\nStart: A-B-?-?-?. C cannot be 3rd. Try: A-B-D-C-E or A-B-E-C-D.',
        tip: 'Use the most restrictive clue first — it eliminates the most possibilities immediately.'
    },
    puzzles: {
        intro: 'Puzzle questions combine multiple constraints about people, objects, positions, or attributes. The key is to build a grid and fill it systematically using elimination.',
        formula: 'Grid method: rows = people/items, columns = attributes (floor, colour, job…)',
        keyPoints: [
            'List all entities and attributes before starting',
            'Mark definite assignments with ✓ and ruled-out ones with ✗',
            'Use "if-then" logic: if A is on floor 3, then B must be on floor 1 (from clue X)',
            'Work from the most specific clue to the most general',
            'Re-read all clues after each placement — new deductions often open up',
        ],
        workedExample: '3 people (A, B, C) live on floors 1, 2, 3. A is not on floor 1. B is above C.\nC can be 1 or 2. B is above C → if C=2, B=3, A=1 (but A≠1). So C=1, B=2 or 3, A=2 or 3.\nB above C and A≠1 → B=3, A=2.',
        tip: 'Never guess — every step must follow from a clue. If stuck, try assuming one option and see if it leads to a contradiction.'
    },
    pattern_recognition: {
        intro: 'Pattern recognition questions show a sequence of numbers, letters, or figures and ask you to find the next term or the missing element. Identify the rule governing the change between terms.',
        formula: 'Difference series: check 1st diff → 2nd diff → 3rd diff until constant',
        keyPoints: [
            'Arithmetic: constant difference (e.g. 3, 7, 11, 15 → +4 each time)',
            'Geometric: constant ratio (e.g. 2, 6, 18, 54 → ×3 each time)',
            'Square/Cube series: 1, 4, 9, 16 (n²) or 1, 8, 27, 64 (n³)',
            'Two interleaved series: odd-position terms follow one rule, even-position another',
            'Fibonacci-style: each term = sum of previous two',
        ],
        workedExample: 'Series: 2, 6, 12, 20, 30, ?\n1st differences: 4, 6, 8, 10, 12 → differences increase by 2.\nNext term = 30 + 12 = 42.',
        tip: 'Always check the first differences first. If not constant, check second differences. Most exam series resolve within 3 levels.'
    },
    series: {
        intro: 'Number and alphabet series questions test your ability to spot arithmetic, geometric, or mixed patterns. For alphabet series, convert letters to their positions (A=1 … Z=26) to find the numeric pattern.',
        formula: 'Letter position: A=1, B=2, … Z=26. Reverse: Z=1, Y=2, … A=26',
        keyPoints: [
            'Number series: check differences, ratios, squares, cubes, and primes',
            'Alphabet series: convert to numbers, find the pattern, convert back',
            'Mixed series: alternating +2 and ×2, or two separate interleaved sequences',
            'Wrong number: find the term that breaks the pattern',
            'Missing term: apply the rule to the position before and after the gap',
        ],
        workedExample: 'Alphabet series: B, E, H, K, ?\nPositions: 2, 5, 8, 11 → +3 each time. Next = 14 = N.',
        tip: 'For alphabet series, always write out the position numbers first — the pattern is always numeric underneath.'
    },
    reading_comprehension: {
        intro: 'Reading comprehension gives you a passage and asks questions about its content, tone, main idea, or implied meaning. Read the questions first, then scan the passage for relevant sections.',
        formula: 'Main idea = topic + what the author says about it (not just the topic alone)',
        keyPoints: [
            'Read questions before the passage to know what to look for',
            'Factual questions: the answer is directly stated — find the exact line',
            'Inference questions: the answer is implied — look for the closest logical conclusion',
            'Tone questions: identify positive/negative/neutral words used by the author',
            'Title questions: the title should cover the entire passage, not just one paragraph',
        ],
        workedExample: 'If the passage says "Despite challenges, the team delivered results on time", the tone is:\nA) Pessimistic  B) Appreciative  C) Critical  D) Neutral\nAnswer: B — "despite challenges" + "delivered" signals appreciation.',
        tip: 'Never use outside knowledge — all answers must come from the passage itself.'
    },
    error_detection: {
        intro: 'Error detection questions give you a sentence split into parts and ask you to identify the part with a grammatical error. Focus on subject-verb agreement, tense consistency, articles, prepositions, and pronoun usage.',
        formula: 'Check order: Subject-Verb agreement → Tense → Articles → Prepositions → Pronouns',
        keyPoints: [
            'Subject-verb agreement: singular subject → singular verb (He goes, not He go)',
            'Tense consistency: do not mix past and present in the same clause without reason',
            'Articles: "a" before consonant sounds, "an" before vowel sounds',
            'Prepositions: "interested in", "good at", "afraid of" — these are fixed phrases',
            'Double negatives: "I don\'t know nothing" is incorrect → "I don\'t know anything"',
        ],
        workedExample: '"He don\'t know the answer." → Error: "don\'t" should be "doesn\'t" (He is third-person singular → does not → doesn\'t).',
        tip: 'Read the sentence aloud in your head — grammatical errors often sound wrong even before you analyse them.'
    },
    sentence_correction: {
        intro: 'Sentence correction gives you a sentence with an underlined part and asks you to choose the best replacement. The correct option must be grammatically accurate, clear, and concise.',
        formula: 'Correct = Grammatically right + Concise + No redundancy + Consistent tense',
        keyPoints: [
            'Eliminate options that change the meaning of the original sentence',
            'Prefer active voice over passive voice when both are grammatically correct',
            'Avoid redundancy: "end result", "past history", "future plans" are all redundant',
            'Parallelism: items in a list must have the same grammatical form',
            'Dangling modifier: the introductory phrase must logically refer to the subject',
        ],
        workedExample: '"Having finished the report, the meeting was called." → Error: the meeting did not finish the report.\nCorrection: "Having finished the report, she called the meeting."',
        tip: 'Always check if the meaning is preserved — a grammatically correct option that changes the meaning is wrong.'
    },
    synonyms_antonyms: {
        intro: 'Synonym questions ask for a word with the same meaning; antonym questions ask for the opposite. Context matters — many words have multiple meanings, and the correct answer depends on how the word is used.',
        formula: 'Synonym = same meaning | Antonym = opposite meaning | Always check context',
        keyPoints: [
            'Eliminate options that are clearly unrelated first',
            'Watch for words that look similar but mean differently (e.g. "ingenious" vs "ingenuous")',
            'Use root words: "bene-" = good, "mal-" = bad, "mis-" = wrong, "pre-" = before',
            'Common prefixes for antonyms: un-, in-, im-, dis-, non-, anti-',
            'If unsure, use the word in a sentence and see which option fits the same context',
        ],
        workedExample: 'Synonym of BENEVOLENT:\nA) Malicious  B) Generous  C) Strict  D) Timid\n"Bene-" = good/kind → Generous. Answer: B.',
        tip: 'Learn word roots and prefixes — they let you decode unfamiliar words without memorising every word individually.'
    },
    para_jumbles: {
        intro: 'Para jumble questions give you 4–6 sentences in random order and ask you to arrange them into a coherent paragraph. Find the opening sentence first, then link sentences using pronouns, connectors, and logical flow.',
        formula: 'Opening → Context → Development → Conclusion (most paragraphs follow this flow)',
        keyPoints: [
            'The opening sentence introduces the topic — it has no pronoun referring to something before it',
            'Pronouns (he, she, it, they, this, that) must follow the noun they refer to',
            'Connectors signal order: "however", "therefore", "moreover", "for example", "finally"',
            'A sentence starting with "This" or "These" must follow the sentence that introduces that thing',
            'The concluding sentence often summarises or gives a result/consequence',
        ],
        workedExample: 'Sentences: (A) It was a huge success. (B) The team worked hard. (C) They launched the product. (D) Everyone celebrated.\nOrder: B → C → A → D (cause → action → result → reaction).',
        tip: 'Find the mandatory pair first — two sentences that must be adjacent because one refers to the other.'
    },
    vocabulary: {
        intro: 'Vocabulary questions test your knowledge of word meanings, usage, and context. They appear as fill-in-the-blank, odd-one-out, or direct meaning questions. A strong vocabulary is built through reading and root-word study.',
        formula: 'Root + Prefix + Suffix = Word meaning (e.g. "un" + "predict" + "able" = unpredictable)',
        keyPoints: [
            'Common roots: "aud" = hear, "vis" = see, "port" = carry, "dict" = say, "scrib" = write',
            'Common prefixes: "pre" = before, "post" = after, "sub" = under, "super" = above',
            'Common suffixes: "-tion"/"-sion" = noun, "-ous"/"-ful" = adjective, "-ly" = adverb',
            'Contextual clues: the sentence around the blank often hints at the meaning needed',
            'Connotation: some words are positive (diligent), negative (cunning), or neutral (said)',
        ],
        workedExample: 'Fill in: "The scientist made a _____ discovery that changed medicine."\nOptions: A) trivial  B) groundbreaking  C) ordinary  D) delayed\nContext clue: "changed medicine" → significant → B) groundbreaking.',
        tip: 'For fill-in-the-blank, read the full sentence and decide the tone (positive/negative/neutral) before looking at options.'
    },
});

let aptitudePickerState = {
    activeTab: 'quantitative',
    done: {},
    xp: 180,
    viewingTopic: null
};

function resetAptitudeView() {
    const aptitudeCategories = document.getElementById('aptitude-categories');
    const aptitudeContainer = document.getElementById('aptitude-container');
    if (aptitudeCategories) aptitudeCategories.style.display = 'none';
    if (aptitudeContainer) {
        aptitudeContainer.innerHTML = '';
        aptitudePickerState.viewingTopic = null;
        renderAptitudePicker(aptitudeContainer);
    }
}

function renderAptitudePicker(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="apt-picker-shell">
            <div class="apt-orb apt-orb-purple"></div>
            <div class="apt-orb apt-orb-teal"></div>
            <div class="apt-orb apt-orb-coral"></div>
            <div class="apt-picker-header">
                <div class="apt-picker-title-row">
                    <h2 class="apt-picker-title">Learning Hub</h2>
                    <div class="apt-picker-pills">
                        <span class="apt-stat-pill" id="apt-topics-pill">Topics: 0 / ${Object.values(aptitudeTopicData).reduce((s,t)=>s+t.topics.length,0)}</span>
                        <span class="apt-stat-pill" id="apt-xp-pill">XP: ${aptitudePickerState.xp}</span>
                    </div>
                </div>
            </div>
            <div class="apt-tabs" id="apt-tabs">
                ${Object.entries(aptitudeTopicData).map(([key, tab]) => `
                    <button type="button" class="apt-tab ${key === aptitudePickerState.activeTab ? 'active' : ''}"
                            onclick="switchAptTab('${key}')">
                        <span class="apt-tab-icon">${tab.icon}</span>
                        <span>${tab.label}</span>
                    </button>
                `).join('')}
            </div>
            <div class="apt-topic-grid" id="apt-topic-grid"></div>
            <div class="apt-footer-bar" id="apt-footer-bar">
                <div class="apt-footer-left">
                    <div class="apt-progress-track">
                        <div class="apt-progress-fill" id="apt-progress-fill"></div>
                    </div>
                    <span class="apt-progress-label" id="apt-progress-label"></span>
                </div>
                <button type="button" class="apt-practice-btn" onclick="aptPracticeSelected()">
                    Practice Selected →
                </button>
            </div>
        </div>
    `;
    renderAptTopicGrid();
    updateAptPickerStats();
}

function renderAptTopicGrid() {
    const grid = document.getElementById('apt-topic-grid');
    if (!grid) return;
    const tab = aptitudeTopicData[aptitudePickerState.activeTab];
    if (!tab) return;
    grid.innerHTML = tab.topics.map(topic => {
        const isDone = Boolean(aptitudePickerState.done[topic.id]);
        return `
            <div class="apt-topic-card ${isDone ? 'done' : ''}" id="apt-card-${topic.id}">
                <div class="apt-card-icon-wrap" style="color:${tab.color}">
                    <span class="apt-card-icon">${tab.icon}</span>
                </div>
                <button type="button" class="apt-card-check ${isDone ? 'checked' : ''}"
                        id="apt-check-${topic.id}"
                        title="Mark as done"
                        onclick="event.stopPropagation(); markAptTopicDone('${topic.id}')">
                    ${isDone ? '✓' : ''}
                </button>
                <div class="apt-card-body" onclick="openAptTopicDetail('${aptitudePickerState.activeTab}', '${topic.id}')" style="cursor:pointer;">
                    <span class="apt-card-title">${topic.title}</span>
                    <span class="apt-card-sub">${topic.sub}</span>
                    <span class="apt-card-learn-hint">Tap to learn &amp; practice →</span>
                </div>
            </div>
        `;
    }).join('');
}

function switchAptTab(key) {
    aptitudePickerState.activeTab = key;
    aptitudePickerState.viewingTopic = null;
    document.querySelectorAll('.apt-tab').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.apt-tab[onclick="switchAptTab('${key}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
    renderAptTopicGrid();
    updateAptPickerStats();
}

function markAptTopicDone(topicId) {
    const wasDone = Boolean(aptitudePickerState.done[topicId]);
    if (wasDone) {
        delete aptitudePickerState.done[topicId];
        aptitudePickerState.xp = Math.max(180, aptitudePickerState.xp - 10);
    } else {
        aptitudePickerState.done[topicId] = true;
        aptitudePickerState.xp += 10;
    }
    const card = document.getElementById(`apt-card-${topicId}`);
    const check = document.getElementById(`apt-check-${topicId}`);
    if (card) card.classList.toggle('done', !wasDone);
    if (check) {
        check.classList.toggle('checked', !wasDone);
        check.textContent = !wasDone ? '✓' : '';
    }
    updateAptPickerStats();
}

function toggleAptTopic(topicId) { markAptTopicDone(topicId); }

function updateAptPickerStats() {
    const totalTopics = Object.values(aptitudeTopicData).reduce((s, t) => s + t.topics.length, 0);
    const doneCount = Object.keys(aptitudePickerState.done).length;
    const topicsPill = document.getElementById('apt-topics-pill');
    const xpPill = document.getElementById('apt-xp-pill');
    if (topicsPill) topicsPill.textContent = `Topics: ${doneCount} / ${totalTopics}`;
    if (xpPill) xpPill.textContent = `XP: ${aptitudePickerState.xp}`;
    const tab = aptitudeTopicData[aptitudePickerState.activeTab];
    if (!tab) return;
    const tabDone = tab.topics.filter(t => aptitudePickerState.done[t.id]).length;
    const tabTotal = tab.topics.length;
    const pct = Math.round((tabDone / tabTotal) * 100);
    const fill = document.getElementById('apt-progress-fill');
    const label = document.getElementById('apt-progress-label');
    if (fill) fill.style.width = `${pct}%`;
    if (label) label.textContent = `${tab.label} — ${pct}% complete`;
}

function aptPracticeSelected() {
    const tab = aptitudeTopicData[aptitudePickerState.activeTab];
    if (!tab) return;
    const categoryMap = { quantitative: 'quantitative', logical: 'logical', verbal: 'verbal' };
    const category = categoryMap[aptitudePickerState.activeTab] || 'quantitative';
    loadAptitude(category);
}

async function openAptTopicDetail(tabKey, topicId) {
    const tab = aptitudeTopicData[tabKey];
    if (!tab) return;
    const topic = tab.topics.find(t => t.id === topicId);
    if (!topic) return;

    aptitudePickerState.viewingTopic = { tabKey, topicId };
    const container = document.getElementById('aptitude-container');
    if (!container) return;

    const notes = aptitudeConceptNotes[topicId];
    const isDone = Boolean(aptitudePickerState.done[topicId]);

    container.innerHTML = `
        <div class="apt-topic-page">

            <!-- Back bar -->
            <div class="apt-topbar">
                <button class="back-btn" type="button" onclick="backToAptPicker()">&#8592; Back to Topics</button>
                <button type="button" class="apt-done-toggle ${isDone ? 'done' : ''}" id="apt-done-toggle-btn"
                    onclick="markAptTopicDone('${topicId}'); const b=document.getElementById('apt-done-toggle-btn'); b.classList.toggle('done'); b.textContent = b.classList.contains('done') ? '&#10003; Marked Done' : 'Mark as Done'">
                    ${isDone ? '&#10003; Marked Done' : 'Mark as Done'}
                </button>
            </div>

            <!-- Hero -->
            <div class="apt-topic-hero-bar" style="border-left: 4px solid ${tab.color}">
                <div class="apt-hero-icon" style="background: ${tab.color}22; color: ${tab.color}">${tab.icon}</div>
                <div>
                    <p class="apt-hero-eyebrow" style="color:${tab.color}">${tab.label} &nbsp;&#183;&nbsp; ${topic.sub}</p>
                    <h2 class="apt-hero-title">${topic.title}</h2>
                </div>
            </div>

            ${notes ? `
            <!-- ===== SECTION 1: LEARN ===== -->
            <div class="apt-section-divider">
                <span class="apt-section-badge" style="background:${tab.color}22; color:${tab.color}; border-color:${tab.color}44">01 &nbsp; Learn</span>
                <div class="apt-divider-line"></div>
            </div>

            <!-- Intro -->
            <div class="apt-intro-card">
                <p>${notes.intro}</p>
            </div>

            <!-- Formula -->
            <div class="apt-formula-card">
                <div class="apt-card-label">&#128208; Key Formula</div>
                <div class="apt-formula-text">${notes.formula}</div>
            </div>

            <!-- Key Points -->
            <div class="apt-keypoints-card">
                <div class="apt-card-label">&#128204; Key Points</div>
                <ol class="apt-keypoints-list">
                    ${notes.keyPoints.map(p => `<li>${p}</li>`).join('')}
                </ol>
            </div>

            <!-- Worked Example -->
            ${notes.workedExample ? `
            <div class="apt-example-card">
                <div class="apt-card-label">&#9999;&#65039; Worked Example</div>
                <pre class="apt-example-pre">${notes.workedExample}</pre>
            </div>` : ''}

            <!-- Tip -->
            <div class="apt-tip-card">
                &#128161; <strong>Exam Tip:</strong> ${notes.tip}
            </div>

            <!-- ===== SECTION 2: PRACTICE ===== -->
            <div class="apt-section-divider" style="margin-top:2rem;">
                <span class="apt-section-badge" style="background:${tab.color}22; color:${tab.color}; border-color:${tab.color}44">02 &nbsp; Practice</span>
                <div class="apt-divider-line"></div>
            </div>
            ` : ''}

            <!-- Practice panel -->
            <div class="apt-practice-box">
                <div class="apt-practice-box-header">
                    <div>
                        <h4 class="apt-practice-title">${topic.title} &mdash; Practice Questions</h4>
                        <p class="apt-practice-sub">10 questions per level. Click an option to instantly check your answer and see the explanation.</p>
                    </div>
                </div>

                <!-- Difficulty selector -->
                <div class="apt-diff-row" id="apt-diff-row-${topic.apiKey}">
                    <button class="apt-diff-pill easy active" id="apt-diff-easy-${topic.apiKey}"
                            onclick="selectAptDifficulty('${topic.apiKey}', 'Easy')">&#128994; Easy</button>
                    <button class="apt-diff-pill medium" id="apt-diff-medium-${topic.apiKey}"
                            onclick="selectAptDifficulty('${topic.apiKey}', 'Medium')">&#128993; Medium</button>
                    <button class="apt-diff-pill hard" id="apt-diff-hard-${topic.apiKey}"
                            onclick="selectAptDifficulty('${topic.apiKey}', 'Hard')">&#128308; Hard</button>
                </div>

                <!-- Questions render here -->
                <div id="apt-qbox-${topic.apiKey}" class="apt-qbox">
                    <div class="apt-qbox-placeholder">
                        <p>&#9654; Click a difficulty level above to load questions</p>
                    </div>
                </div>
            </div>

        </div>
    `;

    // Auto-load Easy questions
    loadAptDifficultyQuestions('${topic.apiKey}', 'Easy');
}

function selectAptDifficulty(apiKey, level) {
    ['Easy','Medium','Hard'].forEach(l => {
        const btn = document.getElementById(`apt-diff-${l.toLowerCase()}-${apiKey}`);
        if (btn) btn.classList.toggle('active', l === level);
    });
    loadAptDifficultyQuestions(apiKey, level);
}

async function loadAptDifficultyQuestions(apiKey, level) {
    const box = document.getElementById(`apt-qbox-${apiKey}`);
    if (!box) return;
    box.innerHTML = '<p class="apt-loading">Loading questions&#8230;</p>';

    try {
        const res = await fetch(`${API_BASE}/tcs/aptitude/${apiKey}?difficulty=${level.toLowerCase()}`);
        if (!res.ok) throw new Error('not found');
        const data = await res.json();
        const questions = Array.isArray(data) ? data : (data[level.toLowerCase()] || []);

        if (!questions.length) {
            box.innerHTML = '<p class="apt-loading">No questions available for this level yet.</p>';
            return;
        }

        box.innerHTML = `
            <div class="apt-questions-list">
                ${questions.map((q, idx) => `
                    <div class="apt-q-item" id="apt-qi-${apiKey}-${level.toLowerCase()}-${idx}">
                        <div class="apt-q-num">Q${idx + 1}</div>
                        <p class="apt-q-text">${escapeHtml(String(q.question))}</p>
                        <div class="apt-q-options">
                            ${(q.options || []).map(opt => `
                                <button class="apt-q-opt"
                                    onclick="checkAptQ('${apiKey}','${level.toLowerCase()}',${idx},this,'${escapeJsString(String(opt))}','${escapeJsString(String(q.answer))}','${escapeJsString(String(q.explanation || ''))}')">
                                    ${escapeHtml(String(opt))}
                                </button>
                            `).join('')}
                        </div>
                        <div class="apt-q-result" id="apt-qr-${apiKey}-${level.toLowerCase()}-${idx}" style="display:none;"></div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (e) {
        box.innerHTML = '<p class="apt-loading">Could not load questions. Make sure the backend is running.</p>';
    }
}

function checkAptQ(apiKey, level, idx, clickedBtn, selected, correct, explanation) {
    const resultDiv = document.getElementById(`apt-qr-${apiKey}-${level}-${idx}`);
    const card = document.getElementById(`apt-qi-${apiKey}-${level}-${idx}`);
    if (!resultDiv || !card) return;

    const isCorrect = selected === correct;
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = isCorrect
        ? `<span class="apt-ans-correct">&#10003; Correct!</span>`
        : `<span class="apt-ans-wrong">&#10007; Wrong &mdash; Answer: <strong>${escapeHtml(correct)}</strong></span>
           ${explanation ? `<p class="apt-ans-explanation">${escapeHtml(explanation)}</p>` : ''}`;

    card.querySelectorAll('.apt-q-opt').forEach(btn => {
        const t = btn.textContent.trim();
        if (t === correct) btn.classList.add('apt-opt-correct');
        else if (t === selected && !isCorrect) btn.classList.add('apt-opt-wrong');
        btn.disabled = true;
    });
}

// Legacy aliases kept so nothing else breaks
function renderAptSubtopicDetail() {}
function updateAptSubtopic() {}
function renderAptPracticeButtons() { return ''; }
function focusAptPractice() {}
async function loadAptTopicPractice() {}
function buildAptPracticeMarkup() { return ''; }
async function loadTopicQuestions() {}

function backToAptPicker() {
    aptitudePickerState.viewingTopic = null;
    const container = document.getElementById('aptitude-container');
    if (container) {
        container.innerHTML = '';
        renderAptitudePicker(container);
    }
}


async function loadTopicQuestions(apiKey, difficulty) {
    // Legacy alias — redirects to new practice system
    loadAptTopicPractice(apiKey, difficulty.charAt(0).toUpperCase() + difficulty.slice(1));
}



function showHomeAptitudeWithTcs() {
    currentCompany = null;
    currentRole = null;
    updateSectionContext();
    resetAptitudeView();
}

function setActiveNavLink(section) {
    const navLinks = document.querySelectorAll('.skillhive-links a');
    navLinks.forEach(link => {
        const targetSection = link.getAttribute('data-section');
        const isActive = targetSection === section;
        link.classList.toggle('active', isActive);
    });
}

// Show section based on navigation
function showSection(section) {
    console.log('showSection called with:', section);
    
    // Hide all sections first
    document.getElementById('home').style.display = 'none';
    document.getElementById('learning-hub').style.display = 'none';
    document.getElementById('company-info').style.display = 'none';
    document.getElementById('aptitude').style.display = 'none';
    document.getElementById('mnc').style.display = 'none';
    document.getElementById('mocktest').style.display = 'none';
    document.getElementById('coding').style.display = 'none';
    document.getElementById('interview').style.display = 'none';
    document.getElementById('analysis').style.display = 'none';
    document.getElementById('profile').style.display = 'none';
    const handsOnItEl = document.getElementById('hands-on-it');
    if (handsOnItEl) handsOnItEl.style.display = 'none';
    const systemDesignEl = document.getElementById('system-design');
    if (systemDesignEl) systemDesignEl.style.display = 'none';
    
    // Show the requested section
    const sectionEl = document.getElementById(section);
    if (sectionEl) {
        sectionEl.style.display = 'block';
        console.log('Showing section:', section);
    } else {
        console.log('Section not found:', section);
    }
    
    setActiveNavLink(section);
    updateSectionContext();

    if (section === 'aptitude') {
        resetAptitudeView();
    } else if (section === 'mnc') {
        renderCompanyExplorer();
    } else if (section === 'mocktest') {
        console.log('Mocktest section shown');
    } else if (section === 'coding') {
        loadCodingQuestions();
    } else if (section === 'interview') {
        resetInterviewSession();
        loadInterview('technical');
    } else if (section === 'analysis') {
        const result = document.getElementById('analysis-result');
        if (result) {
            result.innerHTML = '';
        }
    } else if (section === 'profile') {
        renderUserProfileAnalytics();
    } else if (section === 'hands-on-it') {
        renderHandsOnIT();
    } else if (section === 'system-design') {
        renderSystemDesign();
    }
}

function showCodingModule() {
    // Show the coding section and go straight to the coding concepts (languages),
    // bypassing the Career Tools default that loadCodingQuestions() forces.
    const sections = ['home', 'learning-hub', 'company-info', 'aptitude', 'mnc',
        'mocktest', 'coding', 'interview', 'analysis', 'profile', 'hands-on-it', 'system-design'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    const codingEl = document.getElementById('coding');
    if (codingEl) codingEl.style.display = 'block';
    setActiveNavLink('coding');
    updateSectionContext();
    loadCodingLanguages();
}

const companyRoadmaps = {
    tcs: {
        name: 'Tata Consultancy Services (TCS)',
        tagline: 'A preparation roadmap for users who want to crack TCS with a clear list of what to cover.',
        overview: [
            'Follow the TCS path in the same order most students prepare: aptitude, programming, core CS, coding practice, and interview concepts.',
            'The goal is not to study everything at once. The goal is to cover the right topics with enough repetition to become confident.'
        ],
        flowchart: {
            stepLabel: 'Interview Flow',
            title: 'TCS Interview Process Flowchart',
            description: 'Use this as the high-level order for preparation: online test first, then technical and HR rounds, with some drives combining technical and HR into a single interview.',
            image: {
                src: 'assets/tcs-interview-process-flowchart.png',
                alt: 'TCS interview process flowchart showing online test, technical interview, HR interview, and final selection, with some drives combining technical and HR.',
                caption: 'Visual path for cracking the TCS interview process.'
            }
        },
        sections: [
            {
                title: 'Common Aptitude Topics You Must Cover',
                description: 'These are the main common aptitude areas a TCS-focused learner should complete before moving into mock tests.',
                groups: [
                    {
                        title: 'Quantitative Aptitude',
                        intro: 'Focus on these important topics:',
                        items: [
                            'Percentages',
                            'Profit and Loss',
                            'Ratio and Proportion',
                            'Time and Work',
                            'Time, Speed and Distance',
                            'Simple and Compound Interest',
                            'Averages',
                            'Mixtures and Alligations',
                            'Permutations and Combinations',
                            'Probability',
                            'Number System',
                            'Data Interpretation',
                            'Geometry and Mensuration'
                        ],
                        note: 'Practice from IndiaBIX and PrepInsta.'
                    },
                    {
                        title: 'Logical Reasoning',
                        intro: 'Important topics:',
                        items: [
                            'Coding and Decoding',
                            'Blood Relations',
                            'Syllogism',
                            'Direction Sense',
                            'Seating Arrangement',
                            'Puzzles',
                            'Pattern Recognition',
                            'Series (Number and Alphabet)'
                        ]
                    },
                    {
                        title: 'Verbal Ability',
                        items: [
                            'Reading Comprehension',
                            'Error Detection',
                            'Sentence Correction',
                            'Synonyms and Antonyms',
                            'Para Jumbles',
                            'Vocabulary'
                        ]
                    }
                ]
            },
            {
                title: 'Programming Languages You Should Cover',
                description: 'Users do not need to master every language, but they should be strong in at least one.',
                groups: [
                    {
                        title: 'Recommended Languages',
                        items: ['C', 'C++', 'Java', 'Python'],
                        note: 'Most students choose C, Java, or Python.'
                    },
                    {
                        title: 'Programming Topics',
                        items: [
                            'Basic syntax',
                            'Loops',
                            'Conditional statements',
                            'Functions',
                            'Arrays',
                            'Strings',
                            'Recursion',
                            'Sorting (Bubble, Selection, Insertion)',
                            'Searching (Linear, Binary)',
                            'Basic Data Structures'
                        ]
                    }
                ]
            },
            {
                title: 'Core Computer Science Concepts',
                description: 'Even if the user is not from a CS background, these basics should be covered clearly.',
                groups: [
                    {
                        title: 'Data Structures',
                        items: ['Arrays', 'Linked List', 'Stack', 'Queue', 'Trees', 'Hashing']
                    },
                    {
                        title: 'DBMS',
                        items: ['What is DBMS', 'Normalization', 'Primary key and Foreign key', 'SQL basics', 'Joins']
                    },
                    {
                        title: 'Operating System',
                        items: ['Process vs Thread', 'Deadlock', 'Scheduling', 'Virtual Memory']
                    },
                    {
                        title: 'Computer Networks',
                        items: ['OSI Model', 'TCP vs UDP', 'HTTP and HTTPS', 'IP Address']
                    }
                ]
            },
            {
                title: 'Coding Questions Asked in TCS',
                description: 'These are common beginner-to-intermediate problem types that users should solve repeatedly.',
                groups: [
                    {
                        title: 'Common Coding Problems',
                        items: [
                            'Reverse a string',
                            'Fibonacci series',
                            'Prime number',
                            'Palindrome',
                            'Factorial',
                            'Armstrong number',
                            'Sorting numbers',
                            'Remove duplicates from array',
                            'Pattern printing'
                        ],
                        note: 'Practice from HackerRank, LeetCode, and GeeksforGeeks.'
                    }
                ]
            },
            {
                title: 'Technical Interview Questions to Prepare',
                description: 'Along with coding, the user should be ready to explain these core interview concepts confidently.',
                groups: [
                    {
                        title: 'Common Technical Questions',
                        items: [
                            'Tell me about yourself',
                            'Explain OOPS concepts',
                            'Difference between C and Java',
                            'What is a pointer?',
                            'What is a database?',
                            'What is a deadlock?'
                        ]
                    }
                ]
            }
        ]
    },
    infosys: {
        name: 'Infosys',
        tagline: 'A preparation roadmap for users who want to crack Infosys with a clear list of what to cover.',
        overview: [
            'Follow the Infosys path in the same order most students prepare: aptitude, programming, core CS concepts, coding practice, and interview preparation.',
            'The goal is not to study everything at once, but to cover the right topics and practice them repeatedly until you are confident.'
        ],
        flowchart: {
            stepLabel: 'Interview Flow',
            title: 'Infosys Interview Process Flowchart',
            description: 'Use this as the high-level preparation order. Some Infosys drives combine technical and HR into one interview round.',
            steps: ['Online Assessment', 'Technical Interview', 'HR Interview', 'Final Selection'],
            caption: 'This is the visual path for cracking the Infosys interview process.'
        },
        sections: [
            {
                title: 'Aptitude Topics You Must Cover',
                description: 'These are the main aptitude areas an Infosys-focused learner should complete before taking mock tests.',
                groups: [
                    {
                        title: 'Quantitative Aptitude',
                        intro: 'Focus on these important topics:',
                        items: [
                            'Percentages',
                            'Profit and Loss',
                            'Ratio and Proportion',
                            'Time and Work',
                            'Time, Speed and Distance',
                            'Simple and Compound Interest',
                            'Averages',
                            'Mixtures and Alligations',
                            'Permutations and Combinations',
                            'Probability',
                            'Number System',
                            'Data Interpretation'
                        ],
                        note: 'Practice from IndiaBIX and PrepInsta.'
                    },
                    {
                        title: 'Logical Reasoning',
                        intro: 'Important topics:',
                        items: [
                            'Coding and Decoding',
                            'Blood Relations',
                            'Syllogism',
                            'Direction Sense',
                            'Seating Arrangement',
                            'Puzzles',
                            'Pattern Recognition',
                            'Number Series',
                            'Alphabet Series'
                        ]
                    },
                    {
                        title: 'Verbal Ability',
                        intro: 'Topics to cover:',
                        items: [
                            'Reading Comprehension',
                            'Error Detection',
                            'Sentence Correction',
                            'Synonyms and Antonyms',
                            'Para Jumbles',
                            'Vocabulary'
                        ]
                    }
                ]
            },
            {
                title: 'Programming Languages You Should Cover',
                description: 'You do not need to master many languages, but you must be strong in at least one programming language.',
                groups: [
                    {
                        title: 'Recommended Languages',
                        items: ['C', 'C++', 'Java', 'Python'],
                        note: 'Most students preparing for Infosys choose C, Java, or Python.'
                    },
                    {
                        title: 'Programming Topics',
                        items: [
                            'Basic syntax',
                            'Conditional statements',
                            'Loops',
                            'Functions',
                            'Arrays',
                            'Strings',
                            'Recursion'
                        ]
                    },
                    {
                        title: 'Algorithms and Searching',
                        items: [
                            'Bubble Sort',
                            'Selection Sort',
                            'Insertion Sort',
                            'Linear Search',
                            'Binary Search'
                        ]
                    }
                ]
            },
            {
                title: 'Core Computer Science Concepts',
                description: 'Even if the learner is not from a CS background, these fundamental subjects should be covered.',
                groups: [
                    {
                        title: 'Data Structures',
                        items: ['Arrays', 'Linked List', 'Stack', 'Queue', 'Trees', 'Hashing']
                    },
                    {
                        title: 'Database Management Systems',
                        items: ['What is DBMS', 'Normalization', 'Primary Key and Foreign Key', 'SQL basics', 'Joins']
                    },
                    {
                        title: 'Operating Systems',
                        items: ['Process vs Thread', 'Deadlock', 'CPU Scheduling', 'Virtual Memory']
                    },
                    {
                        title: 'Computer Networks',
                        items: ['OSI Model', 'TCP vs UDP', 'HTTP vs HTTPS', 'IP Address']
                    }
                ]
            },
            {
                title: 'Coding Questions Asked in Infosys',
                description: 'These are common beginner-to-intermediate problems that should be practiced repeatedly.',
                groups: [
                    {
                        title: 'Common Coding Problems',
                        items: [
                            'Reverse a string',
                            'Fibonacci series',
                            'Prime number',
                            'Palindrome',
                            'Factorial',
                            'Armstrong number',
                            'Sorting numbers',
                            'Remove duplicates from an array',
                            'Pattern printing'
                        ],
                        note: 'Practice coding from HackerRank, LeetCode, and GeeksforGeeks.'
                    }
                ]
            },
            {
                title: 'Technical Interview Questions to Prepare',
                description: 'Along with coding, you must be able to explain these concepts clearly in the interview.',
                groups: [
                    {
                        title: 'Common Technical Questions',
                        items: [
                            'Tell me about yourself',
                            'Explain Object-Oriented Programming concepts',
                            'Difference between C and Java',
                            'What is a pointer?',
                            'What is a database?',
                            'What is a deadlock?',
                            'Explain your final year project'
                        ]
                    }
                ]
            }
        ]
    },
    wipro: {
        name: 'Wipro',
        tagline: 'A preparation roadmap for students preparing for the current Wipro hiring process, especially Elite NTH and campus drives.',
        overview: [
            'Follow the preparation order that matches the actual recruitment process: aptitude, programming, core CS, coding practice, communication, and interview preparation.',
            'The goal is not to study everything at once, but to cover the most important topics and practice them consistently.'
        ],
        flowchart: {
            stepLabel: 'Wipro Current Hiring Process',
            title: 'Wipro Current Hiring Process',
            description: 'Some drives combine technical and HR interviews into a single round.',
            steps: ['Online Assessment', 'Technical Interview', 'HR Interview', 'Final Selection']
        },
        sections: [
            {
                title: 'Online Assessment Preparation',
                description: 'The online test contains multiple sections, so preparation should cover all of them together.',
                groups: [
                    {
                        title: 'Sections',
                        items: [
                            'Quantitative Aptitude',
                            'Logical Reasoning',
                            'Verbal Ability',
                            'Coding Test (2 problems)',
                            'Essay Writing (Written Communication Test)'
                        ]
                    }
                ]
            },
            {
                title: 'Aptitude Topics You Must Cover',
                description: 'These are the main aptitude areas a Wipro-focused learner should complete before taking mock tests.',
                groups: [
                    {
                        title: 'Quantitative Aptitude',
                        intro: 'Important topics:',
                        items: [
                            'Percentages',
                            'Profit and Loss',
                            'Ratio and Proportion',
                            'Time and Work',
                            'Time, Speed and Distance',
                            'Simple and Compound Interest',
                            'Averages',
                            'Mixtures and Alligations',
                            'Permutations and Combinations',
                            'Probability',
                            'Number System',
                            'Data Interpretation'
                        ],
                        note: 'Practice from IndiaBIX and PrepInsta.'
                    },
                    {
                        title: 'Logical Reasoning',
                        intro: 'Topics to prepare:',
                        items: [
                            'Coding and Decoding',
                            'Blood Relations',
                            'Syllogism',
                            'Direction Sense',
                            'Seating Arrangement',
                            'Logical Puzzles',
                            'Pattern Recognition',
                            'Number Series',
                            'Alphabet Series'
                        ]
                    },
                    {
                        title: 'Verbal Ability',
                        intro: 'Topics:',
                        items: [
                            'Reading Comprehension',
                            'Sentence Correction',
                            'Error Detection',
                            'Synonyms and Antonyms',
                            'Para Jumbles',
                            'Vocabulary'
                        ]
                    }
                ]
            },
            {
                title: 'Programming Language Preparation',
                description: 'You should be strong in at least one programming language.',
                groups: [
                    {
                        title: 'Recommended Languages',
                        items: ['C', 'Java', 'Python']
                    },
                    {
                        title: 'Programming Topics',
                        items: [
                            'Basic syntax',
                            'Conditional statements (if-else)',
                            'Loops (for, while)',
                            'Functions',
                            'Arrays',
                            'Strings',
                            'Recursion'
                        ]
                    },
                    {
                        title: 'Algorithms and Searching',
                        items: [
                            'Bubble Sort',
                            'Selection Sort',
                            'Insertion Sort',
                            'Linear Search',
                            'Binary Search'
                        ]
                    }
                ]
            },
            {
                title: 'Core Computer Science Concepts',
                description: 'These are frequently asked during the technical interview.',
                groups: [
                    {
                        title: 'Data Structures',
                        items: ['Arrays', 'Linked List', 'Stack', 'Queue', 'Trees', 'Hashing']
                    },
                    {
                        title: 'Database Management Systems',
                        items: ['What is DBMS', 'Normalization', 'Primary Key and Foreign Key', 'SQL basics', 'Joins']
                    },
                    {
                        title: 'Operating Systems',
                        items: ['Process vs Thread', 'Deadlock', 'CPU Scheduling', 'Virtual Memory']
                    },
                    {
                        title: 'Computer Networks',
                        items: ['OSI Model', 'TCP vs UDP', 'HTTP vs HTTPS', 'IP Address']
                    }
                ]
            },
            {
                title: 'Coding Questions Asked in Wipro',
                description: 'These are common beginner-to-intermediate problems that should be practiced repeatedly.',
                groups: [
                    {
                        title: 'Common Coding Problems',
                        items: [
                            'Reverse a string',
                            'Fibonacci series',
                            'Prime number',
                            'Palindrome',
                            'Factorial',
                            'Armstrong number',
                            'Sorting numbers',
                            'Remove duplicates from an array',
                            'Pattern printing'
                        ],
                        note: 'Practice coding from HackerRank, LeetCode, and GeeksforGeeks.'
                    }
                ]
            },
            {
                title: 'Written Communication Test (Essay Writing)',
                description: 'Wipro online test includes essay writing, so written communication needs separate practice.',
                groups: [
                    {
                        title: 'Possible Topics',
                        items: [
                            'Impact of Artificial Intelligence',
                            'Technology in Education',
                            'Social Media Advantages and Disadvantages',
                            'Future of Digital India'
                        ],
                        note: 'Practice writing 150-200 words clearly and with correct grammar.'
                    }
                ]
            },
            {
                title: 'Technical Interview Preparation',
                description: 'These are common technical questions Wipro candidates should be ready to explain clearly.',
                groups: [
                    {
                        title: 'Common Technical Questions',
                        items: [
                            'Tell me about yourself',
                            'Explain Object-Oriented Programming concepts',
                            'What is a pointer?',
                            'Difference between C and Java',
                            'What is DBMS?',
                            'What is deadlock?',
                            'Explain your final year project'
                        ]
                    }
                ]
            },
            {
                title: 'HR Interview Preparation',
                description: 'Prepare direct and confident answers for the common HR questions asked in Wipro interviews.',
                groups: [
                    {
                        title: 'Common HR Questions',
                        items: [
                            'Why do you want to join Wipro?',
                            'What are your strengths and weaknesses?',
                            'Are you willing to relocate?',
                            'Where do you see yourself in 5 years?',
                            'Why should we hire you?'
                        ]
                    }
                ]
            }
        ]
    },
    accenture: {
        name: 'Accenture',
        tagline: 'A preparation roadmap for users who want to crack Accenture with a clear list of what to cover.',
        overview: [
            'Follow the Accenture preparation path in the same order most students prepare: aptitude, technical fundamentals, programming, coding practice, communication, and interview preparation.',
            'The goal is not to study everything at once, but to cover the right topics and practice them repeatedly until you gain confidence.'
        ],
        flowchart: {
            stepLabel: 'Interview Flow',
            title: 'Accenture Interview Process Flowchart',
            description: 'Use this as the high-level preparation order. In many drives, technical and HR interviews are combined into a single round.',
            steps: ['Cognitive & Technical Assessment', 'Coding Assessment', 'Communication Assessment', 'Technical + HR Interview', 'Final Selection']
        },
        sections: [
            {
                title: 'Cognitive Assessment Topics You Must Cover',
                description: 'These are the main aptitude areas an Accenture-focused learner should complete before moving into mock tests.',
                groups: [
                    {
                        title: 'Quantitative Aptitude',
                        intro: 'Focus on these important topics:',
                        items: [
                            'Percentages',
                            'Profit and Loss',
                            'Ratio and Proportion',
                            'Time and Work',
                            'Time, Speed and Distance',
                            'Simple and Compound Interest',
                            'Averages',
                            'Number System',
                            'Data Interpretation'
                        ],
                        note: 'Practice from IndiaBIX and PrepInsta.'
                    },
                    {
                        title: 'Logical Reasoning',
                        intro: 'Important topics:',
                        items: [
                            'Coding and Decoding',
                            'Blood Relations',
                            'Syllogism',
                            'Direction Sense',
                            'Seating Arrangement',
                            'Logical Puzzles',
                            'Pattern Recognition',
                            'Number Series'
                        ]
                    },
                    {
                        title: 'Verbal Ability',
                        intro: 'Topics to cover:',
                        items: [
                            'Reading Comprehension',
                            'Sentence Correction',
                            'Error Detection',
                            'Synonyms and Antonyms',
                            'Vocabulary'
                        ]
                    }
                ]
            },
            {
                title: 'Technical Assessment Topics',
                description: 'Accenture includes technical MCQs in the online assessment.',
                groups: [
                    {
                        title: 'Pseudocode',
                        intro: 'Topics:',
                        items: [
                            'Conditional statements',
                            'Loops',
                            'Basic algorithms',
                            'Output prediction'
                        ]
                    },
                    {
                        title: 'Application and MS Office',
                        intro: 'Topics:',
                        items: [
                            'MS Excel basics',
                            'MS Word basics',
                            'MS PowerPoint basics',
                            'Basic computer operations'
                        ]
                    },
                    {
                        title: 'Networking and Cloud Basics',
                        intro: 'Topics:',
                        items: [
                            'Basics of networking',
                            'Cloud computing concepts',
                            'Cybersecurity fundamentals'
                        ]
                    }
                ]
            },
            {
                title: 'Programming Languages You Should Cover',
                description: 'Users do not need to master every language, but they should be strong in at least one programming language.',
                groups: [
                    {
                        title: 'Recommended Languages',
                        items: ['C', 'C++', 'Java', 'Python'],
                        note: 'Most students choose C, Java, or Python.'
                    },
                    {
                        title: 'Programming Topics',
                        items: [
                            'Basic syntax',
                            'Conditional statements',
                            'Loops',
                            'Functions',
                            'Arrays',
                            'Strings',
                            'Recursion'
                        ]
                    },
                    {
                        title: 'Algorithms and Searching',
                        items: [
                            'Bubble Sort',
                            'Selection Sort',
                            'Insertion Sort',
                            'Linear Search',
                            'Binary Search'
                        ]
                    }
                ]
            },
            {
                title: 'Core Computer Science Concepts',
                description: 'Even if the user is not from a CS background, these basics should be covered clearly.',
                groups: [
                    {
                        title: 'Data Structures',
                        items: ['Arrays', 'Linked List', 'Stack', 'Queue', 'Trees']
                    },
                    {
                        title: 'Database Management Systems',
                        items: ['What is DBMS', 'Normalization', 'Primary key and Foreign key', 'SQL basics', 'Joins']
                    },
                    {
                        title: 'Operating Systems',
                        items: ['Process vs Thread', 'Deadlock', 'Scheduling']
                    },
                    {
                        title: 'Computer Networks',
                        items: ['OSI Model', 'TCP vs UDP', 'HTTP vs HTTPS', 'IP Address']
                    }
                ]
            },
            {
                title: 'Coding Questions Asked in Accenture',
                description: 'These are common beginner-to-intermediate problems that users should solve repeatedly.',
                groups: [
                    {
                        title: 'Common Coding Problems',
                        items: [
                            'Reverse a string',
                            'Fibonacci series',
                            'Prime number',
                            'Palindrome',
                            'Factorial',
                            'Sorting numbers',
                            'Remove duplicates from array',
                            'Pattern printing'
                        ],
                        note: 'Practice from HackerRank, LeetCode, and GeeksforGeeks.'
                    }
                ]
            },
            {
                title: 'Communication Assessment',
                description: 'Accenture includes a communication test, so speaking and listening practice should be part of preparation.',
                groups: [
                    {
                        title: 'Topics Evaluated',
                        items: [
                            'Vocabulary',
                            'Sentence construction',
                            'Listening ability',
                            'Pronunciation',
                            'Fluency in speaking'
                        ],
                        note: 'Practice speaking clearly and answering short spoken questions.'
                    }
                ]
            },
            {
                title: 'Technical Interview Questions to Prepare',
                description: 'Along with coding, the user should be ready to explain these core interview concepts confidently.',
                groups: [
                    {
                        title: 'Common Technical Questions',
                        items: [
                            'Tell me about yourself',
                            'Explain Object-Oriented Programming concepts',
                            'Difference between C and Java',
                            'What is a pointer?',
                            'What is a database?',
                            'Explain your final year project'
                        ]
                    }
                ]
            }
        ]
    },
    cognizant: {
        name: 'Cognizant',
        tagline: 'A preparation roadmap for users who want to crack Cognizant with a clear list of what to cover.',
        overview: [
            'Use this as the high-level preparation order: aptitude, programming, core CS concepts, coding practice, and interview preparation.',
            'The goal is not to study everything at once, but to cover the right topics and practice them repeatedly until you build confidence.'
        ],
        flowchart: {
            stepLabel: 'Interview Flow',
            title: 'Cognizant Interview Process Flowchart',
            description: 'Use this as the high-level order for preparation. For some roles like GenC and GenC Next, technical and HR rounds may be combined into a single interview.',
            steps: ['Online Assessment', 'Technical Interview', 'HR Interview', 'Final Selection'],
            caption: 'Use this as the high-level order for Cognizant preparation.'
        },
        sections: [
            {
                title: 'Aptitude Topics You Must Cover',
                description: 'These are the main aptitude areas a Cognizant-focused learner should complete before moving into mock tests.',
                groups: [
                    {
                        title: 'Quantitative Aptitude',
                        intro: 'Focus on these important topics:',
                        items: [
                            'Percentages',
                            'Profit and Loss',
                            'Ratio and Proportion',
                            'Time and Work',
                            'Time, Speed and Distance',
                            'Simple and Compound Interest',
                            'Averages',
                            'Number System',
                            'Permutations and Combinations',
                            'Probability',
                            'Data Interpretation'
                        ],
                        note: 'Practice from IndiaBIX and PrepInsta.'
                    },
                    {
                        title: 'Logical Reasoning',
                        intro: 'Important topics:',
                        items: [
                            'Coding and Decoding',
                            'Blood Relations',
                            'Syllogism',
                            'Direction Sense',
                            'Seating Arrangement',
                            'Logical Puzzles',
                            'Pattern Recognition',
                            'Number Series',
                            'Alphabet Series'
                        ]
                    },
                    {
                        title: 'Verbal Ability',
                        intro: 'Topics to cover:',
                        items: [
                            'Reading Comprehension',
                            'Sentence Correction',
                            'Error Detection',
                            'Synonyms and Antonyms',
                            'Vocabulary',
                            'Para Jumbles'
                        ]
                    }
                ]
            },
            {
                title: 'Programming Languages You Should Cover',
                description: 'Users do not need to master every language, but they should be strong in at least one programming language.',
                groups: [
                    {
                        title: 'Recommended Languages',
                        items: ['C', 'C++', 'Java', 'Python'],
                        note: 'Most students preparing for Cognizant prefer C, Java, or Python.'
                    },
                    {
                        title: 'Programming Topics',
                        items: [
                            'Basic syntax',
                            'Conditional statements',
                            'Loops',
                            'Functions',
                            'Arrays',
                            'Strings',
                            'Recursion'
                        ]
                    },
                    {
                        title: 'Algorithms and Searching',
                        items: [
                            'Bubble Sort',
                            'Selection Sort',
                            'Insertion Sort',
                            'Linear Search',
                            'Binary Search'
                        ]
                    }
                ]
            },
            {
                title: 'Core Computer Science Concepts',
                description: 'Even if the user is not from a CS background, these basics should be covered clearly.',
                groups: [
                    {
                        title: 'Data Structures',
                        items: ['Arrays', 'Linked List', 'Stack', 'Queue', 'Trees', 'Hashing']
                    },
                    {
                        title: 'Database Management Systems',
                        items: ['What is DBMS', 'Normalization', 'Primary Key and Foreign Key', 'SQL basics', 'Joins']
                    },
                    {
                        title: 'Operating Systems',
                        items: ['Process vs Thread', 'Deadlock', 'CPU Scheduling', 'Virtual Memory']
                    },
                    {
                        title: 'Computer Networks',
                        items: ['OSI Model', 'TCP vs UDP', 'HTTP vs HTTPS', 'IP Address']
                    }
                ]
            },
            {
                title: 'Coding Questions Asked in Cognizant',
                description: 'These are common beginner-to-intermediate problem types that users should solve repeatedly.',
                groups: [
                    {
                        title: 'Common Coding Problems',
                        items: [
                            'Reverse a string',
                            'Fibonacci series',
                            'Prime number',
                            'Palindrome',
                            'Factorial',
                            'Armstrong number',
                            'Sorting numbers',
                            'Remove duplicates from an array',
                            'Pattern printing'
                        ],
                        note: 'Practice coding from HackerRank, LeetCode, and GeeksforGeeks.'
                    }
                ]
            },
            {
                title: 'Technical Interview Questions to Prepare',
                description: 'Along with coding, the user should be ready to explain these core interview concepts confidently.',
                groups: [
                    {
                        title: 'Common Technical Questions',
                        items: [
                            'Tell me about yourself',
                            'Explain Object-Oriented Programming concepts',
                            'What is a pointer?',
                            'What is DBMS?',
                            'What is deadlock?',
                            'Difference between stack and queue',
                            'Explain your final year project'
                        ]
                    }
                ]
            }
        ]
    }
};

const companyAptitudeShowcases = {
    tcs: {
        title: 'Common Aptitude Topics You Must Cover',
        subtitle: 'These are the main aptitude areas a TCS-focused learner should complete before moving into mock tests.',
        sections: [
            {
                heading: 'Quantitative Aptitude',
                intro: 'Focus on these important topics:',
                practiceLabel: 'Practice Quantitative',
                practiceTopic: 'percentages',
                items: [
                    { label: 'Percentages', key: 'percentages' },
                    { label: 'Profit and Loss', key: 'profit_loss' },
                    { label: 'Ratio and Proportion', key: 'ratio_proportion' },
                    { label: 'Time and Work', key: 'time_work' },
                    { label: 'Time, Speed and Distance', key: 'time_speed_distance' },
                    { label: 'Simple and Compound Interest', key: 'simple_compound_interest' },
                    { label: 'Averages', key: 'averages' },
                    { label: 'Mixtures and Alligations', key: 'mixtures_alligations' },
                    { label: 'Permutations and Combinations', key: 'permutations_combinations' },
                    { label: 'Probability', key: 'probability' },
                    { label: 'Number System', key: 'number_system' },
                    { label: 'Data Interpretation', key: 'data_interpretation' },
                    { label: 'Geometry and Mensuration', key: 'geometry_mensuration' }
                ],
                note: 'Practice from IndiaBIX and PrepInsta.'
            },
            {
                heading: 'Logical Reasoning',
                intro: 'Important topics:',
                practiceLabel: 'Practice Logical Reasoning',
                practiceTopic: 'coding_decoding',
                items: [
                    { label: 'Coding and Decoding', key: 'coding_decoding' },
                    { label: 'Blood Relations', key: 'blood_relations' },
                    { label: 'Syllogism', key: 'syllogism' },
                    { label: 'Direction Sense', key: 'direction_sense' },
                    { label: 'Seating Arrangement', key: 'seating_arrangement' },
                    { label: 'Puzzles', key: 'puzzles' },
                    { label: 'Pattern Recognition', key: 'pattern_recognition' },
                    { label: 'Series (Number and Alphabet)', key: 'series' }
                ]
            },
            {
                heading: 'Verbal Ability',
                intro: 'Important topics:',
                practiceLabel: 'Practice Verbal Ability',
                practiceTopic: 'reading_comprehension',
                items: [
                    { label: 'Reading Comprehension', key: 'reading_comprehension' },
                    { label: 'Error Detection', key: 'error_detection' },
                    { label: 'Sentence Correction', key: 'sentence_correction' },
                    { label: 'Synonyms and Antonyms', key: 'synonyms_antonyms' },
                    { label: 'Para Jumbles', key: 'para_jumbles' },
                    { label: 'Vocabulary', key: 'vocabulary' }
                ]
            }
        ]
    },
    infosys: {
        title: 'Aptitude Topics You Must Cover',
        subtitle: 'These are the main aptitude areas an Infosys-focused learner should complete before moving into mock tests.',
        sections: [
            {
                heading: 'Quantitative Aptitude',
                intro: 'Focus on these important topics:',
                practiceLabel: 'Practice Quantitative',
                practiceTopic: 'percentages',
                items: [
                    { label: 'Percentages', key: 'percentages' },
                    { label: 'Profit and Loss', key: 'profit_loss' },
                    { label: 'Ratio and Proportion', key: 'ratio_proportion' },
                    { label: 'Time and Work', key: 'time_work' },
                    { label: 'Time, Speed and Distance', key: 'time_speed_distance' },
                    { label: 'Simple and Compound Interest', key: 'simple_compound_interest' },
                    { label: 'Averages', key: 'averages' },
                    { label: 'Mixtures and Alligations', key: 'mixtures_alligations' },
                    { label: 'Permutations and Combinations', key: 'permutations_combinations' },
                    { label: 'Probability', key: 'probability' },
                    { label: 'Number System', key: 'number_system' },
                    { label: 'Data Interpretation', key: 'data_interpretation' }
                ],
                note: 'Practice from IndiaBIX and PrepInsta.'
            },
            {
                heading: 'Logical Reasoning',
                intro: 'Important topics:',
                practiceLabel: 'Practice Logical Reasoning',
                practiceTopic: 'coding_decoding',
                items: [
                    { label: 'Coding and Decoding', key: 'coding_decoding' },
                    { label: 'Blood Relations', key: 'blood_relations' },
                    { label: 'Syllogism', key: 'syllogism' },
                    { label: 'Direction Sense', key: 'direction_sense' },
                    { label: 'Seating Arrangement', key: 'seating_arrangement' },
                    { label: 'Puzzles', key: 'puzzles' },
                    { label: 'Pattern Recognition', key: 'pattern_recognition' },
                    { label: 'Number Series', key: 'series' }
                ]
            },
            {
                heading: 'Verbal Ability',
                intro: 'Topics to cover:',
                practiceLabel: 'Practice Verbal Ability',
                practiceTopic: 'reading_comprehension',
                items: [
                    { label: 'Reading Comprehension', key: 'reading_comprehension' },
                    { label: 'Error Detection', key: 'error_detection' },
                    { label: 'Sentence Correction', key: 'sentence_correction' },
                    { label: 'Synonyms and Antonyms', key: 'synonyms_antonyms' },
                    { label: 'Para Jumbles', key: 'para_jumbles' }
                ]
            }
        ]
    },
    wipro: {
        title: 'Aptitude Topics You Must Cover',
        subtitle: 'These are the main aptitude areas a Wipro-focused learner should complete before moving into mock tests.',
        sections: [
            {
                heading: 'Quantitative Aptitude',
                intro: 'Important topics:',
                practiceLabel: 'Practice Quantitative',
                practiceTopic: 'percentages',
                items: [
                    { label: 'Percentages', key: 'percentages' },
                    { label: 'Profit and Loss', key: 'profit_loss' },
                    { label: 'Ratio and Proportion', key: 'ratio_proportion' },
                    { label: 'Time and Work', key: 'time_work' },
                    { label: 'Time, Speed and Distance', key: 'time_speed_distance' },
                    { label: 'Simple and Compound Interest', key: 'simple_compound_interest' },
                    { label: 'Averages', key: 'averages' },
                    { label: 'Mixtures and Alligations', key: 'mixtures_alligations' },
                    { label: 'Permutations and Combinations', key: 'permutations_combinations' },
                    { label: 'Probability', key: 'probability' },
                    { label: 'Number System', key: 'number_system' },
                    { label: 'Data Interpretation', key: 'data_interpretation' }
                ],
                note: 'Practice from IndiaBIX and PrepInsta.'
            },
            {
                heading: 'Logical Reasoning',
                intro: 'Topics to prepare:',
                practiceLabel: 'Practice Logical Reasoning',
                practiceTopic: 'coding_decoding',
                items: [
                    { label: 'Coding and Decoding', key: 'coding_decoding' },
                    { label: 'Blood Relations', key: 'blood_relations' },
                    { label: 'Syllogism', key: 'syllogism' },
                    { label: 'Direction Sense', key: 'direction_sense' },
                    { label: 'Seating Arrangement', key: 'seating_arrangement' },
                    { label: 'Logical Puzzles', key: 'puzzles' },
                    { label: 'Pattern Recognition', key: 'pattern_recognition' }
                ]
            },
            {
                heading: 'Verbal Ability',
                intro: 'Topics:',
                practiceLabel: 'Practice Verbal Ability',
                practiceTopic: 'reading_comprehension',
                items: [
                    { label: 'Reading Comprehension', key: 'reading_comprehension' },
                    { label: 'Sentence Correction', key: 'sentence_correction' },
                    { label: 'Error Detection', key: 'error_detection' },
                    { label: 'Synonyms and Antonyms', key: 'synonyms_antonyms' }
                ]
            }
        ]
    },
    accenture: {
        title: 'Cognitive Assessment Topics You Must Cover',
        subtitle: 'These are the main aptitude areas an Accenture-focused learner should complete before moving into mock tests.',
        sections: [
            {
                heading: 'Quantitative Aptitude',
                intro: 'Focus on these important topics:',
                practiceLabel: 'Practice Quantitative',
                practiceTopic: 'percentages',
                items: [
                    { label: 'Percentages', key: 'percentages' },
                    { label: 'Profit and Loss', key: 'profit_loss' },
                    { label: 'Ratio and Proportion', key: 'ratio_proportion' },
                    { label: 'Time and Work', key: 'time_work' },
                    { label: 'Time, Speed and Distance', key: 'time_speed_distance' },
                    { label: 'Simple and Compound Interest', key: 'simple_compound_interest' },
                    { label: 'Averages', key: 'averages' },
                    { label: 'Number System', key: 'number_system' },
                    { label: 'Data Interpretation', key: 'data_interpretation' }
                ],
                note: 'Practice from IndiaBIX and PrepInsta.'
            },
            {
                heading: 'Logical Reasoning',
                intro: 'Important topics:',
                practiceLabel: 'Practice Logical Reasoning',
                practiceTopic: 'coding_decoding',
                items: [
                    { label: 'Coding and Decoding', key: 'coding_decoding' },
                    { label: 'Blood Relations', key: 'blood_relations' },
                    { label: 'Syllogism', key: 'syllogism' },
                    { label: 'Direction Sense', key: 'direction_sense' },
                    { label: 'Seating Arrangement', key: 'seating_arrangement' },
                    { label: 'Logical Puzzles', key: 'puzzles' },
                    { label: 'Pattern Recognition', key: 'pattern_recognition' }
                ]
            },
            {
                heading: 'Verbal Ability',
                intro: 'Topics to cover:',
                practiceLabel: 'Practice Verbal Ability',
                practiceTopic: 'reading_comprehension',
                items: [
                    { label: 'Reading Comprehension', key: 'reading_comprehension' },
                    { label: 'Sentence Correction', key: 'sentence_correction' },
                    { label: 'Error Detection', key: 'error_detection' },
                    { label: 'Synonyms and Antonyms', key: 'synonyms_antonyms' }
                ]
            }
        ]
    },
    cognizant: {
        title: 'Aptitude Topics You Must Cover',
        subtitle: 'These are the main aptitude areas a Cognizant-focused learner should complete before moving into mock tests.',
        sections: [
            {
                heading: 'Quantitative Aptitude',
                intro: 'Focus on these important topics:',
                practiceLabel: 'Practice Quantitative',
                practiceTopic: 'percentages',
                items: [
                    { label: 'Percentages', key: 'percentages' },
                    { label: 'Profit and Loss', key: 'profit_loss' },
                    { label: 'Ratio and Proportion', key: 'ratio_proportion' },
                    { label: 'Time and Work', key: 'time_work' },
                    { label: 'Time, Speed and Distance', key: 'time_speed_distance' },
                    { label: 'Simple and Compound Interest', key: 'simple_compound_interest' },
                    { label: 'Averages', key: 'averages' },
                    { label: 'Number System', key: 'number_system' },
                    { label: 'Permutations and Combinations', key: 'permutations_combinations' },
                    { label: 'Probability', key: 'probability' },
                    { label: 'Data Interpretation', key: 'data_interpretation' }
                ],
                note: 'Practice from IndiaBIX and PrepInsta.'
            },
            {
                heading: 'Logical Reasoning',
                intro: 'Important topics:',
                practiceLabel: 'Practice Logical Reasoning',
                practiceTopic: 'coding_decoding',
                items: [
                    { label: 'Coding and Decoding', key: 'coding_decoding' },
                    { label: 'Blood Relations', key: 'blood_relations' },
                    { label: 'Syllogism', key: 'syllogism' },
                    { label: 'Direction Sense', key: 'direction_sense' },
                    { label: 'Seating Arrangement', key: 'seating_arrangement' },
                    { label: 'Logical Puzzles', key: 'puzzles' },
                    { label: 'Pattern Recognition', key: 'pattern_recognition' }
                ]
            },
            {
                heading: 'Verbal Ability',
                intro: 'Topics to cover:',
                practiceLabel: 'Practice Verbal Ability',
                practiceTopic: 'reading_comprehension',
                items: [
                    { label: 'Reading Comprehension', key: 'reading_comprehension' },
                    { label: 'Sentence Correction', key: 'sentence_correction' },
                    { label: 'Error Detection', key: 'error_detection' },
                    { label: 'Synonyms and Antonyms', key: 'synonyms_antonyms' }
                ]
            }
        ]
    }
};

const tcsAptitudeTopicContent = {
    percentages: {
        title: 'Percentages',
        section: 'Quantitative Aptitude',
        overview: 'Percentages are one of the core TCS aptitude topics because they appear in profit and loss, data interpretation, discounts, marks, and population questions.',
        formulasTitle: 'Important formulas and ideas:',
        formulas: [
            'x% of y = (x / 100) x y',
            'Percentage = (part / whole) x 100',
            'New value = Original value x (1 +/- percentage / 100)',
            'Successive percentage change a% and b% = a + b + (ab / 100)'
        ],
        tips: ['Convert the base value to 100 when possible.', 'For increase and decrease questions, track each step instead of combining too early.']
    },
    profit_loss: {
        title: 'Profit and Loss',
        section: 'Quantitative Aptitude',
        overview: 'TCS often asks direct profit, loss, discount, and marked-price questions, so users should be comfortable moving between CP, SP, MP, profit, and loss quickly.',
        formulasTitle: 'Important formulas:',
        formulas: [
            'Profit = SP - CP',
            'Loss = CP - SP',
            'Profit% = (Profit / CP) x 100',
            'Loss% = (Loss / CP) x 100',
            'Discount = MP - SP'
        ],
        tips: ['Assume CP = 100 for percentage-based shortcuts.', 'Keep CP as the base for profit% and loss%.']
    },
    ratio_proportion: {
        title: 'Ratio and Proportion',
        section: 'Quantitative Aptitude',
        overview: 'This topic appears in partnership, ages, distribution, and comparison questions. The goal is to convert words into a consistent ratio quickly.',
        formulasTitle: 'Important formulas:',
        formulas: [
            'Ratio a:b means a / b',
            'If a:b = c:d, then ad = bc',
            'To divide a quantity Q in ratio a:b, shares are Q x a / (a+b) and Q x b / (a+b)',
            'For compound ratios, multiply corresponding terms'
        ],
        tips: ['Make common terms equal before combining two ratios.', 'Write total parts first before finding actual values.']
    },
    time_work: {
        title: 'Time and Work',
        section: 'Quantitative Aptitude',
        overview: 'TCS likes efficiency questions involving workers, days, and combined work rates, so rate-based thinking matters more than memorizing patterns.',
        formulasTitle: 'Important formulas:',
        formulas: [
            'If A finishes work in n days, 1-day work = 1 / n',
            'Combined work rate = sum of individual work rates',
            'Time = Total work / Rate',
            'Men x Days = Constant work for direct manpower questions'
        ],
        tips: ['Convert everyone to one-day work first.', 'After partial work is done, subtract from 1 and solve the remaining part.']
    },
    time_speed_distance: {
        title: 'Time, Speed and Distance',
        section: 'Quantitative Aptitude',
        overview: 'This topic is very common because it tests direct formula use, train problems, relative speed, and unit conversion.',
        formulasTitle: 'Important formulas:',
        formulas: [
            'Speed = Distance / Time',
            'Distance = Speed x Time',
            'Time = Distance / Speed',
            '1 m/s = 18/5 km/h and 1 km/h = 5/18 m/s',
            'Relative speed = sum or difference of speeds depending on direction'
        ],
        tips: ['Check units before solving.', 'For train crossing problems, use total distance covered by the moving body.']
    },
    simple_compound_interest: {
        title: 'Simple and Compound Interest',
        section: 'Quantitative Aptitude',
        overview: 'Interest questions in TCS are usually formula-based, so students who know the direct equations can solve them fast.',
        formulasTitle: 'Important formulas:',
        formulas: [
            'SI = (P x R x T) / 100',
            'Amount in SI = P + SI',
            'Amount in CI = P(1 + R / 100)^T',
            'CI = Amount - Principal'
        ],
        tips: ['Read carefully whether the question asks for amount or interest.', 'For 2-year CI and SI difference, the extra part comes from interest on interest.']
    },
    averages: {
        title: 'Averages',
        section: 'Quantitative Aptitude',
        overview: 'Averages are quick-scoring when the user knows how to move between average and total without recalculating everything from scratch.',
        formulasTitle: 'Important formulas:',
        formulas: [
            'Average = Sum of observations / Number of observations',
            'Sum = Average x Number of observations',
            'New average after adding value x = (old sum + x) / new count',
            'For consecutive numbers, average equals the middle term'
        ],
        tips: ['Convert average to total immediately.', 'When one value is removed or added, update the total first.']
    },
    mixtures_alligations: {
        title: 'Mixtures and Alligations',
        section: 'Quantitative Aptitude',
        overview: 'This topic mixes ratios with weighted averages. The key is knowing when to use direct ratios and when to use alligation.',
        formulasTitle: 'Important formulas:',
        formulas: [
            'Alligation ratio = (higher value - mean value) : (mean value - lower value)',
            'Quantity x concentration gives actual amount of ingredient',
            'Repeated replacement uses Remaining = Initial x (1 - removed / total)^n'
        ],
        tips: ['Separate the quantity from the concentration.', 'For replacement, use the repeated multiplication model.']
    },
    permutations_combinations: {
        title: 'Permutations and Combinations',
        section: 'Quantitative Aptitude',
        overview: 'These questions test whether the order matters. Once the user identifies arrangement versus selection, most problems simplify quickly.',
        formulasTitle: 'Important formulas:',
        formulas: [
            'n! = n x (n-1) x ... x 1',
            'nPr = n! / (n-r)!',
            'nCr = n! / (r!(n-r)!)',
            'Arrangement means order matters, selection means order does not matter'
        ],
        tips: ['Ask first: are we arranging or just choosing?', 'For no-two-together problems, place the fixed group first and use the gaps.']
    },
    probability: {
        title: 'Probability',
        section: 'Quantitative Aptitude',
        overview: 'TCS probability problems are usually based on counting favorable outcomes and total outcomes correctly.',
        formulasTitle: 'Important formulas:',
        formulas: [
            'Probability = Favorable outcomes / Total outcomes',
            'Probability of not happening = 1 - Probability of happening',
            'Independent events multiply'
        ],
        tips: ['Draw sample spaces for cards, dice, and coins.', 'Without replacement changes the denominator for the next event.']
    },
    number_system: {
        title: 'Number System',
        section: 'Quantitative Aptitude',
        overview: 'This topic covers divisibility, remainders, LCM, HCF, unit digits, and basic algebraic number properties.',
        formulasTitle: 'Important formulas and checks:',
        formulas: [
            'LCM x HCF = product of two numbers',
            'For remainders, rewrite numbers in the form divisor x quotient + remainder',
            'Unit digit patterns repeat in cycles',
            'Prime factorization helps with LCM and HCF'
        ],
        tips: ['Use remainder form directly instead of big multiplication.', 'Find the repeating cycle before solving unit-digit questions.']
    },
    data_interpretation: {
        title: 'Data Interpretation',
        section: 'Quantitative Aptitude',
        overview: 'DI questions test speed with percentages, ratio, averages, and comparison, usually from a table, chart, or summary set.',
        formulasTitle: 'Important formulas:',
        formulas: [
            'Percentage change = ((new - old) / old) x 100',
            'Average = total / number of entries',
            'Ratio comparison = value 1 / value 2'
        ],
        tips: ['Read the chart title and units first.', 'Avoid solving mentally when values are close; write the base number.']
    },
    geometry_mensuration: {
        title: 'Geometry and Mensuration',
        section: 'Quantitative Aptitude',
        overview: 'Geometry questions in TCS are usually direct area, perimeter, volume, or simple angle-property questions.',
        formulasTitle: 'Important formulas:',
        formulas: [
            'Rectangle area = l x b and perimeter = 2(l + b)',
            'Circle area = pi r^2 and circumference = 2pi r',
            'Triangle area = 1/2 x base x height',
            'Cube volume = a^3 and cuboid volume = l x b x h'
        ],
        tips: ['Draw the figure when dimensions are described in words.', 'Check whether the question asks for area, surface area, or volume.']
    },
    coding_decoding: {
        title: 'Coding and Decoding',
        section: 'Logical Reasoning',
        overview: 'These questions test pattern recognition with letters, numbers, positions, and shifts.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'Check alphabet positions: A=1 to Z=26',
            'Look for fixed shifts, reverse order, pair patterns, or word splitting',
            'Test whether the operation applies letter-wise or word-wise'
        ],
        tips: ['Write positions above the letters.', 'Compare two examples before committing to a rule.']
    },
    blood_relations: {
        title: 'Blood Relations',
        section: 'Logical Reasoning',
        overview: 'Blood relation questions become easy when the user converts each statement into a small family tree.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'Identify gender from the wording first',
            'Connect each relation one step at a time',
            'Use a tree or line diagram for long statements'
        ],
        tips: ['Start from the named person at the center.', 'Do not solve long relation chains only in your head.']
    },
    syllogism: {
        title: 'Syllogism',
        section: 'Logical Reasoning',
        overview: 'Syllogism questions are about valid conclusions from given statements, not common-sense assumptions.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'Draw set relationships using circles when possible',
            'Only trust what is definitely true from the statement',
            'Do not assume extra overlap unless it is stated'
        ],
        tips: ['Separate â€œsomeâ€ from â€œallâ€ very carefully.', 'Reject conclusions based on possibility when the question asks for certainty.']
    },
    direction_sense: {
        title: 'Direction Sense',
        section: 'Logical Reasoning',
        overview: 'These questions test orientation, left-right turns, and final distance or direction from the starting point.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'Keep the current facing direction after every turn',
            'Use a simple coordinate sketch for movement',
            'Right and left depend on the current facing direction, not the map'
        ],
        tips: ['Mark north first.', 'Track turns step by step instead of jumping to the end.']
    },
    seating_arrangement: {
        title: 'Seating Arrangement',
        section: 'Logical Reasoning',
        overview: 'TCS seating problems reward structured elimination. The key is converting clues into a stable seat map.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'Draw the table or line before reading all clues again',
            'Place the fixed positions first',
            'Then use relative clues such as left of, opposite, next to'
        ],
        tips: ['Keep a clear placeholder for every seat.', 'Do not place uncertain values in ink until they are confirmed.']
    },
    puzzles: {
        title: 'Puzzles',
        section: 'Logical Reasoning',
        overview: 'Puzzle questions combine multiple conditions such as age, order, color, and role, so tabular elimination works best.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'List entities as rows and attributes as columns',
            'Mark confirmed data and eliminate contradictions',
            'Resolve one clue at a time'
        ],
        tips: ['Use a table instead of plain reading.', 'Return to earlier clues after each confirmed placement.']
    },
    pattern_recognition: {
        title: 'Pattern Recognition',
        section: 'Logical Reasoning',
        overview: 'These questions require spotting repetition, symmetry, growth, or transformation patterns in symbols or numbers.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'Check for arithmetic change, geometric change, alternation, or symmetry',
            'Break complicated patterns into two smaller repeating rules'
        ],
        tips: ['Look for odd-even position patterns.', 'If the sequence feels irregular, test every second term separately.']
    },
    series: {
        title: 'Series (Number and Alphabet)',
        section: 'Logical Reasoning',
        overview: 'Series questions are common in TCS because they check both arithmetic and visual pattern observation.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'Test differences between numbers first',
            'Then test multiplication, squares, or alternating operations',
            'For alphabet series, convert letters to positions'
        ],
        tips: ['Write the first differences below the series.', 'Alternating-step series are very common.']
    },
    reading_comprehension: {
        title: 'Reading Comprehension',
        section: 'Verbal Ability',
        overview: 'The goal is to understand the authorâ€™s central idea, tone, and direct meaning rather than rely on outside knowledge.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'Read the questions once before the passage if time is short',
            'Identify the main idea, tone, and evidence lines',
            'Prefer answers supported by the passage wording'
        ],
        tips: ['Avoid answers that are true in real life but not stated in the passage.', 'Watch for extreme words like always and never.']
    },
    error_detection: {
        title: 'Error Detection',
        section: 'Verbal Ability',
        overview: 'This topic checks grammar basics such as tense, subject-verb agreement, articles, prepositions, and pronouns.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'Check subject-verb agreement first',
            'Then check tense consistency, article use, and pronoun reference',
            'Read the sentence slowly in parts'
        ],
        tips: ['The error is often in a small connecting phrase.', 'Check whether singular and plural forms match.']
    },
    sentence_correction: {
        title: 'Sentence Correction',
        section: 'Verbal Ability',
        overview: 'Sentence correction is about choosing the grammatically cleanest and most natural structure.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'Remove obviously incorrect tense or agreement choices first',
            'Prefer concise and grammatically balanced options',
            'Check parallel structure in lists and comparisons'
        ],
        tips: ['Read the full sentence with each option mentally.', 'The shortest answer is not always correct, but wordiness is often a clue.']
    },
    synonyms_antonyms: {
        title: 'Synonyms and Antonyms',
        section: 'Verbal Ability',
        overview: 'This topic checks vocabulary range and the ability to distinguish close meanings and opposites.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'Understand the root meaning of the given word',
            'Eliminate words with a similar tone but different meaning',
            'For antonyms, look for the strongest opposite'
        ],
        tips: ['Use sentence context if available.', 'Learn common placement-level word pairs repeatedly.']
    },
    para_jumbles: {
        title: 'Para Jumbles',
        section: 'Verbal Ability',
        overview: 'Para jumble questions test flow and coherence. The trick is finding a logical opening and linked sentence pairs.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'The opening sentence usually introduces the main topic without pronouns',
            'Look for connectors such as however, therefore, also, this, these',
            'Pair cause-effect and example-explanation sentences'
        ],
        tips: ['Pronoun-led sentences rarely come first.', 'Find mandatory pairs before building the full order.']
    },
    vocabulary: {
        title: 'Vocabulary',
        section: 'Verbal Ability',
        overview: 'Vocabulary questions include word meaning, usage, context fit, and collocations.',
        formulasTitle: 'Quick approach:',
        formulas: [
            'Use context to judge whether the word tone is positive, negative, or neutral',
            'Check the part of speech needed by the sentence'
        ],
        tips: ['Build a daily revision list of repeated weak words.', 'Learn words in example sentences, not as isolated definitions.']
    }
};

const tcsLevelBasedTopicKeys = new Set([
    'percentages',
    'profit_loss',
    'ratio_proportion',
    'time_work',
    'time_speed_distance',
    'simple_compound_interest',
    'averages',
    'mixtures_alligations',
    'permutations_combinations',
    'probability',
    'number_system',
    'data_interpretation',
    'geometry_mensuration',
    'coding_decoding',
    'blood_relations',
    'syllogism',
    'direction_sense',
    'seating_arrangement',
    'puzzles',
    'pattern_recognition',
    'series',
    'reading_comprehension',
    'error_detection',
    'sentence_correction',
    'synonyms_antonyms',
    'para_jumbles',
    'vocabulary'
]);

const difficultyDisplayOrder = ['Easy', 'Medium', 'Hard'];
const currentTcsPracticeState = {};

function addDifficultyLevels(topicKey, questions) {
    if (!tcsLevelBasedTopicKeys.has(topicKey)) {
        return questions;
    }

    return questions.map((question, index, list) => {
        let difficulty = 'Hard';
        if (index < 2) {
            difficulty = 'Easy';
        } else if (index < list.length - 1) {
            difficulty = 'Medium';
        }

        return { ...question, difficulty };
    });
}

function buildQuestionCard(question, topicKey) {
    return `
        <div class="question-item question-item-${question.difficulty ? question.difficulty.toLowerCase() : 'default'}">
            <div class="question-item-header">
                <h4>Question ${question.practiceIndex || question.id}</h4>
                ${question.difficulty ? `<span class="question-difficulty-badge ${question.difficulty.toLowerCase()}">${question.difficulty}</span>` : ''}
            </div>
            <p>${question.question}</p>
            <div class="options">
                ${question.options.map(opt => `
                    <button onclick="checkCompanyAnswer('company-result-${question.practiceKey || `${topicKey}-${question.id}`}', '${escapeJsString(opt)}', '${escapeJsString(question.answer)}', '${escapeJsString(question.explanation || '')}')">${opt}</button>
                `).join('')}
            </div>
            <div id="company-result-${question.practiceKey || `${topicKey}-${question.id}`}" class="result"></div>
        </div>
    `;
}

function renderDifficultyPicker(topicKey, topicLabel, selectedLevel) {
    return `
        <div class="difficulty-selector">
            ${difficultyDisplayOrder.map(level => `
                <button class="difficulty-selector-btn ${selectedLevel === level ? `active ${level.toLowerCase()}` : ''}" onclick="showTcsDifficultyPractice('${topicKey}', '${topicLabel.replace(/'/g, "\\'")}', '${level}')">
                    ${level}
                </button>
            `).join('')}
        </div>
    `;
}

function buildDifficultyPracticeMarkup(topicKey, level, practiceSet) {
    if (!practiceSet.length) {
        return '<p class="error">No practice questions are available for this level yet.</p>';
    }

    return `
        <section class="difficulty-group difficulty-group-${level.toLowerCase()}">
            <div class="difficulty-group-header">
                <h5>${level} Level</h5>
                <p>${practiceSet.length} unique practice question${practiceSet.length > 1 ? 's' : ''}</p>
            </div>
            <div class="difficulty-group-questions">
                ${practiceSet.map(question => buildQuestionCard(question, topicKey)).join('')}
            </div>
        </section>
    `;
}

async function showTcsDifficultyPractice(topicKey, topicLabel, level) {
    const practiceContainer = document.getElementById(`practice-panel-${topicKey}`);
    if (!practiceContainer) {
        return;
    }

    practiceContainer.innerHTML = '<p>Loading practice questions...</p>';

    try {
        const response = await fetch(`${API_BASE}/company/tcs/aptitude/${topicKey}/${level.toLowerCase()}`);
        const practiceSet = await response.json();

        if (!response.ok || !Array.isArray(practiceSet)) {
            throw new Error('Unable to load practice questions.');
        }

        const normalizedSet = practiceSet.map((question, index) => ({
            ...question,
            practiceIndex: index + 1,
            practiceKey: `${topicKey}-${level.toLowerCase()}-${index + 1}-${question.id}`
        }));

        practiceContainer.innerHTML = buildDifficultyPracticeMarkup(topicKey, level, normalizedSet);
    } catch (error) {
        practiceContainer.innerHTML = '<p class="error">Unable to load practice questions right now.</p>';
    }

    const selector = practiceContainer.parentElement?.querySelector('.difficulty-selector');
    if (selector) {
        selector.outerHTML = renderDifficultyPicker(topicKey, topicLabel, level);
    }
}

function renderCompanyAptitudeShowcase(company) {
    const showcase = companyAptitudeShowcases[company];
    if (!showcase) {
        return '';
    }

    return `
        <div class="company-aptitude-showcase">
            <div class="company-aptitude-header">
                <h3>${showcase.title}</h3>
                <p class="subtitle">${showcase.subtitle}</p>
            </div>
            <div class="company-aptitude-grid">
                ${showcase.sections.map(section => `
                    <article class="company-aptitude-card">
                        <h4>${section.heading}</h4>
                        <p class="company-aptitude-intro">${section.intro}</p>
                        <div class="company-aptitude-list">
                            ${section.items.map(item => `
                                <button class="company-aptitude-topic" onclick="loadCompanyAptitude('${company}', '${item.key}', '${item.label.replace(/'/g, "\\'")}')">
                                    ${item.label}
                                </button>
                            `).join('')}
                        </div>
                        ${section.note ? `<p class="company-aptitude-note">${section.note}</p>` : ''}
                        <button class="company-aptitude-practice" onclick="loadCompanyAptitude('${company}', '${section.practiceTopic}', '${section.heading.replace(/'/g, "\\'")}')">${section.practiceLabel}</button>
                    </article>
                `).join('')}
            </div>
        </div>
    `;
}

function buildTcsAptitudeTopicMarkup(topicKey, questions, topicLabel) {
    const topicMeta = tcsAptitudeTopicContent[topicKey];
    if (!topicMeta) {
        return null;
    }

    const difficultyReadyQuestions = addDifficultyLevels(topicKey, questions);
    const isLevelBasedTopic = tcsLevelBasedTopicKeys.has(topicKey);

    const backHandler = currentCompany === 'tcs'
        ? "showCompanyAptitudeTopics('tcs')"
        : "showHomeAptitudeWithTcs()";

    return `
        <div class="company-topic-detail">
            <div class="company-topic-hero">
                <button class="back-btn" onclick="${backHandler}" style="margin-bottom: 16px;">â† Back to Common Aptitude Topics</button>
                <span class="company-topic-section">${topicMeta.section}</span>
                <h3>${topicMeta.title}</h3>
                <p class="company-topic-overview">${topicMeta.overview}</p>
            </div>
            <div class="company-topic-grid">
                <section class="company-topic-card">
                    <h4>${topicMeta.formulasTitle}</h4>
                    <ul class="company-topic-points">
                        ${topicMeta.formulas.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </section>
                <section class="company-topic-card">
                    <h4>How to approach this topic</h4>
                    <ul class="company-topic-points">
                        ${topicMeta.tips.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </section>
            </div>
            <section class="company-topic-practice">
                <div class="company-topic-practice-header">
                    <h4>${topicLabel} Practice Questions</h4>
                    <p>${isLevelBasedTopic
                        ? `Choose a level first to practise a unique question set for that level. Repeated questions are avoided, so you only see distinct questions from the current topic bank.`
                        : `Hands-on practice for this topic. The current project has ${difficultyReadyQuestions.length} ready questions wired for this topic.`}</p>
                </div>
                <div class="company-topic-questions">
                    ${isLevelBasedTopic ? `
                        ${renderDifficultyPicker(topicKey, topicLabel, '')}
                        <div id="practice-panel-${topicKey}" class="practice-panel">
                            <div class="practice-panel-placeholder">
                                <h5>Select A Difficulty Level</h5>
                                <p>Choose Easy, Medium, or Hard to start a unique practice set for ${topicLabel}.</p>
                            </div>
                        </div>
                    ` : difficultyReadyQuestions.map(question => buildQuestionCard(question, topicKey)).join('')}
                </div>
            </section>
        </div>
    `;
}

function renderRoadmapGroup(group) {
    const intro = group.intro ? `<p class="roadmap-group-intro">${group.intro}</p>` : '';
    const note = group.note ? `<p class="roadmap-note">${group.note}</p>` : '';

    return `
        <article class="roadmap-group">
            <h4>${group.title}</h4>
            ${intro}
            <ul class="roadmap-list">
                ${group.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            ${note}
        </article>
    `;
}

function buildCompanyRoadmapMarkup(companyKey) {
    const roadmap = companyRoadmaps[companyKey];
    if (!roadmap) {
        return '';
    }

    const flowchartMarkup = roadmap.flowchart ? `
        <section class="roadmap-flowchart-card">
            <div class="roadmap-flowchart-copy">
                <span class="roadmap-step">${roadmap.flowchart.stepLabel || 'Interview Flow'}</span>
                <h2>${roadmap.flowchart.title}</h2>
                <p>${roadmap.flowchart.description}</p>
            </div>
            ${roadmap.flowchart.image ? `
                <figure class="roadmap-flowchart-figure">
                    <img src="${roadmap.flowchart.image.src}" alt="${roadmap.flowchart.image.alt}" class="roadmap-flowchart-image">
                    <figcaption>${roadmap.flowchart.image.caption}</figcaption>
                </figure>
            ` : `
                <div class="roadmap-flowchart-figure roadmap-flowchart-steps">
                    <div class="roadmap-flowchart-step-list">
                        ${roadmap.flowchart.steps.map((step, index) => `
                            <div class="roadmap-flowchart-node">
                                <span>${index + 1}</span>
                                <p>${step}</p>
                            </div>
                        `).join('')}
                    </div>
                    <p class="roadmap-flowchart-caption">${roadmap.flowchart.caption || ''}</p>
                </div>
            `}
        </section>
    ` : '';

    return `
        <div class="company-roadmap">
            <section class="roadmap-hero">
                <p class="roadmap-eyebrow">Company Preparation Path</p>
                <h1>${roadmap.name}</h1>
                <p class="roadmap-tagline">${roadmap.tagline}</p>
                <div class="roadmap-overview">
                    ${roadmap.overview.map(line => `<p>${line}</p>`).join('')}
                </div>
                <div class="roadmap-actions">
                    <button type="button" class="start-test-btn" onclick="startCompanyMockTest('${companyKey}', 'aptitude')">Start Aptitude Test</button>
                    <button type="button" class="start-test-btn" onclick="startCompanyMockTest('${companyKey}', 'coding')">Start Coding Test</button>
                    <button type="button" onclick="showSection('interview')">View Interview Questions</button>
                </div>
            </section>
            ${flowchartMarkup}
            <section class="roadmap-sections">
                ${roadmap.sections.map((section, index) => `
                    <article class="roadmap-section-card">
                        <div class="roadmap-section-header">
                            <span class="roadmap-step">Step ${index + 1}</span>
                            <h2>${section.title}</h2>
                            <p>${section.description}</p>
                        </div>
                        <div class="roadmap-groups">
                            ${section.groups.map(renderRoadmapGroup).join('')}
                        </div>
                    </article>
                `).join('')}
            </section>
        </div>
    `;
}

// Company Information Data
const companyData = {
    tcs: {
        name: "Tata Consultancy Services (TCS)",
        content: `
            <div class="company-detail">
                <h2>ðŸ“… Overview of TCS</h2>
                <ul>
                    <li><strong>Founded:</strong> 1968</li>
                    <li><strong>Founder:</strong> Faquir Chand Kohli (known as the father of the Indian IT industry)</li>
                    <li><strong>Headquarters:</strong> Mumbai, India</li>
                    <li><strong>CEO:</strong> K. Krithivasan</li>
                    <li><strong>Employees:</strong> 600,000+ worldwide ðŸŒ</li>
                </ul>
                <p>TCS is one of the largest IT employers in India.</p>

                <h2>ðŸ’» What TCS Does</h2>
                <p>TCS provides IT services, consulting, and business solutions to companies around the world.</p>
                <p>Main services include:</p>
                <ul>
                    <li>Software development</li>
                    <li>Cloud computing â˜ï¸</li>
                    <li>Artificial Intelligence</li>
                    <li>Cybersecurity</li>
                    <li>Data analytics</li>
                    <li>IT consulting</li>
                    <li>Application development</li>
                    <li>Digital transformation</li>
                </ul>
                <p>Many global companies depend on TCS for their technology systems.</p>

                <h2>ðŸŒŽ Global Presence</h2>
                <p>TCS operates in 50+ countries and serves clients in industries like:</p>
                <ul>
                    <li>Banking & Finance</li>
                    <li>Healthcare</li>
                    <li>Retail</li>
                    <li>Manufacturing</li>
                    <li>Telecommunications</li>
                    <li>Insurance</li>
                </ul>
                <p>Some of its major markets are:</p>
                <ul>
                    <li>United States</li>
                    <li>United Kingdom</li>
                    <li>India</li>
                    <li>Australia</li>
                </ul>

                <h2>ðŸ† Achievements</h2>
                <ul>
                    <li>One of the most valuable IT companies in the world</li>
                    <li>Listed on the Bombay Stock Exchange (BSE) and National Stock Exchange of India (NSE)</li>
                    <li>Consistently ranked among top IT services companies globally</li>
                    <li>Known for strong employee training programs</li>
                </ul>

                <h2>ðŸ‘¨â€ðŸ’» Why Many Students Prefer TCS</h2>
                <p>Fresh graduates often try to join TCS because:</p>
                <ul>
                    <li>âœ… Good training for freshers</li>
                    <li>âœ… Job stability</li>
                    <li>âœ… Global projects</li>
                    <li>âœ… Good work culture</li>
                    <li>âœ… Opportunity to work abroad ðŸŒŽ</li>
                </ul>

                <h2>ðŸŽ“ TCS Hiring Programs</h2>
                <p>TCS hires freshers through programs like:</p>
                <ul>
                    <li>TCS National Qualifier Test (TCS NQT)</li>
                    <li>Campus recruitment drives</li>
                    <li>TCS CodeVita coding contest</li>
                </ul>

                <h2>ðŸ“Š Simple Company Structure</h2>
                <div class="structure">
                    <p>Tata Group</p>
                    <p>â”‚</p>
                    <p>â–¼</p>
                    <p>Tata Consultancy Services (TCS)</p>
                    <p>â”‚</p>
                    <p>â”œâ”€â”€ IT Services</p>
                    <p>â”œâ”€â”€ Consulting</p>
                    <p>â”œâ”€â”€ Cloud & AI</p>
                    <p>â”œâ”€â”€ Cybersecurity</p>
                    <p>â””â”€â”€ Digital Solutions</p>
                </div>

                <h2>1ï¸âƒ£ TCS Interview Process</h2>
                <div class="flow-chart">
                    <p>Apply through TCS NextStep / Campus</p>
                    <p>â”‚</p>
                    <p>â–¼</p>
                    <p>Online Aptitude Test</p>
                    <p>(Quantitative + Logical + Verbal)</p>
                    <p>â”‚</p>
                    <p>â–¼</p>
                    <p>Programming Test</p>
                    <p>(Coding / Hands-on)</p>
                    <p>â”‚</p>
                    <p>â–¼</p>
                    <p>Technical Interview</p>
                    <p>(Programming + Core CS Concepts)</p>
                    <p>â”‚</p>
                    <p>â–¼</p>
                    <p>HR Interview</p>
                    <p>(Personality + Communication)</p>
                    <p>â”‚</p>
                    <p>â–¼</p>
                    <p>Offer Letter</p>
                </div>
                <p><em>Some campuses may combine Technical + HR in one round.</em></p>

                <h2>2ï¸âƒ£ Common Aptitude Topics You Must Cover ðŸ§ </h2>
                <h3>Quantitative Aptitude</h3>
                <p>Focus on these important topics:</p>
                <ul>
                    <li>Percentages</li>
                    <li>Profit and Loss</li>
                    <li>Ratio and Proportion</li>
                    <li>Time and Work</li>
                    <li>Time, Speed and Distance</li>
                    <li>Simple & Compound Interest</li>
                    <li>Averages</li>
                    <li>Mixtures and Alligations</li>
                    <li>Permutations and Combinations</li>
                    <li>Probability</li>
                    <li>Number System</li>
                    <li>Data Interpretation</li>
                    <li>Geometry & Mensuration</li>
                </ul>
                <p>ðŸ“Œ Practice from platforms like IndiaBIX, PrepInsta</p>

                <h3>Logical Reasoning</h3>
                <p>Important topics:</p>
                <ul>
                    <li>Coding and Decoding</li>
                    <li>Blood Relations</li>
                    <li>Syllogism</li>
                    <li>Direction Sense</li>
                    <li>Seating Arrangement</li>
                    <li>Puzzles</li>
                    <li>Pattern Recognition</li>
                    <li>Series (Number / Alphabet)</li>
                </ul>

                <h3>Verbal Ability</h3>
                <ul>
                    <li>Reading Comprehension</li>
                    <li>Error Detection</li>
                    <li>Sentence Correction</li>
                    <li>Synonyms & Antonyms</li>
                    <li>Para Jumbles</li>
                    <li>Vocabulary</li>
                </ul>

                <h2>3ï¸âƒ£ Programming Languages You Should Cover ðŸ’»</h2>
                <p>You don't need to learn many languages, but you must be strong in at least one.</p>
                <p>Recommended languages:</p>
                <ul>
                    <li>C</li>
                    <li>C++</li>
                    <li>Java</li>
                    <li>Python</li>
                </ul>
                <p>Most students choose C / Java / Python.</p>

                <h3>Programming Topics</h3>
                <ul>
                    <li>Basic syntax</li>
                    <li>Loops</li>
                    <li>Conditional statements</li>
                    <li>Functions</li>
                    <li>Arrays</li>
                    <li>Strings</li>
                    <li>Recursion</li>
                    <li>Sorting (Bubble, Selection, Insertion)</li>
                    <li>Searching (Linear, Binary)</li>
                    <li>Basic Data Structures</li>
                </ul>

                <h2>4ï¸âƒ£ Core Computer Science Concepts ðŸ“š</h2>
                <p>Even if you are not from CS, prepare basic concepts.</p>

                <h3>Data Structures</h3>
                <ul>
                    <li>Arrays</li>
                    <li>Linked List</li>
                    <li>Stack</li>
                    <li>Queue</li>
                    <li>Trees</li>
                    <li>Hashing</li>
                </ul>

                <h3>DBMS</h3>
                <ul>
                    <li>What is DBMS</li>
                    <li>Normalization</li>
                    <li>Primary key / Foreign key</li>
                    <li>SQL basics</li>
                    <li>Joins</li>
                </ul>

                <h3>Operating System</h3>
                <ul>
                    <li>Process vs Thread</li>
                    <li>Deadlock</li>
                    <li>Scheduling</li>
                    <li>Virtual Memory</li>
                </ul>

                <h3>Computer Networks</h3>
                <ul>
                    <li>OSI Model</li>
                    <li>TCP vs UDP</li>
                    <li>HTTP / HTTPS</li>
                    <li>IP Address</li>
                </ul>

                <h2>5ï¸âƒ£ Coding Questions Asked in TCS</h2>
                <p>Common coding problems:</p>
                <ul>
                    <li>Reverse a string</li>
                    <li>Fibonacci series</li>
                    <li>Prime number</li>
                    <li>Palindrome</li>
                    <li>Factorial</li>
                    <li>Armstrong number</li>
                    <li>Sorting numbers</li>
                    <li>Remove duplicates from array</li>
                    <li>Pattern printing</li>
                </ul>
                <p>Practice from:</p>
                <ul>
                    <li>HackerRank</li>
                    <li>LeetCode</li>
                    <li>GeeksforGeeks</li>
                </ul>

                <h2>6ï¸âƒ£ Technical Interview Questions (Common) ðŸŽ¯</h2>
                <p>Examples:</p>
                <ul>
                    <li>Tell me about yourself</li>
                    <li>Explain OOPS concepts</li>
                    <li>Difference between C and Java</li>
                    <li>What is a pointer?</li>
                    <li>What is a database?</li>
                    <li>What is a deadlock?</li>
                    <li>Explain your final year project</li>
                </ul>
                <p><strong>Tip:</strong> Prepare your project very well.</p>

                <h2>7ï¸âƒ£ HR Interview Questions ðŸ’¬</h2>
                <p>Common HR questions:</p>
                <ul>
                    <li>Why do you want to join TCS?</li>
                    <li>What are your strengths and weaknesses?</li>
                    <li>Where do you see yourself in 5 years?</li>
                    <li>Are you willing to relocate?</li>
                    <li>Why should we hire you?</li>
                </ul>

                <h2>8ï¸âƒ£ Important Tips to Crack TCS Interview â­</h2>
                <ul>
                    <li>âœ” Improve communication skills</li>
                    <li>âœ” Practice mock interviews</li>
                    <li>âœ” Be confident while speaking</li>
                    <li>âœ” Prepare resume properly</li>
                    <li>âœ” Know your final year project clearly</li>
                    <li>âœ” Practice coding daily</li>
                    <li>âœ” Revise basic CS concepts</li>
                </ul>

                <h2>9ï¸âƒ£ Extra Things That Help You Get Selected ðŸš€</h2>
                <ul>
                    <li>Learn Object-Oriented Programming (OOP)</li>
                    <li>Learn basic SQL</li>
                    <li>Learn Git basics</li>
                    <li>Know software development lifecycle</li>
                    <li>Build 2â€“3 small projects</li>
                </ul>
                <p>Example projects:</p>
                <ul>
                    <li>Student Management System</li>
                    <li>Library Management System</li>
                    <li>Calculator app</li>
                </ul>
                
                <h2>TCS Percentage and Level Analyzer</h2>
                <p>Enter your current scores to check your TCS readiness percentage and level.</p>
                <div class="tcs-analyzer-card">
                    <div class="tcs-analyzer-grid">
                        <div class="tcs-field">
                            <label for="tcs-aptitude-score">Aptitude Score (0-100)</label>
                            <input type="number" id="tcs-aptitude-score" min="0" max="100" placeholder="e.g. 72">
                        </div>
                        <div class="tcs-field">
                            <label for="tcs-coding-score">Coding Score (0-100)</label>
                            <input type="number" id="tcs-coding-score" min="0" max="100" placeholder="e.g. 68">
                        </div>
                        <div class="tcs-field">
                            <label for="tcs-interview-score">Interview Score (0-100)</label>
                            <input type="number" id="tcs-interview-score" min="0" max="100" placeholder="e.g. 75">
                        </div>
                    </div>
                    <button class="tcs-analyze-btn" onclick="analyzeTcsPerformance()">Analyze TCS Level</button>
                    <div id="tcs-analysis-result" class="tcs-analysis-result"></div>
                </div>

                <div class="practice-btn-container">
                    <button class="practice-btn" onclick="showTcsAptitude()">ðŸŽ¯ Practice Common Aptitude Questions</button>
                </div>
            </div>
        `
    },
    infosys: {
        name: "Infosys",
        content: `
            <div class="company-detail">
                <h2>Overview of Infosys</h2>
                <ul>
                    <li><strong>Founded:</strong> 1981</li>
                    <li><strong>Headquarters:</strong> Bengaluru, India</li>
                    <li><strong>Industry:</strong> IT services, consulting, and digital transformation</li>
                    <li><strong>Known for:</strong> Strong fresher training, global delivery model, and enterprise technology services</li>
                </ul>
                <p>Infosys is one of the top MNCs targeted by fresh graduates because it offers structured learning, stable career growth, and opportunities across multiple technologies.</p>

                <h2>What Infosys Focuses On</h2>
                <ul>
                    <li>Application development and maintenance</li>
                    <li>Cloud services and digital transformation</li>
                    <li>Data analytics and AI solutions</li>
                    <li>Cybersecurity and enterprise platforms</li>
                    <li>Consulting for banking, retail, healthcare, and manufacturing clients</li>
                </ul>

                <h2>Common Infosys Hiring Flow</h2>
                <ol>
                    <li>Online application or campus drive</li>
                    <li>Aptitude and reasoning assessment</li>
                    <li>Programming or pseudo-code round</li>
                    <li>Technical interview</li>
                    <li>HR interview</li>
                </ol>

                <h2>Topics to Prepare</h2>
                <h3>Aptitude</h3>
                <ul>
                    <li>Percentages, ratios, averages, profit and loss</li>
                    <li>Time and work, time speed and distance</li>
                    <li>Logical reasoning, puzzles, syllogism, coding-decoding</li>
                    <li>Verbal ability, reading comprehension, sentence correction</li>
                </ul>

                <h3>Coding and Technical</h3>
                <ul>
                    <li>Arrays, strings, recursion, searching, sorting</li>
                    <li>OOP concepts and basic DBMS questions</li>
                    <li>Operating system and networking fundamentals</li>
                    <li>SQL basics and simple query writing</li>
                </ul>

                <h2>Why Students Choose Infosys</h2>
                <ul>
                    <li>Strong onboarding and training programs</li>
                    <li>Good entry point for software careers</li>
                    <li>Exposure to enterprise-level projects</li>
                    <li>Clear growth path for freshers</li>
                </ul>

                <h2>Interview Tips</h2>
                <ul>
                    <li>Be ready to explain your project clearly</li>
                    <li>Practice writing clean logic for basic coding problems</li>
                    <li>Strengthen communication for HR discussions</li>
                    <li>Revise core CS subjects and one programming language deeply</li>
                </ul>
            </div>
        `
    },
    wipro: {
        name: "Wipro",
        content: `
            <div class="company-detail">
                <h2>Overview of Wipro</h2>
                <ul>
                    <li><strong>Founded:</strong> 1945</li>
                    <li><strong>Headquarters:</strong> Bengaluru, India</li>
                    <li><strong>Industry:</strong> IT services, consulting, engineering, and business process services</li>
                    <li><strong>Known for:</strong> Large-scale campus hiring, digital transformation work, and fresher opportunities</li>
                </ul>
                <p>Wipro is a popular choice for campus placements because it hires across technical and service roles, making it a strong option for students from different backgrounds.</p>

                <h2>What Wipro Does</h2>
                <ul>
                    <li>Software development and testing</li>
                    <li>Cloud, AI, and automation solutions</li>
                    <li>Cybersecurity and infrastructure management</li>
                    <li>Data engineering and analytics</li>
                    <li>Enterprise consulting and support services</li>
                </ul>

                <h2>Typical Wipro Selection Process</h2>
                <ol>
                    <li>Registration through campus or career portal</li>
                    <li>Online aptitude, verbal, and logical reasoning test</li>
                    <li>Coding or written communication round depending on role</li>
                    <li>Technical interview</li>
                    <li>HR interview</li>
                </ol>

                <h2>Best Preparation Areas</h2>
                <h3>Aptitude and Reasoning</h3>
                <ul>
                    <li>Percentages, probability, ratio and proportion</li>
                    <li>Time and work, averages, number systems</li>
                    <li>Logical sequences, blood relations, seating arrangement</li>
                    <li>Grammar, vocabulary, and reading comprehension</li>
                </ul>

                <h3>Coding and Core Subjects</h3>
                <ul>
                    <li>Basic problem solving in C, C++, Java, or Python</li>
                    <li>Arrays, strings, functions, loops, and recursion</li>
                    <li>OOP, DBMS, OS, and computer networks basics</li>
                    <li>Simple SQL queries and joins</li>
                </ul>

                <h2>Why Wipro Is a Good Target</h2>
                <ul>
                    <li>Frequent fresher hiring opportunities</li>
                    <li>Wide range of technology domains</li>
                    <li>Good learning environment for beginners</li>
                    <li>Chance to move into cloud, testing, support, or development tracks</li>
                </ul>

                <h2>Tips to Crack Wipro</h2>
                <ul>
                    <li>Practice aptitude with speed and accuracy</li>
                    <li>Prepare clean answers for project and internship questions</li>
                    <li>Review one programming language thoroughly</li>
                    <li>Stay confident and answer in a structured way during interviews</li>
                </ul>
            </div>
        `
    },
    accenture: {
        name: "Accenture",
        content: `
            <div class="company-detail">
                <h2>Overview of Accenture</h2>
                <ul>
                    <li><strong>Headquarters:</strong> Dublin, Ireland</li>
                    <li><strong>Industry:</strong> Global professional services, consulting, technology, and operations</li>
                    <li><strong>Known for:</strong> Consulting-led technology services, innovation, and enterprise digital solutions</li>
                </ul>
                <p>Accenture is a strong MNC option for students who want a mix of technology, consulting exposure, and work on large global client projects.</p>

                <h2>Key Service Areas</h2>
                <ul>
                    <li>Application development and cloud transformation</li>
                    <li>Data, AI, and analytics</li>
                    <li>Consulting and business operations</li>
                    <li>Cybersecurity and infrastructure services</li>
                    <li>ERP and enterprise platform implementation</li>
                </ul>

                <h2>Common Hiring Rounds</h2>
                <ol>
                    <li>Application and eligibility screening</li>
                    <li>Cognitive and aptitude assessment</li>
                    <li>Coding or technical assessment</li>
                    <li>Communication or interview round</li>
                    <li>Final HR discussion</li>
                </ol>

                <h2>What to Prepare</h2>
                <div class="prepare-highlight">
                    <h3>What to Prepare</h3>
                    <div class="prepare-list">
                        <div class="prepare-item">Quantitative aptitude, reasoning, and verbal communication</div>
                        <div class="prepare-item">Programming basics and logic building</div>
                        <div class="prepare-item">OOP, DBMS, operating system, and networking concepts</div>
                        <div class="prepare-item">Project explanation, teamwork examples, and problem-solving mindset</div>
                    </div>
                </div>

                <h2>Why Many Candidates Prefer Accenture</h2>
                <ul>
                    <li>Global brand value</li>
                    <li>Strong learning ecosystem and certifications</li>
                    <li>Exposure to consulting and technology together</li>
                    <li>Opportunities in modern tech domains such as cloud and AI</li>
                </ul>

                <h2>Interview Tips</h2>
                <ul>
                    <li>Show strong communication and professional attitude</li>
                    <li>Answer behavioral questions with real examples</li>
                    <li>Be ready for basic coding and debugging logic</li>
                    <li>Understand your resume well and avoid vague answers</li>
                </ul>
            </div>
        `
    },
    cognizant: {
        name: "Cognizant",
        content: `
            <div class="company-detail">
                <h2>Overview of Cognizant</h2>
                <ul>
                    <li><strong>Headquarters:</strong> Teaneck, New Jersey, United States</li>
                    <li><strong>Industry:</strong> IT services and consulting</li>
                    <li><strong>Known for:</strong> Business-focused IT delivery, healthcare and BFSI presence, and strong fresher intake in India</li>
                </ul>
                <p>Cognizant is a practical target for placement preparation because it values problem solving, communication, and job readiness across both technical and service-oriented roles.</p>

                <h2>Main Work Areas</h2>
                <ul>
                    <li>Software engineering and quality assurance</li>
                    <li>Digital engineering and cloud services</li>
                    <li>Data analytics and automation</li>
                    <li>Enterprise application support</li>
                    <li>Industry solutions for healthcare, banking, insurance, and retail</li>
                </ul>

                <h2>Usual Recruitment Process</h2>
                <ol>
                    <li>Campus registration or online application</li>
                    <li>Aptitude, reasoning, and communication assessment</li>
                    <li>Coding round for technical roles</li>
                    <li>Technical interview</li>
                    <li>HR interview</li>
                </ol>

                <h2>Topics to Cover</h2>
                <ul>
                    <li>Arithmetic aptitude and logical reasoning</li>
                    <li>Verbal communication and grammar</li>
                    <li>Programming fundamentals in one language</li>
                    <li>Arrays, strings, sorting, searching, and basic data structures</li>
                    <li>DBMS, OOP, OS, and networking basics</li>
                </ul>

                <h2>Why Cognizant Is a Good Option</h2>
                <ul>
                    <li>Good number of fresher openings</li>
                    <li>Role variety across support, testing, and development</li>
                    <li>Industry exposure through global client accounts</li>
                    <li>Good platform to build early career experience</li>
                </ul>

                <h2>Preparation Tips</h2>
                <ul>
                    <li>Practice aptitude daily with timed tests</li>
                    <li>Prepare short, clear answers about your project</li>
                    <li>Revise coding basics and common interview questions</li>
                    <li>Improve spoken English and confidence for HR rounds</li>
                </ul>
            </div>
        `
    }
};

// Show company information
function showCompanyInfo(company) {
    const homeSection = document.getElementById('home');
    const companySection = document.getElementById('company-info');
    const companyContent = document.getElementById('company-content');
    
    homeSection.style.display = 'none';
    companySection.style.display = 'block';
    
    currentCompany = company;
    updateSectionContext();
    
    const roadmapMarkup = buildCompanyRoadmapMarkup(company);
    if (roadmapMarkup) {
        companyContent.innerHTML = roadmapMarkup;
        return;
    }

    const data = companyData[company];
    if (data) {
        companyContent.innerHTML = `<h1>${data.name}</h1>${data.content}`;
        enhanceCompanyLayout(companyContent, company);
    }
}

// Hide company information
function hideCompanyInfo() {
    currentCompany = null;
    showSection('mnc');
}

function enhanceCompanyLayout(companyContent, companyKey) {
    const detail = companyContent.querySelector('.company-detail');
    if (!detail || detail.dataset.enhanced === 'true') {
        return;
    }

    const children = Array.from(detail.children);
    if (!children.length) {
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'tcs-unique-grid';

    const nav = document.createElement('aside');
    nav.className = 'tcs-quick-nav';
    const companyName = companyData[companyKey]?.name || 'Company';
    nav.innerHTML = `<h3>${companyName} Map</h3><p>Jump to any section quickly.</p>`;

    const navLinks = document.createElement('div');
    navLinks.className = 'tcs-quick-links';

    const content = document.createElement('div');
    content.className = 'tcs-section-list';

    let i = 0;
    let cardNo = 0;
    while (i < children.length) {
        if (children[i].tagName !== 'H2') {
            i += 1;
            continue;
        }

        cardNo += 1;
        const card = document.createElement('section');
        card.className = 'tcs-section-card';
        card.id = `tcs-section-${cardNo}`;

        const link = document.createElement('a');
        link.href = `#${card.id}`;
        link.textContent = `${cardNo}. ${children[i].textContent.trim()}`;
        navLinks.appendChild(link);

        while (i < children.length) {
            if (children[i].tagName === 'H2' && card.children.length > 0) {
                break;
            }
            card.appendChild(children[i]);
            i += 1;
        }

        content.appendChild(card);
    }

    nav.appendChild(navLinks);
    grid.appendChild(nav);
    grid.appendChild(content);

    detail.classList.add('tcs-unique-detail');
    detail.innerHTML = '';
    detail.appendChild(grid);
    detail.dataset.enhanced = 'true';
}

// Show TCS aptitude section
function showTcsAptitude() {
    currentCompany = 'tcs';
    showSection('aptitude');
}



// Show TCS aptitude topics from main Aptitude section
function showTcsAptitudeTopics() {
    currentCompany = 'tcs';
    updateSectionContext();
    showCompanyAptitudeTopics('tcs');
}

// Hide TCS aptitude topics and show regular categories
function hideTcsAptitudeTopics() {
    if (currentCompany) {
        showCompanyAptitudeTopics(currentCompany);
    } else {
        resetAptitudeView();
    }
}

// Load TCS aptitude questions by topic
async function loadTcsAptitude(topic) {
    return loadCompanyAptitude('tcs', topic);
}

// Display TCS aptitude questions in main aptitude section
function displayTcsAptitudeQuestionsInMain(questions, topic) {
    displayCompanyAptitudeQuestions(questions, topic, 'tcs');
}

// Check TCS answer
function checkTcsAnswer(questionId, selected, correct, topic, explanation) {
    checkCompanyAnswer(`company-result-${questionId}`, selected, correct, explanation);
}

async function showCompanyAptitudeTopics(company) {
    const aptitudeContainer = document.getElementById('aptitude-container');
    const aptitudeCategories = document.getElementById('aptitude-categories');
    const companyName = companyData[company]?.name || company;

    if (aptitudeCategories) {
        aptitudeCategories.style.display = 'none';
    }

    const showcaseMarkup = renderCompanyAptitudeShowcase(company);
    if (showcaseMarkup) {
        aptitudeContainer.innerHTML = showcaseMarkup;
        return;
    }

    aptitudeContainer.innerHTML = `<p>Loading ${companyName} aptitude topics...</p>`;

    try {
        const response = await fetch(`${API_BASE}/company/${company}/aptitude/topics`);
        const topics = await response.json();

        aptitudeContainer.innerHTML = `
            <h3>${companyName} Aptitude Topics</h3>
            <p class="subtitle">Select a topic to practice ${companyName}-focused aptitude questions.</p>
            <div class="topic-buttons">
                ${topics.map(topic => `<button onclick="loadCompanyAptitude('${company}', '${topic.key}', '${topic.label.replace(/'/g, "\\'")}')">${topic.label}</button>`).join('')}
            </div>
            <button class="back-btn" onclick="hideTcsAptitudeTopics()" style="margin-top: 20px;">â† Back to ${companyName} Topics</button>
        `;
    } catch (error) {
        aptitudeContainer.innerHTML = '<p class="error">Unable to load aptitude topics right now.</p>';
        console.error('Error loading company aptitude topics:', error);
    }
}

async function loadCompanyAptitude(company, topic, label) {
    try {
        const response = await fetch(`${API_BASE}/company/${company}/aptitude/${topic}`);
        const questions = await response.json();
        if (!Array.isArray(questions)) {
            throw new Error('Unable to load aptitude questions for this topic.');
        }
        displayCompanyAptitudeQuestions(questions, label || topic, company);
    } catch (error) {
        console.error('Error loading company aptitude questions:', error);
        const container = document.getElementById('aptitude-container');
        if (container) {
            container.innerHTML = '<p class="error">Unable to load aptitude questions right now.</p>';
        }
    }
}

function displayCompanyAptitudeQuestions(questions, topicLabel, company) {
    const container = document.getElementById('aptitude-container');
    const companyName = companyData[company]?.name || company;
    const normalizedLabel = String(topicLabel).replace(/_/g, ' ');
    const topicKey = Object.keys(tcsAptitudeTopicContent).find(
        key => tcsAptitudeTopicContent[key].title === topicLabel || key === topicLabel
    );

    if (company === 'tcs' && topicKey) {
        currentTcsPracticeState[topicKey] = {
            topicLabel: normalizedLabel,
            questions: questions.map(question => ({ ...question }))
        };
        const topicMarkup = buildTcsAptitudeTopicMarkup(topicKey, questions, normalizedLabel);
        if (topicMarkup) {
            container.innerHTML = topicMarkup;
            return;
        }
    }

    container.innerHTML = `
        <h3>${companyName} - ${normalizedLabel}</h3>
        <p class="subtitle">Practice the following ${companyName}-focused questions and check your answers instantly.</p>
        <button class="back-btn" onclick="showCompanyAptitudeTopics('${company}')" style="margin-bottom: 20px;">â† Back to ${companyName} Topics</button>
    `;

    questions.forEach(q => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <h4>Question ${q.id}</h4>
            <p>${q.question}</p>
            <div class="options">
                ${q.options.map(opt => `
                    <button onclick="checkCompanyAnswer('company-result-${q.id}', '${escapeJsString(opt)}', '${escapeJsString(q.answer)}', '${escapeJsString(q.explanation || '')}')">${opt}</button>
                `).join('')}
            </div>
            <div id="company-result-${q.id}" class="result"></div>
        `;
        container.appendChild(questionDiv);
    });
}

function checkCompanyAnswer(resultId, selected, correct, explanation) {
    const resultDiv = document.getElementById(resultId);
    if (!resultDiv) {
        return;
    }

    if (selected === correct) {
        resultDiv.innerHTML = '<span class="correct">âœ… Correct!</span>';
    } else {
        resultDiv.innerHTML = `<span class="incorrect">âŒ Incorrect. Correct answer: ${correct}</span>`;
        if (explanation) {
            resultDiv.innerHTML += `<div class="explanation"><strong>Explanation:</strong> ${explanation}</div>`;
        }
    }
}

function escapeJsString(value) {
    return String(value)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, ' ');
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Load aptitude questions by category
async function loadAptitude(category) {
    try {
        const response = await fetch(`${API_BASE}/aptitude/${category}`);
        const questions = await response.json();
        displayAptitudeQuestions(questions);
    } catch (error) {
        console.error('Error loading aptitude questions:', error);
    }
}

// Load random aptitude question
async function loadRandomAptitude() {
    try {
        const response = await fetch(`${API_BASE}/aptitude/random`);
        const question = await response.json();
        displayAptitudeQuestions([question]);
    } catch (error) {
        console.error('Error loading random aptitude question:', error);
    }
}

// Display aptitude questions
function displayAptitudeQuestions(questions) {
    const container = document.getElementById('aptitude-container');
    container.innerHTML = '';
    
    questions.forEach(q => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <h3>Question ${q.id}</h3>
            <p>${q.question}</p>
            <div class="options">
                ${q.options.map((opt, idx) => `
                    <button onclick="checkAnswer(${q.id}, '${opt}', '${q.answer}', '${q.explanation || ''}')">${opt}</button>
                `).join('')}
            </div>
            <div id="result-${q.id}" class="result"></div>
        `;
        container.appendChild(questionDiv);
    });
}

// Check answer
function checkAnswer(questionId, selected, correct, explanation) {
    const resultDiv = document.getElementById(`result-${questionId}`);
    if (selected === correct) {
        resultDiv.innerHTML = '<span class="correct">âœ… Correct!</span>';
    } else {
        resultDiv.innerHTML = `<span class="incorrect">âŒ Incorrect. Correct answer: ${correct}</span>`;
        if (explanation) {
            resultDiv.innerHTML += `<div class="explanation"><strong>Explanation:</strong> ${explanation}</div>`;
        }
    }
}

function updateAuthButtonState(user) {
    const authButton = document.getElementById('auth-button');
    const profileMenu = document.getElementById('profile-menu');
    const profileTrigger = document.getElementById('profile-trigger');
    if (!authButton) {
        return;
    }

    if (!firebaseAuth) {
        if (profileMenu) {
            profileMenu.style.display = 'none';
        }
        setProfileMenuOpen(false);
        authButton.textContent = 'Setup Firebase';
        authButton.title = 'Firebase config is missing. Update frontend/js/firebase-config.js';
        authButton.style.display = 'inline-flex';
        return;
    }

    if (user) {
        authButton.style.display = 'none';
        if (profileMenu) {
            profileMenu.style.display = 'block';
        }
        updateProfileMenuContent(user);
        if (profileTrigger) {
            profileTrigger.title = `Signed in as ${user.email || user.uid}`;
        }
        return;
    }

    authButton.style.display = 'inline-flex';
    authButton.textContent = 'Log In';
    authButton.title = 'Sign in to sync your data';
    if (profileMenu) {
        profileMenu.style.display = 'none';
    }
    setProfileMenuOpen(false);
}

function getCareerStateDocRef() {
    if (!firestoreDb || !activeUserId) {
        return null;
    }

    return firestoreDb
        .collection('users')
        .doc(activeUserId)
        .collection('career')
        .doc('dashboard_state');
}

function getUserHistoryDocRef() {
    if (!firestoreDb || !activeUserId) {
        return null;
    }

    return firestoreDb
        .collection('users')
        .doc(activeUserId)
        .collection('history')
        .doc('activity');
}

function normalizeHistoryState(payload) {
    const source = payload && typeof payload === 'object' ? payload : {};
    return {
        mncMockTests: Array.isArray(source.mncMockTests) ? source.mncMockTests : [],
        aiInterviews: Array.isArray(source.aiInterviews) ? source.aiInterviews : []
    };
}

function trimHistoryEntries(entries, maxItems = 50) {
    if (!Array.isArray(entries)) {
        return [];
    }
    return entries.slice(-maxItems);
}

function loadUserHistoryFromLocal() {
    try {
        const savedHistory = localStorage.getItem(USER_HISTORY_STORAGE_KEY);
        if (!savedHistory) {
            return;
        }
        userHistoryState = normalizeHistoryState(JSON.parse(savedHistory));
    } catch (error) {
        console.error('Unable to restore user history:', error);
    }
}

async function loadUserHistoryFromCloud() {
    const historyDoc = getUserHistoryDocRef();
    if (!historyDoc) {
        return null;
    }

    try {
        const snapshot = await historyDoc.get();
        if (!snapshot.exists) {
            return null;
        }
        return normalizeHistoryState(snapshot.data());
    } catch (error) {
        console.error('Unable to load user history from Firestore:', error);
        return null;
    }
}

async function loadUserHistory() {
    loadUserHistoryFromLocal();
    const cloudHistory = await loadUserHistoryFromCloud();
    if (cloudHistory) {
        userHistoryState = cloudHistory;
        persistUserHistoryLocalOnly();
    }
    if (firebaseAuth && firebaseAuth.currentUser) {
        updateProfileMenuContent(firebaseAuth.currentUser);
    }
    refreshProfileSectionIfVisible();
}

function persistUserHistoryLocalOnly() {
    try {
        localStorage.setItem(USER_HISTORY_STORAGE_KEY, JSON.stringify(userHistoryState));
    } catch (error) {
        console.error('Unable to save user history locally:', error);
    }
}

async function saveUserHistoryToCloud() {
    const historyDoc = getUserHistoryDocRef();
    if (!historyDoc) {
        return;
    }

    try {
        await historyDoc.set(
            {
                ...userHistoryState,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            { merge: true }
        );
    } catch (error) {
        console.error('Unable to save user history to Firestore:', error);
    }
}

function saveUserHistory() {
    persistUserHistoryLocalOnly();
    saveUserHistoryToCloud();
    if (firebaseAuth && firebaseAuth.currentUser) {
        updateProfileMenuContent(firebaseAuth.currentUser);
    }
    refreshProfileSectionIfVisible();
}

function recordMncMockTestHistory(entry) {
    const payload = entry && typeof entry === 'object' ? entry : {};
    userHistoryState.mncMockTests = trimHistoryEntries([
        ...userHistoryState.mncMockTests,
        {
            ...payload,
            createdAt: new Date().toISOString()
        }
    ]);
    saveUserHistory();
}

function recordAiInterviewHistory(entry) {
    const payload = entry && typeof entry === 'object' ? entry : {};
    userHistoryState.aiInterviews = trimHistoryEntries([
        ...userHistoryState.aiInterviews,
        {
            ...payload,
            createdAt: new Date().toISOString()
        }
    ]);
    saveUserHistory();
}

function loadCareerStateFromLocal() {
    try {
        const savedState = localStorage.getItem(CAREER_STATE_STORAGE_KEY);
        if (!savedState) {
            return;
        }

        const parsed = JSON.parse(savedState);
        careerToolState = {
            ...careerToolState,
            ...parsed
        };
    } catch (error) {
        console.error('Unable to restore career state:', error);
    }
}

async function loadCareerStateFromCloud() {
    const stateDoc = getCareerStateDocRef();
    if (!stateDoc) {
        return null;
    }

    try {
        const snapshot = await stateDoc.get();
        if (!snapshot.exists) {
            return null;
        }

        return snapshot.data();
    } catch (error) {
        console.error('Unable to load career state from Firestore:', error);
        return null;
    }
}

async function loadCareerState() {
    loadCareerStateFromLocal();

    const cloudState = await loadCareerStateFromCloud();
    if (cloudState) {
        careerToolState = {
            ...careerToolState,
            ...cloudState
        };
        persistCareerStateLocalOnly();
    }
}

function persistCareerStateLocalOnly() {
    try {
        localStorage.setItem(CAREER_STATE_STORAGE_KEY, JSON.stringify(careerToolState));
    } catch (error) {
        console.error('Unable to save career state:', error);
    }
}

async function saveCareerStateToCloud() {
    const stateDoc = getCareerStateDocRef();
    if (!stateDoc) {
        return;
    }

    try {
        await stateDoc.set(
            {
                ...careerToolState,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            { merge: true }
        );
    } catch (error) {
        console.error('Unable to save career state to Firestore:', error);
    }
}

function saveCareerState() {
    persistCareerStateLocalOnly();
    saveCareerStateToCloud();
}

async function toggleAuthSession() {
    if (!firebaseAuth) {
        alert('Firebase is not configured yet. Add real keys in frontend/js/firebase-config.js, then refresh.');
        return;
    }

    try {
        if (firebaseAuth.currentUser) {
            await firebaseAuth.signOut();
            return;
        }
        openAuthModal('login');
    } catch (error) {
        console.error('Auth action failed:', error);
        alert(`Authentication failed: ${error.code || 'unknown_error'}. Check Firebase Auth settings and authorized domain.`);
    }
}

function getProfileDisplayName(user) {
    if (!user) {
        return 'User';
    }
    if (user.email) {
        return user.email;
    }
    return `User ${user.uid ? user.uid.slice(0, 6) : ''}`;
}

function getProfileInitial(user) {
    const display = getProfileDisplayName(user);
    return display.charAt(0).toUpperCase();
}

function updateProfileMenuContent(user) {
    const avatar = document.getElementById('profile-avatar');
    const label = document.getElementById('profile-user-label');
    const subtitle = document.getElementById('profile-user-subtitle');
    const testLevel = document.getElementById('profile-test-level');
    const attempts = document.getElementById('profile-test-attempts');
    const average = document.getElementById('profile-test-average');
    const best = document.getElementById('profile-test-best');
    const profile = getUserTestLevelProfile();

    if (avatar) {
        avatar.textContent = getProfileInitial(user);
    }
    if (label) {
        label.textContent = getProfileDisplayName(user);
    }
    if (subtitle) {
        subtitle.textContent = user ? `Synced as ${user.uid.slice(0, 8)}...` : 'Not synced';
    }
    if (testLevel) {
        testLevel.textContent = profile.level;
    }
    if (attempts) {
        attempts.textContent = String(profile.attempts);
    }
    if (average) {
        average.textContent = profile.average === null ? 'No data' : `${profile.average}%`;
    }
    if (best) {
        best.textContent = profile.best === null ? 'No data' : `${profile.best}%`;
    }
}

function setProfileMenuOpen(isOpen) {
    const dropdown = document.getElementById('profile-dropdown');
    const trigger = document.getElementById('profile-trigger');
    if (!dropdown || !trigger) {
        return;
    }

    dropdown.style.display = isOpen ? 'block' : 'none';
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function bindProfileMenuEvents() {
    const profileMenu = document.getElementById('profile-menu');
    const trigger = document.getElementById('profile-trigger');
    const dropdown = document.getElementById('profile-dropdown');
    const profileBtn = document.getElementById('profile-view-btn');
    const logoutBtn = document.getElementById('profile-logout-btn');

    if (!profileMenu || !trigger || !dropdown || profileMenu.dataset.bound === 'true') {
        return;
    }

    trigger.addEventListener('click', event => {
        event.stopPropagation();
        const isOpen = dropdown.style.display === 'block';
        setProfileMenuOpen(!isOpen);
    });

    profileBtn?.addEventListener('click', () => {
        setProfileMenuOpen(false);
        showSection('profile');
    });

    logoutBtn?.addEventListener('click', async () => {
        setProfileMenuOpen(false);
        if (firebaseAuth && firebaseAuth.currentUser) {
            await firebaseAuth.signOut();
        }
    });

    document.addEventListener('click', event => {
        if (!profileMenu.contains(event.target)) {
            setProfileMenuOpen(false);
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            setProfileMenuOpen(false);
        }
    });

    profileMenu.dataset.bound = 'true';
}

function setAuthModalStatus(message, isError = false) {
    const status = document.getElementById('auth-form-status');
    if (!status) {
        return;
    }

    status.textContent = message || '';
    status.classList.toggle('is-error', !!isError);
}

function setAuthMode(mode) {
    currentAuthMode = mode === 'signup' ? 'signup' : 'login';

    const modal = document.getElementById('auth-modal');
    const title = document.getElementById('auth-modal-title');
    const subtitle = document.getElementById('auth-modal-subtitle');
    const submit = document.getElementById('auth-submit-btn');
    const passwordInput = document.getElementById('auth-password');
    const switchText = document.getElementById('auth-switch-text');
    const switchBtn = document.getElementById('auth-switch-btn');
    const tabLogin = document.getElementById('auth-tab-login');
    const tabSignup = document.getElementById('auth-tab-signup');

    if (!modal || !title || !subtitle || !submit || !switchText || !switchBtn || !tabLogin || !tabSignup || !passwordInput) {
        return;
    }

    const isSignup = currentAuthMode === 'signup';
    modal.setAttribute('data-mode', currentAuthMode);
    title.textContent = isSignup ? 'Create Account' : 'Welcome Back';
    subtitle.textContent = isSignup
        ? 'Create your account to sync your progress.'
        : 'Log in to continue your learning journey.';
    submit.textContent = isSignup ? 'Create Account' : 'Log In';
    passwordInput.setAttribute('autocomplete', isSignup ? 'new-password' : 'current-password');
    switchText.textContent = isSignup ? 'Already have an account?' : "Don't have an account?";
    switchBtn.textContent = isSignup ? 'Log In' : 'Sign Up';
    tabLogin.classList.toggle('active', !isSignup);
    tabSignup.classList.toggle('active', isSignup);
    setAuthModalStatus('');
}

function openAuthModal(mode = 'login') {
    const modal = document.getElementById('auth-modal');
    if (!modal) {
        return;
    }

    setAuthMode(mode);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('auth-modal-open');

    const emailInput = document.getElementById('auth-email');
    if (emailInput) {
        emailInput.focus();
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    const form = document.getElementById('auth-form');
    if (!modal) {
        return;
    }

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('auth-modal-open');
    setAuthModalStatus('');
    if (form) {
        form.reset();
    }
}

function bindAuthModalEvents() {
    const modal = document.getElementById('auth-modal');
    const form = document.getElementById('auth-form');
    const closeBtn = document.getElementById('auth-close-btn');
    const switchBtn = document.getElementById('auth-switch-btn');
    const tabLogin = document.getElementById('auth-tab-login');
    const tabSignup = document.getElementById('auth-tab-signup');

    if (!modal || modal.dataset.bound === 'true') {
        return;
    }

    if (form) {
        form.addEventListener('submit', handleAuthFormSubmit);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeAuthModal);
    }

    if (switchBtn) {
        switchBtn.addEventListener('click', () => {
            setAuthMode(currentAuthMode === 'signup' ? 'login' : 'signup');
        });
    }

    if (tabLogin) {
        tabLogin.addEventListener('click', () => setAuthMode('login'));
    }

    if (tabSignup) {
        tabSignup.addEventListener('click', () => setAuthMode('signup'));
    }

    modal.addEventListener('click', event => {
        if (event.target === modal) {
            closeAuthModal();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeAuthModal();
        }
    });

    modal.dataset.bound = 'true';
}

async function handleAuthFormSubmit(event) {
    event.preventDefault();

    if (!firebaseAuth) {
        setAuthModalStatus('Firebase is not configured yet.', true);
        return;
    }

    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');
    const submitBtn = document.getElementById('auth-submit-btn');

    if (!emailInput || !passwordInput || !submitBtn) {
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email.includes('@')) {
        setAuthModalStatus('Please enter a valid email address.', true);
        return;
    }

    if (password.length < 6) {
        setAuthModalStatus('Password must be at least 6 characters.', true);
        return;
    }

    submitBtn.disabled = true;
    setAuthModalStatus(currentAuthMode === 'signup' ? 'Creating account...' : 'Logging in...');

    try {
        if (currentAuthMode === 'signup') {
            await firebaseAuth.createUserWithEmailAndPassword(email, password);
        } else {
            await firebaseAuth.signInWithEmailAndPassword(email, password);
        }
        closeAuthModal();
    } catch (error) {
        console.error('Email auth failed:', error);
        if (error && error.code === 'auth/operation-not-allowed') {
            setAuthModalStatus('Enable Email/Password in Firebase Authentication -> Sign-in method.', true);
        } else {
            setAuthModalStatus(`Authentication failed: ${error.code || 'unknown_error'}`, true);
        }
    } finally {
        submitBtn.disabled = false;
    }
}

function initFirebaseClient() {
    const firebaseConfig = window.FIREBASE_CONFIG;
    const authButton = document.getElementById('auth-button');
    bindAuthModalEvents();
    bindProfileMenuEvents();

    if (authButton && authButton.dataset.bound !== 'true') {
        authButton.addEventListener('click', toggleAuthSession);
        authButton.dataset.bound = 'true';
    }

    if (!window.firebase || !firebaseConfig) {
        updateAuthButtonState(null);
        return;
    }

    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY' || !firebaseConfig.projectId || firebaseConfig.projectId === 'YOUR_PROJECT_ID') {
        console.warn('Firebase config is not set. Using local storage mode.');
        updateAuthButtonState(null);
        return;
    }

    try {
        firebaseAppInstance = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
        firebaseAuth = firebaseAppInstance.auth();
        firestoreDb = firebaseAppInstance.firestore();

        firebaseAuth.onAuthStateChanged(async user => {
            activeUserId = user ? user.uid : null;
            updateAuthButtonState(user);
            await loadCareerState();
            await loadUserHistory();
            if (codingMode === 'career-tools') {
                renderCareerToolsHome();
            }
        });
        updateAuthButtonState(firebaseAuth.currentUser);
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        updateAuthButtonState(null);
    }
}

function getCareerOverallScore() {
    return Math.round((careerToolState.resumeScore + careerToolState.coverLetterScore + careerToolState.jobApplyScore) / 3);
}

function getCareerProgressPercent() {
    if (!careerToolState.tasksTotal) {
        return 0;
    }

    return Math.min(100, Math.round((careerToolState.tasksCompleted / careerToolState.tasksTotal) * 100));
}

function getMockTestAverage() {
    const tests = Array.isArray(userHistoryState.mncMockTests) ? userHistoryState.mncMockTests : [];
    if (!tests.length) {
        return null;
    }
    const total = tests.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0);
    return Math.round(total / tests.length);
}

function getInterviewReadinessAverage() {
    const rounds = Array.isArray(userHistoryState.aiInterviews) ? userHistoryState.aiInterviews : [];
    if (!rounds.length) {
        return null;
    }
    const total = rounds.reduce((sum, item) => sum + (Number(item.readiness) || 0), 0);
    return Math.round(total / rounds.length);
}

function getUserTestLevelProfile() {
    const tests = Array.isArray(userHistoryState.mncMockTests) ? userHistoryState.mncMockTests : [];
    if (!tests.length) {
        return {
            level: 'Not Started',
            attempts: 0,
            average: null,
            best: null,
            latest: null
        };
    }

    const percentages = tests.map(item => Number(item.percentage) || 0);
    const average = Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length);
    const best = Math.max(...percentages);
    const latest = percentages[percentages.length - 1];

    let level = 'Beginner';
    if (average >= 85) {
        level = 'Expert';
    } else if (average >= 70) {
        level = 'Advanced';
    } else if (average >= 50) {
        level = 'Intermediate';
    }

    return {
        level,
        attempts: tests.length,
        average,
        best,
        latest
    };
}

function formatDateLabel(input) {
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) {
        return '-';
    }
    return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getRecentTestPerformanceSeries(limit = 8) {
    const tests = Array.isArray(userHistoryState.mncMockTests) ? userHistoryState.mncMockTests : [];
    const recent = tests.slice(-limit);
    return recent.map((item, index) => ({
        label: item.companyName ? `${item.companyName.split(' ')[0]}-${index + 1}` : `Test ${index + 1}`,
        value: Number(item.percentage) || 0,
        meta: formatDateLabel(item.createdAt)
    }));
}

function getRecentInterviewSeries(limit = 8) {
    const rounds = Array.isArray(userHistoryState.aiInterviews) ? userHistoryState.aiInterviews : [];
    const recent = rounds.slice(-limit);
    return recent.map((item, index) => ({
        label: `${(item.category || 'Round').toUpperCase()}-${index + 1}`,
        value: Number(item.readiness) || 0,
        meta: formatDateLabel(item.createdAt)
    }));
}

function getWeeklyUsageSeries(days = 7) {
    const buckets = [];
    const counts = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i -= 1) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const key = day.toISOString().slice(0, 10);
        counts[key] = 0;
        buckets.push({
            key,
            label: day.toLocaleDateString(undefined, { weekday: 'short' })
        });
    }

    const addEntry = (entry) => {
        if (!entry || !entry.createdAt) {
            return;
        }
        const d = new Date(entry.createdAt);
        if (Number.isNaN(d.getTime())) {
            return;
        }
        const key = d.toISOString().slice(0, 10);
        if (Object.prototype.hasOwnProperty.call(counts, key)) {
            counts[key] += 1;
        }
    };

    (userHistoryState.mncMockTests || []).forEach(addEntry);
    (userHistoryState.aiInterviews || []).forEach(addEntry);

    return buckets.map(item => ({
        label: item.label,
        value: counts[item.key],
        meta: `${counts[item.key]} activities`
    }));
}

function getWeeklyScoreSeries(days = 7) {
    const buckets = [];
    const scores = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i -= 1) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const key = day.toISOString().slice(0, 10);
        scores[key] = { total: 0, count: 0, mockTests: 0, interviews: 0 };
        buckets.push({
            key,
            label: day.toLocaleDateString(undefined, { weekday: 'short' })
        });
    }

    (userHistoryState.mncMockTests || []).forEach(entry => {
        if (!entry || !entry.createdAt || entry.percentage === undefined) return;
        const d = new Date(entry.createdAt);
        if (Number.isNaN(d.getTime())) return;
        const key = d.toISOString().slice(0, 10);
        if (!Object.prototype.hasOwnProperty.call(scores, key)) return;
        scores[key].total += Number(entry.percentage);
        scores[key].count += 1;
        scores[key].mockTests += 1;
    });

    (userHistoryState.aiInterviews || []).forEach(entry => {
        if (!entry || !entry.createdAt || entry.readiness === undefined) return;
        const d = new Date(entry.createdAt);
        if (Number.isNaN(d.getTime())) return;
        const key = d.toISOString().slice(0, 10);
        if (!Object.prototype.hasOwnProperty.call(scores, key)) return;
        scores[key].total += Number(entry.readiness);
        scores[key].count += 1;
        scores[key].interviews += 1;
    });

    return buckets.map(item => {
        const dayData = scores[item.key];
        const avgScore = dayData.count > 0 ? Math.round(dayData.total / dayData.count) : 0;
        const meta = dayData.count > 0 
            ? `${dayData.mockTests} test${dayData.mockTests !== 1 ? 's' : ''}, ${dayData.interviews} interview${dayData.interviews !== 1 ? 's' : ''}`
            : 'No activity';
        return {
            label: item.label,
            value: avgScore,
            meta: meta,
            hasData: dayData.count > 0
        };
    });
}

function getCareerPerformanceTrendSeries(limit = 10) {
    const entries = [];
    const tests = Array.isArray(userHistoryState.mncMockTests) ? userHistoryState.mncMockTests : [];
    const rounds = Array.isArray(userHistoryState.aiInterviews) ? userHistoryState.aiInterviews : [];

    tests.forEach((item, index) => {
        const score = Number(item.percentage);
        if (!Number.isFinite(score)) {
            return;
        }
        const createdAt = item.createdAt || '';
        entries.push({
            value: Math.max(0, Math.min(100, Math.round(score))),
            createdAt,
            label: formatDateLabel(createdAt) || `Test ${index + 1}`,
            meta: item.companyName ? `${item.companyName} Test` : 'Mock Test'
        });
    });

    rounds.forEach((item, index) => {
        const score = Number(item.readiness);
        if (!Number.isFinite(score)) {
            return;
        }
        const createdAt = item.createdAt || '';
        entries.push({
            value: Math.max(0, Math.min(100, Math.round(score))),
            createdAt,
            label: formatDateLabel(createdAt) || `Round ${index + 1}`,
            meta: item.category ? `${item.category.toUpperCase()} Interview` : 'Interview'
        });
    });

    return entries
        .sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return (Number.isFinite(timeA) ? timeA : 0) - (Number.isFinite(timeB) ? timeB : 0);
        })
        .slice(-limit)
        .map((entry, index) => ({
            label: entry.label === '-' ? `Attempt ${index + 1}` : entry.label,
            value: entry.value,
            meta: entry.meta
        }));
}

function renderProfileBarChart(items, options = {}) {
    const maxValue = options.maxValue || Math.max(1, ...items.map(item => item.value));
    const emptyText = options.emptyText || 'No data yet.';
    const className = options.className || '';

    if (!items.length) {
        return `<div class="profile-chart-empty">${emptyText}</div>`;
    }

    return `
        <div class="profile-bar-chart ${className}">
            ${items.map(item => {
                const height = Math.max(8, Math.round((item.value / maxValue) * 100));
                return `
                    <div class="profile-bar-item" title="${item.label}: ${item.value}">
                        <div class="profile-bar-track">
                            <span class="profile-bar-fill" style="height:${height}%"></span>
                        </div>
                        <strong>${item.value}</strong>
                        <span>${escapeHtml(item.label)}</span>
                        <small>${escapeHtml(item.meta || '')}</small>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderUserProfileAnalytics() {
    const container = document.getElementById('profile-content');
    if (!container) {
        return;
    }

    const testLevel = getUserTestLevelProfile();
    const testSeries = getRecentTestPerformanceSeries();
    const interviewSeries = getRecentInterviewSeries();
    const usageSeries = getWeeklyUsageSeries();
    const mockAverage = getMockTestAverage();
    const interviewAverage = getInterviewReadinessAverage();
    const totalUsage = (userHistoryState.mncMockTests?.length || 0) + (userHistoryState.aiInterviews?.length || 0);

    container.innerHTML = `
        <div class="profile-analytics-shell">
            <div class="profile-quick-grid">
                <article class="profile-quick-card">
                    <h3>User Level</h3>
                    <strong>${testLevel.level}</strong>
                    <p>Attempts: ${testLevel.attempts}</p>
                </article>
                <article class="profile-quick-card">
                    <h3>Mock Test Average</h3>
                    <strong>${mockAverage === null ? 'No data' : `${mockAverage}%`}</strong>
                    <p>Best: ${testLevel.best === null ? 'No data' : `${testLevel.best}%`}</p>
                </article>
                <article class="profile-quick-card">
                    <h3>Interview Readiness</h3>
                    <strong>${interviewAverage === null ? 'No data' : `${interviewAverage}%`}</strong>
                    <p>Total rounds: ${userHistoryState.aiInterviews?.length || 0}</p>
                </article>
                <article class="profile-quick-card">
                    <h3>Total Usage</h3>
                    <strong>${totalUsage}</strong>
                    <p>Tests + Interviews completed</p>
                </article>
            </div>

            <div class="profile-graph-grid">
                <article class="profile-graph-card">
                    <h4>Recent Mock Test Performance</h4>
                    ${renderProfileBarChart(testSeries, { maxValue: 100, emptyText: 'No mock test attempts yet.' })}
                </article>
                <article class="profile-graph-card">
                    <h4>Recent Interview Performance</h4>
                    ${renderProfileBarChart(interviewSeries, { maxValue: 100, emptyText: 'No interview attempts yet.' })}
                </article>
                <article class="profile-graph-card profile-graph-card-wide">
                    <h4>Weekly Usage Activity</h4>
                    ${renderProfileBarChart(usageSeries, { emptyText: 'No activity in the selected period.', className: 'usage-chart' })}
                </article>
            </div>
        </div>
    `;
}

function refreshProfileSectionIfVisible() {
    const profileSection = document.getElementById('profile');
    if (profileSection && profileSection.style.display === 'block') {
        renderUserProfileAnalytics();
    }
}

function buildCareerRecommendations() {
    const toolScores = [
        { key: 'resume', label: 'Resume', score: careerToolState.resumeScore },
        { key: 'cover-letter', label: 'Cover Letter', score: careerToolState.coverLetterScore },
        { key: 'auto-apply', label: 'Auto Apply', score: careerToolState.jobApplyScore }
    ];
    const sortedByScore = [...toolScores].sort((a, b) => a.score - b.score);
    const strongest = sortedByScore[sortedByScore.length - 1];
    const focus = sortedByScore[0];
    const recommendations = [];

    if (focus.key === 'resume') {
        recommendations.push('Improve resume quality with measurable project outcomes and role-specific keywords.');
    } else if (focus.key === 'cover-letter') {
        recommendations.push('Generate cover letters tailored to each company and role before applying.');
    } else {
        recommendations.push('Increase daily outreach and keep auto-apply target realistic to sustain consistency.');
    }

    if (careerToolState.applicationsSent < careerToolState.weeklyTarget) {
        recommendations.push('Application volume is below target. Complete one outreach sprint today.');
    } else {
        recommendations.push('Great consistency on applications. Focus now on interview-ready responses.');
    }

    const interviewAvg = getInterviewReadinessAverage();
    if (interviewAvg !== null && interviewAvg < 60) {
        recommendations.push('Interview depth is low; practice STAR-format answers in mock interview rounds.');
    }

    const mockAvg = getMockTestAverage();
    if (mockAvg !== null && mockAvg < 60) {
        recommendations.push('MNC mock score is below target; revise aptitude fundamentals and coding basics.');
    }

    return {
        strongest,
        focus,
        recommendations
    };
}

function getCareerLeaderboardData() {
    const yourScore = getCareerOverallScore();
    const baseline = [
        { rank: 1, name: 'Riya S', points: 970, streak: 26, badge: 'Legend' },
        { rank: 2, name: 'Arjun K', points: 940, streak: 21, badge: 'Pro' },
        { rank: 3, name: 'Meera V', points: 910, streak: 18, badge: 'Pro' }
    ];
    const yourEntry = {
        rank: 4,
        name: 'You',
        points: 700 + yourScore * 2,
        streak: Math.max(1, Math.ceil(careerToolState.tasksCompleted / 2)),
        badge: yourScore >= 75 ? 'Pro' : yourScore >= 50 ? 'Rising' : 'Starter',
        isYou: true
    };
    const fifthEntry = { rank: 5, name: 'Kavin P', points: 690, streak: 5, badge: 'Starter' };

    return [...baseline, yourEntry, fifthEntry];
}

function renderCareerToolsDashboard() {
    const progress = getCareerProgressPercent();
    const score = getCareerOverallScore();
    const leaderboard = getCareerLeaderboardData();
    const testLevel = getUserTestLevelProfile();
    const mockAverage = getMockTestAverage();
    const interviewAverage = getInterviewReadinessAverage();
    const trendSeries = getCareerPerformanceTrendSeries(8);
    const weeklyScoreSeries = getWeeklyScoreSeries(7);
    const mncTestsCount = userHistoryState.mncMockTests.length;
    const interviewsCount = userHistoryState.aiInterviews.length;
    const { strongest, focus, recommendations } = buildCareerRecommendations();
    const syncLabel = activeUserId
        ? `Synced user: ${activeUserId}`
        : 'Local mode (log in to sync to Firebase)';

    return `
        <section class="career-dashboard-shell">
            <div class="career-dashboard-top">
                <div>
                    <p class="career-kicker">Career Dashboard</p>
                    <h3>Track your progress and stay consistent</h3>
                    <p>Update tools daily to improve your profile strength and application momentum.</p>
                    <p class="career-sync-status">${syncLabel}</p>
                </div>
                <span class="career-overall-badge">Test Level ${testLevel.level}</span>
            </div>
            <div class="career-stats-grid">
                <article class="career-stat-card">
                    <h4>Applications Sent</h4>
                    <strong>${careerToolState.applicationsSent}</strong>
                </article>
                <article class="career-stat-card">
                    <h4>Interviews Scheduled</h4>
                    <strong>${careerToolState.interviewsScheduled}</strong>
                </article>
                <article class="career-stat-card">
                    <h4>Weekly Target</h4>
                    <strong>${careerToolState.weeklyTarget}</strong>
                </article>
                <article class="career-stat-card">
                    <h4>Task Completion</h4>
                    <strong>${careerToolState.tasksCompleted}/${careerToolState.tasksTotal}</strong>
                </article>
            </div>
            <div class="career-progress-wrap">
                <div class="career-progress-meta">
                    <span>Progress Tracking</span>
                    <span>${progress}% complete</span>
                </div>
                <div class="career-progress-track"><span style="width:${progress}%;"></span></div>
            </div>
            <div class="career-performance-grid">
                <article class="career-performance-card">
                    <h4>User Level (From Tests)</h4>
                    <strong>${testLevel.level}</strong>
                    <p>
                        Attempts: <strong>${testLevel.attempts}</strong> |
                        Average: <strong>${testLevel.average === null ? 'No data' : `${testLevel.average}%`}</strong> |
                        Best: <strong>${testLevel.best === null ? 'No data' : `${testLevel.best}%`}</strong>
                    </p>
                </article>
                <article class="career-performance-card">
                    <h4>Recent Practice</h4>
                    <strong>${mncTestsCount} mock tests | ${interviewsCount} interviews</strong>
                    <p>MNC average: <strong>${mockAverage === null ? 'No data yet' : `${mockAverage}%`}</strong> | Latest test: <strong>${testLevel.latest === null ? 'No data yet' : `${testLevel.latest}%`}</strong> | Interview readiness: <strong>${interviewAverage === null ? 'No data yet' : `${interviewAverage}%`}</strong></p>
                </article>
                <article class="career-performance-card">
                    <h4>Strength + Focus</h4>
                    <strong>Strongest: ${strongest.label} (${strongest.score}%)</strong>
                    <p>Primary focus area: <strong>${focus.label}</strong> (${focus.score}%). Raise this first to improve overall readiness faster.</p>
                </article>
            </div>
            <div class="career-performance-chart-card">
                <div class="career-performance-chart-head">
                    <h4>User Performance Graph</h4>
                    <span>Last 8 test/interview attempts</span>
                </div>
                ${renderProfileBarChart(trendSeries, {
                    maxValue: 100,
                    emptyText: 'No performance attempts yet. Complete a mock test or interview to see your graph.',
                    className: 'career-performance-chart'
                })}
            </div>
            <div class="career-performance-chart-card">
                <div class="career-performance-chart-head">
                    <h4>Day-wise Score</h4>
                    <span>Your scores by day this week</span>
                </div>
                ${renderProfileBarChart(weeklyScoreSeries, {
                    maxValue: 100,
                    emptyText: 'No scores yet this week. Take a mock test or interview to see your daily scores.',
                    className: 'career-performance-chart day-wise-chart'
                })}
            </div>
            <div class="career-recommendations">
                <h4>Personalized Next Actions</h4>
                <ul>
                    ${recommendations.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="career-leaderboard">
                <div class="career-leaderboard-head">
                    <h4>Leaderboard</h4>
                    <span>Weekly ranking</span>
                </div>
                <div class="career-leaderboard-table">
                    ${leaderboard.map(entry => `
                        <div class="career-leader-row ${entry.isYou ? 'you' : ''}">
                            <span>#${entry.rank}</span>
                            <span>${entry.name}</span>
                            <span>${entry.points} pts</span>
                            <span>${entry.streak} day streak</span>
                            <span>${entry.badge}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}

function renderCareerToolsHome() {
    const listDiv = document.getElementById('coding-list');
    if (!listDiv) return;
    listDiv.style.display = 'block';
    listDiv.innerHTML = renderResumeTool();
    setTimeout(initResumeLiveChecklist, 0);
}

function renderResumeTool() {
    const score = careerToolState.resumeScore || 0;
    const circumference = 314;
    const offset = circumference - (score / 100) * circumference;
    const scoreColor = score >= 80 ? '#1D9E75' : score >= 50 ? '#f59e0b' : '#ef4444';
    return `
        <div class="resume-tool-shell">
            <!-- Header -->
            <div class="resume-hero">
                <div class="resume-hero-left">
                    <span class="resume-eyebrow">âœ¦ Career Tools</span>
                    <h2 class="resume-hero-title">Resume Builder <span class="resume-hero-amp">&</span> Checker</h2>
                    <p class="resume-hero-sub">Build an ATS-ready resume from scratch, or upload yours for a deep analysis â€” keyword match, section scoring, and actionable fixes.</p>
                </div>
                <div class="resume-score-ring" id="resume-score-ring">
                    <svg viewBox="0 0 120 120" class="resume-ring-svg">
                        <circle cx="60" cy="60" r="50" class="resume-ring-bg"/>
                        <circle cx="60" cy="60" r="50" class="resume-ring-fill" id="resume-ring-fill"
                            stroke-dasharray="${circumference}"
                            stroke-dashoffset="${offset}"
                            stroke="${scoreColor}"/>
                    </svg>
                    <div class="resume-ring-label">
                        <span id="resume-ring-score" style="color:${scoreColor}">${score}</span>
                        <small>ATS Score</small>
                    </div>
                </div>
            </div>

            <!-- Score Breakdown Bar (shown after analysis) -->
            <div id="resume-score-breakdown" class="resume-score-breakdown" style="display:none;"></div>

            <!-- Tabs -->
            <div class="resume-tabs">
                <button type="button" class="resume-tab active" id="tab-build" onclick="switchResumeTab('build')">âœï¸ Build Resume</button>
                <button type="button" class="resume-tab" id="tab-upload" onclick="switchResumeTab('upload')">ðŸ“¤ Upload & Analyze</button>
                <button type="button" class="resume-tab" id="tab-tips" onclick="switchResumeTab('tips')">ðŸ’¡ ATS Tips</button>
            </div>

            <!-- â”€â”€ BUILD TAB â”€â”€ -->
            <div id="resume-tab-build" class="resume-tab-panel">
                <div class="resume-two-col">
                    <div class="resume-form-col">
                        <div class="resume-form-section">
                            <h4 class="resume-form-section-title">ðŸŽ¯ Target Info</h4>
                            <div class="career-form-grid">
                                <label>Target Role <span class="resume-required">*</span>
                                    <input id="resume-target-role" type="text" placeholder="e.g. Frontend Developer, Data Analyst">
                                </label>
                                <label>Target Company / Industry
                                    <input id="resume-target-company" type="text" placeholder="e.g. TCS, Infosys, Startup">
                                </label>
                            </div>
                        </div>
                        <div class="resume-form-section">
                            <h4 class="resume-form-section-title">ðŸ‘¤ Professional Summary</h4>
                            <div class="career-form-grid">
                                <label>Summary <span class="resume-required">*</span>
                                    <textarea id="resume-summary" rows="3" placeholder="Motivated CS graduate with 1 year of internship experience in React and Node.js, seeking a frontend developer role at a product company."></textarea>
                                </label>
                            </div>
                        </div>
                        <div class="resume-form-section">
                            <h4 class="resume-form-section-title">ðŸ› ï¸ Skills</h4>
                            <div class="career-form-grid">
                                <label>Technical Skills <span class="resume-required">*</span>
                                    <input id="resume-skills" type="text" placeholder="React, JavaScript, REST APIs, Git, SQL, Python">
                                </label>
                                <label>Soft Skills
                                    <input id="resume-soft-skills" type="text" placeholder="Team collaboration, Problem solving, Communication">
                                </label>
                            </div>
                        </div>
                        <div class="resume-form-section">
                            <h4 class="resume-form-section-title">ðŸ’¼ Experience</h4>
                            <div class="career-form-grid">
                                <label>Internship / Work Experience
                                    <textarea id="resume-experience" rows="3" placeholder="Interned at XYZ Corp (Junâ€“Aug 2024). Built REST APIs using Node.js, reducing response time by 35%. Collaborated with 4-member team."></textarea>
                                </label>
                            </div>
                        </div>
                        <div class="resume-form-section">
                            <h4 class="resume-form-section-title">ðŸš€ Projects</h4>
                            <div class="career-form-grid">
                                <label>Project 1 <span class="resume-required">*</span>
                                    <textarea id="resume-project" rows="3" placeholder="AI Placement Portal â€” Built with React + Flask. Used by 300+ students. Reduced prep time by 40%."></textarea>
                                </label>
                                <label>Project 2 (optional)
                                    <textarea id="resume-project2" rows="2" placeholder="E-commerce site with payment integration. 500+ orders processed."></textarea>
                                </label>
                            </div>
                        </div>
                        <div class="resume-form-section">
                            <h4 class="resume-form-section-title">ðŸŽ“ Education & Extras</h4>
                            <div class="career-form-grid">
                                <label>Education <span class="resume-required">*</span>
                                    <input id="resume-education" type="text" placeholder="B.Tech CSE, XYZ University, 2024, CGPA 8.2">
                                </label>
                                <label>Certifications / Achievements
                                    <input id="resume-certifications" type="text" placeholder="AWS Cloud Practitioner, Smart India Hackathon Finalist">
                                </label>
                            </div>
                        </div>
                        <div class="resume-build-actions">
                            <button type="button" class="resume-primary-btn" onclick="checkResumeQuality()">ðŸ” Analyze & Score</button>
                            <button type="button" class="resume-secondary-btn" onclick="generateResumeDraft()">âœ¨ Generate Draft</button>
                        </div>
                    </div>

                    <!-- Live checklist sidebar -->
                    <div class="resume-sidebar">
                        <div class="resume-sidebar-card">
                            <h4 class="resume-sidebar-title">ðŸ“‹ Live Checklist</h4>
                            <ul class="resume-live-checklist" id="resume-live-checklist">
                                <li class="rcl-item" id="rcl-role">Target role filled</li>
                                <li class="rcl-item" id="rcl-summary">Summary written</li>
                                <li class="rcl-item" id="rcl-skills">3+ skills listed</li>
                                <li class="rcl-item" id="rcl-experience">Experience added</li>
                                <li class="rcl-item" id="rcl-project">Project with impact</li>
                                <li class="rcl-item" id="rcl-education">Education filled</li>
                                <li class="rcl-item" id="rcl-metrics">Metrics / numbers used</li>
                                <li class="rcl-item" id="rcl-keywords">Role keywords present</li>
                            </ul>
                        </div>
                        <div class="resume-sidebar-card resume-tips-mini">
                            <h4 class="resume-sidebar-title">âš¡ Quick Tips</h4>
                            <ul>
                                <li>Use numbers: "reduced by 35%", "500+ users"</li>
                                <li>Match keywords from the job description</li>
                                <li>Keep to 1 page for freshers</li>
                                <li>Use action verbs: Built, Designed, Led, Reduced</li>
                                <li>Avoid photos, tables, and graphics for ATS</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- â”€â”€ UPLOAD TAB â”€â”€ -->
            <div id="resume-tab-upload" class="resume-tab-panel" style="display:none;">
                <div class="resume-upload-area">
                    <div class="resume-upload-zone" id="resume-upload-zone"
                         ondragover="event.preventDefault(); this.classList.add('drag-over')"
                         ondragleave="this.classList.remove('drag-over')"
                         ondrop="handleResumeDrop(event)">
                        <div class="resume-upload-icon">ðŸ“„</div>
                        <p class="resume-upload-title">Drop your resume here or click to browse</p>
                        <p class="resume-upload-sub">Supports .pdf, .docx, .txt, .md â€” Max 5MB</p>
                        <input id="resume-upload-file" type="file" accept=".pdf,.docx,.txt,.md" class="resume-upload-input" onchange="handleResumeFileSelect(this)">
                        <button type="button" class="resume-secondary-btn" onclick="document.getElementById('resume-upload-file').click()">Browse File</button>
                    </div>
                    <div id="resume-file-preview" class="resume-file-preview" style="display:none;"></div>
                    <div class="resume-upload-options">
                        <label class="resume-upload-role-label">Target Role (for keyword matching)
                            <input id="resume-upload-role" type="text" placeholder="e.g. Backend Developer, Data Scientist">
                        </label>
                        <label class="resume-upload-role-label">Job Description (optional â€” paste for deep match)
                            <textarea id="resume-jd-text" rows="4" placeholder="Paste the job description here for precise keyword gap analysis..."></textarea>
                        </label>
                    </div>
                    <div class="resume-build-actions">
                        <button type="button" class="resume-primary-btn" onclick="uploadResumeAndScore()">ðŸ” Deep Analyze Resume</button>
                    </div>
                </div>
            </div>

            <!-- â”€â”€ ATS TIPS TAB â”€â”€ -->
            <div id="resume-tab-tips" class="resume-tab-panel" style="display:none;">
                <div class="resume-tips-grid">
                    <div class="resume-tip-card">
                        <span class="resume-tip-icon">ðŸ¤–</span>
                        <h4>How ATS Works</h4>
                        <p>Applicant Tracking Systems parse your resume for keywords, section headers, and formatting. Plain text beats fancy layouts every time.</p>
                    </div>
                    <div class="resume-tip-card">
                        <span class="resume-tip-icon">ðŸ”‘</span>
                        <h4>Keyword Matching</h4>
                        <p>Mirror exact phrases from the job description. If the JD says "REST API development", use that exact phrase â€” not just "APIs".</p>
                    </div>
                    <div class="resume-tip-card">
                        <span class="resume-tip-icon">ðŸ“</span>
                        <h4>Section Headers</h4>
                        <p>Use standard headers: <strong>Experience, Education, Skills, Projects, Certifications</strong>. Avoid creative names like "My Journey" â€” ATS won't recognize them.</p>
                    </div>
                    <div class="resume-tip-card">
                        <span class="resume-tip-icon">ðŸ“</span>
                        <h4>Length & Format</h4>
                        <p>1 page for freshers, 2 pages max for experienced. Use .docx or simple PDF. No tables, columns, headers/footers, or text boxes.</p>
                    </div>
                    <div class="resume-tip-card">
                        <span class="resume-tip-icon">ðŸ“Š</span>
                        <h4>Quantify Everything</h4>
                        <p>Replace "improved performance" with "reduced load time by 40%". Numbers make your impact concrete and searchable.</p>
                    </div>
                    <div class="resume-tip-card">
                        <span class="resume-tip-icon">âš¡</span>
                        <h4>Action Verbs</h4>
                        <p>Start every bullet with a strong verb: <em>Built, Designed, Optimized, Led, Reduced, Delivered, Automated, Integrated, Deployed</em>.</p>
                    </div>
                    <div class="resume-tip-card">
                        <span class="resume-tip-icon">ðŸŽ¯</span>
                        <h4>Tailor Per Role</h4>
                        <p>A generic resume gets filtered out. Spend 10 minutes customizing the summary and skills section for each application.</p>
                    </div>
                    <div class="resume-tip-card">
                        <span class="resume-tip-icon">ðŸ”—</span>
                        <h4>Links & Contact</h4>
                        <p>Include GitHub, LinkedIn, and portfolio links. Make sure your email is professional. Avoid nicknames or old college IDs.</p>
                    </div>
                </div>
            </div>

            <!-- Output panel -->
            <div id="career-tool-output" class="career-tool-output resume-output-panel" style="display:none;"></div>
        </div>
    `;
}

function openCareerTool(toolKey) {
    careerToolState.activeTool = toolKey;
    saveCareerState();
    const listDiv = document.getElementById('coding-list');
    if (!listDiv) return;
    listDiv.style.display = 'block';
    listDiv.innerHTML = renderResumeTool();
    setTimeout(initResumeLiveChecklist, 0);
}

// ── Resume tab switching ────────────────────────────────────────────────────
function switchResumeTab(tab) {
    ['build', 'upload', 'tips'].forEach(t => {
        const panel = document.getElementById(`resume-tab-${t}`);
        const btn   = document.getElementById(`tab-${t}`);
        if (panel) panel.style.display = t === tab ? 'block' : 'none';
        if (btn)   btn.classList.toggle('active', t === tab);
    });
}

// ── File select preview ─────────────────────────────────────────────────────
function handleResumeFileSelect(input) {
    const file = input?.files?.[0];
    const preview = document.getElementById('resume-file-preview');
    const zone    = document.getElementById('resume-upload-zone');
    if (!file || !preview) return;

    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    const ext    = file.name.split('.').pop().toUpperCase();
    const iconMap = { PDF: '&#128213;', DOCX: '&#128216;', TXT: '&#128196;', MD: '&#128221;' };
    const icon   = iconMap[ext] || '&#128196;';

    preview.style.display = 'flex';
    preview.innerHTML = `
        <div class="resume-file-info">
            <span class="resume-file-icon">${icon}</span>
            <div>
                <p class="resume-file-name">${escapeHtml(file.name)}</p>
                <p class="resume-file-meta">${ext} &nbsp;&middot;&nbsp; ${sizeMB} MB</p>
            </div>
            <button type="button" class="resume-file-remove" onclick="clearResumeFile()" title="Remove">&times;</button>
        </div>
    `;
    if (zone) zone.style.display = 'none';
}

function clearResumeFile() {
    const input   = document.getElementById('resume-upload-file');
    const preview = document.getElementById('resume-file-preview');
    const zone    = document.getElementById('resume-upload-zone');
    if (input)   input.value = '';
    if (preview) { preview.style.display = 'none'; preview.innerHTML = ''; }
    if (zone)    zone.style.display = 'block';
}

function handleResumeDrop(event) {
    event.preventDefault();
    const zone = document.getElementById('resume-upload-zone');
    if (zone) zone.classList.remove('drag-over');
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    const input = document.getElementById('resume-upload-file');
    if (input) {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        handleResumeFileSelect(input);
    }
}

function closeCareerTool() {
    careerToolState.activeTool = null;
    saveCareerState();
    renderCareerToolsHome();
}

function initResumeLiveChecklist() {
    const fields = [
        { id: 'resume-target-role', rclId: 'rcl-role' },
        { id: 'resume-summary', rclId: 'rcl-summary' },
        { id: 'resume-skills', rclId: 'rcl-skills' },
        { id: 'resume-experience', rclId: 'rcl-experience' },
        { id: 'resume-project', rclId: 'rcl-project' },
        { id: 'resume-education', rclId: 'rcl-education' },
    ];
    fields.forEach(({ id, rclId }) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateResumeLiveChecklist);
    });
}

function updateResumeLiveChecklist() {
    const role = document.getElementById('resume-target-role')?.value.trim() || '';
    const summary = document.getElementById('resume-summary')?.value.trim() || '';
    const skills = document.getElementById('resume-skills')?.value.trim() || '';
    const experience = document.getElementById('resume-experience')?.value.trim() || '';
    const project = document.getElementById('resume-project')?.value.trim() || '';
    const education = document.getElementById('resume-education')?.value.trim() || '';
    const allText = [role, summary, skills, experience, project, education].join(' ').toLowerCase();
    const hasMetrics = /\d+\s*(%|users|students|orders|ms|seconds|days|hours|projects|clients|members|lines|commits|features|bugs|issues|requests|apis|endpoints)/.test(allText);
    const actionVerbs = ['built','designed','developed','created','implemented','optimized','reduced','increased','led','managed','delivered','automated','integrated','deployed','improved','launched'];
    const hasActionVerbs = actionVerbs.some(v => allText.includes(v));

    const checks = {
        'rcl-role': role.length >= 3,
        'rcl-summary': summary.length >= 60,
        'rcl-skills': skills.split(',').filter(Boolean).length >= 3,
        'rcl-experience': experience.length >= 40,
        'rcl-project': project.length >= 40,
        'rcl-education': education.length >= 10,
        'rcl-metrics': hasMetrics,
        'rcl-keywords': hasActionVerbs,
    };
    Object.entries(checks).forEach(([id, ok]) => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.toggle('rcl-done', ok);
            el.classList.toggle('rcl-pending', !ok);
        }
    });
}

function updateResumeScoreRing(score) {
    const fill = document.getElementById('resume-ring-fill');
    const scoreEl = document.getElementById('resume-ring-score');
    if (!fill || !scoreEl) return;
    const circumference = 314;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? '#1D9E75' : score >= 50 ? '#f59e0b' : '#ef4444';
    fill.style.strokeDashoffset = offset;
    fill.setAttribute('stroke', color);
    scoreEl.textContent = score;
    scoreEl.style.color = color;
}

function setCareerOutput(markup) {
    const output = document.getElementById('career-tool-output');
    if (output) {
        output.innerHTML = markup;
    }
}

function completeCareerTask() {
    careerToolState.tasksCompleted = Math.min(careerToolState.tasksTotal, careerToolState.tasksCompleted + 1);
}

function generateResumeDraft() {
    const role = document.getElementById('resume-target-role')?.value.trim() || 'Software Developer';
    const skills = document.getElementById('resume-skills')?.value.trim() || 'Problem Solving, Communication';
    const project = document.getElementById('resume-project')?.value.trim() || 'Built a student-focused placement prep product.';
    const experience = document.getElementById('resume-experience')?.value.trim() || 'Executed feature delivery with measurable quality improvements.';

    const bullets = [
        `Targeted ${role} opportunities with strong focus on delivery impact and collaboration.`,
        `Applied ${skills} to solve real-world technical tasks.`,
        `${project}`,
        `${experience}`
    ];

    careerToolState.resumeScore = Math.min(100, 55 + bullets.filter(item => item.length > 20).length * 10);
    completeCareerTask();
    saveCareerState();

    setCareerOutput(`
        <h4>Resume Draft Highlights</h4>
        <ul>
            ${bullets.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
        <p class="career-score-line">Resume readiness score: <strong>${careerToolState.resumeScore}%</strong></p>
    `);
}

function checkResumeQuality() {
    const uploadedFile = document.getElementById('resume-upload-file')?.files?.[0];
    const role = document.getElementById('resume-target-role')?.value.trim();
    const summary = document.getElementById('resume-summary')?.value.trim();
    const skills = document.getElementById('resume-skills')?.value.trim();
    const project = document.getElementById('resume-project')?.value.trim();
    const experience = document.getElementById('resume-experience')?.value.trim();
    const education = document.getElementById('resume-education')?.value.trim();
    const certifications = document.getElementById('resume-certifications')?.value.trim();
    const hasTypedInputs = Boolean(role || skills || project || experience);

    if (!hasTypedInputs && uploadedFile) {
        uploadResumeAndScore();
        return;
    }

    const allText = [role, summary, skills, project, experience, education, certifications].join(' ').toLowerCase();
    const hasMetrics = /\d+\s*(%|users|students|orders|ms|seconds|days|hours|projects|clients|members|lines|commits|features|bugs|issues|requests|apis|endpoints)/.test(allText);
    const skillList = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    const actionVerbs = ['built','designed','developed','created','implemented','optimized','reduced','increased','led','managed','delivered','automated','integrated','deployed','improved','launched','architected','engineered','collaborated','mentored'];
    const hasActionVerbs = actionVerbs.some(v => allText.includes(v));
    const roleKeywords = role ? role.toLowerCase().split(/\s+/) : [];
    const keywordMatch = roleKeywords.length > 0 && roleKeywords.some(k => k.length > 3 && allText.includes(k));

    const sections = [
        { label: 'Target Role', weight: 10, ok: Boolean(role && role.length >= 3), tip: 'Add a specific target role to help ATS match your profile.' },
        { label: 'Professional Summary', weight: 15, ok: Boolean(summary && summary.length >= 60), tip: 'Write at least 2 sentences covering your background, skills, and goal.' },
        { label: 'Technical Skills (3+)', weight: 15, ok: skillList.length >= 3, tip: 'List at least 3 technical skills separated by commas.' },
        { label: 'Work / Internship Experience', weight: 20, ok: Boolean(experience && experience.length >= 40), tip: 'Describe your role, company, and what you achieved.' },
        { label: 'Project with Impact', weight: 15, ok: Boolean(project && project.length >= 40), tip: 'Describe what you built and the outcome (users, performance, etc.).' },
        { label: 'Education', weight: 10, ok: Boolean(education && education.length >= 10), tip: 'Add your degree, university, year, and CGPA.' },
        { label: 'Quantified Metrics', weight: 10, ok: hasMetrics, tip: 'Add numbers: "reduced by 35%", "500+ users", "3 projects delivered".' },
        { label: 'Action Verbs Used', weight: 5, ok: hasActionVerbs, tip: 'Start bullets with verbs like Built, Designed, Reduced, Led, Delivered.' },
    ];

    const totalWeight = sections.reduce((s, c) => s + c.weight, 0);
    const earnedWeight = sections.filter(s => s.ok).reduce((s, c) => s + c.weight, 0);
    const score = Math.round((earnedWeight / totalWeight) * 100);

    careerToolState.resumeScore = score;
    completeCareerTask();
    saveCareerState();
    updateResumeScoreRing(score);

    const passed = sections.filter(s => s.ok).length;
    const failed = sections.filter(s => !s.ok);
    const grade = score >= 85 ? { label: 'Excellent', color: '#1D9E75' } : score >= 65 ? { label: 'Good', color: '#f59e0b' } : score >= 40 ? { label: 'Needs Work', color: '#f97316' } : { label: 'Weak', color: '#ef4444' };

    const output = document.getElementById('career-tool-output');
    if (!output) return;
    output.style.display = 'block';
    output.innerHTML = `
        <div class="resume-result-shell">
            <div class="resume-result-header">
                <div>
                    <h3 class="resume-result-title">Resume Analysis Report</h3>
                    <p class="resume-result-sub">${passed} of ${sections.length} checks passed</p>
                </div>
                <span class="resume-grade-badge" style="background:${grade.color}22; color:${grade.color}; border-color:${grade.color}44;">${grade.label}</span>
            </div>

            <div class="resume-section-scores">
                ${sections.map(s => `
                    <div class="resume-section-row ${s.ok ? 'pass' : 'fail'}">
                        <span class="rsr-icon">${s.ok ? 'âœ…' : 'âŒ'}</span>
                        <div class="rsr-body">
                            <span class="rsr-label">${s.label}</span>
                            ${!s.ok ? `<span class="rsr-tip">${s.tip}</span>` : ''}
                        </div>
                        <span class="rsr-weight">${s.weight}pts</span>
                    </div>
                `).join('')}
            </div>

            ${failed.length > 0 ? `
            <div class="resume-fixes-block">
                <h4>ðŸ”§ Priority Fixes</h4>
                <ol class="resume-fixes-list">
                    ${failed.slice(0, 4).map(s => `<li><strong>${s.label}:</strong> ${s.tip}</li>`).join('')}
                </ol>
            </div>` : ''}

            ${keywordMatch ? '' : role ? `
            <div class="resume-keyword-alert">
                âš ï¸ <strong>Keyword gap:</strong> Your resume doesn't clearly reflect the role "<em>${escapeHtml(role)}</em>". Add role-specific terms in your summary and skills.
            </div>` : ''}

            <div class="resume-result-footer">
                <button type="button" class="resume-primary-btn" onclick="generateResumeDraft()">âœ¨ Generate Improved Draft</button>
                <button type="button" class="resume-secondary-btn" onclick="switchResumeTab('tips')">ðŸ’¡ View ATS Tips</button>
            </div>
        </div>
    `;
    output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function uploadResumeAndScore() {
    const fileInput  = document.getElementById('resume-upload-file');
    const resumeFile = fileInput?.files?.[0];
    const output     = document.getElementById('career-tool-output');

    if (!resumeFile) {
        if (output) {
            output.style.display = 'block';
            output.innerHTML = '<p style="color:#fca5a5;padding:1rem;">&#9888; Please select a resume file first (PDF, DOCX, TXT, or MD).</p>';
        }
        return;
    }

    if (output) {
        output.style.display = 'block';
        output.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.75rem;padding:1rem;color:#93c5fd;">
                <span style="font-size:1.4rem;">&#9203;</span>
                <span>Analysing <strong>${escapeHtml(resumeFile.name)}</strong>&hellip;</span>
            </div>`;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
        const response = await fetch(`${API_BASE}/career/resume/score`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Unable to score resume right now.');
        }

        const score   = result.score || 0;
        const grade   = score >= 85 ? { label: 'Excellent', color: '#1D9E75' }
                      : score >= 65 ? { label: 'Good',      color: '#f59e0b' }
                      : score >= 40 ? { label: 'Needs Work', color: '#f97316' }
                      :               { label: 'Weak',       color: '#ef4444' };

        careerToolState.resumeScore = score;
        completeCareerTask();
        saveCareerState();
        updateResumeScoreRing(score);

        const checklist  = result.checklist  || [];
        const suggestions = result.suggestions || [];
        const passed     = checklist.filter(c => c.ok).length;
        const circumference = 251;
        const offset     = circumference - (score / 100) * circumference;

        if (output) {
            output.style.display = 'block';
            output.innerHTML = `
                <div class="upload-result-shell">

                    <!-- Score header -->
                    <div class="upload-result-header">
                        <div class="upload-result-meta">
                            <h3 class="upload-result-title">&#128196; Resume Analysis Report</h3>
                            <p class="upload-result-file">${escapeHtml(resumeFile.name)} &nbsp;&middot;&nbsp; ${result.word_count || 0} words</p>
                            <p class="upload-result-summary">${passed} of ${checklist.length} checks passed</p>
                        </div>
                        <div class="upload-score-ring">
                            <svg viewBox="0 0 90 90" width="90" height="90">
                                <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
                                <circle cx="45" cy="45" r="40" fill="none"
                                    stroke="${grade.color}" stroke-width="8"
                                    stroke-linecap="round"
                                    stroke-dasharray="${circumference}"
                                    stroke-dashoffset="${offset}"
                                    transform="rotate(-90 45 45)"
                                    style="transition:stroke-dashoffset 0.8s ease"/>
                            </svg>
                            <div class="upload-score-label">
                                <span style="color:${grade.color};font-size:1.4rem;font-weight:800;line-height:1">${score}</span>
                                <small style="color:rgba(255,255,255,0.45);font-size:0.65rem;">/ 100</small>
                            </div>
                            <span class="upload-grade-badge" style="background:${grade.color}22;color:${grade.color};border-color:${grade.color}44">${grade.label}</span>
                        </div>
                    </div>

                    <!-- Checklist -->
                    <div class="upload-checklist">
                        ${checklist.map(item => `
                            <div class="upload-check-row ${item.ok ? 'pass' : 'fail'}">
                                <span class="upload-check-icon">${item.ok ? '&#10003;' : '&#10007;'}</span>
                                <span class="upload-check-label">${escapeHtml(item.label)}</span>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Suggestions -->
                    ${suggestions.length ? `
                    <div class="upload-suggestions">
                        <h4 class="upload-suggestions-title">&#128295; How to Improve</h4>
                        <ul class="upload-suggestions-list">
                            ${suggestions.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
                        </ul>
                    </div>` : ''}

                    <!-- Actions -->
                    <div class="resume-result-footer">
                        <button type="button" class="resume-primary-btn" onclick="switchResumeTab('build')">&#9998; Edit & Rebuild</button>
                        <button type="button" class="resume-secondary-btn" onclick="switchResumeTab('tips')">&#128161; ATS Tips</button>
                    </div>
                </div>
            `;
            output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    } catch (error) {
        if (output) {
            output.style.display = 'block';
            output.innerHTML = `<p style="color:#fca5a5;padding:1rem;">&#10007; ${escapeHtml(error.message)}</p>`;
        }
        console.error('Error scoring uploaded resume:', error);
    }
}
function generateCoverLetter() {
    const company = document.getElementById('cover-company')?.value.trim() || 'the company';
    const role = document.getElementById('cover-role')?.value.trim() || 'the role';
    const achievements = document.getElementById('cover-achievements')?.value.trim() || 'I consistently delivered project milestones with high ownership.';
    const tone = document.getElementById('cover-tone')?.value || 'professional';
    const toneLine = tone === 'confident'
        ? 'I am excited to bring measurable delivery impact from day one.'
        : tone === 'warm'
            ? 'I would value the opportunity to contribute and grow with your team.'
            : 'I am confident my profile aligns with your hiring needs.';

    const letter = `Dear Hiring Team,\n\nI am applying for the ${role} position at ${company}. ${achievements}\n\n${toneLine}\n\nThank you for your time and consideration.\n\nSincerely,\nYour Name`;
    const strength = [company, role, achievements].filter(Boolean).length;
    careerToolState.coverLetterScore = Math.min(100, 60 + strength * 12);
    completeCareerTask();
    saveCareerState();

    setCareerOutput(`
        <h4>Generated Cover Letter</h4>
        <pre>${escapeHtml(letter)}</pre>
        <p class="career-score-line">Cover letter quality score: <strong>${careerToolState.coverLetterScore}%</strong></p>
    `);
}

function runAutoApplySimulation() {
    const target = parseInt(document.getElementById('auto-apply-target')?.value || '5', 10);
    const keywords = document.getElementById('auto-apply-keywords')?.value.trim() || 'Software Engineer';
    const locations = document.getElementById('auto-apply-locations')?.value.trim() || 'Bangalore';
    const source = document.getElementById('auto-apply-source')?.value || 'all';
    const sourceLabel = source === 'naukri-linkedin'
        ? 'Naukri + LinkedIn'
        : source === 'career-pages'
            ? 'Career Pages'
            : 'All Sources';
    const recommended = Math.max(1, Math.min(target, 8));

    careerToolState.jobApplyScore = Math.min(100, 55 + recommended * 5);
    careerToolState.weeklyTarget = target * 7;
    careerToolState.applicationsSent += recommended;
    careerToolState.interviewsScheduled += recommended >= 5 ? 1 : 0;
    completeCareerTask();
    saveCareerState();

    setCareerOutput(`
        <h4>Auto Apply Status</h4>
        <p>Configuration ready for <strong>${sourceLabel}</strong>.</p>
        <p>Searching with keywords: <strong>${escapeHtml(keywords)}</strong></p>
        <p>Preferred locations: <strong>${escapeHtml(locations)}</strong></p>
        <p>Estimated applications queued today: <strong>${recommended}</strong></p>
        <p class="career-score-line">Automation score: <strong>${careerToolState.jobApplyScore}%</strong></p>
    `);
}

function markApplicationSent() {
    careerToolState.applicationsSent += 1;
    careerToolState.jobApplyScore = Math.min(100, careerToolState.jobApplyScore + 3);
    completeCareerTask();
    saveCareerState();

    setCareerOutput(`
        <h4>Application Logged</h4>
        <p>Total applications sent: <strong>${careerToolState.applicationsSent}</strong></p>
        <p class="career-score-line">Automation score: <strong>${careerToolState.jobApplyScore}%</strong></p>
    `);
}

function renderCodingModeSwitcher() {
    const modeSwitcher = document.getElementById('coding-mode-switcher');
    if (!modeSwitcher) {
        return;
    }

    modeSwitcher.innerHTML = '';
}

function setCodingMode(mode) {
    // Career Tools only mode: ignore non-career options.
    codingMode = 'career-tools';
    selectedCodingLanguage = null;
    loadCodingQuestions();
}

// Load coding questions
async function loadCodingQuestions() {
    const listDiv = document.getElementById('coding-list');
    const detailDiv = document.getElementById('coding-detail');

    renderCodingModeSwitcher();
    detailDiv.style.display = 'none';
    detailDiv.innerHTML = '';
    codingMode = 'career-tools';

    // Always land on Career Tools options first (cards view),
    // then open a tool only when user clicks a card.
    careerToolState.activeTool = null;
    saveCareerState();
    renderCareerToolsHome();
}

async function loadCodingLanguages() {
    const listDiv = document.getElementById('coding-list');
    listDiv.innerHTML = '<p>Loading programming languages...</p>';

    try {
        const response = await fetch(`${API_BASE}/coding/languages`);
        const languages = await response.json();

        if (!response.ok || !Array.isArray(languages)) {
            throw new Error('Unable to load coding languages.');
        }

        listDiv.innerHTML = `
            <div class="coding-concepts-shell">
                <div class="coding-concepts-hero">
                    <span class="coding-concepts-eyebrow">Coding Learning Path</span>
                    <h3>Choose a programming language</h3>
                    <p>Start with one language, review topic-wise syntax and explanations, then practice around 20 questions for each topic across Easy, Medium, and Hard levels.</p>
                </div>
                <div class="coding-language-grid">
                    ${languages.map(language => `
                        <article class="coding-language-card">
                            <div>
                                <h4>${language.name}</h4>
                                <p>${language.headline}</p>
                            </div>
                            <div class="coding-language-meta">
                                <span>${language.topic_count} topics</span>
                                <button type="button" onclick="showCodingLanguageTopics('${language.key}')">Explore ${language.name}</button>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading coding languages:', error);
        listDiv.innerHTML = '<p class="error">Unable to load coding languages right now.</p>';
    }
}

async function showCodingLanguageTopics(languageKey) {
    const listDiv = document.getElementById('coding-list');
    selectedCodingLanguage = languageKey;
    listDiv.innerHTML = '<p>Loading language topics...</p>';

    try {
        const response = await fetch(`${API_BASE}/coding/languages/${languageKey}/topics`);
        const payload = await response.json();

        if (!response.ok || !payload?.language || !Array.isArray(payload?.topics)) {
            throw new Error('Unable to load language topics.');
        }

        listDiv.innerHTML = `
            <div class="coding-concepts-shell">
                <button class="back-btn" type="button" onclick="loadCodingLanguages()">â† Back to Languages</button>
                <div class="coding-concepts-hero">
                    <span class="coding-concepts-eyebrow">${payload.language.name}</span>
                    <h3>${payload.language.name} Topic Roadmap</h3>
                    <p>${payload.language.headline}</p>
                </div>
                <div class="coding-topic-grid">
                    ${payload.topics.map(topic => `
                        <article class="coding-topic-card">
                            <h4>${topic.title}</h4>
                            <p>${topic.overview}</p>
                            <div class="coding-topic-actions">
                                <button type="button" onclick="showCodingTopicDetail('${languageKey}', '${topic.key}')">View Topic</button>
                                <button type="button" class="secondary" onclick="showCodingTopicDetail('${languageKey}', '${topic.key}', true)">Practice</button>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading coding topics:', error);
        listDiv.innerHTML = '<p class="error">Unable to load language topics right now.</p>';
    }
}

function renderCodingPracticeButtons(languageKey, topicKey, selectedLevel = '') {
    const levels = ['Easy', 'Medium', 'Hard'];
    return `
        <div class="difficulty-selector coding-practice-selector">
            ${levels.map(level => `
                <button class="difficulty-selector-btn ${selectedLevel === level ? `active ${level.toLowerCase()}` : ''}" onclick="loadCodingTopicPractice('${languageKey}', '${topicKey}', '${level}')">
                    ${level}
                </button>
            `).join('')}
        </div>
    `;
}

function buildCodingPracticeMarkup(languageKey, topicKey, level, questions) {
    return `
        <section class="difficulty-group difficulty-group-${level.toLowerCase()}">
            <div class="difficulty-group-header">
                <h5>${level} Practice</h5>
                <p>${questions.length} questions for this topic</p>
            </div>
            <div class="difficulty-group-questions">
                ${questions.map((question, index) => `
                    <div class="question-item question-item-${level.toLowerCase()}">
                        <div class="question-item-header">
                            <h4>Question ${index + 1}</h4>
                            <span class="question-difficulty-badge ${level.toLowerCase()}">${level}</span>
                        </div>
                        <p>${question.question}</p>
                        <div class="options">
                            ${question.options.map(opt => `
                                <button onclick="checkCompanyAnswer('coding-practice-${languageKey}-${topicKey}-${level.toLowerCase()}-${index + 1}', '${escapeJsString(opt)}', '${escapeJsString(question.answer)}', '${escapeJsString(question.explanation || '')}')">${opt}</button>
                            `).join('')}
                        </div>
                        <div id="coding-practice-${languageKey}-${topicKey}-${level.toLowerCase()}-${index + 1}" class="result"></div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function renderCodingSubtopicDetailCards(subtopic) {
    if (!subtopic) {
        return `
            <section class="company-topic-card">
                <h4>Syntax and Key Points</h4>
                <div class="coding-subtopic-detail">
                    <p>No subtopic details available right now.</p>
                </div>
            </section>
        `;
    }

    return `
        <section class="company-topic-card">
            <h4>Syntax and Key Points</h4>
            <div class="coding-subtopic-detail">
                <p>${subtopic.explanation}</p>
            </div>
        </section>
        <section class="company-topic-card">
            <h4>Example Syntax</h4>
            <pre class="coding-topic-example"><code>${escapeHtml(subtopic.example)}</code></pre>
        </section>
    `;
}

function updateCodingSubtopic(languageKey, topicKey, index) {
    const detailPanel = document.getElementById(`coding-subtopic-details-${languageKey}-${topicKey}`);
    const tabs = document.querySelectorAll(`[data-coding-subtopic="${languageKey}-${topicKey}"]`);
    if (!detailPanel) {
        return;
    }

    const subtopics = codingTopicDetailCache[`${languageKey}-${topicKey}`] || [];
    const selected = subtopics[index];
    if (!selected) {
        return;
    }

    tabs.forEach((tab, tabIndex) => {
        tab.classList.toggle('active', tabIndex === index);
    });
    detailPanel.innerHTML = renderCodingSubtopicDetailCards(selected);
}

async function showCodingTopicDetail(languageKey, topicKey, openPractice = false) {
    const listDiv = document.getElementById('coding-list');
    listDiv.innerHTML = '<p>Loading topic details...</p>';

    try {
        const response = await fetch(`${API_BASE}/coding/languages/${languageKey}/topics/${topicKey}`);
        const payload = await response.json();

        if (!response.ok || !payload?.topic || !payload?.language) {
            throw new Error('Unable to load topic details.');
        }

        codingTopicDetailCache[`${languageKey}-${topicKey}`] = payload.topic.subtopic_details || [];

        listDiv.innerHTML = `
            <div class="coding-concepts-shell">
                <button class="back-btn" type="button" onclick="showCodingLanguageTopics('${languageKey}')">â† Back to ${payload.language.name} Topics</button>
                <div class="company-topic-hero coding-topic-hero">
                    <span class="company-topic-section">${payload.language.name}</span>
                    <h3>${payload.topic.title}</h3>
                    <p class="company-topic-overview">${payload.topic.overview}</p>
                </div>
                <div class="company-topic-grid">
                    <section class="company-topic-card">
                        <h4>Sub Topics</h4>
                        <div class="coding-subtopic-list">
                            ${(payload.topic.subtopic_details || []).map((item, index) => `
                                <button
                                    type="button"
                                    class="coding-subtopic-btn ${index === 0 ? 'active' : ''}"
                                    data-coding-subtopic="${languageKey}-${topicKey}"
                                    onclick="updateCodingSubtopic('${languageKey}', '${topicKey}', ${index})"
                                >
                                    ${item.title}
                                </button>
                            `).join('')}
                        </div>
                    </section>
                    <div id="coding-subtopic-details-${languageKey}-${topicKey}" class="company-topic-grid coding-subtopic-grid">
                        ${renderCodingSubtopicDetailCards((payload.topic.subtopic_details || [])[0])}
                    </div>
                    <section class="company-topic-card">
                        <h4>Example Question</h4>
                        <p class="coding-example-question">${payload.topic.example_question}</p>
                    </section>
                </div>
                <section class="company-topic-practice coding-topic-practice">
                    <div class="company-topic-practice-header">
                        <h4>${payload.topic.title} Practice</h4>
                        <p>This topic includes around ${payload.topic.practice_count} practice questions split across Easy, Medium, and Hard.</p>
                    </div>
                    <button type="button" class="practice-btn coding-topic-practice-btn" onclick="focusCodingPractice('${languageKey}', '${topicKey}')">Practice This Topic</button>
                    <div id="coding-practice-controls">${renderCodingPracticeButtons(languageKey, topicKey)}</div>
                    <div id="coding-practice-panel" class="practice-panel">
                        <div class="practice-panel-placeholder">
                            <h5>Select a difficulty level</h5>
                            <p>Choose Easy, Medium, or Hard to begin practicing ${payload.topic.title}.</p>
                        </div>
                    </div>
                </section>
            </div>
        `;

        if (openPractice) {
            focusCodingPractice(languageKey, topicKey);
        }
    } catch (error) {
        console.error('Error loading coding topic detail:', error);
        listDiv.innerHTML = '<p class="error">Unable to load this topic right now.</p>';
    }
}

function focusCodingPractice(languageKey, topicKey) {
    const practicePanel = document.getElementById('coding-practice-panel');
    if (practicePanel) {
        practicePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    loadCodingTopicPractice(languageKey, topicKey, 'Easy');
}

async function loadCodingTopicPractice(languageKey, topicKey, level) {
    const practicePanel = document.getElementById('coding-practice-panel');
    const controls = document.getElementById('coding-practice-controls');
    if (!practicePanel) {
        return;
    }

    practicePanel.innerHTML = '<p>Loading practice questions...</p>';
    if (controls) {
        controls.innerHTML = renderCodingPracticeButtons(languageKey, topicKey, level);
    }

    try {
        const response = await fetch(`${API_BASE}/coding/languages/${languageKey}/topics/${topicKey}/practice/${level.toLowerCase()}`);
        const questions = await response.json();

        if (!response.ok || !Array.isArray(questions)) {
            throw new Error('Unable to load coding practice questions.');
        }

        practicePanel.innerHTML = buildCodingPracticeMarkup(languageKey, topicKey, level, questions);
    } catch (error) {
        console.error('Error loading coding practice:', error);
        practicePanel.innerHTML = '<p class="error">Unable to load practice questions right now.</p>';
    }
}

async function loadCodingChallenges() {
    const endpoint = `${API_BASE}/coding`;
    const listDiv = document.getElementById('coding-list');

    try {
        const response = await fetch(endpoint);
        const questions = await response.json();
        displayCodingQuestions(questions);
    } catch (error) {
        console.error('Error loading coding questions:', error);
        listDiv.innerHTML = '<p class="error">Unable to load coding challenges right now.</p>';
    }
}

// Display coding questions
function displayCodingQuestions(questions) {
    const container = document.getElementById('coding-list');
    Object.keys(codingChallengeCache).forEach(key => {
        delete codingChallengeCache[key];
    });
    questions.forEach(question => {
        codingChallengeCache[question.id] = question;
    });

    const groupedQuestions = {
        Easy: questions.filter(question => question.difficulty === 'Easy'),
        Medium: questions.filter(question => question.difficulty === 'Medium'),
        Hard: questions.filter(question => question.difficulty === 'Hard'),
    };

    container.innerHTML = `
        <div class="coding-challenges-intro">
            <h3>Practice timed coding challenges</h3>
            <p>Pick a problem from the Easy, Medium, or Hard sections and run your solution against the test cases.</p>
        </div>
        ${Object.entries(groupedQuestions).map(([level, items]) => `
            <section class="coding-challenge-group coding-challenge-group-${level.toLowerCase()}">
                <div class="coding-challenge-group-header">
                    <h4>${level} Challenges</h4>
                    <p>${items.length} questions</p>
                </div>
                <div class="coding-challenge-grid">
                    ${items.map(q => `
                        <article class="coding-item" onclick="showCachedCodingDetail(${q.id})">
                            <h3>${q.title}</h3>
                            <span class="difficulty ${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                            <p>${q.description.substring(0, 100)}...</p>
                        </article>
                    `).join('')}
                </div>
            </section>
        `).join('')}
    `;
}

function showCachedCodingDetail(questionId) {
    const question = codingChallengeCache[questionId];
    if (question) {
        showCodingDetail(question);
    }
}

// Show coding detail
function showCodingDetail(question) {
    const listDiv = document.getElementById('coding-list');
    const detailDiv = document.getElementById('coding-detail');
    
    listDiv.style.display = 'none';
    detailDiv.style.display = 'block';
    
    detailDiv.innerHTML = `
        <button onclick="hideCodingDetail()">â† Back to List</button>
        <h3>${question.title}</h3>
        <span class="difficulty ${question.difficulty.toLowerCase()}">${question.difficulty}</span>
        <p><strong>Description:</strong> ${question.description}</p>
        <p><strong>Example:</strong></p>
        <pre>${question.example}</pre>
        <p><strong>Test Cases:</strong></p>
        <div class="test-cases">
            ${question.test_cases ? question.test_cases.map((tc, idx) => `
                <div class="test-case">
                    <p><strong>Test ${idx + 1}:</strong></p>
                    <p>Input: <code>${tc.input}</code></p>
                    <p>Expected: <code>${tc.expected_output}</code></p>
                </div>
            `).join('') : '<p>No test cases available</p>'}
        </div>
        <p><strong>Programming Language:</strong></p>
        <select id="language-selector" class="language-selector" onchange="changeLanguage(${question.id})">
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="javascript">JavaScript</option>
            <option value="c">C</option>
        </select>
        <p><strong>Your Code:</strong></p>
        <textarea id="code-editor" class="code-editor" placeholder="Write your code here...">${question.solution || ''}</textarea>
        <div class="code-actions">
            <button onclick="runTestCases(${question.id})" class="run-btn">Run Tests</button>
            <button onclick="submitCode(${question.id})" class="submit-btn">Submit Code</button>
        </div>
        <div id="test-results-${question.id}" class="test-results"></div>
    `;
}

// Hide coding detail
function hideCodingDetail() {
    const listDiv = document.getElementById('coding-list');
    const detailDiv = document.getElementById('coding-detail');
    
    listDiv.style.display = codingMode === 'challenges' ? 'grid' : 'block';
    detailDiv.style.display = 'none';
}

// Change programming language
function changeLanguage(questionId) {
    const languageSelector = document.getElementById('language-selector');
    const codeEditor = document.getElementById('code-editor');
    const selectedLanguage = languageSelector.value;
    
    // Get template code for selected language
    const templates = {
        python: `# Write your Python code here
def solution():
    # Your implementation
    pass`,
        java: `// Write your Java code here
public class Solution {
    public static void main(String[] args) {
        // Your implementation
    }
}`,
        cpp: `// Write your C++ code here
#include <iostream>
using namespace std;

int main() {
    // Your implementation
    return 0;
}`,
        javascript: `// Write your JavaScript code here
function solution() {
    // Your implementation
}`,
        c: `// Write your C code here
#include <stdio.h>

int main() {
    // Your implementation
    return 0;
}`
    };
    
    codeEditor.value = templates[selectedLanguage] || templates.python;
}

// Run test cases for coding question
async function runTestCases(questionId) {
    const codeEditor = document.getElementById('code-editor');
    const languageSelector = document.getElementById('language-selector');
    const code = codeEditor.value;
    const language = languageSelector ? languageSelector.value : 'python';
    const resultsDiv = document.getElementById(`test-results-${questionId}`);
    
    resultsDiv.innerHTML = '<p>Running tests...</p>';
    
    try {
        const response = await fetch(`${API_BASE}/coding/${questionId}/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: code, language: language })
        });
        
        const result = await response.json();
        
        if (result.success) {
            resultsDiv.innerHTML = `
                <div class="test-success">
                    <h4>âœ… All Tests Passed!</h4>
                    <p>${result.message}</p>
                </div>
            `;
        } else {
            resultsDiv.innerHTML = `
                <div class="test-failure">
                    <h4>âŒ Some Tests Failed</h4>
                    <p>${result.message}</p>
                    <div class="failed-tests">
                        ${result.failed_tests ? result.failed_tests.map(test => `
                            <div class="failed-test">
                                <p><strong>Input:</strong> ${test.input}</p>
                                <p><strong>Expected:</strong> ${test.expected}</p>
                                <p><strong>Got:</strong> ${test.actual}</p>
                            </div>
                        `).join('') : ''}
                    </div>
                </div>
            `;
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error running tests: ${error.message}</p>`;
    }
}

// Submit code for coding question
async function submitCode(questionId) {
    const codeEditor = document.getElementById('code-editor');
    const languageSelector = document.getElementById('language-selector');
    const code = codeEditor.value;
    const language = languageSelector ? languageSelector.value : 'python';
    const resultsDiv = document.getElementById(`test-results-${questionId}`);
    
    resultsDiv.innerHTML = '<p>Submitting code...</p>';
    
    try {
        const response = await fetch(`${API_BASE}/coding/${questionId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: code, language: language })
        });
        
        const result = await response.json();
        
        if (result.success) {
            resultsDiv.innerHTML = `
                <div class="test-success">
                    <h4>ðŸŽ‰ Congratulations!</h4>
                    <p>${result.message}</p>
                </div>
            `;
        } else {
            resultsDiv.innerHTML = `
                <div class="test-failure">
                    <h4>âŒ Submission Failed</h4>
                    <p>${result.message}</p>
                </div>
            `;
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error submitting code: ${error.message}</p>`;
    }
}

function resetInterviewSession() {
    interviewSession.category = 'technical';
    interviewSession.questions = [];
    interviewSession.answers = [];
    interviewSession.currentIndex = 0;
    interviewSession.completed = false;
    interviewSession.requestedCount = 5;
}

function getInterviewQuestionCount(category) {
    const inputId = category === 'hr' ? 'interview-hr-count' : 'interview-technical-count';
    const inputElement = document.getElementById(inputId);
    return clampQuestionCount(inputElement ? inputElement.value : 5, 1, 20, 5);
}

// Load interview questions
async function loadInterview(category) {
    const container = document.getElementById('interview-container');
    if (!container) {
        return;
    }

    const normalizedCategory = category === 'hr' ? 'hr' : 'technical';
    const requestedCount = getInterviewQuestionCount(normalizedCategory);
    interviewSession.category = normalizedCategory;
    interviewSession.questions = [];
    interviewSession.answers = [];
    interviewSession.currentIndex = 0;
    interviewSession.completed = false;
    interviewSession.requestedCount = requestedCount;

    setActiveInterviewTrack(normalizedCategory);
    container.innerHTML = `
        <div class="interview-loader">
            <p>Preparing your ${normalizedCategory.toUpperCase()} mock interview (${requestedCount} questions)...</p>
        </div>
    `;

    try {
        const endpoint = `${API_BASE}/interview/${normalizedCategory}?count=${requestedCount}`;
        const response = await fetch(endpoint);
        const questions = await response.json();

        if (!response.ok || !Array.isArray(questions) || questions.length === 0) {
            throw new Error('No interview questions available');
        }

        interviewSession.questions = questions;
        renderInterviewChat();
    } catch (error) {
        container.innerHTML = `
            <div class="interview-error">
                <h3>Unable to load interview</h3>
                <p>Please try again in a moment.</p>
            </div>
        `;
        console.error('Error loading interview questions:', error);
    }
}

function setActiveInterviewTrack(category) {
    const technicalBtn = document.getElementById('interview-technical-btn');
    const hrBtn = document.getElementById('interview-hr-btn');
    if (!technicalBtn || !hrBtn) {
        return;
    }

    technicalBtn.classList.toggle('active-track', category === 'technical');
    hrBtn.classList.toggle('active-track', category === 'hr');
}

function getInterviewProgressPercent() {
    if (!interviewSession.questions.length) {
        return 0;
    }

    if (interviewSession.completed) {
        return 100;
    }

    return Math.round((interviewSession.answers.length / interviewSession.questions.length) * 100);
}

function renderInterviewChat() {
    const container = document.getElementById('interview-container');
    if (!container) {
        return;
    }

    const total = interviewSession.questions.length;
    const progressPercent = getInterviewProgressPercent();
    const currentQuestion = interviewSession.questions[interviewSession.currentIndex];
    const isComplete = interviewSession.completed || interviewSession.currentIndex >= total;

    const messages = interviewSession.answers.map((entry, index) => {
        return `
            <div class="chat-row bot-row">
                <div class="chat-avatar">HR</div>
                <div class="chat-bubble bot-bubble">
                    <p class="chat-meta">Question ${index + 1}</p>
                    <p>${escapeHtml(entry.question)}</p>
                </div>
            </div>
            <div class="chat-row user-row">
                <div class="chat-bubble user-bubble">
                    <p class="chat-meta">Your answer</p>
                    <p>${escapeHtml(entry.answer)}</p>
                </div>
            </div>
        `;
    }).join('');

    const nextQuestionMarkup = !isComplete && currentQuestion ? `
        <div class="chat-row bot-row">
            <div class="chat-avatar">HR</div>
            <div class="chat-bubble bot-bubble current-question">
                <p class="chat-meta">Question ${interviewSession.currentIndex + 1} of ${total}</p>
                <p>${escapeHtml(currentQuestion.question)}</p>
            </div>
        </div>
    ` : '';

    const summaryMarkup = isComplete ? renderInterviewSummary() : '';
    const submitLabel = interviewSession.currentIndex + 1 >= total ? 'Submit Final Answer' : 'Submit Answer';
    const disableSubmit = isComplete ? 'disabled' : '';

    container.innerHTML = `
        <div class="interview-chat-frame">
            <div class="interview-chat-topbar">
                <div>
                    <h3>${interviewSession.category === 'hr' ? 'HR Mock Interview' : 'Technical Mock Interview'}</h3>
                    <p>Answer each question as if you are in a real interview round.</p>
                </div>
                <div class="interview-progress-chip">${progressPercent}% Complete</div>
            </div>
            <div class="interview-progress-line">
                <span style="width: ${progressPercent}%;"></span>
            </div>
            <div class="interview-chat-messages" id="interview-chat-messages">
                ${messages}
                ${nextQuestionMarkup}
                ${summaryMarkup}
            </div>
            <div class="interview-chat-composer">
                <label for="interview-answer-input">Your response</label>
                <textarea id="interview-answer-input" rows="4" placeholder="Type your answer here..." ${disableSubmit}></textarea>
                <div class="interview-composer-actions">
                    <button type="button" class="ghost-btn interview-secondary-btn" onclick="restartInterviewSession()">Restart</button>
                    <button type="button" onclick="submitInterviewAnswer()" ${disableSubmit}>${submitLabel}</button>
                </div>
            </div>
        </div>
    `;

    if (!isComplete) {
        const answerInput = document.getElementById('interview-answer-input');
        if (answerInput) {
            answerInput.focus();
        }
    }

    scrollInterviewChatToBottom();
}

function submitInterviewAnswer() {
    if (interviewSession.completed) {
        return;
    }

    const answerInput = document.getElementById('interview-answer-input');
    if (!answerInput) {
        return;
    }

    const answerText = answerInput.value.trim();
    if (!answerText) {
        answerInput.focus();
        return;
    }

    const currentQuestion = interviewSession.questions[interviewSession.currentIndex];
    if (!currentQuestion) {
        return;
    }

    interviewSession.answers.push({
        id: currentQuestion.id,
        question: currentQuestion.question,
        answer: answerText
    });

    interviewSession.currentIndex += 1;
    if (interviewSession.currentIndex >= interviewSession.questions.length) {
        interviewSession.completed = true;
        const totalAnswers = interviewSession.answers.length;
        const detailedAnswers = interviewSession.answers.filter(item => item.answer.trim().split(/\s+/).length >= 15).length;
        const readiness = totalAnswers === 0 ? 0 : Math.round((detailedAnswers / totalAnswers) * 100);
        recordAiInterviewHistory({
            category: interviewSession.category,
            requestedCount: interviewSession.requestedCount,
            answeredCount: totalAnswers,
            readiness
        });
    }

    renderInterviewChat();
}

function restartInterviewSession() {
    loadInterview(interviewSession.category);
}

function renderInterviewSummary() {
    const totalAnswers = interviewSession.answers.length;
    const detailedAnswers = interviewSession.answers.filter(item => item.answer.trim().split(/\s+/).length >= 15).length;
    const conciseAnswers = totalAnswers - detailedAnswers;
    const readiness = totalAnswers === 0 ? 0 : Math.round((detailedAnswers / totalAnswers) * 100);
    const readinessLabel = readiness >= 75
        ? 'Strong depth'
        : readiness >= 45
            ? 'Good baseline'
            : 'Needs more detail';

    return `
        <div class="interview-summary-card">
            <h4>Interview Submitted</h4>
            <p>You completed ${totalAnswers} questions in this mock round.</p>
            <div class="interview-summary-grid">
                <div>
                    <span class="summary-k">Detailed Answers</span>
                    <strong>${detailedAnswers}</strong>
                </div>
                <div>
                    <span class="summary-k">Concise Answers</span>
                    <strong>${conciseAnswers}</strong>
                </div>
                <div>
                    <span class="summary-k">Readiness</span>
                    <strong>${readiness}%</strong>
                </div>
                <div>
                    <span class="summary-k">Signal</span>
                    <strong>${readinessLabel}</strong>
                </div>
            </div>
            <p class="summary-note">Tip: Use STAR format (Situation, Task, Action, Result) for stronger interview responses.</p>
        </div>
    `;
}

function scrollInterviewChatToBottom() {
    const chatMessages = document.getElementById('interview-chat-messages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Analyze performance
async function analyzePerformance() {
    const aptitudeScore = document.getElementById('aptitude-score').value || 0;
    const codingScore = document.getElementById('coding-score').value || 0;
    const interviewScore = document.getElementById('interview-score').value || 0;
    const endpoint = `${API_BASE}/analyze`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                aptitude_score: parseInt(aptitudeScore),
                coding_score: parseInt(codingScore),
                interview_score: parseInt(interviewScore)
            })
        });
        
        const result = await response.json();
        displayAnalysisResult(result);
    } catch (error) {
        console.error('Error analyzing performance:', error);
    }
}

// Display analysis result
function displayAnalysisResult(result) {
    const container = document.getElementById('analysis-result');
    const score = typeof result.percentage !== 'undefined' ? result.percentage : result.overall_score;
    const title = currentRole
        ? `${currentRole} Analysis`
        : 'Performance Analysis';
    container.innerHTML = `
        <h3>${title}</h3>
        <div class="score">${score}%</div>
        <div class="level">${result.level}</div>
        <div class="feedback">${result.feedback}</div>
        
        ${result.weak_areas.length > 0 ? `
            <div class="weak-areas">
                <h4>Weak Areas:</h4>
                <ul>
                    ${result.weak_areas.map(area => `<li>${area}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        
        <div class="recommendations">
            <h4>Recommendations:</h4>
            <ul>
                ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
}

async function analyzeTcsPerformance() {
    const aptitudeScore = document.getElementById('tcs-aptitude-score')?.value || 0;
    const codingScore = document.getElementById('tcs-coding-score')?.value || 0;
    const interviewScore = document.getElementById('tcs-interview-score')?.value || 0;
    const resultDiv = document.getElementById('tcs-analysis-result');

    if (!resultDiv) {
        return;
    }

    resultDiv.innerHTML = '<p>Analyzing your TCS readiness...</p>';

    try {
        const response = await fetch(`${API_BASE}/tcs/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                aptitude_score: parseInt(aptitudeScore),
                coding_score: parseInt(codingScore),
                interview_score: parseInt(interviewScore)
            })
        });

        const result = await response.json();

        resultDiv.innerHTML = `
            <h4>Your TCS Analysis</h4>
            <div class="tcs-percentage">${result.percentage}%</div>
            <div class="tcs-level">${result.level}</div>
            <p class="tcs-feedback">${result.feedback}</p>
            ${result.weak_areas && result.weak_areas.length ? `
                <div class="tcs-weak">
                    <strong>Weak Areas:</strong> ${result.weak_areas.join(', ')}
                </div>
            ` : ''}
        `;
    } catch (error) {
        resultDiv.innerHTML = '<p class="error">Unable to analyze now. Please try again.</p>';
        console.error('Error analyzing TCS performance:', error);
    }
}

// â”€â”€ Hands-on IT Module â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const handsOnITTopics = [
    {
        key: 'linux',
        title: 'Linux Fundamentals',
        icon: 'ðŸ§',
        level: 'Beginner',
        description: 'File system navigation, permissions, processes, and shell scripting basics.',
        subtopics: [
            { name: 'File System & Navigation', detail: 'Understand the Linux directory tree (/etc, /var, /home, /usr). Master commands: ls, cd, pwd, find, locate. Learn absolute vs relative paths.' },
            { name: 'File Permissions & Ownership', detail: 'Read/write/execute bits for user, group, others. chmod (symbolic & octal), chown, chgrp. Special bits: setuid, setgid, sticky bit.' },
            { name: 'Process Management', detail: 'ps, top, htop, kill, pkill, nice, renice. Foreground vs background jobs. Signals: SIGTERM, SIGKILL, SIGHUP. systemd service management.' },
            { name: 'Shell Scripting', detail: 'Bash variables, conditionals (if/elif/else), loops (for/while), functions. Input/output redirection, pipes. Cron jobs for scheduling.' },
            { name: 'Package Management', detail: 'apt (Debian/Ubuntu): apt install, apt update, apt upgrade. yum/dnf (RHEL/CentOS). Checking installed packages, removing, and holding versions.' }
        ]
    },
    {
        key: 'networking',
        title: 'Networking Basics',
        icon: 'ðŸŒ',
        level: 'Beginner',
        description: 'TCP/IP model, DNS, HTTP, subnetting, and common network tools.',
        subtopics: [
            { name: 'OSI & TCP/IP Models', detail: 'Seven OSI layers vs four TCP/IP layers. Role of each layer: Physical, Data Link, Network, Transport, Session, Presentation, Application. Common protocols per layer.' },
            { name: 'IP Addressing & Subnetting', detail: 'IPv4 classes, CIDR notation. Subnet mask calculation. Private vs public IP ranges (RFC 1918). IPv6 basics and address format.' },
            { name: 'DNS & HTTP/HTTPS', detail: 'DNS resolution flow: recursive resolver, root, TLD, authoritative. A, CNAME, MX, TXT records. HTTP methods (GET, POST, PUT, DELETE). Status codes (2xx, 3xx, 4xx, 5xx). TLS handshake overview.' },
            { name: 'Network Tools', detail: 'ping, traceroute/tracert, nslookup, dig, netstat, ss, curl, wget. Reading network interface info with ip addr and ifconfig.' },
            { name: 'Firewalls & Ports', detail: 'Common ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3306 (MySQL), 5432 (PostgreSQL). iptables basics. UFW (Uncomplicated Firewall) rules.' }
        ]
    },
    {
        key: 'cloud',
        title: 'Cloud Fundamentals',
        icon: 'â˜ï¸',
        level: 'Beginner',
        description: 'IaaS/PaaS/SaaS models, core AWS/Azure/GCP services, and deployment basics.',
        subtopics: [
            { name: 'Cloud Service Models', detail: 'IaaS (you manage OS up), PaaS (you manage app up), SaaS (fully managed). Shared responsibility model. On-premises vs cloud trade-offs.' },
            { name: 'Core Compute Services', detail: 'AWS EC2, Azure VMs, GCP Compute Engine. Instance types and sizing. Auto Scaling groups. Serverless: AWS Lambda, Azure Functions, GCP Cloud Functions.' },
            { name: 'Storage Services', detail: 'Object storage: S3, Azure Blob, GCS. Block storage: EBS, Azure Disk. File storage: EFS, Azure Files. Storage classes and lifecycle policies.' },
            { name: 'Networking in Cloud', detail: 'VPC (Virtual Private Cloud), subnets, route tables, internet gateways. Security groups vs NACLs. Load balancers: ALB, NLB. CDN: CloudFront, Azure CDN.' },
            { name: 'IAM & Security', detail: 'Users, groups, roles, policies. Principle of least privilege. MFA enforcement. Service accounts. Key management (KMS, Key Vault).' }
        ]
    },
    {
        key: 'docker',
        title: 'Docker & Containers',
        icon: 'ðŸ³',
        level: 'Intermediate',
        description: 'Container concepts, Dockerfile authoring, image management, and Docker Compose.',
        subtopics: [
            { name: 'Container Concepts', detail: 'Containers vs VMs: shared kernel, namespaces, cgroups. Images vs containers. Layers and the union file system. Why containers improve consistency.' },
            { name: 'Dockerfile Basics', detail: 'FROM, RUN, COPY, ADD, WORKDIR, EXPOSE, CMD, ENTRYPOINT. Multi-stage builds to reduce image size. .dockerignore file.' },
            { name: 'Image Management', detail: 'docker build, docker pull, docker push. Tagging conventions. Docker Hub and private registries (ECR, ACR, GCR). Image scanning for vulnerabilities.' },
            { name: 'Running Containers', detail: 'docker run flags: -d, -p, -v, --env, --name, --rm. Inspecting with docker logs, docker exec, docker inspect. Stopping and removing containers.' },
            { name: 'Docker Compose', detail: 'docker-compose.yml structure: services, volumes, networks. Defining multi-container apps. docker compose up/down/logs. Environment variable files.' }
        ]
    },
    {
        key: 'git',
        title: 'Git & Version Control',
        icon: 'ðŸ”€',
        level: 'Beginner',
        description: 'Core Git workflow, branching strategies, and collaboration with remote repos.',
        subtopics: [
            { name: 'Core Git Workflow', detail: 'git init, git clone. Staging area: git add, git status. Committing: git commit -m. Viewing history: git log, git diff. Undoing: git restore, git reset.' },
            { name: 'Branching & Merging', detail: 'git branch, git checkout -b, git switch. Merging: fast-forward vs three-way merge. Resolving merge conflicts. git rebase vs merge trade-offs.' },
            { name: 'Remote Repositories', detail: 'git remote add, git fetch, git pull, git push. Tracking branches. Forking workflow. Pull requests / merge requests.' },
            { name: 'Branching Strategies', detail: 'Git Flow: main, develop, feature, release, hotfix branches. Trunk-based development. Feature flags. Semantic versioning and tagging.' },
            { name: 'Advanced Git', detail: 'git stash, git cherry-pick, git bisect. Interactive rebase (git rebase -i). .gitignore patterns. Signing commits with GPG.' }
        ]
    },
    {
        key: 'databases',
        title: 'Databases',
        icon: 'ðŸ—„ï¸',
        level: 'Beginner',
        description: 'SQL fundamentals, NoSQL concepts, indexing, and basic query optimization.',
        subtopics: [
            { name: 'SQL Fundamentals', detail: 'SELECT, INSERT, UPDATE, DELETE. WHERE, ORDER BY, GROUP BY, HAVING. JOINs: INNER, LEFT, RIGHT, FULL OUTER. Subqueries and CTEs.' },
            { name: 'Schema Design', detail: 'Tables, primary keys, foreign keys, constraints (NOT NULL, UNIQUE, CHECK). Normalization: 1NF, 2NF, 3NF. ER diagrams.' },
            { name: 'Indexing & Performance', detail: 'B-tree indexes, composite indexes. EXPLAIN / EXPLAIN ANALYZE. Covering indexes. When indexes hurt (write-heavy tables). Query plan reading.' },
            { name: 'NoSQL Concepts', detail: 'Document stores (MongoDB), key-value (Redis), column-family (Cassandra), graph (Neo4j). CAP theorem. When to choose NoSQL over SQL.' },
            { name: 'Transactions & ACID', detail: 'Atomicity, Consistency, Isolation, Durability. Isolation levels: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE. Deadlocks and how to avoid them.' }
        ]
    }
];

function renderHandsOnIT() {
    const container = document.getElementById('hands-on-it-content');
    if (!container) return;

    container.innerHTML = `
        <div class="module-learn-shell">
            <div class="module-topic-grid">
                ${handsOnITTopics.map(topic => `
                    <div class="module-topic-card" id="hit-card-${topic.key}">
                        <div class="module-topic-header">
                            <span class="module-topic-icon">${topic.icon}</span>
                            <div>
                                <h3>${topic.title}</h3>
                                <span class="hub-tag ${topic.level === 'Beginner' ? 'level-beginner' : 'level-intermediate'}">${topic.level}</span>
                            </div>
                        </div>
                        <p class="module-topic-desc">${topic.description}</p>
                        <button type="button" class="module-expand-btn" onclick="toggleModuleTopic('hit', '${topic.key}')">
                            Explore Topics â†’
                        </button>
                        <div class="module-subtopics" id="hit-subtopics-${topic.key}" style="display:none;">
                            ${topic.subtopics.map((sub, i) => `
                                <div class="module-subtopic-item">
                                    <button type="button" class="module-subtopic-btn" onclick="toggleSubtopicDetail('hit-${topic.key}', ${i})">
                                        <span>${sub.name}</span>
                                        <span class="module-subtopic-arrow">â–¸</span>
                                    </button>
                                    <div class="module-subtopic-detail" id="hit-${topic.key}-detail-${i}" style="display:none;">
                                        <p>${sub.detail}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// â”€â”€ System Design Module â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const systemDesignTopics = [
    {
        key: 'fundamentals',
        title: 'Design Fundamentals',
        icon: 'ðŸ—ï¸',
        level: 'Beginner',
        description: 'Scalability, availability, reliability, and the core trade-offs in system design.',
        subtopics: [
            { name: 'Scalability', detail: 'Vertical scaling (bigger machine) vs horizontal scaling (more machines). Stateless vs stateful services. Sharding data. Auto-scaling policies. Bottleneck identification.' },
            { name: 'Availability & Reliability', detail: 'Uptime SLAs (99.9% = 8.7h downtime/year, 99.99% = 52min). Redundancy and replication. MTTR vs MTBF. Health checks and circuit breakers.' },
            { name: 'CAP Theorem', detail: 'Consistency, Availability, Partition Tolerance â€” pick two. CP systems (HBase, Zookeeper). AP systems (Cassandra, DynamoDB). CA systems (single-node RDBMS). PACELC extension.' },
            { name: 'Latency vs Throughput', detail: 'Latency: time for one request. Throughput: requests per second. Little\'s Law: L = Î»W. Tail latency (p99, p999). Optimizing for the common case.' },
            { name: 'Back-of-Envelope Estimation', detail: 'Powers of 2 and latency numbers. Estimating QPS, storage, bandwidth. Example: design Twitter â€” 300M users, 100M tweets/day, 1KB/tweet = ~100GB/day storage.' }
        ]
    },
    {
        key: 'load-balancing',
        title: 'Load Balancing & Proxies',
        icon: 'âš–ï¸',
        level: 'Beginner',
        description: 'Distributing traffic, reverse proxies, and health-check strategies.',
        subtopics: [
            { name: 'Load Balancing Algorithms', detail: 'Round robin, weighted round robin, least connections, IP hash, random. Sticky sessions (session affinity). Layer 4 vs Layer 7 load balancing.' },
            { name: 'Reverse Proxy', detail: 'Nginx, HAProxy, AWS ALB. SSL termination at the proxy. Request routing by path or host. Rate limiting and DDoS protection at the edge.' },
            { name: 'Health Checks', detail: 'Active (probe endpoint) vs passive (monitor traffic errors). Graceful degradation when a node fails. Removing unhealthy nodes from rotation. Warm-up period for new nodes.' },
            { name: 'Global Load Balancing', detail: 'GeoDNS routing users to nearest data center. Anycast routing. AWS Route 53 latency-based routing. Failover policies.' },
            { name: 'Service Mesh', detail: 'Sidecar proxy pattern (Envoy, Linkerd). mTLS between services. Observability: distributed tracing, metrics. Traffic management: canary, blue-green.' }
        ]
    },
    {
        key: 'caching',
        title: 'Caching Strategies',
        icon: 'âš¡',
        level: 'Intermediate',
        description: 'Cache placement, eviction policies, invalidation, and distributed caching.',
        subtopics: [
            { name: 'Cache Placement', detail: 'Client-side, CDN, reverse proxy, application-level, database query cache. Read-through, write-through, write-behind, cache-aside (lazy loading) patterns.' },
            { name: 'Eviction Policies', detail: 'LRU (Least Recently Used), LFU (Least Frequently Used), FIFO, TTL-based expiry. Redis maxmemory-policy options. Choosing the right policy for your access pattern.' },
            { name: 'Cache Invalidation', detail: 'The hardest problem in CS. TTL-based expiry. Event-driven invalidation (pub/sub). Write-through ensures consistency. Cache stampede / thundering herd and solutions (mutex, probabilistic early expiry).' },
            { name: 'Distributed Caching', detail: 'Redis Cluster vs Redis Sentinel. Consistent hashing for key distribution. Memcached vs Redis trade-offs. Hot key problem and local in-process cache as L1.' },
            { name: 'CDN Caching', detail: 'Edge nodes cache static assets. Cache-Control headers: max-age, s-maxage, no-cache, no-store. Cache busting with content hashes. Dynamic content at the edge (edge computing).' }
        ]
    },
    {
        key: 'databases-design',
        title: 'Database Design at Scale',
        icon: 'ðŸ—ƒï¸',
        level: 'Intermediate',
        description: 'Replication, sharding, partitioning, and choosing the right database.',
        subtopics: [
            { name: 'Replication', detail: 'Primary-replica (master-slave): sync vs async replication. Multi-primary for write scaling. Replication lag and read-your-writes consistency. Failover and promotion.' },
            { name: 'Sharding & Partitioning', detail: 'Horizontal sharding by range, hash, or directory. Hotspot problem with range sharding. Consistent hashing. Resharding challenges. Vitess for MySQL sharding.' },
            { name: 'SQL vs NoSQL', detail: 'SQL: ACID, joins, schema enforcement. NoSQL: flexible schema, horizontal scale, eventual consistency. Choosing based on query patterns, consistency needs, and scale.' },
            { name: 'Database Indexing at Scale', detail: 'Composite indexes and selectivity. Covering indexes. Partial indexes. Index bloat. Read vs write trade-off. Denormalization for read performance.' },
            { name: 'NewSQL & Distributed SQL', detail: 'CockroachDB, Google Spanner, TiDB. Distributed transactions with 2PC. Paxos/Raft consensus. Global consistency with bounded staleness.' }
        ]
    },
    {
        key: 'messaging',
        title: 'Messaging & Event Streaming',
        icon: 'ðŸ“¨',
        level: 'Intermediate',
        description: 'Message queues, event-driven architecture, and stream processing.',
        subtopics: [
            { name: 'Message Queues', detail: 'Point-to-point vs pub/sub. RabbitMQ, AWS SQS, Azure Service Bus. At-least-once vs exactly-once delivery. Dead letter queues. Message ordering guarantees.' },
            { name: 'Event Streaming', detail: 'Apache Kafka: topics, partitions, consumer groups, offsets. Retention and compaction. Kafka Streams vs Flink for stream processing. Event sourcing pattern.' },
            { name: 'Async vs Sync Communication', detail: 'Synchronous: REST, gRPC â€” tight coupling, simpler. Asynchronous: queues, events â€” loose coupling, resilient. Saga pattern for distributed transactions.' },
            { name: 'Backpressure & Flow Control', detail: 'Producer faster than consumer. Bounded queues. Rate limiting producers. Consumer scaling. Circuit breaker to stop cascading failures.' },
            { name: 'Event-Driven Architecture', detail: 'Event sourcing: store events, derive state. CQRS: separate read and write models. Outbox pattern for reliable event publishing. Idempotent consumers.' }
        ]
    },
    {
        key: 'api-design',
        title: 'API Design',
        icon: 'ðŸ”Œ',
        level: 'Beginner',
        description: 'REST, GraphQL, gRPC, versioning, and API gateway patterns.',
        subtopics: [
            { name: 'REST Best Practices', detail: 'Resource-based URLs (/users/{id}). HTTP verbs semantics. Statelessness. HATEOAS. Pagination: cursor vs offset. Filtering, sorting, field selection.' },
            { name: 'GraphQL', detail: 'Schema definition language. Queries, mutations, subscriptions. N+1 problem and DataLoader. Persisted queries. When to choose GraphQL over REST.' },
            { name: 'gRPC', detail: 'Protocol Buffers for schema. HTTP/2 multiplexing. Unary, server streaming, client streaming, bidirectional streaming. Code generation. When gRPC beats REST.' },
            { name: 'API Versioning', detail: 'URL versioning (/v1/users), header versioning, query param versioning. Semantic versioning. Deprecation strategy. Backward compatibility rules.' },
            { name: 'API Gateway', detail: 'Single entry point: auth, rate limiting, routing, logging. AWS API Gateway, Kong, Nginx. BFF (Backend for Frontend) pattern. Aggregating multiple microservices.' }
        ]
    },
    {
        key: 'case-studies',
        title: 'Classic Design Problems',
        icon: 'ðŸ“',
        level: 'Intermediate',
        description: 'Walk through URL shortener, rate limiter, news feed, and notification system designs.',
        subtopics: [
            { name: 'URL Shortener', detail: 'Requirements: shorten URL, redirect, analytics. Key generation: hash (MD5/SHA) vs counter + base62. Storage: KV store (Redis + DB). Redirect: 301 (cacheable) vs 302. Scale: 100M URLs, 10B redirects/day.' },
            { name: 'Rate Limiter', detail: 'Algorithms: token bucket, leaky bucket, fixed window, sliding window log, sliding window counter. Storage: Redis with atomic Lua scripts. Distributed rate limiting. Headers: X-RateLimit-Remaining.' },
            { name: 'News Feed System', detail: 'Fan-out on write (push) vs fan-out on read (pull). Hybrid for celebrities. Feed ranking: recency, engagement, ML score. Pagination with cursor. Cache hot feeds in Redis.' },
            { name: 'Notification System', detail: 'Push (APNs, FCM), email (SendGrid), SMS (Twilio). Notification service â†’ message queue â†’ workers per channel. Retry with exponential backoff. User preferences and opt-out.' },
            { name: 'Design a Chat System', detail: 'WebSocket for real-time. Message storage: one table per user pair vs single messages table. Presence service. Group chat fan-out. Read receipts. End-to-end encryption overview.' }
        ]
    }
];

function renderSystemDesign() {
    const container = document.getElementById('system-design-content');
    if (!container) return;

    container.innerHTML = `
        <div class="module-learn-shell">
            <div class="module-topic-grid">
                ${systemDesignTopics.map(topic => `
                    <div class="module-topic-card" id="sd-card-${topic.key}">
                        <div class="module-topic-header">
                            <span class="module-topic-icon">${topic.icon}</span>
                            <div>
                                <h3>${topic.title}</h3>
                                <span class="hub-tag ${topic.level === 'Beginner' ? 'level-beginner' : 'level-intermediate'}">${topic.level}</span>
                            </div>
                        </div>
                        <p class="module-topic-desc">${topic.description}</p>
                        <button type="button" class="module-expand-btn" onclick="toggleModuleTopic('sd', '${topic.key}')">
                            Explore Topics â†’
                        </button>
                        <div class="module-subtopics" id="sd-subtopics-${topic.key}" style="display:none;">
                            ${topic.subtopics.map((sub, i) => `
                                <div class="module-subtopic-item">
                                    <button type="button" class="module-subtopic-btn" onclick="toggleSubtopicDetail('sd-${topic.key}', ${i})">
                                        <span>${sub.name}</span>
                                        <span class="module-subtopic-arrow">â–¸</span>
                                    </button>
                                    <div class="module-subtopic-detail" id="sd-${topic.key}-detail-${i}" style="display:none;">
                                        <p>${sub.detail}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function toggleModuleTopic(prefix, key) {
    const subtopicsEl = document.getElementById(`${prefix}-subtopics-${key}`);
    const btn = subtopicsEl?.previousElementSibling;
    if (!subtopicsEl) return;
    const isOpen = subtopicsEl.style.display !== 'none';
    subtopicsEl.style.display = isOpen ? 'none' : 'block';
    if (btn) btn.textContent = isOpen ? 'Explore Topics â†’' : 'Collapse â†‘';
}

function toggleSubtopicDetail(topicId, index) {
    const detailEl = document.getElementById(`${topicId}-detail-${index}`);
    const btn = detailEl?.previousElementSibling;
    if (!detailEl) return;
    const isOpen = detailEl.style.display !== 'none';
    detailEl.style.display = isOpen ? 'none' : 'block';
    if (btn) {
        const arrow = btn.querySelector('.module-subtopic-arrow');
        if (arrow) arrow.textContent = isOpen ? 'â–¸' : 'â–¾';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    initCompanyExplorer();
    updateSectionContext();
    initFirebaseClient();
    await loadCareerState();
    await loadUserHistory();
    loadCodingQuestions();
    setActiveNavLink('home');
});
