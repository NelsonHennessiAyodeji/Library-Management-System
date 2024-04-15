const { createJWT } = require("./jwt")

const attachCookiesToResponse = (res, userToken) => {
    const token = createJWT({payload: userToken});
    
    const oneDay = 1000 * 60 * 60 * 24;//1millisecond x 60sec x 60min x 24 hr

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    });
}

module.exports = attachCookiesToResponse;
