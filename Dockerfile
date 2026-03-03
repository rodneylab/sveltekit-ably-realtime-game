FROM node:24.14.0-alpine3.23@sha256:7fddd9ddeae8196abf4a3ef2de34e11f7b1a722119f91f28ddf1e99dcafdf114 AS build-env
COPY . /app
WORKDIR /app

RUN apk update && apk upgrade && apk --no-cache add dash=0.5.13.1-r2
SHELL ["/bin/ash", "-o", "pipefail", "-c"]
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.dashrc" SHELL="$(which dash)" PNPM_VERSION=10.30.3 dash -

ARG PUBLIC_ABLY_CHANNEL
ARG PUBLIC_COLUMNS=4
ARG PUBLIC_GITHUB_PAGE
ARG PUBLIC_ROWS=4
ARG PUBLIC_TWITTER_USERNAME

RUN --mount=type=secret,id=ABLY_API_KEY,env=ABLY_API_KEY --mount=type=secret,id=UPSTASH_REDIS_REST_URL,env=UPSTASH_REDIS_REST_URL --mount=type=secret,id=UPSTASH_REDIS_REST_TOKEN,env=UPSTASH_REDIS_REST_TOKEN . "$HOME/.dashrc" \
    && pnpm install --frozen-lockfile \
    && pnpm build \
    && pnpm prune --production

FROM gcr.io/distroless/nodejs24-debian13@sha256:327413afac31e8d86c6210c22741a38f0a0257e3a1138d12cf232094bbc10958
COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/package.json /app/package.json
COPY --from=build-env /app/node_modules /app/node_modules
WORKDIR /app
ENV PORT=5000
ENV NODE_ENV=production
CMD ["build"]
