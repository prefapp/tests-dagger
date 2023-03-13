import { argv } from "node:process";

import Client, { connect } from "@dagger.io/dagger";

import fs from "fs"

const NODE_IMAGE = "node:18"

const NODE_IMAGE_FINAL = "node:18-slim"

const HOME_APP_DIR = "/app"

connect(async (client) => {

  let node = client.container().from(NODE_IMAGE)

  node = node.withExec(["npm", "i", "-g", "@vercel/ncc"])

  await node.exitCode()

  node = node.withWorkdir(HOME_APP_DIR)

  node = node.withMountedDirectory(HOME_APP_DIR, new Client().host().directory('.', {include: ["src", "package.json", "package-lock.json", "test"]})) 

          .withExec(["npm", "install"])

  await node.exitCode()

  // let's lint and test the code
  
  await node.withExec(["npm", "run", "lint"]).exitCode()

  await node.withExec(["npm", "test"]).exitCode()

  // let's build it 
  await node.withExec(['npm', 'run', 'build']).exitCode()

  // let's package it

  let final_container = client.container().from(NODE_IMAGE_FINAL)

  final_container = final_container

      .withWorkdir(HOME_APP_DIR)

      .withDirectory(HOME_APP_DIR, node.directory(HOME_APP_DIR  + "/dist"))

  // let's publish it
  

}, {LogOutput: process.stdout})

