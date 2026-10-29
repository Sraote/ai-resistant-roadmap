// Free learning resources per skill (keys = skill ids in data.js, or names in
// window.EXTRA_SKILLS). Hand-picked; every link is checked by
// .github/workflows/check-links.yml.
// Fields: t = title, u = URL, by = provider, type = Docs | Course | Book | Practice | Video | Guide,
// note = optional caveat (for example, a free account is needed).
window.RESOURCES = {
  // ---------------------------------------------------------------- data & SQL
  "sql-basics": [
    { t: "SQLBolt interactive lessons", u: "https://sqlbolt.com/", by: "SQLBolt", type: "Practice" },
    { t: "SQL Tutorial for Data Analysis", u: "https://www.thoughtspot.com/sql-tutorial", by: "ThoughtSpot (formerly Mode)", type: "Course" },
    { t: "Select Star SQL", u: "https://selectstarsql.com/", by: "Zi Chong Kao", type: "Book" },
    { t: "SQLZoo exercises", u: "https://sqlzoo.net/wiki/SQL_Tutorial", by: "SQLZoo", type: "Practice" }
  ],
  "sql-joins": [
    { t: "Joins and subqueries exercises", u: "https://pgexercises.com/questions/joins/", by: "PostgreSQL Exercises", type: "Practice" },
    { t: "SQL joins lessons", u: "https://www.thoughtspot.com/sql-tutorial/sql-joins", by: "ThoughtSpot (formerly Mode)", type: "Course" },
    { t: "Joins between tables", u: "https://www.postgresql.org/docs/current/tutorial-join.html", by: "PostgreSQL docs", type: "Docs" }
  ],
  "sql-window": [
    { t: "Window functions tutorial", u: "https://www.postgresql.org/docs/current/tutorial-window.html", by: "PostgreSQL docs", type: "Docs" },
    { t: "SQL window functions", u: "https://www.thoughtspot.com/sql-tutorial/sql-window-functions", by: "ThoughtSpot (formerly Mode)", type: "Course" },
    { t: "Aggregation and window exercises", u: "https://pgexercises.com/questions/aggregates/", by: "PostgreSQL Exercises", type: "Practice" }
  ],
  "excel": [
    { t: "Excel Foundations series", u: "https://www.learnfree.org/series/excel-foundations", by: "GCFGlobal LearnFree", type: "Course" },
    { t: "Excel functions reference with examples", u: "https://exceljet.net/functions", by: "Exceljet", type: "Guide" },
    { t: "Excel help & learning", u: "https://support.microsoft.com/en-us/excel", by: "Microsoft", type: "Docs" }
  ],
  "pandas": [
    { t: "10 minutes to pandas", u: "https://pandas.pydata.org/docs/user_guide/10min.html", by: "pandas docs", type: "Docs" },
    { t: "Pandas micro-course", u: "https://www.kaggle.com/learn/pandas", by: "Kaggle Learn", type: "Course" },
    { t: "Python Data Science Handbook", u: "https://jakevdp.github.io/PythonDataScienceHandbook/", by: "Jake VanderPlas", type: "Book" }
  ],
  "data-cleaning": [
    { t: "Data Cleaning micro-course", u: "https://www.kaggle.com/learn/data-cleaning", by: "Kaggle Learn", type: "Course" },
    { t: "Working with missing data", u: "https://pandas.pydata.org/docs/user_guide/missing_data.html", by: "pandas docs", type: "Docs" },
    { t: "Tidy Data (paper)", u: "https://vita.had.co.nz/papers/tidy-data.pdf", by: "Hadley Wickham", type: "Guide" }
  ],
  "stats": [
    { t: "Statistics and probability", u: "https://www.khanacademy.org/math/statistics-probability", by: "Khan Academy", type: "Course" },
    { t: "OpenIntro Statistics", u: "https://www.openintro.org/book/os/", by: "OpenIntro", type: "Book" },
    { t: "Seeing Theory (visual probability)", u: "https://seeing-theory.brown.edu/", by: "Brown University", type: "Guide" },
    { t: "A/B testing tools and articles", u: "https://www.evanmiller.org/ab-testing/", by: "Evan Miller", type: "Guide" }
  ],
  "viz": [
    { t: "Fundamentals of Data Visualization", u: "https://clauswilke.com/dataviz/", by: "Claus O. Wilke", type: "Book" },
    { t: "Data Visualization micro-course", u: "https://www.kaggle.com/learn/data-visualization", by: "Kaggle Learn", type: "Course" },
    { t: "Matplotlib tutorials", u: "https://matplotlib.org/stable/tutorials/index.html", by: "Matplotlib docs", type: "Docs" }
  ],
  "bi-tools": [
    { t: "Power BI learning paths", u: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi", by: "Microsoft Learn", type: "Course" },
    { t: "Free Tableau training videos", u: "https://www.tableau.com/learn/training", by: "Tableau", type: "Video", note: "Free account" },
    { t: "Tableau Public (free tool + gallery)", u: "https://public.tableau.com/app", by: "Tableau", type: "Practice" }
  ],
  "dax": [
    { t: "DAX Guide (every function, with examples)", u: "https://dax.guide/", by: "SQLBI", type: "Docs" },
    { t: "DAX reference", u: "https://learn.microsoft.com/en-us/dax/", by: "Microsoft Learn", type: "Docs" },
    { t: "Articles on filter context and DAX patterns", u: "https://www.sqlbi.com/articles/", by: "SQLBI", type: "Guide" }
  ],
  "data-modeling": [
    { t: "Dimensional modeling techniques", u: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/", by: "Kimball Group", type: "Guide" },
    { t: "How we structure our dbt projects", u: "https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview", by: "dbt Labs", type: "Guide" },
    { t: "Star schema guidance for Power BI", u: "https://learn.microsoft.com/en-us/power-bi/guidance/star-schema", by: "Microsoft Learn", type: "Docs" }
  ],
  "db-design": [
    { t: "Use The Index, Luke!", u: "https://use-the-index-luke.com/", by: "Markus Winand", type: "Book" },
    { t: "CMU Intro to Database Systems (15-445)", u: "https://15445.courses.cs.cmu.edu/", by: "Carnegie Mellon", type: "Course" },
    { t: "PostgreSQL tutorial", u: "https://www.postgresql.org/docs/current/tutorial.html", by: "PostgreSQL docs", type: "Docs" }
  ],
  "etl": [
    { t: "Data Engineering Zoomcamp", u: "https://github.com/DataTalksClub/data-engineering-zoomcamp", by: "DataTalks.Club", type: "Course" },
    { t: "dbt Fundamentals", u: "https://learn.getdbt.com/courses/dbt-fundamentals", by: "dbt Labs", type: "Course", note: "Free account" },
    { t: "Data engineering articles and projects", u: "https://www.startdataengineering.com/", by: "Start Data Engineering", type: "Guide" }
  ],
  "airflow": [
    { t: "Airflow tutorial: fundamentals", u: "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/fundamentals.html", by: "Apache Airflow docs", type: "Docs" },
    { t: "Astronomer Academy", u: "https://academy.astronomer.io/", by: "Astronomer", type: "Course", note: "Free account" },
    { t: "DAG runs, data intervals and catchup", u: "https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dag-run.html", by: "Apache Airflow docs", type: "Docs" }
  ],
  "spark": [
    { t: "Spark quick start", u: "https://spark.apache.org/docs/latest/quick-start.html", by: "Apache Spark docs", type: "Docs" },
    { t: "PySpark getting started", u: "https://spark.apache.org/docs/latest/api/python/getting_started/index.html", by: "Apache Spark docs", type: "Docs" },
    { t: "Spark SQL, DataFrames and performance tuning", u: "https://spark.apache.org/docs/latest/sql-performance-tuning.html", by: "Apache Spark docs", type: "Docs" }
  ],

  // ---------------------------------------------------------------- programming
  "python-core": [
    { t: "The Python Tutorial", u: "https://docs.python.org/3/tutorial/", by: "Python docs", type: "Docs" },
    { t: "CS50's Introduction to Programming with Python", u: "https://cs50.harvard.edu/python/", by: "Harvard", type: "Course" },
    { t: "Automate the Boring Stuff with Python", u: "https://automatetheboringstuff.com/", by: "Al Sweigart", type: "Book" },
    { t: "Python track with mentor feedback", u: "https://exercism.org/tracks/python", by: "Exercism", type: "Practice" }
  ],
  "oop": [
    { t: "Design patterns and refactoring", u: "https://refactoring.guru/", by: "Refactoring.Guru", type: "Guide" },
    { t: "Classes (Python tutorial)", u: "https://docs.python.org/3/tutorial/classes.html", by: "Python docs", type: "Docs" },
    { t: "Composing Programs", u: "https://composingprograms.com/", by: "John DeNero (UC Berkeley)", type: "Book" }
  ],
  "dsa": [
    { t: "NeetCode roadmap (free problem list + videos)", u: "https://neetcode.io/roadmap", by: "NeetCode", type: "Practice" },
    { t: "Introduction to Algorithms (6.006)", u: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", by: "MIT OpenCourseWare", type: "Course" },
    { t: "Algorithms", u: "https://jeffe.cs.illinois.edu/teaching/algorithms/", by: "Jeff Erickson", type: "Book" },
    { t: "VisuAlgo (animated data structures)", u: "https://visualgo.net/en", by: "NUS", type: "Guide" }
  ],
  "debugging": [
    { t: "The Debugging Book", u: "https://www.debuggingbook.org/", by: "Andreas Zeller", type: "Book" },
    { t: "pdb, the Python debugger", u: "https://docs.python.org/3/library/pdb.html", by: "Python docs", type: "Docs" },
    { t: "Debugging in VS Code", u: "https://code.visualstudio.com/docs/debugtest/debugging", by: "Visual Studio Code docs", type: "Docs" }
  ],
  "testing": [
    { t: "Get started with pytest", u: "https://docs.pytest.org/en/stable/getting-started.html", by: "pytest docs", type: "Docs" },
    { t: "Obey the Testing Goat (TDD with Python)", u: "https://www.obeythetestinggoat.com/", by: "Harry Percival", type: "Book" },
    { t: "unittest.mock", u: "https://docs.python.org/3/library/unittest.mock.html", by: "Python docs", type: "Docs" }
  ],
  "api": [
    { t: "An overview of HTTP", u: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview", by: "MDN", type: "Docs" },
    { t: "Requests quickstart", u: "https://requests.readthedocs.io/en/latest/user/quickstart/", by: "Requests docs", type: "Docs" },
    { t: "Using pagination in the REST API", u: "https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api", by: "GitHub Docs", type: "Docs" }
  ],
  "api-build": [
    { t: "FastAPI tutorial", u: "https://fastapi.tiangolo.com/tutorial/", by: "FastAPI docs", type: "Docs" },
    { t: "Flask tutorial", u: "https://flask.palletsprojects.com/en/stable/tutorial/", by: "Flask docs", type: "Docs" },
    { t: "Writing your first Django app", u: "https://docs.djangoproject.com/en/stable/intro/tutorial01/", by: "Django docs", type: "Docs" },
    { t: "HTTP response status codes", u: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status", by: "MDN", type: "Docs" }
  ],
  "async": [
    { t: "asyncio documentation", u: "https://docs.python.org/3/library/asyncio.html", by: "Python docs", type: "Docs" },
    { t: "Async IO in Python: a complete walkthrough", u: "https://realpython.com/async-io-python/", by: "Real Python", type: "Guide" },
    { t: "concurrent.futures (threads and processes)", u: "https://docs.python.org/3/library/concurrent.futures.html", by: "Python docs", type: "Docs" }
  ],
  "c-cpp": [
    { t: "Beej's Guide to C Programming", u: "https://beej.us/guide/bgc/", by: "Brian “Beej” Hall", type: "Book" },
    { t: "Learn C++", u: "https://www.learncpp.com/", by: "LearnCpp.com", type: "Course" },
    { t: "CS50x: memory, pointers and C", u: "https://cs50.harvard.edu/x/", by: "Harvard", type: "Course" },
    { t: "AddressSanitizer", u: "https://clang.llvm.org/docs/AddressSanitizer.html", by: "Clang docs", type: "Docs" }
  ],
  "os-concepts": [
    { t: "Operating Systems: Three Easy Pieces", u: "https://pages.cs.wisc.edu/~remzi/OSTEP/", by: "Arpaci-Dusseau (UW–Madison)", type: "Book" },
    { t: "Operating System Engineering (6.1810, xv6 labs)", u: "https://pdos.csail.mit.edu/6.1810/", by: "MIT", type: "Course" },
    { t: "The Missing Semester of Your CS Education", u: "https://missing.csail.mit.edu/", by: "MIT", type: "Course" }
  ],

  // ---------------------------------------------------------------- tools
  "git": [
    { t: "Pro Git (full book)", u: "https://git-scm.com/book/en/v2", by: "Scott Chacon & Ben Straub", type: "Book" },
    { t: "Learn Git Branching (visual practice)", u: "https://learngitbranching.js.org/", by: "Peter Cottle", type: "Practice" },
    { t: "GitHub Skills courses", u: "https://skills.github.com/", by: "GitHub", type: "Course" }
  ],
  "cli": [
    { t: "The Missing Semester of Your CS Education", u: "https://missing.csail.mit.edu/", by: "MIT", type: "Course" },
    { t: "The Linux Command Line (free book)", u: "https://linuxcommand.org/tlcl.php", by: "William Shotts", type: "Book" },
    { t: "Bandit (learn the shell by playing)", u: "https://overthewire.org/wargames/bandit/", by: "OverTheWire", type: "Practice" }
  ],
  "ci-cd": [
    { t: "GitHub Actions documentation", u: "https://docs.github.com/en/actions", by: "GitHub Docs", type: "Docs" },
    { t: "GitHub Skills: Actions courses", u: "https://skills.github.com/", by: "GitHub", type: "Course" },
    { t: "Get started with GitLab CI/CD", u: "https://docs.gitlab.com/ci/", by: "GitLab docs", type: "Docs" }
  ],
  "docker": [
    { t: "Docker: Get started", u: "https://docs.docker.com/get-started/", by: "Docker docs", type: "Docs" },
    { t: "Building best practices", u: "https://docs.docker.com/build/building/best-practices/", by: "Docker docs", type: "Docs" },
    { t: "Play with Docker (browser sandbox)", u: "https://labs.play-with-docker.com/", by: "Docker", type: "Practice", note: "Free Docker account" }
  ],
  "kubernetes": [
    { t: "Learn Kubernetes basics", u: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", by: "Kubernetes docs", type: "Docs" },
    { t: "Kubernetes the Hard Way", u: "https://github.com/kelseyhightower/kubernetes-the-hard-way", by: "Kelsey Hightower", type: "Guide" },
    { t: "Interactive Kubernetes scenarios", u: "https://killercoda.com/", by: "Killercoda", type: "Practice" }
  ],
  "iac": [
    { t: "Terraform tutorials", u: "https://developer.hashicorp.com/terraform/tutorials", by: "HashiCorp", type: "Course" },
    { t: "Terraform language documentation", u: "https://developer.hashicorp.com/terraform/language", by: "HashiCorp", type: "Docs" },
    { t: "Refactoring with moved blocks", u: "https://developer.hashicorp.com/terraform/language/modules/develop/refactoring", by: "HashiCorp", type: "Docs" }
  ],
  "cloud": [
    { t: "AWS Skill Builder (free digital courses)", u: "https://skillbuilder.aws/", by: "Amazon Web Services", type: "Course", note: "Free account" },
    { t: "Azure Fundamentals learning path", u: "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/", by: "Microsoft Learn", type: "Course" },
    { t: "Google Skills (formerly Cloud Skills Boost)", u: "https://www.skills.google/", by: "Google Cloud", type: "Course", note: "Some labs need credits" },
    { t: "IAM security best practices", u: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html", by: "AWS docs", type: "Docs" }
  ],
  "networking": [
    { t: "Cloudflare Learning Center (DNS, TCP, TLS, HTTP)", u: "https://www.cloudflare.com/learning/", by: "Cloudflare", type: "Guide" },
    { t: "High Performance Browser Networking", u: "https://hpbn.co/", by: "Ilya Grigorik", type: "Book" },
    { t: "Beej's Guide to Network Programming", u: "https://beej.us/guide/bgnet/", by: "Brian “Beej” Hall", type: "Book" }
  ],
  "observability": [
    { t: "Monitoring distributed systems (SRE book)", u: "https://sre.google/sre-book/monitoring-distributed-systems/", by: "Google", type: "Book" },
    { t: "Implementing SLOs (SRE workbook)", u: "https://sre.google/workbook/implementing-slos/", by: "Google", type: "Book" },
    { t: "Prometheus: getting started", u: "https://prometheus.io/docs/prometheus/latest/getting_started/", by: "Prometheus docs", type: "Docs" },
    { t: "OpenTelemetry documentation", u: "https://opentelemetry.io/docs/", by: "OpenTelemetry", type: "Docs" }
  ],
  "incident-response": [
    { t: "Incident Response documentation", u: "https://response.pagerduty.com/", by: "PagerDuty", type: "Guide" },
    { t: "Managing incidents (SRE book)", u: "https://sre.google/sre-book/managing-incidents/", by: "Google", type: "Book" },
    { t: "Postmortem culture (SRE book)", u: "https://sre.google/sre-book/postmortem-culture/", by: "Google", type: "Book" }
  ],
  "system-design": [
    { t: "The System Design Primer", u: "https://github.com/donnemartin/system-design-primer", by: "Donne Martin", type: "Guide" },
    { t: "Distributed Systems (6.5840)", u: "https://pdos.csail.mit.edu/6.824/", by: "MIT", type: "Course" },
    { t: "Site Reliability Engineering (full book)", u: "https://sre.google/sre-book/table-of-contents/", by: "Google", type: "Book" }
  ],
  "test-automation": [
    { t: "Playwright: getting started", u: "https://playwright.dev/docs/intro", by: "Playwright docs", type: "Docs" },
    { t: "Test Automation University", u: "https://testautomationu.applitools.com/", by: "Applitools", type: "Course", note: "Free account" },
    { t: "Cypress documentation", u: "https://docs.cypress.io/", by: "Cypress", type: "Docs" }
  ],

  // ---------------------------------------------------------------- web & mobile
  "html-css": [
    { t: "Learn web development", u: "https://developer.mozilla.org/en-US/docs/Learn_web_development", by: "MDN", type: "Course" },
    { t: "Learn CSS", u: "https://web.dev/learn/css", by: "web.dev (Google)", type: "Course" },
    { t: "Flexbox Froggy", u: "https://flexboxfroggy.com/", by: "Codepip", type: "Practice" },
    { t: "Grid Garden", u: "https://cssgridgarden.com/", by: "Codepip", type: "Practice" }
  ],
  "javascript": [
    { t: "The Modern JavaScript Tutorial", u: "https://javascript.info/", by: "javascript.info", type: "Course" },
    { t: "Eloquent JavaScript", u: "https://eloquentjavascript.net/", by: "Marijn Haverbeke", type: "Book" },
    { t: "The TypeScript Handbook", u: "https://www.typescriptlang.org/docs/handbook/intro.html", by: "TypeScript docs", type: "Docs" }
  ],
  "react": [
    { t: "Learn React", u: "https://react.dev/learn", by: "React docs", type: "Docs" },
    { t: "You Might Not Need an Effect", u: "https://react.dev/learn/you-might-not-need-an-effect", by: "React docs", type: "Docs" },
    { t: "Full Stack Open", u: "https://fullstackopen.com/en/", by: "University of Helsinki", type: "Course" }
  ],
  "accessibility": [
    { t: "Learn Accessibility", u: "https://web.dev/learn/accessibility", by: "web.dev (Google)", type: "Course" },
    { t: "Web accessibility tutorials", u: "https://www.w3.org/WAI/tutorials/", by: "W3C WAI", type: "Guide" },
    { t: "ARIA Authoring Practices Guide", u: "https://www.w3.org/WAI/ARIA/apg/", by: "W3C WAI", type: "Docs" }
  ],
  "web-perf": [
    { t: "Learn Performance", u: "https://web.dev/learn/performance", by: "web.dev (Google)", type: "Course" },
    { t: "Core Web Vitals", u: "https://web.dev/articles/vitals", by: "web.dev (Google)", type: "Guide" },
    { t: "Analyze runtime performance in DevTools", u: "https://developer.chrome.com/docs/devtools/performance", by: "Chrome for Developers", type: "Docs" }
  ],
  "mobile-native": [
    { t: "The Swift Programming Language", u: "https://docs.swift.org/latest/documentation/the-swift-programming-language/", by: "Swift.org", type: "Book" },
    { t: "SwiftUI tutorials", u: "https://developer.apple.com/tutorials/swiftui", by: "Apple", type: "Course" },
    { t: "Android Basics with Compose", u: "https://developer.android.com/courses/android-basics-compose/course", by: "Google", type: "Course" },
    { t: "Stanford CS193p: Developing Apps for iOS", u: "https://cs193p.stanford.edu/", by: "Stanford", type: "Course" }
  ],
  "mobile-arch": [
    { t: "Guide to app architecture", u: "https://developer.android.com/topic/architecture", by: "Android Developers", type: "Docs" },
    { t: "Now in Android (reference app)", u: "https://github.com/android/nowinandroid", by: "Google", type: "Guide" },
    { t: "Managing model data in your app (SwiftUI)", u: "https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app", by: "Apple", type: "Docs" }
  ],

  // ---------------------------------------------------------------- machine learning & AI
  "linear-algebra": [
    { t: "Essence of Linear Algebra", u: "https://www.3blue1brown.com/?topic=linear-algebra", by: "3Blue1Brown", type: "Video" },
    { t: "Mathematics for Machine Learning", u: "https://mml-book.github.io/", by: "Deisenroth, Faisal & Ong", type: "Book" },
    { t: "Linear Algebra (18.06)", u: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", by: "MIT OpenCourseWare", type: "Course" },
    { t: "Neural networks and backpropagation", u: "https://www.3blue1brown.com/?topic=neural-networks", by: "3Blue1Brown", type: "Video" }
  ],
  "sklearn": [
    { t: "Machine Learning Crash Course", u: "https://developers.google.com/machine-learning/crash-course", by: "Google", type: "Course" },
    { t: "Intro to Machine Learning", u: "https://www.kaggle.com/learn/intro-to-machine-learning", by: "Kaggle Learn", type: "Course" },
    { t: "scikit-learn: getting started", u: "https://scikit-learn.org/stable/getting_started.html", by: "scikit-learn docs", type: "Docs" },
    { t: "Common pitfalls (data leakage)", u: "https://scikit-learn.org/stable/common_pitfalls.html", by: "scikit-learn docs", type: "Docs" }
  ],
  "model-eval": [
    { t: "Metrics and scoring", u: "https://scikit-learn.org/stable/modules/model_evaluation.html", by: "scikit-learn docs", type: "Docs" },
    { t: "Cross-validation", u: "https://scikit-learn.org/stable/modules/cross_validation.html", by: "scikit-learn docs", type: "Docs" },
    { t: "Classification: accuracy, precision, recall", u: "https://developers.google.com/machine-learning/crash-course/classification", by: "Google", type: "Course" }
  ],
  "feature-eng": [
    { t: "Feature Engineering micro-course", u: "https://www.kaggle.com/learn/feature-engineering", by: "Kaggle Learn", type: "Course" },
    { t: "Preprocessing data", u: "https://scikit-learn.org/stable/modules/preprocessing.html", by: "scikit-learn docs", type: "Docs" }
  ],
  "deep-learning": [
    { t: "Practical Deep Learning for Coders", u: "https://course.fast.ai/", by: "fast.ai", type: "Course" },
    { t: "Neural Networks: Zero to Hero", u: "https://karpathy.ai/zero-to-hero.html", by: "Andrej Karpathy", type: "Video" },
    { t: "Dive into Deep Learning", u: "https://d2l.ai/", by: "d2l.ai", type: "Book" },
    { t: "PyTorch tutorials", u: "https://docs.pytorch.org/tutorials/", by: "PyTorch docs", type: "Docs" }
  ],
  "mlops": [
    { t: "Made With ML", u: "https://madewithml.com/", by: "Goku Mohandas", type: "Course" },
    { t: "MLOps Zoomcamp", u: "https://github.com/DataTalksClub/mlops-zoomcamp", by: "DataTalks.Club", type: "Course" },
    { t: "Rules of Machine Learning", u: "https://developers.google.com/machine-learning/guides/rules-of-ml", by: "Google", type: "Guide" }
  ],
  "llm-apps": [
    { t: "Prompt engineering interactive tutorial", u: "https://github.com/anthropics/prompt-eng-interactive-tutorial", by: "Anthropic", type: "Course" },
    { t: "Prompt engineering overview", u: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview", by: "Anthropic docs", type: "Docs" },
    { t: "OpenAI Cookbook", u: "https://developers.openai.com/cookbook", by: "OpenAI", type: "Guide" },
    { t: "OWASP Top 10 for LLM applications", u: "https://genai.owasp.org/", by: "OWASP", type: "Guide" }
  ],
  "rag": [
    { t: "Introducing Contextual Retrieval", u: "https://www.anthropic.com/research/contextual-retrieval", by: "Anthropic", type: "Guide" },
    { t: "Pinecone Learn (vector search and RAG)", u: "https://www.pinecone.io/learn/", by: "Pinecone", type: "Guide" },
    { t: "Hugging Face LLM course", u: "https://huggingface.co/learn/llm-course/chapter1/1", by: "Hugging Face", type: "Course" }
  ],
  "llm-evals": [
    { t: "Your AI product needs evals", u: "https://hamel.dev/blog/posts/evals/", by: "Hamel Husain", type: "Guide" },
    { t: "Define success criteria and build evaluations", u: "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests", by: "Anthropic docs", type: "Docs" },
    { t: "OpenAI Evals (open-source framework)", u: "https://github.com/openai/evals", by: "OpenAI", type: "Guide" }
  ],

  // ---------------------------------------------------------------- security
  "appsec": [
    { t: "Web Security Academy (free labs)", u: "https://portswigger.net/web-security", by: "PortSwigger", type: "Practice", note: "Free account" },
    { t: "OWASP Top 10", u: "https://top10.owasp.org/", by: "OWASP", type: "Guide" },
    { t: "OWASP Cheat Sheet Series", u: "https://cheatsheetseries.owasp.org/", by: "OWASP", type: "Docs" },
    { t: "OWASP Juice Shop (vulnerable practice app)", u: "https://owasp.org/projects/juice-shop", by: "OWASP", type: "Practice" }
  ],
  "threat-modeling": [
    { t: "Threat Modeling Cheat Sheet", u: "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html", by: "OWASP", type: "Guide" },
    { t: "Threat Modeling Manifesto", u: "https://www.threatmodelingmanifesto.org/", by: "Threat Modeling Manifesto group", type: "Guide" },
    { t: "Microsoft Threat Modeling Tool (STRIDE)", u: "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool", by: "Microsoft Learn", type: "Docs" }
  ],
  "detection": [
    { t: "MITRE ATT&CK", u: "https://attack.mitre.org/", by: "MITRE", type: "Guide" },
    { t: "Sigma detection rules", u: "https://github.com/SigmaHQ/sigma", by: "SigmaHQ", type: "Guide" },
    { t: "Boss of the SOC v3 dataset", u: "https://github.com/splunk/botsv3", by: "Splunk", type: "Practice" },
    { t: "Elastic detection rules", u: "https://github.com/elastic/detection-rules", by: "Elastic", type: "Guide" }
  ],

  // ---------------------------------------------------------------- embedded
  "embedded-hw": [
    { t: "Modern Embedded Systems Programming (video course)", u: "https://www.state-machine.com/video-course", by: "Quantum Leaps", type: "Video" },
    { t: "Interrupt (embedded engineering blog)", u: "https://interrupt.memfault.com/", by: "Memfault", type: "Guide" },
    { t: "Raspberry Pi Pico C/C++ SDK documentation", u: "https://www.raspberrypi.com/documentation/microcontrollers/c_sdk.html", by: "Raspberry Pi", type: "Docs" }
  ],
  "rtos": [
    { t: "FreeRTOS documentation and kernel book", u: "https://www.freertos.org/Documentation/00-Overview", by: "FreeRTOS", type: "Docs" },
    { t: "Zephyr getting started guide", u: "https://docs.zephyrproject.org/latest/develop/getting_started/index.html", by: "Zephyr Project", type: "Docs" },
    { t: "Modern Embedded Systems Programming (RTOS lessons)", u: "https://www.state-machine.com/video-course", by: "Quantum Leaps", type: "Video" }
  ],

  // ---------------------------------------------------------------- communication
  "storytelling": [
    { t: "Technical Writing courses", u: "https://developers.google.com/tech-writing", by: "Google", type: "Course" },
    { t: "Telling a story and making a point", u: "https://clauswilke.com/dataviz/telling-a-story.html", by: "Claus O. Wilke", type: "Book" },
    { t: "Storytelling with data blog", u: "https://www.storytellingwithdata.com/blog", by: "Storytelling with Data", type: "Guide" }
  ],

  // ---------------------------------------------------------------- extra languages & tools
  "Java": [
    { t: "Learn Java", u: "https://dev.java/learn/", by: "Oracle (dev.java)", type: "Docs" },
    { t: "Java Programming MOOC", u: "https://java-programming.mooc.fi/", by: "University of Helsinki", type: "Course" }
  ],
  "Go": [
    { t: "A Tour of Go", u: "https://go.dev/tour/", by: "Go team", type: "Course" },
    { t: "Go by Example", u: "https://gobyexample.com/", by: "Mark McGranaghan", type: "Guide" }
  ],
  "Rust": [
    { t: "The Rust Programming Language", u: "https://doc.rust-lang.org/book/", by: "Rust project", type: "Book" },
    { t: "Rustlings exercises", u: "https://github.com/rust-lang/rustlings", by: "Rust project", type: "Practice" }
  ],
  "C# / .NET": [
    { t: "C# documentation and tutorials", u: "https://learn.microsoft.com/en-us/dotnet/csharp/", by: "Microsoft Learn", type: "Docs" },
    { t: "ASP.NET Core tutorials", u: "https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api", by: "Microsoft Learn", type: "Docs" }
  ],
  "Ruby / Rails": [
    { t: "Ruby in Twenty Minutes", u: "https://www.ruby-lang.org/en/documentation/quickstart/", by: "ruby-lang.org", type: "Docs" },
    { t: "Rails Guides: getting started", u: "https://guides.rubyonrails.org/getting_started.html", by: "Ruby on Rails", type: "Docs" }
  ],
  "Scala": [
    { t: "Tour of Scala", u: "https://docs.scala-lang.org/tour/tour-of-scala.html", by: "Scala docs", type: "Docs" },
    { t: "Scala 3 Book", u: "https://docs.scala-lang.org/scala3/book/introduction.html", by: "Scala docs", type: "Book" }
  ],
  "GraphQL": [
    { t: "Learn GraphQL", u: "https://graphql.org/learn/", by: "GraphQL Foundation", type: "Docs" },
    { t: "DataLoader (batching to avoid N+1)", u: "https://github.com/graphql/dataloader", by: "GraphQL Foundation", type: "Guide" }
  ],
  "Kafka": [
    { t: "Apache Kafka quickstart", u: "https://kafka.apache.org/quickstart", by: "Apache Kafka docs", type: "Docs" },
    { t: "Confluent Developer courses", u: "https://developer.confluent.io/courses/", by: "Confluent", type: "Course" }
  ],
  "Snowflake": [
    { t: "Snowflake developer guides (quickstarts)", u: "https://www.snowflake.com/en/developers/guides/", by: "Snowflake", type: "Course", note: "Free trial account" },
    { t: "Snowflake documentation", u: "https://docs.snowflake.com/en/", by: "Snowflake", type: "Docs" }
  ],
  "BigQuery": [
    { t: "BigQuery sandbox (free, no credit card)", u: "https://docs.cloud.google.com/bigquery/docs/sandbox", by: "Google Cloud", type: "Docs" },
    { t: "BigQuery public datasets", u: "https://docs.cloud.google.com/bigquery/public-data", by: "Google Cloud", type: "Practice" }
  ],
  "Redshift": [
    { t: "Amazon Redshift getting started guide", u: "https://docs.aws.amazon.com/redshift/latest/gsg/new-user-serverless.html", by: "AWS docs", type: "Docs" },
    { t: "Distribution styles", u: "https://docs.aws.amazon.com/redshift/latest/dg/c_choosing_dist_sort.html", by: "AWS docs", type: "Docs" }
  ],
  "dbt": [
    { t: "dbt Fundamentals", u: "https://learn.getdbt.com/courses/dbt-fundamentals", by: "dbt Labs", type: "Course", note: "Free account" },
    { t: "dbt documentation", u: "https://docs.getdbt.com/docs/introduction", by: "dbt Labs", type: "Docs" }
  ],
  "NoSQL": [
    { t: "MongoDB University", u: "https://learn.mongodb.com/", by: "MongoDB", type: "Course", note: "Free account" },
    { t: "DynamoDB best practices", u: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html", by: "AWS docs", type: "Docs" },
    { t: "Redis University", u: "https://university.redis.io/", by: "Redis", type: "Course", note: "Free account" }
  ]
};
