import { projects } from "../data/profile";
import { ProjectCaseStudy } from "./ProjectCaseStudy";
import { Section } from "./Section";

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="03 - Projects"
      title="Selected projects."
      sub="Three honest project cards shaped for quick scanning, deeper detail, and clean status signaling."
    >
      <div className="project-case-grid">
        {projects.map((project, index) => (
          <ProjectCaseStudy key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}
