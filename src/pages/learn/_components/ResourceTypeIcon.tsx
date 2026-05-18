import {
  ArticleRounded,
  HeadphonesRounded,
  PlayCircleOutlineRounded,
  StarBorderRounded,
} from "@mui/icons-material";
import type { LearningResource } from "@/types/talents";

type ResourceTypeIconProps = {
  type: LearningResource["type"];
};

export function ResourceTypeIcon({ type }: ResourceTypeIconProps) {
  if (type === "Article") return <ArticleRounded fontSize="inherit" />;
  if (type === "Talk") return <PlayCircleOutlineRounded fontSize="inherit" />;
  if (type === "Podcast") return <HeadphonesRounded fontSize="inherit" />;
  return <StarBorderRounded fontSize="inherit" />;
}
