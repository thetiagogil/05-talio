import {
  BookOutlined,
  CustomerServiceOutlined,
  PlayCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Card } from "antd";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { DomainTag } from "../components/common/DomainTag";
import { AppShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { LEARNING_RESOURCES } from "../data/resources";
import { DOMAINS } from "../lib/constants/talentConstants";
import { domainStyle } from "../lib/utils/styleUtils";
import { useCurrentUser } from "../services/authService";
import { useTalents } from "../services/workspaceService";
import type { Domain, LearningResource } from "../types/talents";

type Filter = Domain | "All" | "For me";

export function LearnPage() {
  const currentUser = useCurrentUser();
  const talents = useTalents();
  const [filter, setFilter] = useState<Filter>("For me");

  const myTalentLabels = useMemo(() => {
    if (!currentUser) return new Set<string>();

    return new Set(
      currentUser.talents
        .map((id) => talents.find((talent) => talent.id === id)?.label)
        .filter((label): label is string => Boolean(label)),
    );
  }, [currentUser, talents]);

  const resources = useMemo(() => {
    if (filter === "All") return LEARNING_RESOURCES;
    if (filter === "For me") {
      return [...LEARNING_RESOURCES].sort((a, b) => {
        const aMatch = a.tags.filter((tag) => myTalentLabels.has(tag)).length;
        const bMatch = b.tags.filter((tag) => myTalentLabels.has(tag)).length;
        return bMatch - aMatch;
      });
    }

    return LEARNING_RESOURCES.filter((resource) => resource.domain === filter);
  }, [filter, myTalentLabels]);

  return (
    <AppShell>
      <PageHeader
        title="Learn"
        description="Learning paths that connect strengths to practical formats: reading, talks, podcasts, and exercises."
      />

      <div className="page-content">
        <div className="wide-content">
          <div className="resource-filters">
            {(["For me", "All", ...DOMAINS] as const).map((item) => (
              <Button
                className={filter === item ? "active" : undefined}
                key={item}
                shape="round"
                onClick={() => setFilter(item)}
              >
                {item}
              </Button>
            ))}
          </div>

          <div className="resources-grid">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                matched={resource.tags.filter((tag) => myTalentLabels.has(tag))}
                resource={resource}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ResourceCard({
  resource,
  matched,
}: {
  resource: LearningResource;
  matched: string[];
}) {
  const style = domainStyle(resource.domain);
  const cardStyle = {
    "--resource-accent": style.base,
    "--resource-soft": style.soft,
  } as CSSProperties;

  return (
    <Card className="resource-card" style={cardStyle}>
      <div className="resource-card-top">
        <DomainTag compact domain={resource.domain} />
        <span className="resource-format">
          {resourceIcon(resource.type)}
          {resource.type}
        </span>
        <time>{resource.minutes} min</time>
      </div>

      <h3>{resource.title}</h3>
      <p>{resource.source}</p>

      <footer>
        <span>Supports</span>
        <div>
          {(matched.length > 0 ? matched : resource.tags.slice(0, 3)).map(
            (tag) => (
              <small key={tag}>{tag}</small>
            ),
          )}
        </div>
      </footer>
    </Card>
  );
}

function resourceIcon(type: LearningResource["type"]): ReactNode {
  if (type === "Article") return <BookOutlined />;
  if (type === "Talk") return <PlayCircleOutlined />;
  if (type === "Podcast") return <CustomerServiceOutlined />;
  return <StarOutlined />;
}
