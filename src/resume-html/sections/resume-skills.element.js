class ResumeSkillsElement extends HTMLElement {
  connectedCallback() {
    const skills = JSON.parse(this.attributes.skills.value);
    const languages = JSON.parse(this.attributes.languages.value);

    this.innerHTML = `
      ${
        skills.length
          ? `
        <section id="skills">
          <h3>Skills</h3>
          <div class="grid-list">
            ${skills
              .map(
                skill => `
              <div>
                <h4>${skill.name}</h4>
                ${
                  skill.keywords?.length
                    ? `
                  <ul class="tag-list">
                    ${skill.keywords.map(keyword => `<li>${keyword}</li>`).join('')}
                  </ul>
                `
                    : ''
                }
              </div>
            `,
              )
              .join('')}
          </div>
        </section>
      `
          : ''
      }

      ${
        languages.length
          ? `
        <section id="languages">
          <h3>Languages</h3>
          <div class="grid-list">
            ${languages
              .map(
                language => `
              <div>
                <h4>${language.language}</h4>
                ${language.fluency}
              </div>
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

customElements.define('resume-skills', ResumeSkillsElement);
