<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 9 créditos restantes para usar o sistema de feedback AI.

# Feedback para RodrigoPretes:

Nota final: **47.0/100**

Olá, RodrigoPretes! 👋🚀

Primeiramente, parabéns pelo esforço e pelo que você já conseguiu implementar até aqui! 🎉 Você avançou bastante, especialmente na organização do seu projeto e em várias funcionalidades essenciais da API. É muito legal ver que a autenticação com JWT está funcionando, que você conseguiu fazer o registro, login, logout e exclusão de usuários, além de proteger as rotas de agentes e casos com middleware. Isso mostra que você já tem uma boa base para uma API segura.

---

## 🚀 Pontos Fortes que Você Mandou Bem

- **Autenticação JWT funcionando:** Seu middleware `authMiddleware.js` está corretamente validando o token e protegendo as rotas sensíveis, o que é fundamental para a segurança da aplicação.
- **Estrutura de diretórios organizada:** Você seguiu bem a arquitetura MVC, com controllers, repositories, rotas, middlewares e utils bem separados.
- **Cadastro de usuários com hashing de senha:** Você usou o bcrypt para hash da senha, o que é ótimo para segurança.
- **Documentação Swagger:** Vejo que você já está usando Swagger para documentar os endpoints, o que é uma prática excelente para APIs profissionais.
- **Endpoints de agentes e casos implementados com validações e tratamento de erros personalizados:** Isso mostra cuidado com a experiência do usuário da API.

Além disso, parabéns por ter implementado o endpoint `/usuarios/me` para retornar dados do usuário logado, um bônus importante para a aplicação!

---

## 🕵️‍♂️ Análise Profunda dos Pontos que Precisam de Ajuste

### 1. Validação da senha no cadastro de usuário (registro)

**O que observei:**

No seu `authController.js`, a função `buildUser` está validando os campos `nome`, `email` e `senha` (que está no payload como `senha`). Porém, notei que dentro da validação você está verificando se `payload.password` existe, que não está correto pois o campo no payload é `senha`:

```js
if (payload.password !== undefined) {
    if (typeof payload.password !== 'string' || payload.password.trim() === '') {
        return { valid: false, message: 'Senha enviada é inválida, deve ser um texto.' };
    }
}
```

Aqui, `payload.password` será sempre `undefined` porque o campo correto é `senha`. Isso significa que sua validação de senha está falhando em capturar casos de senha vazia ou nula.

**Por que isso impacta:**

- Você não está validando corretamente se a senha foi enviada.
- Isso faz com que o sistema aceite senhas vazias ou nulas, o que viola os requisitos de segurança e gera erros nos testes.

**Como corrigir:**

Altere para validar `payload.senha`:

```js
if (payload.senha !== undefined) {
    if (typeof payload.senha !== 'string' || payload.senha.trim() === '') {
        return { valid: false, message: 'Senha enviada é inválida, deve ser um texto.' };
    }
}
```

Além disso, você deve implementar as validações extras para a senha, conforme o requisito:

- Mínimo 8 caracteres
- Pelo menos uma letra maiúscula
- Pelo menos uma letra minúscula
- Pelo menos um número
- Pelo menos um caractere especial

Você pode usar uma regex para isso, por exemplo:

```js
const senha = payload.senha;
const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
if (!senhaRegex.test(senha)) {
    return { valid: false, message: 'Senha não atende aos critérios de segurança.' };
}
```

---

### 2. Nome da tabela de usuários no banco de dados e consultas no código

**O que observei:**

Na sua migration (`20250804235612_solution_migrations.js`), você criou a tabela de usuários com o nome `users`:

```js
await knex.schema.createTable('users', (table)=> {
  table.increments('id').primary();
  table.string('nome').notNullable().unique();
  table.string('email').notNullable().unique();
  table.string('senha').notNullable();
})
```

Porém, no enunciado e nas outras partes do projeto, o nome esperado da tabela é `usuarios`.

Além disso, no seu `usuariosRepository.js`, as consultas são feitas para a tabela `users`:

```js
const [userRegistred] = await db.insert(newUser).into('users').returning('*');
// ...
const user = await db.select('*').from('users').where('users.email', email).returning('*');
```

**Por que isso impacta:**

- O enunciado pede para criar a tabela `usuarios`, e o código espera essa tabela para funcionar corretamente.
- Usar `users` pode causar inconsistência e falha nos testes que esperam a tabela `usuarios`.
- Além disso, no seu arquivo de seed `usuarios.js` (não enviado aqui, mas mencionado na estrutura), é esperado que a tabela seja `usuarios`.

**Como corrigir:**

- Altere sua migration para criar a tabela `usuarios` (em vez de `users`):

```js
await knex.schema.createTable('usuarios', (table)=> {
  table.increments('id').primary();
  table.string('nome').notNullable();
  table.string('email').notNullable().unique();
  table.string('senha').notNullable();
});
```

- Atualize seu repositório para usar `usuarios` nas consultas:

```js
const [userRegistred] = await db.insert(newUser).into('usuarios').returning('*');
// ...
const user = await db.select('*').from('usuarios').where('usuarios.email', email);
```

- Remova `unique()` do campo `nome`, pois no enunciado só o `email` deve ser único. O nome pode se repetir.

---

### 3. Retorno do token JWT no login

**O que observei:**

No seu `authController.js`, no método `login`, você retorna o token assim:

```js
return res.status(200).json({access_token: token});
```

