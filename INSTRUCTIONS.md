# Instruções de Execução e Consumo da API do Departamento de Polícia

## 1. Pré-requisitos

- Node.js (v16+)
- PostgreSQL
- Docker (opcional, recomendado para ambiente isolado)

## 2. Configuração do Ambiente

1. **Clone o repositório:**
   ```sh
   git clone <url-do-repositorio>
   cd <nome-da-pasta>
   ```

2. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
   ```
   POSTGRES_USER=seu_usuario
   POSTGRES_PASSWORD=sua_senha
   POSTGRES_DB=policia_db
   JWT_SECRET=sua_chave_secreta
   PORT_SERVER=3000
   ```

3. **(Opcional) Suba o banco de dados com Docker:**
   ```sh
   docker-compose up -d
   ```

4. **Instale as dependências:**
   ```sh
   npm install
   ```

5. **Execute as migrations e seeds:**
   ```sh
   npm run db:reset
   ```

## 3. Executando o Servidor

- Para rodar em modo desenvolvimento:
  ```sh
  npm run dev
  ```
- Para rodar em modo produção:
  ```sh
  npm start
  ```

O servidor estará disponível em: [http://localhost:3000](http://localhost:3000)

## 4. Documentação das Rotas

Acesse a documentação Swagger em: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 5. Autenticação

### Registro de Usuário

- **Endpoint:** `POST /auth/register`
- **Body:**
  ```json
  {
    "nome": "Seu Nome",
    "email": "seu@email.com",
    "senha": "SenhaForte@123"
  }
  ```
- **Regras da senha:** mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.

### Login

- **Endpoint:** `POST /auth/login`
- **Body:**
  ```json
  {
    "email": "seu@email.com",
    "senha": "SenhaForte@123"
  }
  ```
- **Resposta:**
  ```json
  {
    "access_token": "seu_token_jwt"
  }
  ```

### Exemplo de envio do token JWT

Inclua o token JWT no header das requisições protegidas:
```
Authorization: Bearer seu_token_jwt
```

---

## 6. Rotas Protegidas

As rotas de `/agentes` e `/casos` exigem autenticação JWT. Sempre envie o header `Authorization` com o token.

### Exemplo de requisição protegida

```sh
curl -H "Authorization: Bearer seu_token_jwt" http://localhost:3000/agentes
```

---

## 7. Fluxo de Autenticação

1. **Registrar usuário** (`/auth/register`)
2. **Fazer login** (`/auth/login`) e receber o token JWT
3. **Consumir rotas protegidas** enviando o token no header `Authorization`
4. **Consultar usuário autenticado:** `GET /usuarios/me` (necessário enviar o token)

---

## 8. Outras Rotas

- **Excluir usuário:** `DELETE /users/:id`

---

Para mais detalhes, consulte