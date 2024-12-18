const role = (permission) =>{
    return (req,res,next) =>{
        const userRole = req.body.role;
        console.log("yourrole",userRole);
        if(permission.includes(userRole)){
            next()
        }else{
            return res.send({"msg":"Unauthorised"})
        }
    }
}


module.exports={role}