/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('usuarios').del();
  await knex('usuarios').insert([
    {
        "nome": "Rodrigo Pretes",
        "email": "rodrigo.maia@email.com",
        "senha": "$2b$10$MyCqVPT7o8PrVQmeopA82O9uulASodiqB/oD/OD/JuwMi9rpMz1RG"
    },
    {
        "nome": "João Silva",
        "email": "joao.silva@email.com",
        "senha": "$2b$10$MyCqVPT7o8PrVQmeopA82O9uulASodiqB/oD/OD/JuwMi9rpMz1RG"
    },
  ]);
};
