import sys
import anyio
import asyncio
import dagger

async def build_images(client):

    versions = ["3.7", "3.8"]

    tasks = [build_image(client, version) for version in versions]
    results = await asyncio.gather(*tasks)

    return results
    
async def build_image(client, version):

    HOME_APP_DIR = "/app"

    src = client.host().directory("./src")

    python = (
        client.container()
        .from_(f"python:{version}-slim-buster")
        .with_mounted_directory(HOME_APP_DIR, src)
        .with_workdir(HOME_APP_DIR)
        .with_exec(["pip", "install", "-r", "requirements.txt"])
    )

    python = (
        python.with_exec(["python", "-m", "unittest"])
    )

    print(await python.stdout())

    return python

async def push_images():

    async with dagger.Connection(dagger.Config(log_output=sys.stdout)) as client:

        images = await build_images(client)
        print(images)

if __name__ == "__main__":
    anyio.run(push_images)
