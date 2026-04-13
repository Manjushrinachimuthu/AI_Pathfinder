LEVELS = ("easy", "medium", "hard")


def _mcq(qid, question, options, answer, explanation):
    return {
        "id": qid,
        "question": question,
        "options": options,
        "answer": answer,
        "explanation": explanation,
    }


TOPIC_ORDER = [
    "basic_syntax",
    "loops",
    "conditional_statements",
    "functions",
    "arrays",
    "strings",
    "recursion",
    "sorting",
    "searching",
    "data_structures",
]


LANGUAGE_CONFIG = {
    "c": {
        "name": "C",
        "headline": "Build strong logic with structured syntax and a solid foundation for placement coding rounds.",
        "variable_syntax": "int total = 10;",
        "function_syntax": "int add(int a, int b) {\n    return a + b;\n}",
        "array_syntax": "int arr[5] = {1, 2, 3, 4, 5};",
        "string_syntax": 'char name[] = "code";',
        "recursion_syntax": "int fact(int n) {\n    if (n <= 1) return 1;\n    return n * fact(n - 1);\n}",
        "loop_syntax": "for (int i = 0; i < n; i++) {\n    printf(\"%d \", i);\n}",
        "condition_syntax": "if (marks >= 50) {\n    printf(\"Pass\");\n} else {\n    printf(\"Fail\");\n}",
        "sort_syntax": "for (int i = 0; i < n - 1; i++) {\n    for (int j = 0; j < n - i - 1; j++) {\n        if (arr[j] > arr[j + 1]) {\n            int temp = arr[j];\n            arr[j] = arr[j + 1];\n            arr[j + 1] = temp;\n        }\n    }\n}",
        "search_syntax": "for (int i = 0; i < n; i++) {\n    if (arr[i] == key) {\n        return i;\n    }\n}",
        "ds_syntax": "struct Node {\n    int data;\n    struct Node* next;\n};",
    },
    "cpp": {
        "name": "C++",
        "headline": "Use fast problem solving with STL support, strong fundamentals, and interview-friendly syntax.",
        "variable_syntax": "int total = 10;",
        "function_syntax": "int add(int a, int b) {\n    return a + b;\n}",
        "array_syntax": "vector<int> arr = {1, 2, 3, 4, 5};",
        "string_syntax": 'string name = "code";',
        "recursion_syntax": "int fact(int n) {\n    if (n <= 1) return 1;\n    return n * fact(n - 1);\n}",
        "loop_syntax": "for (int i = 0; i < n; i++) {\n    cout << i << \" \";\n}",
        "condition_syntax": "if (marks >= 50) {\n    cout << \"Pass\";\n} else {\n    cout << \"Fail\";\n}",
        "sort_syntax": "sort(arr.begin(), arr.end());",
        "search_syntax": "for (int i = 0; i < arr.size(); i++) {\n    if (arr[i] == key) {\n        return i;\n    }\n}",
        "ds_syntax": "stack<int> st;\nqueue<int> q;\nmap<int, int> freq;",
    },
    "java": {
        "name": "Java",
        "headline": "Prepare with class-based coding, clear syntax rules, and a strong base in OOP-friendly problem solving.",
        "variable_syntax": "int total = 10;",
        "function_syntax": "static int add(int a, int b) {\n    return a + b;\n}",
        "array_syntax": "int[] arr = {1, 2, 3, 4, 5};",
        "string_syntax": 'String name = "code";',
        "recursion_syntax": "static int fact(int n) {\n    if (n <= 1) return 1;\n    return n * fact(n - 1);\n}",
        "loop_syntax": "for (int i = 0; i < n; i++) {\n    System.out.print(i + \" \");\n}",
        "condition_syntax": "if (marks >= 50) {\n    System.out.println(\"Pass\");\n} else {\n    System.out.println(\"Fail\");\n}",
        "sort_syntax": "Arrays.sort(arr);",
        "search_syntax": "for (int i = 0; i < arr.length; i++) {\n    if (arr[i] == key) {\n        return i;\n    }\n}",
        "ds_syntax": "Stack<Integer> st = new Stack<>();\nQueue<Integer> q = new LinkedList<>();\nHashMap<Integer, Integer> map = new HashMap<>();",
    },
    "python": {
        "name": "Python",
        "headline": "Learn quick problem solving with readable syntax, simple logic building, and strong list and string support.",
        "variable_syntax": "total = 10",
        "function_syntax": "def add(a, b):\n    return a + b",
        "array_syntax": "arr = [1, 2, 3, 4, 5]",
        "string_syntax": 'name = "code"',
        "recursion_syntax": "def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)",
        "loop_syntax": "for i in range(n):\n    print(i, end=' ')",
        "condition_syntax": "if marks >= 50:\n    print(\"Pass\")\nelse:\n    print(\"Fail\")",
        "sort_syntax": "arr.sort()",
        "search_syntax": "for index, value in enumerate(arr):\n    if value == key:\n        return index",
        "ds_syntax": "stack = []\nqueue = deque()\ncount = {}",
    },
    "javascript": {
        "name": "JavaScript",
        "headline": "Practice modern programming with flexible syntax, useful array helpers, and browser or Node.js relevance.",
        "variable_syntax": "let total = 10;",
        "function_syntax": "function add(a, b) {\n    return a + b;\n}",
        "array_syntax": "const arr = [1, 2, 3, 4, 5];",
        "string_syntax": 'const name = "code";',
        "recursion_syntax": "function fact(n) {\n    if (n <= 1) return 1;\n    return n * fact(n - 1);\n}",
        "loop_syntax": "for (let i = 0; i < n; i++) {\n    console.log(i);\n}",
        "condition_syntax": "if (marks >= 50) {\n    console.log(\"Pass\");\n} else {\n    console.log(\"Fail\");\n}",
        "sort_syntax": "arr.sort((a, b) => a - b);",
        "search_syntax": "for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === key) {\n        return i;\n    }\n}",
        "ds_syntax": "const stack = [];\nconst queue = [];\nconst map = new Map();",
    },
}


TOPIC_TEMPLATES = {
    "basic_syntax": {
        "title": "Basic Syntax",
        "overview": "Learn the base rules of the language: variables, input/output, statements, and program structure.",
        "subtopics": ["Program structure", "Variables and data types", "Input and output", "Operators", "Comments"],
        "syntax_points": [
            "Start with the correct program structure for the language.",
            "Create variables to store values before processing them.",
            "Use the language-specific input and output statements correctly.",
            "Follow syntax rules like indentation, braces, or semicolons depending on the language.",
        ],
        "example_question": "Write a program to read a number and print its square.",
        "example_builder": lambda cfg: cfg["variable_syntax"],
    },
    "loops": {
        "title": "Loops",
        "overview": "Use loops to repeat work efficiently instead of writing the same logic multiple times.",
        "subtopics": ["for loop", "while loop", "Nested loops", "break", "continue"],
        "syntax_points": [
            "Use a for loop when the number of repetitions is known.",
            "Use a while loop when repetition depends on a condition.",
            "Nested loops help with patterns, matrices, and pair comparisons.",
            "Use break to stop a loop early and continue to skip one iteration.",
        ],
        "example_question": "Print numbers from 1 to N and also count how many of them are even.",
        "example_builder": lambda cfg: cfg["loop_syntax"],
    },
    "conditional_statements": {
        "title": "Conditional Statements",
        "overview": "Use conditions to make decisions based on values, comparisons, and logical checks.",
        "subtopics": ["if", "if else", "else if ladder", "switch/case", "Logical operators"],
        "syntax_points": [
            "Use if when you need one condition check.",
            "Use if else when there are two possible paths.",
            "Use else if for multiple conditions.",
            "Use logical operators to combine conditions cleanly.",
        ],
        "example_question": "Check whether a number is positive, negative, or zero.",
        "example_builder": lambda cfg: cfg["condition_syntax"],
    },
    "functions": {
        "title": "Functions",
        "overview": "Break logic into reusable blocks so programs stay clean, modular, and easier to test.",
        "subtopics": ["Function definition", "Parameters", "Return values", "Void functions", "Scope"],
        "syntax_points": [
            "Functions let you reuse the same logic many times.",
            "Parameters pass input into the function.",
            "Return values send processed output back to the caller.",
            "Keep functions focused on one job for better readability.",
        ],
        "example_question": "Create a function that returns the larger of two numbers.",
        "example_builder": lambda cfg: cfg["function_syntax"],
    },
    "arrays": {
        "title": "Arrays",
        "overview": "Store multiple similar values together and process them with loops and indexing.",
        "subtopics": ["Declaration", "Indexing", "Traversal", "Updating values", "2D arrays"],
        "syntax_points": [
            "Arrays or lists store related data in one place.",
            "Each element is accessed by its index.",
            "Traversal usually happens with loops.",
            "2D arrays are useful for matrix-style problems.",
        ],
        "example_question": "Find the sum and maximum value of an array.",
        "example_builder": lambda cfg: cfg["array_syntax"],
    },
    "strings": {
        "title": "Strings",
        "overview": "Work with words and text using indexing, traversal, searching, and transformation operations.",
        "subtopics": ["Declaration", "Length", "Traversal", "Concatenation", "Substring"],
        "syntax_points": [
            "Strings store text data.",
            "Many coding problems involve counting, reversing, or comparing characters.",
            "String indexing is important for pattern and palindrome problems.",
            "Learn the built-in helpers for length, slicing, or substring handling.",
        ],
        "example_question": "Check whether a given string is a palindrome.",
        "example_builder": lambda cfg: cfg["string_syntax"],
    },
    "recursion": {
        "title": "Recursion",
        "overview": "Solve problems by making a function call itself with a smaller input until a base case is reached.",
        "subtopics": ["Base case", "Recursive case", "Call stack", "Factorial", "Fibonacci"],
        "syntax_points": [
            "Every recursive solution must have a base case.",
            "The recursive case should move closer to the base case.",
            "Recursion is useful for divide-and-conquer, trees, and backtracking.",
            "Visualize the call stack to debug recursive logic.",
        ],
        "example_question": "Find the factorial of a number using recursion.",
        "example_builder": lambda cfg: cfg["recursion_syntax"],
    },
    "sorting": {
        "title": "Sorting (Bubble, Selection, Insertion)",
        "overview": "Arrange values in increasing or decreasing order using common beginner sorting techniques.",
        "subtopics": ["Bubble sort", "Selection sort", "Insertion sort", "Swapping", "Time complexity basics"],
        "syntax_points": [
            "Bubble sort repeatedly swaps adjacent elements if they are in the wrong order.",
            "Selection sort places the correct value at each position step by step.",
            "Insertion sort builds a sorted portion from left to right.",
            "Sorting helps with searching, ranking, and duplicate handling problems.",
        ],
        "example_question": "Sort an integer array in ascending order using bubble sort.",
        "example_builder": lambda cfg: cfg["sort_syntax"],
    },
    "searching": {
        "title": "Searching (Linear, Binary)",
        "overview": "Find values efficiently using simple scanning or divide-and-conquer search strategies.",
        "subtopics": ["Linear search", "Binary search", "Sorted array requirement", "Search result index", "Search complexity"],
        "syntax_points": [
            "Linear search checks elements one by one.",
            "Binary search works only on sorted data.",
            "Binary search cuts the search space in half each step.",
            "Always handle the 'not found' case clearly.",
        ],
        "example_question": "Find the index of a target value using linear search and explain when binary search is better.",
        "example_builder": lambda cfg: cfg["search_syntax"],
    },
    "data_structures": {
        "title": "Basic Data Structures",
        "overview": "Understand the most-used structures that help store and process data efficiently in coding interviews.",
        "subtopics": ["Stack", "Queue", "Linked List", "Hash Map", "Tree basics"],
        "syntax_points": [
            "Choose data structures based on the operations you need most.",
            "Stacks follow LIFO and queues follow FIFO.",
            "Maps or dictionaries help with counting and fast lookup.",
            "Linked structures and trees are common next-step interview topics.",
        ],
        "example_question": "Use a stack to reverse a sequence or explain how a queue processes elements in order.",
        "example_builder": lambda cfg: cfg["ds_syntax"],
    },
}


