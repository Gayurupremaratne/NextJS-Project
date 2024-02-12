# Stage 1 : Development
# Use the Node.js 18.17.1-alpine base image for development
FROM public.ecr.aws/docker/library/node:18.17.1-alpine As development
RUN apk add --no-cache libc6-compat

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND yarn-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json yarn.lock ./

# Install app dependencies
RUN yarn install --frozen-lockfile

# Stage 2 : Build
# Use the Node.js 18.17.1-alpine base image for build
FROM public.ecr.aws/docker/library/node:18.17.1-alpine As build

# Create app directory
WORKDIR /usr/src/app

# Copy the node_modules from the development stage
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# Bundle app source
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN yarn build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Stage 3 : Production
# Use the Node.js 18.17.1-alpine base image for build
FROM public.ecr.aws/docker/library/node:18.17.1-alpine As production

# Create app directory
WORKDIR /usr/src/app

# Copy the bundled code from the build stage to the production image
COPY --from=build /usr/src/app/.next/standalone ./standalone
COPY --from=build /usr/src/app/public /usr/src/app/standalone/public
COPY --from=build /usr/src/app/.next/static /usr/src/app/standalone/.next/static

# Expose the desired port
EXPOSE 3000

# Start the application
CMD ["node", "./standalone/server.js"]
