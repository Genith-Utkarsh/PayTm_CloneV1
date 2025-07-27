const express  = require("express")
const mainRouter = require("./routes/index")
const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.json())

const PORT = 3000




app.use("/api/v1",  mainRouter)

app.listen(PORT, () => {
    console.log(`This app is listening on port ${PORT}`)
})