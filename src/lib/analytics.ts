import { challenges } from "@/challenges";
import type { PostHog } from "posthog-js/dist/module.no-external";

type ChallengeEvent = "challenge_answer_submitted" | "challenge_started";
type ChallengeAnswerOutcome = "completed" | "incorrect" | "intermediate";

const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN?.trim();
const apiHost = import.meta.env.VITE_POSTHOG_HOST?.trim();

let clientPromise: Promise<PostHog | null> | undefined;

function getClient(): Promise<PostHog | null> {
  if (!import.meta.env.PROD || !projectToken || !apiHost) return Promise.resolve(null);
  if (clientPromise) return clientPromise;

  clientPromise = import("posthog-js/dist/module.no-external")
    .then(({ default: posthog }) => {
      posthog.init(projectToken, {
        api_host: apiHost,
        defaults: "2026-05-30",
        cookieless_mode: "always",
        person_profiles: "never",
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        capture_exceptions: false,
        disable_session_recording: true,
        disable_surveys: true,
        advanced_disable_flags: true,
        advanced_disable_feature_flags: true,
        advanced_disable_feature_flags_on_first_load: true,
        save_campaign_params: false,
        save_referrer: false,
      });

      return posthog;
    })
    .catch(() => null);

  return clientPromise;
}

function captureChallengeEvent(event: ChallengeEvent, pathname: string, properties: Record<string, string> = {}) {
  const normalizedPath = pathname.replace(/\/$/, "");
  const challenge = challenges.find((candidate) => candidate.href === normalizedPath);
  if (!challenge) return;

  void getClient().then((client) => {
    client?.capture(event, {
      challenge_id: challenge.href.slice(1),
      challenge_path: challenge.href,
      challenge_title: challenge.title,
      ...properties,
    });
  });
}

export function captureChallengeStarted(pathname: string) {
  captureChallengeEvent("challenge_started", pathname);
}

export function captureChallengeAnswerSubmitted(pathname: string, outcome: ChallengeAnswerOutcome) {
  captureChallengeEvent("challenge_answer_submitted", pathname, { answer_outcome: outcome });
}
