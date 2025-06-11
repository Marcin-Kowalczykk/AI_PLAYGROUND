# DESCRIPTION:

This is a playground for my current knowledge about LLMs in web applications (more information below).

# Tech stack:<br>
Frontend: React + TypeScript<br>
Bundler: Vite<br>
Backend: Express.js<br>
Vector database: Qdrant<br>
LLM: models from OpenAi<br>

# Frontend

## Install app

cd frontend<br>
npm install

!important: Remember since this time all frontend scripts work on ..ai_playground/frontend

## Run App:

npm run dev<br>
<br>
In terminal you should see communicate: ➜  Local:   http://localhost:5173/ here is your app

## Linter Scripts:

### Check Linter Errors

npm run lint

### Fix Linter Errors

npm run lint:fix

### Format Code With Prettier

npm run format

# Backend

## Install app

cd backend<br>
npm install

!important: Remember since this time all Backend scripts work on ..ai_playground/backend

## Run Server
npm run dev<br>
<br>
In terminal you should see communicate: Backend works on http://localhost:3000

# App Description

In frontend/src/components directory there are a list of examples, every example present some functionality.
Check what's going on below.

### EXAMPLE1

- Extract exsample changing questions from the HTML file
- Basic query to the OpenAI API to get answers to the questions
- Send the AI-generated answers to a sample endpoint to retrieve some data
- You will see result in browser interface

### EXAMPLE2

- Auto conversation with Ai
- External Api generates questions (these questions will try to recognize you as a human, system wants to talk only with Robots)
- AI as a user responds to questions
- Answers are based on SYSTEM prompt
- Questions and answers are based on previous questions and answers
- Ai remember previous question and answers
- Process works till external api will approve you as a robot based on your (AI) answers
- You can manipulate AI's responses by changing its system prompt (systemMsgExample2)
- You will see conversation in browser interface and in browser console

### EXAMPLE3

- App tries to fix example massive document.txt with a lot of mathematical operations (some of them are incorrect) in some objects there are a questions
- App should fix incorrect operation and answer the questions
- App uses AI and classic programming solutions
- AI anwers the questions / classic code makes every mathematical operations
- App is an example that not every solutions are good for AI
- You can run scripts by type npm run start:example3 inside backend directory
- If you use bun you can run scripts by bun example3 inside backend directory or by click button on frontend
- You will see steps (console.logs) in terminal

### EXAMPLE4

- App contains example system prompts
- You can copy them to for example chatGPT and see what does it return
- The task for the AI was to take on the role of a robot patrolling a warehouse
- Robot needs a description about warehouse (there are some obstacles)
- Robot must avoid all obstacles and reach the computer located at the end of the warehouse
- AI should return instruction in JSON format only

### EXAMPLE5

- The application is used for censoring sensitive data
- Of course it's just demo so this application is only intended to demonstrate how AI handles text censorship, If this were a real project, you would not be allowed to use the OpenAI API, but would have to use a local model instead
- The app takes random generated sentence with sensitive data and tries to replace sensitive data into 'CENZURA'
- You can run scripts by type npm run start:example5 inside backend directory
- If you use bun you can run scripts by bun example5 inside backend directory or by click button on frontend
- You will see steps (console.logs) in terminal

### EXAMPLE6

- The application uses LLMs to find information from mp3 files
- LLM transcripts mp3 files into a text
- LLM looking for a specific (not obvious) detail from transcripted mp3 files
- You can run scripts by type npm run start:example6 inside backend directory
- If you use bun you can run scripts by bun example6 inside backend directory or by click button on frontend
- You will see steps (console.logs) in terminal

### EXAMPLE7

- The application uses LLMs to detect which city is on images
- On Fronted user can add some images to the input
- After click 'analyze' system will try to detect which city is on images by LLM
- You can see steps (console.logs) in backend terminal
- (in progress) make analyze for default images in example7/images directory

### EXAMPLE8

- The application uses LLMs to generate images
- learning how to write effective system prompts intended for image generation
- user prompts are based on simple, colloquial descriptions of robots, so a good system prompt is needed to generate a correct image when only limited information is available.
- You can see generated image on frontend after button click
- You can run scripts by type npm run start:example8 inside backend directory
- If you use bun you can run scripts by bun example8 inside backend directory or by click button on frontend
- You can see steps (console.logs) in backend terminal

### EXAMPLE9

- The application uses LLMs to categorize file names based on its content
- The application demonstrates the use of LLMs for working with various sources.
- Source files come from various sources
- LLM to extract content from txt files
- LLM to extract text content from mp3 files
- LLM to extract text content from PNG files
- Next, the LLM is used to categorize file names based on their extracted contents according to several criteria
- You can run scripts by type npm run start:example9 inside backend directory
- If you use bun you can run scripts by bun example9 inside backend directory or by click button on frontend
- You can see steps (console.logs) in backend terminal

### EXAMPLE10

- Application for analyze html article by LLM
- Article contains text, audio, images content
- Transform html article into markdown file with text, audio and images placeholders
- Save audio and image files
- Use LLM to transcribe audio
- Use LLm to desribe images
- Create final markdown file with previous content and replace placehodlers by LLM answers (transcribe audio, described images)
- Use LLM to answer users questions about Article
BONUS: cache all LLM's answers in txt files to optimize App
- If you use bun you can run scripts by bun example10 inside backend directory or by click button on frontend
- You can see steps (console.logs) in backend terminal

