# React + TypeScript + Vite + Express.js

# DESCRIPTION:

This is a playground for my current knowledge about LLMs in web applications (more information below). To run this app you need openAI apiKey and some endpoints to external Apis

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
- You can manipulate AI’s responses by changing its system prompt (systemMsgExample2)
- You will see conversation in browser interface and in browser console

### EXAMPLE3

- App tries to fix example massive document.txt with a lot of mathematical operations (some of them are incorrect) in some objects there are a questions
- App should fix incorrect operation and answer the questions
- App uses AI and classic programming solutions
- AI anwers the questions / classic code makes every mathematical operations
- App is an example that not every solutions are good for AI
- You can run scripts by type npm run start:example3 inside backend directory
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
- You will see steps (console.logs) in terminal

### EXAMPLE6

- The application uses LLMs to find information from mp3 files
- LLM transcripts mp3 files into a text
- LLM looking for a specific (not obvious) detail from transcripted mp3 files
- You can run scripts by type npm run start:example6 inside backend directory
- You will see steps (console.logs) in terminal