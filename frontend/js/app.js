// API Base URL
const API_BASE = 'http://localhost:5000/api';

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
        description: 'Build ATS-friendly resume content and get quality checks before applying.',
        statLabel: 'Resume readiness',
        scoreField: 'resumeScore',
        cta: 'Open Resume Tool'
    },
    {
        key: 'cover-letter',
        title: 'Cover Letter Generator',
        description: 'Generate role-specific cover letters with measurable achievements.',
        statLabel: 'Cover letter quality',
        scoreField: 'coverLetterScore',
        cta: 'Generate Cover Letter'
    },
    {
        key: 'auto-apply',
        title: 'Auto Job Apply',
        description: 'Track auto-apply targets, preferred roles, and daily outreach progress.',
        statLabel: 'Application automation',
        scoreField: 'jobApplyScore',
        cta: 'Configure Auto Apply'
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
                            <span>📚 ${item.tests}</span>
                            <span>👥 ${item.learners}</span>
                            <span>⭐ ${item.rating}</span>
                        </div>
                        <span class="mnc-card-cta">Start Learning →</span>
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
                        <span>📚 ${item.tests}</span>
                        <span>👥 ${item.learners}</span>
                        <span>⭐ ${item.rating}</span>
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

function resetAptitudeView() {
    const aptitudeCategories = document.getElementById('aptitude-categories');
    const aptitudeContainer = document.getElementById('aptitude-container');

    if (aptitudeCategories) {
        aptitudeCategories.style.display = 'flex';
    }
    if (aptitudeContainer) {
        const tcsShowcase = renderCompanyAptitudeShowcase('tcs');
        aptitudeContainer.innerHTML = tcsShowcase
            ? `
                <div class="home-common-aptitude">
                    <h3>Common Aptitude Topics</h3>
                    <p class="subtitle">Practice the full TCS common aptitude set directly from the home Aptitude section.</p>
                    ${tcsShowcase}
                </div>
            `
            : '';
    }
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
    }
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
        tips: ['Separate “some” from “all” very carefully.', 'Reject conclusions based on possibility when the question asks for certainty.']
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
        overview: 'The goal is to understand the author’s central idea, tone, and direct meaning rather than rely on outside knowledge.',
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
                <button class="back-btn" onclick="${backHandler}" style="margin-bottom: 16px;">← Back to Common Aptitude Topics</button>
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
                <h2>📅 Overview of TCS</h2>
                <ul>
                    <li><strong>Founded:</strong> 1968</li>
                    <li><strong>Founder:</strong> Faquir Chand Kohli (known as the father of the Indian IT industry)</li>
                    <li><strong>Headquarters:</strong> Mumbai, India</li>
                    <li><strong>CEO:</strong> K. Krithivasan</li>
                    <li><strong>Employees:</strong> 600,000+ worldwide 🌍</li>
                </ul>
                <p>TCS is one of the largest IT employers in India.</p>

                <h2>💻 What TCS Does</h2>
                <p>TCS provides IT services, consulting, and business solutions to companies around the world.</p>
                <p>Main services include:</p>
                <ul>
                    <li>Software development</li>
                    <li>Cloud computing ☁️</li>
                    <li>Artificial Intelligence</li>
                    <li>Cybersecurity</li>
                    <li>Data analytics</li>
                    <li>IT consulting</li>
                    <li>Application development</li>
                    <li>Digital transformation</li>
                </ul>
                <p>Many global companies depend on TCS for their technology systems.</p>

                <h2>🌎 Global Presence</h2>
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

                <h2>🏆 Achievements</h2>
                <ul>
                    <li>One of the most valuable IT companies in the world</li>
                    <li>Listed on the Bombay Stock Exchange (BSE) and National Stock Exchange of India (NSE)</li>
                    <li>Consistently ranked among top IT services companies globally</li>
                    <li>Known for strong employee training programs</li>
                </ul>

                <h2>👨‍💻 Why Many Students Prefer TCS</h2>
                <p>Fresh graduates often try to join TCS because:</p>
                <ul>
                    <li>✅ Good training for freshers</li>
                    <li>✅ Job stability</li>
                    <li>✅ Global projects</li>
                    <li>✅ Good work culture</li>
                    <li>✅ Opportunity to work abroad 🌎</li>
                </ul>

                <h2>🎓 TCS Hiring Programs</h2>
                <p>TCS hires freshers through programs like:</p>
                <ul>
                    <li>TCS National Qualifier Test (TCS NQT)</li>
                    <li>Campus recruitment drives</li>
                    <li>TCS CodeVita coding contest</li>
                </ul>

                <h2>📊 Simple Company Structure</h2>
                <div class="structure">
                    <p>Tata Group</p>
                    <p>│</p>
                    <p>▼</p>
                    <p>Tata Consultancy Services (TCS)</p>
                    <p>│</p>
                    <p>├── IT Services</p>
                    <p>├── Consulting</p>
                    <p>├── Cloud & AI</p>
                    <p>├── Cybersecurity</p>
                    <p>└── Digital Solutions</p>
                </div>

                <h2>1️⃣ TCS Interview Process</h2>
                <div class="flow-chart">
                    <p>Apply through TCS NextStep / Campus</p>
                    <p>│</p>
                    <p>▼</p>
                    <p>Online Aptitude Test</p>
                    <p>(Quantitative + Logical + Verbal)</p>
                    <p>│</p>
                    <p>▼</p>
                    <p>Programming Test</p>
                    <p>(Coding / Hands-on)</p>
                    <p>│</p>
                    <p>▼</p>
                    <p>Technical Interview</p>
                    <p>(Programming + Core CS Concepts)</p>
                    <p>│</p>
                    <p>▼</p>
                    <p>HR Interview</p>
                    <p>(Personality + Communication)</p>
                    <p>│</p>
                    <p>▼</p>
                    <p>Offer Letter</p>
                </div>
                <p><em>Some campuses may combine Technical + HR in one round.</em></p>

                <h2>2️⃣ Common Aptitude Topics You Must Cover 🧠</h2>
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
                <p>📌 Practice from platforms like IndiaBIX, PrepInsta</p>

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

                <h2>3️⃣ Programming Languages You Should Cover 💻</h2>
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

                <h2>4️⃣ Core Computer Science Concepts 📚</h2>
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

                <h2>5️⃣ Coding Questions Asked in TCS</h2>
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

                <h2>6️⃣ Technical Interview Questions (Common) 🎯</h2>
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

                <h2>7️⃣ HR Interview Questions 💬</h2>
                <p>Common HR questions:</p>
                <ul>
                    <li>Why do you want to join TCS?</li>
                    <li>What are your strengths and weaknesses?</li>
                    <li>Where do you see yourself in 5 years?</li>
                    <li>Are you willing to relocate?</li>
                    <li>Why should we hire you?</li>
                </ul>

                <h2>8️⃣ Important Tips to Crack TCS Interview ⭐</h2>
                <ul>
                    <li>✔ Improve communication skills</li>
                    <li>✔ Practice mock interviews</li>
                    <li>✔ Be confident while speaking</li>
                    <li>✔ Prepare resume properly</li>
                    <li>✔ Know your final year project clearly</li>
                    <li>✔ Practice coding daily</li>
                    <li>✔ Revise basic CS concepts</li>
                </ul>

                <h2>9️⃣ Extra Things That Help You Get Selected 🚀</h2>
                <ul>
                    <li>Learn Object-Oriented Programming (OOP)</li>
                    <li>Learn basic SQL</li>
                    <li>Learn Git basics</li>
                    <li>Know software development lifecycle</li>
                    <li>Build 2–3 small projects</li>
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
                    <button class="practice-btn" onclick="showTcsAptitude()">🎯 Practice Common Aptitude Questions</button>
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
            <button class="back-btn" onclick="hideTcsAptitudeTopics()" style="margin-top: 20px;">← Back to ${companyName} Topics</button>
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
        <button class="back-btn" onclick="showCompanyAptitudeTopics('${company}')" style="margin-bottom: 20px;">← Back to ${companyName} Topics</button>
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
        resultDiv.innerHTML = '<span class="correct">✅ Correct!</span>';
    } else {
        resultDiv.innerHTML = `<span class="incorrect">❌ Incorrect. Correct answer: ${correct}</span>`;
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
        resultDiv.innerHTML = '<span class="correct">✅ Correct!</span>';
    } else {
        resultDiv.innerHTML = `<span class="incorrect">❌ Incorrect. Correct answer: ${correct}</span>`;
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
    if (!listDiv) {
        return;
    }

    listDiv.style.display = 'block';
    listDiv.innerHTML = `
        <div class="career-tools-shell">
            <div class="career-tools-grid">
                ${careerToolsCatalog.map((tool, index) => `
                    <button
                        type="button"
                        class="career-tool-card career-tool-option"
                        data-tool="${tool.key}"
                        style="--enter-delay:${index * 140}ms;"
                    >
                        <div class="career-tool-card-top">
                            <span class="career-tool-icon">${tool.key === 'resume' ? 'CV' : tool.key === 'cover-letter' ? 'CL' : 'AJ'}</span>
                        </div>
                        <div class="career-tool-card-body">
                            <h3>${tool.title}</h3>
                            <p>${tool.description}</p>
                            <div class="career-tool-meta">
                                <span>${tool.statLabel}</span>
                                <strong>${careerToolState[tool.scoreField]}%</strong>
                            </div>
                            <span class="career-tool-cta">${tool.cta} &rarr;</span>
                        </div>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    listDiv.querySelectorAll('.career-tool-option').forEach(card => {
        card.addEventListener('click', function () {
            const toolKey = this.getAttribute('data-tool');
            if (toolKey) {
                openCareerTool(toolKey);
            }
        });
    });
}

