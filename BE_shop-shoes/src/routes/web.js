import express from "express";
import sizeController from "../controller/sizeController";
import supplierController from "../controller/supplierController";
import productController from "../controller/productController";
import notiController from "../controller/notiController";

const router = express.Router();

const initWebRoutes = (app) => {
  //Admin
  router.get("/product/dtadmin", productController.getDataManageAdmin);

  router.get("/size", sizeController.readSize);

  //product
  router.post("/product/create", productController.createProduct);
  router.put("/product/update", productController.updateProduct);
  router.get("/product/sale", productController.getProductSale);
  router.get("/product", productController.getAllProduct);
  router.get("/product/bestseller", productController.getProductBestSeller);
  router.get("/product/:id", productController.getOneProduct);
  router.delete("/product/:id", productController.deleteProduct);

  //supplier
  router.post("/supplier/create", supplierController.createSupplier);
  router.get("/supplier/read", supplierController.getSuppliers);
  router.delete("/supplier/delete", supplierController.deleteSupp);
  router.put("/supplier/update", supplierController.updateSupp);

  return app.use("/api/v1/", router);
};

export default initWebRoutes;
