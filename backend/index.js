const express  = require("express")
const mainRouter = require("./routes/index")
const app = express()
const cors = require("cors")
app.use(cors())


const PORT = 3000


app.use(express.json())

app.use("/api/v1",  mainRouter)

app.listen(PORT, () => {
    console.log(`This app is listening on port ${PORT}`)
})