function renderResumeTool() {
    return `
        <div class="career-tool-editor">
            <button class="back-btn" type="button" onclick="closeCareerTool()">&larr; Back to Career Dashboard</button>
            <h3>Resume Builder + Checker</h3>
            <p>Fill your profile details and generate optimized summary points. You can also upload your resume and check score.</p>
            <div class="career-form-grid">
                <label>Upload Resume (.pdf, .docx, .txt, .md)
                    <input id="resume-upload-file" type="file" accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain">
                </label>
            </div>
            <div class="career-form-grid">
                <label>Target Role
                    <input id="resume-target-role" type="text" placeholder="Frontend Developer">
                </label>
                <label>Top Skills (comma separated)
                    <input id="resume-skills" type="text" placeholder="React, JavaScript, REST APIs">
                </label>
                <label>Project Highlight
                    <textarea id="resume-project" rows="3" placeholder="Built a placement prep portal used by 300+ students."></textarea>
                </label>
                <label>Experience/Internship
                    <textarea id="resume-experience" rows="3" placeholder="Interned at XYZ and improved page speed by 42%."></textarea>
                </label>
            </div>
            <div class="career-tool-actions">
                <button type="button" onclick="generateResumeDraft()">Generate Resume Draft</button>
                <button type="button" class="secondary" onclick="checkResumeQuality()">Check Resume Score</button>
                <button type="button" class="secondary" onclick="uploadResumeAndScore()">Upload & Score Resume</button>
            </div>
            <div id="career-tool-output" class="career-tool-output"></div>
        </div>
    `;
}

