WS_ACCESS_KEY="SqugjXZXs9UcTHgOHWMO"
WS_SECRET_KEY="UQ3NyGLGFfkBGPw6FezF"

URL=($(echo -n "$1" | base64))

REQUEST="categories/v3/$URL?key=$WS_ACCESS_KEY"
HASH=($(echo -n "$WS_SECRET_KEY:$REQUEST" | (md5sum || md5)))

echo "https://api.webshrinker.com/$REQUEST&hash=$HASH"