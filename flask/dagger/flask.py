import sys

import anyio

import dagger


async def test():

    HOME_APP_DIR = "/app"
    
    versions = ["3.7", "3.8", "3.9", "3.10", "3.11"]

    async with dagger.Connection(dagger.Config(log_output=sys.stderr)) as client:

        src = client.host().directory("./src")

        for version in versions:
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

if __name__ == "__main__":
    anyio.run(test)