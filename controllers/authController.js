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

    const keys = Object.keys(data);
    for (const key of keys) {
        if (!allowed.includes(key)) {
            return { valid: false, message: `Campo extra não permitido: ${key}` };
        }
    }

    for (const field of allowed) {
        if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
            return { valid: false, message: `Campo obrigatório ausente ou inválido: ${field}` };
        }
        payload[field] = data[field].trim();
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

    if (payload.senha !== undefined) {
        if (typeof payload.senha !== 'string' || payload.senha.trim() === '') {
            return { valid: false, message: 'Senha enviada é inválida, deve ser um texto.' };
        }
    }

    const senha = payload.senha;
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!senhaRegex.test(senha)) {
        return { valid: false, message: 'Senha não atende aos critérios de segurança.' };
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

        return res.status(200).json({acess_token: token});

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
    return res.status(200).json({ user: req.user });
}

module.exports = {
    register,
    login,
    deleteUserById,
    userLogged
};