import { NextResponse } from "next/server";

type SubmitBody = {
  "your-name": string;
  "your-email": string;
  "your-subject"?: string;
  "your-message"?: string;
};

function getWpBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL ||
    process.env.WORDPRESS_BASE_URL ||
    "https://bluereeftech.com/demo-next-js/"
  );
}

function validateCF7Response(responseText: string): boolean {
  // CF7 returns JSON with status "mail_sent" on success
  try {
    const data = JSON.parse(responseText);
    return data.status === "mail_sent" || data.ok === true;
  } catch {
    // If not JSON, check for success indicators in text
    return (
      responseText.toLowerCase().includes("success") ||
      responseText.toLowerCase().includes("sent")
    );
  }
}

export async function POST(req: Request) {
  let cf7Status = "pending";
  let cf7Response = "";
  let success = false;

  try {
    const body = (await req.json()) as SubmitBody;

    const wpBase = getWpBaseUrl().replace(/\/+$/, "");

    // Most CF7 setups accept form-encoded POST to this endpoint.
    // CF7 will route it to the correct form via `wpcf7` + field names.
    const formData = new FormData();

    // Required CF7 hidden fields
    formData.append("_wpcf7", "75");
    formData.append("_wpcf7_version", "6.1.6");
    formData.append("_wpcf7_locale", "en_US");
    formData.append("_wpcf7_unit_tag", "wpcf7-f75-p78-o1");
    formData.append("_wpcf7_container_post", "78");

    // Form fields
    formData.append("your-name", body["your-name"] || "");
    formData.append("your-email", body["your-email"] || "");
    formData.append("your-subject", body["your-subject"] || "");
    formData.append("your-message", body["your-message"] || "");

    const cf7ApiResponse = await fetch(
      `${wpBase}/wp-json/contact-form-7/v1/contact-forms/75/feedback`,
      {
        method: "POST",
        body: formData,
        cache: "no-store",
      },
    );

    const responseText = await cf7ApiResponse.text();

    console.log("CF7 Status:", cf7ApiResponse.status);
    console.log("CF7 Response:", responseText);

    cf7Response = responseText;

    if (!cf7ApiResponse.ok) {
      // Fallback to classic endpoint
      const fallback = await fetch(`${wpBase}/wp-admin/admin-ajax.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "wpcf7_submit",
          wpcf7: "01e2b9c",
          "your-name": body["your-name"] || "",
          "your-email": body["your-email"] || "",
          ...(body["your-subject"]
            ? { "your-subject": body["your-subject"] }
            : {}),
          ...(body["your-message"]
            ? { "your-message": body["your-message"] }
            : {}),
        }).toString(),
        cache: "no-store",
      });
      console.log("Fallback status:", fallback.status);
      const fallbackResponse = await fallback.text();

      console.log("Fallback status:", fallback.status);
      console.log("Fallback response:", fallbackResponse);

      cf7Response = fallbackResponse;
      cf7Status = fallback.ok ? "success" : "failed";
      success = fallback.ok;
      // include HTTP status for debugging

      return NextResponse.json({ ok: success, status: cf7Status });
    }

    if (!cf7ApiResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: "failed",
          response: await cf7ApiResponse.text(),
        },
        { status: cf7ApiResponse.status },
      );
    } else {
      cf7Response = await cf7ApiResponse.text();
      success = validateCF7Response(cf7Response);
      cf7Status = success ? "mail_sent" : "submission_failed";
      // include HTTP status for debugging
      /* addLog({
        name: body["your-name"],
        email: body["your-email"],
        subject: body["your-subject"] || "No subject",
        message: body["your-message"] || "No message",
        cf7Status,
        cf7Response: cf7Response.substring(0, 500),
        cf7HttpStatus: cf7ApiResponse.status,
        success,
      }); */
      return NextResponse.json({ ok: success, status: cf7Status });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";

    // Log the error
    /* addLog({
      name: "Unknown",
      email: "Unknown",
      subject: "Error",
      message: "Failed to process",
      cf7Status: "error",
      cf7Response: message,
      success: false,
      error: message,
    }); */

    return NextResponse.json(
      { ok: false, status: "error", error: message },
      { status: 500 },
    );
  }
}