### EXAMPLE11

- Application focused on document understanding and metadata extraction for security incident reports from a factory environment
- The application uses 10 txt files to extract by LLM the most important information and then creates a markdown file with the necessary content
- Application takes 10 report txt files to find metadata (keywords) by LLM
- To find keywords LLM uses default report documents and markdown file with additional information as its content in prompt
- App creates json file with all keywords
- If you use bun you can run scripts by bun example11 inside backend directory or by click button on frontend
- You can see steps (console.logs) in backend terminal

### EXAMPLE12

- Application focused on semantic search using vector databases to analyze weapon test reports
- The application processes encrypted ZIP files containing weapon test reports
- Uses vector database (Qdrant) to store and search through report embeddings
- Implements semantic search to find specific information about weapon prototype theft
- Key features:
  - Downloads and decrypts ZIP files with password
  - Extracts dates from report filenames
  - Generates embeddings for report contents using OpenAI's text-embedding-3-large model
  - Stores vectors with metadata in Qdrant database
  - Performs semantic search to find relevant report
  - Returns date in YYYY-MM-DD format
- You can run scripts by type npm run start:example12 inside backend directory
- If you use bun you can run scripts by bun example12 inside backend directory or by click button on frontend
- You can see steps (console.logs) in backend terminal

### EXAMPLE13

- Application focused on database querying and analysis using LLM to generate SQL queries
- The application interacts with a remote database API to discover and analyze database structure
- Key features:
  - Connects to external database API endpoint
  - Discovers database structure using SHOW TABLES and SHOW CREATE TABLE commands
  - Uses LLM to generate appropriate SQL queries based on database schema
  - Processes database responses to extract relevant information
  - Implements agent-like behavior for iterative database exploration
  - Handles error cases and validates responses
- The application demonstrates:
  - Database schema analysis
  - SQL query generation using LLM
  - API interaction with external database service
  - Data processing and transformation
  - Error handling and validation
- You can run scripts by type npm run start:example13 inside backend directory
- If you use bun you can run scripts by bun example13 inside backend directory or by click button on frontend
- You can see steps (console.logs) in backend terminal

### EXAMPLE14

- Application focused on tracking and analyzing movement patterns of resistance members
- The application implements an iterative search system using two external APIs:
  - People search API to find locations where specific people were seen
  - Places search API to find people seen in specific cities
- Key features:
  - Downloads and analyzes initial data from a target person's note
  - Extracts names and cities from the note using LLM
  - Implements iterative search algorithm using two queues (people and cities)
  - Normalizes input data (removes Polish characters, converts to uppercase)
  - Handles API responses and data validation
  - Tracks search progress to avoid duplicate queries
- The application demonstrates:
  - API integration with multiple endpoints
  - Data normalization and processing
  - Iterative search algorithms
  - LLM-assisted text analysis
  - State management for search progress
- You can run scripts by type npm run start:example14 inside backend directory
- If you use bun you can run scripts by bun example14 inside backend directory or by click button on frontend
- You can see steps (console.logs) in backend terminal

### EXAMPLE15

- Application focused on graph database operations and path finding between users
- The application implements a system to find the shortest path between two people in a social network
- Key features:
  - Connects to MySQL database to fetch user and connection data
  - Implements Neo4j graph database integration
  - Creates user nodes and relationship edges in the graph database
  - Implements shortest path finding algorithm
  - Handles data transformation between different database formats
  - Processes and formats path results
- The application demonstrates:
  - Graph database operations
  - Data migration between different database types
  - Path finding algorithms
  - Database schema design
  - Data normalization and transformation
- You can run scripts by type npm run start:example15 inside backend directory
- If you use bun you can run scripts by bun example15 inside backend directory or by click button on frontend
- You can see steps (console.logs) in backend terminal

### EXAMPLE16

- Application focused on image processing and person description generation using AI
- The application implements an interactive system for analyzing and enhancing damaged photos
- Key features:
  - Interacts with central API to process and enhance photos
  - Uses Vision LLM models to analyze photo quality and content
  - Implements image enhancement commands (REPAIR, DARKEN, BRIGHTEN)
  - Processes multiple photos to identify target person
  - Generates detailed person description in Polish
  - Handles API rate limits and optimizes token usage
- The application demonstrates:
  - Vision AI model integration
  - Image processing and enhancement
  - Natural language processing for description generation
  - API interaction and response parsing
  - Multi-step image analysis workflow
- You can run scripts by type npm run start:example16 inside backend directory
- If you use bun you can run scripts by bun example16 inside backend directory or by click button on frontend
- You can see steps (console.logs) in backend terminal

### EXAMPLE17

- Application focused on supervised fine-tuning of LLM models for data validation
- The application implements a system to train and use a custom model for validating research data
- Key features:
  - Downloads and processes research data from central API
  - Creates training data in JSONL format for model fine-tuning
  - Implements supervised fine-tuning using OpenAI's platform
  - Uses fine-tuned model to validate new research data
  - Processes and formats validation results
- The application demonstrates:
  - OpenAI fine-tuning workflow
  - Training data preparation
  - Model validation and testing
  - API integration with OpenAI's fine-tuning platform
  - Data processing and validation
- You can run scripts by type npm run start:example17 inside backend directory
- If you use bun you can run scripts by bun example17 inside backend directory or by click button on frontend
- You can see steps (console.logs) in backend terminal


