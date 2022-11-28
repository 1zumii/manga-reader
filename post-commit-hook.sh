branch="$(git rev-parse --abbrev-ref HEAD)"

if [ "$branch" = "main" ]; then
  echo '🛫 start build and deloy ...'
  pnpm run build && pnpm run deploy
  echo '🤟 Done!'
fi