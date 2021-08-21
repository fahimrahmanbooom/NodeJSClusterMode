// libraries
import express from "express"
import os from "os"
import cluster from "cluster"

// properties
const app = express()
const cpus = os.cpus().length

// get route
app.get("/", async function(req, res) {
    
    // some long running fake operations
    for(let i = 0; i < 1e8; i++) { }

    res.status(200).json({ status: "The Server is running on a cluster mode" })
})

// cluster mode
if(cluster.isPrimary) {
    
    for(let i = 0; i < cpus; i++) {
        cluster.fork()
    }

    cluster.on("exit", function() {
        console.log("Worker Died")
        cluster.fork()
    })
}
else {

    app.listen(3000, function() {
        console.log(`Server with a pid of ${process.pid} @ http://localhost:3000 has been started`)
    })
}
