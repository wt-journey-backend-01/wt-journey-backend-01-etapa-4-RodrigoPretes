const { createError } = require('../utils/errorHandler');
const { generateToken } = require('../utils/createToken');
const bcrypt = require('bcrypt');
const userRepository = require('../repositories/usuariosRepository');
const jwt = require('jsonwebtoken');

function buildUser(data){
    const allowed = ['nome', 'email', 'senha'];
    const payload = {};

    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
        return { valid: false, message: 'Body inválido: esperado um objeto.' };
    }

    for (const k of allowed) {
        if (Object.prototype.hasOwnProperty.call(data, k) && data[k] !== undefined) {
            payload[k] = data[k];
        }
    }

    if (payload.nome !== undefined) {
        if (typeof payload.nome !== 'string' || payload.nome.trim() === '') {
            return { valid: false, message: 'Nome enviado é inválido, deve ser um texto.' };
        }
    }

    if (payload.email !== undefined) {
        if (typeof payload.email !== 'string' || payload.email.trim() === '') {
            return { valid: false, message: 'Email enviado é invalido, deve ser um texto.' };
        }
    }

    if (payload.password !== undefined) {
        if (typeof payload.password !== 'string' || payload.password.trim() === '') {
            return { valid: false, message: 'Senha enviada é inválida, deve ser um texto.' };
        }
    }

    return { valid: true, payload };
}

async function register(req, res){
    const userData = req.body;
    const buildedUser = buildUser(userData);

    
    if (!buildedUser.valid) {
        const error = createError(400, buildedUser.message);
        return res.status(error.status).json(error.data);
    }
    
    try{
        const existingUserByEmail = await userRepository.findUserByEmail(buildedUser.payload.email);

        if(existingUserByEmail.status !== 404){
            const error = createError(400, "Usuário já existe, email deve ser único!");
            return res.status(error.status).json({ msg: error.msg });
        }
        
        const hashedPassword = await bcrypt.hash(buildedUser.payload.senha, 10);
        
        const newUser = await userRepository.registerUser({ ...buildedUser.payload, senha: hashedPassword });

        return res.status(newUser.status).json(newUser.data);

    } catch (e) {
        const error = createError(500, e.message);
        return res.status(error.status).json(error.data);
    }
}

async function login(req, res){
    const { email, senha } = req.body;

    if (!email || !senha) {
        const error = createError(400, 'Email e senha são obrigatórios.');
        return res.status(error.status).json(error.data);
    }

    try {
        const user = await userRepository.findUserByEmail(email);
        if (user.status === 404) {
            const error = createError(404, user.msg);
            return res.status(error.status).json(error.data);
        }


        const isMatch = await bcrypt.compare(senha, user.data.senha);

        if (!isMatch) {
            const error = createError(401, 'Credenciais inválidas.');
            return res.status(error.status).json(error.data);
        }

        const token = generateToken(user.data);

        return res.status(200).json({access_token: token});

    } catch (e) {
        const error = createError(500, e.message);
        return res.status(error.status).json(error.data);
    }
}

async function deleteUserById(req, res) {
    const { id } = req.params;

    try {
        const result = await userRepository.deleteUserById(id);
        if (result.status === 404) {
            const error = createError(404, result.msg);
            return res.status(error.status).json(error.data);
        }

        return res.status(204).send();

    } catch (e) {
        const error = createError(500, e.message);
        return res.status(error.status).json(error.data);
    }
}

function userLogged(req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            const error = createError(401, 'Token inválido')
            return res.status(401).json({ message: error.msg });
        }
        const user = decoded;
        return res.status(200).json({user});
    });
}

module.exports = {
    register,
    login,
    deleteUserById,
    userLogged
};