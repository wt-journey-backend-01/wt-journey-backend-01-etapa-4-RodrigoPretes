/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('users').del();
  await knex('users').insert([
    {
        "nome": "Rodrigo Pretes",
        "email": "rodrigo.maia@email.com",
        "senha": "123456"
    },
    {
        "nome": "João Silva",
        "email": "joao.silva@email.com",
        "senha": "123456"
    },
  ]);
};
