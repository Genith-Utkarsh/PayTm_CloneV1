const mongoose = require("mongoose")
const { maxLength, minLength } = require("zod")

dotenv.config()

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Mongo connected successfully"))
.catch((err) => {
    console.log(err)
})

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        require : true,
        unique : true,
        trim : true,
        minLength : 3,
        maxLength : 30,
    },
    password : {
        type : String,
        require : true,
        trim : true,
        minLength : 3,
        maxLength : 12,
        select : false,
    },
    firstName : {
        type : String,
        require : true,
        minLength : 3,
        maxLength : 12,
        trim : true,
    },
    lastName : {
        type : String,
        trim : true,
    }

})





const User = mongoose.model("User", userSchema)

module.exports = User