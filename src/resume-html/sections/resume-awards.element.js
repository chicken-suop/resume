import clsx from 'clsx';

import { date, styles } from '../helpers.js';

class ResumeAwardsElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const awards = JSON.parse(this.attributes.awards.value);
    const template = document.createElement('template');
    template.innerHTML = `
<section class="${clsx('print:tw-break-inside-avoid')}">
<header class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-black')}">Awards</header>
<ul class="${clsx('tw-flex tw-flex-col tw-gap-2')}">
${awards
  .map(
    ({ date: awardDate, title }) => `
  <li class="${clsx('tw-flex tw-flex-col tw-gap-1')}">
    <div class="${clsx('tw-flex tw-items-center tw-justify-between')}">
      <p class="${clsx('tw-text-xl tw-font-medium tw-text-primary')}">${title}</p>
      <p class="${clsx('tw-text-base tw-font-medium tw-text-gray-600')}">${date.formatDate(awardDate)}</p>
    </div>
  </li>
`,
  )
  .join('\n')}
</ul>
</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-awards', ResumeAwardsElement);
