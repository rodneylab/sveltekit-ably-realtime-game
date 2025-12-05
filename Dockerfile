FROM node:24-alpine3.23@sha256:682368d8253e0c3364b803956085c456a612d738bd635926d73fa24db3ce53d7 AS build-env
COPY . /app
WORKDIR /app

RUN npm run build

FROM gcr.io/distroless/nodejs24-debian13@sha256:224c2666ddccc33c3f31e9a2ddeb41f14661363f8c2f4921ad48768039a898a1
COPY --from=build-env /build /app
WORKDIR /app
ENV PORT=5000
CMD ["index.js"]
