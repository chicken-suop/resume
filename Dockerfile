FROM mcr.microsoft.com/playwright:v1.48.2-focal

# Install Bun
RUN apt-get update && apt-get install -y unzip && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /app

COPY package.json bun.lock vite.config.js index.html tailwind.config.js postcss.config.js ./
COPY src/ ./src
COPY public/ ./public

RUN bun install --frozen-lockfile
