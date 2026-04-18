import { Section } from "./Section";
import { SkillSystemMap } from "./SkillSystemMap";

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="02 - Skills"
      title="System layers."
      sub="Backend, data, AI, and production capabilities mapped as one connected stack."
    >
      <SkillSystemMap />
    </Section>
  );
}
