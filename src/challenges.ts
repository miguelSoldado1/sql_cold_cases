export const SITE_NAME = "SQL Cold Cases";

export function getSocialImageUrl(siteUrl: string) {
  return `${siteUrl}/web-app-manifest-512x512.png`;
}

export const HOME_DESCRIPTION =
  "Practice SQL with interactive murder, cyberpunk, and undersea mysteries. Explore schemas, query real SQLite databases, and solve every cold case.";

export const challenges = [
  {
    href: "/murder_mystery_i",
    title: "SQL Murder Mystery I",
    description:
      "Investigate a murder in SQL City by exploring police records, interviewing witnesses, and following the evidence with SQL queries.",
  },
  {
    href: "/murder_mystery_ii",
    title: "SQL Murder Mystery II",
    description:
      "Return to SQL City and investigate a murder at the Get Fit Now gym by connecting witnesses, vehicles, interviews, and event records.",
  },
  {
    href: "/cyberpunk_mystery_i",
    title: "Cyberpunk Mystery I",
    description:
      "Track a stolen AI Core through Neo-Tokyo using device telemetry, neural implants, crypto transactions, and location logs.",
  },
  {
    href: "/cyberpunk_mystery_ii",
    title: "Cyberpunk Mystery II",
    description:
      "Investigate the Aegis Station blackout and trace a stolen AI through ghost-drive telemetry, access records, and crypto payments.",
  },
  {
    href: "/cyberpunk_mystery_iii",
    title: "Cyberpunk Mystery III",
    description:
      "Uncover who hijacked Neo-Tokyo's Mirror Array by connecting twin device signatures, implant records, and interrogation logs.",
  },
  {
    href: "/undersea_mystery_i",
    title: "Undersea Mystery I",
    description:
      "Investigate a missing replacement pump aboard an undersea station using cargo, access, work-order, and override records.",
  },
  {
    href: "/undersea_mystery_ii",
    title: "Undersea Mystery II",
    description:
      "Trace the witnesses, perpetrator, and mastermind behind a catastrophic life-support sabotage at Deep Horizon Station.",
  },
] as const;

export interface PageMetadata {
  canonicalUrl: string;
  description: string;
  path: string;
  robots: string;
  title: string;
}

export function getIndexablePages(siteUrl: string): readonly PageMetadata[] {
  return [
    {
      path: "/",
      title: SITE_NAME,
      description: HOME_DESCRIPTION,
      canonicalUrl: `${siteUrl}/`,
      robots: "index, follow, max-image-preview:large",
    },
    ...challenges.map((challenge) => ({
      path: challenge.href,
      title: `${challenge.title} | ${SITE_NAME}`,
      description: challenge.description,
      canonicalUrl: `${siteUrl}${challenge.href}`,
      robots: "index, follow, max-image-preview:large",
    })),
  ];
}

export function getChallenge(path: (typeof challenges)[number]["href"]) {
  const challenge = challenges.find((candidate) => candidate.href === path);

  if (!challenge) {
    throw new Error(`Missing challenge metadata for ${path}`);
  }

  return challenge;
}

export function getPageMetadata(pathname: string, siteUrl: string): PageMetadata {
  const normalizedPath = pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;
  const page = getIndexablePages(siteUrl).find((candidate) => candidate.path === normalizedPath);

  if (page) return page;

  return {
    path: normalizedPath,
    title: `Page Not Found | ${SITE_NAME}`,
    description: HOME_DESCRIPTION,
    canonicalUrl: `${siteUrl}${normalizedPath}`,
    robots: "noindex, nofollow",
  };
}
