const secret = process.env.JWT_SECRET
const jwt = require("jsonwebtoken")

const authMiddlware = (req, res, next) => {
    const authHeader  = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(403).json({})
    }

    const token = authHeader.split(" ")[1]

    try {
            const decoded = jwt.verify(token, secret)

            if(decoded.userId){
                req.userId = decoded.userId
                next()
            } else {
                return res.status(403).json({})
            }


    }catch(err){
        res.status(403).json({})
    }

}

module.exports = authMiddlware