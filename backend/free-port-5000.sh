#!/bin/bash
# Script to free port 5000 by killing processes using it

echo "Checking port 5000..."

# Kill all processes using port 5000
PIDS=$(lsof -ti:5000)
if [ -z "$PIDS" ]; then
    echo "✅ Port 5000 is already free!"
    exit 0
fi

echo "Found processes using port 5000:"
lsof -ti:5000 | xargs ps -p 2>/dev/null | tail -5

echo ""
echo "Killing processes..."
lsof -ti:5000 | xargs kill -9 2>/dev/null

sleep 2

# Check again
if lsof -ti:5000 > /dev/null 2>&1; then
    echo "⚠️  Port 5000 is still in use."
    echo "Please disable AirPlay Receiver in System Settings:"
    echo "   System Settings > General > AirDrop & Handoff > AirPlay Receiver (OFF)"
else
    echo "✅ Port 5000 is now free! You can start the backend server."
fi

