export type Member = {
  name: string;
  role: string;
  bio: string;
  initials: string;
  /** Optional portrait under /public/team; the card shows a monogram until one is added. */
  photo?: string;
};

/** Roles and bios are placeholders awaiting the client; names are as supplied. */
export const team: Member[] = [
  {
    name: "Arc. Sadiq Babagana",
    role: "Principal Architect",
    initials: "SB",
    bio: "Sets the design direction on every DOPRES project and sees it through from first sketch to handover.",
  },
  {
    name: "Arc. Hakim",
    role: "Architect",
    initials: "H",
    bio: "Turns briefs into buildable drawings and keeps detail, cost and programme in step on site.",
  },
  {
    name: "Arc. Albakir",
    role: "Architect",
    initials: "A",
    bio: "Leads design development and coordination with engineers and contractors through construction.",
  },
];
