const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(payload) {
    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.sign(
        { id: payload.id, nome: payload.nome, email: payload.email },
        secret, 
        { expiresIn: '1h' }
    );
}

function generateRefreshToken(payload) {
    const secret = process.env.REFRESH_SECRET || 'refresh_secret';
    return jwt.sign(
        { id: payload.id, nome: payload.nome, email: payload.email },
        secret,
        { expiresIn: '7d' }
    );
}

module.exports = { generateToken, generateRefreshToken };