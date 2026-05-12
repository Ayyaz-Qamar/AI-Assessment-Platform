-- =====================================================
-- AI Assessment Platform — Department Tests Seed (v2)
-- 5 Tests × 40 Questions = 200 Questions
-- Each test: 13 easy + 14 medium + 13 hard
-- =====================================================

-- Clean existing test data (preserves users)
DELETE FROM answers;
DELETE FROM test_attempts;
DELETE FROM questions;
DELETE FROM tests;

-- =====================================================
-- TEST: Artificial Intelligence
-- =====================================================
INSERT INTO tests (title, description, category, created_at) VALUES
('Artificial Intelligence', 'Test your knowledge of AI fundamentals: search algorithms, neural networks, machine learning concepts, and natural language processing.', 'AI', NOW());

INSERT INTO questions (test_id, text, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What does AI stand for?', 'Automated Intelligence', 'Artificial Intelligence', 'Advanced Internet', 'Algorithmic Iteration', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which of these is a popular Python library for machine learning?', 'NumPy', 'TensorFlow', 'Flask', 'BeautifulSoup', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is supervised learning?', 'Learning without any data', 'Learning from labeled data', 'Learning by playing games', 'Learning from random noise', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which of these is an AI assistant?', 'Photoshop', 'Siri', 'Excel', 'Notepad', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is the goal of machine learning?', 'To delete data', 'To enable computers to learn from data', 'To replace humans entirely', 'To build websites', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which programming language is most popular for AI?', 'COBOL', 'Python', 'Pascal', 'Fortran', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is a chatbot?', 'A type of robot', 'An AI program that simulates human conversation', 'A type of email', 'A web browser', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which is an example of weak AI?', 'A general-purpose human-like robot', 'A spam email filter', 'A self-aware machine', 'A conscious computer', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is computer vision?', 'Designing computer screens', 'AI that interprets visual information', 'Cleaning monitors', 'Writing graphics code', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What does ML stand for?', 'Multi Language', 'Machine Learning', 'Memory Leak', 'Module Loader', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which company developed ChatGPT?', 'Google', 'OpenAI', 'Microsoft', 'Meta', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is a dataset?', 'A single value', 'A collection of data used for training/testing', 'A type of database', 'A network protocol', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which is a popular deep learning framework?', 'Bootstrap', 'PyTorch', 'jQuery', 'Angular', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which algorithm is commonly used for classification problems?', 'Linear Regression', 'K-Means Clustering', 'Decision Tree', 'Apriori Algorithm', 'C', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is the purpose of an activation function in neural networks?', 'To initialize weights', 'To introduce non-linearity', 'To reduce model size', 'To store training data', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What does NLP stand for in AI context?', 'Neural Linear Processing', 'Natural Language Processing', 'Network Layer Protocol', 'Numerical Logic Programming', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which search algorithm uses a heuristic function to find the shortest path?', 'BFS', 'DFS', 'A* Search', 'Linear Search', 'C', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is overfitting?', 'Model performs well on training but poorly on new data', 'Model is too small', 'Model takes too long to train', 'Model has no parameters', 'A', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which type of learning has no labeled outputs?', 'Supervised', 'Unsupervised', 'Reinforcement', 'Transfer', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What does CNN stand for in deep learning?', 'Computer Network Node', 'Convolutional Neural Network', 'Centralized Numeric Net', 'Cluster Neural Network', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which loss function is typical for binary classification?', 'Mean Squared Error', 'Binary Cross-Entropy', 'Hinge Loss', 'Cosine Similarity', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is feature engineering?', 'Designing hardware', 'Creating/selecting useful input features for ML models', 'Tuning hyperparameters', 'Compressing files', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which algorithm is used for unsupervised clustering?', 'Logistic Regression', 'K-Means', 'Decision Tree', 'SVM', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is the role of an optimizer in neural networks?', 'To draw graphs', 'To update weights to minimize loss', 'To create data', 'To label data', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is a perceptron?', 'A type of CPU', 'The simplest unit of a neural network', 'A computer virus', 'A clustering method', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which technique helps reduce overfitting?', 'Adding more parameters', 'Dropout', 'Removing the test set', 'Disabling backpropagation', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is reinforcement learning?', 'Learning with labels', 'Learning by trial and error with rewards', 'Learning by clustering', 'Learning by copying', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is the vanishing gradient problem?', 'When gradients become too large during backpropagation', 'When gradients approach zero in deep networks, slowing learning', 'When the model has too many parameters', 'When training data is missing', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'In reinforcement learning, what does the Bellman equation define?', 'The loss function of neural networks', 'The optimal value of a state recursively', 'The activation threshold', 'The number of hidden layers needed', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which technique is used in Transformers to weigh the importance of different words in a sequence?', 'Convolution', 'Pooling', 'Self-Attention', 'Dropout', 'C', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is the curse of dimensionality?', 'High-dimensional data makes learning harder due to sparsity', 'Data with no dimensions', 'Always good for accuracy', 'Refers to GPU usage', 'A', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which type of layer is used in GANs to generate new data?', 'Pooling layer', 'Generator network', 'Softmax layer', 'Embedding layer', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is the role of the discriminator in a GAN?', 'Generates new samples', 'Classifies samples as real or fake', 'Optimizes the loss', 'Stores model weights', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is gradient descent''s purpose?', 'Increase loss', 'Iteratively minimize the loss function', 'Generate data', 'Shuffle features', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which activation function outputs values between 0 and 1?', 'ReLU', 'Sigmoid', 'Tanh', 'Leaky ReLU', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is transfer learning?', 'Moving data between servers', 'Reusing a pre-trained model on a new task', 'Translating languages', 'Hardware upgrade', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which algorithm is used for sequential data like time series?', 'CNN', 'LSTM (Recurrent Neural Network)', 'K-Means', 'Random Forest', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What does BERT stand for?', 'Basic Encoder Recurrent Transformer', 'Bidirectional Encoder Representations from Transformers', 'Best Embedding Recurrent Tool', 'Binary Encoder for Random Tasks', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'What is the explore-exploit trade-off in reinforcement learning?', 'Choosing between trying new actions vs. using known good ones', 'Choosing between supervised and unsupervised', 'Choosing between Python and R', 'GPU vs CPU choice', 'A', 'hard'),
((SELECT id FROM tests WHERE title='Artificial Intelligence'), 'Which problem is NP-Hard often associated with AI search?', 'Sorting an array', 'Travelling Salesman Problem', 'Linear regression', 'Hash lookup', 'B', 'hard');

-- =====================================================
-- TEST: Data Science
-- =====================================================
INSERT INTO tests (title, description, category, created_at) VALUES
('Data Science', 'Cover statistics, data analysis, pandas/numpy, and machine learning workflows.', 'Data Science', NOW());

INSERT INTO questions (test_id, text, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES
((SELECT id FROM tests WHERE title='Data Science'), 'Which library is primarily used for data manipulation in Python?', 'matplotlib', 'pandas', 'requests', 'flask', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'What does CSV stand for?', 'Computer System Values', 'Comma-Separated Values', 'Common Style Variables', 'Coded Standard Volume', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is the mean of [2, 4, 6, 8, 10]?', '5', '6', '7', '8', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which Python library is used for numerical computing?', 'Flask', 'NumPy', 'Pygame', 'Tkinter', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is a DataFrame?', 'A picture frame', 'A 2D labeled data structure in pandas', 'A type of variable', 'A web framework', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which type of chart shows parts of a whole?', 'Histogram', 'Pie chart', 'Line chart', 'Scatter plot', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is the median of [3, 1, 4, 1, 5]?', '1', '3', '4', '5', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which extension is used for Jupyter notebooks?', '.py', '.ipynb', '.csv', '.json', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'What does EDA stand for in data science?', 'Easy Data Access', 'Exploratory Data Analysis', 'Encrypted Data Archive', 'Engineering Database Application', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which library is used for plotting in Python?', 'NumPy', 'matplotlib', 'pandas', 'scipy', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is a missing value typically called in pandas?', 'MAX', 'NaN', 'NULL_IDX', 'VOID', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which is a measure of central tendency?', 'Variance', 'Mean', 'Range', 'IQR', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is the mode of [1, 2, 2, 3, 4]?', '1', '2', '3', '4', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which pandas function loads a CSV file into a DataFrame?', 'pd.load_csv()', 'pd.read_csv()', 'pd.open_csv()', 'pd.import_csv()', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is the standard deviation a measure of?', 'Central tendency', 'Spread or dispersion of data', 'Median value', 'Sample size', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which chart type is best for showing the distribution of a single numerical variable?', 'Pie chart', 'Histogram', 'Scatter plot', 'Bar chart', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'What does the train_test_split function in scikit-learn do?', 'Trains a model', 'Splits data into training and testing sets', 'Evaluates accuracy', 'Visualizes data', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which method handles missing values by filling them?', 'df.dropna()', 'df.fillna()', 'df.remove()', 'df.delete()', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is the difference between .loc and .iloc in pandas?', 'No difference', '.loc is label-based, .iloc is integer-position-based', '.loc is faster always', '.iloc is for strings only', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which metric is appropriate for an imbalanced classification problem?', 'Accuracy', 'F1-Score', 'Mean Squared Error', 'R²', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'What does normalization do to features?', 'Increases their magnitude', 'Scales them to a similar range', 'Removes them', 'Encrypts them', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is one-hot encoding used for?', 'Compressing files', 'Converting categorical variables to binary columns', 'Removing outliers', 'Speeding up training', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which command shows the first 5 rows of a DataFrame?', 'df.first()', 'df.head()', 'df.peek()', 'df.start()', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is correlation?', 'A causation relationship', 'A statistical measure of how variables move together', 'A type of regression', 'A pandas method', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which method aggregates DataFrame columns?', 'df.merge()', 'df.groupby()', 'df.split()', 'df.copy()', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'What does df.describe() return?', 'Just column names', 'Summary statistics of numeric columns', 'DataFrame shape only', 'Column data types only', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which test checks if two samples have equal means?', 'Chi-square test', 'T-test', 'ANOVA only', 'F1-score', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is the difference between Type I and Type II errors in hypothesis testing?', 'No difference', 'Type I rejects a true null hypothesis; Type II fails to reject a false null', 'Type I accepts everything; Type II rejects everything', 'Type I is for small samples; Type II is for large samples', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which technique helps prevent overfitting in regression models?', 'Increasing learning rate', 'L1 or L2 Regularization', 'Removing all features', 'Using only training data for evaluation', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'What does PCA (Principal Component Analysis) primarily achieve?', 'Increases data dimensionality', 'Reduces dimensionality while preserving variance', 'Removes outliers', 'Encrypts sensitive data', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is multicollinearity?', 'Multiple datasets combined', 'High correlation among independent variables in regression', 'Multiple target variables', 'A clustering method', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which sampling method ensures every population member has equal selection chance?', 'Convenience sampling', 'Simple random sampling', 'Snowball sampling', 'Cluster sampling', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is the bias-variance tradeoff?', 'Hardware vs software choice', 'Balance between underfitting (high bias) and overfitting (high variance)', 'Train vs test split ratio', 'A network topology', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which distribution is used for binary outcomes?', 'Normal', 'Bernoulli', 'Poisson', 'Exponential', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is the purpose of cross-validation?', 'Speed up training', 'Robustly evaluate model performance using multiple data splits', 'Encrypt the dataset', 'Visualize features', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is heteroscedasticity?', 'Equal variance across all values', 'Unequal variance of residuals in regression', 'A measure of central tendency', 'A clustering algorithm', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which method handles class imbalance by oversampling minority class?', 'SMOTE', 'PCA', 'LDA', 'OLS', 'A', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'What does p-value < 0.05 typically indicate?', 'Definite causation', 'Statistically significant result (reject null hypothesis)', 'Data is correct', 'A weak model', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'What is the Central Limit Theorem?', 'Data must be normal', 'Means of large samples approach a normal distribution regardless of original distribution', 'All variances are equal', 'Errors are random', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Data Science'), 'Which clustering algorithm doesn''t require specifying k upfront?', 'K-Means', 'DBSCAN', 'Hierarchical only', 'PCA', 'B', 'hard');

-- =====================================================
-- TEST: Computer Science
-- =====================================================
INSERT INTO tests (title, description, category, created_at) VALUES
('Computer Science', 'Core CS fundamentals: data structures, algorithms, operating systems, and complexity analysis.', 'CS', NOW());

INSERT INTO questions (test_id, text, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES
((SELECT id FROM tests WHERE title='Computer Science'), 'Which data structure uses LIFO (Last In First Out)?', 'Queue', 'Stack', 'Array', 'Tree', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What does CPU stand for?', 'Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Common Processing Update', 'A', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which of these is NOT a programming language?', 'Python', 'Java', 'HTML', 'C++', 'C', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is RAM?', 'Permanent storage', 'Random Access Memory (temporary)', 'A CPU type', 'A network protocol', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which is a high-level language?', 'Assembly', 'Python', 'Binary', 'Microcode', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is an operating system?', 'A type of game', 'Software that manages hardware and other software', 'A keyboard', 'A web browser', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which OS is open source?', 'Windows', 'Linux', 'macOS', 'iOS', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What does GUI stand for?', 'General User Interface', 'Graphical User Interface', 'Global Unique Identifier', 'Grouped User Input', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which is an example of a compiler?', 'GCC', 'Microsoft Word', 'Chrome', 'Notepad', 'A', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is a variable?', 'A fixed value', 'A named storage for data', 'A loop', 'A function', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which symbol is used for comments in Python?', '//', '#', '/*', '--', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What does HTML stand for?', 'HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Mode Logic', 'A', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which loop runs at least once even if condition is false?', 'for loop', 'do-while loop', 'while loop', 'foreach loop', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is the time complexity of binary search on a sorted array?', 'O(n)', 'O(log n)', 'O(n²)', 'O(1)', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which sorting algorithm has the best average-case time complexity?', 'Bubble Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'In OOP, what does encapsulation mean?', 'Hiding internal state and bundling data with methods', 'Creating multiple objects', 'Inheriting from a parent class', 'Overloading methods', 'A', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which scheduling algorithm gives the shortest waiting time on average?', 'FCFS', 'Round Robin', 'Shortest Job First (SJF)', 'Priority Scheduling', 'C', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is a pointer in C?', 'A value', 'A variable that stores a memory address', 'A function', 'A keyword for loops', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which data structure is best for implementing recursion?', 'Queue', 'Stack', 'Linked List', 'Hash Table', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is polymorphism in OOP?', 'Having one form', 'Ability of one interface to take many forms', 'A type of inheritance only', 'Hiding data', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which traversal visits root, left, right?', 'Inorder', 'Preorder', 'Postorder', 'Level order', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is the difference between stack and heap memory?', 'No difference', 'Stack stores local variables; heap stores dynamically allocated memory', 'Heap is faster always', 'Stack is for files', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which protocol layer does IP belong to?', 'Application', 'Network', 'Transport', 'Physical', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is a thread?', 'A small piece of fabric', 'A lightweight process for parallel execution', 'A type of file', 'A loop', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which is the worst-case time of quicksort?', 'O(log n)', 'O(n²)', 'O(n)', 'O(1)', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What does SQL JOIN do?', 'Deletes data', 'Combines rows from multiple tables', 'Sorts a table', 'Renames columns', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which data structure has O(1) average lookup?', 'Linked list', 'Hash table', 'Sorted array', 'Binary tree', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is the time complexity of inserting an element into a balanced binary search tree?', 'O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which of these problems is NP-Complete?', 'Sorting an array', 'Finding the shortest path in a weighted graph (Dijkstra)', 'Travelling Salesman Problem', 'Binary search', 'C', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is a deadlock in operating systems?', 'When the CPU is idle', 'When two or more processes wait indefinitely for resources held by each other', 'When a program crashes', 'When memory is full', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What does the volatile keyword do in C?', 'Makes a variable constant', 'Tells compiler the variable can change unexpectedly (no optimization)', 'Allocates heap memory', 'Deletes variable', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which paging algorithm is theoretically optimal but not implementable?', 'FIFO', 'LRU', 'OPT (Belady''s)', 'Random', 'C', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is amortized analysis?', 'Cost analysis of a single operation', 'Average cost over a sequence of operations', 'Worst-case only', 'Hardware analysis', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which sorting algorithm is stable and has O(n log n) worst-case time?', 'Quicksort', 'Merge Sort', 'Heap Sort', 'Selection Sort', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is the difference between mutex and semaphore?', 'No difference', 'Mutex allows one thread access; semaphore allows multiple counted access', 'Mutex is faster always', 'Semaphore is older', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which graph algorithm finds all-pairs shortest paths?', 'BFS', 'Floyd-Warshall', 'DFS', 'Topological Sort', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is the master theorem used for?', 'Network security', 'Solving recurrence relations for divide-and-conquer algorithms', 'Compiler design only', 'Memory allocation', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which technique is used in dynamic programming?', 'Greedy choice', 'Memoization or tabulation', 'Random sampling', 'Brute force only', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'What is virtual memory?', 'Memory that doesn''t exist', 'Technique using disk to simulate more RAM', 'Cache memory only', 'Read-only memory', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Computer Science'), 'Which complexity class problems can be verified in polynomial time?', 'P only', 'NP', 'EXPTIME', 'PSPACE only', 'B', 'hard');

-- =====================================================
-- TEST: Information Technology
-- =====================================================
INSERT INTO tests (title, description, category, created_at) VALUES
('Information Technology', 'IT essentials: networking, databases, cloud computing, and system administration.', 'IT', NOW());

INSERT INTO questions (test_id, text, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES
((SELECT id FROM tests WHERE title='Information Technology'), 'What does HTTP stand for?', 'HyperText Transfer Protocol', 'High Transfer Text Protocol', 'Hyperlink Text Transmission Process', 'Home Tool Transfer Protocol', 'A', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which device connects multiple networks together?', 'Switch', 'Router', 'Hub', 'Modem', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What does SQL stand for?', 'Structured Query Language', 'Simple Question Language', 'Standard Quality Lookup', 'System Quick Logic', 'A', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which is the most common web browser?', 'Microsoft Word', 'Chrome', 'Excel', 'Skype', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is an IP address?', 'A type of email', 'A unique identifier for a device on a network', 'A computer brand', 'A USB port', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which command lists files in Linux?', 'list', 'ls', 'show', 'dir-files', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What does URL stand for?', 'Universal Reference Locator', 'Uniform Resource Locator', 'Unified Routing Layer', 'User Real Link', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which database is NoSQL?', 'MySQL', 'MongoDB', 'PostgreSQL', 'Oracle', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is the cloud in computing?', 'Weather data', 'Remote servers accessed over the internet', 'Cooling system', 'A type of CPU', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which key combination copies in Windows?', 'Ctrl+V', 'Ctrl+C', 'Ctrl+X', 'Ctrl+Z', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What does LAN stand for?', 'Long Area Network', 'Local Area Network', 'Logical Access Node', 'Linked Application Net', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which is a server-side language?', 'HTML', 'PHP', 'CSS', 'JSON', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What does HDD stand for?', 'High Density Disk', 'Hard Disk Drive', 'Hybrid Data Disk', 'Heavy Drive Disk', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which port is used by HTTPS by default?', '80', '21', '443', '25', 'C', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What does IaaS stand for in cloud computing?', 'Internet as a Service', 'Infrastructure as a Service', 'Information as a Software', 'Integration and Storage', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which SQL command is used to remove a table entirely?', 'DELETE', 'REMOVE', 'DROP', 'TRUNCATE', 'C', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is the primary purpose of DNS?', 'Encrypt network traffic', 'Translate domain names to IP addresses', 'Block malicious sites', 'Speed up internet', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which command shows network configuration in Windows?', 'netshow', 'ipconfig', 'ifconfig', 'netstats', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is a foreign key?', 'A unique identifier in its own table', 'A column that references the primary key of another table', 'A backup database', 'An encryption key', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which protocol is used to send emails?', 'HTTP', 'SMTP', 'FTP', 'SSH', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What does SaaS stand for?', 'Storage as a Service', 'Software as a Service', 'Server as a Software', 'Security as a Solution', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which OSI layer is responsible for routing?', 'Physical', 'Network', 'Session', 'Application', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is virtualization?', 'Making things invisible', 'Running multiple OS instances on one physical machine', 'A type of cloud only', 'Encryption method', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which is a popular cloud provider?', 'Google Drive', 'Amazon Web Services (AWS)', 'WordPress', 'Notepad++', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is a primary key in a database?', 'The most important password', 'A unique identifier for each record in a table', 'The first column always', 'An encrypted field', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which command shows running processes in Linux?', 'showtasks', 'ps', 'tasklist', 'processes', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is REST in web services?', 'A rest break', 'Representational State Transfer (an architectural style)', 'A database type', 'A programming language', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is the main difference between TCP and UDP?', 'TCP is faster but unreliable; UDP is slower but reliable', 'TCP is connection-oriented and reliable; UDP is connectionless and faster', 'TCP works on ports; UDP does not use ports', 'There is no real difference', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'In a relational database, what does ACID stand for?', 'Access, Control, Identity, Data', 'Atomicity, Consistency, Isolation, Durability', 'Authentication, Caching, Indexing, Distribution', 'Asynchronous, Concurrent, Indexed, Direct', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which RAID level provides striping with parity for both performance and fault tolerance?', 'RAID 0', 'RAID 1', 'RAID 5', 'RAID 10', 'C', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is database normalization?', 'Making data abnormal', 'Organizing data to reduce redundancy and improve integrity', 'Encrypting database', 'Backing up database', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which command in Linux changes file permissions?', 'permset', 'chmod', 'chown', 'fileperm', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is the CAP theorem in distributed systems?', 'Cost-Availability-Performance', 'Consistency, Availability, Partition tolerance (only 2 of 3)', 'Cache-Access-Protocol', 'Cloud Application Platform', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which type of NAT maps one private IP to one public IP?', 'PAT', 'Static NAT', 'Dynamic NAT', 'Overload NAT', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is the difference between hub and switch?', 'No difference', 'Hub broadcasts to all ports; switch sends to specific port using MAC', 'Switch is older', 'Hub uses fiber only', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which isolation level prevents dirty reads but allows non-repeatable reads?', 'Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is a load balancer?', 'A weight measuring device', 'Distributes incoming network traffic across multiple servers', 'A power supply', 'A database', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which command is used to track route packets take in a network?', 'ping', 'traceroute (tracert)', 'ifconfig', 'netstat', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'What is sharding in databases?', 'Breaking data', 'Splitting large datasets across multiple machines', 'Encrypting tables', 'Compressing rows', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Information Technology'), 'Which container technology popularized microservices?', 'VMware', 'Docker', 'Hyper-V', 'VirtualBox', 'B', 'hard');

-- =====================================================
-- TEST: Cyber Security
-- =====================================================
INSERT INTO tests (title, description, category, created_at) VALUES
('Cyber Security', 'Security fundamentals: cryptography, attacks, network security, and ethical hacking concepts.', 'Cyber Security', NOW());

INSERT INTO questions (test_id, text, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is a firewall?', 'A physical barrier in a server room', 'A network security system that controls traffic', 'A type of computer virus', 'An antivirus program', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What does phishing mean?', 'A fishing-related game', 'Fraudulent attempts to obtain sensitive info via fake communication', 'A type of strong password', 'A network speed test', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which of these is a strong password?', '123456', 'password', 'Tr0ub4dor&3!Kx9', 'qwerty', 'C', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is malware?', 'A type of harmless software', 'Malicious software designed to harm systems', 'A computer game', 'A backup tool', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which is an example of biometric authentication?', 'Password', 'Fingerprint scan', 'PIN', 'Security question', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What does VPN stand for?', 'Virtual Private Network', 'Verified Public Node', 'Visual Protocol Number', 'Variable Path Network', 'A', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which is a common antivirus software?', 'Photoshop', 'Norton', 'Excel', 'Skype', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is a hacker?', 'A baker', 'Someone who exploits computer systems', 'A web developer', 'A network technician', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What does HTTPS provide that HTTP doesn''t?', 'Higher speed', 'Encryption and security', 'Better images', 'Free hosting', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which is a sign of a phishing email?', 'Sent from a known contact with proper greeting', 'Urgent request to click suspicious links', 'Plain text only', 'Sent during business hours', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is a backup?', 'A duplicate copy of data for recovery', 'An attack', 'A type of virus', 'A network port', 'A', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What does 2FA stand for?', 'Two-Factor Authentication', 'Twice For All', 'Two-File Access', 'Twin Firewall Array', 'A', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which act of accessing systems without permission is illegal?', 'Software update', 'Unauthorized access (hacking)', 'Browsing public websites', 'Sending email', 'B', 'easy'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is the main difference between symmetric and asymmetric encryption?', 'Symmetric uses one key; asymmetric uses a public/private key pair', 'Symmetric is always weaker', 'Asymmetric is only used for hashing', 'They are exactly the same', 'A', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What does SQL injection exploit?', 'Weak Wi-Fi passwords', 'Improperly sanitized user input in SQL queries', 'Outdated browsers', 'Unencrypted USB drives', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which protocol provides secure communication over the internet?', 'HTTP', 'FTP', 'HTTPS', 'Telnet', 'C', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is two-factor authentication (2FA)?', 'Using two passwords', 'Combining two different types of verification (e.g. password + OTP)', 'Logging in twice', 'Using two devices simultaneously', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is social engineering in security?', 'Building social networks', 'Manipulating people to divulge confidential info', 'Coding social apps', 'Designing networks', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which type of attack intercepts communication between two parties?', 'Brute Force', 'Man-in-the-Middle (MITM)', 'DoS', 'Buffer Overflow', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is a hash function used for?', 'Encrypting messages reversibly', 'Producing a fixed-size irreversible digest of data', 'Sorting data', 'Compressing files', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which is a common hashing algorithm?', 'AES', 'SHA-256', 'RSA', 'DES', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is a brute force attack?', 'Trying every possible combination until correct one is found', 'Sending a virus', 'Tricking users', 'Stealing physical hardware', 'A', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which type of malware demands payment to unlock files?', 'Spyware', 'Ransomware', 'Adware', 'Trojan', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is a digital signature used for?', 'Drawing logos', 'Verifying authenticity and integrity of a message', 'Encrypting files only', 'Storing passwords', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which port does SSH typically use?', '21', '22', '23', '25', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is XSS in web security?', 'Extra Secure System', 'Cross-Site Scripting (injecting malicious scripts)', 'Extended SSL', 'External Site Scan', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is a botnet?', 'A robot network for shopping', 'A network of compromised computers used for attacks', 'A safe network', 'A music app', 'B', 'medium'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is a zero-day vulnerability?', 'A bug fixed within a day', 'A security flaw unknown to the vendor with no patch available', 'A virus that activates after zero days', 'A password expiration policy', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which attack involves overwhelming a server with traffic to make it unavailable?', 'SQL Injection', 'Man-in-the-Middle', 'DDoS (Distributed Denial of Service)', 'Cross-Site Scripting', 'C', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'In public-key cryptography, which key is used to encrypt a message intended for a specific recipient?', 'The sender''s private key', 'The recipient''s public key', 'The sender''s public key', 'The recipient''s private key', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is a buffer overflow attack?', 'Filling a queue too fast', 'Writing more data than allocated memory, potentially executing malicious code', 'Network congestion', 'Slow disk write', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which security model uses ''never trust, always verify''?', 'Perimeter security', 'Zero Trust', 'Defense in Depth only', 'Open Network', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What does CSRF stand for?', 'Cross-Site Request Forgery', 'Computer System Recovery Format', 'Cyber Security Risk Framework', 'Certified Security Response Force', 'A', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which cryptographic concept ensures past sessions remain secure even if long-term keys are compromised?', 'Forward Secrecy', 'Hashing', 'Salting', 'Key Stretching', 'A', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is the purpose of salting in password hashing?', 'Adding flavor to data', 'Adding random data before hashing to prevent rainbow table attacks', 'Encrypting twice', 'Making hashes faster', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which protocol secures email transmissions?', 'POP3', 'TLS/SSL with SMTP', 'FTP', 'HTTP', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is privilege escalation?', 'Increasing user privileges with permission', 'Gaining higher access rights than intended (often via exploits)', 'Updating user role legally', 'Logging in as admin properly', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which framework is widely used for penetration testing?', 'TensorFlow', 'Metasploit', 'Django', 'Flask', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'What is the principle of least privilege?', 'Give users maximum access', 'Give users only the minimum access needed to perform tasks', 'No access for anyone', 'Random access assignment', 'B', 'hard'),
((SELECT id FROM tests WHERE title='Cyber Security'), 'Which algorithm is used in TLS handshake for key exchange?', 'AES', 'Diffie-Hellman', 'MD5', 'Base64', 'B', 'hard');

-- =====================================================
-- Verify counts
-- =====================================================
SELECT t.title, q.difficulty, COUNT(q.id) AS count
FROM tests t LEFT JOIN questions q ON q.test_id = t.id
GROUP BY t.title, q.difficulty
ORDER BY t.title, q.difficulty;

SELECT t.title, COUNT(q.id) AS total_questions
FROM tests t LEFT JOIN questions q ON q.test_id = t.id
GROUP BY t.title ORDER BY t.title;