PRACTICE_BANK = {
    "basic_syntax": {
        "easy": [
            _mcq(1, "What is the purpose of a variable in programming?", ["To store data", "To sort data automatically", "To print output only", "To stop a loop"], "To store data", "Variables are used to hold values for later use."),
            _mcq(2, "Why do syntax rules matter in a program?", ["They help the compiler or interpreter understand the code", "They increase internet speed", "They remove all bugs", "They replace logic"], "They help the compiler or interpreter understand the code", "A program must follow syntax rules to run correctly."),
            _mcq(3, "What is a data type used for?", ["To define what kind of value a variable can hold", "To repeat a block of code", "To search an array", "To sort strings"], "To define what kind of value a variable can hold", "Data types describe the nature of stored data."),
            _mcq(4, "What is the role of comments in code?", ["To explain code for humans", "To execute faster", "To replace variables", "To create arrays"], "To explain code for humans", "Comments improve readability and are ignored during execution."),
            _mcq(5, "What does input mean in programming?", ["Receiving data into the program", "Printing a result", "Deleting a file", "Stopping a condition"], "Receiving data into the program", "Input brings external data into the program."),
            _mcq(6, "Which pair is most central to a first program?", ["Input and output", "Binary search and recursion", "Queue and stack", "Selection sort and tree"], "Input and output", "Most first programs focus on reading and displaying values."),
            _mcq(7, "What does assignment usually do?", ["Stores a value in a variable", "Prints a value", "Searches a value", "Sorts a value"], "Stores a value in a variable", "Assignment connects a variable name with a value."),
        ],
        "medium": [
            _mcq(1, "What is the benefit of meaningful variable names?", ["They improve readability", "They automatically sort data", "They increase RAM", "They avoid all errors"], "They improve readability", "Clear names make code easier to understand."),
            _mcq(2, "What happens if a statement breaks a syntax rule?", ["The program may fail to compile or run", "The program becomes recursive", "The output doubles", "The array becomes sorted"], "The program may fail to compile or run", "Syntax errors prevent proper execution."),
            _mcq(3, "Which action best helps build syntax confidence?", ["Writing small practice programs daily", "Memorizing only outputs", "Ignoring errors", "Skipping examples"], "Writing small practice programs daily", "Repeated small exercises build strong basics."),
            _mcq(4, "Why are operators part of basic syntax study?", ["They perform calculations and comparisons", "They create classes only", "They replace conditions", "They remove arrays"], "They perform calculations and comparisons", "Operators help programs manipulate values."),
            _mcq(5, "Why do beginners start with simple syntax programs?", ["To learn structure and avoid confusion", "To skip all logic building", "To avoid variables forever", "To remove loops from coding"], "To learn structure and avoid confusion", "Simple programs teach the foundation clearly."),
            _mcq(6, "What is the best use of a first syntax example?", ["To connect rules with a working program", "To memorize answers only", "To skip practice", "To avoid debugging"], "To connect rules with a working program", "A small example shows how syntax fits together."),
            _mcq(7, "What kind of value is written directly in source code?", ["Literal", "Loop", "Index", "Function"], "Literal", "A literal is a fixed value written in the code."),
        ],
        "hard": [
            _mcq(1, "Why is program structure important before problem solving?", ["It prevents avoidable syntax mistakes under time pressure", "It automatically solves logic questions", "It makes loops unnecessary", "It removes the need for testing"], "It prevents avoidable syntax mistakes under time pressure", "A clear structure reduces basic mistakes during practice."),
            _mcq(2, "Which statement best connects syntax and logic?", ["Correct syntax lets your logic be executed correctly", "Syntax replaces logic completely", "Logic is useful only after sorting", "Syntax matters only for strings"], "Correct syntax lets your logic be executed correctly", "Even good logic fails if the syntax is invalid."),
            _mcq(3, "Why should input and output forms be learned early?", ["They appear in almost every coding problem", "They are useful only in interviews", "They remove edge cases", "They replace conditions"], "They appear in almost every coding problem", "Most problems start with input and end with output."),
            _mcq(4, "What is the most practical first coding milestone?", ["Write a program that reads values, stores them, and prints a computed result", "Memorize all sorting algorithms", "Finish recursion before loops", "Avoid debugging"], "Write a program that reads values, stores them, and prints a computed result", "That combines the core syntax ideas in one small task."),
            _mcq(5, "Why are syntax habits important in placements?", ["They let you focus more on logic than on avoidable errors", "They eliminate all tricky questions", "They replace data structures", "They remove the need for dry runs"], "They let you focus more on logic than on avoidable errors", "Good syntax habits free attention for reasoning."),
            _mcq(6, "Which practice style improves syntax retention the most?", ["Repeated writing of small but complete programs", "Reading topic names only", "Skipping output formatting", "Ignoring mistakes"], "Repeated writing of small but complete programs", "Active practice improves retention better than passive reading."),
        ],
    },
    "loops": {
        "easy": [
            _mcq(1, "What is the main use of a loop?", ["To repeat a block of code", "To declare a string", "To define a class", "To create comments"], "To repeat a block of code", "Loops are used for repetition."),
            _mcq(2, "Which loop is often used when repetitions are known?", ["for loop", "comment loop", "array loop", "return loop"], "for loop", "A for loop fits counted repetition."),
            _mcq(3, "What does a while loop depend on?", ["A condition", "A class name", "A file name", "A data type"], "A condition", "A while loop runs while its condition is true."),
            _mcq(4, "What does break do in a loop?", ["Stops the loop immediately", "Restarts the loop", "Declares a variable", "Sorts an array"], "Stops the loop immediately", "break exits the current loop."),
            _mcq(5, "What does continue do?", ["Skips the current iteration", "Ends the function", "Searches a string", "Creates recursion"], "Skips the current iteration", "continue jumps to the next iteration."),
            _mcq(6, "Why are nested loops used?", ["To handle repeated work inside repeated work", "To remove arrays", "To replace conditions", "To define variables"], "To handle repeated work inside repeated work", "Nested loops are useful for patterns and matrix-style tasks."),
            _mcq(7, "Which problem commonly needs a loop?", ["Printing numbers from 1 to N", "Declaring one variable", "Writing one comment", "Naming a function"], "Printing numbers from 1 to N", "A loop is natural for repeated number output."),
        ],
        "medium": [
            _mcq(1, "What can happen if a while loop condition never changes?", ["Infinite loop", "Automatic sorting", "Compilation success with no output", "Array reversal"], "Infinite loop", "The loop may never end."),
            _mcq(2, "Why are loop boundaries important?", ["They control how many times the loop runs", "They define the data type", "They print comments", "They create functions"], "They control how many times the loop runs", "Incorrect boundaries often cause extra or missing iterations."),
            _mcq(3, "Which task often combines loops and conditions?", ["Counting even numbers in an array", "Declaring a variable", "Defining a comment", "Naming a class"], "Counting even numbers in an array", "You loop through items and test each one."),
            _mcq(4, "When are nested loops especially common?", ["Pattern printing and matrix traversal", "Single input reading only", "One-time assignment", "Simple comments"], "Pattern printing and matrix traversal", "Both cases usually need row-and-column style processing."),
            _mcq(5, "What is an off-by-one error?", ["A mistake in loop boundary handling", "A string concatenation bug", "A recursion base case", "A sorting technique"], "A mistake in loop boundary handling", "Off-by-one bugs happen when a loop runs one step too many or too few."),
            _mcq(6, "Why use continue carefully?", ["It can skip important logic if placed incorrectly", "It always ends the loop", "It creates arrays", "It defines strings"], "It can skip important logic if placed incorrectly", "continue changes the flow of a loop immediately."),
            _mcq(7, "What is a loop counter?", ["A variable that tracks iterations", "A sorted array", "A function name", "A map key"], "A variable that tracks iterations", "Counters help control and observe repetition."),
        ],
        "hard": [
            _mcq(1, "Which skill improves most by practicing loops?", ["Translating repeated logic into code", "Creating internet connections", "Changing language syntax", "Removing test cases"], "Translating repeated logic into code", "Loops are central to turning repeated patterns into programs."),
            _mcq(2, "Why should you dry-run loops while learning?", ["To check boundary conditions and state changes", "To avoid variables", "To replace output", "To remove recursion"], "To check boundary conditions and state changes", "Dry runs expose logic mistakes clearly."),
            _mcq(3, "When is while better than for?", ["When repetition depends on a changing condition instead of a fixed count", "When there is no condition", "When sorting is impossible", "When arrays are absent"], "When repetition depends on a changing condition instead of a fixed count", "while suits condition-driven repetition."),
            _mcq(4, "Why can nested loops become expensive?", ["They may increase the total number of operations significantly", "They delete input", "They break comments", "They force recursion"], "They may increase the total number of operations significantly", "Nested loops often raise time complexity."),
            _mcq(5, "What is the best reason to place break inside a condition?", ["To stop early when the goal is already reached", "To increase loop count", "To create a new array", "To change the data type"], "To stop early when the goal is already reached", "Early exit can save unnecessary work."),
            _mcq(6, "Which practice question best builds loop mastery?", ["Traverse data, count matches, and print results", "Write only comments", "Memorize keywords without coding", "Avoid testing inputs"], "Traverse data, count matches, and print results", "That pattern appears across many interview problems."),
        ],
    },
    "conditional_statements": {
        "easy": [
            _mcq(1, "What is the purpose of an if statement?", ["To make a decision", "To sort values", "To store text", "To create arrays"], "To make a decision", "if is used to run code conditionally."),
            _mcq(2, "What does else usually represent?", ["The fallback path", "A loop counter", "A search method", "A data structure"], "The fallback path", "else runs when previous conditions are false."),
            _mcq(3, "What does else if help with?", ["Checking multiple conditions", "Declaring arrays", "Creating recursion", "Printing comments"], "Checking multiple conditions", "else if is used for multi-way decisions."),
            _mcq(4, "Which operators are often used in conditions?", ["Comparison operators", "Sorting operators", "Comment operators", "Stack operators"], "Comparison operators", "Comparisons decide whether a condition is true or false."),
            _mcq(5, "Why are conditions useful?", ["They let programs react differently to different inputs", "They always sort arrays", "They remove loops", "They prevent output"], "They let programs react differently to different inputs", "Conditions control branching behavior."),
            _mcq(6, "Which question needs conditions?", ["Checking if a number is even or odd", "Declaring a variable", "Naming a string", "Creating a comment"], "Checking if a number is even or odd", "This task depends on checking a rule."),
            _mcq(7, "What is a boolean-style result of a condition?", ["True or false", "Array or string", "Loop or function", "Push or pop"], "True or false", "Conditions evaluate to truth values."),
        ],
        "medium": [
            _mcq(1, "Why does order matter in an else-if ladder?", ["Earlier true conditions may stop later checks", "It changes variable types", "It sorts results automatically", "It removes break"], "Earlier true conditions may stop later checks", "The first matching condition usually decides the path."),
            _mcq(2, "When is switch/case often useful?", ["When comparing one value against many fixed options", "When reversing arrays", "When writing recursion", "When reading files"], "When comparing one value against many fixed options", "switch is handy for many discrete cases."),
            _mcq(3, "Why combine conditions with logical operators?", ["To test multiple rules together", "To replace variables", "To avoid output", "To build arrays"], "To test multiple rules together", "AND/OR style logic combines checks."),
            _mcq(4, "Which task uses nested conditions naturally?", ["Checking grade ranges and pass/fail rules", "Printing one value only", "Declaring one string", "Adding comments"], "Checking grade ranges and pass/fail rules", "Layered decision logic often uses nested or chained conditions."),
            _mcq(5, "What is a common condition bug?", ["Using the wrong comparison or range", "Writing too many comments", "Declaring a variable", "Creating an array"], "Using the wrong comparison or range", "A small comparison mistake changes behavior completely."),
            _mcq(6, "Why test boundary values in conditional problems?", ["Because edge values often reveal logic mistakes", "Because loops stop working", "Because strings disappear", "Because sorting changes syntax"], "Because edge values often reveal logic mistakes", "Boundaries like 0, 1, or equal values matter a lot."),
            _mcq(7, "What is the output path called when a condition is true?", ["Selected branch", "Comment block", "Search tree", "Queue node"], "Selected branch", "A condition chooses one branch among alternatives."),
        ],
        "hard": [
            _mcq(1, "Why are conditions central to placements?", ["Most coding tasks involve making decisions based on input rules", "They remove the need for arrays", "They replace functions", "They eliminate edge cases"], "Most coding tasks involve making decisions based on input rules", "Decision logic appears in almost every beginner and intermediate problem."),
            _mcq(2, "What makes a conditional solution robust?", ["Correct ranges, clear ordering, and tested edge cases", "Only long variable names", "Avoiding all else blocks", "Using recursion everywhere"], "Correct ranges, clear ordering, and tested edge cases", "Reliable decision logic depends on all three."),
            _mcq(3, "Why can nested conditions hurt readability?", ["They make the control flow harder to follow", "They speed up sorting too much", "They delete variables", "They change syntax rules"], "They make the control flow harder to follow", "Deep nesting becomes difficult to reason about."),
            _mcq(4, "What is the best improvement for complex condition code?", ["Break logic into smaller checks or helper functions", "Remove all comparisons", "Replace every condition with loops", "Avoid testing"], "Break logic into smaller checks or helper functions", "Smaller parts improve clarity and debugging."),
            _mcq(5, "Which practice problem builds conditional reasoning well?", ["Classify input into multiple categories", "Only declare arrays", "Write comments repeatedly", "Memorize keywords"], "Classify input into multiple categories", "Classification tasks force careful branching."),
            _mcq(6, "Why should conditions be dry-run with sample values?", ["To confirm every branch behaves as expected", "To remove function parameters", "To avoid loops forever", "To create maps"], "To confirm every branch behaves as expected", "Sample tracing catches hidden logical errors."),
        ],
    },
}


