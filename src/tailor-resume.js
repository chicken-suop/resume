import fs from 'node:fs/promises';
import path from 'node:path';

import * as openAI from './open-ai.js';
import * as resumeToPdf from './resume-to-pdf.js';

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../'),
  PUBLIC_ASSETS_FOLDER = path.join(WORKSPACE_ROOT, 'public'),
  DOCS_FOLDER = path.join(WORKSPACE_ROOT, 'docs');
const SAMPLE_JD = {
  Dialpad: await fs.readFile(
    path.join(DOCS_FOLDER, 'sample-jd', 'dialpad.md'),
    {
      encoding: 'utf-8',
    },
  ),
  Goodlord: await fs.readFile(
    path.join(DOCS_FOLDER, 'sample-jd', 'goodlord.md'),
    {
      encoding: 'utf-8',
    },
  ),
  Katkin: await fs.readFile(path.join(DOCS_FOLDER, 'sample-jd', 'katkin.md'), {
    encoding: 'utf-8',
  }),
  Neutreeno: await fs.readFile(
    path.join(DOCS_FOLDER, 'sample-jd', 'neutreeno.md'),
    {
      encoding: 'utf-8',
    },
  ),
  Zensai: await fs.readFile(path.join(DOCS_FOLDER, 'sample-jd', 'zensai.md'), {
    encoding: 'utf-8',
  }),
};

function listAllKeywordsFromResume(resume) {
  return Array.from(
    new Set(
      [
        resume.projects.map(project => project.keywords).flat(),
        resume.skills.map(skill => skill.keywords).flat(),
        resume.work.map(work => work.keywords).flat(),
      ].flat(),
    ),
  );
}

function listLastThreeWorkExperences(resume) {
  return resume.work.slice(0, 3);
}

function listColleagueRecommendations(resume) {
  return resume.references.slice(0, 3);
}

