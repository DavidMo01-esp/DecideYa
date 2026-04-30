"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDecisionRouter = void 0;
const express_1 = require("express");
const createDecisionRouter = (controller) => {
    const router = (0, express_1.Router)();
    // GET /api/decisions - Listar todas las decisiones
    router.get('/', controller.getAll);
    // GET /api/decisions/:id - Obtener una decisión por ID
    router.get('/:id', controller.getById);
    // POST /api/decisions - Crear una nueva decisión
    router.post('/', controller.create);
    // PUT /api/decisions/:id - Actualizar una decisión
    router.put('/:id', controller.update);
    // DELETE /api/decisions/:id - Eliminar una decisión
    router.delete('/:id', controller.delete);
    return router;
};
exports.createDecisionRouter = createDecisionRouter;
