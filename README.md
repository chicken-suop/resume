# Elliot Schep's Resume

[![deploy-github-page-after-push-master](https://github.com/chicken-suop/resume/actions/workflows/deploy-gh-page.yml/badge.svg)](https://github.com/chicken-suop/resume/actions/workflows/deploy-gh-page.yml)

Personal resume built with JSON Resume schema.

## Development

```bash
bash ./scripts/setup.sh
npx vite dev
```

### Generate tailor resume.pdf

```bash
OPENAI_API_KEY= node ./src/apply-for-job/tailor-resume.js
```

### Debug tailor resume

```bash
VITE_USE_TAILORED_RESUME=true vite dev
```

### Generate resume.pdf

```bash
node ./src/build-pdf.js
```

after that you will see `resume.pdf` in `public/` folder

## Live

### if you're watching this then I suggest you read web version

[WEB version](https://chicken-suop.github.io/resume/)

[PDF Version](https://chicken-suop.github.io/resume/resume.pdf)

## Skill Level Definitions

### Programming Language / Framework / Library

- **Master** - I can confidently work on features independently
  without needing extensive online research about "how to do things,"
  while still following best practices specific to the language.
- **Intermediate** - I can work on features independently with some online research,
  but will need an experienced teammate to review my code.

### Architecture Components (Queues, Databases, etc.)

- **Master** - In addition to integrating components in code,
  I can also set up optimized configurations and deploy them to production.
- **Intermediate** - I am confident in integrating components from application code
  and understanding integration patterns,
  along with basic development environment setup.

### Protocols (REST, HTTP, GraphQL, etc.)

- **Master** - I understand best practices for the protocol,
  can defend against security attacks,
  and handle performance tuning.
- **Intermediate** - I can integrate the protocol into applications
  and understand how it works.

### Workflow

- **Master** - I understand both theory and real-world application,
  and I can explain concepts and
  handle technical discussions with teammates.

- **Intermediate** - I understand the theory and have practical experience
  with real-world execution.
