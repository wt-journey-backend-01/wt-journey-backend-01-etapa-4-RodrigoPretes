const jwt = require('jsonwebtoken');
const { configDotenv } = require('dotenv');

configDotenv();

function generateToken(payload) {
    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.sign({ id: payload.id, username: payload.nome }, secret, {
        expiresIn: '1h',
    });
}

function generateRefreshToken(user) {
    return jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' } // longo
    );
}

module.exports = { generateToken, generateRefreshToken };