FROM node:22-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

# Add CorePack and Install Yarn 4
RUN corepack enable && corepack prepare yarn@4

WORKDIR /usr/src/project10k

# Install dependencies based on the preferred package manager
COPY .yarnrc.yml ./
COPY package.json yarn.lock ./
COPY apps/project10k-client ./apps/project10k-client
COPY packages/block-editor ./packages/block-editor
COPY packages/catalyst ./packages/catalyst

# Omit --production flag for TypeScript devDependencies
RUN yarn install

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG ENV_VARIABLE
ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}
ENV NODE_OPTIONS=--max-old-space-size=8000

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
# ENV NEXT_TELEMETRY_DISABLED 1

# Build The Project 10K Client
WORKDIR /usr/src/project10k/apps/project10k-client

# Build Next.js based on the preferred package manager
RUN yarn build

# Note: It is not necessary to add an intermediate step that does a full copy of `node_modules` here

# Step 2. Production image, copy all the files and run next
FROM base AS runner

WORKDIR /usr/src/project10k

ENV NODE_ENV production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing

COPY --from=builder --chown=nextjs:nodejs /usr/src/project10k/apps/project10k-client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/project10k/apps/project10k-client/.next/static ./apps/project10k-client/.next/static
COPY --from=builder --chown=nextjs:nodejs /usr/src/project10k/apps/project10k-client/public ./apps/project10k-client/public

# Environment variables must be redefined at run time
ARG ENV_VARIABLE
ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}

# Uncomment the following line to disable telemetry at run time
# ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

CMD ["node", "./apps/project10k-client/server.js"]