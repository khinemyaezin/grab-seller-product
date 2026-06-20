FROM node:22-alpine AS platform
WORKDIR /workspace/seller-frontend-platform
COPY seller-frontend-platform/package*.json seller-frontend-platform/tsconfig.base.json ./
COPY seller-frontend-platform/packages ./packages
RUN npm ci && npm run build

FROM node:22-alpine AS builder
WORKDIR /workspace/seller-product-mfe
COPY seller-product-mfe/package*.json ./
COPY --from=platform /workspace/seller-frontend-platform /workspace/seller-frontend-platform
RUN npm ci
COPY seller-product-mfe/ ./
RUN npm run build

FROM nginx:1.29-alpine
COPY seller-product-mfe/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/seller-product-mfe/dist /usr/share/nginx/html
EXPOSE 80
