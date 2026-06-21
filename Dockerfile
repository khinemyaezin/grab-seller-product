FROM node:22-alpine AS platform
WORKDIR /workspace/grab-seller-shared-ui
COPY grab-seller-shared-ui/package*.json grab-seller-shared-ui/tsconfig.base.json ./
COPY grab-seller-shared-ui/packages ./packages
RUN npm ci && npm run build

FROM node:22-alpine AS builder
WORKDIR /workspace/grab-seller-product
COPY  grab-seller-product/package*.json ./
COPY --from=platform /workspace/grab-seller-shared-ui /workspace/grab-seller-shared-ui
RUN npm ci
COPY grab-seller-product/ ./
RUN npm run build

FROM nginx:1.29-alpine
COPY grab-seller-product/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/grab-seller-product/dist /usr/share/nginx/html
EXPOSE 80