function renderCoverLetterTool() {
    return `
        <div class="career-tool-editor">
            <button class="back-btn" type="button" onclick="closeCareerTool()">&larr; Back to Career Dashboard</button>
            <h3>Cover Letter Generator</h3>
            <p>Provide role and achievements to generate a personalized cover letter draft.</p>
            <div class="career-form-grid">
                <label>Company Name
                    <input id="cover-company" type="text" placeholder="Infosys">
                </label>
                <label>Role Name
                    <input id="cover-role" type="text" placeholder="Graduate Engineer Trainee">
                </label>
                <label>Key Achievements
                    <textarea id="cover-achievements" rows="3" placeholder="Won smart India hackathon finalist spot and delivered 3 client-ready prototypes."></textarea>
                </label>
                <label>Tone
                    <select id="cover-tone">
                        <option value="professional">Professional</option>
                        <option value="confident">Confident</option>
                        <option value="warm">Warm</option>
                    </select>
                </label>
            </div>
            <div class="career-tool-actions">
                <button type="button" onclick="generateCoverLetter()">Generate Cover Letter</button>
            </div>
            <div id="career-tool-output" class="career-tool-output"></div>
        </div>
    `;
}

function renderAutoApplyTool() {
    return `
        <div class="career-tool-editor">
            <button class="back-btn" type="button" onclick="closeCareerTool()">&larr; Back to Career Dashboard</button>
            <h3>Auto Job Apply</h3>
            <p>Set your daily outreach settings and update applied count to keep momentum.</p>
            <div class="career-form-grid">
                <label>Daily Apply Target
                    <input id="auto-apply-target" type="number" min="1" value="5">
                </label>
                <label>Preferred Job Keywords
                    <input id="auto-apply-keywords" type="text" placeholder="Java, SQL, Freshers">
                </label>
                <label>Preferred Locations
                    <input id="auto-apply-locations" type="text" placeholder="Bangalore, Pune, Hyderabad">
                </label>
                <label>Portal Sources
                    <select id="auto-apply-source">
                        <option value="naukri-linkedin">Naukri + LinkedIn</option>
                        <option value="career-pages">Company Career Pages</option>
                        <option value="all">All Sources</option>
                    </select>
                </label>
            </div>
            <div class="career-tool-actions">
                <button type="button" onclick="runAutoApplySimulation()">Run Auto Apply</button>
                <button type="button" class="secondary" onclick="markApplicationSent()">+1 Application Sent</button>
            </div>
            <div id="career-tool-output" class="career-tool-output"></div>
        </div>
    `;
}

