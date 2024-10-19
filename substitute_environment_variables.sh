#!/bin/sh
ROOT_DIR=/usr/share/nginx/html
# Replace env vars in files served by NGINX
for file in $ROOT_DIR/assets/*.js*;
do
  sed -i 's|VITE_EMAILS_JS_KEY_PLACEHOLDER|'${VITE_EMAILS_JS_KEY}'|g' $file
done

# Let container execution proceed
exec "$@"