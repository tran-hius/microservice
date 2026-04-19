# 1. Base image
FROM node:18-alpine

# 2. Workdir
WORKDIR /app

# 3. Copy package
COPY package*.json ./

# 4. Install full deps (để build)
RUN npm install

# 5. Copy source
COPY . .

# 6. Build TS -> JS
RUN npm run build

# 7. Remove dev deps (optional)
RUN npm prune --production

# 8. Expose port
EXPOSE 3000

# 9. Start app
CMD ["node", "dist/server.js"]