import './skill-badge.element.js';

import clsx from 'clsx';

import { date, styles } from '../helpers.js';

class ResumeExperiencesElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const works = JSON.parse(this.attributes.works.value);
    const template = document.createElement('template');
    template.innerHTML = `
<section aria-labelledby="resume-experiences-section-header">
<ul class="${clsx('tw-flex tw-flex-col tw-gap-2')}">
    ${works
      .map((work, index) => {
        const {
            company,
            endDate,
            highlights,
            location,
            position,
            startDate,
            summary,
            url,
          } = work,
          shouldRenderExperienceInDetail = index <= 3,
          shouldRenderSectionHeader = index === 0;

        return `<li class="${clsx('tw-border-b tw-border-primary print:tw-break-inside-avoid')}" title="${position} in ${company}" aria-describedby="work-experience-${index}">
${shouldRenderSectionHeader ? `<header id="resume-experiences-section-header" class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-black')}">Experience</header>` : ''}

<header>
<a
    class="${clsx('tw-flex tw-flex-col tw-rounded-xl tw-bg-gray-100 tw-px-3 tw-py-2')}"
    href="${url}"
    target="_blank">
    <span  class="${clsx('tw-flex tw-flex-wrap tw-items-center tw-justify-between')}" >
    <p class="${clsx('tw-text-2xl tw-font-black')}">${position} at ${company}</p>
<p class="${clsx('tw-text-base tw-font-medium')}">${date.formatDate(startDate)} - ${endDate ? date.formatDate(endDate) : 'Present'}</p>
</span>
    <p class="${clsx('tw-text-base tw-font-medium')}">${location}</p>

</a>
</header>
<section class="${clsx('tw-flex tw-flex-col tw-gap-1.5 tw-p-2')}">
${shouldRenderExperienceInDetail ? `<p class="${clsx('tw-text-xl tw-font-medium tw-text-primary')}" id="work-experience-${index}">${summary}</p>` : ''}
${
  shouldRenderExperienceInDetail
    ? `<ul class="${clsx('tw-flex tw-list-inside tw-list-disc tw-flex-col tw-gap-0.5 tw-px-3')}">
${highlights.map(highlight => `<li class="${clsx('tw-text-base tw-font-medium tw-text-primary')}">${highlight}</li>`).join('')}
</ul>`
    : ''
}
</section>
</li>`;
      })
      .join('\n')}
</ul>
</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-experiences', ResumeExperiencesElement);
