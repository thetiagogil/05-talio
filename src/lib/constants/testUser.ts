import type { User } from "../../types/talents"

export const TEST_USER: User = {
  id: "u-test",
  name: "Alex Morgan",
  email: "test@talio.local",
  role: "Product",
  avatar: "\u{1F9D1}\u200D\u{1F680}",
  manual: {
    about:
      "I think out loud and I'm energized by collaborative conversations. Mornings are my deep-work time.",
    needs: "Clear goals, room to experiment, and honest, early feedback.",
    feedback:
      "Direct and specific. Tell me what worked, what didn't, and what you'd try next.",
    happiness:
      "When I'm shaping ambiguous problems into a roadmap the team can rally behind.",
    passions: "Trail running, indie sci-fi, and learning to play the piano badly.",
  },
  talents: [19, 21, 7, 24, 16, 18, 1, 22, 13, 8],
}