for topic_key in ("functions", "arrays", "strings", "recursion", "sorting", "searching", "data_structures"):
    topic_title = TOPIC_TEMPLATES[topic_key]["title"]
    PRACTICE_BANK[topic_key] = {
        "easy": [
            _mcq(1, f"Why is {topic_title} important in programming?", ["It appears in many coding problems", "It removes all errors", "It replaces input", "It is only for styling"], "It appears in many coding problems", f"{topic_title} is a common problem-solving concept."),
            _mcq(2, "What is the best way to learn this topic?", ["Practice small problems and dry-run them", "Read only headings", "Ignore examples", "Skip outputs"], "Practice small problems and dry-run them", "Hands-on practice builds confidence."),
            _mcq(3, "Why should you understand the syntax first?", ["So you can apply the concept without avoidable errors", "So you never need logic", "So loops disappear", "So arrays sort automatically"], "So you can apply the concept without avoidable errors", "Syntax and concept go together."),
            _mcq(4, "What kind of questions usually improve understanding fastest?", ["Questions that use the concept directly on sample input", "Only theory questions", "Questions without output", "Questions without logic"], "Questions that use the concept directly on sample input", "Direct applied questions teach faster."),
            _mcq(5, "Why are example questions helpful?", ["They show how theory becomes code", "They remove practice", "They eliminate mistakes forever", "They replace testing"], "They show how theory becomes code", "Examples connect explanation with implementation."),
            _mcq(6, "What should you do after learning the syntax of a topic?", ["Practice multiple questions on that topic", "Stop practicing", "Skip edge cases", "Avoid dry runs"], "Practice multiple questions on that topic", "Practice is needed to make the topic usable."),
            _mcq(7, "Why do topic-based questions matter?", ["They help build focused problem-solving ability", "They remove all debugging", "They replace revision", "They avoid coding"], "They help build focused problem-solving ability", "Focused topic practice builds stronger basics."),
        ],
        "medium": [
            _mcq(1, "Why do placement questions mix this topic with loops and conditions?", ["Because real logic usually combines multiple basics together", "Because syntax alone is enough", "Because variables are not needed", "Because output is optional"], "Because real logic usually combines multiple basics together", "Interview-style logic often combines concepts."),
            _mcq(2, "What is the best indicator that you understand a topic?", ["You can solve a fresh problem on it without copying syntax blindly", "You can name the topic only", "You can avoid testing", "You can skip edge cases"], "You can solve a fresh problem on it without copying syntax blindly", "Real understanding means independent use."),
            _mcq(3, "Why should topic practice include easy, medium, and hard levels?", ["Because difficulty progression builds confidence and depth", "Because only hard questions matter", "Because easy questions waste time", "Because practice is optional"], "Because difficulty progression builds confidence and depth", "Layered practice creates steady growth."),
            _mcq(4, "Why are edge cases important when practicing this topic?", ["They reveal mistakes that normal inputs may hide", "They make code shorter", "They remove the need for examples", "They replace syntax"], "They reveal mistakes that normal inputs may hide", "Edge cases are where weak logic often fails."),
            _mcq(5, "What improves topic mastery most?", ["Writing, testing, and explaining the solution", "Reading only one example", "Skipping debugging", "Memorizing keywords alone"], "Writing, testing, and explaining the solution", "Coding plus explanation builds strong understanding."),
            _mcq(6, "When should you move to harder questions?", ["After you can solve the basic pattern comfortably", "Before learning syntax", "Before reading examples", "Without testing easy ones"], "After you can solve the basic pattern comfortably", "Foundations should be stable first."),
            _mcq(7, "Why does this topic remain important beyond one language?", ["Because the core problem-solving idea is shared across languages", "Because language syntax is identical", "Because all languages use the same library", "Because output never changes"], "Because the core problem-solving idea is shared across languages", "The concept transfers even when syntax changes."),
        ],
        "hard": [
            _mcq(1, "What is the strongest sign of real topic mastery?", ["You can explain the concept, code it, and adapt it to new questions", "You can memorize one example", "You can avoid debugging", "You can skip test cases"], "You can explain the concept, code it, and adapt it to new questions", "Mastery includes understanding, implementation, and flexibility."),
            _mcq(2, "Why are subtopics useful inside a main topic?", ["They break the concept into smaller learnable parts", "They remove the need for coding", "They avoid examples", "They replace syntax"], "They break the concept into smaller learnable parts", "Subtopics make learning more structured."),
            _mcq(3, "What is the best learning sequence for a topic?", ["Understand basics, study syntax, solve an example, then practice many questions", "Start with hard questions only", "Avoid examples and practice", "Memorize answers only"], "Understand basics, study syntax, solve an example, then practice many questions", "That sequence gives the strongest retention."),
            _mcq(4, "Why should a topic page include an example question?", ["It bridges explanation and actual coding use", "It removes the need for practice", "It is only decorative", "It replaces subtopics"], "It bridges explanation and actual coding use", "A worked example makes the concept concrete."),
            _mcq(5, "Why is repeated topic practice valuable for placements?", ["It improves speed, confidence, and pattern recognition", "It eliminates all difficult questions", "It removes logic errors forever", "It replaces revision"], "It improves speed, confidence, and pattern recognition", "Repeated exposure helps you recognize problem patterns faster."),
            _mcq(6, "What should you do if you get a topic question wrong?", ["Review the concept, dry-run the logic, and solve similar questions again", "Skip the topic permanently", "Avoid examples", "Memorize only the answer"], "Review the concept, dry-run the logic, and solve similar questions again", "Mistakes are best fixed with targeted practice."),
        ],
    }


