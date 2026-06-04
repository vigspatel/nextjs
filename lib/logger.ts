import fs from "fs";
import path from "path";

const LOGS_DIR = path.join(process.cwd(), ".logs");
const LOGS_FILE = path.join(LOGS_DIR, "contact-submissions.json");

interface ContactLog {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  cf7Status: string;
  cf7Response: string;
  cf7HttpStatus?: number;
  success: boolean;
  error?: string;
}

// Ensure logs directory exists
function ensureLogsDir() {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
}

// Get all logs
export function getAllLogs(): ContactLog[] {
  ensureLogsDir();
  if (!fs.existsSync(LOGS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(LOGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Add a new log entry
export function addLog(log: Omit<ContactLog, "id" | "timestamp">): ContactLog {
  ensureLogsDir();
  const logs = getAllLogs();

  const newLog: ContactLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    ...log,
  };

  logs.push(newLog);
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));

  return newLog;
}

// Clear all logs
export function clearLogs(): void {
  ensureLogsDir();
  if (fs.existsSync(LOGS_FILE)) {
    fs.unlinkSync(LOGS_FILE);
  }
}
