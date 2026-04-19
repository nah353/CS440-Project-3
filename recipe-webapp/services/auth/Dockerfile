FROM node:18-alpine
WORKDIR /app

# Install production dependencies
COPY services/auth/ ./
# include existing users.json from the monolith so initial accounts are available
COPY server/users.json ./users.json
# Copy the whole service folder from the repo context. Using the repo root
# as the build context allows Docker to include any generated package-lock.json
# inside the service folder when present.
RUN if [ -f package-lock.json ]; then \
			npm ci --only=production; \
		else \
			npm install --omit=dev --no-audit --no-fund; \
		fi

# Copy source
EXPOSE 5000
CMD ["node", "src/index.js"]

EXPOSE 5000
CMD ["node", "src/index.js"]
