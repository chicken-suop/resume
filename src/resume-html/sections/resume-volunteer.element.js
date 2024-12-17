import {
  renderExpandableArticle,
  setupExpandables,
} from '../utils/expandable.js';

class ResumeVolunteerElement extends HTMLElement {
  connectedCallback() {
    const volunteer = JSON.parse(this.attributes.volunteer.value);
    if (!volunteer.length) return;

    this.innerHTML = `
      <section id="volunteer">
        <h3>Volunteer</h3>
        <div class="stack">
          ${volunteer.map(work => renderExpandableArticle(work)).join('')}
        </div>
      </section>
    `;

    setupExpandables(this);
  }
}

customElements.define('resume-volunteer', ResumeVolunteerElement);
