import clsx from 'clsx';

import { styles } from '../helpers.js';
import githubIcon from '../icons/github-mark.svg';
import homeIcon from '../icons/home.svg';
import linkedInIcon from '../icons/LI-In-Bug.png';
import stackOverflowIcon from '../icons/stack-overflow.svg';

function countryCodeToFlag(countryIso2Code) {
  return (
    {
      AU: '🇦🇺',
      HK: '🇭🇰',
      UK: '🇬🇧',
    }[countryIso2Code] ?? '🇦🇺'
  );
}

function getDisplayUsername(profile) {
  if (profile.network.toLowerCase() === 'stack overflow') {
    return 'Elliot Schep'; // Use your regular name instead of the upside down version
  }
  return profile.username;
}

class ResumeAboutElement extends styles.withInjectedStyles(HTMLElement)({
  mode: 'open',
}) {
  connectedCallback() {
    const resumeBasic = JSON.parse(this.attributes.data.value),
      name = resumeBasic.name;
    const template = document.createElement('template');
    template.innerHTML = `
<section class="${clsx('print:tw-break-inside-avoid')}">
<header class="${clsx('tw-mb-1.5 tw-text-3xl tw-font-black')}">About</header>
<div class="${clsx('tw-px-1')}">
<p class="${clsx('tw-mb-1 tw-flex tw-content-center tw-items-center tw-gap-2 tw-text-base tw-font-medium tw-text-primary')}" >
    <span class="${clsx('tw-text-lg')}">${countryCodeToFlag(resumeBasic.location.countryCode)}</span>
    <span>${resumeBasic.location.region}</span>
</p>
<a href="${resumeBasic.website}" target="_blank" class="${clsx('tw-mb-1 tw-flex tw-items-center tw-gap-2 tw-text-base tw-font-medium tw-text-primary')}">
    <img src="${homeIcon}" alt="home icon" class="${clsx('tw-h-2.5')}"/>
    Home Page
</a>

${resumeBasic.profiles
  .map(profile => {
    const network = profile.network.toLowerCase();
    let icon;
    switch (network) {
      case 'github':
        icon = githubIcon;
        break;
      case 'linkedin':
        icon = linkedInIcon;
        break;
      case 'stack overflow':
        icon = stackOverflowIcon;
        break;
      default:
        icon = homeIcon;
    }
    return `<a title="${name} ${profile.network}" href="${profile.url}" target="_blank" class='${clsx('tw-text-base tw-font-medium tw-text-primary', 'tw-items-center', 'tw-flex', 'tw-gap-2', 'tw-mb-1')}'>
        <img src="${icon}" alt="${profile.network}" class="${clsx('tw-h-2.5')}"/>
        ${getDisplayUsername(profile)}
      </a>`;
  })
  .join('\n')}

</section>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resume-about', ResumeAboutElement);
