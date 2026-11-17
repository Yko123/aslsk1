import type { StepOwner } from "../project-types.ts";

const labels: Record<StepOwner, string> = { code: "Code", ai: "AI", you: "You" };
const titles: Record<StepOwner, string> = {
  code: "Plain code does this step: math, dates, sorting, checks.",
  ai: "An AI model does this step: reading, extracting, writing.",
  you: "The person using the site does this step.",
};

export default function OwnerBadge({ by }: { by: StepOwner }) {
  return (
    <span className={`owner owner-${by}`} title={titles[by]}>
      {labels[by]}
    </span>
  );
}
