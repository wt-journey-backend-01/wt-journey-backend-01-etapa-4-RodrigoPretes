const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(payload) {
    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.sign({ id: payload.id, nome: payload.nome, email: payload.email }, secret, {
        expiresIn: '1h',
    });
}

function generateRefreshToken(payload) {
    return jwt.sign(
        { id: payload.id, nome: payload.nome, email: payload.email },
        process.env.REFRESH_SECRET,
        { expiresIn: '7d' } 
    );
}

module.exports = { generateToken, generateRefreshToken };