import json
import argparse
import os
import re
from openai import AsyncOpenAI


async def generate_media_data(title, media_type):
    # Define JSON structure based on media type
    if media_type == "book":
        system_message = (
            "Generate metadata for a book.",
            "Provide information similar to what can be found on Good Reads, Wikipedia, or when googling the title.",
            'The returned JSON format should be: {"title": "string", "author": "string", "publication_year": "number", "genres": ["fiction", "mystery", "thriller"], "publisher": "string", "short_description": "string"}'
            "If you can't find valid data, respond with 'DATA_NOT_FOUND'",
        )
    elif media_type == "movie":
        system_message = (
            "Generate metadata for a movie.",
            "Provide information similar to what can be found on IMDB or when googling the title.",
            'The returned JSON format should be: {"title": "string", "director": "string", "release_year": "number", "genres": ["action", "adventure", "sci-fi"], "top_billed_actors": ["John Smith", "Jane Doe"], "short_description": "string"}'
            "If you can't find valid data, respond with 'DATA_NOT_FOUND'",
        )
    elif media_type == "tv_show":
        system_message = (
            "Generate metadata for a TV show.",
            "Provide information similar to what can be found on IMDB or when googling the title.",
            'The returned JSON format should be: {"title": "string", "creator": "string", "release_year": "number", "genres": ["action", "adventure", "sci-fi"], "top_billed_actors": ["John Smith", "Jane Doe"], "short_description": "string"}'
            "If you can't find valid data, respond with 'DATA_NOT_FOUND'",
        )
    elif media_type == "video_game":
        system_message = (
            "Generate metadata for a video game.",
            "Provide information similar to what can be found on Wikipedia or when googling the title.",
            'The returned JSON format should be: {"title": "string", "developer": "string", "release_year": "number", "genres": ["drama", "comedy", "mystery"], "short_description": "string"}'
            "If you can't find valid data, respond with 'DATA_NOT_FOUND'",
        )
    else:
        return None  # Invalid media type

    try:
        # Call OpenAI API for generating media data
        async with AsyncOpenAI() as client:
            response = await client.chat.completions.create(
                model="gpt-4-0125-preview",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": f"{system_message}"},
                    {
                        "role": "user",
                        "content": f"{title} is {title}",
                    },  # You can customize this prompt based on media type
                ],
            )

        media_data = response.choices[0].message.content

        json.loads(media_data)  # Check if it's valid JSON
        return media_data

    except json.JSONDecodeError:
        print(f"OpenAI did not provide valid JSON:\n{media_data}")
        return None


async def prompt_media_details(media_type, title, proceed=False):
    title = title.lower().replace(" ", "_")

    # Generate media data using OpenAI
    media_data = await generate_media_data(title, media_type)

    if media_data:
        try:
            # Attempt to parse the OpenAI response as JSON
            media_data = json.loads(media_data)
            print("OpenAI-generated media data:")
            print(json.dumps(media_data, indent=2))

            if "DATA_NOT_FOUND" in media_data:
                proceed = True

            # If proceed is True, skip the prompt
            if proceed:
                return media_data
            else:
                proceed = input("Is this data sufficient? (y/n): ").lower() == "y"
                if proceed:
                    return media_data

        except json.JSONDecodeError:
            print(
                f"OpenAI response is not valid JSON.",
            )

    return None


