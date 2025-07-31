import jwt from 'jsonwebtoken';


const generateToken = (_id) => {
    return jwt.sign({id : _id}, process.env.JWT_SECRET, {expiresIn: '7d'});
}

export default generateToken;