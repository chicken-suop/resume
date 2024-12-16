import clsx from 'clsx';

import { date, styles } from '../helpers.js';

class ResumeVolunteerElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const volunteer = JSON.parse(this.attributes.volunteer.value);
    const template = document.createElement('template');
    template.innerHTML = `
<section class="${clsx('print:tw-break-inside-avoid')}">
<header class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-black')}">Volunteer Experience</header>
<ul class="${clsx('tw-flex tw-flex-col tw-gap-2')}">
${volunteer
  .map(
    ({
      endDate,
      highlights,
      organization,
      position,
      startDate,
      summary,
      url,
    }) => `
  <li class="${clsx('tw-border-b tw-border-primary print:tw-break-inside-avoid')}">
    <header>
      <a href="${url}" target="_blank" class="${clsx('tw-flex tw-flex-col tw-rounded-xl tw-bg-gray-100 tw-px-3 tw-py-2')}">
        <span class="${clsx('tw-flex tw-flex-wrap tw-items-center tw-justify-between')}">
          <p class="${clsx('tw-text-2xl tw-font-black')}">${position} at ${organization}</p>
          <p class="${clsx('tw-text-base tw-font-medium')}">${date.formatDate(startDate)} - ${endDate ? date.formatDate(endDate) : 'Present'}</p>
        </span>
      </a>
    </header>
    <section class="${clsx('tw-flex tw-flex-col tw-gap-1.5 tw-p-2')}">
      <p class="${clsx('tw-text-xl tw-font-medium tw-text-primary')}">${summary}</p>
      <ul class="${clsx('tw-flex tw-list-inside tw-list-disc tw-flex-col tw-gap-0.5 tw-px-3')}">
        ${highlights.map(highlight => `<li class="${clsx('tw-text-base tw-font-medium tw-text-primary')}">${highlight}</li>`).join('\n')}
      </ul>
    </section>
  </li>
`,
  )
  .join('\n')}
</ul>
</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-volunteer', ResumeVolunteerElement);
