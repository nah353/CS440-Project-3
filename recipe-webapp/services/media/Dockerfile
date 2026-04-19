FROM node:18-alpine
WORKDIR /app

# Copy entire media service folder from repo build context
COPY services/media/ ./

RUN if [ -f package-lock.json ]; then \
			npm ci --only=production; \
		else \
			npm install --omit=dev --no-audit --no-fund; \
		fi

EXPOSE 5002
CMD ["node", "src/index.js"]
