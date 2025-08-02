echo "=============================="
echo "🚀 Clarity Bot Dev Script"
echo "=============================="
echo
echo "Choose an option:"
echo "1) Run project (pnpm dev)"
echo "2) Build project (pnpm run build)"
echo

read -p "Enter choice [1-2]: " choice

case $choice in
  1)
    echo "Running Clarity Bot in development mode..."
    pnpm dev
    ;;
  2)
    echo "Building Clarity Bot..."
    pnpm run build
    ;;
  *)
    echo "❌ Invalid choice. Exiting."
    exit 1
    ;;
esac