import clsx from 'clsx';

import { styles } from '../helpers.js';

class ResumeInterestsElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const interests = JSON.parse(this.attributes.interests.value);
    const template = document.createElement('template');
    template.innerHTML = `
<section class="${clsx('print:tw-break-inside-avoid')}">
<header class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-black')}">Interests</header>
<div class="${clsx('tw-flex tw-flex-col tw-gap-3')}">
${interests
  .map(
    ({ keywords, name }) => `
  <div class="${clsx('tw-flex tw-flex-col tw-gap-1')}">
    <h3 class="${clsx('tw-text-2xl tw-font-bold tw-text-primary')}">${name}</h3>
    <ul class="${clsx('tw-flex tw-list-inside tw-list-disc tw-flex-col tw-gap-0.5 tw-px-3')}">
      ${keywords.map(keyword => `<li class="${clsx('tw-text-base tw-font-medium tw-text-primary')}">${keyword}</li>`).join('\n')}
    </ul>
  </div>
`,
  )
  .join('\n')}
</div>
</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-interests', ResumeInterestsElement);
