FROM node:24.12.0-alpine3.23@sha256:7e0bd0460b26eb3854ea5b99b887a6a14d665d14cae694b78ae2936d14b2befb AS build-env
COPY . /app
WORKDIR /app

RUN apk update && apk upgrade && apk --no-cache add dash=0.5.13.1-r0
SHELL ["/bin/ash", "-o", "pipefail", "-c"]
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.dashrc" SHELL="$(which dash)" PNPM_VERSION=10.26.0 dash -

ARG PUBLIC_ABLY_CHANNEL
ARG PUBLIC_COLUMNS=4
ARG PUBLIC_GITHUB_PAGE
ARG PUBLIC_ROWS=4
ARG PUBLIC_TWITTER_USERNAME

RUN --mount=type=secret,id=ABLY_API_KEY,env=ABLY_API_KEY --mount=type=secret,id=UPSTASH_REDIS_REST_URL,env=UPSTASH_REDIS_REST_URL --mount=type=secret,id=UPSTASH_REDIS_REST_TOKEN,env=UPSTASH_REDIS_REST_TOKEN . "$HOME/.dashrc" \
    && pnpm install --frozen-lockfile \
    && pnpm build \
    && pnpm prune --production

FROM gcr.io/distroless/nodejs24-debian13@sha256:484fc5087efc6a00cfea027a3c3807e4bb8ff7be6ae81df8cc5f0b65fc76282e
COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/package.json /app/package.json
COPY --from=build-env /app/node_modules /app/node_modules
WORKDIR /app
ENV PORT=5000
ENV NODE_ENV=production
CMD ["build"]
