const express = require("express")

const app = express()

const version = require("../package.json")["version"]

app.get("/", function(req, res){

  res.json({

    ego: "basic-dagger-test",

    version

  })

})


app.listen('8080')
