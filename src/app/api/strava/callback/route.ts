import { NextRequest, NextResponse } from "next/server";

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID ?? "";
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET ?? "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/settings?error=no_code", request.url));
  }

  try {
    const tokenRes = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(
        new URL("/settings?error=token_exchange_failed", request.url)
      );
    }

    const data = await tokenRes.json();

    // Pass tokens back to the client via URL params to store in localStorage
    const redirectUrl = new URL("/settings", request.url);
    redirectUrl.searchParams.set("strava_access_token", data.access_token);
    redirectUrl.searchParams.set("strava_refresh_token", data.refresh_token);
    redirectUrl.searchParams.set("strava_expires_at", data.expires_at.toString());
    redirectUrl.searchParams.set("strava_athlete_id", data.athlete?.id?.toString() ?? "");

    return NextResponse.redirect(redirectUrl.toString());
  } catch {
    return NextResponse.redirect(
      new URL("/settings?error=unknown", request.url)
    );
  }
}
