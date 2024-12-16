import clsx from 'clsx';

import { styles } from '../helpers.js';

class ResumeReferencesElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const linkedInLink = this.attributes['linkedin-link'].value,
      references = JSON.parse(
        decodeURIComponent(this.attributes.references.value),
      ).slice(0, 3);
    const template = document.createElement('template');
    template.innerHTML = `
<section aria-labelledby="resume-references-section-header">
    <ul class="${clsx('tw-flex tw-flex-col tw-gap-2')}">${references
      .map(({ name, reference }, index) => {
        return `<li class="${clsx('tw-border-b tw-border-gray-200 print:tw-break-inside-avoid')}" title="${name}" aria-describedby="reference-${index}">
${index === 0 ? `<header id="resume-references-section-header" class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-black')}">References</header>` : ''}

<a href="${linkedInLink}" target="_blank" class="${clsx('tw-flex tw-flex-col tw-gap-1 tw-py-2')}">
  <blockquote cite="${linkedInLink}">
    <p class="${clsx('tw-text-base tw-font-medium tw-text-primary')}" id="reference-${index}">${reference}</p>
  </blockquote>
  <p class="${clsx('tw-flex tw-justify-end tw-text-xl tw-font-bold tw-text-gray-600')}">
    ${name}
  </p>
</a>
</li>`;
      })
      .join('\n')}</ul>
</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-references', ResumeReferencesElement);
