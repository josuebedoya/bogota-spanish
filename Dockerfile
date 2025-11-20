FROM node:20-alpine AS builder

WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production
# Install dependencies (using lockfile for reproducible builds)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the project and build the Astro app
COPY . .
RUN npm run build --mode production


# ---- Runtime image ----
FROM node:20-alpine AS runtime

WORKDIR /app

# Environment
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

# Copy the built output from the builder stage
COPY --from=builder /app/dist ./dist

# If the Node adapter standalone bundle needs a minimal package.json, copy it
COPY package.json ./
COPY package-lock.json ./

RUN npm ci

EXPOSE 4321

# Start the Astro Node server produced by @astrojs/node (standalone mode)
CMD ["node", "./dist/server/entry.mjs"]


