const { Router } = require("express");
const { isAuthenticated } = require("../../http/middlewares/authorization");
const categoryController = require("../../http/controller/admin/category.controller");
const { validateRequestBody, validateRequestParams } = require("../../http/validations/auth.schema");
const { getDeleteCategorySchema, createUpdateCategorySchema } = require("../../model/schemas/categories.schema");

const router = new Router();

router.post("/categories", isAuthenticated,validateRequestBody(createUpdateCategorySchema) , categoryController.createCategory);

router.get(
  "/categories",
  isAuthenticated,
  validateRequestParams(getDeleteCategorySchema),
  categoryController.getCategory
);

router.put("/categories", isAuthenticated, categoryController.updateCategory);

router.delete("/categories", isAuthenticated, categoryController.deleteCategory);

module.exports = {
    adminPanelRoutes: router,
};
