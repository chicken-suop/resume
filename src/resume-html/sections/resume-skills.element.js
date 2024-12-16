import './skill-badge.element.js';

import clsx from 'clsx';

import { styles } from '../helpers.js';

class ResumeSkillsElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const highlightedSkills = JSON.parse(
        this.attributes['highlighted-skills'].value,
      ),
      languages = JSON.parse(this.attributes.languages.value),
      skills = JSON.parse(this.attributes.skills.value);

    const template = document.createElement('template');
    template.innerHTML = `
<section class="${clsx('print:tw-break-inside-avoid')}">
<header class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-black')}">Skills</header>
<div class="${clsx('tw-flex tw-flex-col tw-gap-3')}">
${skills
  .map(({ keywords, level, name }) => {
    return `
<div class="${clsx('tw-flex tw-flex-col tw-gap-1')}">
  <h3 class="${clsx('tw-text-2xl tw-font-bold tw-text-primary')}">${name}</h3>
  <ul class="${clsx('tw-flex tw-flex-wrap tw-gap-1')}">
    ${keywords
      .map(keyword => {
        const isHighlighted = highlightedSkills.some(
          skill => skill.toLowerCase() === keyword.toLowerCase(),
        );
        return `<skill-badge skill="${keyword}" level="${isHighlighted ? 'Highlight' : level}" element="li"></skill-badge>`;
      })
      .join('\n')}
  </ul>
</div>`;
  })
  .join('\n')}

${
  languages.length > 0
    ? `
<div class="${clsx('tw-flex tw-flex-col tw-gap-1')}">
  <h3 class="${clsx('tw-text-xl tw-font-bold')}">Languages</h3>
  <ul class="${clsx('tw-flex tw-flex-wrap tw-gap-1')}">
    ${languages
      .map(
        ({ fluency, language }) =>
          `<skill-badge skill="${language}" level="${fluency}" element="li"></skill-badge>`,
      )
      .join('\n')}
  </ul>
</div>`
    : ''
}
</div>
</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-skills', ResumeSkillsElement);
