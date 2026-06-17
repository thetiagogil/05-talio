import {
  ArticleRounded,
  EmojiEventsRounded,
  FavoriteBorderRounded,
  StarBorderRounded,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import { ActivityFeed } from "@/features/activity/components/ActivityFeed";
import { ActivityStat } from "./ActivityStat";
import { useActivityPageModel } from "../hooks/useActivityPageModel";
import type { ActivityTab } from "../ActivityPage";

type ActivityDashboardProps = {
  activeTab: ActivityTab;
};

export const ActivityDashboard = ({ activeTab }: ActivityDashboardProps) => {
  const { filterActivity, stats } = useActivityPageModel(activeTab);

  return (
    <Box
      sx={{
        display: "grid",
        width: "min(100%, 56rem)",
        mx: "auto",
        gap: "1.5rem",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: "0.75rem",
        }}
      >
        <ActivityStat
          tone="accent"
          icon={<FavoriteBorderRounded />}
          label="Kudos this week"
          value={stats.kudos}
        />
        <ActivityStat
          tone="done"
          icon={<EmojiEventsRounded />}
          label="Goals completed"
          value={stats.goalsCompleted}
        />
        <ActivityStat
          tone="relationship"
          icon={<ArticleRounded />}
          label="Manual updates"
          value={stats.manuals}
        />
        <ActivityStat
          tone="strategic"
          icon={<StarBorderRounded />}
          label="Teammates active"
          value={`${stats.active}/${stats.userCount}`}
        />
      </Box>

      <ActivityFeed filter={filterActivity} />
    </Box>
  );
};
