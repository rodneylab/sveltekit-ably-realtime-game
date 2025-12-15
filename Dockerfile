FROM node:24-alpine3.23@sha256:682368d8253e0c3364b803956085c456a612d738bd635926d73fa24db3ce53d7 AS build-env
COPY . /app
WORKDIR /app

RUN apk update && apk upgrade && apk --no-cache add dash=0.5.13.1-r0
SHELL ["/bin/ash", "-o", "pipefail", "-c"]
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.dashrc" SHELL="$(which dash)" PNPM_VERSION=10.24.0 dash -

ARG PUBLIC_ABLY_CHANNEL
ARG PUBLIC_COLUMNS=4
ARG PUBLIC_GITHUB_PAGE
ARG PUBLIC_ROWS=4
ARG PUBLIC_TWITTER_USERNAME

RUN --mount=type=secret,id=ABLY_API_KEY,env=ABLY_API_KEY --mount=type=secret,id=UPSTASH_REDIS_REST_URL,env=UPSTASH_REDIS_REST_URL --mount=type=secret,id=UPSTASH_REDIS_REST_TOKEN,env=UPSTASH_REDIS_REST_TOKEN . "$HOME/.dashrc" \
    && pnpm install --frozen-lockfile \
    && pnpm build \
    && pnpm prune --production

FROM gcr.io/distroless/nodejs24-debian13@sha256:224c2666ddccc33c3f31e9a2ddeb41f14661363f8c2f4921ad48768039a898a1
COPY --from=build-env /build /app
COPY --from=build-env package.json /package.json
COPY --from=build-env /node_modules /node_modules
WORKDIR /app
ENV PORT=5000
ENV NODE_ENV=production
CMD ["index.js"]
