import './awards.css';

class ResumeAwardsElement extends HTMLElement {
  connectedCallback() {
    const awards = JSON.parse(this.attributes.awards.value);
    this.innerHTML = `
      ${
        awards.length
          ? `
        <section id="awards">
          <h3>Awards</h3>
          <div class="grid-list">
            ${awards
              .map(
                award => `
              <div class="award-item">
                <h5>${award.title}</h5>
                <div class="meta">
                  <time datetime="${award.date}">${this.formatDate(award.date)}</time>
                </div>
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

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.getFullYear();
  }
}

customElements.define('resume-awards', ResumeAwardsElement);
