const { UnauthorizedError } = require("../error");

const searchPermissions = (requestingUser, resourceUserId) => {
    if(requestingUser.userRole === 'admin'){
        return;  
    } 
    if(requestingUser.userId === resourceUserId.toString()){
        return;
    }

    throw new UnauthorizedError("You are not high level enough to access this route");
}

module.exports = searchPermissions;