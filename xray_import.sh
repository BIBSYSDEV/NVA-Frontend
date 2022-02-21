export SECRET_STRING=$(aws secretsmanager get-secret-value --secret-id XrayApiKey | jq -r .SecretString)
export CLIENT_ID=$(echo $SECRET_STRING | jq -r .XrayClientId)
export CLIENT_SECRET=$(echo $SECRET_STRING | jq -r .XrayClientSecret)
export AUTH_BODY=$(jq --null-input --arg clientId "$CLIENT_ID" --arg secretId "$CLIENT_SECRET" '{"client_id":$clientId, "client_secret":$secretId}')
export BEARER_TOKEN=$(curl -H "Content-Type:application/json" -X POST --data "$AUTH_BODY" https://xray.cloud.getxray.app/api/v2/authenticate | tr -d '"')
for f in cypress/cucumber-json/*; do curl -H "Content-Type:application/json" -X POST -H "Authorization:Bearer $BEARER_TOKEN"  --data @"$f" https://xray.cloud.getxray.app/api/v2/import/execution/cucumber; done
