import { argv } from "node:process";

import Client, { connect } from "@dagger.io/dagger";

import fs from "fs:node"

const NODE_IMAGE = "node:18"

const HOME_APP_DIR = "/app"

connect(async (client) => {

  let node = client.container().from(NODE_IMAGE)

  node = node.withWorkdir(HOME_APP_DIR)

  node = node.withMountedDirectory(HOME_APP_DIR, new Client().host().directory('.', {include: ["src", "package.json", "package-lock.json"]})) 

          .withExec(["npm", "install"])

  await node.exitCode()

  // let's lint and test the code
  
  await node.withExec(["npm", "run", "lint"]).exitCode()

  await node.withExec(["npm", "test"]).exitCode()

  // let's build it 
  await node.withExec('npm', 'run', 'build')


}, {LogOutput: process.stdout})

