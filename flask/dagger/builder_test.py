# content of test_sample.py
from builder import build_images
import sys
import dagger
import pytest
import tempfile
from os import path

async def file_exists(dir: dagger.Directory, file: str) -> bool:
    try:
        
        with tempfile.TemporaryDirectory() as tmp:
            tmp_file = path.join(tmp, file)
            await dir.file(file).export(tmp_file)
            return path.exists(tmp_file)
    
    except Exception as e:
        print(e)
        return False

@pytest.mark.asyncio
async def test_app_exists():

    async with dagger.Connection(dagger.Config(log_output=sys.stdout)) as client:

        images = await build_images(client)

        appDir = images[0].directory("/app")

        assert(await file_exists(appDir, "app.py"))

@pytest.mark.asyncio
async def test_secret_does_not_exist():

    async with dagger.Connection(dagger.Config(log_output=sys.stdout)) as client:

        images = await build_images(client)

        appDir = images[0].directory("/app")

        assert(await file_exists(appDir, "secret") == False)
