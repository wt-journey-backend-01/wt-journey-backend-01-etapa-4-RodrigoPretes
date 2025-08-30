const { createError } = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader){
        const error = createError(401, 'Nenhum token foi enviado')
        return res.status(401).json({ msg: error.msg });

    } 

    if (!authHeader.startsWith('Bearer ')) {
        const error = createError(401, 'Formato de token inválido');
        return res.status(401).json({ msg: error.msg });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        const error = createError(401, 'Token ausente')
        return res.status(401).json({ msg: error.msg });
    }

    const accessTokenSecret = process.env.JWT_SECRET || 'secret';

    jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
            const error = createError(401, 'Token inválido')
            return res.status(401).json({ msg: error.msg });
        }
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;