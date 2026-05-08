import type { Domain, Progress } from "../../types/talents"

export type DomainStyle = {
  base: string
  soft: string
  text: string
  border: string
}

export type ProgressStyle = {
  base: string
  soft: string
  text: string
}

export function domainStyle(domain: Domain): DomainStyle {
  switch (domain) {
    case "Executing":
      return {
        base: "var(--domain-executing)",
        soft: "var(--domain-executing-soft)",
        text: "var(--domain-executing)",
        border: "var(--domain-executing)",
      }
    case "Influencing":
      return {
        base: "var(--domain-influencing)",
        soft: "var(--domain-influencing-soft)",
        text: "var(--domain-influencing)",
        border: "var(--domain-influencing)",
      }
    case "Relationship Building":
      return {
        base: "var(--domain-relationship)",
        soft: "var(--domain-relationship-soft)",
        text: "var(--domain-relationship)",
        border: "var(--domain-relationship)",
      }
    case "Strategic Thinking":
      return {
        base: "var(--domain-strategic)",
        soft: "var(--domain-strategic-soft)",
        text: "var(--domain-strategic)",
        border: "var(--domain-strategic)",
      }
  }
}

export function progressStyle(progress: Progress): ProgressStyle {
  switch (progress) {
    case "To do":
      return {
        base: "var(--progress-todo)",
        soft: "var(--progress-todo-soft)",
        text: "var(--progress-todo)",
      }
    case "Doing":
      return {
        base: "var(--progress-doing)",
        soft: "var(--progress-doing-soft)",
        text: "var(--progress-doing)",
      }
    case "Done":
      return {
        base: "var(--progress-done)",
        soft: "var(--progress-done-soft)",
        text: "var(--progress-done)",
      }
  }
}

export function shortDomain(domain: Domain): string {
  if (domain === "Relationship Building") return "Relationships"
  if (domain === "Strategic Thinking") return "Strategy"
  return domain
}
