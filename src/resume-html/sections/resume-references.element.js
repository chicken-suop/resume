class ResumeReferencesElement extends HTMLElement {
  connectedCallback() {
    const references = JSON.parse(this.attributes.references.value);
    if (!references.length) return;

    this.innerHTML = `
      <section id="references">
        <h3>References</h3>
        <div class="stack">
          ${references.map(ref => this.renderReference(ref)).join('')}
        </div>
      </section>
    `;
  }

  renderCitation(reference) {
    const details = [
      reference.name,
      reference.position,
      reference.company ? `at ${reference.company}` : null,
      reference.date
        ? `<time datetime="${reference.date}">${reference.date}</time>`
        : null,
    ].filter(Boolean);

    return `
      <p>
        <cite>${details.join('<br/>')}</cite>
      </p>
    `;
  }

  renderReference(reference) {
    return `
      <blockquote>
        <p>${reference.reference}</p>
        ${reference.name ? this.renderCitation(reference) : ''}
      </blockquote>
    `;
  }
}

customElements.define('resume-references', ResumeReferencesElement);
