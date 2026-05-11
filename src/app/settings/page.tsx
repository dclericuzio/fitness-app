import { Suspense } from "react";
import SettingsView from "@/components/settings/SettingsView";
import StravaCallbackHandler from "@/components/settings/StravaCallbackHandler";

export default function SettingsPage() {
  return (
    <>
      <Suspense fallback={null}>
        <StravaCallbackHandler />
      </Suspense>
      <SettingsView />
    </>
  );
}