async function extractTailorResumeFromJD(jd, { keywords, references, works }) {
  const prompts = await openAI.withFeedbackLoop(openAI.prompt)(
    [
      {
        content: `You are Software engineer who are looking on JD and want tailor your resume to increase the chance to get the screening
Here is all skills you knows in JSON format:
${JSON.stringify(keywords)}

Here is last 3 working experiences in JSON format:
${JSON.stringify(works)}

Here is colleague recommendations in JSON format:
${JSON.stringify(references)}

Do the following 6 tasks and response in JSON format:
- Highlight the skills matching the JD
- Generate the summary about why you are suitable for the position and which experience make you stand out in key path 'summary' according to JD, working experiences, colleague recommendations and skills. Keep your wording simple and easy limit your response in 50 words.
- Extract the company name from JD in key path 'company.name'
- Extract the opening position name from JD in key path 'company.position'
- Advise what skills wasn't in my skills and i should consider add to my resume in key 'highlightedKeywords'
`,
        role: 'system',
      },
      {
        content: `Sample JD here:
${SAMPLE_JD.Neutreeno}
`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            name: 'Neutreeno',
            position: 'Senior Full Stack Software Engineer',
          },
          highlightedKeywords: [
            'React',
            'NodeJS',
            'Typescript',
            'AWS',
            'PostgresSQL',
            'CSS',
            'GraphQL',
          ],
          suggestedKeywords: [
            'Material UI or similar modern frontend frameworks',
            'Functional programming concepts',
            'Microservice architecture',
            'Contributions to open-source projects',
          ],
          summary:
            'Dynamic Senior Full Stack Engineer with 7+ years of experience in building scalable applications. Expertise in TypeScript, React, and Node.js, with a strong focus on optimizing user interfaces and backend performance. Proven success at PlayStation and Emma, making significant contributions to complex projects aimed at improving user experience and system efficiency.',
        }),
        role: 'assistant',
      },
      {
        content: `Sample JD here:
      ${SAMPLE_JD.Dialpad}`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            name: 'Dialpad',
            position: 'Software Engineer, Fullstack',
          },
          highlightedKeywords: [
            'Python',
            'NodeJS',
            'React',
            'TypeScript',
            'GraphQL',
            'CSS',
            'HTML',
            'Javascript',
            'RESTful APIs',
            'SQL/NoSQL',
            'Agile',
          ],
          suggestedKeywords: [
            'Vue',
            'Cloud infrastructures',
            'Building reusable and modular components',
            'Debugging and troubleshooting skills',
          ],
          summary:
            'Results-driven Full Stack Software Engineer with 7+ years of experience in developing scalable applications using Python, React, and Node.js. Proven track record at PlayStation and Emma, leading projects from concept to delivery. Experienced in mentoring junior engineers at Neat and passionate about leveraging AI to enhance user experiences.',
        }),
        role: 'assistant',
      },
      {
        content: `
Sample JD here:
${SAMPLE_JD.Katkin}
`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            name: 'Katkin',
            position: 'Mid-level Full-Stack Engineer',
          },
          highlightedKeywords: [
            'TypeScript',
            'React',
            'NodeJS',
            'NestJS',
            'NextJS',
            'REST API',
            'PostgreSQL',
            'RabbitMQ',
            'Test automation',
            'GitHub Actions',
            'AWS',
            'Monorepos',
            'Pulumi',
          ],
          suggestedKeywords: [
            'eCommerce and/or payments experience',
            'OOP and/or functional programming paradigms',
            'Terraform or CDK usage',
            'Observability and metrics tooling',
          ],
          summary:
            'Dynamic Full Stack Engineer with expertise in TypeScript, React, and Node.js, committed to transforming the pet food industry through innovative technology. Passionate about building scalable solutions and enhancing user experiences, with hands-on experience in delivering end-to-end features in fast-paced environments. Proven track record of collaborating with cross-functional teams to drive project success and maintain high-quality codebases. Eager to contribute to KatKin’s mission of improving cat health and wellbeing while embracing a tech-driven approach to scale the business.',
        }),
        role: 'assistant',
      },
      {
        content: `
Sample JD here:
${SAMPLE_JD.Goodlord}
`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            name: 'Goodlord',
            position: 'Intermediate Software Engineer (TypeScript)',
          },
          highlightedKeywords: [
            'TypeScript',
            'React',
            'Jest',
            'React Testing Library',
            'Cypress',
            'Web application security',
            'Microservices',
            'State management',
            'Test automation',
            'Mentorship',
          ],
          suggestedKeywords: [
            'Domain-Driven Design (DDD)',
            'Automated testing frameworks',
            'Mentoring less experienced developers',
          ],
          summary: `Intermediate Software Engineer with experience in TypeScript and React. I thrive in transparent environments, deliver high-quality solutions, and mentor others. Passionate about continuous improvement, I align with Goodlord’s values and am eager to contribute to enhancing the renting experience for all.`,
        }),
        role: 'assistant',
      },
      {
        content: `
Sample JD here:
${SAMPLE_JD.Zensai}
`,
        role: 'user',
      },
      {
        content: JSON.stringify({
          company: {
            name: 'Zensai',
            position: 'Full Stack Engineer',
          },
          highlightedKeywords: [
            'React',
            'Python',
            'Django',
            'PostgreSQL',
            'CI',
            'Collaboration',
            'Agile',
          ],
          suggestedKeywords: [
            'Azure DevOps',
            'Performance optimization',
            'User experience design',
          ],
          summary: `Creative Full Stack Engineer proficient in React and Python, with strong experience in delivering quality web applications. Proven ability to collaborate across cross-functional teams at Emma and PlayStation, enhancing user experiences. Passionate about continuous learning and innovation, keen to contribute to Zensai’s mission of empowering individuals through technology.`,
        }),
        role: 'assistant',
      },
      {
        content: `Consider JD your want to apply here:
${jd}`,
        role: 'user',
      },
    ],
    {
      json: true,
    },
  );
  return JSON.parse(openAI.readMessageFromPrompt(prompts));
}

async function main() {
  const resume = await fs
      .readFile(path.join(PUBLIC_ASSETS_FOLDER, 'resume.base.json'), {
        encoding: 'utf-8',
      })
      .then(resume => JSON.parse(resume)),
    jobDescription = await fs.readFile(path.join(DOCS_FOLDER, 'jd.md'), {
      encoding: 'utf-8',
    });
  const tailorResume = await extractTailorResumeFromJD(jobDescription, {
    keywords: listAllKeywordsFromResume(resume),
    references: listColleagueRecommendations(resume),
    works: listLastThreeWorkExperences(resume),
  });
  await fs.writeFile(
    path.join(PUBLIC_ASSETS_FOLDER, 'tailored-resume.json'),
    JSON.stringify(
      Object.assign(resume, {
        basics: Object.assign(resume.basics, {
          label: tailorResume.company.position,
          summary: tailorResume.summary,
        }),
        meta: Object.assign(resume.meta, {
          company: tailorResume.company,
          highlightedKeywords: tailorResume.highlightedKeywords,
        }),
      }),
      null,
      2,
    ),
  );
  await resumeToPdf.generateResumeToPDF(
    path.join(PUBLIC_ASSETS_FOLDER, `${tailorResume.company.name}.pdf`),
    { useTailoredResume: true },
  );
  // eslint-disable-next-line no-console
  console.log(`Check ${path.join(PUBLIC_ASSETS_FOLDER, `${tailorResume.company.name}.pdf`)} for the result.
For apply ${tailorResume.company.position} on ${tailorResume.company.name}
I suggested include follow skills in your resume.
${JSON.stringify(tailorResume.suggestedKeywords, null, 2)}
`);
}

await main();
