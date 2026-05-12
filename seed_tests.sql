-- =====================================================
-- AI Assessment Platform — Department Tests Seed Data
-- 5 Tests × 10 Questions = 50 Questions
-- Each test: 3 easy + 4 medium + 3 hard
-- =====================================================

-- Clean existing test data (preserves users)
DELETE FROM answers;
DELETE FROM test_attempts;
DELETE FROM questions;
DELETE FROM tests;

-- =====================================================
-- TEST 1: Artificial Intelligence
-- =====================================================
INSERT INTO tests (title, description, category, created_at) VALUES
('Artificial Intelligence', 'Test your knowledge of AI fundamentals: search algorithms, neural networks, machine learning concepts, and natural language processing.', 'AI', NOW());

INSERT INTO questions (test_id, text, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES
-- EASY (3)
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What does AI stand for?', 'Automated Intelligence', 'Artificial Intelligence', 'Advanced Internet', 'Algorithmic Iteration', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which of these is a popular Python library for machine learning?', 'NumPy', 'TensorFlow', 'Flask', 'BeautifulSoup', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is supervised learning?', 'Learning without any data', 'Learning from labeled data', 'Learning by playing games', 'Learning from random noise', 'B', 'easy'),
-- MEDIUM (4)
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which algorithm is commonly used for classification problems?', 'Linear Regression', 'K-Means Clustering', 'Decision Tree', 'Apriori Algorithm', 'C', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is the purpose of an activation function in neural networks?', 'To initialize weights', 'To introduce non-linearity', 'To reduce model size', 'To store training data', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What does NLP stand for in AI context?', 'Neural Linear Processing', 'Natural Language Processing', 'Network Layer Protocol', 'Numerical Logic Programming', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which search algorithm uses a heuristic function to find the shortest path?', 'BFS', 'DFS', 'A* Search', 'Linear Search', 'C', 'medium'),
-- HARD (3)
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is the vanishing gradient problem?', 'When gradients become too large during backpropagation', 'When gradients approach zero in deep networks, slowing learning', 'When the model has too many parameters', 'When training data is missing', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'In reinforcement learning, what does the Bellman equation define?', 'The loss function of neural networks', 'The optimal value of a state recursively', 'The activation threshold', 'The number of hidden layers needed', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which technique is used in Transformers to weigh the importance of different words in a sequence?', 'Convolution', 'Pooling', 'Self-Attention', 'Dropout', 'C', 'hard');


-- =====================================================
-- TEST 2: Data Science
-- =====================================================
INSERT INTO tests (title, description, category, created_at) VALUES
('Data Science', 'Cover statistics, data analysis, pandas/numpy, and machine learning workflows.', 'Data Science', NOW());

