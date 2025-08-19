import './projects.css';

class ResumeProjectsElement extends HTMLElement {
  connectedCallback() {
    const projects = JSON.parse(this.attributes.projects.value);
    this.innerHTML = `
      ${
        projects.length
          ? `
        <section id="projects">
          <h3>Projects</h3>
          <div class="stack">
            ${projects
              .map(
                project => `
              <article>
                <header>
                  <h4>${project.url ? `<a href="${project.url}">${project.name}</a>` : project.name}</h4>
                  <div class="meta">
                    <div>
                      ${project.roles ? `<strong>${project.roles.join(', ')}</strong>` : ''}
                      ${project.entity ? `at <strong>${project.entity}</strong>` : ''}
                    </div>
                    ${project.startDate ? `<div><time datetime="${project.startDate}">${project.startDate}</time></div>` : ''}
                    ${project.type ? `<div>${project.type}</div>` : ''}
                  </div>
                </header>
                ${project.description ? `<p>${project.description}</p>` : ''}
                ${
                  project.highlights?.length
                    ? `
                  <ul>
                    ${project.highlights.map(highlight => `<li><p>${highlight}</p></li>`).join('')}
                  </ul>
                `
                    : ''
                }
                ${
                  project.keywords?.length
                    ? `
                  <ul class="tag-list">
                    ${project.keywords.map(keyword => `<li>${keyword}</li>`).join('')}
                  </ul>
                `
                    : ''
                }
              </article>
            `,
              )
              .join('')}
          </div>
        </section>
      `
          : ''
      }`;
  }
}

customElements.define('resume-projects', ResumeProjectsElement);
