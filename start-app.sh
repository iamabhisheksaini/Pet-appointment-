#!/bin/bash

# Start the React Native app and handle console output properly
# This prevents zsh parse errors from special characters in console output

echo "Starting React Native Appointment App..."
echo "=================================="

# Use exec to replace the shell process and prevent parsing issues
exec npm start

# Alternative: if you want to capture output safely
# npm start 2>&1 | cat
