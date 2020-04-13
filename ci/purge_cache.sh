curl -XPOST \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $CLOUDFLARE_TOKEN" \
     --data '{"purge_everything": true}' \
     "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE/purge_cache"