async def process_media_title(media_type, title, proceed, graded, retry=False):
    media_data = await prompt_media_details(media_type, title, proceed)

    if media_data:
        if "DATA_NOT_FOUND" in media_data:
            # Directly create 'unprocessed' file if 'DATA_NOT_FOUND' is in the response
            safe_title = (
                re.sub(r"[^a-zA-Z0-9_]", "_", title.lower().replace(" ", "_"))
                + "_unprocessed"
            )
            media_data = {"title": title, "error": "Data not found"}
            final_output = {
                "media_type": media_type,
                "graded": graded,
                "criteria_graded": False,
                "media_data": {"title": title, "error": "Failed to process"},
            }
        else:
            # Process normally if valid data is found
            safe_title = media_data.get("title", title).lower().replace(" ", "_")
            safe_title = re.sub(r"[^a-zA-Z0-9_]", "_", safe_title)
            if media_type == "movie":
                media_data.update(MOVIE_ADDITIONAL_DATA)
            elif media_type == "book":
                media_data.update(BOOK_ADDITIONAL_DATA)
            elif media_type == "video_game":
                media_data.update(VIDEO_GAME_ADDITIONAL_DATA)
            elif media_type == "tv_show":
                media_data.update(TV_ADDITIONAL_DATA)
            final_output = {
                "media_type": media_type,
                "graded": graded,
                "criteria_graded": False,
                "media_data": media_data,
            }
    else:
        if retry:
            # Create 'unprocessed' file if retry fails
            safe_title = (
                re.sub(r"[^a-zA-Z0-9_]", "_", title.lower().replace(" ", "_"))
                + "_unprocessed"
            )
            media_data = {"title": title, "error": "Failed to process after retry"}
            final_output = {
                "media_type": media_type,
                "graded": graded,
                "criteria_graded": False,
                "media_data": {
                    "title": title,
                    "error": "Failed to process after retry",
                },
            }
        else:
            # Retry once more if the initial attempt fails
            return await process_media_title(
                media_type, title, proceed, graded, retry=True
            )

    # Determine the output folder based on whether the media is graded
    output_folder = (
        f"../mediaDB/{media_type}s/gradedJSONs"
        if graded
        else f"../mediaDB/{media_type}s/ungradedJSONs"
    )

    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    filename = f"{safe_title}.json"
    filepath = os.path.join(output_folder, filename)

    # Save the media data to a file
    with open(filepath, "w") as json_file:
        json.dump(final_output, json_file, indent=2)

    return filepath


MEDIA_TYPE_MAP = {
    "tv": "tv_show",
    "tv show": "tv_show",
    "tv shows": "tv_show",
    "tv_show": "tv_show",
    "tv_shows": "tv_show",
    "movie": "movie",
    "movies": "movie",
    "book": "book",
    "books": "book",
    "video game": "video_game",
    "video games": "video_game",
    "video_game": "video_game",
    "video_games": "video_game",
}

MOVIE_ADDITIONAL_DATA = {
    "criteria_grades": {
        "Story": 0,
        "Character Development": 0,
        "Visual Presentation": 0,
    },
    "quotes": [],
    "notes": "",
}

TV_ADDITIONAL_DATA = {
    "criteria_grades": {
        "Story": 0,
        "Character Development": 0,
        "Visual Presentation": 0,
    },
    "quotes": [],
    "notes": "",
}

BOOK_ADDITIONAL_DATA = {
    "criteria_grades": {"Story": 0, "Character Development": 0, "Immersion": 0},
    "quotes": [],
    "notes": "",
}

VIDEO_GAME_ADDITIONAL_DATA = {
    "criteria_grades": {"Story": 0, "Gameplay": 0, "Graphics": 0},
    "quotes": [],
    "notes": "",
}


async def main():
    try:
        parser = argparse.ArgumentParser(
            description="Generate media data using OpenAI.",
        )
        parser.add_argument("--media_type", help="Type of media")
        parser.add_argument("--title", help="Title of the media")
        parser.add_argument(
            "--graded", action="store_true", help="Specify if the media is graded"
        )
        parser.add_argument(
            "--proceed",
            action="store_true",
            help="Skip the 'Is this data sufficient?' prompt",
        )

        args = parser.parse_args()

        standard_media_type = MEDIA_TYPE_MAP.get(args.media_type.lower(), None)
        if not standard_media_type:
            print(f"Invalid media type: {args.media_type}")
            return

        filepath = await process_media_title(
            standard_media_type, args.title, args.proceed, args.graded
        )
        print(f"{args.media_type} data saved to {filepath}")

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
