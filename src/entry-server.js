import { Window } from 'happy-dom';
import fs from 'node:fs';
import path from 'node:path';

export async function render(mode = 'normal') {
  const useTailoredResume = process.env.VITE_USE_TAILORED_RESUME === 'true';

  // Set up DOM environment
  const window = new Window({
    url: 'https://localhost:3000',
    width: 1024,
    height: 768,
  });

  // Set window.SyntaxError to the native constructor
  window.SyntaxError = SyntaxError;
  window.TypeError = TypeError;
  window.Error = Error;

  global.window = window;
  global.document = window.document;
  global.HTMLElement = window.HTMLElement;
  global.customElements = window.customElements;
  global.localStorage = window.localStorage;
  global.SyntaxError = SyntaxError;
  global.TypeError = TypeError;
  global.Error = Error;

  // Now dynamically import all the web components after DOM globals are set
  await import('./resume-html/json-resume.element.js');
  await import('./resume-html/sections/header/header.element.js');
  await import('./resume-html/sections/about/about.element.js');
  await import('./resume-html/sections/skills/skills.element.js');
  await import('./resume-html/sections/experiences/experiences.element.js');
  await import('./resume-html/sections/education/education.element.js');
  await import('./resume-html/sections/projects/projects.element.js');
  await import('./resume-html/sections/awards/awards.element.js');
  await import('./resume-html/sections/volunteer/volunteer.element.js');
  await import('./resume-html/sections/references/references.element.js');
  await import('./resume-html/sections/interests/interests.element.js');
  await import('./resume-html/components/time-duration.element.js');
  await import('./resume-html/components/night-mode-toggle.element.js');

  // Load resume data
  const resumeJsonPath = useTailoredResume
    ? path.join(process.cwd(), 'public', 'resume.tailored.json')
    : path.join(process.cwd(), 'public', 'resume.base.json');

  const resumeData = JSON.parse(fs.readFileSync(resumeJsonPath, 'utf-8'));

  // Mock the fetch for resume data first
  global.fetch = async url => {
    if (
      url.includes('resume.base.json') ||
      url.includes('resume.tailored.json')
    ) {
      return {
        ok: true,
        json: () => Promise.resolve(resumeData),
      };
    }
    throw new Error(`Unknown fetch URL: ${url}`);
  };

  // Create the main resume element
  const jsonResumeElement = window.document.createElement('json-resume');

  // Add to document to trigger connectedCallback
  window.document.body.appendChild(jsonResumeElement);

  // Wait longer for all components to render (including async operations)
  await new Promise(resolve => setTimeout(resolve, 500));

  // Manually trigger connectedCallback if it hasn't been called
  if (typeof jsonResumeElement.connectedCallback === 'function') {
    await jsonResumeElement.connectedCallback();
  }

  // Give additional time for all nested components to render
  await new Promise(resolve => setTimeout(resolve, 300));

  // Manually trigger connectedCallback for all nested custom elements
  const allCustomElements = window.document.querySelectorAll('*');
  for (const element of allCustomElements) {
    if (
      element.tagName &&
      element.tagName.includes('-') &&
      typeof element.connectedCallback === 'function'
    ) {
      try {
        await element.connectedCallback();
      } catch (e) {
        console.error(`Error in ${element.tagName} connectedCallback:`, e);
      }
    }
  }

  // Wait a bit more for all components to finish rendering
  await new Promise(resolve => setTimeout(resolve, 200));

  // Get the rendered HTML
  let html = jsonResumeElement.outerHTML;

  // For print mode, remove night mode toggle
  if (mode === 'print') {
    html = html.replace(
      /<night-mode-toggle[^>]*>.*?<\/night-mode-toggle>/gs,
      '',
    );
  }

  // Set document title
  window.document.title = resumeData.basics.name;

  // Create meta description
  const metaDescription = window.document.createElement('meta');
  metaDescription.setAttribute('name', 'description');
  metaDescription.setAttribute('content', resumeData.basics.summary);

  return {
    html: html,
    head: {
      title: window.document.title,
      meta: [
        {
          name: 'description',
          content: resumeData.basics.summary,
        },
      ],
    },
  };
}
