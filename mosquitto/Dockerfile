FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    mosquitto \
    mosquitto-clients \
    curl \
    unzip \
    gettext \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /mosquitto/auth /mosquitto/config /mosquitto/data

# Download and extract mosquitto-go-auth
RUN curl -L \
    https://github.com/iegomez/mosquitto-go-auth/releases/download/3.0.0/linux-amd64.zip \
    -o /tmp/go-auth.zip \
    && unzip /tmp/go-auth.zip -d /tmp/go-auth \
    && mv /tmp/go-auth/linux-amd64/go-auth.so /mosquitto/auth/go-auth.so \
    && rm -rf /tmp/go-auth /tmp/go-auth.zip

# Copy configs
COPY config/mosquitto.conf.template /mosquitto/config/mosquitto.conf.template
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 1883 9001

ENTRYPOINT ["/entrypoint.sh"]
