// Client-side entry point for interactive components
// This bundle is inlined into the final static HTML to provide browser functionality

// Import CSS for bundling (without the main component that would re-render)
import './resume-html/main.css';
import './resume-html/json-resume.css';
// Import all component CSS that actually exist
import './resume-html/sections/header/header.css';
import './resume-html/sections/about/about.css';
import './resume-html/sections/skills/skills.css';
import './resume-html/sections/experiences/experiences.css';
import './resume-html/sections/education/education.css';
import './resume-html/sections/projects/projects.css';
import './resume-html/sections/awards/awards.css';
import './resume-html/sections/volunteer/volunteer.css';
import './resume-html/sections/references/references.css';
import './resume-html/sections/interests/interests.css';
import './resume-html/utils/expandable.css';
import './resume-html/components/night-mode-toggle.css';

// Import only interactive components (no main json-resume component)
import './resume-html/components/night-mode-toggle.element.js';
import { setupExpandables } from './resume-html/utils/expandable.js';

// Wait for page to be fully loaded before setting up interactive elements
window.addEventListener('load', () => {
  // Set up expandable sections
  setupExpandables(document.body);
});
