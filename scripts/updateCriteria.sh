#!/bin/bash

# Define the new criteria with default values
new_criteria='{
    "Story": 0,
    "Character Development": 0,
    "Visual Presentation": 0
}'

# Directory containing the JSON files
directory="./mediaDB/movies/gradedJSONs"

echo "Starting the update process..."

# Iterate over each file in the directory
for filepath in "$directory"/*.json; do
  if [ -f "$filepath" ]; then
    echo "Processing file: $filepath"
    # Use jq to update the criteria_grades object
    jq --argjson new_criteria "$new_criteria" '.media_data.criteria_grades = $new_criteria' "$filepath" > tmp.$$.json
    if [ $? -eq 0 ]; then
      mv tmp.$$.json "$filepath"
      echo "Successfully updated: $filepath"
    else
      echo "Failed to update: $filepath"
      rm tmp.$$.json
    fi
  else
    echo "No JSON files found in the directory."
  fi
done

echo "All files have been updated."