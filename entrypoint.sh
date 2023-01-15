sed -i 's|LAMA_API_URL = null|LAMA_API_URL = "'$LAMA_API_URL'"|g' /usr/share/nginx/html/config.js 
sed -i 's|KEYCLOAK_URL = null|KEYCLOAK_URL = "'$KEYCLOAK_URL'"|g' /usr/share/nginx/html/config.js
sed -i 's|KEYCLOAK_REALM = null|KEYCLOAK_REALM = "'$KEYCLOAK_REALM'"|g' /usr/share/nginx/html/config.js
sed -i 's|KEYCLOAK_CLIENTID = null|KEYCLOAK_CLIENTID = "'$KEYCLOAK_CLIENTID'"|g' /usr/share/nginx/html/config.js

nginx -g daemon off;
