/**
 * Global Spreadsheet Reference
 * Declared once to avoid repeated getActiveSpreadsheet() calls
 * This significantly improves performance by caching the spreadsheet connection
 */
const SS = SpreadsheetApp.getActiveSpreadsheet();

/**
 * Main API handler for Google Apps Script
 * Handles HTTP GET and POST requests
 */

function doGet(e) {
  try {
    const action = e.parameter.action;
    
    switch(action) {
      case 'getSubjects':
        return getSubjects();
      
      case 'getQuestions':
        return getQuestions(e.parameter.subject, e.parameter.topic);
      
      case 'getTopics':
        return getTopics(e.parameter.subject);
      
      case 'getHistory':
        return getHistory(e.parameter.userId);
      
      case 'getStatistics':
        return getStatistics(e.parameter.userId);
      
      case 'debugQuestions':
        return debugQuestions(e.parameter.subject);
      
      default:
        return createResponse(false, null, 'Invalid action');
    }
  } catch (error) {
    return createResponse(false, null, error.toString());
  }
}

function doPost(e) {
  try {
    const action = e.parameter.action;
    const data = JSON.parse(e.postData.contents);
    
    switch(action) {
      case 'startSession':
        return startSession(data);
      
      case 'recordAnswer':
        return recordAnswer(data);
      
      case 'completeSession':
        return completeSession(data);
      
      default:
        return createResponse(false, null, 'Invalid action');
    }
  } catch (error) {
    return createResponse(false, null, error.toString());
  }
}

/**
 * Create standardized JSON response
 */
