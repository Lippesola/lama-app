#!/bin/sh
# Run by the nginx image's /docker-entrypoint.sh before nginx starts.
# Injects runtime configuration into the built SPA.
# Rewrites config.js in place without sed -i, since the non-root user
# may write config.js but not create files in the html directory.
set -e

CONFIG=/usr/share/nginx/html/config.js
TMP=$(mktemp)

sed \
  -e "s|LAMA_API_URL = null|LAMA_API_URL = \"$LAMA_API_URL\"|g" \
  -e "s|KEYCLOAK_URL = null|KEYCLOAK_URL = \"$KEYCLOAK_URL\"|g" \
  -e "s|KEYCLOAK_REALM = null|KEYCLOAK_REALM = \"$KEYCLOAK_REALM\"|g" \
  -e "s|KEYCLOAK_CLIENTID = null|KEYCLOAK_CLIENTID = \"$KEYCLOAK_CLIENTID\"|g" \
  "$CONFIG" > "$TMP"
cat "$TMP" > "$CONFIG"
rm -f "$TMP"
