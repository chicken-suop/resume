import './sections/resume-header.element.js';
import './sections/resume-about.element.js';
import './sections/resume-skills.element.js';
import './sections/resume-experiences.element.js';
import './sections/resume-education.element.js';
import './sections/resume-projects.element.js';
import './sections/resume-awards.element.js';
import './sections/resume-volunteer.element.js';
import './sections/resume-references.element.js';
import './sections/resume-interests.element.js';
import './components/time-duration.element.js';

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
    const baseUrl = new URL(
      import.meta.env.BASE_URL,
      window.location.origin,
    ).toString();
    const response = await fetch(new URL('resume.base.json', baseUrl));
    return response.json();
  }

  render(resumeData) {
    this.innerHTML = `
      <resume-header data='${this.safeStringify(resumeData.basics)}'></resume-header>
      <resume-experiences works='${this.safeStringify(resumeData.work || [])}'></resume-experiences>
      <resume-volunteer volunteer='${this.safeStringify(resumeData.volunteer || [])}'></resume-volunteer>
      <resume-education educations='${this.safeStringify(resumeData.education || [])}'></resume-education>
      <resume-projects projects='${this.safeStringify(resumeData.projects || [])}'></resume-projects>
      <resume-awards awards='${this.safeStringify(resumeData.awards || [])}'></resume-awards>
      <resume-skills
        skills='${this.safeStringify(resumeData.skills || [])}'
        languages='${this.safeStringify(resumeData.languages || [])}'
      ></resume-skills>
      <resume-interests interests='${this.safeStringify(resumeData.interests || [])}'></resume-interests>
      <resume-references references='${this.safeStringify(resumeData.references || [])}'></resume-references>
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
