import os
import json

# Define the directory containing the legacy JSON files
movie_dir = '/Users/joshreddish/development/reddish-site/mediaDB/books/gradedJSONs'

def transform_legacy_to_new_format(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)

    # Transform the structure
    new_data = {
        "metadata": {
            "media_type": data["media_type"],
            "title": data["media_data"]["title"],
            "director": data["media_data"]["director"],
            "release_year": data["media_data"]["release_year"],
            "genres": data["media_data"]["genres"],
            "top_billed_actors": data["media_data"]["top_billed_actors"],
            "criteria_grades": data["media_data"]["criteria_grades"]
        },
        "content": {
            "short_description": data["media_data"]["short_description"],
            "quotes": data["media_data"]["quotes"],
            "notes": data["media_data"]["notes"]
        }
    }

    # Write the transformed data back to the file
    with open(file_path, 'w') as file:
        json.dump(new_data, file, indent=4)

def transform_all_files_in_directory(directory):
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            file_path = os.path.join(directory, filename)
            print(file_path)
            try:
                transform_legacy_to_new_format(file_path)
            except Exception as e:
                print(f'Error transforming {filename}: {e}')
            print(f'Transformed {filename}')

# Transform all files in the movie directory
transform_all_files_in_directory(movie_dir)