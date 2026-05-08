import { useMemo, useState, type ReactNode } from "react"
import { Button, Card } from "antd"
import {
  BookOutlined,
  CustomerServiceOutlined,
  PlayCircleOutlined,
  StarOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons"
import { DomainTag } from "../../components/common/DomainTag"
import { AppShell } from "../../components/layout/AppShell"
import { PageHeader } from "../../components/layout/PageHeader"
import { LEARNING_RESOURCES } from "../../data/resources"
import { useCurrentUser, useTalents } from "../../lib/talentsStore"
import { DOMAINS, type Domain, type LearningResource } from "../../types/talents"

type Filter = Domain | "All" | "For me"

export function LearnPage() {
  const currentUser = useCurrentUser()
  const talents = useTalents()
  const [filter, setFilter] = useState<Filter>("For me")

  const myTalentLabels = useMemo(() => {
    if (!currentUser) return new Set<string>()

    return new Set(
      currentUser.talents
        .map((id) => talents.find((talent) => talent.id === id)?.label)
        .filter((label): label is string => Boolean(label)),
    )
  }, [currentUser, talents])

  const resources = useMemo(() => {
    if (filter === "All") return LEARNING_RESOURCES
    if (filter === "For me") {
      return [...LEARNING_RESOURCES].sort((a, b) => {
        const aMatch = a.tags.filter((tag) => myTalentLabels.has(tag)).length
        const bMatch = b.tags.filter((tag) => myTalentLabels.has(tag)).length
        return bMatch - aMatch
      })
    }

    return LEARNING_RESOURCES.filter((resource) => resource.domain === filter)
  }, [filter, myTalentLabels])

  return (
    <AppShell>
      <PageHeader
        eyebrow="Library"
        title="Learn"
        description="Hand-picked reading, talks, and exercises - sorted to match your top talents."
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
  )
}

function ResourceCard({
  resource,
  matched,
}: {
  resource: LearningResource
  matched: string[]
}) {
  return (
    <Card className="resource-card">
      <div className="resource-meta">
        <DomainTag compact domain={resource.domain} />
        <span>
          {resourceIcon(resource.type)}
          {resource.type}
        </span>
        <time>{resource.minutes} min</time>
      </div>

      <h3>{resource.title}</h3>
      <p>{resource.source}</p>

      {matched.length > 0 && (
        <div className="resource-match">
          <strong>Matches your talents</strong>
          <span>{matched.join(" \u00B7 ")}</span>
        </div>
      )}

      <footer>
        <span>{resource.tags.slice(0, 2).join(" \u00B7 ")}</span>
        <strong>
          Open <ArrowUpOutlined rotate={45} />
        </strong>
      </footer>
    </Card>
  )
}

function resourceIcon(type: LearningResource["type"]): ReactNode {
  if (type === "Article") return <BookOutlined />
  if (type === "Talk") return <PlayCircleOutlined />
  if (type === "Podcast") return <CustomerServiceOutlined />
  return <StarOutlined />
}
