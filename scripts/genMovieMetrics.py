import json
import os
from collections import defaultdict, Counter
from statistics import median
import random

# Directory containing JSON files
# dataset_dir = 'mediaDB/movies/gradedJSONs/'
dataset_dir = 'mediaDB/movies/JSONS/'

# Data structure to hold all movie information
movies = []

# Iterate over files in the dataset directory
for filename in os.listdir(dataset_dir):
    if filename.endswith('.json'):
        file_path = os.path.join(dataset_dir, filename)
        with open(file_path, 'r') as file:
            try:
                movie_data = json.load(file)
                # Append the movie data to the list if it has the essential keys
                if 'media_data' in movie_data and 'media_type' in movie_data and movie_data['media_type'] == 'movie':
                    movies.append(movie_data)
            except json.JSONDecodeError:
                print(f"Error reading {filename}. File is skipped.")

# Verify the list is populated
print(f"Total movies loaded: {len(movies)}")

release_years = [movie['media_data'].get('release_year', 0) for movie in movies if 'release_year' in movie['media_data']]
most_frequent_year = max(set(release_years), key=release_years.count)
median_year = median(release_years)

print(f"Most frequent release year: {most_frequent_year}")
print(f"Median release year: {median_year}")

# Assuming an actor's or director's overall grade is the average of their movies' overall grades

actors_count = Counter()
directors_count = Counter()
actors_grade = defaultdict(list)
directors_grade = defaultdict(list)

# Aggregating counts and grades
for movie in movies:
    media_data = movie.get('media_data', {})
    grade = media_data.get('overall_grade', 0)
    for actor in media_data.get('top_billed_actors', []):
        actors_count[actor] += 1
        actors_grade[actor].append(grade)
    director = media_data.get('director')
    if director:
        directors_count[director] += 1
        directors_grade[director].append(grade)

# Calculating average grade
for actor in actors_grade:
    actors_grade[actor] = sum(actors_grade[actor]) / len(actors_grade[actor])

for director in directors_grade:
    directors_grade[director] = sum(directors_grade[director]) / len(directors_grade[director])

# Sorting based on frequency of appearances and then by grade
favorite_actors = sorted(actors_count.most_common(10), key=lambda x: (-x[1], -actors_grade[x[0]]))
top_directors = sorted(directors_count.most_common(10), key=lambda x: (-x[1], -directors_grade[x[0]]))

print("Top 10 Favorite Actors:", favorite_actors)
print("Top 10 Directors:", top_directors)