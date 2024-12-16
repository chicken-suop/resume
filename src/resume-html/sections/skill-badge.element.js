import clsx from 'clsx';

import { styles } from '../helpers.js';

class SkillBadgeElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const element = this.attributes.element.value,
      level = this.attributes.level.value,
      skill = this.attributes.skill.value;

    const badgeClasses = {
      Highlight: 'tw-bg-primary tw-text-white',
      Intermediate: 'tw-bg-yellow-100 tw-text-yellow-800',
      Master: 'tw-bg-green-100 tw-text-green-800',
      'Native speaker': 'tw-bg-purple-100 tw-text-purple-800',
      Senior: 'tw-bg-blue-100 tw-text-blue-800',
      Unknown: 'tw-bg-gray-100 tw-text-gray-800',
    };

    const template = document.createElement('template');
    template.innerHTML = `<${element} class="${clsx(
      'tw-rounded-full tw-px-3 tw-py-1 tw-text-sm tw-font-medium',
      badgeClasses[level] ?? 'tw-bg-gray-100 tw-text-gray-800',
    )}">${skill}</${element}>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('skill-badge', SkillBadgeElement);