INSERT INTO questions (test_id, text, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES
-- EASY (3)
((SELECT id FROM tests WHERE title='Data Science'), 'Which library is primarily used for data manipulation in Python?', 'matplotlib', 'pandas', 'requests', 'flask', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'What does CSV stand for?', 'Computer System Values', 'Comma-Separated Values', 'Common Style Variables', 'Coded Standard Volume', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is the mean of [2, 4, 6, 8, 10]?', '5', '6', '7', '8', 'B', 'easy'),
-- MEDIUM (4)
((SELECT id FROM tests WHERE title='Data Science'), 'Which pandas function loads a CSV file into a DataFrame?', 'pd.load_csv()', 'pd.read_csv()', 'pd.open_csv()', 'pd.import_csv()', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is the standard deviation a measure of?', 'Central tendency', 'Spread or dispersion of data', 'Median value', 'Sample size', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which chart type is best for showing the distribution of a single numerical variable?', 'Pie chart', 'Histogram', 'Scatter plot', 'Bar chart', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'What does the train_test_split function in scikit-learn do?', 'Trains a model', 'Splits data into training and testing sets', 'Evaluates accuracy', 'Visualizes data', 'B', 'medium'),
-- HARD (3)
((SELECT id FROM tests WHERE title='Data Science'), 'What is the difference between Type I and Type II errors in hypothesis testing?', 'No difference', 'Type I rejects a true null hypothesis; Type II fails to reject a false null', 'Type I accepts everything; Type II rejects everything', 'Type I is for small samples; Type II is for large samples', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which technique helps prevent overfitting in regression models?', 'Increasing learning rate', 'L1 or L2 Regularization', 'Removing all features', 'Using only training data for evaluation', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'What does PCA (Principal Component Analysis) primarily achieve?', 'Increases data dimensionality', 'Reduces dimensionality while preserving variance', 'Removes outliers', 'Encrypts sensitive data', 'B', 'hard');


-- =====================================================
-- TEST 3: Computer Science
-- =====================================================
INSERT INTO tests (title, description, category, created_at) VALUES
('Computer Science', 'Core CS fundamentals: data structures, algorithms, operating systems, and complexity analysis.', 'CS', NOW());

INSERT INTO questions (test_id, text, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES
-- EASY (3)
((SELECT id FROM tests WHERE title='Computer Science'), 'Which data structure uses LIFO (Last In First Out)?', 'Queue', 'Stack', 'Array', 'Tree', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What does CPU stand for?', 'Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Common Processing Update', 'A', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which of these is NOT a programming language?', 'Python', 'Java', 'HTML', 'C++', 'C', 'easy'),
-- MEDIUM (4)
((SELECT id FROM tests WHERE title='Computer Science'), 'What is the time complexity of binary search on a sorted array?', 'O(n)', 'O(log n)', 'O(n²)', 'O(1)', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which sorting algorithm has the best average-case time complexity?', 'Bubble Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'In OOP, what does encapsulation mean?', 'Hiding internal state and bundling data with methods', 'Creating multiple objects', 'Inheriting from a parent class', 'Overloading methods', 'A', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which scheduling algorithm gives the shortest waiting time on average?', 'FCFS', 'Round Robin', 'Shortest Job First (SJF)', 'Priority Scheduling', 'C', 'medium'),
-- HARD (3)
((SELECT id FROM tests WHERE title='Computer Science'), 'What is the time complexity of inserting an element into a balanced binary search tree?', 'O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which of these problems is NP-Complete?', 'Sorting an array', 'Finding the shortest path in a weighted graph (Dijkstra)', 'Travelling Salesman Problem', 'Binary search', 'C', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is a deadlock in operating systems?', 'When the CPU is idle', 'When two or more processes wait indefinitely for resources held by each other', 'When a program crashes', 'When memory is full', 'B', 'hard');


-- =====================================================
-- TEST 4: Information Technology
-- =====================================================
INSERT INTO tests (title, description, category, created_at) VALUES
('Information Technology', 'IT essentials: networking, databases, cloud computing, and system administration.', 'IT', NOW());

INSERT INTO questions (test_id, text, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES
-- EASY (3)
((SELECT id FROM tests WHERE title='Information Technology'), 'What does HTTP stand for?', 'HyperText Transfer Protocol', 'High Transfer Text Protocol', 'Hyperlink Text Transmission Process', 'Home Tool Transfer Protocol', 'A', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which device connects multiple networks together?', 'Switch', 'Router', 'Hub', 'Modem', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What does SQL stand for?', 'Structured Query Language', 'Simple Question Language', 'Standard Quality Lookup', 'System Quick Logic', 'A', 'easy'),
-- MEDIUM (4)
((SELECT id FROM tests WHERE title='Information Technology'), 'Which port is used by HTTPS by default?', '80', '21', '443', '25', 'C', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What does IaaS stand for in cloud computing?', 'Internet as a Service', 'Infrastructure as a Service', 'Information as a Software', 'Integration and Storage', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which SQL command is used to remove a table entirely?', 'DELETE', 'REMOVE', 'DROP', 'TRUNCATE', 'C', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is the primary purpose of DNS?', 'Encrypt network traffic', 'Translate domain names to IP addresses', 'Block malicious sites', 'Speed up internet', 'B', 'medium'),
-- HARD (3)
((SELECT id FROM tests WHERE title='Information Technology'), 'What is the main difference between TCP and UDP?', 'TCP is faster but unreliable; UDP is slower but reliable', 'TCP is connection-oriented and reliable; UDP is connectionless and faster', 'TCP works on ports; UDP does not use ports', 'There is no real difference', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'In a relational database, what does ACID stand for?', 'Access, Control, Identity, Data', 'Atomicity, Consistency, Isolation, Durability', 'Authentication, Caching, Indexing, Distribution', 'Asynchronous, Concurrent, Indexed, Direct', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which RAID level provides striping with parity for both performance and fault tolerance?', 'RAID 0', 'RAID 1', 'RAID 5', 'RAID 10', 'C', 'hard');


-- =====================================================
-- TEST 5: Cyber Security
-- =====================================================
INSERT INTO tests (title, description, category, created_at) VALUES
('Cyber Security', 'Security fundamentals: cryptography, attacks, network security, and ethical hacking concepts.', 'Cyber Security', NOW());

INSERT INTO questions (test_id, text, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES
-- EASY (3)
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is a firewall?', 'A physical barrier in a server room', 'A network security system that controls traffic', 'A type of computer virus', 'An antivirus program', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What does phishing mean?', 'A fishing-related game', 'Fraudulent attempts to obtain sensitive info via fake communication', 'A type of strong password', 'A network speed test', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which of these is a strong password?', '123456', 'password', 'Tr0ub4dor&3!Kx9', 'qwerty', 'C', 'easy'),
-- MEDIUM (4)
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is the main difference between symmetric and asymmetric encryption?', 'Symmetric uses one key; asymmetric uses a public/private key pair', 'Symmetric is always weaker', 'Asymmetric is only used for hashing', 'They are exactly the same', 'A', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What does SQL injection exploit?', 'Weak Wi-Fi passwords', 'Improperly sanitized user input in SQL queries', 'Outdated browsers', 'Unencrypted USB drives', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which protocol provides secure communication over the internet?', 'HTTP', 'FTP', 'HTTPS', 'Telnet', 'C', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is two-factor authentication (2FA)?', 'Using two passwords', 'Combining two different types of verification (e.g. password + OTP)', 'Logging in twice', 'Using two devices simultaneously', 'B', 'medium'),
-- HARD (3)
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is a zero-day vulnerability?', 'A bug fixed within a day', 'A security flaw unknown to the vendor with no patch available', 'A virus that activates after zero days', 'A password expiration policy', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which attack involves overwhelming a server with traffic to make it unavailable?', 'SQL Injection', 'Man-in-the-Middle', 'DDoS (Distributed Denial of Service)', 'Cross-Site Scripting', 'C', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'In public-key cryptography, which key is used to encrypt a message intended for a specific recipient?', 'The sender''s private key', 'The recipient''s public key', 'The sender''s public key', 'The recipient''s private key', 'B', 'hard');


-- =====================================================
-- DONE — Verify counts
-- =====================================================
SELECT t.title, COUNT(q.id) AS questions
FROM tests t
LEFT JOIN questions q ON q.test_id = t.id
GROUP BY t.id, t.title
ORDER BY t.id;
