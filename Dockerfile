FROM node:24.13.0-alpine3.23@sha256:931d7d57f8c1fd0e2179dbff7cc7da4c9dd100998bc2b32afc85142d8efbc213 AS build-env
COPY . /app
WORKDIR /app

RUN apk update && apk upgrade && apk --no-cache add dash=0.5.13.1-r0
SHELL ["/bin/ash", "-o", "pipefail", "-c"]
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.dashrc" SHELL="$(which dash)" PNPM_VERSION=10.28.0 dash -

ARG PUBLIC_ABLY_CHANNEL
ARG PUBLIC_COLUMNS=4
ARG PUBLIC_GITHUB_PAGE
ARG PUBLIC_ROWS=4
ARG PUBLIC_TWITTER_USERNAME

RUN --mount=type=secret,id=ABLY_API_KEY,env=ABLY_API_KEY --mount=type=secret,id=UPSTASH_REDIS_REST_URL,env=UPSTASH_REDIS_REST_URL --mount=type=secret,id=UPSTASH_REDIS_REST_TOKEN,env=UPSTASH_REDIS_REST_TOKEN . "$HOME/.dashrc" \
    && pnpm install --frozen-lockfile \
    && pnpm build \
    && pnpm prune --production

FROM gcr.io/distroless/nodejs24-debian13@sha256:64cea69417af086d87b7cc75746042fa2528f33cd6e4b49c9fbfe6f97a9a38f0
COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/package.json /app/package.json
COPY --from=build-env /app/node_modules /app/node_modules
WORKDIR /app
ENV PORT=5000
ENV NODE_ENV=production
CMD ["build"]
