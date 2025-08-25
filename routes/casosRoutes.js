const express = require('express')
const router = express.Router();
const casosController = require('../controllers/casosController');
const authMiddleware = require('../middlewares/authMiddleware')

/**
 * @swagger
 * tags:
 *   name: Casos
 *   description: Endpoints relacionados aos casos policiais
 */

/**
 * @swagger
 * /casos:
 *   get:
 *     summary: Lista todos os casos registrados, com opção de filtros
 *     tags: [Casos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [aberto, solucionado]
 *         required: false
 *         description: Filtra os casos pelo status
 *       - in: query
 *         name: agente_id
 *         schema:
 *           type: string
 *           format: id
 *         required: false
 *         description: Filtra os casos por agente responsável
 *     responses:
 *       200:
 *         description: Lista de casos retornada com sucesso
 *       400:
 *         description: Parâmetros inválidos
 */

/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Retorna os detalhes de um caso específico
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: id
 *         description: ID do caso
 *     responses:
 *       200:
 *         description: Caso encontrado com sucesso
 *       404:
 *         description: Caso não encontrado
 */

/**
 * @swagger
 * /casos:
 *   post:
 *     summary: Cria um novo caso policial
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - status
 *               - agente_id
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: string
 *                 format: id
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /casos/{id}:
 *   put:
 *     summary: Atualiza todos os dados de um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - status
 *               - agente_id
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: string
 *     responses:
 *       204:
 *         description: Caso atualizado com sucesso
 *       404:
 *         description: Caso não encontrado
 */

/**
 * @swagger
 * /casos/{id}:
 *   patch:
 *     summary: Atualiza parcialmente os dados de um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: string
 *     responses:
 *       204:
 *         description: Campos atualizados com sucesso
 *       404:
 *         description: Caso não encontrado
 */

/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Remove um caso do sistema
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Caso deletado com sucesso
 *       404:
 *         description: Caso não encontrado
 */

router.get('/casos', authMiddleware, casosController.getAllCasos);
router.get('/casos/:id', authMiddleware, casosController.getCaseByID);
router.post('/casos', authMiddleware, casosController.insertCase);
router.put('/casos/:id', authMiddleware, casosController.updateCaseById);
router.patch('/casos/:id', authMiddleware, casosController.patchCaseByID);
router.delete('/casos/:id', authMiddleware, casosController.deleteCaseById);

module.exports = router