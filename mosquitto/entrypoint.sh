#!/bin/sh
set -e

CONFIG_IN="/mosquitto/config/mosquitto.conf.template"
CONFIG_OUT="/mosquitto/config/mosquitto.conf"

# Render config safely
envsubst < "$CONFIG_IN" > "$CONFIG_OUT"

exec mosquitto -c "$CONFIG_OUT"