function createResponse(success, data, error = null) {
  const response = {
    success: success,
    data: data,
    error: error
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get list of available subjects
 * Optimized to use getLastRow() instead of loading all data
 */
function getSubjects() {
  const subjects = [];
  const subjectSheets = ['English', 'Mathematics', 'Science', 'GK', 'Sports'];
  
  subjectSheets.forEach(subject => {
    const sheet = SS.getSheetByName(subject);
    if (sheet) {
      const lastRow = sheet.getLastRow();
      const questionCount = lastRow > 0 ? lastRow - 1 : 0; // Exclude header
      subjects.push({
        name: subject,
        questionCount: questionCount
      });
    }
  });
  
  return createResponse(true, subjects);
}

/**
 * Get questions by subject and optionally by topic
 */
function getQuestions(subject, topic = null) {
  const sheet = SS.getSheetByName(subject);
  
  if (!sheet) {
    return createResponse(false, null, 'Subject not found');
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const questions = [];
  
  // Find column indices
  const colIndex = {};
  headers.forEach((header, index) => {
    colIndex[header] = index;
  });
  
  // Process questions
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Skip inactive questions - handle both boolean and string "True"
    const activeValue = row[colIndex['Active']];
    const isActive = activeValue === true || activeValue === 'TRUE' || activeValue === 'True';
    if (!isActive) continue;
    
    // Filter by topic if specified
    if (topic && row[colIndex['Topic']] !== topic) continue;
    
    // Clean the class value - remove leading apostrophe if present
    let classValue = row[colIndex['Class']];
    if (typeof classValue === 'string') {
      classValue = classValue.replace(/^'/, ''); // Remove leading apostrophe
    }
    
    questions.push({
      questionId: row[colIndex['QuestionID']],
      class: classValue,
      subject: row[colIndex['Subject']],
      topic: row[colIndex['Topic']],
      question: row[colIndex['Question']],
      optionA: row[colIndex['OptionA']],
      optionB: row[colIndex['OptionB']],
      optionC: row[colIndex['OptionC']],
      optionD: row[colIndex['OptionD']],
      correctAnswer: row[colIndex['CorrectAnswer']],
      explanation: row[colIndex['Explanation']],
      difficulty: row[colIndex['Difficulty']],
      source: row[colIndex['Source']] || '',
      active: activeValue
    });
  }
  
  return createResponse(true, questions);
}

/**
 * Debug function to help diagnose data issues
 */
function debugQuestions(subject) {
  const debugInfo = {
    spreadsheetName: SS.getName(),
    sheetExists: false,
    headers: [],
    rowCount: 0,
    sampleRows: [],
    activeColumnValues: []
  };
  
  const sheet = SS.getSheetByName(subject);
  
  if (!sheet) {
    debugInfo.error = 'Sheet not found: ' + subject;
    debugInfo.availableSheets = SS.getSheets().map(s => s.getName());
    return createResponse(true, debugInfo);
  }
  
  debugInfo.sheetExists = true;
  debugInfo.sheetName = sheet.getName();
  
  const data = sheet.getDataRange().getValues();
  debugInfo.headers = data[0];
  debugInfo.rowCount = data.length - 1;
  
  // Get first 3 data rows
  for (let i = 1; i <= Math.min(3, data.length - 1); i++) {
    debugInfo.sampleRows.push(data[i]);
  }
  
  // Find Active column and get its values
  const activeColIndex = data[0].indexOf('Active');
  if (activeColIndex !== -1) {
    for (let i = 1; i <= Math.min(5, data.length - 1); i++) {
      debugInfo.activeColumnValues.push({
        row: i,
        value: data[i][activeColIndex],
        type: typeof data[i][activeColIndex],
        stringValue: String(data[i][activeColIndex])
      });
    }
  } else {
    debugInfo.activeColumnError = 'Active column not found';
  }
  
  return createResponse(true, debugInfo);
}

/**
 * Get topics for a subject
 */
function getTopics(subject) {
  const sheet = SS.getSheetByName('Topics');
  
  if (!sheet) {
    return createResponse(false, null, 'Topics sheet not found');
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const topics = [];
  
  // Find column indices
  const colIndex = {};
  headers.forEach((header, index) => {
    colIndex[header] = index;
  });
  
  // Process topics
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    if (row[colIndex['Subject']] === subject) {
      // Clean the class value - remove leading apostrophe if present
      let classValue = row[colIndex['Class']];
      if (typeof classValue === 'string') {
        classValue = classValue.replace(/^'/, ''); // Remove leading apostrophe
      }
      
      topics.push({
        topicId: row[colIndex['TopicID']],
        class: classValue,
        subject: row[colIndex['Subject']],
        topicName: row[colIndex['TopicName']],
        description: row[colIndex['Description']] || ''
      });
    }
  }
  
  return createResponse(true, topics);
}

/**
 * Start a new practice session
 */
function startSession(data) {
  const sheet = SS.getSheetByName('Sessions');
  
  if (!sheet) {
    return createResponse(false, null, 'Sessions sheet not found');
  }
  
  const sessionId = `${data.subject.substring(0, 3).toUpperCase()}-${Date.now()}`;
  const timestamp = new Date().toISOString();
  
  sheet.appendRow([
    sessionId,
    data.userId,
    data.subject,
    data.topic || '',
    data.mode,
    timestamp,
    '', // EndTime - will be filled on completion
    0,  // TotalQuestions - will be updated
    0,  // CorrectAnswers - will be updated
    0,  // Score - will be updated
    0   // Duration - will be updated
  ]);
  
  return createResponse(true, { sessionId: sessionId });
}

/**
 * Record an answer for a question
 */
function recordAnswer(data) {
  const sheet = SS.getSheetByName('Responses');
  
  if (!sheet) {
    return createResponse(false, null, 'Responses sheet not found');
  }
  
  // Get the question to check if answer is correct
  const questionSheet = SS.getSheetByName(data.questionId.substring(0, 3) === 'ENG' ? 'English' :
                                         data.questionId.substring(0, 3) === 'MAT' ? 'Mathematics' :
                                         data.questionId.substring(0, 3) === 'SCI' ? 'Science' :
                                         data.questionId.substring(0, 2) === 'GK' ? 'GK' : 'Sports');
  
  let correctAnswer = null;
  const questionData = questionSheet.getDataRange().getValues();
  for (let i = 1; i < questionData.length; i++) {
    if (questionData[i][0] === data.questionId) {
      correctAnswer = questionData[i][8]; // CorrectAnswer column
      break;
    }
  }
  
  const isCorrect = data.selectedAnswer === correctAnswer;
  const responseId = `R${Date.now()}`;
  const timestamp = new Date().toISOString();
  
  sheet.appendRow([
    responseId,
    data.sessionId,
    data.questionId,
    data.selectedAnswer,
    isCorrect,
    data.responseTime || 0,
    timestamp
  ]);
  
  return createResponse(true, { 
    responseId: responseId,
    correct: isCorrect 
  });
}

/**
 * Complete a session and update stats
 */
function completeSession(data) {
  const sheet = SS.getSheetByName('Sessions');
  
  if (!sheet) {
    return createResponse(false, null, 'Sessions sheet not found');
  }
  
  const sessionData = sheet.getDataRange().getValues();
  
  // Find the session row
  for (let i = 1; i < sessionData.length; i++) {
    if (sessionData[i][0] === data.sessionId) {
      // Update the session row
      sheet.getRange(i + 1, 7).setValue(data.endTime); // EndTime
      sheet.getRange(i + 1, 8).setValue(data.totalQuestions);
      sheet.getRange(i + 1, 9).setValue(data.correctAnswers);
      sheet.getRange(i + 1, 10).setValue(data.score);
      sheet.getRange(i + 1, 11).setValue(data.duration);
      
      return createResponse(true, { sessionId: data.sessionId });
    }
  }
  
  return createResponse(false, null, 'Session not found');
}

/**
 * Get user's session history
 */
function getHistory(userId) {
  const sheet = SS.getSheetByName('Sessions');
  
  if (!sheet) {
    return createResponse(false, null, 'Sessions sheet not found');
  }
  
  const data = sheet.getDataRange().getValues();
  const sessions = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    if (row[1] === userId) { // UserID column
      sessions.push({
        sessionId: row[0],
        userId: row[1],
        subject: row[2],
        topic: row[3],
        mode: row[4],
        startTime: row[5],
        endTime: row[6],
        totalQuestions: row[7],
        correctAnswers: row[8],
        score: row[9],
        duration: row[10]
      });
    }
  }
  
  // Sort by start time descending
  sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  
  return createResponse(true, sessions);
}

/**
 * Get user statistics
 */
function getStatistics(userId) {
  const sheet = SS.getSheetByName('Sessions');
  
  if (!sheet) {
    return createResponse(false, null, 'Sessions sheet not found');
  }
  
  const data = sheet.getDataRange().getValues();
  const userSessions = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[1] === userId) {
      userSessions.push({
        subject: row[2],
        totalQuestions: row[7],
        correctAnswers: row[8],
        score: row[9]
      });
    }
  }
  
  // Calculate statistics
  const stats = {
    totalSessions: userSessions.length,
    totalQuestions: 0,
    totalCorrect: 0,
    averageScore: 0,
    subjectStats: {}
  };
  
  userSessions.forEach(session => {
    stats.totalQuestions += session.totalQuestions;
    stats.totalCorrect += session.correctAnswers;
    
    if (!stats.subjectStats[session.subject]) {
      stats.subjectStats[session.subject] = {
        sessions: 0,
        questions: 0,
        correct: 0,
        scores: []
      };
    }
    
    stats.subjectStats[session.subject].sessions++;
    stats.subjectStats[session.subject].questions += session.totalQuestions;
    stats.subjectStats[session.subject].correct += session.correctAnswers;
    stats.subjectStats[session.subject].scores.push(session.score);
  });
  
  // Calculate averages
  if (userSessions.length > 0) {
    const totalScore = userSessions.reduce((sum, s) => sum + s.score, 0);
    stats.averageScore = Math.round(totalScore / userSessions.length);
  }
  
  // Calculate subject averages
  Object.keys(stats.subjectStats).forEach(subject => {
    const subjectData = stats.subjectStats[subject];
    const avgScore = Math.round(
      subjectData.scores.reduce((sum, s) => sum + s, 0) / subjectData.scores.length
    );
    stats.subjectStats[subject].averageScore = avgScore;
    delete stats.subjectStats[subject].scores; // Remove raw scores from response
  });
  
  return createResponse(true, stats);
}
