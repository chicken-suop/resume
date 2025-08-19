import './json-resume.css';
import './sections/header/header.element.js';
import './sections/about/about.element.js';
import './sections/skills/skills.element.js';
import './sections/experiences/experiences.element.js';
import './sections/education/education.element.js';
import './sections/projects/projects.element.js';
import './sections/awards/awards.element.js';
import './sections/volunteer/volunteer.element.js';
import './sections/references/references.element.js';
import './sections/interests/interests.element.js';
import './components/time-duration.element.js';
import './components/night-mode-toggle.element.js';

class JsonResumeElement extends HTMLElement {
  async connectedCallback() {
    const resumeData = await this.fetchResumeData();
    this.setupMetaTags(resumeData);
    this.render(resumeData);
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async fetchResumeData() {
    const response = await fetch('/resume.base.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  render(resumeData) {
    this.innerHTML = `
      <night-mode-toggle></night-mode-toggle>
      <resume-header data='${this.safeStringify(resumeData.basics)}'></resume-header>
      <resume-experiences works='${this.safeStringify(resumeData.work || [])}'></resume-experiences>
      <resume-volunteer volunteer='${this.safeStringify(resumeData.volunteer || [])}'></resume-volunteer>
      <resume-education educations='${this.safeStringify(resumeData.education || [])}'></resume-education>
      <resume-projects projects='${this.safeStringify(resumeData.projects || [])}'></resume-projects>
      <resume-skills
        skills='${this.safeStringify(resumeData.skills || [])}'
        languages='${this.safeStringify(resumeData.languages || [])}'
      ></resume-skills>
      <resume-interests interests='${this.safeStringify(resumeData.interests || [])}'></resume-interests>
      <resume-awards awards='${this.safeStringify(resumeData.awards || [])}'></resume-awards>
      <resume-references references='${this.safeStringify(resumeData.references || [])}'></resume-references>

      <a
        href="/resume.pdf"
        class="print-button"
        title="Download Resume PDF"
        aria-label="Download Resume PDF"
        download
      >
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </a>
    `;
  }

  safeStringify(obj) {
    return this.escapeHtml(JSON.stringify(obj));
  }

  setupMetaTags(resumeData) {
    document.title = resumeData.basics.name;

    const metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', resumeData.basics.summary);
    document.head.appendChild(metaDescription);
  }
}
customElements.define('json-resume', JsonResumeElement);