function openCareerTool(toolKey) {
    careerToolState.activeTool = toolKey;
    saveCareerState();

    const listDiv = document.getElementById('coding-list');
    if (!listDiv) {
        return;
    }

    listDiv.style.display = 'block';
    if (toolKey === 'resume') {
        listDiv.innerHTML = renderResumeTool();
        return;
    }
    if (toolKey === 'cover-letter') {
        listDiv.innerHTML = renderCoverLetterTool();
        return;
    }
    listDiv.innerHTML = renderAutoApplyTool();
}

function closeCareerTool() {
    careerToolState.activeTool = null;
    saveCareerState();
    renderCareerToolsHome();
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
    const skills = document.getElementById('resume-skills')?.value.trim();
    const project = document.getElementById('resume-project')?.value.trim();
    const experience = document.getElementById('resume-experience')?.value.trim();
    const hasTypedInputs = Boolean(role || skills || project || experience);

    // If user selected a resume file but did not fill form fields,
    // score the uploaded file directly instead of returning 0%.
    if (!hasTypedInputs && uploadedFile) {
        uploadResumeAndScore();
        return;
    }

    const checklist = [
        { label: 'Target role specified', ok: Boolean(role) },
        { label: 'Skill keywords added', ok: Boolean(skills && skills.split(',').length >= 2) },
        { label: 'Project outcome added', ok: Boolean(project && project.length >= 30) },
        { label: 'Experience impact explained', ok: Boolean(experience && experience.length >= 30) }
    ];
    const passed = checklist.filter(item => item.ok).length;
    careerToolState.resumeScore = Math.round((passed / checklist.length) * 100);
    completeCareerTask();
    saveCareerState();

    setCareerOutput(`
        <h4>Resume Checker</h4>
        <ul>
            ${checklist.map(item => `<li>${item.ok ? '&#10004;' : '&#10006;'} ${item.label}</li>`).join('')}
        </ul>
        <p class="career-score-line">Resume quality score: <strong>${careerToolState.resumeScore}%</strong></p>
    `);
}

async function uploadResumeAndScore() {
    const fileInput = document.getElementById('resume-upload-file');
    const resumeFile = fileInput?.files?.[0];

    if (!resumeFile) {
        setCareerOutput('<p>Please choose a resume file first.</p>');
        return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    setCareerOutput('<p>Scoring uploaded resume...</p>');

    try {
        const response = await fetch(`${API_BASE}/career/resume/score`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Unable to score resume right now.');
        }

        careerToolState.resumeScore = result.score || 0;
        completeCareerTask();
        saveCareerState();

        setCareerOutput(`
            <h4>Uploaded Resume Score</h4>
            <p>File: <strong>${escapeHtml(resumeFile.name)}</strong></p>
            <p>Word count: <strong>${result.word_count || 0}</strong></p>
            <ul>
                ${(result.checklist || []).map(item => `<li>${item.ok ? '&#10004;' : '&#10006;'} ${escapeHtml(item.label)}</li>`).join('')}
            </ul>
            <p class="career-score-line">Resume quality score: <strong>${careerToolState.resumeScore}%</strong></p>
            <h4>Suggestions</h4>
            <ul>
                ${(result.suggestions || []).map(tip => `<li>${escapeHtml(tip)}</li>`).join('')}
            </ul>
        `);
    } catch (error) {
        setCareerOutput(`<p class="error">Error scoring uploaded resume: ${escapeHtml(error.message)}</p>`);
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
                <button class="back-btn" type="button" onclick="loadCodingLanguages()">← Back to Languages</button>
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
                <button class="back-btn" type="button" onclick="showCodingLanguageTopics('${languageKey}')">← Back to ${payload.language.name} Topics</button>
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
        <button onclick="hideCodingDetail()">← Back to List</button>
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
                    <h4>✅ All Tests Passed!</h4>
                    <p>${result.message}</p>
                </div>
            `;
        } else {
            resultsDiv.innerHTML = `
                <div class="test-failure">
                    <h4>❌ Some Tests Failed</h4>
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
                    <h4>🎉 Congratulations!</h4>
                    <p>${result.message}</p>
                </div>
            `;
        } else {
            resultsDiv.innerHTML = `
                <div class="test-failure">
                    <h4>❌ Submission Failed</h4>
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
