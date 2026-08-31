# Google Sheets Backend Setup Guide

This guide explains how to set up Google Sheets as the database for the Educational Practice App.

## Sheet Structure

Create a Google Spreadsheet with the following tabs:

### 1. Config Tab
Configuration settings for the application.

| Key | Value |
|-----|-------|
| AppName | My Learning Hub |
| Version | 1.0.0 |
| MaxQuestions | 50 |
| DefaultQuestionCount | 20 |

### 2. Users Tab
User information for tracking sessions.

| UserID | Name | Role | CreatedAt |
|--------|------|------|-----------|
| U001 | Abhay | Parent | 2026-08-01 |
| U002 | Son | Student | 2026-08-01 |

### 3. English Tab (Questions)
English subject questions.

| QuestionID | Subject | Topic | Question | OptionA | OptionB | OptionC | OptionD | CorrectAnswer | Explanation | Difficulty | Source | Active |
|------------|---------|-------|----------|---------|---------|---------|---------|---------------|-------------|------------|--------|--------|
| ENG001 | English | Nouns | Which word is a noun? | Quickly | School | Beautiful | Run | B | "School" is a noun because it names a place. | Easy | Custom | TRUE |
| ENG002 | English | Verbs | Identify the verb: "The cat jumps." | Cat | Jumps | The | Over | B | "Jumps" is a verb showing action. | Easy | Custom | TRUE |

**Column Definitions:**
- QuestionID: Unique identifier (e.g., ENG001, MAT001)
- Subject: Subject name (English, Mathematics, etc.)
- Topic: Topic within subject (Nouns, Fractions, etc.)
- Question: The question text
- OptionA-D: Four answer choices
- CorrectAnswer: Correct option (A, B, C, or D)
- Explanation: Why the answer is correct
- Difficulty: Easy, Medium, or Hard
- Source: Where question came from (Book, Exam, Custom)
- Active: TRUE to show, FALSE to hide

### 4. Mathematics Tab
Same structure as English tab, with MAT prefix for QuestionID.

### 5. Science Tab
Same structure as English tab, with SCI prefix for QuestionID.

### 6. GK Tab
Same structure as English tab, with GK prefix for QuestionID.

### 7. Sports Tab
Same structure as English tab, with SPT prefix for QuestionID.

### 8. Topics Tab
Topic definitions for all subjects.

| TopicID | Subject | TopicName | Description |
|---------|---------|-----------|-------------|
| T001 | English | Nouns | Types of nouns and usage |
| T002 | English | Verbs | Action words and tenses |
| T003 | English | Adjectives | Describing words |

### 9. Sessions Tab
Practice session records.

| SessionID | UserID | Subject | Topic | Mode | StartTime | EndTime | TotalQuestions | CorrectAnswers | Score | Duration |
|-----------|--------|---------|-------|------|-----------|---------|----------------|----------------|-------|----------|
| ENG-20260820-1830-001 | U002 | English | Tenses | Topic Practice | 2026-08-20 18:30:00 | 2026-08-20 18:47:00 | 20 | 16 | 80 | 1020 |

**Column Definitions:**
- SessionID: Unique session identifier
- UserID: User who practiced
- Subject: Subject practiced
- Topic: Specific topic (or NULL for random)
- Mode: Practice, Topic Practice, Mistake Review, Mock Test
- StartTime: When session started
- EndTime: When session ended
- TotalQuestions: Number of questions
- CorrectAnswers: Number of correct answers
- Score: Percentage score (0-100)
- Duration: Time in seconds

### 10. Responses Tab
Individual question responses within sessions.

| ResponseID | SessionID | QuestionID | SelectedAnswer | Correct | ResponseTime | Timestamp |
|------------|-----------|------------|----------------|---------|--------------|-----------|
| R001 | ENG-20260820-1830-001 | ENG001 | B | TRUE | 8 | 2026-08-20 18:31:00 |
| R002 | ENG-20260820-1830-001 | ENG002 | C | FALSE | 12 | 2026-08-20 18:32:00 |

**Column Definitions:**
- ResponseID: Unique response identifier
- SessionID: Session this response belongs to
- QuestionID: Question that was answered
- SelectedAnswer: User's answer (A, B, C, or D)
- Correct: TRUE if correct, FALSE if incorrect
- ResponseTime: Seconds to answer
- Timestamp: When answered

## Google Apps Script API

Create a Google Apps Script project attached to the spreadsheet with these endpoints:

### API Endpoints

1. **GET /subjects** - Get list of subjects
2. **GET /questions?subject=English** - Get questions by subject
3. **GET /questions?subject=English&topic=Nouns** - Get questions by topic
4. **GET /topics?subject=English** - Get topics for subject
5. **POST /session/start** - Start a new session
6. **POST /session/answer** - Record an answer
7. **POST /session/complete** - Complete a session
8. **GET /history?userId=U002** - Get user's session history
9. **GET /statistics?userId=U002** - Get user statistics

## Sample Data Template

You can copy the mock data from `src/data/mockData.ts` to populate your Google Sheet.

## Setting Up the Sheet

1. Create a new Google Spreadsheet
2. Rename it to "Educational App - Question Bank"
3. Create all 10 tabs listed above
4. Add column headers to each tab
5. Populate with sample data
6. Note the spreadsheet ID from the URL
7. Set up Google Apps Script (see next section)

## Next Steps

1. Create the Google Apps Script backend (see `docs/google-apps-script.md`)
2. Deploy as web app
3. Update frontend API endpoints
4. Test the integration

## Security Notes

- Make the sheet viewable only to you
- Use Google Apps Script authentication
- Validate all inputs in Apps Script
- Never expose the spreadsheet ID publicly
- Consider using Google Sign-In for production
