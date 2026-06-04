# Email Submission Tracking System

This system logs all contact form submissions and provides a dashboard to check their status.

## Features Added

### 1. **Server-Side Logging** (`lib/logger.ts`)

- Logs all contact submissions to `.logs/contact-submissions.json`
- Tracks submission details: name, email, subject, message, CF7 status, and responses
- Each log entry has a unique ID and timestamp

### 2. **Enhanced API Route** (`app/api/contact-submit/route.ts`)

- Validates CF7 responses to detect if email was actually sent
- Logs all submissions (successful and failed)
- Logs all errors with detailed error messages
- Returns status information to the frontend

### 3. **Admin Logs Dashboard** (`app/admin/logs/page.tsx`)

- Beautiful UI to view all submissions
- Filter logs by status (All / Success / Failed)
- Shows submission details: name, email, subject, message, timestamp
- Option to clear all logs
- Color-coded status badges (green for success, red for failed)

### 4. **Contact Form Improvements** (`app/contact/ContactForm.tsx`)

- Better error messages with specific status information
- Displays success/error banners instead of alerts
- Shows network error messages

## How to Check Email Status

### Option 1: View Dashboard (Easiest)

1. Navigate to: `http://localhost:3000/admin/logs`
2. View all contact submissions with their status
3. See which emails were sent successfully (green badge) or failed (red badge)
4. Filter by status using the buttons at the top

### Option 2: Check Logs File Directly

1. Open `.logs/contact-submissions.json` in the project root
2. View raw JSON data of all submissions
3. Each entry shows:
   - `success`: true/false
   - `cf7Status`: The status from WordPress CF7 (mail_sent, success, failed, error)
   - `timestamp`: When it was submitted

### Option 3: WordPress Admin Panel

1. Log into your WordPress admin: `https://bluereeftech.com/demo-next-js/wp-admin`
2. Go to **Contact** → **CF7** → **Submissions** (if available)
3. See received contact form entries
4. (Optional) Install **"Contact Form 7 - Mailchimp Extension"** or similar to see mail logs

## Log File Format

Location: `.logs/contact-submissions.json`

Example entry:

```json
{
  "id": "log-1622547890123-abc123def",
  "timestamp": "2026-06-01T10:30:45.123Z",
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Website Inquiry",
  "message": "I'm interested in your services...",
  "cf7Status": "mail_sent",
  "cf7Response": "{\"status\":\"mail_sent\"}",
  "success": true
}
```

## Status Values

- `mail_sent` - Email was sent successfully
- `success` - Fallback endpoint confirmed success
- `submission_failed` - Submission was processed but mail failed
- `failed` - HTTP request failed
- `error` - System error occurred

## Understanding the Response Flow

1. User submits form → Frontend sends to `/api/contact-submit`
2. API tries primary CF7 endpoint (`/wp-json/cf7/v1/submit`)
3. If that fails, tries fallback endpoint (`/wp-admin/admin-ajax.php`)
4. Validates CF7 response to check if email was actually sent
5. Logs the submission with status
6. Returns status to frontend
7. User sees success/error message
8. Admin can view all submissions in `/admin/logs`

## Notes

- Logs are stored locally in `.logs/contact-submissions.json`
- This file is NOT committed to git (check your `.gitignore`)
- Logs persist between server restarts
- You should add `.logs/` to your `.gitignore` if not already there
- For production, consider storing logs in a database instead of JSON files

## Troubleshooting

**No entries appearing in logs?**

- Check that the `.logs` directory exists and has write permissions
- Check the API route error responses in browser DevTools
- Verify WordPress CF7 form ID `01e2b9c` is correct

**All submissions showing as failed?**

- Check your WordPress API endpoint is accessible
- Verify CF7 plugin is active in WordPress
- Check WordPress CORS settings if frontend and backend are on different domains

**Lost logs?**

- Make sure to back up `.logs/contact-submissions.json` periodically
- Consider migrating to a database for production use
