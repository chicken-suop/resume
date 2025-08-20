import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';

export async function render(mode = 'normal') {
  const useTailoredResume = process.env.VITE_USE_TAILORED_RESUME === 'true';

  // Set up DOM environment with jsdom for better W3C compliance
  const dom = new JSDOM(
    '<!DOCTYPE html><html><head></head><body></body></html>',
    {
      pretendToBeVisual: true,
      resources: 'usable',
      url: 'https://localhost:3000',
    },
  );

  const window = dom.window;

  // Add missing browser APIs
  window.matchMedia =
    window.matchMedia ||
    function (media) {
      return {
        addEventListener: function () {},
        addListener: function () {},
        dispatchEvent: function () {
          return true;
        },
        matches: false,
        media: media,
        onchange: null,
        removeEventListener: function () {},
        removeListener: function () {},
      };
    };

  global.window = window;
  global.document = window.document;
  global.HTMLElement = window.HTMLElement;
  global.customElements = window.customElements;
  global.localStorage = window.localStorage;
  global.SyntaxError = window.SyntaxError;
  global.TypeError = window.TypeError;
  global.Error = window.Error;

  // Automatically import all .element.js files
  const componentModules = import.meta.glob('./resume-html/**/*.element.js');

  for (const path in componentModules) {
    await componentModules[path]();
  }

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
        json: () => Promise.resolve(resumeData),
        ok: true,
      };
    }
    throw new Error(`Unknown fetch URL: ${url}`);
  };

  // Create the main resume element
  const jsonResumeElement = window.document.createElement('json-resume');

  // Helper function to wait for DOM stability
  async function waitForDOMStability(
    window,
    maxAttempts = 50,
    stableChecks = 3,
  ) {
    let lastHTML = '';
    let stableCount = 0;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Allow one animation frame for rendering
      await new Promise(resolve => {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(resolve);
        } else {
          setTimeout(resolve, 16); // Fallback: ~60fps
        }
      });

      const currentHTML = window.document.body.innerHTML;

      if (currentHTML === lastHTML) {
        stableCount++;
        if (stableCount >= stableChecks) {
          // DOM stabilized
          return; // DOM is stable
        }
      } else {
        stableCount = 0; // Reset counter if DOM changed
      }

      lastHTML = currentHTML;

      // Small delay between checks
      await new Promise(resolve => setTimeout(resolve, 20));
    }

    // DOM did not stabilize, proceeding anyway
  }

  // Add to document to trigger connectedCallback
  window.document.body.appendChild(jsonResumeElement);

  // Wait for DOM to stabilize using a more robust approach
  await waitForDOMStability(window);

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
    head: {
      meta: [
        {
          content: resumeData.basics.summary,
          name: 'description',
        },
      ],
      title: window.document.title,
    },
    html: html,
  };
}
