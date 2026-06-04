"use client";

import { useEffect, useState } from "react";

interface ContactLog {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  cf7Status: string;
  cf7Response: string;
  success: boolean;
  error?: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<ContactLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "success" | "failed">("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      const res = await fetch("/api/contact-logs");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function clearLogs() {
    if (!confirm("Are you sure you want to clear all logs?")) return;
    try {
      await fetch("/api/contact-logs", { method: "DELETE" });
      setLogs([]);
      alert("Logs cleared successfully!");
    } catch (error) {
      alert("Failed to clear logs");
    }
  }

  const filteredLogs = logs.filter((log) => {
    if (filter === "success") return log.success;
    if (filter === "failed") return !log.success;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Contact Form Logs
            </h1>
            <p className="text-gray-600 mt-2">
              Total submissions: {logs.length}
            </p>
          </div>
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear All Logs
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            All ({logs.length})
          </button>
          <button
            onClick={() => setFilter("success")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "success"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Success ({logs.filter((l) => l.success).length})
          </button>
          <button
            onClick={() => setFilter("failed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "failed"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Failed ({logs.filter((l) => !l.success).length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No logs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`bg-white rounded-lg border-l-4 p-6 shadow-sm ${
                  log.success ? "border-green-500" : "border-red-500"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {log.name}
                    </h3>
                    <p className="text-sm text-gray-500">{log.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      log.success
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {log.success ? "Sent" : "Failed"}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Subject:
                  </p>
                  <p className="text-gray-600">{log.subject}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Message:
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {log.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Status</p>
                    <p className="text-gray-600">{log.cf7Status}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Timestamp</p>
                    <p className="text-gray-600 text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                {log.error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <p className="font-medium mb-1">Error:</p>
                    <p>{log.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
