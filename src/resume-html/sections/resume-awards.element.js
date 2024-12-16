class ResumeAwardsElement extends HTMLElement {
  connectedCallback() {
    const awards = JSON.parse(this.attributes.awards.value);
    this.innerHTML = `
      ${
        awards.length
          ? `
        <section id="awards">
          <h3>Awards</h3>
          <div class="stack">
            ${awards
              .map(
                award => `
              <article>
                <header>
                  <h4>${award.title}</h4>
                  <div class="meta">
                    ${award.awarder ? `<div>Awarded by <strong>${award.awarder}</strong></div>` : ''}
                    <time datetime="${award.date}">${award.date}</time>
                  </div>
                </header>
                ${award.summary ? `<p>${award.summary}</p>` : ''}
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

customElements.define('resume-awards', ResumeAwardsElement);
