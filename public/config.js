const LAMA_API_URL = null
const KEYCLOAK_URL = null
const KEYCLOAK_REALM = null
const KEYCLOAK_CLIENTID = null

const globalConfig = {
  api: {
    url: LAMA_API_URL || 'http://localhost:8080'
  },
  keycloak: {
    url: KEYCLOAK_URL || 'http://localhost:8180/',
    realm: KEYCLOAK_REALM || 'lama',
    clientId: KEYCLOAK_CLIENTID || 'lama',
  }
}