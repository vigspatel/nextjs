import { clearLogs, getAllLogs } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const logs = getAllLogs();
    return NextResponse.json({ logs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    clearLogs();
    return NextResponse.json({
      ok: true,
      message: "Logs cleared successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
