const admin = (req , res , next) => {
    try {
        if(!req.user){
            return res.status(401).json({
                message : "Not authorized"
            })
        } 
        if(req.user.role === "admin"){
            return next();
        }
        return res.status(403).json({
            message : "Not authorized as admin"
        })
    } catch (error) {
        console.error("Admin Error" , error.message)
        return res.status(500).json({
            message : "Server Error"
        })
    }
}

module.exports = {admin};