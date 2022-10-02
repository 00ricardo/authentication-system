import jwt from 'jsonwebtoken'
import User from '../../models/Users.js'
/*
@ This is for protecting routes
@ All the routes we wanna protect 
@ must have this protect call as 
@ parameter in the router

@ The protection is performed by the 
@ JWT and verified
*/

const protect = async (req, res, next) => {
    let token = undefined
    let _status = undefined
    let http = undefined
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {      //we send the token with a prefix 'Baerer' in header request
        try {
            token = req.headers.authorization.split(' ')[1]  //get the token (Baerer <TOKEN>) -> [0] = 'Baerer' || [1] = TOKEN
            const decoded = jwt.verify(token, process.env.JWT_SECRET)               //verify with JWT the token passed and transform it to the a decoded token (user id)
            req.user = await User.findOne({ where: { id: decoded.id } })
            if (req.user) {
                next()
            } else {
                _status = {
                    'status': {
                        'code': 'E404',
                        'message': 'User does not exist.'
                    }
                }
                http = 404
            }
        } catch (error) {
            //this will fired when the token is wrong (doesnt match with the correct one)
            _status = {
                'status': {
                    'code': 'E401',
                    'message': 'Not authorized, wrong/expired token.'
                }
            }
            http = 401
        }
    }
    if (!_status && !token) {       //this will fired when the token is null (undefined)
        _status = {
            'status': {
                'code': 'E401',
                'message': 'Not authorized, missing token.'
            }
        }
        http = 401
    }
    if (!_status) {
        res.status(200)
    }
    else {
        res.status(http).json(_status)
    }
}

export { protect }