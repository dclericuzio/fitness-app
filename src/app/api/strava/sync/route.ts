import { NextRequest, NextResponse } from "next/server";

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID ?? "";
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET ?? "";

async function refreshToken(refreshToken: string) {
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error("Failed to refresh token");
  return res.json();
}

export async function GET(request: NextRequest) {
  const accessToken = request.headers.get("x-strava-access-token");
  const refreshTokenStr = request.headers.get("x-strava-refresh-token");
  const expiresAt = request.headers.get("x-strava-expires-at");

  if (!accessToken || !refreshTokenStr) {
    return NextResponse.json({ error: "Not connected" }, { status: 401 });
  }

  let token = accessToken;
  let newTokenData = null;

  // Check if token is expired
  if (expiresAt && Date.now() / 1000 > parseInt(expiresAt)) {
    try {
      newTokenData = await refreshToken(refreshTokenStr);
      token = newTokenData.access_token;
    } catch {
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: 401 }
      );
    }
  }

  try {
    const res = await fetch(
      "https://www.strava.com/api/v3/athlete/activities?per_page=50",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Strava API error" },
        { status: res.status }
      );
    }

    const rawActivities = await res.json();

    // Filter to runs only and map to our format
    const runs = rawActivities
      .filter((a: Record<string, unknown>) => a.type === "Run")
      .map((a: Record<string, unknown>) => ({
        id: `strava_${a.id}`,
        stravaId: a.id,
        name: a.name,
        date: a.start_date_local,
        distanceMeters: a.distance,
        movingTimeSeconds: a.moving_time,
        elapsedTimeSeconds: a.elapsed_time,
        averagePaceSecondsPerKm:
          (a.distance as number) > 0
            ? ((a.moving_time as number) / (a.distance as number)) * 1000
            : 0,
        averageHeartRate: a.average_heartrate ?? null,
        maxHeartRate: a.max_heartrate ?? null,
        totalElevationGain: a.total_elevation_gain ?? 0,
        mapPolyline:
          (a.map as Record<string, unknown>)?.summary_polyline ?? null,
      }));

    return NextResponse.json({
      activities: runs,
      ...(newTokenData
        ? {
            newToken: {
              accessToken: newTokenData.access_token,
              refreshToken: newTokenData.refresh_token,
              expiresAt: newTokenData.expires_at,
            },
          }
        : {}),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
