# 🔧 Connection Troubleshooting Guide

## Current Status
❌ **Offline mode active** - App cannot connect to Google Sheets backend

## Diagnostic Steps

### Step 1: Test Your API
Open this URL in your browser:
```
http://localhost:3001/api-tester.html
```

This tool will:
- ✅ Test if the API is reachable
- ✅ Show detailed error messages
- ✅ Display response times
- ✅ Check data format

### Step 2: Check Browser Console
1. Open your app: http://localhost:3001/
2. Press **F12** → **Console** tab
3. Look for messages starting with:
   - 🔗 API Request: (shows the URL being called)
   - ❌ API Request failed: (shows what went wrong)

### Step 3: Verify Apps Script Deployment

**Most Common Issue:** Apps Script not deployed with "Anyone" access

#### Fix Deployment Settings:

1. **Open Google Sheets** with your question bank
2. Click **Extensions** → **Apps Script**
3. Click **Deploy** → **Manage deployments**
4. Look at the current deployment

**Check these settings:**
- ✅ Type: **Web app**
- ✅ Execute as: **Me** (your email)
- ❌ **CRITICAL:** Who has access: **Anyone** 
  - NOT "Anyone with the link"
  - NOT "Only myself"
  - Must be exactly: **"Anyone"**

**If settings are wrong:**
1. Click the ✏️ **pencil icon** (Edit)
2. Change "Who has access" to **"Anyone"**
3. Click **Deploy**
4. You'll get a new URL - update `src/config.ts` with it

### Step 4: Test Direct API Call

Open this URL directly in your browser (substitute the Web App URL from `src/config.ts`):
```
<YOUR_WEB_APP_URL>?action=getSubjects
```

**Expected Result:**
```json
{
  "success": true,
  "data": [
    {"name": "English", "questionCount": 100},
    {"name": "Mathematics", "questionCount": 100},
    ...
  ],
  "error": null
}
```

**If you see:**
- ❌ **Authorization required** → Deploy settings wrong (not "Anyone")
- ❌ **Script error** → Code not updated or has syntax error
- ❌ **404 Not Found** → Wrong URL in config.ts
- ❌ **CORS error** → Deploy as Web App, not API Executable

### Step 5: Verify Optimized Code is Deployed

1. Open **Apps Script editor**
2. Check if the **FIRST LINE** is:
   ```javascript
   const SS = SpreadsheetApp.getActiveSpreadsheet();
   ```
3. If NOT, the code hasn't been updated:
   - Copy from `apps-script/Code.gs`
   - Replace ALL code in the editor
   - Save (Ctrl+S)
   - Deploy → New deployment

### Step 6: Check Network/Firewall

If API test works in browser but not in app:
1. Disable any ad blockers
2. Disable browser extensions (try Incognito mode)
3. Check if corporate firewall is blocking Google Apps Script
4. Try a different browser

## Quick Fix Checklist

- [ ] Apps Script deployed with "Anyone" access (most common issue)
- [ ] Code updated with optimized version (has `const SS` at top)
- [ ] URL in `src/config.ts` ends with `/exec`
- [ ] Direct URL test works in browser
- [ ] Browser console shows detailed error (F12)
- [ ] No ad blockers or extensions interfering

## Still Not Working?

### Option 1: Reset Everything
1. Delete current deployment:
   - Deploy → Manage deployments
   - Click Archive (🗑️) on old deployment
2. Create fresh deployment:
   - Deploy → New deployment
   - Type: Web app
   - Access: **Anyone**
3. Update config.ts with new URL
4. Clear browser cache (Ctrl+Shift+Delete)
5. Restart dev server

### Option 2: Use Offline Mode
The app works perfectly with sample data (25 questions):
- All features functional
- No backend needed
- Great for testing and development

Just dismiss the banner and continue using the app!

## Common Error Messages

### "Failed to fetch"
- **Cause:** CORS blocked or wrong deployment settings
- **Fix:** Deploy as Web App with "Anyone" access

### "Request timeout"
- **Cause:** Apps Script code not optimized
- **Fix:** Update code with `const SS` global variable

### "Invalid action"
- **Cause:** URL missing `?action=` parameter
- **Fix:** Check config.ts URL format

### "Sheet not found"
- **Cause:** Google Sheet missing subject tabs
- **Fix:** Verify sheets named: English, Mathematics, Science, GK, Sports

## Next Steps

1. Run API tester: http://localhost:3001/api-tester.html
2. Share the results from the tester
3. Check browser console for detailed errors
4. Verify Apps Script deployment settings
