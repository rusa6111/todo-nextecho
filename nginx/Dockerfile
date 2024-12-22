FROM nginx:latest AS development

COPY ./default.development.conf /etc/nginx/conf.d/default.conf
# RUN envsubst '$$FRONTEND_HOST $$BACKEND_HOST' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

FROM --platform=linux/x86_64 nginx:latest AS production

COPY ./default.production.conf /etc/nginx/conf.d/default.conf
# RUN envsubst '$$FRONTEND_HOST $$BACKEND_HOST' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
