class ResumeEducationElement extends HTMLElement {
  connectedCallback() {
    const educations = JSON.parse(this.attributes.educations.value);
    this.innerHTML = `
      <section id="education">
        <h3>Education</h3>
        <div class="stack">
          ${educations
            .map(
              education => `
            <article>
              <header>
                <h4>${education.url ? `<a href="${education.url}">${education.institution}</a>` : education.institution}</h4>
                <div class="meta">
                  <strong>${education.area}</strong>
                  <div>
                    <time-duration>
                      <time datetime="${education.startDate}">${education.startDate}</time>
                      ${education.endDate ? `– <time datetime="${education.endDate}">${education.endDate}</time>` : '– Present'}
                    </time-duration>
                  </div>
                </div>
              </header>
              ${education.studyType ? `<p>${education.studyType}</p>` : ''}
              ${
                education.courses?.length
                  ? `
                <h5>Courses</h5>
                <ul>
                  ${education.courses.map(course => `<li><p>${course}</p></li>`).join('')}
                </ul>
              `
                  : ''
              }
            </article>
          `,
            )
            .join('')}
        </div>
      </section>`;
  }
}

customElements.define('resume-education', ResumeEducationElement);
