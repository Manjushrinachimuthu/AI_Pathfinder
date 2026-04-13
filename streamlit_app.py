import streamlit as st
import random

st.set_page_config(page_title="AI Pathfinder", page_icon="🎯", layout="wide")

ROLE_DATA = {
    "frontend_developer": {
        "title": "Frontend Developer",
        "skills": [
            "HTML5 Semantics",
            "CSS3 Layouts (Flexbox/Grid)",
            "JavaScript ES6+",
            "React Fundamentals",
            "State Management",
        ],
    },
    "backend_developer": {
        "title": "Backend Developer",
        "skills": [
            "REST API Design",
            "Authentication",
            "SQL and NoSQL",
            "Python/Node.js",
            "Cloud Deployment",
        ],
    },
    "full_stack_developer": {
        "title": "Full Stack Developer",
        "skills": ["React", "Node.js", "Database Modeling", "Auth Flows", "Deployment"],
    },
    "data_analyst": {
        "title": "Data Analyst",
        "skills": [
            "Excel Advanced",
            "SQL Queries",
            "Python/Pandas",
            "Data Visualization",
            "Dashboard Design",
        ],
    },
    "data_scientist": {
        "title": "Data Scientist",
        "skills": [
            "Probability",
            "Machine Learning",
            "Python",
            "Model Evaluation",
            "Data Storytelling",
        ],
    },
    "ml_engineer": {
        "title": "ML Engineer",
        "skills": [
            "ML Algorithms",
            "Feature Stores",
            "CI/CD for ML",
            "Model Serving",
            "Cloud GPU",
        ],
    },
    "devops_engineer": {
        "title": "DevOps Engineer",
        "skills": ["Linux", "Docker", "Kubernetes", "CI/CD", "Monitoring"],
    },
    "cloud_engineer": {
        "title": "Cloud Engineer",
        "skills": [
            "AWS/Azure/GCP",
            "IAM",
            "Networking",
            "Terraform",
            "High Availability",
        ],
    },
    "cybersecurity_analyst": {
        "title": "Cybersecurity Analyst",
        "skills": [
            "Network Security",
            "SIEM Tools",
            "Log Analysis",
            "Incident Response",
            "Risk Assessment",
        ],
    },
    "qa_automation_engineer": {
        "title": "QA Automation Engineer",
        "skills": [
            "Test Case Design",
            "Selenium",
            "API Automation",
            "Jenkins",
            "Performance Testing",
        ],
    },
    "mobile_developer": {
        "title": "Mobile App Developer",
        "skills": [
            "Android/iOS",
            "UI Components",
            "REST API",
            "Local Storage",
            "Push Notifications",
        ],
    },
    "uiux_designer": {
        "title": "UI/UX Designer",
        "skills": [
            "User Research",
            "Wireframing",
            "Figma",
            "Prototyping",
            "Usability Testing",
        ],
    },
}

COMPANY_DATA = [
    {
        "name": "TCS",
        "key": "tcs",
        "color": "#0089d6",
        "level": "Beginner",
        "track": "IT Services",
    },
    {
        "name": "Infosys",
        "key": "infosys",
        "color": "#007cc3",
        "level": "Intermediate",
        "track": "IT Services",
    },
    {
        "name": "Wipro",
        "key": "wipro",
        "color": "#303890",
        "level": "Beginner",
        "track": "IT Services",
    },
    {
        "name": "Accenture",
        "key": "accenture",
        "color": "#a100ff",
        "level": "Intermediate",
        "track": "Consulting",
    },
    {
        "name": "Cognizant",
        "key": "cognizant",
        "color": "#00b0f0",
        "level": "Beginner",
        "track": "IT Services",
    },
    {
        "name": "HCL",
        "key": "hcl",
        "color": "#ff4d4d",
        "level": "Beginner",
        "track": "IT Services",
    },
    {
        "name": "Amazon",
        "key": "amazon",
        "color": "#ff9900",
        "level": "Advanced",
        "track": "E-Commerce",
    },
    {
        "name": "Google",
        "key": "google",
        "color": "#4285f4",
        "level": "Advanced",
        "track": "Tech",
    },
    {
        "name": "Microsoft",
        "key": "microsoft",
        "color": "#00a4ef",
        "level": "Advanced",
        "track": "Tech",
    },
]

APTITUDE_TOPICS = {
    "quantitative": [
        "Percentages",
        "Profit & Loss",
        "Ratio & Proportion",
        "Time & Work",
        "Simple & Compound Interest",
        "Averages",
        "Number System",
    ],
    "logical": [
        "Coding Decoding",
        "Blood Relations",
        "Syllogism",
        "Direction Sense",
        "Seating Arrangement",
        "Puzzles",
        "Pattern Recognition",
    ],
    "verbal": [
        "Synonyms Antonyms",
        "Para Jumbles",
        "Sentence Correction",
        "Reading Comprehension",
        "Error Detection",
        "Vocabulary",
    ],
}

