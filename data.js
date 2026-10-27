// Mock dataset — self-contained, no backend required.
// Each skill: reqs (from mocked job descriptions), freq (% of sampled postings),
// risk (how easily students fake it with AI), trap, flags, challenge.

window.SKILLS = {
  "sql-basics": {
    title: "SQL Querying", category: "Data", risk: "medium", freq: 91,
    reqs: [
      "Write SELECT queries with WHERE, GROUP BY, HAVING and ORDER BY against production tables",
      "Aggregate with COUNT / SUM / AVG and explain why NULLs change the result",
      "Read an unfamiliar schema and find the right table without hand-holding"
    ],
    jd: "Comfortable writing SQL to pull and aggregate data from our warehouse without engineering support.",
    trap: "Students paste a plain-English question into ChatGPT, run whatever comes back, and accept the first result that doesn't error. The query runs, but nobody checked whether GROUP BY collapsed rows incorrectly or whether NULLs silently dropped records.",
    flags: [
      "You can't say out loud why a column must be in GROUP BY",
      "You've never checked a result's row count against the source table"
    ],
    challenge: {
      title: "The NULL Audit",
      time: 20,
      prompt: "On paper, given an `orders(id, customer_id, amount, coupon_code)` table where 30% of coupon_code values are NULL: write a query that returns the share of orders that used a coupon, and the average amount for coupon vs. non-coupon orders. Then predict the exact output of `SELECT COUNT(coupon_code), COUNT(*) FROM orders` for a 10-row sample you invent.",
      criteria: [
        "Your coupon-share query handles NULLs correctly (no WHERE coupon_code != NULL)",
        "You predicted both COUNT values correctly before running anything",
        "You can explain HAVING vs. WHERE with an example of your own"
      ]
    }
  },
  "sql-joins": {
    title: "SQL Joins", category: "Data", risk: "high", freq: 84,
    reqs: [
      "Combine 3+ tables with INNER, LEFT and anti-joins to answer business questions",
      "Detect and fix row fan-out caused by one-to-many joins",
      "Reconcile totals across joined vs. unjoined data"
    ],
    jd: "Strong SQL skills including complex joins across multiple data sources.",
    trap: "AI writes joins that look right and run fine — but a one-to-many join quietly duplicates rows and inflates revenue by 40%. Students who prompted their way through join homework never built the instinct to ask \"what's the grain of this table?\"",
    flags: [
      "You pick LEFT vs. INNER by trial and error",
      "You've never used COUNT(DISTINCT) to check for fan-out after a join"
    ],
    challenge: {
      title: "Whiteboard the Fan-Out",
      time: 25,
      prompt: "Draw three tiny tables by hand: `customers` (4 rows), `orders` (6 rows), `payments` (8 rows, some orders split into 2 payments). Write a query for total revenue per customer that joins all three. Compute the result BY HAND, find where the payment split inflates totals, then fix it.",
      criteria: [
        "Your hand-computed output matches what the query would really return",
        "You identified the duplicated rows and explained why they appear",
        "Your fix uses pre-aggregation or a subquery — not DISTINCT on amounts"
      ]
    }
  },
  "sql-window": {
    title: "Window Functions & CTEs", category: "Data", risk: "high", freq: 58,
    reqs: [
      "Use ROW_NUMBER, RANK, LAG/LEAD and running totals with PARTITION BY",
      "Structure multi-step logic with readable CTEs",
      "Solve 'top N per group' and 'month-over-month change' problems"
    ],
    jd: "Experience with advanced SQL (window functions, CTEs) for cohort and retention analysis.",
    trap: "Window functions are the #1 thing students copy from AI because the syntax is unintuitive. The result: they can produce a running total but can't predict what changes when ORDER BY is removed from the OVER clause.",
    flags: [
      "You can't explain the difference between RANK and DENSE_RANK without looking it up",
      "You've never written a window function from a blank editor"
    ],
    challenge: {
      title: "Predict the Window",
      time: 20,
      prompt: "Given a 6-row `sales(rep, month, amount)` table you write out by hand, predict — on paper, before running — the output of: (1) SUM(amount) OVER (PARTITION BY rep ORDER BY month), (2) the same without ORDER BY, (3) LAG(amount) OVER (PARTITION BY rep ORDER BY month). Then write a query for each rep's best month.",
      criteria: [
        "All three predicted outputs are correct, including NULLs from LAG",
        "Your 'best month' query handles ties deliberately",
        "You wrote it as a CTE and can justify each step"
      ]
    }
  },
  "excel": {
    title: "Spreadsheets & Pivot Tables", category: "Tools", risk: "low", freq: 72,
    reqs: [
      "Build pivot tables, XLOOKUP/INDEX-MATCH and conditional aggregations",
      "Clean messy exports (dates, text numbers, duplicates) in-sheet",
      "Build a simple model stakeholders can audit cell by cell"
    ],
    jd: "Advanced Excel (pivot tables, lookups) — you'll be the go-to for ad-hoc analysis.",
    trap: "Copilot-in-Excel generates formulas students can't read. When a stakeholder asks \"why is this cell 0?\", they can't trace the logic — and a model nobody can audit is a model nobody trusts.",
    flags: [
      "You can't explain a nested formula you 'wrote' last week",
      "You don't know what an absolute ($A$1) reference is for"
    ],
    challenge: {
      title: "The Broken Model",
      time: 15,
      prompt: "Have a friend (or classmate) take a working spreadsheet of yours and secretly introduce 3 errors: a relative reference that should be absolute, a text-formatted number, and a lookup on an unsorted range. Find and fix all three with AI assistants turned off.",
      criteria: [
        "All 3 errors found in under 15 minutes",
        "You explained the root cause of each, not just the fix",
        "No AI or formula-explainer tools used"
      ]
    }
  },
  "python-core": {
    title: "Python Fundamentals", category: "Programming", risk: "high", freq: 88,
    reqs: [
      "Fluent with lists, dicts, sets, comprehensions and functions",
      "Read and modify other people's Python code",
      "Handle files, exceptions and simple scripts end to end"
    ],
    jd: "Proficiency in Python for scripting and data manipulation.",
    trap: "Copilot autocompletes whole functions as you type, so students feel fluent while never producing code from intent. The gap shows up in interviews: a blank editor and \"reverse the words in a sentence\" becomes a freeze.",
    flags: [
      "You start typing and wait for autocomplete to finish the thought",
      "You couldn't write a dict comprehension on a whiteboard"
    ],
    challenge: {
      title: "Blank-Editor Sprint",
      time: 30,
      prompt: "In a plain text editor with autocomplete OFF: (1) count word frequency in a text file and print the top 5, (2) group a list of (name, dept) tuples into a dict of dept → names, (3) write a function that flattens a nested list of any depth. Run them only after you've finished writing all three.",
      criteria: [
        "All three run correctly on the first or second attempt",
        "Finished within 30 minutes with no documentation lookups for basic syntax",
        "You can trace the recursion in (3) step by step aloud"
      ]
    }
  },
  "pandas": {
    title: "Pandas DataFrames", category: "Data", risk: "high", freq: 76,
    reqs: [
      "Filter, groupby, merge and reshape (pivot/melt) DataFrames",
      "Use vectorized operations instead of row loops",
      "Spot SettingWithCopy and index-alignment surprises"
    ],
    jd: "Hands-on experience with pandas / NumPy for data wrangling and exploratory analysis.",
    trap: "Pandas has many ways to do everything, and AI picks a random one each time. Students end up with notebooks of chained one-liners they can't modify — change the requirement slightly and they're back to prompting.",
    flags: [
      "Your notebooks mix .loc, .iloc, [] and .query with no reason",
      "You use .apply(lambda) for everything because that's what got generated"
    ],
    challenge: {
      title: "Groupby on Paper",
      time: 25,
      prompt: "Write an 8-row DataFrame by hand (columns: city, month, sales). On paper, predict the exact output shape and values of: df.groupby('city')['sales'].agg(['sum','mean']), df.pivot_table(index='city', columns='month', values='sales'), and a merge with a 3-row cities table where one city is missing. Then verify in Python.",
      criteria: [
        "Predicted shapes (rows × columns) correct for all three",
        "You correctly predicted the NaNs from the merge and the pivot",
        "You can rewrite one .apply() solution as a vectorized operation"
      ]
    }
  },
  "data-cleaning": {
    title: "Data Cleaning & Validation", category: "Data", risk: "medium", freq: 69,
    reqs: [
      "Handle missing values, duplicates, outliers and inconsistent categories",
      "Write validation checks (row counts, ranges, uniqueness) before analysis",
      "Document every cleaning decision and its effect on the data"
    ],
    jd: "Ensure data quality and integrity; identify and resolve data discrepancies.",
    trap: "\"Clean this dataset\" prompts produce code that drops NaNs and duplicates by default. Students accept it without asking how many rows were lost or whether the missingness itself was the signal.",
    flags: [
      "You can't say how many rows your cleaning step removed",
      "You've used dropna() without checking which columns drove it"
    ],
    challenge: {
      title: "The Cleaning Log",
      time: 30,
      prompt: "Take any messy public CSV (e.g., a city open-data export). Before writing any code, write a cleaning plan by hand: every issue you expect, how you'll detect it, and what you'll do. Then clean it and produce a log table: step → rows before → rows after → justification.",
      criteria: [
        "Your plan predicted at least 70% of the issues you actually found",
        "Every row lost is accounted for in the log",
        "At least one decision explains why you did NOT drop something"
      ]
    }
  },
  "stats": {
    title: "Statistics & A/B Testing", category: "Math", risk: "high", freq: 63,
    reqs: [
      "Choose and interpret mean/median, variance and distributions",
      "Run and interpret t-tests, confidence intervals and A/B tests",
      "Recognize sampling bias, Simpson's paradox and p-hacking"
    ],
    jd: "Solid understanding of statistics; experience designing and analyzing experiments.",
    trap: "AI will happily compute a p-value for anything. Students learn to report \"p < 0.05, significant!\" without knowing what the test assumed or what the number actually means — exactly what interviewers probe.",
    flags: [
      "You'd describe a p-value as 'the probability the result is true'",
      "You've never computed a confidence interval by hand"
    ],
    challenge: {
      title: "Explain It to a PM",
      time: 20,
      prompt: "An A/B test shows variant B converting at 5.4% vs. A's 5.0%, n = 4,000 per arm. On paper, without software: estimate whether this is significant (show the standard-error math), then write a 4-sentence explanation for a product manager — no jargon — of what you can and can't conclude.",
      criteria: [
        "Your standard-error calculation is within rounding of the correct value",
        "Your PM explanation makes no claim the test can't support",
        "You named one threat to validity (e.g., novelty effect, peeking)"
      ]
    }
  },
  "viz": {
    title: "Data Visualization", category: "Communication", risk: "medium", freq: 66,
    reqs: [
      "Pick the right chart for comparison, trend, distribution and composition",
      "Build clear charts in matplotlib/seaborn or Plotly",
      "Avoid misleading axes, clutter and color misuse"
    ],
    jd: "Ability to translate complex data into clear, compelling visualizations.",
    trap: "\"Make a chart of this\" yields a default plot — often a pie chart with 12 slices or a truncated y-axis. Students ship it because it looks finished, never learning why one chart type answers the question and another hides it.",
    flags: [
      "You choose chart types by what the AI produced first",
      "Your charts have default titles like 'Figure 1'"
    ],
    challenge: {
      title: "Sketch First",
      time: 15,
      prompt: "For three questions about one dataset (a trend, a comparison across 8 categories, a distribution), sketch the chart on paper first — axes, labels, title stating the takeaway. Only then build them. Finally, find one real chart online that misleads and redraw it honestly.",
      criteria: [
        "Every sketch's title states the insight, not the variables",
        "Your built charts match your sketches",
        "Your 'misleading chart' redraw fixes the specific distortion"
      ]
    }
  },
  "bi-tools": {
    title: "Power BI / Tableau Dashboards", category: "Tools", risk: "low", freq: 61,
    reqs: [
      "Connect to data sources and build interactive dashboards",
      "Design filters, drill-downs and KPI cards stakeholders actually use",
      "Manage refresh schedules and row-level security"
    ],
    jd: "Build and maintain dashboards in Power BI or Tableau for business stakeholders.",
    trap: "AI-generated dashboard specs and Copilot visuals let students produce something pretty without ever interviewing a user. The dashboard answers questions nobody asked.",
    flags: [
      "You built the dashboard before writing down who uses it and for what decision",
      "You can't explain how your data refreshes"
    ],
    challenge: {
      title: "The Stakeholder Interview",
      time: 45,
      prompt: "Interview one real person (a club treasurer, a manager at your part-time job) about a decision they make regularly. Write down 3 questions they need answered. Build a one-page dashboard that answers exactly those 3, then watch them use it without explaining it.",
      criteria: [
        "They answered all 3 questions unaided within 2 minutes",
        "Every visual on the page maps to one of the 3 questions",
        "You can describe the data refresh path end to end"
      ]
    }
  },
  "dax": {
    title: "DAX & Calculated Measures", category: "Tools", risk: "high", freq: 41,
    reqs: [
      "Write measures with CALCULATE, filter context and time intelligence",
      "Distinguish calculated columns from measures",
      "Debug totals that don't match row values"
    ],
    jd: "Proficiency in DAX for building calculated measures and KPIs.",
    trap: "DAX filter context is genuinely hard, so students paste errors into ChatGPT until a measure \"works\". When the grand total doesn't equal the sum of rows, they have no mental model to debug it.",
    flags: [
      "You can't explain row context vs. filter context",
      "Your measures work in one visual and break in another"
    ],
    challenge: {
      title: "Why Is the Total Wrong?",
      time: 25,
      prompt: "Build a tiny model (Sales, Date, Product). Write a 'Distinct customers' measure and a 'Sales YoY %' measure. Put both in a matrix by product and explain, in writing, why the grand total of distinct customers is NOT the sum of the rows. Then write a measure that does sum the rows.",
      criteria: [
        "Your written explanation correctly references filter context",
        "The YoY measure handles the first year (no prior data) gracefully",
        "Your 'sum of rows' measure uses SUMX/iterator logic you can explain"
      ]
    }
  },
  "data-modeling": {
    title: "Dimensional Modeling", category: "Data", risk: "medium", freq: 54,
    reqs: [
      "Design star schemas with fact and dimension tables",
      "Define table grain explicitly and handle slowly changing dimensions",
      "Balance normalization against query performance"
    ],
    jd: "Experience with data modeling concepts (star schema, Kimball) and warehouse design.",
    trap: "Ask an AI for 'a star schema for an e-commerce store' and you get a textbook diagram. Students memorize the shape without ever deciding a grain themselves — and grain is the whole skill.",
    flags: [
      "You can't state the grain of your fact table in one sentence",
      "You've never had to choose between SCD Type 1 and Type 2"
    ],
    challenge: {
      title: "Model a Real Business",
      time: 30,
      prompt: "Pick a business you know well (your gym, a coffee shop). On a whiteboard, design a star schema for its 3 most important questions. Declare the grain of each fact table, then handle this change: a product's category gets renamed mid-year and reports must show history correctly.",
      criteria: [
        "Each fact table has a one-sentence grain statement",
        "Every business question can be answered with your schema",
        "Your category-rename solution preserves historical reporting"
      ]
    }
  },
  "git": {
    title: "Git Version Control", category: "Tools", risk: "medium", freq: 79,
    reqs: [
      "Branch, commit, merge and open pull requests in a team workflow",
      "Resolve merge conflicts and recover from mistakes (reset, revert, reflog)",
      "Write meaningful commit messages and review others' PRs"
    ],
    jd: "Familiarity with Git and collaborative development workflows (PRs, code review).",
    trap: "Students ask AI for 'the command to fix this' and paste `git reset --hard` or `push --force` without understanding the state of their repo. It works until it destroys a teammate's work.",
    flags: [
      "You've never resolved a merge conflict without a GUI or AI help",
      "You can't draw what your branches look like right now"
    ],
    challenge: {
      title: "Conflict Drill",
      time: 20,
      prompt: "In a scratch repo: create two branches that edit the same lines of a file, merge them, and resolve the conflict by hand. Then make a bad commit, push it, and undo it safely (revert, not reset). Finally, 'lose' a commit with reset --hard and recover it with reflog. Draw the commit graph at each step.",
      criteria: [
        "Conflict resolved by editing markers directly",
        "You chose revert for the pushed commit and can say why",
        "You recovered the lost commit and your drawn graphs match `git log --graph`"
      ]
    }
  },
  "cli": {
    title: "Linux Command Line", category: "Tools", risk: "medium", freq: 57,
    reqs: [
      "Navigate, search and manipulate files with core shell commands",
      "Chain commands with pipes, redirects and grep/awk/sed",
      "Manage processes, permissions and environment variables"
    ],
    jd: "Comfortable working in a Linux environment and on the command line.",
    trap: "Shell one-liners from AI look like magic incantations. Students run `chmod -R 777` or long pipes they can't read, so they can't adapt them when the file format changes slightly.",
    flags: [
      "You copy shell commands you couldn't explain token by token",
      "You don't know what `|` vs `>` vs `>>` do"
    ],
    challenge: {
      title: "Log Detective",
      time: 20,
      prompt: "Given a web server access log (download a sample), use only the terminal and `man` pages to answer: the top 5 IP addresses by request count, how many 404s occurred, and which hour had the most traffic. Write each answer as a single pipeline.",
      criteria: [
        "All three answers correct",
        "Every flag in your pipelines can be explained without notes",
        "Only `man`/`--help` used for reference"
      ]
    }
  },
  "testing": {
    title: "Unit Testing (pytest)", category: "Programming", risk: "high", freq: 62,
    reqs: [
      "Write unit tests with pytest, fixtures and parametrization",
      "Test edge cases and failure paths, not just happy paths",
      "Use mocks for external dependencies"
    ],
    jd: "Write well-tested code; experience with pytest or similar frameworks.",
    trap: "AI generates tests from your implementation, so the tests verify whatever the code does — bugs included. Students get 100% coverage that would never catch a regression.",
    flags: [
      "Your tests were written after the code, by the same AI that wrote the code",
      "None of your tests have ever failed"
    ],
    challenge: {
      title: "Tests First, Bugs Found",
      time: 30,
      prompt: "Write the tests for a `parse_duration('1h30m') -> 5400` function BEFORE implementing it, by hand: at least 8 cases including invalid input. Then have a classmate write a buggy implementation with 2 planted bugs. Your tests must catch both.",
      criteria: [
        "At least 3 of your cases cover invalid or edge inputs",
        "Your suite caught both planted bugs",
        "You used parametrize instead of copy-pasted test functions"
      ]
    }
  },
  "oop": {
    title: "OOP & Clean Code", category: "Programming", risk: "medium", freq: 55,
    reqs: [
      "Design classes with clear responsibilities, composition over inheritance",
      "Refactor long functions into readable, testable units",
      "Follow PEP 8, type hints and meaningful naming"
    ],
    jd: "Write clean, maintainable, well-documented code following best practices.",
    trap: "AI produces plausible class hierarchies with abstract base classes and factories for a 50-line problem. Students learn that 'clean code' means more layers, not fewer, and can't justify any design choice.",
    flags: [
      "You can't say why a class exists rather than a function",
      "Your designs use inheritance where you can't name the 'is-a' relationship"
    ],
    challenge: {
      title: "Refactor Under Review",
      time: 30,
      prompt: "Take a 100+ line script you wrote months ago. Without AI, refactor it into small functions or classes. Then present it to a peer: for every class or function, give one sentence on why it exists. Your peer removes anything you can't justify.",
      criteria: [
        "Behavior unchanged (same output before and after)",
        "Every unit survived your peer's 'justify it' review",
        "No function longer than ~25 lines"
      ]
    }
  },
  "api": {
    title: "API Integration", category: "Programming", risk: "high", freq: 67,
    reqs: [
      "Consume REST APIs: auth headers, pagination, query params",
      "Handle rate limits, retries, timeouts and error codes",
      "Parse and validate JSON responses"
    ],
    jd: "Experience integrating with third-party REST APIs.",
    trap: "AI writes a `requests.get()` call that works on the first page of data. Students never discover pagination, never handle a 429, and never set a timeout — until the script hangs in production.",
    flags: [
      "Your API code has no timeout or retry logic",
      "You've only ever fetched the first page of results"
    ],
    challenge: {
      title: "Read the Docs, Not the Bot",
      time: 40,
      prompt: "Pick a public API (e.g., GitHub, Open-Meteo). Using ONLY its official documentation: fetch all pages of a paginated endpoint, handle a 404 and a 429 gracefully, set a timeout, and save the results to CSV. Write a short note on how the API's pagination works.",
      criteria: [
        "All pages fetched (verified against the API's reported total)",
        "Errors handled with clear messages, not crashes",
        "Your pagination note matches the docs exactly"
      ]
    }
  },
  "api-build": {
    title: "Building APIs (FastAPI/Flask)", category: "Programming", risk: "high", freq: 52,
    reqs: [
      "Design REST endpoints with correct verbs, status codes and validation",
      "Implement auth, error handling and input validation",
      "Document endpoints (OpenAPI) and write integration tests"
    ],
    jd: "Build and maintain RESTful services in Python (FastAPI, Flask or Django).",
    trap: "\"Build me a FastAPI CRUD app\" yields a working app in seconds. Students demo it without knowing why it returns 200 instead of 201, or what happens when two requests update the same record.",
    flags: [
      "You can't list which status codes your API returns and when",
      "You've never sent your API malformed input on purpose"
    ],
    challenge: {
      title: "Design Before Code",
      time: 45,
      prompt: "On paper, design a 'library loans' API: endpoints, methods, request/response shapes, and status codes for every error case (book unavailable, user not found, invalid date). Then implement it with docs only. Finally, try to break it with 5 malicious or malformed requests.",
      criteria: [
        "Implementation matches your paper design",
        "Every error case returns the status code you designed",
        "None of your 5 attack requests causes a 500"
      ]
    }
  },
  "dsa": {
    title: "Data Structures & Algorithms", category: "Programming", risk: "high", freq: 48,
    reqs: [
      "Choose appropriate structures: hash maps, stacks, queues, heaps, trees",
      "Analyze time and space complexity in Big-O",
      "Solve standard interview problems under time pressure"
    ],
    jd: "Strong CS fundamentals including data structures, algorithms and complexity.",
    trap: "LeetCode + AI = solved problems with zero retained skill. Students 'practice' 200 problems by reading AI solutions, then can't solve a medium problem in a live interview where AI is unavailable.",
    flags: [
      "You read the solution after 5 minutes of being stuck",
      "You can't state the complexity of your own solution"
    ],
    challenge: {
      title: "Whiteboard Mock Interview",
      time: 45,
      prompt: "Have a peer pick 2 unseen medium problems (e.g., 'merge overlapping intervals', 'LRU cache'). Solve each on a whiteboard while thinking aloud: clarify, brute force, optimize, state complexity, then code. No IDE, no hints for the first 20 minutes.",
      criteria: [
        "Reached a working solution for at least one problem unaided",
        "Stated correct time and space complexity for both",
        "Narrated your reasoning continuously (peer confirms)"
      ]
    }
  },
  "debugging": {
    title: "Debugging & Reading Tracebacks", category: "Programming", risk: "high", freq: 50,
    reqs: [
      "Read stack traces and isolate root causes",
      "Use a debugger (breakpoints, stepping, inspecting state)",
      "Reproduce bugs with minimal failing examples"
    ],
    jd: "Strong problem-solving and debugging skills; able to troubleshoot independently.",
    trap: "Paste error → paste fix → repeat. Students who debug this way never form hypotheses. When the AI's fix doesn't work, they're stuck in a loop of increasingly random changes.",
    flags: [
      "Your first move on any error is to paste it into a chatbot",
      "You've never set a breakpoint"
    ],
    challenge: {
      title: "Hypothesis Log",
      time: 30,
      prompt: "Have a peer plant a subtle bug in your code (off-by-one, mutable default argument, or shadowed variable). Debug it using only print statements and a debugger. Keep a written log: hypothesis → test → result, for every step.",
      criteria: [
        "Bug found and fixed without AI",
        "Log has at least 3 hypothesis → test → result entries",
        "You produced a minimal reproduction in 10 lines or fewer"
      ]
    }
  },
  "etl": {
    title: "ETL/ELT Pipelines", category: "Data Engineering", risk: "medium", freq: 77,
    reqs: [
      "Build batch pipelines that extract, transform and load data reliably",
      "Make pipelines idempotent and safe to re-run",
      "Implement incremental loads and data quality checks"
    ],
    jd: "Design, build and maintain scalable ETL/ELT pipelines.",
    trap: "AI-written pipelines work once on a happy-path sample. Students never consider what happens when the job runs twice, a file arrives late, or the schema changes — the things that actually page you at 3am.",
    flags: [
      "Running your pipeline twice would duplicate the data",
      "You have no check that fails loudly when input looks wrong"
    ],
    challenge: {
      title: "Run It Twice",
      time: 45,
      prompt: "Build a pipeline that loads a daily CSV into a database table. Then: run it twice on the same day (no duplicates allowed), feed it a file with a new unexpected column, and feed it a file with 0 rows. Design the behavior for each case on paper first.",
      criteria: [
        "Double-run produces identical table state (idempotent)",
        "Schema change and empty file are handled per your design",
        "A row-count or null-check fails the run when data is clearly wrong"
      ]
    }
  },
  "airflow": {
    title: "Workflow Orchestration (Airflow)", category: "Data Engineering", risk: "medium", freq: 46,
    reqs: [
      "Author DAGs with dependencies, schedules and retries",
      "Understand backfills, catchup and execution dates",
      "Monitor, alert and recover failed tasks"
    ],
    jd: "Experience with orchestration tools such as Airflow, Dagster or Prefect.",
    trap: "Generated DAGs look correct but students don't understand logical dates vs. run times. They backfill a month and accidentally process the same day 30 times.",
    flags: [
      "You can't explain why a DAG scheduled daily runs 'yesterday's' data",
      "You've never deliberately triggered a backfill"
    ],
    challenge: {
      title: "Timeline on Paper",
      time: 20,
      prompt: "For a DAG with `schedule='@daily'`, `start_date=Jan 1`, `catchup=True`, deployed on Jan 5 at noon: write out every run that will execute, with its logical date and the data interval it should process. Then change catchup to False and redo it.",
      criteria: [
        "Both timelines are exactly correct",
        "You explained data_interval_start/end in your own words",
        "You described how to safely re-run one failed day"
      ]
    }
  },
  "spark": {
    title: "Distributed Processing (Spark)", category: "Data Engineering", risk: "medium", freq: 44,
    reqs: [
      "Write PySpark transformations and understand lazy evaluation",
      "Diagnose shuffles, skew and partitioning issues",
      "Read the Spark UI to find bottlenecks"
    ],
    jd: "Experience with big data technologies such as Spark or Databricks.",
    trap: "AI converts pandas code to PySpark line by line. It runs — slowly — and students never learn why a groupBy triggers a shuffle or why one task takes 40 minutes while the others take 10 seconds.",
    flags: [
      "You don't know which of your operations are transformations vs. actions",
      "You've never opened the Spark UI"
    ],
    challenge: {
      title: "Count the Shuffles",
      time: 25,
      prompt: "Given a 10-line PySpark job (filter → join → groupBy → orderBy → write), mark on paper which lines are lazy, which trigger execution, and where shuffles occur. Run it and verify with the Spark UI. Then propose one change that removes a shuffle.",
      criteria: [
        "Correctly identified all actions and all shuffle boundaries",
        "Your Spark UI stage count matches your prediction",
        "Your optimization (e.g., broadcast join) measurably reduces runtime"
      ]
    }
  },
  "cloud": {
    title: "Cloud Fundamentals (AWS/GCP)", category: "Infrastructure", risk: "low", freq: 59,
    reqs: [
      "Use object storage, compute and managed databases",
      "Configure IAM roles with least privilege",
      "Estimate and control cost"
    ],
    jd: "Experience with cloud platforms (AWS, GCP or Azure).",
    trap: "Students follow AI-generated setup steps that grant admin permissions 'to make it work'. They end up with a running service and no idea who can access it or what it costs.",
    flags: [
      "Your IAM policies contain `*` and you don't know why",
      "You can't estimate what your project costs per month"
    ],
    challenge: {
      title: "Least Privilege",
      time: 30,
      prompt: "Deploy a function that reads from one storage bucket and writes to another. Write its IAM policy by hand from the provider's docs, granting only the exact actions on the exact resources. Prove it: show it cannot read the output bucket or delete anything.",
      criteria: [
        "Policy contains no wildcards on actions or resources",
        "Denied actions are demonstrated, not assumed",
        "You produced a monthly cost estimate with the pricing calculator"
      ]
    }
  },
  "docker": {
    title: "Docker & Containers", category: "Infrastructure", risk: "medium", freq: 53,
    reqs: [
      "Write Dockerfiles and understand layers and caching",
      "Use docker-compose for multi-service local setups",
      "Manage environment variables, volumes and networking"
    ],
    jd: "Experience with containerization (Docker) and CI/CD pipelines.",
    trap: "AI Dockerfiles 'just work' but produce 2GB images that rebuild from scratch on every code change. Students can't explain layer caching or why the container can't reach the database.",
    flags: [
      "Every code change triggers a full dependency reinstall",
      "You don't know the difference between an image and a container"
    ],
    challenge: {
      title: "Shrink and Cache",
      time: 30,
      prompt: "Write a Dockerfile for a small Python app from scratch using only the Docker docs. Reorder it so a code change rebuilds in under 10 seconds, get the image under 200MB, and connect it to a Postgres container with compose. Explain each line to a peer.",
      criteria: [
        "Code-only rebuild uses cached dependency layers",
        "Final image under 200MB",
        "App reaches Postgres by service name, and you can explain why that works"
      ]
    }
  },
  "async": {
    title: "Concurrency & Async", category: "Programming", risk: "high", freq: 34,
    reqs: [
      "Use asyncio for I/O-bound concurrency",
      "Distinguish threads, processes and async; know the GIL's impact",
      "Avoid race conditions and blocking calls in async code"
    ],
    jd: "Understanding of asynchronous programming and concurrency in Python.",
    trap: "AI sprinkles `async`/`await` everywhere, including around blocking calls. The code looks concurrent but runs sequentially — and students can't tell the difference without timing it.",
    flags: [
      "You've used `time.sleep` inside an async function",
      "You can't say when you'd choose multiprocessing over asyncio"
    ],
    challenge: {
      title: "Prove It's Concurrent",
      time: 30,
      prompt: "Write a script that fetches 20 URLs: once sequentially, once with asyncio, once with a thread pool. Predict the runtimes on paper first. Then add a CPU-heavy step and predict again. Explain any prediction you got wrong.",
      criteria: [
        "Async version is measurably faster for I/O",
        "Your CPU-bound prediction correctly accounts for the GIL",
        "No blocking calls inside coroutines"
      ]
    }
  },
  "db-design": {
    title: "Relational Database Design", category: "Data", risk: "medium", freq: 56,
    reqs: [
      "Normalize schemas and define keys, constraints and relationships",
      "Create and justify indexes; read EXPLAIN plans",
      "Understand transactions and isolation basics"
    ],
    jd: "Experience designing relational schemas and optimizing queries (PostgreSQL/MySQL).",
    trap: "AI schemas are reasonable defaults, so students skip the hard part: deciding constraints from business rules. They also add indexes because 'indexes are fast' without reading a single query plan.",
    flags: [
      "Your tables have no foreign keys or NOT NULL constraints",
      "You've never run EXPLAIN on your own query"
    ],
    challenge: {
      title: "Rules to Schema",
      time: 35,
      prompt: "From these rules — 'a student can enroll in many courses; a course has a max capacity; a student can't enroll in the same course twice' — design the schema by hand with all constraints. Load 100k rows, find a slow query with EXPLAIN, add one index, and show the plan change.",
      criteria: [
        "Duplicate enrollment is blocked by a constraint, not app code",
        "EXPLAIN output before/after shows the index being used",
        "You explained why you chose that column order for the index"
      ]
    }
  },
  "linear-algebra": {
    title: "Linear Algebra & Calculus for ML", category: "Math", risk: "high", freq: 39,
    reqs: [
      "Work with vectors, matrices, dot products and matrix multiplication",
      "Understand gradients and the chain rule as used in backprop",
      "Interpret eigenvectors/PCA intuitively"
    ],
    jd: "Strong mathematical foundation in linear algebra, calculus and probability.",
    trap: "Students ask AI to 'explain gradient descent simply' and walk away with a metaphor instead of the math. Interviews ask you to compute a gradient, not describe a hill.",
    flags: [
      "You can't multiply a 2×3 by a 3×2 matrix by hand",
      "You couldn't derive the gradient of mean squared error"
    ],
    challenge: {
      title: "Backprop by Hand",
      time: 30,
      prompt: "On paper: for a single neuron y = σ(w·x + b) with MSE loss, x = [1, 2], w = [0.5, −0.5], b = 0, target = 1, compute the forward pass, the loss, and the gradient with respect to w and b. Do one gradient descent step with learning rate 0.1. Verify with code afterward.",
      criteria: [
        "Forward pass and loss correct to 3 decimals",
        "Gradients correct, with the chain rule written out",
        "Updated weights match your code verification"
      ]
    }
  },
  "sklearn": {
    title: "ML Fundamentals (scikit-learn)", category: "Machine Learning", risk: "high", freq: 68,
    reqs: [
      "Train regression, classification and clustering models",
      "Build pipelines with preprocessing, avoiding data leakage",
      "Explain bias-variance tradeoff and regularization"
    ],
    jd: "Hands-on experience building ML models with scikit-learn.",
    trap: "AI can produce a full train/predict notebook in seconds, often with the scaler fit on the entire dataset before splitting. Students report 98% accuracy from a leaky pipeline and can't see why it fails in production.",
    flags: [
      "You fit preprocessing on data before the train/test split",
      "You can't explain why you chose this model over another"
    ],
    challenge: {
      title: "Find the Leak",
      time: 30,
      prompt: "Have a peer give you a notebook with 2 hidden data leaks (e.g., scaling before splitting, a feature derived from the target). Find both without AI, fix them with a proper Pipeline, and explain the before/after score difference.",
      criteria: [
        "Both leaks found and explained",
        "Fix uses sklearn Pipeline with split before fit",
        "You predicted the direction of the score change before re-running"
      ]
    }
  },
  "model-eval": {
    title: "Model Evaluation & Validation", category: "Machine Learning", risk: "high", freq: 60,
    reqs: [
      "Choose metrics (precision, recall, F1, AUC, RMSE) for the business problem",
      "Use cross-validation and proper holdout strategies",
      "Detect overfitting and handle class imbalance"
    ],
    jd: "Experience evaluating models with appropriate metrics and validation strategies.",
    trap: "AI defaults to accuracy and a random split. Students never question either — and on a 99%-negative fraud dataset, a model that predicts 'not fraud' every time scores 99%.",
    flags: [
      "You report accuracy on imbalanced data",
      "You've used a random split on time-series data"
    ],
    challenge: {
      title: "The Confusion Matrix Drill",
      time: 20,
      prompt: "On paper: given a confusion matrix (TP=40, FP=10, FN=60, TN=890), compute accuracy, precision, recall and F1. Then argue which metric matters most for (a) cancer screening and (b) spam filtering, and how you'd change the decision threshold for each.",
      criteria: [
        "All four metrics correct",
        "Each argument ties the metric to the real cost of errors",
        "Threshold direction correct for both cases"
      ]
    }
  },
  "feature-eng": {
    title: "Feature Engineering", category: "Machine Learning", risk: "medium", freq: 47,
    reqs: [
      "Encode categoricals, scale numerics, and create interaction features",
      "Engineer time-based and aggregate features without leakage",
      "Use domain knowledge to create predictive signals"
    ],
    jd: "Strong feature engineering skills and ability to work with messy, real-world data.",
    trap: "AI suggests generic features (one-hot everything, polynomial everything). Students never develop domain intuition — the thing that actually separates good models from tutorials.",
    flags: [
      "You can't explain why any feature should predict the target",
      "You've never removed a feature and measured the impact"
    ],
    challenge: {
      title: "Hypothesis-Driven Features",
      time: 40,
      prompt: "For a dataset you choose, write 5 feature ideas on paper, each with a one-sentence hypothesis of why it should predict the target. Build them, measure each one's impact with an ablation, and report which hypotheses held up.",
      criteria: [
        "Every feature has a written hypothesis made before testing",
        "Ablation results reported for each feature",
        "No feature uses information unavailable at prediction time"
      ]
    }
  },
  "deep-learning": {
    title: "Deep Learning (PyTorch)", category: "Machine Learning", risk: "high", freq: 43,
    reqs: [
      "Write training loops: forward, loss, backward, optimizer step",
      "Debug training: exploding/vanishing gradients, overfitting, shape errors",
      "Use GPUs, DataLoaders and pretrained models"
    ],
    jd: "Experience with deep learning frameworks such as PyTorch or TensorFlow.",
    trap: "Students fine-tune a pretrained model from an AI-written script and call it 'deep learning experience'. Ask them to write a training loop from scratch, or explain why loss is NaN, and there's nothing there.",
    flags: [
      "You've never written `loss.backward()` and `optimizer.zero_grad()` from memory",
      "Shape errors send you straight to a chatbot"
    ],
    challenge: {
      title: "Overfit One Batch",
      time: 40,
      prompt: "From an empty file, with only the PyTorch docs: build a small MLP for MNIST, write the training loop by hand, and first prove your code works by overfitting a single batch to ~0 loss. Then train normally and plot train vs. validation loss.",
      criteria: [
        "Single-batch overfit achieved (sanity check passed)",
        "Training loop written without copying",
        "You can state the tensor shape at every layer"
      ]
    }
  },
  "mlops": {
    title: "Model Deployment & MLOps", category: "Machine Learning", risk: "medium", freq: 49,
    reqs: [
      "Serve models behind an API and containerize them",
      "Track experiments and version models and data",
      "Monitor for data drift and performance decay"
    ],
    jd: "Experience deploying ML models to production and monitoring their performance.",
    trap: "A generated deployment works on localhost. Students never consider what happens when input distributions shift, the model gets a field it's never seen, or latency spikes.",
    flags: [
      "Your served model crashes on a missing field",
      "You have no way to know if the model is degrading"
    ],
    challenge: {
      title: "Drift Fire Drill",
      time: 45,
      prompt: "Deploy a model behind an API with input validation. Log every prediction. Then simulate drift by shifting one input feature's distribution, and build a simple check (e.g., population stability index) that flags it. Design the alert threshold on paper first.",
      criteria: [
        "Invalid input returns a 4xx, never a crash",
        "Your drift check fires on the shifted data and not on normal data",
        "Model and data versions are recorded for every prediction"
      ]
    }
  },
  "storytelling": {
    title: "Communicating Insights", category: "Communication", risk: "high", freq: 74,
    reqs: [
      "Present findings to non-technical stakeholders clearly",
      "Write concise summaries with a clear recommendation",
      "Handle questions and push back with evidence"
    ],
    jd: "Excellent communication skills; able to present insights to non-technical audiences.",
    trap: "AI writes polished executive summaries, so students never practice the actual skill: deciding what matters. Live Q&A exposes it immediately — you can't prompt your way through 'so what should we do?'",
    flags: [
      "Your summaries are long and hedge every claim",
      "You've never presented findings and taken live questions"
    ],
    challenge: {
      title: "The 3-Minute Briefing",
      time: 15,
      prompt: "Take one of your analyses. Without notes or slides, explain it to a non-technical friend in 3 minutes: the question, the answer, and what they should do. Then they ask 3 hard questions. Record it and watch it back.",
      criteria: [
        "Recommendation stated in the first 30 seconds",
        "Friend can repeat your conclusion back accurately",
        "You answered all 3 questions without saying 'I'd have to check'"
      ]
    }
  }
};

