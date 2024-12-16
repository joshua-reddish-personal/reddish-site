import os
import json
import subprocess
import argparse

# Define the new criteria for video games
video_game_criteria = {
    "Story": 0,
    "Gameplay": 0,
    "Graphics": 0
}

# Define the new criteria for TV shows
tv_show_criteria = {
    "Story": 0,
    "Character Development": 0,
    "Visual Presentation": 0
}

# Define the new criteria for movies
movie_criteria = {
    "Story": 0,
    "Character Development": 0,
    "Visual Presentation": 0
}

# Define the new criteria for books
book_criteria = {
    "Story": 0,
    "Character Development": 0,
    "Immersion": 0
}

# Define the required keys for video games
required_keys_video_game = {
    "media_type": "video_game",
    "graded": True,
    "criteria_graded": False,
    "media_data": {
        "title": "",
        "developer": "",
        "release_year": 0,
        "genres": [],
        "short_description": "",
        "criteria_grades": video_game_criteria,
        "overall_grade": 0,
        "notes": "Favorite Scenes, Favorite Lines"
    }
}

# Define the required keys for TV shows
required_keys_tv_show = {
    "media_type": "tv_show",
    "graded": True,
    "criteria_graded": False,
    "media_data": {
        "title": "",
        "creator": "",
        "release_year": 0,
        "genres": [],
        "top_billed_actors": [],
        "short_description": "",
        "criteria_grades": tv_show_criteria,
        "overall_grade": 0,
        "notes": "Favorite Scenes, Favorite Lines"
    }
}

# Define the required keys for movies
required_keys_movie = {
    "media_type": "movie",
    "graded": True,
    "criteria_graded": False,
    "media_data": {
        "title": "",
        "director": "",
        "release_year": 0,
        "genres": [],
        "top_billed_actors": [],
        "short_description": "",
        "criteria_grades": movie_criteria,
        "overall_grade": 0,
        "quotes": [],
        "notes": "Favorite Scenes, Favorite Lines"
    }
}

# Define the required keys for books
required_keys_book = {
    "media_type": "book",
    "graded": True,
    "criteria_graded": False,
    "media_data": {
        "title": "",
        "author": "",
        "publication_year": 0,
        "genres": [],
        "publisher": "",
        "short_description": "",
        "criteria_grades": book_criteria,
        "overall_grade": 0,
        "notes": "Favorite Scenes, Favorite Lines"
    }
}

# Directories containing the JSON files
directories = {
    "video_game": "./mediaDB/video_games/gradedJSONs",
    "tv_show": "./mediaDB/tv_shows/gradedJSONs",
    "movie": "./mediaDB/movies/gradedJSONs",
    "book": "./mediaDB/books/gradedJSONs"
}

def issue_exists(title):
    result = subprocess.run(["gh", "issue", "list", "--search", title, "--json", "title"], capture_output=True, text=True)
    issues = json.loads(result.stdout)
    return any(issue["title"] == title for issue in issues)

def create_github_issue(filepath, missing_keys):
    filename = os.path.basename(filepath).replace('.json', '')
    media_type = filepath.split('/')[-3]  # Assuming the directory structure is consistent
    title = f"{media_type}: Missing keys for {filename}"
    
    if issue_exists(title):
        print(f"Issue already exists for: {filepath}")
        return
    
    body = f"The following keys are missing in the file {filepath}:\n\n" + "\n".join(missing_keys)
    subprocess.run(["gh", "issue", "create", "--title", title, "--body", body, "--label", "mediaDB"])

def log_to_file(filepath, missing_keys, log_file):
    with open(log_file, 'a') as log:
        log.write(f"{filepath}\n")
        log.write("Missing keys:\n")
        log.write("\n".join(missing_keys) + "\n\n")

def check_criteria(filepath, required_keys, dry_run, log_file):
    with open(filepath, 'r') as file:
        data = json.load(file)
    
    incorrect = False
    missing_keys = []

    # Check for missing keys in the overall JSON structure
    def check_keys(required, actual, path=""):
        nonlocal incorrect
        for key, value in required.items():
            full_key = f"{path}.{key}" if path else key
            if key not in actual:
                print(f"Missing key {full_key} in file: {filepath}")
                missing_keys.append(full_key)
                incorrect = True
            elif isinstance(value, dict):
                check_keys(value, actual[key], full_key)
    
    check_keys(required_keys, data)
    
    if incorrect:
        if dry_run:
            log_to_file(filepath, missing_keys, log_file)
            print(f"Logged missing keys for: {filepath}")
        else:
            create_github_issue(filepath, missing_keys)
            print(f"Created GitHub issue for incorrect file: {filepath}")
    else:
        print(f"No issues found in: {filepath}")

def process_files(directory, required_keys, dry_run, log_file):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.json'):
                filepath = os.path.join(root, file)
                check_criteria(filepath, required_keys, dry_run, log_file)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Check JSON files for missing keys and create GitHub issues or log to a file.")
    parser.add_argument("--dry-run", action="store_true", help="Log missing keys to a file instead of creating GitHub issues.")
    parser.add_argument("--media-type", choices=["video_game", "tv_show", "movie", "book"], help="Specify the media type to check.")
    parser.add_argument("--title", help="Specify the title of the media to check.")
    args = parser.parse_args()

    dry_run = args.dry_run
    media_type = args.media_type
    title = args.title
    log_file = "missing_keys_log.txt"

    if dry_run:
        # Clear the log file before starting
        open(log_file, 'w').close()

    if media_type and title:
        directory = directories[media_type]
        filepath = os.path.join(directory, f"{title}.json")
        if os.path.exists(filepath):
            required_keys = globals()[f"required_keys_{media_type}"]
            check_criteria(filepath, required_keys, dry_run, log_file)
        else:
            print(f"File not found: {filepath}")
    else:
        # Process files for each media type
        process_files(directories["video_game"], required_keys_video_game, dry_run, log_file)
        process_files(directories["tv_show"], required_keys_tv_show, dry_run, log_file)
        process_files(directories["movie"], required_keys_movie, dry_run, log_file)
        process_files(directories["book"], required_keys_book, dry_run, log_file)
    
    print("All files have been processed.")