def _build_subtopic_details(language_key, topic_key):
    cfg = LANGUAGE_CONFIG[language_key]

    if language_key == "c":
        c_topic_details = {
            "basic_syntax": [
                {
                    "title": "Program Structure",
                    "explanation": "A basic C program starts with header inclusion and execution begins from `main()`.",
                    "example": "#include <stdio.h>\n\nint main() {\n    printf(\"Hello World\");\n    return 0;\n}",
                },
                {
                    "title": "Variables and Data Types",
                    "explanation": "C variables must be declared with a type before they are used.",
                    "example": "int age = 20;\nfloat salary = 5000.50;\nchar grade = 'A';",
                },
                {
                    "title": "Constants",
                    "explanation": "Constants keep values fixed so they cannot be changed during the program.",
                    "example": "const float PI = 3.14;",
                },
                {
                    "title": "Input / Output",
                    "explanation": "Use `scanf` to read input and `printf` to display output.",
                    "example": "int num;\n\nscanf(\"%d\", &num);\nprintf(\"%d\", num);",
                },
                {
                    "title": "Comments",
                    "explanation": "C supports both single-line and multi-line comments for explanation.",
                    "example": "// single line\n\n/* multi\nline */",
                },
                {
                    "title": "Operators",
                    "explanation": "Operators in C perform arithmetic and other operations on values.",
                    "example": "int a = 10;\nint b = 5;\n\na + b\na - b\na * b\na / b\na % b",
                },
            ],
            "conditional_statements": [
                {
                    "title": "if",
                    "explanation": "Use `if` when code should run only when a condition is true.",
                    "example": "if (a > b) {\n    printf(\"A is greater\");\n}",
                },
                {
                    "title": "if else",
                    "explanation": "Use `if else` when there are two possible branches.",
                    "example": "if (a > b) {\n    printf(\"A greater\");\n} else {\n    printf(\"B greater\");\n}",
                },
                {
                    "title": "else if",
                    "explanation": "Use `else if` when multiple conditions must be checked one after another.",
                    "example": "if (marks >= 90)\n    printf(\"A\");\nelse if (marks >= 70)\n    printf(\"B\");\nelse\n    printf(\"C\");",
                },
                {
                    "title": "switch",
                    "explanation": "Use `switch` when one variable is checked against multiple fixed cases.",
                    "example": "switch (day) {\ncase 1:\n    printf(\"Monday\");\n    break;\ncase 2:\n    printf(\"Tuesday\");\n    break;\ndefault:\n    printf(\"Invalid\");\n}",
                },
                {
                    "title": "Ternary",
                    "explanation": "The ternary operator is a short form of if-else used for simple comparisons.",
                    "example": "int max = (a > b) ? a : b;",
                },
            ],
            "loops": [
                {
                    "title": "for",
                    "explanation": "Use a for loop when the number of repetitions is known.",
                    "example": "for (int i = 0; i < 5; i++) {\n    printf(\"%d\", i);\n}",
                },
                {
                    "title": "while",
                    "explanation": "Use a while loop when repetition depends on a condition.",
                    "example": "int i = 0;\n\nwhile (i < 5) {\n    printf(\"%d\", i);\n    i++;\n}",
                },
                {
                    "title": "do while",
                    "explanation": "A do-while loop runs the body once before checking the condition.",
                    "example": "int i = 0;\n\ndo {\n    printf(\"%d\", i);\n    i++;\n} while (i < 5);",
                },
                {
                    "title": "Break / Continue",
                    "explanation": "Use break to stop the loop early and continue to skip the current iteration.",
                    "example": "if (i == 5)\n    break;\n\nif (i == 3)\n    continue;",
                },
            ],
            "functions": [
                {
                    "title": "Function Definition",
                    "explanation": "A function definition creates reusable logic that can be called from other parts of the program.",
                    "example": "int add(int a, int b) {\n    return a + b;\n}",
                },
                {
                    "title": "Function Call",
                    "explanation": "A function call runs the function and uses the returned result.",
                    "example": "int result = add(5, 10);",
                },
            ],
            "arrays": [
                {"title": "1D Array", "explanation": "A 1D array stores multiple values of the same type in one sequence.", "example": "int arr[5] = {10,20,30,40,50};"},
                {"title": "Traversal", "explanation": "Traversing an array uses a loop to access each element.", "example": "for(int i=0;i<5;i++){\nprintf(\"%d\",arr[i]);\n}"},
                {"title": "2D Array", "explanation": "A 2D array stores values in rows and columns.", "example": "int matrix[2][3] = {\n{1,2,3},\n{4,5,6}\n};"},
            ],
            "strings": [
                {
                    "title": "String Basics",
                    "explanation": "In C, strings are character arrays and common string functions come from `string.h`.",
                    "example": "#include <string.h>\n\nchar name[20] = \"John\";\n\nstrlen(name);\nstrcpy(name,\"Alex\");\nstrcmp(name,\"John\");",
                },
            ],
            "recursion": [
                {
                    "title": "Factorial",
                    "explanation": "This recursive function multiplies `n` by `fact(n-1)` until it reaches the base case.",
                    "example": "int factorial(int n){\n\nif(n==0)\nreturn 1;\n\nreturn n*factorial(n-1);\n\n}",
                },
            ],
            "sorting": [
                {
                    "title": "Bubble Sort",
                    "explanation": "Bubble sort compares adjacent values and swaps them when they are in the wrong order.",
                    "example": "for (int i = 0; i < n - 1; i++) {\n    for (int j = 0; j < n - i - 1; j++) {\n        if (arr[j] > arr[j + 1]) {\n            int temp = arr[j];\n            arr[j] = arr[j + 1];\n            arr[j + 1] = temp;\n        }\n    }\n}",
                },
                {
                    "title": "Selection Sort",
                    "explanation": "Selection sort finds the minimum value in the unsorted portion and swaps it into place.",
                    "example": "for(int i=0;i<n-1;i++){\n\nint min=i;\n\nfor(int j=i+1;j<n;j++){\n\nif(arr[j]<arr[min])\nmin=j;\n\n}\n\nint temp=arr[i];\narr[i]=arr[min];\narr[min]=temp;\n\n}",
                },
                {
                    "title": "Insertion Sort",
                    "explanation": "Insertion sort inserts each value into its correct place within the sorted left side.",
                    "example": "for(int i=1;i<n;i++){\n\nint key=arr[i];\nint j=i-1;\n\nwhile(j>=0 && arr[j]>key){\narr[j+1]=arr[j];\nj--;\n}\n\narr[j+1]=key;\n\n}",
                },
            ],
            "searching": [
                {
                    "title": "Linear Search",
                    "explanation": "Linear search checks each element until the key is found.",
                    "example": "for (int i = 0; i < n; i++) {\n    if (arr[i] == key) {\n        printf(\"Found\");\n    }\n}",
                },
                {
                    "title": "Binary Search",
                    "explanation": "Binary search works on sorted arrays and halves the search range on each step.",
                    "example": "int low=0;\nint high=n-1;\n\nwhile(low<=high){\n\nint mid=(low+high)/2;\n\nif(arr[mid]==key)\nreturn mid;\n\nelse if(arr[mid]<key)\nlow=mid+1;\n\nelse\nhigh=mid-1;\n\n}",
                },
            ],
            "data_structures": [
                {
                    "title": "Stack (Array Implementation)",
                    "explanation": "A stack can be implemented using an array and a `top` variable to track the current last element.",
                    "example": "int stack[10];\nint top = -1;\n\ntop++;\nstack[top] = 10;\n\ntop--;",
                },
                {
                    "title": "Queue",
                    "explanation": "A queue can be implemented using an array along with `front` and `rear` variables.",
                    "example": "int queue[10];\nint front=0,rear=-1;\n\nrear++;\nqueue[rear]=10;\n\nfront++;",
                },
                {
                    "title": "Linked List",
                    "explanation": "A linked list node stores data and the address of the next node.",
                    "example": "struct Node{\n\nint data;\nstruct Node* next;\n\n};",
                },
                {
                    "title": "Tree",
                    "explanation": "A tree node stores data and pointers to left and right child nodes.",
                    "example": "struct Node{\n\nint data;\nstruct Node* left;\nstruct Node* right;\n\n};",
                },
                {
                    "title": "Hashing",
                    "explanation": "A simple hashing setup can use an array and a hash function based on modulo.",
                    "example": "int hashTable[10];\n\nint hashFunction(int key){\nreturn key % 10;\n}",
                },
            ],
        }

        if topic_key in c_topic_details:
            return c_topic_details[topic_key]

    if language_key == "java":
        java_topic_details = {
            "basic_syntax": [
                {
                    "title": "Program Structure (Entry Point)",
                    "explanation": "Every Java program starts from the main() method. `public class Main` declares the class, `main()` is the entry point, and `System.out.println()` prints output.",
                    "example": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}",
                },
                {
                    "title": "Variables and Data Types",
                    "explanation": "Java is a strongly typed language, so every variable must declare its data type before use.",
                    "example": "int age = 20;\ndouble salary = 50000.50;\nchar grade = 'A';\nboolean isActive = true;",
                },
                {
                    "title": "Constants",
                    "explanation": "Constants are declared with `final` and their value cannot be changed later in the program.",
                    "example": "final double PI = 3.14159;",
                },
                {
                    "title": "Input and Output",
                    "explanation": "Use `System.out.println()` or `System.out.print()` for output. Use `Scanner` from `java.util` to read input values.",
                    "example": "import java.util.Scanner;\n\nScanner sc = new Scanner(System.in);\nint num = sc.nextInt();\nString name = sc.next();\nSystem.out.println(\"Hello\");",
                },
                {
                    "title": "Comments",
                    "explanation": "Java supports both single-line comments and multi-line comments for explanation and readability.",
                    "example": "// This is a comment\n/*\nThis is\na multi-line comment\n*/",
                },
                {
                    "title": "Operators",
                    "explanation": "Operators in Java include arithmetic, relational, logical, and increment/decrement operators.",
                    "example": "int a = 10;\nint b = 5;\n\nint sum = a + b;\nint sub = a - b;\nint mul = a * b;\nint div = a / b;\nint mod = a % b;\n\nboolean check = (a > 5 && b < 10);\na++;\na--;",
                },
            ],
            "conditional_statements": [
                {
                    "title": "if Statement",
                    "explanation": "Use `if` when you want to run a block only if one condition is true.",
                    "example": "if (age >= 18) {\n    System.out.println(\"Adult\");\n}",
                },
                {
                    "title": "if-else Statement",
                    "explanation": "Use `if-else` when there are two possible paths based on one condition.",
                    "example": "if (age >= 18) {\n    System.out.println(\"Adult\");\n} else {\n    System.out.println(\"Minor\");\n}",
                },
                {
                    "title": "else-if Ladder",
                    "explanation": "Use an else-if ladder when multiple ranges or conditions must be checked in sequence.",
                    "example": "if (marks >= 90)\n    System.out.println(\"Grade A\");\nelse if (marks >= 70)\n    System.out.println(\"Grade B\");\nelse\n    System.out.println(\"Grade C\");",
                },
                {
                    "title": "Nested if",
                    "explanation": "Nested if statements are used when one condition check depends on another being true first.",
                    "example": "if (age >= 18) {\n    if (age >= 60) {\n        System.out.println(\"Senior Citizen\");\n    }\n}",
                },
                {
                    "title": "Switch Statement",
                    "explanation": "Switch is useful when one variable is matched against several fixed cases.",
                    "example": "switch (day) {\n    case 1:\n        System.out.println(\"Monday\");\n        break;\n    case 2:\n        System.out.println(\"Tuesday\");\n        break;\n    default:\n        System.out.println(\"Invalid\");\n}",
                },
                {
                    "title": "Ternary Operator",
                    "explanation": "The ternary operator provides a short one-line form of if-else for simple decisions.",
                    "example": "int max = (a > b) ? a : b;",
                },
            ],
            "loops": [
                {
                    "title": "for Loop",
                    "explanation": "Use a for loop when the number of iterations is known in advance.",
                    "example": "for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}",
                },
                {
                    "title": "while Loop",
                    "explanation": "Use a while loop when repetition depends on a condition being true.",
                    "example": "int i = 0;\nwhile (i < 5) {\n    System.out.println(i);\n    i++;\n}",
                },
                {
                    "title": "do-while Loop",
                    "explanation": "A do-while loop always executes its body at least once before checking the condition.",
                    "example": "int i = 0;\ndo {\n    System.out.println(i);\n    i++;\n} while (i < 5);",
                },
                {
                    "title": "Nested Loops",
                    "explanation": "Nested loops are useful for patterns, matrices, and repeated comparisons.",
                    "example": "for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        System.out.print(\"* \");\n    }\n    System.out.println();\n}",
                },
                {
                    "title": "break",
                    "explanation": "Use break to exit the loop immediately when a target condition is reached.",
                    "example": "for (int i = 0; i < 10; i++) {\n    if (i == 5)\n        break;\n}",
                },
                {
                    "title": "continue",
                    "explanation": "Use continue to skip the current iteration and jump to the next one.",
                    "example": "for (int i = 0; i < 10; i++) {\n    if (i == 5)\n        continue;\n}",
                },
            ],
            "functions": [
                {
                    "title": "Function Definition",
                    "explanation": "A method definition creates reusable logic inside the class.",
                    "example": "static int add(int a, int b) {\n    return a + b;\n}",
                },
                {
                    "title": "Function Call",
                    "explanation": "A function call executes the method and stores or uses its result.",
                    "example": "int result = add(5, 10);",
                },
                {
                    "title": "Function Without Return Value",
                    "explanation": "Use `void` when the method performs an action but does not return a result.",
                    "example": "static void greet() {\n    System.out.println(\"Hello\");\n}",
                },
                {
                    "title": "Parameters and Arguments",
                    "explanation": "Parameters are variables in the method definition, while arguments are the actual values passed during the call.",
                    "example": "static void display(int num) {\n    System.out.println(num);\n}\n\ndisplay(10);",
                },
            ],
        }

        java_topic_details.update({
            "arrays": [
                {"title": "Array Declaration", "explanation": "Array declaration creates space for multiple values of the same type.", "example": "int arr[] = new int[5];"},
                {"title": "Array Initialization", "explanation": "Initialization assigns starting values to the array.", "example": "int arr[] = {10, 20, 30, 40};"},
                {"title": "Accessing Elements", "explanation": "Array elements are accessed using their index position.", "example": "System.out.println(arr[0]);"},
                {"title": "Traversing Array", "explanation": "Traversal uses a loop to process every array element one by one.", "example": "for (int i = 0; i < arr.length; i++) {\n    System.out.println(arr[i]);\n}"},
                {"title": "2D Arrays", "explanation": "2D arrays are used for matrix-style or table-style data.", "example": "int matrix[][] = {\n    {1, 2, 3},\n    {4, 5, 6}\n};"},
            ],
            "strings": [
                {"title": "String Declaration", "explanation": "A string stores text inside double quotes.", "example": "String name = \"John\";"},
                {"title": "String Length", "explanation": "Use `length()` to find how many characters are in the string.", "example": "name.length();"},
                {"title": "String Concatenation", "explanation": "Concatenation joins strings together.", "example": "String full = first + last;"},
                {"title": "String Comparison", "explanation": "Use `equals()` to compare string contents in Java.", "example": "name.equals(\"John\");"},
                {"title": "Substring", "explanation": "Use `substring(start, end)` to extract part of a string.", "example": "name.substring(0, 3);"},
            ],
            "recursion": [
                {"title": "Factorial Example", "explanation": "This recursive method multiplies `n` by the factorial of `n - 1` until it reaches the base case `n == 0`.", "example": "static int factorial(int n) {\n    if (n == 0)\n        return 1;\n    return n * factorial(n - 1);\n}\n\nfactorial(5);"},
            ],
            "sorting": [
                {"title": "Bubble Sort", "explanation": "Bubble sort compares adjacent elements and swaps them if they are in the wrong order.", "example": "for (int i = 0; i < n - 1; i++) {\n    for (int j = 0; j < n - i - 1; j++) {\n        if (arr[j] > arr[j + 1]) {\n            int temp = arr[j];\n            arr[j] = arr[j + 1];\n            arr[j + 1] = temp;\n        }\n    }\n}"},
                {"title": "Selection Sort", "explanation": "Selection sort finds the minimum element and places it in the correct position in each pass.", "example": "for (int i = 0; i < n - 1; i++) {\n    int min = i;\n    for (int j = i + 1; j < n; j++) {\n        if (arr[j] < arr[min])\n            min = j;\n    }\n    int temp = arr[min];\n    arr[min] = arr[i];\n    arr[i] = temp;\n}"},
                {"title": "Insertion Sort", "explanation": "Insertion sort inserts each element into its proper place in the already sorted part of the array.", "example": "for (int i = 1; i < n; i++) {\n    int key = arr[i];\n    int j = i - 1;\n    while (j >= 0 && arr[j] > key) {\n        arr[j + 1] = arr[j];\n        j--;\n    }\n    arr[j + 1] = key;\n}"},
            ],
            "searching": [
                {"title": "Linear Search", "explanation": "Linear search checks each element one by one until the target is found.", "example": "for (int i = 0; i < n; i++) {\n    if (arr[i] == key) {\n        System.out.println(\"Found\");\n    }\n}"},
                {"title": "Binary Search", "explanation": "Binary search works on a sorted array and reduces the search range by half each step.", "example": "int low = 0;\nint high = n - 1;\n\nwhile (low <= high) {\n    int mid = (low + high) / 2;\n    if (arr[mid] == key)\n        return mid;\n    else if (arr[mid] < key)\n        low = mid + 1;\n    else\n        high = mid - 1;\n}"},
            ],
            "data_structures": [
                {"title": "Stack", "explanation": "A stack follows LIFO order and supports operations like push and pop.", "example": "import java.util.Stack;\n\nStack<Integer> stack = new Stack<>();\nstack.push(10);\nstack.push(20);\nstack.pop();"},
                {"title": "Queue", "explanation": "A queue follows FIFO order and is commonly implemented with `LinkedList` in Java.", "example": "import java.util.Queue;\nimport java.util.LinkedList;\n\nQueue<Integer> q = new LinkedList<>();\nq.add(10);\nq.remove();"},
                {"title": "Linked List", "explanation": "A linked list stores values in nodes connected by references.", "example": "class Node {\n    int data;\n    Node next;\n}"},
                {"title": "Trees", "explanation": "Tree nodes commonly store data and links to left and right child nodes.", "example": "class Node {\n    int data;\n    Node left;\n    Node right;\n}"},
                {"title": "Hashing", "explanation": "HashMap stores key-value pairs and supports fast insertion and lookup.", "example": "import java.util.HashMap;\n\nHashMap<String, Integer> map = new HashMap<>();\nmap.put(\"Apple\", 10);\nmap.get(\"Apple\");"},
            ],
        })

        if topic_key in java_topic_details:
            return java_topic_details[topic_key]

    if language_key == "cpp":
        cpp_topic_details = {
            "basic_syntax": [
                {"title": "Program Structure", "explanation": "A basic C++ program includes headers, may use a namespace, and starts execution from `main()`.", "example": "#include <iostream>\nusing namespace std;\n\nint main() {\n    // code\n    return 0;\n}"},
                {"title": "Comments", "explanation": "C++ supports single-line and multi-line comments for readability and explanation.", "example": "// Single line comment\n\n/*\nMulti-line\ncomment\n*/"},
                {"title": "Variables", "explanation": "Variables are declared with a type before storing values.", "example": "int a = 10;\nfloat b = 5.5;\nchar c = 'A';"},
                {"title": "Data Types", "explanation": "Common C++ data types include integers, floating-point values, characters, and booleans.", "example": "int a;\nfloat b;\ndouble c;\nchar d;\nbool e;"},
                {"title": "Input / Output", "explanation": "Use `cin` to take input and `cout` to print output in C++.", "example": "int x;\ncin >> x;\n\ncout << x;"},
                {"title": "Operators", "explanation": "Operators are used to perform arithmetic and other operations on values.", "example": "int a = 10, b = 5;\n\na + b\na - b\na * b\na / b\na % b"},
            ],
            "loops": [
                {"title": "for Loop", "explanation": "Use a for loop when the number of iterations is known beforehand.", "example": "for(int i=0;i<5;i++){\n    cout<<i;\n}"},
                {"title": "while Loop", "explanation": "Use a while loop when repetition depends on a condition.", "example": "int i=0;\n\nwhile(i<5){\n    cout<<i;\n    i++;\n}"},
                {"title": "do-while Loop", "explanation": "A do-while loop runs its body once before checking the condition.", "example": "int i=0;\n\ndo{\n    cout<<i;\n    i++;\n}while(i<5);"},
                {"title": "Nested Loop", "explanation": "Nested loops are useful for patterns, matrices, and repeated pair comparisons.", "example": "for(int i=0;i<3;i++){\n    for(int j=0;j<3;j++){\n        cout<<i<<j;\n    }\n}"},
                {"title": "break", "explanation": "Use break to stop the loop immediately when a condition is met.", "example": "for(int i=0;i<5;i++){\n\n    if(i==3)\n    break;\n\n}"},
                {"title": "continue", "explanation": "Use continue to skip the current iteration and move to the next one.", "example": "for(int i=0;i<5;i++){\n\n    if(i==3)\n    continue;\n\n}"},
            ],
            "conditional_statements": [
                {"title": "if", "explanation": "Use `if` when code should run only when one condition is true.", "example": "if(a>10){\n    cout<<\"Greater\";\n}"},
                {"title": "if-else", "explanation": "Use `if-else` when there are two possible paths.", "example": "if(a>10){\n    cout<<\"Greater\";\n}\nelse{\n    cout<<\"Smaller\";\n}"},
                {"title": "else-if ladder", "explanation": "Use an else-if ladder to check several conditions in sequence.", "example": "if(a==10)\ncout<<\"Ten\";\n\nelse if(a==20)\ncout<<\"Twenty\";\n\nelse\ncout<<\"Other\";"},
                {"title": "Nested if", "explanation": "Nested if statements are useful when one condition depends on another being true first.", "example": "if(a>10){\n\n    if(a<20){\n        cout<<\"Between\";\n    }\n\n}"},
                {"title": "switch", "explanation": "Use switch when one variable is matched against several fixed cases.", "example": "switch(num){\n\ncase 1:\ncout<<\"One\";\nbreak;\n\ncase 2:\ncout<<\"Two\";\nbreak;\n\ndefault:\ncout<<\"Invalid\";\n\n}"},
                {"title": "Ternary Operator", "explanation": "The ternary operator is a short one-line replacement for simple if-else decisions.", "example": "result = (a>b) ? a : b;"},
            ],
            "functions": [
                {"title": "Function Declaration", "explanation": "A function declaration tells the compiler the function name, return type, and parameter types.", "example": "int add(int,int);"},
                {"title": "Function Definition", "explanation": "A function definition contains the actual logic of the function.", "example": "int add(int a,int b){\n\nreturn a+b;\n\n}"},
                {"title": "Function Call", "explanation": "A function call executes the function and can store its result.", "example": "int result = add(5,3);"},
                {"title": "Parameters", "explanation": "Parameters receive the values passed when the function is called.", "example": "void display(int x){\ncout<<x;\n}"},
                {"title": "Return Type", "explanation": "The return type tells what kind of value the function sends back.", "example": "int square(int n){\n\nreturn n*n;\n\n}"},
                {"title": "Function Overloading", "explanation": "Function overloading allows multiple functions with the same name but different parameter types.", "example": "int add(int a,int b){\nreturn a+b;\n}\n\nfloat add(float a,float b){\nreturn a+b;\n}"},
            ],
            "arrays": [
                {"title": "Array Declaration", "explanation": "Array declaration reserves space for a fixed number of elements.", "example": "int arr[5];"},
                {"title": "Array Initialization", "explanation": "Initialization assigns values when the array is created.", "example": "int arr[5] = {1,2,3,4,5};"},
                {"title": "Accessing Elements", "explanation": "Use indexes to access elements in the array.", "example": "arr[0];\narr[2];"},
                {"title": "Traversing Array", "explanation": "Traversal uses a loop to process all elements one by one.", "example": "for(int i=0;i<5;i++){\n\ncout<<arr[i];\n\n}"},
                {"title": "2D Array", "explanation": "A 2D array stores values in rows and columns.", "example": "int arr[2][2] = {\n\n{1,2},\n{3,4}\n\n};"},
                {"title": "Passing Array to Function", "explanation": "Arrays can be passed to functions along with their size for processing.", "example": "void display(int arr[], int n){\n\nfor(int i=0;i<n;i++)\ncout<<arr[i];\n\n}"},
            ],
            "strings": [
                {"title": "String Declaration", "explanation": "A C++ string stores text and is easier to use than a C-style char array.", "example": "string s = \"Hello\";"},
                {"title": "String Input", "explanation": "Use `cin` to read a string value.", "example": "string name;\ncin >> name;"},
                {"title": "String Concatenation", "explanation": "Use `+` to join strings together.", "example": "string a = \"Hello\";\nstring b = \"World\";\n\nstring c = a + b;"},
                {"title": "String Length", "explanation": "Use `.length()` to get the number of characters in the string.", "example": "s.length();"},
                {"title": "String Comparison", "explanation": "Strings can be compared directly with `==` in C++.", "example": "if(a == b){\ncout<<\"Equal\";\n}"},
                {"title": "Substring", "explanation": "Use `substr(start, length)` to extract a part of the string.", "example": "s.substr(1,3);"},
            ],
            "recursion": [
                {"title": "Recursive Function", "explanation": "A recursive function calls itself until it reaches the base case.", "example": "int fact(int n){\n\nif(n==0)\nreturn 1;\n\nreturn n * fact(n-1);\n\n}"},
                {"title": "Fibonacci", "explanation": "This recursive Fibonacci function returns the sum of the two previous terms.", "example": "int fib(int n){\n\nif(n<=1)\nreturn n;\n\nreturn fib(n-1) + fib(n-2);\n\n}"},
            ],
            "sorting": [
                {"title": "Bubble Sort", "explanation": "Bubble sort compares adjacent elements and swaps them when they are in the wrong order.", "example": "for(int i=0;i<n-1;i++){\n\nfor(int j=0;j<n-i-1;j++){\n\nif(arr[j]>arr[j+1]){\n\nswap(arr[j],arr[j+1]);\n\n}\n\n}\n\n}"},
                {"title": "Selection Sort", "explanation": "Selection sort chooses the minimum element from the unsorted part and swaps it into place.", "example": "for(int i=0;i<n-1;i++){\n\nint min=i;\n\nfor(int j=i+1;j<n;j++){\n\nif(arr[j]<arr[min])\nmin=j;\n\n}\n\nswap(arr[i],arr[min]);\n\n}"},
                {"title": "Insertion Sort", "explanation": "Insertion sort inserts each element into the correct place in the sorted portion.", "example": "for(int i=1;i<n;i++){\n\nint key=arr[i];\nint j=i-1;\n\nwhile(j>=0 && arr[j]>key){\n\narr[j+1]=arr[j];\nj--;\n\n}\n\narr[j+1]=key;\n\n}"},
            ],
            "searching": [
                {"title": "Linear Search", "explanation": "Linear search checks every element one by one until the key is found.", "example": "for(int i=0;i<n;i++){\n\nif(arr[i]==key){\ncout<<\"Found\";\n}\n\n}"},
                {"title": "Binary Search", "explanation": "Binary search works on sorted data and cuts the search space in half each step.", "example": "int l=0,r=n-1;\n\nwhile(l<=r){\n\nint mid=(l+r)/2;\n\nif(arr[mid]==key)\nreturn mid;\n\nelse if(arr[mid]<key)\nl=mid+1;\n\nelse\nr=mid-1;\n\n}"},
            ],
            "data_structures": [
                {"title": "Stack", "explanation": "The STL stack supports push and pop operations following LIFO order.", "example": "#include <stack>\n\nstack<int> s;\n\ns.push(10);\ns.push(20);\n\ns.pop();"},
                {"title": "Queue", "explanation": "The STL queue supports FIFO order with push and pop.", "example": "#include <queue>\n\nqueue<int> q;\n\nq.push(10);\nq.push(20);\n\nq.pop();"},
                {"title": "Linked List", "explanation": "A linked list node stores data and a pointer to the next node.", "example": "struct Node{\n\nint data;\nNode* next;\n\n};"},
                {"title": "Tree Node", "explanation": "A tree node stores data and pointers to left and right child nodes.", "example": "struct Node{\n\nint data;\nNode* left;\nNode* right;\n\n};"},
                {"title": "Hashing", "explanation": "An unordered_map stores key-value pairs with fast average lookup time.", "example": "#include <unordered_map>\n\nunordered_map<int,string> m;\n\nm[1] = \"One\";"},
            ],
        }

        if topic_key in cpp_topic_details:
            return cpp_topic_details[topic_key]

    if language_key == "python":
        python_topic_details = {
            "basic_syntax": [
                {"title": "Program Structure", "explanation": "A simple Python program can be organized with a main function and a direct function call.", "example": "def main():\n    print(\"Hello World\")\n\nmain()"},
                {"title": "Comments", "explanation": "Python supports single-line comments and multi-line string-style comments often used as block notes.", "example": "# Single line comment\n\n\"\"\"\nMulti-line\ncomment\n\"\"\""},
                {"title": "Variables", "explanation": "Variables in Python do not need explicit type declarations.", "example": "a = 10\nb = 5.5\nc = \"Hello\""},
                {"title": "Data Types", "explanation": "Python variables can hold integers, floats, strings, booleans, and more.", "example": "a = 10          # int\nb = 3.14        # float\nc = \"Python\"    # string\nd = True        # boolean"},
                {"title": "Input / Output", "explanation": "Use `input()` to read values and `print()` to display output.", "example": "x = int(input(\"Enter number: \"))\nprint(x)"},
                {"title": "Operators", "explanation": "Operators perform arithmetic and other actions on values.", "example": "a = 10\nb = 5\n\na + b\na - b\na * b\na / b\na % b"},
            ],
            "loops": [
                {"title": "for Loop", "explanation": "Use a for loop when iterating over a range or collection.", "example": "for i in range(5):\n    print(i)"},
                {"title": "while Loop", "explanation": "Use a while loop when repetition depends on a condition.", "example": "i = 0\n\nwhile i < 5:\n    print(i)\n    i += 1"},
                {"title": "Nested Loop", "explanation": "Nested loops are useful for patterns and matrix-style logic.", "example": "for i in range(3):\n    for j in range(3):\n        print(i, j)"},
                {"title": "break", "explanation": "Use break to stop a loop immediately when a condition is met.", "example": "for i in range(5):\n    if i == 3:\n        break"},
                {"title": "continue", "explanation": "Use continue to skip the current iteration and move to the next one.", "example": "for i in range(5):\n    if i == 3:\n        continue\n    print(i)"},
            ],
            "conditional_statements": [
                {"title": "if", "explanation": "Use `if` when code should run only when a condition is true.", "example": "if a > 10:\n    print(\"Greater\")"},
                {"title": "if-else", "explanation": "Use `if-else` when there are two possible paths.", "example": "if a > 10:\n    print(\"Greater\")\nelse:\n    print(\"Smaller\")"},
                {"title": "elif Ladder", "explanation": "Use `elif` to check several conditions in sequence.", "example": "if a == 10:\n    print(\"Ten\")\nelif a == 20:\n    print(\"Twenty\")\nelse:\n    print(\"Other\")"},
                {"title": "Nested if", "explanation": "Nested if statements are useful when one check depends on another.", "example": "if a > 10:\n    if a < 20:\n        print(\"Between\")"},
                {"title": "Ternary Operator", "explanation": "Python supports a short conditional expression for simple decisions.", "example": "result = a if a > b else b"},
            ],
            "functions": [
                {"title": "Function Definition", "explanation": "Use `def` to define a reusable function.", "example": "def add(a, b):\n    return a + b"},
                {"title": "Function Call", "explanation": "A function call executes the function and uses its result.", "example": "result = add(5, 3)"},
                {"title": "Parameters", "explanation": "Parameters receive input values when the function is called.", "example": "def display(x):\n    print(x)"},
                {"title": "Return Value", "explanation": "A return statement sends a result back from the function.", "example": "def square(n):\n    return n * n"},
                {"title": "Default Parameters", "explanation": "Default parameters provide a value when no argument is passed.", "example": "def greet(name=\"User\"):\n    print(\"Hello\", name)"},
            ],
            "arrays": [
                {"title": "List Declaration", "explanation": "Python uses lists instead of traditional arrays.", "example": "arr = []"},
                {"title": "List Initialization", "explanation": "A list can be created with starting values directly.", "example": "arr = [1,2,3,4,5]"},
                {"title": "Accessing Elements", "explanation": "List elements are accessed by index.", "example": "arr[0]\narr[2]"},
                {"title": "Traversing List", "explanation": "Traversal processes each element one by one.", "example": "for i in arr:\n    print(i)"},
                {"title": "2D Array (List of Lists)", "explanation": "A list of lists represents a 2D array-like structure.", "example": "arr = [\n    [1,2],\n    [3,4]\n]"},
                {"title": "Passing List to Function", "explanation": "Lists can be passed directly to functions.", "example": "def display(arr):\n    for i in arr:\n        print(i)"},
            ],
            "strings": [
                {"title": "String Declaration", "explanation": "A string stores text data inside quotes.", "example": "s = \"Hello\""},
                {"title": "String Input", "explanation": "Use `input()` to read string input from the user.", "example": "name = input(\"Enter name: \")"},
                {"title": "String Concatenation", "explanation": "Use `+` to join strings together.", "example": "a = \"Hello\"\nb = \"World\"\n\nc = a + b"},
                {"title": "String Length", "explanation": "Use `len()` to get the number of characters in a string.", "example": "len(s)"},
                {"title": "String Comparison", "explanation": "Strings can be compared directly with `==` in Python.", "example": "if a == b:\n    print(\"Equal\")"},
                {"title": "Substring", "explanation": "Use slicing to get part of a string.", "example": "s[1:4]"},
            ],
            "recursion": [
                {"title": "Factorial", "explanation": "This recursive factorial function multiplies `n` by `fact(n-1)` until the base case is reached.", "example": "def fact(n):\n\n    if n == 0:\n        return 1\n\n    return n * fact(n-1)"},
                {"title": "Fibonacci", "explanation": "This recursive Fibonacci function returns the sum of the two previous terms.", "example": "def fib(n):\n\n    if n <= 1:\n        return n\n\n    return fib(n-1) + fib(n-2)"},
            ],
            "sorting": [
                {"title": "Bubble Sort", "explanation": "Bubble sort swaps adjacent elements when they are in the wrong order.", "example": "for i in range(n-1):\n\n    for j in range(n-i-1):\n\n        if arr[j] > arr[j+1]:\n            arr[j], arr[j+1] = arr[j+1], arr[j]"},
                {"title": "Selection Sort", "explanation": "Selection sort finds the minimum value and places it in the correct position.", "example": "for i in range(n):\n\n    min_index = i\n\n    for j in range(i+1, n):\n\n        if arr[j] < arr[min_index]:\n            min_index = j\n\n    arr[i], arr[min_index] = arr[min_index], arr[i]"},
                {"title": "Insertion Sort", "explanation": "Insertion sort inserts each element into the already sorted left side.", "example": "for i in range(1, len(arr)):\n\n    key = arr[i]\n    j = i - 1\n\n    while j >= 0 and arr[j] > key:\n        arr[j+1] = arr[j]\n        j -= 1\n\n    arr[j+1] = key"},
            ],
            "searching": [
                {"title": "Linear Search", "explanation": "Linear search checks every element one by one until the target is found.", "example": "for i in range(len(arr)):\n\n    if arr[i] == key:\n        print(\"Found\")"},
                {"title": "Binary Search", "explanation": "Binary search works on sorted lists and cuts the search range in half at each step.", "example": "l = 0\nr = len(arr) - 1\n\nwhile l <= r:\n\n    mid = (l + r) // 2\n\n    if arr[mid] == key:\n        print(\"Found\")\n        break\n\n    elif arr[mid] < key:\n        l = mid + 1\n\n    else:\n        r = mid - 1"},
            ],
            "data_structures": [
                {"title": "Stack", "explanation": "A Python list can be used as a stack with `append()` and `pop()`.", "example": "stack = []\n\nstack.append(10)\nstack.append(20)\n\nstack.pop()"},
                {"title": "Queue", "explanation": "Use `deque` from `collections` for efficient queue operations.", "example": "from collections import deque\n\nq = deque()\n\nq.append(10)\nq.append(20)\n\nq.popleft()"},
                {"title": "Linked List Node", "explanation": "A linked list node can be created using a class with `data` and `next`.", "example": "class Node:\n\n    def __init__(self,data):\n        self.data = data\n        self.next = None"},
                {"title": "Tree Node", "explanation": "A tree node stores data and references to left and right child nodes.", "example": "class Node:\n\n    def __init__(self,data):\n        self.data = data\n        self.left = None\n        self.right = None"},
                {"title": "Hashing (Dictionary)", "explanation": "Python dictionaries store key-value pairs and support quick lookup.", "example": "hash_map = {}\n\nhash_map[1] = \"One\"\nhash_map[2] = \"Two\""},
            ],
        }

        if topic_key in python_topic_details:
            return python_topic_details[topic_key]

    if language_key == "javascript":
        javascript_topic_details = {
            "basic_syntax": [
                {"title": "Program Structure", "explanation": "A simple JavaScript program can run directly and print output with `console.log()`.", "example": "// Simple program\nconsole.log(\"Hello World\");"},
                {"title": "Comments", "explanation": "JavaScript supports both single-line and multi-line comments.", "example": "// Single line comment\n\n/*\nMulti-line\ncomment\n*/"},
                {"title": "Variables", "explanation": "JavaScript variables can be declared with `let`, `const`, or `var`.", "example": "let a = 10;\nconst b = 5.5;\nvar c = \"Hello\";"},
                {"title": "Data Types", "explanation": "JavaScript supports numbers, strings, booleans, null, and undefined values.", "example": "let num = 10;       // Number\nlet price = 5.5;    // Number (float)\nlet name = \"JS\";    // String\nlet flag = true;    // Boolean\nlet n = null;       // Null\nlet u;              // Undefined"},
                {"title": "Input / Output", "explanation": "Use `prompt()` to take input in browser-based JavaScript and `console.log()` to print output.", "example": "let x = prompt(\"Enter number\");  // Input\nconsole.log(x);                  // Output"},
                {"title": "Operators", "explanation": "Operators perform arithmetic and other actions on values.", "example": "let a = 10, b = 5;\n\na + b\na - b\na * b\na / b\na % b"},
            ],
            "loops": [
                {"title": "for Loop", "explanation": "Use a for loop when the number of iterations is known.", "example": "for(let i = 0; i < 5; i++){\n    console.log(i);\n}"},
                {"title": "while Loop", "explanation": "Use a while loop when repetition depends on a condition.", "example": "let i = 0;\nwhile(i < 5){\n    console.log(i);\n    i++;\n}"},
                {"title": "do-while Loop", "explanation": "A do-while loop executes its body once before checking the condition.", "example": "let i = 0;\ndo{\n    console.log(i);\n    i++;\n} while(i < 5);"},
                {"title": "Nested Loop", "explanation": "Nested loops are useful for patterns and 2D traversal.", "example": "for(let i=0;i<3;i++){\n    for(let j=0;j<3;j++){\n        console.log(i, j);\n    }\n}"},
                {"title": "break", "explanation": "Use break to stop the loop immediately when a condition is met.", "example": "for(let i=0;i<5;i++){\n    if(i==3) break;\n}"},
                {"title": "continue", "explanation": "Use continue to skip the current iteration and move to the next one.", "example": "for(let i=0;i<5;i++){\n    if(i==3) continue;\n    console.log(i);\n}"},
            ],
            "conditional_statements": [
                {"title": "if", "explanation": "Use `if` when code should run only when one condition is true.", "example": "if(a > 10){\n    console.log(\"Greater\");\n}"},
                {"title": "if-else", "explanation": "Use `if-else` when there are two possible paths.", "example": "if(a > 10){\n    console.log(\"Greater\");\n}else{\n    console.log(\"Smaller\");\n}"},
                {"title": "else-if Ladder", "explanation": "Use an else-if ladder to check multiple conditions in sequence.", "example": "if(a == 10){\n    console.log(\"Ten\");\n}else if(a == 20){\n    console.log(\"Twenty\");\n}else{\n    console.log(\"Other\");\n}"},
                {"title": "Nested if", "explanation": "Nested if statements are useful when one condition depends on another.", "example": "if(a>10){\n    if(a<20){\n        console.log(\"Between\");\n    }\n}"},
                {"title": "Ternary Operator", "explanation": "The ternary operator is a short one-line replacement for simple if-else decisions.", "example": "let result = (a > b) ? a : b;"},
            ],
            "functions": [
                {"title": "Function Declaration", "explanation": "A function declaration creates reusable logic.", "example": "function add(a,b){\n    return a+b;\n}"},
                {"title": "Function Call", "explanation": "A function call runs the function and can store the returned result.", "example": "let result = add(5,3);"},
                {"title": "Parameters", "explanation": "Parameters receive values when the function is called.", "example": "function display(x){\n    console.log(x);\n}"},
                {"title": "Return Value", "explanation": "A return statement sends a value back from the function.", "example": "function square(n){\n    return n*n;\n}"},
                {"title": "Default Parameters", "explanation": "Default parameters provide a fallback value when no argument is passed.", "example": "function greet(name=\"User\"){\n    console.log(\"Hello\", name);\n}"},
            ],
            "arrays": [
                {"title": "Array Declaration", "explanation": "An empty array can be declared using square brackets.", "example": "let arr = [];"},
                {"title": "Array Initialization", "explanation": "An array can be initialized directly with values.", "example": "let arr = [1,2,3,4,5];"},
                {"title": "Accessing Elements", "explanation": "Array elements are accessed by index.", "example": "arr[0];\narr[2];"},
                {"title": "Traversing Array", "explanation": "Traversal uses a loop to visit each element.", "example": "for(let i=0;i<arr.length;i++){\n    console.log(arr[i]);\n}"},
                {"title": "2D Array", "explanation": "A 2D array stores values in rows and columns.", "example": "let matrix = [\n    [1,2],\n    [3,4]\n];"},
                {"title": "Passing Array to Function", "explanation": "Arrays can be passed directly to functions.", "example": "function display(arr){\n    for(let i=0;i<arr.length;i++){\n        console.log(arr[i]);\n    }\n}"},
            ],
            "strings": [
                {"title": "String Declaration", "explanation": "A string stores text data inside quotes.", "example": "let s = \"Hello\";"},
                {"title": "String Input", "explanation": "Use `prompt()` to get string input in browser-style JavaScript.", "example": "let name = prompt(\"Enter your name\");"},
                {"title": "String Concatenation", "explanation": "Use `+` to join strings together.", "example": "let a = \"Hello\";\nlet b = \"World\";\nlet c = a + b;"},
                {"title": "String Length", "explanation": "Use the `.length` property to get the number of characters.", "example": "s.length;"},
                {"title": "String Comparison", "explanation": "Use strict equality to compare strings safely.", "example": "if(a === b){\n    console.log(\"Equal\");\n}"},
                {"title": "Substring", "explanation": "Use `substring(start, end)` to extract part of a string.", "example": "s.substring(1,4);"},
            ],
            "recursion": [
                {"title": "Factorial", "explanation": "This recursive function multiplies `n` by the factorial of `n - 1` until it reaches zero.", "example": "function fact(n){\n    if(n==0) return 1;\n    return n * fact(n-1);\n}"},
                {"title": "Fibonacci", "explanation": "This recursive Fibonacci function returns the sum of the two previous terms.", "example": "function fib(n){\n    if(n<=1) return n;\n    return fib(n-1) + fib(n-2);\n}"},
            ],
            "sorting": [
                {"title": "Bubble Sort", "explanation": "Bubble sort swaps adjacent elements when they are in the wrong order.", "example": "for(let i=0;i<arr.length-1;i++){\n    for(let j=0;j<arr.length-i-1;j++){\n        if(arr[j]>arr[j+1]){\n            let temp = arr[j];\n            arr[j] = arr[j+1];\n            arr[j+1] = temp;\n        }\n    }\n}"},
                {"title": "Selection Sort", "explanation": "Selection sort finds the minimum element and swaps it into the correct position.", "example": "for(let i=0;i<arr.length;i++){\n    let min = i;\n    for(let j=i+1;j<arr.length;j++){\n        if(arr[j] < arr[min]) min = j;\n    }\n    [arr[i], arr[min]] = [arr[min], arr[i]];\n}"},
                {"title": "Insertion Sort", "explanation": "Insertion sort inserts each element into the already sorted left side.", "example": "for(let i=1;i<arr.length;i++){\n    let key = arr[i];\n    let j = i-1;\n    while(j>=0 && arr[j]>key){\n        arr[j+1]=arr[j];\n        j--;\n    }\n    arr[j+1] = key;\n}"},
            ],
            "searching": [
                {"title": "Linear Search", "explanation": "Linear search checks each element one by one until the target is found.", "example": "for(let i=0;i<arr.length;i++){\n    if(arr[i]==key){\n        console.log(\"Found\");\n        break;\n    }\n}"},
                {"title": "Binary Search", "explanation": "Binary search works on sorted data and narrows the search space by half each step.", "example": "let l=0, r=arr.length-1;\nwhile(l<=r){\n    let mid = Math.floor((l+r)/2);\n    if(arr[mid]==key){\n        console.log(\"Found\");\n        break;\n    }else if(arr[mid]<key){\n        l = mid+1;\n    }else{\n        r = mid-1;\n    }\n}"},
            ],
            "data_structures": [
                {"title": "Stack", "explanation": "A JavaScript array can be used as a stack with `push()` and `pop()`.", "example": "let stack = [];\n\nstack.push(10);\nstack.push(20);\n\nstack.pop();"},
                {"title": "Queue", "explanation": "A JavaScript array can be used as a queue with `push()` and `shift()`.", "example": "let queue = [];\n\nqueue.push(10);\nqueue.push(20);\n\nqueue.shift();"},
                {"title": "Linked List Node", "explanation": "A linked list node can be represented using a class with `data` and `next`.", "example": "class Node {\n    constructor(data){\n        this.data = data;\n        this.next = null;\n    }\n}"},
                {"title": "Tree Node", "explanation": "A tree node stores data and references to left and right child nodes.", "example": "class Node {\n    constructor(data){\n        this.data = data;\n        this.left = null;\n        this.right = null;\n    }\n}"},
                {"title": "Hashing (Map)", "explanation": "JavaScript `Map` stores key-value pairs and supports insertion and lookup.", "example": "let map = new Map();\nmap.set(\"one\",1);\nmap.set(\"two\",2);"},
            ],
        }

        if topic_key in javascript_topic_details:
            return javascript_topic_details[topic_key]

    if topic_key == "basic_syntax":
        return [
            {"title": "Program structure", "explanation": f"{cfg['name']} programs follow a standard structure so the runtime knows where to begin and how the code is organized.", "example": cfg["function_syntax"] if language_key in ("python", "javascript") else cfg["variable_syntax"]},
            {"title": "Variables and data types", "explanation": "Variables store values and data types help the language understand what kind of value is being handled.", "example": cfg["variable_syntax"]},
            {"title": "Input and output", "explanation": "Input reads values into the program and output displays the processed result to the user.", "example": cfg["loop_syntax"] if language_key == "python" else cfg["condition_syntax"]},
            {"title": "Operators", "explanation": "Operators are used to perform arithmetic, comparison, and logical operations in code.", "example": cfg["variable_syntax"]},
            {"title": "Comments", "explanation": "Comments help explain the purpose of the code and improve readability for learners and teammates.", "example": cfg["variable_syntax"]},
        ]

    if topic_key == "loops":
        loop_examples = {
            "c": {
                "for loop": "for (int i = 0; i < n; i++) {\n    printf(\"%d \", i);\n}",
                "while loop": "int i = 0;\nwhile (i < n) {\n    printf(\"%d \", i);\n    i++;\n}",
                "Nested loops": "for (int row = 0; row < 3; row++) {\n    for (int col = 0; col < 3; col++) {\n        printf(\"*\");\n    }\n    printf(\"\\n\");\n}",
                "break": "for (int i = 0; i < n; i++) {\n    if (arr[i] == key) {\n        break;\n    }\n}",
                "continue": "for (int i = 0; i < n; i++) {\n    if (i % 2 != 0) {\n        continue;\n    }\n    printf(\"%d \", i);\n}",
            },
            "cpp": {
                "for loop": "for (int i = 0; i < n; i++) {\n    cout << i << \" \";\n}",
                "while loop": "int i = 0;\nwhile (i < n) {\n    cout << i << \" \";\n    i++;\n}",
                "Nested loops": "for (int row = 0; row < 3; row++) {\n    for (int col = 0; col < 3; col++) {\n        cout << \"*\";\n    }\n    cout << endl;\n}",
                "break": "for (int i = 0; i < n; i++) {\n    if (arr[i] == key) {\n        break;\n    }\n}",
                "continue": "for (int i = 0; i < n; i++) {\n    if (i % 2 != 0) {\n        continue;\n    }\n    cout << i << \" \";\n}",
            },
            "java": {
                "for loop": "for (int i = 0; i < n; i++) {\n    System.out.print(i + \" \");\n}",
                "while loop": "int i = 0;\nwhile (i < n) {\n    System.out.print(i + \" \");\n    i++;\n}",
                "Nested loops": "for (int row = 0; row < 3; row++) {\n    for (int col = 0; col < 3; col++) {\n        System.out.print(\"*\");\n    }\n    System.out.println();\n}",
                "break": "for (int i = 0; i < n; i++) {\n    if (arr[i] == key) {\n        break;\n    }\n}",
                "continue": "for (int i = 0; i < n; i++) {\n    if (i % 2 != 0) {\n        continue;\n    }\n    System.out.print(i + \" \");\n}",
            },
            "python": {
                "for loop": "for i in range(n):\n    print(i, end=' ')",
                "while loop": "i = 0\nwhile i < n:\n    print(i, end=' ')\n    i += 1",
                "Nested loops": "for row in range(3):\n    for col in range(3):\n        print('*', end='')\n    print()",
                "break": "for value in arr:\n    if value == key:\n        break",
                "continue": "for i in range(n):\n    if i % 2 != 0:\n        continue\n    print(i, end=' ')",
            },
            "javascript": {
                "for loop": "for (let i = 0; i < n; i++) {\n    console.log(i);\n}",
                "while loop": "let i = 0;\nwhile (i < n) {\n    console.log(i);\n    i++;\n}",
                "Nested loops": "for (let row = 0; row < 3; row++) {\n    for (let col = 0; col < 3; col++) {\n        process.stdout.write('*');\n    }\n    process.stdout.write('\\n');\n}",
                "break": "for (let i = 0; i < n; i++) {\n    if (arr[i] === key) {\n        break;\n    }\n}",
                "continue": "for (let i = 0; i < n; i++) {\n    if (i % 2 !== 0) {\n        continue;\n    }\n    console.log(i);\n}",
            },
        }
        explanations = {
            "for loop": "Use a for loop when the number of repetitions is already known.",
            "while loop": "Use a while loop when repetition depends on a condition that changes during execution.",
            "Nested loops": "Nested loops are useful for matrix traversal, pattern printing, and pair-based comparisons.",
            "break": "break stops the loop immediately once a required condition is met.",
            "continue": "continue skips the current iteration and moves directly to the next one.",
        }
        return [{"title": key, "explanation": explanations[key], "example": loop_examples[language_key][key]} for key in TOPIC_TEMPLATES[topic_key]["subtopics"]]

    generic_examples = {
        "conditional_statements": cfg["condition_syntax"],
        "functions": cfg["function_syntax"],
        "arrays": cfg["array_syntax"],
        "strings": cfg["string_syntax"],
        "recursion": cfg["recursion_syntax"],
        "sorting": cfg["sort_syntax"],
        "searching": cfg["search_syntax"],
        "data_structures": cfg["ds_syntax"],
    }
    generic_explanations = {
        "conditional_statements": {
            "if": "Use if when one condition decides whether a block should run.",
            "if else": "Use if else when there are exactly two paths in the logic.",
            "else if ladder": "Use else if ladder for multiple conditions checked in order.",
            "switch/case": "switch or case is useful when one value is compared against several fixed options.",
            "Logical operators": "Logical operators combine multiple conditions in a single check.",
        },
        "functions": {
            "Function definition": "A function definition creates a reusable block of code.",
            "Parameters": "Parameters receive input values for the function to process.",
            "Return values": "Return values send the processed result back to the caller.",
            "Void functions": "Void functions perform an action without returning a value.",
            "Scope": "Scope decides where variables can be accessed inside the program.",
        },
        "arrays": {
            "Declaration": "Declaration creates an array or list to hold multiple values.",
            "Indexing": "Indexing accesses a specific position in the collection.",
            "Traversal": "Traversal uses loops to process every element one by one.",
            "Updating values": "Updating values changes data at a specific index.",
            "2D arrays": "2D arrays help represent tables, grids, and matrices.",
        },
        "strings": {
            "Declaration": "String declaration stores text data in a variable.",
            "Length": "Length operations help count how many characters a string contains.",
            "Traversal": "Traversal processes each character one by one.",
            "Concatenation": "Concatenation joins multiple strings into one.",
            "Substring": "Substring operations extract a smaller part of the string.",
        },
        "recursion": {
            "Base case": "The base case stops recursive calls and prevents infinite recursion.",
            "Recursive case": "The recursive case reduces the problem and calls the function again.",
            "Call stack": "The call stack keeps track of active recursive calls.",
            "Factorial": "Factorial is a standard beginner recursion example.",
            "Fibonacci": "Fibonacci shows how repeated subproblems appear in recursion.",
        },
        "sorting": {
            "Bubble sort": "Bubble sort repeatedly swaps adjacent values when they are out of order.",
            "Selection sort": "Selection sort selects the correct element for each position.",
            "Insertion sort": "Insertion sort inserts each new element into the already sorted part.",
            "Swapping": "Swapping is the core operation used to exchange element positions.",
            "Time complexity basics": "Time complexity compares how sorting performance changes with input size.",
        },
        "searching": {
            "Linear search": "Linear search checks each element one by one until the target is found.",
            "Binary search": "Binary search cuts the search range in half on each step.",
            "Sorted array requirement": "Binary search requires the array to be sorted first.",
            "Search result index": "A search often returns the index where the value was found.",
            "Search complexity": "Search complexity compares the efficiency of linear and binary search.",
        },
        "data_structures": {
            "Stack": "A stack follows last-in, first-out order.",
            "Queue": "A queue follows first-in, first-out order.",
            "Linked List": "A linked list stores elements through connected nodes.",
            "Hash Map": "A hash map stores key-value pairs for quick lookup.",
            "Tree basics": "Trees organize data hierarchically and are common in interviews.",
        },
    }

    return [
        {
            "title": subtopic,
            "explanation": generic_explanations[topic_key][subtopic],
            "example": generic_examples[topic_key],
        }
        for subtopic in TOPIC_TEMPLATES[topic_key]["subtopics"]
    ]


