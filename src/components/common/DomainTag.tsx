import type { Domain } from "../../types/talents";
import { domainStyle } from "../../lib/utils/styleUtils";

type DomainTagProps = {
  domain: Domain;
  label?: string;
  compact?: boolean;
};

export function DomainTag({ domain, label = domain, compact }: DomainTagProps) {
  const style = domainStyle(domain);

  return (
    <span
      className={compact ? "domain-tag domain-tag-compact" : "domain-tag"}
      style={{ background: style.soft, color: style.text }}
    >
      <span className="domain-dot" style={{ background: style.base }} />
      {label}
    </span>
  );
}
