import { NextResponse } from "next/server";

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID ?? "";
const REDIRECT_URI =
  process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/strava/callback`
    : "http://localhost:3000/api/strava/callback";

export async function GET() {
  if (!STRAVA_CLIENT_ID) {
    return NextResponse.json(
      { error: "Strava client ID not configured" },
      { status: 500 }
    );
  }

  const authUrl = new URL("https://www.strava.com/oauth/authorize");
  authUrl.searchParams.set("client_id", STRAVA_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "activity:read_all");
  authUrl.searchParams.set("approval_prompt", "auto");

  return NextResponse.redirect(authUrl.toString());
}
