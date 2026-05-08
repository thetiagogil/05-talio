import { useMemo } from "react"
import { Button, Card, Table } from "antd"
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons"
import { AvatarBubble } from "../../components/common/AvatarBubble"
import { DomainTag } from "../../components/common/DomainTag"
import { EmptyState } from "../../components/common/EmptyState"
import { DOMAINS, type Domain, type Talent, type User } from "../../types/talents"
import { shortDomain } from "../../lib/styles"

const palette = ["#5b6cf6", "#ef8a4a", "#3eb6a3", "#c45cb0", "#f5b454"]

type ComparePanelProps = {
  selected: User[]
  talents: Talent[]
  onRemove: (id: string) => void
  onClear: () => void
}

type CombinedTalentRow = {
  key: number
  talent: Talent
  count: number
}

export function ComparePanel({
  selected,
  talents,
  onRemove,
  onClear,
}: ComparePanelProps) {
  const radarData = useMemo(
    () =>
      DOMAINS.map((domain) => ({
        domain,
        label: shortDomain(domain),
        values: selected.map((user) => ({
          userId: user.id,
          userName: user.name,
          score: user.talents.reduce((sum, talentId, index) => {
            const talent = talents.find((candidate) => candidate.id === talentId)
            if (!talent || talent.category !== domain) return sum
            return sum + (10 - index)
          }, 0),
        })),
      })),
    [selected, talents],
  )

  const combinedTalents = useMemo<CombinedTalentRow[]>(() => {
    const counts = new Map<number, number>()

    selected.forEach((user) => {
      user.talents.forEach((talentId) => {
        counts.set(talentId, (counts.get(talentId) ?? 0) + 1)
      })
    })

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0] - b[0])
      .slice(0, 5)
      .map(([id, count]) => {
        const talent = talents.find((candidate) => candidate.id === id)
        return talent ? { key: talent.id, talent, count } : null
      })
      .filter((item): item is CombinedTalentRow => Boolean(item))
  }, [selected, talents])

  if (selected.length === 0) {
    return (
      <EmptyState
        className="large-empty"
        title="No one selected yet"
        description="Pick up to 5 teammates to compare strengths and overlaps."
      />
    )
  }

  return (
    <div className="compare-panel">
      <Card className="compare-chips-card">
        <div className="compare-chips">
          {selected.map((user, index) => (
            <span
              className="compare-chip"
              key={user.id}
              style={{
                background: `${palette[index]}22`,
                color: palette[index],
              }}
            >
              <AvatarBubble value={user.avatar} size={24} />
              {user.name}
              <button type="button" onClick={() => onRemove(user.id)}>
                <CloseOutlined />
              </button>
            </span>
          ))}
          <Button
            className="compare-clear"
            icon={<DeleteOutlined />}
            size="small"
            type="text"
            onClick={onClear}
          >
            Clear all
          </Button>
        </div>
      </Card>

      <Card className="panel-card compare-radar-card">
        <h3>Domain comparison</h3>
        <p>Weighted strength by talent rank.</p>
        <RadarPlot data={radarData} users={selected} />
      </Card>

      <Card className="panel-card">
        <h3>Combined top talents</h3>
        <p>What this group brings, needs, and is motivated by.</p>
        <Table
          className="combined-talents-table"
          dataSource={combinedTalents}
          pagination={false}
          columns={[
            {
              title: "Talent",
              dataIndex: "talent",
              render: (talent: Talent, row: CombinedTalentRow) => (
                <div className="combined-talent-cell">
                  <DomainTag compact domain={talent.category} label={talent.label} />
                  <span>
                    {row.count} of {selected.length}
                  </span>
                </div>
              ),
            },
            {
              title: "Brings",
              dataIndex: ["talent", "details", "bring"],
            },
            {
              title: "Needs",
              dataIndex: ["talent", "details", "need"],
            },
            {
              title: "Motivated by",
              dataIndex: ["talent", "details", "motivate"],
            },
          ]}
        />
      </Card>
    </div>
  )
}

function RadarPlot({
  data,
  users,
}: {
  data: {
    domain: Domain
    label: string
    values: { userId: string; userName: string; score: number }[]
  }[]
  users: User[]
}) {
  const size = 320
  const center = size / 2
  const radius = 108
  const maxScore = Math.max(
    1,
    ...data.flatMap((row) => row.values.map((value) => value.score)),
  )

  function point(index: number, score: number, scale = 1) {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2
    const distance = radius * scale * (score / maxScore)

    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    }
  }

  function labelPoint(index: number) {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2

    return {
      x: center + Math.cos(angle) * (radius + 28),
      y: center + Math.sin(angle) * (radius + 28),
    }
  }

  return (
    <div className="radar-wrap">
      <svg aria-label="Domain comparison chart" viewBox={`0 0 ${size} ${size}`}>
        {[0.25, 0.5, 0.75, 1].map((scale) => {
          const points = data
            .map((_, index) => {
              const next = point(index, maxScore, scale)
              return `${next.x},${next.y}`
            })
            .join(" ")

          return <polygon className="radar-grid" key={scale} points={points} />
        })}

        {data.map((row, index) => {
          const axis = point(index, maxScore)
          const label = labelPoint(index)

          return (
            <g key={row.domain}>
              <line className="radar-axis" x1={center} y1={center} x2={axis.x} y2={axis.y} />
              <text className="radar-label" x={label.x} y={label.y}>
                {row.label}
              </text>
            </g>
          )
        })}

        {users.map((user, userIndex) => {
          const points = data
            .map((row, index) => {
              const score =
                row.values.find((value) => value.userId === user.id)?.score ?? 0
              const next = point(index, score)
              return `${next.x},${next.y}`
            })
            .join(" ")

          return (
            <polygon
              className="radar-user"
              key={user.id}
              points={points}
              style={{
                fill: palette[userIndex],
                stroke: palette[userIndex],
              }}
            />
          )
        })}
      </svg>

      <div className="radar-legend">
        {users.map((user, index) => (
          <span key={user.id}>
            <i style={{ background: palette[index] }} />
            {user.name}
          </span>
        ))}
      </div>
    </div>
  )
}