APTITUDE_QUESTIONS = {
    "quantitative": [
        {
            "question": "If a train travels 360 km in 4 hours, what is its speed?",
            "options": ["80 km/h", "90 km/h", "100 km/h", "110 km/h"],
            "answer": "90 km/h",
        },
        {
            "question": "What is 15% of 200?",
            "options": ["25", "30", "35", "40"],
            "answer": "30",
        },
        {
            "question": "If cost price is $100 and selling price is $120, profit percentage?",
            "options": ["15%", "20%", "25%", "30%"],
            "answer": "20%",
        },
        {
            "question": "A can do work in 10 days, B in 15 days. Together in?",
            "options": ["5 days", "6 days", "7 days", "8 days"],
            "answer": "6 days",
        },
        {
            "question": "Compound interest on $1000 at 10% for 2 years?",
            "options": ["$200", "$210", "$220", "$230"],
            "answer": "$210",
        },
    ],
    "logical": [
        {
            "question": "Find odd one: Apple, Banana, Carrot, Mango",
            "options": ["Apple", "Banana", "Carrot", "Mango"],
            "answer": "Carrot",
        },
        {
            "question": "Complete: 2, 6, 12, 20, ?",
            "options": ["28", "30", "32", "34"],
            "answer": "30",
        },
        {
            "question": "If A is brother of B, B sister of C, C father of D. A is D's?",
            "options": ["Uncle", "Father", "Grandfather", "Brother"],
            "answer": "Uncle",
        },
        {
            "question": "APPLE coded as ETTPI, MANGO coded as?",
            "options": ["QERKS", "QERKT", "QDRKS", "QFRKS"],
            "answer": "QERKS",
        },
        {
            "question": "Person walks 10m N, 10m E, 10m S. Direction from start?",
            "options": ["North", "East", "West", "South"],
            "answer": "East",
        },
    ],
    "verbal": [
        {
            "question": "Synonym of 'Abundant'",
            "options": ["Scarce", "Plentiful", "Limited", "Rare"],
            "answer": "Plentiful",
        },
        {
            "question": "Antonym of 'Benevolent'",
            "options": ["Kind", "Malevolent", "Generous", "Charitable"],
            "answer": "Malevolent",
        },
        {
            "question": "Book:Reading as Fork:?",
            "options": ["Drawing", "Writing", "Eating", "Cooking"],
            "answer": "Eating",
        },
        {
            "question": "Figure of speech: 'The wind whispered'",
            "options": ["Simile", "Metaphor", "Personification", "Hyperbole"],
            "answer": "Personification",
        },
        {
            "question": "Correct spelling?",
            "options": ["Accomodate", "Accommodate", "Acommodate", "Acomodate"],
            "answer": "Accommodate",
        },
    ],
}

CODING_QUESTIONS = [
    {
        "title": "Two Sum",
        "difficulty": "Easy",
        "description": "Find two numbers that add up to target",
        "test_case": "nums = [2,7,11,15], target = 9",
    },
    {
        "title": "Reverse String",
        "difficulty": "Easy",
        "description": "Reverse the string",
        "test_case": "s = ['h','e','l','l','o']",
    },
    {
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "description": "Check if brackets are valid",
        "test_case": "s = '()[]{}'",
    },
    {
        "title": "Maximum Subarray",
        "difficulty": "Medium",
        "description": "Find largest sum subarray",
        "test_case": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
    },
    {
        "title": "Merge Sorted Lists",
        "difficulty": "Easy",
        "description": "Merge two sorted linked lists",
        "test_case": "l1 = [1,2,4], l2 = [1,3,4]",
    },
]

if "test_state" not in st.session_state:
    st.session_state.test_state = {
        "in_test": False,
        "questions": [],
        "current_index": 0,
        "answers": {},
        "score": 0,
        "test_type": None,
        "company": None,
    }


def show_home():
    st.title("🎯 AI Pathfinder")
    st.markdown("### Your Career Preparation Platform")

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.info("📚 **Learning Hub**\n\nExplore career paths and skill requirements")
    with col2:
        st.info("🏢 **MNC Mock Tests**\n\nPractice company-specific tests")
    with col3:
        st.info("🤖 **AI Mock Interview**\n\nPrepare for technical interviews")
    with col4:
        st.info("💼 **Career Tools**\n\nResume builder and job tracking")


