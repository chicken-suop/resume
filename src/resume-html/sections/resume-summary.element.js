class ResumeSummaryElement extends HTMLElement {
  connectedCallback() {
    const summary = JSON.parse(this.attributes.summary.value);
    const template = document.createElement('template');
    template.innerHTML = `<article><p>${summary}</p></article>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-summary', ResumeSummaryElement);
