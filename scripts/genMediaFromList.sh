#!/bin/bash

# Prompt for media type
read -p "Enter media type (e.g., book, movie, tv_show, video_game): " media_type

# Prompt for media list file
read -p "Enter path to the .txt file containing the list of media titles: " media_list

# Check if the file exists
if [ ! -f "$media_list" ]; then
    echo "File not found: $media_list"
    exit 1
fi

# Prompt for grading
read -p "Is the list graded? (y/n): " graded

# Process each line in the media list
while IFS= read -r title || [ -n "$title" ]; do
    # Call the Python script with arguments
    if [ "$graded" == "y" ]; then
        python3 genMediaJSON.py --media_type "$media_type" --title "$title" --graded --proceed
    else
        python3 genMediaJSON.py --media_type "$media_type" --title "$title" --proceed
    fi
done < "$media_list"