Porém, no enunciado, o campo esperado é `acess_token` (com "s" depois do "ac"):

```json
{
  "acess_token": "token aqui"
}
```

**Por que isso impacta:**

- Essa pequena diferença faz com que o cliente que consome a API não encontre o campo esperado.
- Pode causar falhas em testes ou em integrações que esperam o nome exato.

**Como corrigir:**

Ajuste para:

```js
return res.status(200).json({acess_token: token});
```

---

### 4. Validação do payload no registro de usuário para campos extras e faltantes

**O que observei:**

No seu `buildUser`, você está permitindo campos extras, pois não há checagem para impedir que o cliente envie propriedades que não são esperadas.

Além disso, não há validação explícita para garantir que `nome`, `email` e `senha` estejam presentes (obrigatórios).

**Por que isso impacta:**

- O enunciado pede para validar que não haja campos extras e que todos os obrigatórios estejam presentes.
- Isso evita dados inconsistentes e garante a integridade da criação do usuário.

**Como corrigir:**

Você pode fazer algo como:

```js
const allowed = ['nome', 'email', 'senha'];
const payload = {};

// Verifica se há campos extras
const keys = Object.keys(data);
for (const key of keys) {
  if (!allowed.includes(key)) {
    return { valid: false, message: `Campo extra não permitido: ${key}` };
  }
}

// Verifica se campos obrigatórios existem e são válidos
for (const field of allowed) {
  if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
    return { valid: false, message: `Campo obrigatório ausente ou inválido: ${field}` };
  }
  payload[field] = data[field].trim();
}
```

---

### 5. Erro na função `registerUser` do `usuariosRepository.js`

**O que observei:**

No seu repositório de usuários, a função `registerUser` está tentando inserir na tabela `users` (como já falamos), e também está usando o retorno do `insert` com `.returning('*')` que é correto.

No entanto, o padrão dos status retornados está inconsistente. Por exemplo, no `findUserByEmail`, você retorna status 201 (Created) mesmo para uma busca:

```js
return {
    status: 201,
    data: {
        ...user[0]
    },
    msg: "Usuário encontrado com sucesso"
}
```

O correto seria status 200 para buscas.

**Por que isso impacta:**

- Embora não seja um erro grave, usar status 201 para buscas pode causar confusão e não está alinhado com as boas práticas HTTP.

**Como corrigir:**

Altere para status 200 em buscas:

```js
return {
    status: 200,
    data: {
        ...user[0]
    },
    msg: "Usuário encontrado com sucesso"
}
```

---

### 6. Falta do arquivo `INSTRUCTIONS.md`

**O que observei:**

Na estrutura enviada, não há o arquivo `INSTRUCTIONS.md`, que é obrigatório para documentar o processo de autenticação, registro, login e uso do token JWT.

**Por que isso impacta:**

- A documentação é parte fundamental para que outros desenvolvedores consigam usar sua API corretamente.
- Também é requisito obrigatório do desafio.

**Como corrigir:**

Crie o arquivo `INSTRUCTIONS.md` na raiz do projeto com informações claras:

- Como registrar um usuário (`POST /auth/register`)
- Como fazer login (`POST /auth/login`) e receber o token JWT
- Como enviar o token no header `Authorization: Bearer <token>` para acessar rotas protegidas
- Fluxo esperado de autenticação e logout

---

## 💡 Recomendações de Aprendizado

Para reforçar e corrigir esses pontos, recomendo fortemente que você assista a esses vídeos feitos pelos meus criadores, que explicam exatamente os conceitos que você precisa dominar para corrigir e aprimorar seu projeto:

- Sobre autenticação e segurança com JWT e bcrypt:  
  https://www.youtube.com/watch?v=Q4LQOfYwujk  
  *Esse vídeo, feito pelos meus criadores, fala muito bem sobre conceitos básicos e fundamentais da cibersegurança.*

- Para entender o uso prático do JWT:  
  https://www.youtube.com/watch?v=keS0JWOypIU

- Para aprofundar no uso de bcrypt e JWT juntos:  
  https://www.youtube.com/watch?v=L04Ln97AwoY

- Para entender melhor a organização do projeto com MVC:  
  https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s

- Para configuração do banco com Docker e Knex (caso precise revisar):  
  https://www.youtube.com/watch?v=uEABDBQV-Ek&t=1s

---

## 📝 Resumo dos Principais Pontos para Melhorar

- Corrigir a validação da senha no `buildUser` para usar `senha` e validar critérios mínimos de segurança (regex).
- Ajustar o nome da tabela de `users` para `usuarios` na migration e no repositório.
- Corrigir o retorno do token JWT para usar o campo `acess_token` conforme o enunciado.
- Garantir validação rigorosa no cadastro para campos obrigatórios e rejeitar campos extras.
- Ajustar status HTTP para buscas (usar 200 em vez de 201).
- Criar o arquivo `INSTRUCTIONS.md` com documentação clara do fluxo de autenticação e uso da API.
- Revisar e testar novamente após as correções para garantir que todos os requisitos estão atendidos.

---

Rodrigo, você está no caminho certo e com algumas pequenas correções, seu projeto ficará muito mais robusto e alinhado com as melhores práticas! Continue firme, pois segurança e autenticação são tópicos que exigem bastante atenção, mas são essenciais para APIs profissionais. 💪✨

Se precisar de ajuda para implementar as validações da senha ou qualquer ajuste, me chama que te ajudo! 😉

Um forte abraço e continue codando com paixão! 🚀🔥

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>