#!/bin/sh

GILBARBARA_LOGOS_DIR="./gilbarbara_logos"
GILBARBARA_LOGOS_REPO="https://github.com/gilbarbara/logos.git"

DO_UPDATE=false

if [[ ! -d "$GILBARBARA_LOGOS_DIR" ]]; then
  mkdir $GILBARBARA_LOGOS_DIR
  echo "Cloning Gil Barabara's logos project..."
  git clone $GILBARBARA_LOGOS_REPO $GILBARBARA_LOGOS_DIR
  DO_UPDATE=true
else
  cd $GILBARBARA_LOGOS_DIR
  LOCAL_HEAD=$(git rev-parse @)
  REMOTE_HEAD=$(git rev-parse @{u})
  if [[ $LOCAL_HEAD = $REMOTE_HEAD ]]; then
    echo "Already up to date."
  else
    echo "Pulling latest changes from Gil Barabara's logos project..."
    git pull
    DO_UPDATE=true
  fi
  cd ..
fi

if [[ "$DO_UPDATE" = true ]]; then
  echo "Formatting logos..."
  go run importLogos.go
  echo "Optimizing logos..."
  npm run svgo
fi
