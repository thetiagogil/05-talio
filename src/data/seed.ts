import { SEED_TALENTS } from "./talents"
import { TEST_USER } from "../lib/constants/testUser"
import type { ActivityEvent, Goal, Kudos, User } from "../types/talents"

const pick = (...ids: number[]) => ids

const avatar = {
  sofia: "\u{1F469}\u200D\u{1F3A8}",
  marcus: "\u{1F468}\u200D\u{1F4BB}",
  priya: "\u{1F469}\u200D\u{1F4BC}",
  jordan: "\u{1F9D1}\u200D\u{1F52C}",
  lena: "\u{1F469}\u200D\u{1F680}",
  diego: "\u{1F9D1}\u200D\u{1F3A4}",
  ava: "\u{1F469}\u200D\u{1F3EB}",
}

export type SeedState = {
  users: User[]
  talents: typeof SEED_TALENTS
  goals: Goal[]
  kudos: Kudos[]
  activity: ActivityEvent[]
}

export function createSeedState(): SeedState {
  const now = Date.now()
  const day = 86400000

  const users: User[] = [
    TEST_USER,
    {
      id: "u-2",
      name: "Sofia Reyes",
      email: "sofia@talents.app",
      role: "Designer",
      avatar: avatar.sofia,
      manual: {
        about:
          "Quietly observant. I do my best work when I have a clear brief and a few hours of uninterrupted time.",
        needs: "Context, references, and a clear definition of done.",
        feedback:
          "Slack me a Loom. I love async, specific feedback I can rewatch.",
        happiness: "Designing systems that other designers can build on.",
        passions: "Ceramics, slow cooking, and museum benches.",
      },
      talents: pick(21, 13, 22, 17, 20, 14, 15, 7, 16, 3),
    },
    {
      id: "u-3",
      name: "Marcus Chen",
      email: "marcus@talents.app",
      role: "Developer",
      avatar: avatar.marcus,
      manual: {
        about:
          "Pragmatic engineer. I prefer shipping a small thing today over a perfect thing next month.",
        needs: "A real user problem and freedom to choose the tools.",
        feedback:
          "Pull requests with comments work great. Be blunt. I won't take it personally.",
        happiness: "When latency drops and a graph quietly goes the right direction.",
        passions: "Bouldering, mechanical keyboards, and bad puns.",
      },
      talents: pick(3, 23, 1, 4, 19, 2, 20, 6, 22, 10),
    },
    {
      id: "u-4",
      name: "Priya Nair",
      email: "priya@talents.app",
      role: "Operations",
      avatar: avatar.priya,
      manual: {
        about:
          "I love turning chaos into checklists. I'm at my best when juggling many threads at once.",
        needs: "Trust, autonomy, and a single source of truth.",
        feedback: "A 1:1 over coffee is my preferred setting.",
        happiness: "When systems hum and nobody has to think about them.",
        passions: "Tabletop games and 5am yoga.",
      },
      talents: pick(5, 2, 4, 1, 14, 15, 6, 16, 18, 13),
    },
    {
      id: "u-5",
      name: "Jordan Blake",
      email: "jordan@talents.app",
      role: "Developer",
      avatar: avatar.jordan,
      manual: emptyManual(),
      talents: pick(20, 22, 23, 21, 19, 3, 24, 17, 13, 4),
    },
    {
      id: "u-6",
      name: "Lena Park",
      email: "lena@talents.app",
      role: "Product",
      avatar: avatar.lena,
      manual: {
        about:
          "Curious by default. I ask a lot of questions before I form an opinion.",
        needs: "Customer access and a willingness to kill darlings.",
        feedback: "Write it in the doc. I'll respond thoughtfully there.",
        happiness: "When discovery clarifies a hard tradeoff.",
        passions: "Long walks, jazz piano, and bookshops.",
      },
      talents: pick(7, 8, 11, 12, 18, 19, 21, 13, 16, 24),
    },
    {
      id: "u-7",
      name: "Diego Alvarez",
      email: "diego@talents.app",
      role: "Designer",
      avatar: avatar.diego,
      manual: emptyManual(),
      talents: pick(21, 24, 7, 11, 8, 18, 13, 17, 15, 20),
    },
    {
      id: "u-8",
      name: "Ava Thompson",
      email: "ava@talents.app",
      role: "Operations",
      avatar: avatar.ava,
      manual: {
        about: "Calm under pressure. I make space for everyone to contribute.",
        needs: "Clear meeting agendas and time to prepare.",
        feedback: "In person, please. I read tone better than text.",
        happiness:
          "When a tough conversation ends with the team closer than before.",
        passions: "Choir, hiking, and sourdough.",
      },
      talents: pick(14, 15, 13, 16, 18, 17, 4, 2, 22, 7),
    },
  ]

  const goals: Goal[] = [
    {
      id: 1,
      userId: "u-test",
      talentId: 19,
      description: "Map out a 6-month strategic vision for the team",
      progress: "Doing",
      approved: false,
      createdAt: now - 6 * day,
    },
    {
      id: 2,
      userId: "u-test",
      talentId: 16,
      description: "Run weekly mentoring sessions with a junior PM",
      progress: "To do",
      approved: false,
      createdAt: now - 4 * day,
    },
    {
      id: 3,
      userId: "u-test",
      talentId: 7,
      description: "Lead the all-hands talk on Q2 priorities",
      progress: "Done",
      approved: true,
      createdAt: now - 14 * day,
      approvedBy: "u-4",
    },
    {
      id: 4,
      userId: "u-test",
      talentId: 21,
      description: "Run an ideation workshop for the new product line",
      progress: "Done",
      approved: false,
      createdAt: now - 2 * day,
      approvalRequests: ["u-4", "u-6"],
    },
    {
      id: 5,
      userId: "u-test",
      talentId: 22,
      description: "Build a curated reading list for the team",
      progress: "To do",
      approved: false,
      createdAt: now - day,
    },
    {
      id: 6,
      userId: "u-3",
      talentId: 3,
      description: "Cut p95 latency on the search endpoint by 30%",
      progress: "Doing",
      approved: false,
      createdAt: now - 3 * day,
    },
    {
      id: 7,
      userId: "u-2",
      talentId: 21,
      description: "Refresh the design system documentation site",
      progress: "Done",
      approved: false,
      createdAt: now - day,
      approvalRequests: ["u-test", "u-6"],
    },
    {
      id: 8,
      userId: "u-4",
      talentId: 5,
      description: "Standardize the team onboarding playbook",
      progress: "Doing",
      approved: false,
      createdAt: now - 8 * day,
    },
  ]

  const kudos: Kudos[] = [
    {
      id: 1,
      fromId: "u-2",
      toId: "u-test",
      talentId: 19,
      message: "Your strategic clarity made our last roadmap session click.",
      createdAt: now - 3 * day,
    },
    {
      id: 2,
      fromId: "u-4",
      toId: "u-3",
      talentId: 1,
      message: "You shipped three things this week. Quietly heroic.",
      createdAt: now - 2 * day,
    },
    {
      id: 3,
      fromId: "u-test",
      toId: "u-2",
      talentId: 13,
      message: "Thanks for hearing me out on the redesign. It really helped.",
      createdAt: now - day,
    },
  ]

  const activity: ActivityEvent[] = [
    {
      id: 1,
      type: "kudos_sent",
      actorId: "u-2",
      targetId: "u-test",
      talentId: 19,
      message: "Your strategic clarity made our last roadmap session click.",
      createdAt: now - 3 * day,
    },
    {
      id: 2,
      type: "goal_completed",
      actorId: "u-test",
      goalId: 3,
      createdAt: now - 14 * day,
    },
    {
      id: 3,
      type: "goal_approved",
      actorId: "u-4",
      targetId: "u-test",
      goalId: 3,
      createdAt: now - 13 * day,
    },
    {
      id: 4,
      type: "manual_updated",
      actorId: "u-6",
      createdAt: now - 2 * day,
    },
    {
      id: 5,
      type: "goal_created",
      actorId: "u-3",
      goalId: 6,
      createdAt: now - 3 * day,
    },
    {
      id: 6,
      type: "kudos_sent",
      actorId: "u-4",
      targetId: "u-3",
      talentId: 1,
      message: "You shipped three things this week. Quietly heroic.",
      createdAt: now - 2 * day,
    },
    {
      id: 7,
      type: "joined",
      actorId: "u-7",
      createdAt: now - 30 * day,
    },
  ]

  return {
    users,
    talents: SEED_TALENTS,
    goals,
    kudos,
    activity,
  }
}

function emptyManual() {
  return {
    about: "",
    needs: "",
    feedback: "",
    happiness: "",
    passions: "",
  }
}
