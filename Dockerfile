FROM node:26.12.1-alpine3.24@sha256:40cd011b55415bc894e45b02fdd5a5dfde056921b7d23a64c74f80497af48797 AS build-env
COPY . /app
WORKDIR /app

RUN apk update && apk upgrade && apk --no-cache add dash=0.5.13.1-r2
SHELL ["/bin/ash", "-o", "pipefail", "-c"]
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.dashrc" SHELL="$(which dash)" PNPM_VERSION=12.15.0 dash -

ARG PUBLIC_ABLY_CHANNEL
ARG PUBLIC_COLUMNS=4
ARG PUBLIC_GITHUB_PAGE
ARG PUBLIC_ROWS=4
ARG PUBLIC_TWITTER_USERNAME

RUN --mount=type=secret,id=ABLY_API_KEY,env=ABLY_API_KEY \
    --mount=type=secret,id=UPSTASH_REDIS_REST_URL,env=UPSTASH_REDIS_REST_URL \
    --mount=type=secret,id=UPSTASH_REDIS_REST_TOKEN,env=UPSTASH_REDIS_REST_TOKEN \
    . "$HOME/.dashrc" \
    && pnpm install --frozen-lockfile \
    && pnpm build \
    && pnpm prune --production

FROM gcr.io/distroless/nodejs24-debian13@sha256:206cfbab1a64af20b63645150e3aa61b7babc17869e0254914947732963d6f07
COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/package.json /app/package.json
COPY --from=build-env /app/node_modules /app/node_modules
WORKDIR /app
ENV PORT=5000
ENV NODE_ENV=production
CMD ["build"]
