"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { updateSettings } from "@/lib/store";

export default function StravaCallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get("strava_access_token");
    const refreshToken = searchParams.get("strava_refresh_token");
    const expiresAt = searchParams.get("strava_expires_at");
    const athleteId = searchParams.get("strava_athlete_id");

    if (accessToken && refreshToken) {
      updateSettings({
        stravaAccessToken: accessToken,
        stravaRefreshToken: refreshToken,
        stravaExpiresAt: expiresAt ? parseInt(expiresAt) : null,
        stravaAthleteId: athleteId ? parseInt(athleteId) : null,
      });
      router.replace("/settings");
    }
  }, [searchParams, router]);

  return null;
}
