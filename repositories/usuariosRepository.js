const { createError } = require('../utils/errorHandler');
const db = require('../db/db');

async function registerUser(newUser){
    try{
        const [userRegistred] = await db.insert(newUser).into('usuarios').returning('*');

        return {
            status: 201,
            data: {
                ...userRegistred
            },
            msg: "Usuário registrado com sucesso"
        };
    }catch(e){
        return createError(400, `Ocorreu um erro ao realizar a inserção de um novo usuário: ${e.message}`);
    }
}

async function findUserByEmail(email) {
    try{
        const user = await db.select('*').from('usuarios').where('usuarios.email', email);

        if(!user.length){
            return createError(404, "Não foi encontrado nenhum usuário")
        }

        return {
            status: 200,
            data: {
                ...user[0]
            },
            msg: "Usuário encontrado com sucesso"
        }
    }catch(e){
        return createError(400, `Erro na busca do usuário por email, erro detalhado: ${e.message}`);
    }
}

async function findUserByUsername(username) {
    try{
        const user =  await db.select('*').from('usuarios').where( 'usuarios.username', username );

        if(!user.length){
            return createError(404, "Não foi encontrado nenhum usuário com esse username")
        }

        return {
            status: 200,
            data: {
                ...user[0]
            },
            msg: "Usuário encontrado com sucesso"
        }
    }catch(e){
        return createError(400, `Erro na busca do usuário por username, erro detalhado: ${e.message}`);
    }
}

async function findById(id) {
    try{
        const user = await db.select('*').from('usuarios').where('usuarios.id', id);

        if(!user.length){
            return createError(404, "Não foram encontrados nenhum usuário com esse ID.")
        }

        return {
            status: 200,
            data: {
                ...user[0]
            },
            msg: "Usuário encontrado com sucesso"
        }
    }catch(e){
        return createError(400, `Erro na busca do usuário por ID, erro detalhado: ${e.message}`)
    }
}

async function deleteUserById(id){
    try{
        const user = await db.select('*').from('usuarios').where('usuarios.id', id);

        if(!user.length){
            return createError(404, "Não foram encontrados nenhum usuário com esse ID.")
        }

        const deletedUser = await db('usuarios').where('usuarios.id', id).del();

        if(deletedUser === 0){
            return createError(400, "Não foi possível deletar o usuário.")
        }

        return{
            status: 204,
            data: null,
            msg: "Usuário deletado com sucesso"
        }
    }catch(e){
        return createError(400, `Erro ao realizar exclusão do usuário, erro detalhado: ${e.message}`);
    }
}


module.exports = {
    registerUser,
    findUserByUsername,
    findUserByEmail,
    findById,
    deleteUserById
}