import express from "express";
import upload from "../middleware/upload.js";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

/**
 * Multer upload wrapper with proper error handling
 * - Prevents LIMIT_FILE_SIZE crashes
 * - Blocks controller execution on upload failure
 */
const uploadImages = (req, res, next) => {
  upload.array("images", 30)(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "One or more images exceed the allowed size",
        });
      }

      return res.status(400).json({
        message: err.message || "Image upload failed",
      });
    }

    next();
  });
};

// Public routes
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProduct);

// Admin routes
router.post(
  "/",
  protect,
  authorize("admin"),
  uploadImages,
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadImages,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProduct
);

export default router;