def show_learning_hub():
    st.title("📚 Learning Hub")
    st.markdown("Explore different career paths and their required skills")

    selected_role = st.selectbox(
        "Select a Career Role",
        list(ROLE_DATA.keys()),
        format_func=lambda x: ROLE_DATA[x]["title"],
    )

    if selected_role:
        role = ROLE_DATA[selected_role]
        st.subheader(role["title"])

        col1, col2 = st.columns([1, 2])
        with col1:
            st.markdown("### Required Skills")
            for i, skill in enumerate(role["skills"], 1):
                st.write(f"{i}. {skill}")

        with col2:
            st.markdown("### Learning Resources")
            st.success("📖 Recommended: Study {role['title']} concepts thoroughly")


def show_mnc_tests():
    st.title("🏢 MNC Mock Tests")
    st.markdown("Select a company to practice their specific test pattern")

    cols = st.columns(3)
    for i, company in enumerate(COMPANY_DATA):
        with cols[i % 3]:
            with st.container():
                st.markdown(
                    f"""
                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 10px; margin: 10px 0; border-left: 5px solid {company["color"]}">
                    <h4>{company["name"]}</h4>
                    <p>{company["track"]} • {company["level"]}</p>
                </div>
                """,
                    unsafe_allow_html=True,
                )
            if st.button(f"Start {company['name']} Test", key=company["key"]):
                start_aptitude_test(company["name"])


def start_aptitude_test(company_name):
    all_questions = []
    for category, questions in APTITUDE_QUESTIONS.items():
        for q in questions:
            all_questions.append({**q, "category": category})

    random.shuffle(all_questions)
    st.session_state.test_state = {
        "in_test": True,
        "questions": all_questions[:10],
        "current_index": 0,
        "answers": {},
        "score": 0,
        "test_type": "aptitude",
        "company": company_name,
    }
    st.rerun()


def show_test():
    state = st.session_state.test_state

    if state["current_index"] >= len(state["questions"]):
        show_results()
        return

    question = state["questions"][state["current_index"]]
    progress = (state["current_index"] / len(state["questions"])) * 100

    st.progress(progress / 100)
    st.write(f"Question {state['current_index'] + 1} of {len(state['questions'])}")
    st.markdown(f"**Category:** {question['category'].title()}")
    st.markdown(f"### {question['question']}")

    selected = st.radio(
        "Select your answer:", question["options"], key=f"q_{state['current_index']}"
    )

    col1, col2 = st.columns(2)
    with col1:
        if st.button("Previous", disabled=state["current_index"] == 0):
            state["current_index"] -= 1
            st.rerun()
    with col2:
        if st.button("Submit Answer"):
            state["answers"][state["current_index"]] = selected
            if selected == question["answer"]:
                state["score"] += 1
            state["current_index"] += 1
            st.rerun()


def show_results():
    state = st.session_state.test_state
    score = state["score"]
    total = len(state["questions"])
    percentage = (score / total) * 100

    st.title("🎉 Test Complete!")
    st.markdown(f"### Your Score: {score} / {total} ({percentage:.0f}%)")

    if percentage >= 80:
        st.success("Excellent! You are well prepared!")
    elif percentage >= 60:
        st.info("Good job! Keep practicing!")
    else:
        st.warning("Keep learning! Try again!")

    if st.button("Back to Home"):
        st.session_state.test_state = {"in_test": False}
        st.rerun()


def show_interview():
    st.title("🤖 AI Mock Interview")
    st.markdown("Prepare for technical and HR interviews with AI-generated questions")

    category = st.selectbox("Select Interview Type", ["Technical", "HR", "Behavioral"])
    questions_count = st.slider("Number of Questions", 3, 10, 5)

    if st.button("Start Interview"):
        st.info(
            "AI Interview feature coming soon! This will generate personalized interview questions."
        )


def show_career_tools():
    st.title("💼 Career Tools")
    st.markdown("Tools to help you in your job search journey")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown("### 📄 Resume Builder")
        st.info("Create ATS-friendly resumes")
        if st.button("Open Resume Tool"):
            st.info("Resume builder coming soon!")

    with col2:
        st.markdown("### ✉️ Cover Letter")
        st.info("Generate cover letters")
        if st.button("Generate Cover Letter"):
            st.info("Cover letter generator coming soon!")

    with col3:
        st.markdown("### 📋 Job Tracker")
        st.info("Track your applications")
        if st.button("Open Job Tracker"):
            st.info("Job tracker coming soon!")


def main():
    if st.session_state.test_state["in_test"]:
        show_test()
    else:
        menu = st.sidebar.radio(
            "Navigate",
            [
                "Home",
                "Learning Hub",
                "MNC Mock Tests",
                "AI Mock Interview",
                "Career Tools",
            ],
        )

        if menu == "Home":
            show_home()
        elif menu == "Learning Hub":
            show_learning_hub()
        elif menu == "MNC Mock Tests":
            show_mnc_tests()
        elif menu == "AI Mock Interview":
            show_interview()
        elif menu == "Career Tools":
            show_career_tools()


if __name__ == "__main__":
    main()
