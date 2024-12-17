class ResumeVolunteerElement extends HTMLElement {
  connectedCallback() {
    const volunteer = JSON.parse(this.attributes.volunteer.value);
    if (!volunteer.length) return;

    this.innerHTML = `
      <section id="volunteer">
        <h3>Volunteer</h3>
        <div class="stack">
          ${volunteer
            .map(
              work => `
              <article class="expandable">
                <button class="expandable-header" aria-expanded="false" aria-label="Toggle details">
                  <div>
                    <h4>
                      <span class="position">${work.position}</span>
                      <span class="company">
                        ${work.organization || work.company}
                        ${
                          work.url
                            ? `
                          <a href="${work.url}" onclick="event.stopPropagation()" class="company-url" title="Visit website">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </a>
                        `
                            : ''
                        }
                      </span>
                    </h4>
                    <div class="meta">
                      <div>
                        <time-duration>
                          <time datetime="${work.startDate}">${work.startDate}</time>
                          ${work.endDate ? `– <time datetime="${work.endDate}">${work.endDate}</time>` : '– Present'}
                        </time-duration>
                      </div>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="expand-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div class="expandable-content">
                  ${work.summary ? `<p>${work.summary}</p>` : ''}
                  ${
                    work.highlights?.length
                      ? `
                    <ul>
                      ${work.highlights.map(highlight => `<li><p>${highlight}</p></li>`).join('')}
                    </ul>
                  `
                      : ''
                  }
                </div>
              </article>
            `,
            )
            .join('')}
        </div>
      </section>
    `;

    this.setupExpandables();
  }

  setupExpandables() {
    this.querySelectorAll('.expandable').forEach(expandable => {
      const header = expandable.querySelector('.expandable-header');

      header.addEventListener('click', () => {
        const isExpanded = expandable.classList.toggle('expanded');
        header.setAttribute('aria-expanded', isExpanded);
      });
    });
  }
}

customElements.define('resume-volunteer', ResumeVolunteerElement);
