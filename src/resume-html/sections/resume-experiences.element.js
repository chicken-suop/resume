import {
  renderExpandableArticle,
  setupExpandables,
} from '../utils/expandable.js';

class ResumeExperiencesElement extends HTMLElement {
  connectedCallback() {
    const works = JSON.parse(this.attributes.works.value);
    if (!works.length) return;

    this.innerHTML = `
      <section id="work">
        <h3>Work</h3>
        <div class="stack">
          ${works.map(work => renderExpandableArticle(work)).join('')}
        </div>
      </section>
    `;

    setupExpandables(this);
  }
}

customElements.define('resume-experiences', ResumeExperiencesElement);
