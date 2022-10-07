# Docker file to provide proper PostgreSQL version: it have right postgresql version
# and also installs postgis extension.
# Script below is copied from https://github.com/postgis/docker-postgis/blob/master/11-3.0/Dockerfile
# I'm not using postgis/postgis here because we could add more extension in future.

FROM postgres:14.5

# ENV POSTGRES_USER postgres
# ENV POSTGRES_PASSWORD postgres
# ENV POSTGRES_DB workout

# EXPOSE 5432:5432

RUN apt-get update \ 
     && apt-get install -y --no-install-recommends \
     && rm -rf /var/lib/apt/lists/*