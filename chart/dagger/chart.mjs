import { argv } from "node:process";

import Client, { connect } from "@dagger.io/dagger";

import fs from "fs"

const HELM_IMAGE = 'alpine/helm:3.11.2'

const KUBERNETES_VERSION = [

  "1.23.8",
  "1.23.9",
  "1.23.10",
  "1.23.11",
  "1.23.12",
  "1.23.13",
  "1.23.14",
  "1.23.15",
  "1.23.16",
  "1.23.17",
  "1.24.1",
  "1.24.2",
  "1.24.3",
  "1.24.4",
  "1.24.5",
  "1.24.6",
  "1.24.7",
  "1.24.8",
  "1.24.9",
  "1.24.10",
  "1.24.11",
  "1.25.0",
  "1.25.1",
  "1.25.2",
  "1.25.3",
  "1.25.4",
  "1.25.5",
  "1.25.6",
  "1.25.7",
  "1.26.0",
  "1.26.1",
  "1.26.2"

]

connect(async (client) => {

  let helm = await client.container().from(HELM_IMAGE)

  helm = helm.withMountedDirectory('/apps', new Client().host().directory('.', {include: ["templates", "Chart.yaml", "values.yaml", ".helmignore"]})) 

    .withExec(['dep', 'update', '.'])

  await helm.exitCode()

  const template = await helm.withExec(["template", "."]).stdout()

  console.log(template)

  fs.writeFileSync("./templates-output.yaml", template)

  let kubeconform = await client.container().build(

    new Client().host().directory("./dagger", {include: "Dockerfile.kubeconform"}),

    {
      dockerfile: "Dockerfile.kubeconform"
    }

  )

  kubeconform = kubeconform.withMountedDirectory(

    "/apps",

    new Client().host().directory(".", {include: ["templates-output.yaml"]})

  )

  for(const kubernetes_version of KUBERNETES_VERSION){

    console.log(`Testing against k8s-${kubernetes_version}`)

    await kubeconform.withExec(["/usr/local/bin/kubeconform", "--kubernetes-version", kubernetes_version, "/apps/templates-output.yaml"]).exitCode()

  }



}, {LogOutput: process.stdout})

