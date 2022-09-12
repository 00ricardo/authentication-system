import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign(
        { id },                     //we CANOT pass sensitive data here, we pass the user id
        process.env.JWT_SECRET,     //JWT_SECRET was created by myself randomly : https://generate-random.org/api-token-generator
        { expiresIn: '1d' }        //expires in 1 day) 
    )
}
//  @ Testing correctness JWToken
//  https://jwt.io/ to copy&paste the token and compare to the user id


export default generateToken