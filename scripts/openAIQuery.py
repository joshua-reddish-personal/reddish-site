import os

from openai import AsyncOpenAI


async def promptAI(prompt, model="gpt-4-0125-preview"):

    system_message = "You are assisting with a media review project, written in python"

    async with AsyncOpenAI() as client:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system", 
                    "content": f"{system_message}"
                },
                {
                    "role": "user",
                    "content": prompt,
                },  # You can customize this prompt based on media type
            ],
        )

    return response.choices[0].message.content

file_path = 'scripts/prompt.txt'  # Replace 'your_file.txt' with the actual path to your file

with open(file_path, 'r') as file:
    prompt = file.read()


async def main():
    try:
        response = await promptAI(prompt)
        # Open a file in write mode ('w'). If the file does not exist, it will be created.
        # If the file does exist, its content will be overwritten.
        with open('scripts/response.txt', 'w') as file:
            # Write the content of my_data to the file
            file.write(response)
        # print(response)

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