def _build_topic_detail(language_key, topic_key):
    cfg = LANGUAGE_CONFIG[language_key]
    template = TOPIC_TEMPLATES[topic_key]
    subtopic_details = _build_subtopic_details(language_key, topic_key)
    return {
        "key": topic_key,
        "title": template["title"],
        "overview": template["overview"],
        "subtopics": template["subtopics"],
        "syntax_points": template["syntax_points"],
        "example": template["example_builder"](cfg),
        "example_question": template["example_question"],
        "subtopic_details": subtopic_details,
        "selected_subtopic": subtopic_details[0]["title"] if subtopic_details else None,
        "practice_count": sum(len(PRACTICE_BANK[topic_key][level]) for level in LEVELS),
    }


def get_coding_languages():
    return [
        {
            "key": key,
            "name": data["name"],
            "headline": data["headline"],
            "topic_count": len(TOPIC_ORDER),
        }
        for key, data in LANGUAGE_CONFIG.items()
    ]


def get_language_topics(language):
    cfg = LANGUAGE_CONFIG.get(language)
    if cfg is None:
        return None

    return {
        "language": {
            "key": language,
            "name": cfg["name"],
            "headline": cfg["headline"],
        },
        "topics": [_build_topic_detail(language, topic_key) for topic_key in TOPIC_ORDER],
    }


def get_language_topic_detail(language, topic_key):
    cfg = LANGUAGE_CONFIG.get(language)
    if cfg is None or topic_key not in TOPIC_TEMPLATES:
        return None

    return {
        "language": {
            "key": language,
            "name": cfg["name"],
        },
        "topic": _build_topic_detail(language, topic_key),
    }


def get_language_topic_practice(language, topic_key, difficulty):
    if language not in LANGUAGE_CONFIG or topic_key not in PRACTICE_BANK or difficulty not in LEVELS:
        return None
    return PRACTICE_BANK[topic_key][difficulty]