window.ROLES = [
  {
    id: "junior-data-analyst", title: "Junior Data Analyst", level: "Entry level",
    keywords: ["data", "analyst", "analytics", "sql", "excel", "junior", "reporting"],
    postings: 1240, summary: "Turn raw data into answers for business teams using SQL, spreadsheets and Python.",
    stages: [
      { name: "Foundations", skills: ["excel", "sql-basics", "stats"] },
      { name: "Core Toolkit", skills: ["sql-joins", "python-core", "pandas"] },
      { name: "Applied Analysis", skills: ["data-cleaning", "sql-window", "viz"] },
      { name: "Job-Ready", skills: ["bi-tools", "storytelling", "git"] }
    ]
  },
  {
    id: "junior-python-developer", title: "Junior Python Developer", level: "Entry level",
    keywords: ["python", "developer", "software", "engineer", "junior", "programmer", "coding"],
    postings: 980, summary: "Build and maintain Python services, scripts and integrations on a software team.",
    stages: [
      { name: "Foundations", skills: ["python-core", "cli", "git"] },
      { name: "Core Toolkit", skills: ["oop", "dsa", "debugging"] },
      { name: "Applied Engineering", skills: ["testing", "api", "db-design"] },
      { name: "Job-Ready", skills: ["api-build", "docker", "async"] }
    ]
  },
  {
    id: "data-engineer", title: "Data Engineer", level: "Entry–mid level",
    keywords: ["data", "engineer", "etl", "pipeline", "spark", "airflow", "warehouse", "big data"],
    postings: 860, summary: "Build the pipelines and warehouses that every analyst and model depends on.",
    stages: [
      { name: "Foundations", skills: ["sql-basics", "python-core", "cli"] },
      { name: "Core Toolkit", skills: ["sql-joins", "sql-window", "data-modeling", "git"] },
      { name: "Applied Engineering", skills: ["etl", "db-design", "docker"] },
      { name: "Job-Ready", skills: ["airflow", "spark", "cloud"] }
    ]
  },
  {
    id: "bi-analyst", title: "Business Intelligence Analyst", level: "Entry level",
    keywords: ["business", "intelligence", "bi", "analyst", "power bi", "tableau", "dashboard", "reporting", "data"],
    postings: 710, summary: "Design dashboards and data models that help leaders make decisions.",
    stages: [
      { name: "Foundations", skills: ["excel", "sql-basics", "stats"] },
      { name: "Core Toolkit", skills: ["sql-joins", "data-modeling", "viz"] },
      { name: "Applied BI", skills: ["bi-tools", "dax", "sql-window"] },
      { name: "Job-Ready", skills: ["data-cleaning", "storytelling"] }
    ]
  },
  {
    id: "ml-engineer", title: "Machine Learning Engineer", level: "Entry–mid level",
    keywords: ["ml", "machine learning", "engineer", "ai", "deep learning", "pytorch", "mlops", "model"],
    postings: 640, summary: "Train, ship and maintain machine learning models in production systems.",
    stages: [
      { name: "Foundations", skills: ["python-core", "linear-algebra", "git"] },
      { name: "Core ML", skills: ["pandas", "sklearn", "model-eval"] },
      { name: "Applied ML", skills: ["feature-eng", "deep-learning", "testing"] },
      { name: "Production", skills: ["api-build", "docker", "mlops"] }
    ]
  },
  {
    id: "data-scientist", title: "Junior Data Scientist", level: "Entry level",
    keywords: ["data", "scientist", "science", "ml", "machine learning", "statistics", "python", "junior"],
    postings: 820, summary: "Use statistics and machine learning to answer open-ended business questions.",
    stages: [
      { name: "Foundations", skills: ["stats", "python-core", "sql-basics"] },
      { name: "Core Toolkit", skills: ["pandas", "sql-joins", "linear-algebra"] },
      { name: "Modeling", skills: ["sklearn", "model-eval", "feature-eng", "viz"] },
      { name: "Job-Ready", skills: ["storytelling", "git", "deep-learning"] }
    ]
  },
  {
    id: "backend-developer", title: "Backend Developer (Python)", level: "Entry–mid level",
    keywords: ["backend", "back-end", "developer", "api", "python", "server", "software", "engineer", "web"],
    postings: 900, summary: "Design APIs, databases and services that power web and mobile apps.",
    stages: [
      { name: "Foundations", skills: ["python-core", "cli", "git"] },
      { name: "Core Toolkit", skills: ["db-design", "sql-joins", "api-build"] },
      { name: "Applied Engineering", skills: ["testing", "async", "debugging"] },
      { name: "Job-Ready", skills: ["docker", "cloud", "dsa"] }
    ]
  },
  {
    id: "analytics-engineer", title: "Analytics Engineer", level: "Entry–mid level",
    keywords: ["analytics", "engineer", "dbt", "sql", "data", "modeling", "warehouse"],
    postings: 430, summary: "Bridge analysis and engineering by building tested, documented data models.",
    stages: [
      { name: "Foundations", skills: ["sql-basics", "git", "cli"] },
      { name: "Core Toolkit", skills: ["sql-joins", "sql-window", "data-modeling"] },
      { name: "Applied Engineering", skills: ["etl", "testing", "data-cleaning"] },
      { name: "Job-Ready", skills: ["bi-tools", "airflow", "cloud"] }
    ]
  }
];
