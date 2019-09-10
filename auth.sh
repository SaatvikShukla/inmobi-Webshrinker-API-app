WS_ACCESS_KEY="DDL9l5B3pTtQMsGOaPVB"
WS_SECRET_KEY="bhvQhfbvorx2LlkSGlz7"

URL=($(echo -n "https://www.google.com" | base64))

REQUEST="categories/v3/$URL?key=$WS_ACCESS_KEY"
HASH=($(echo -n "$WS_SECRET_KEY:$REQUEST" | (md5sum || md5)))

echo "https://api.webshrinker.com/$REQUEST&hash=$HASH"