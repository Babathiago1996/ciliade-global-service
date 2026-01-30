"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit, Trash2, X } from "lucide-react";
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB (must match backend)

const categories = [
  { value: "suits", label: "Suits" },
  { value: "shirts", label: "Shirts" },
  { value: "trousers", label: "Trousers" },
  { value: "blazers", label: "Blazers" },
  { value: "accessories", label: "Accessories" },
  { value: "traditional", label: "Traditional" },
  { value: "corporate", label: "Corporate" },
  { value: "occasion", label: "Occasion" },
  { value: "bridal", label: "Bridal" },
];

const collections = [
  { value: "ready-to-wear", label: "Ready-to-Wear" },
  { value: "lookbook", label: "Lookbook" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "Custom"];

export default function AdminProducts() {
  const { toast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    collection: "ready-to-wear",
    fabric: "",
    sizes: [],
    featured: false,
    inStock: true,
    imageFiles: [], // Actual File objects
    imagePreviews: [], // URLs for preview
    existingImages: [], // Existing images when editing
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products?limit=100");
      setProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const oversizedFile = files.find((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFile) {
      toast({
        variant: "destructive",
        title: "Image too large",
        description: `"${oversizedFile.name}" exceeds the 30MB size limit.`,
      });
      e.target.value = "";
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));

    // Reset the input so the same file can be selected again
    e.target.value = "";
  };

  const handleRemoveNewImage = (index) => {
    setFormData((prev) => {
      const newImageFiles = [...prev.imageFiles];
      const newImagePreviews = [...prev.imagePreviews];

      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(newImagePreviews[index]);

      newImageFiles.splice(index, 1);
      newImagePreviews.splice(index, 1);

      return {
        ...prev,
        imageFiles: newImageFiles,
        imagePreviews: newImagePreviews,
      };
    });
  };

  const handleRemoveExistingImage = (index) => {
    setFormData((prev) => {
      const newExistingImages = [...prev.existingImages];
      newExistingImages.splice(index, 1);
      return {
        ...prev,
        existingImages: newExistingImages,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("collection", formData.collection);
      data.append("fabric", formData.fabric || "");
      data.append("featured", String(formData.featured));
      data.append("inStock", String(formData.inStock));

      // Append sizes
      formData.sizes.forEach((size) => {
        data.append("sizes", size);
      });

      // Append new image files
      formData.imageFiles.forEach((file) => {
        data.append("images", file);
      });

      // When editing, send existing images to preserve them
      if (editingProduct) {
        data.append("existingImages", JSON.stringify(formData.existingImages));
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/products", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save product",
        description:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      collection: product.collection,
      fabric: product.fabric || "",
      sizes: product.sizes || [],
      featured: product.featured,
      inStock: product.inStock,
      imageFiles: [],
      imagePreviews: [],
      existingImages: product.images || [],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      toast({ title: "Product deleted successfully" });
      fetchProducts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to delete product",
      });
    }
  };

  const resetForm = () => {
    // Revoke all preview URLs to prevent memory leaks
    formData.imagePreviews.forEach((url) => URL.revokeObjectURL(url));

    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      collection: "ready-to-wear",
      fabric: "",
      sizes: [],
      featured: false,
      inStock: true,
      imageFiles: [],
      imagePreviews: [],
      existingImages: [],
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Product Management</h2>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
                <DialogDescription>
                  Fill in the product details below
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    required
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₦) *</Label>
                    <Input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      required
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fabric">Fabric</Label>
                    <Input
                      id="fabric"
                      value={formData.fabric}
                      onChange={(e) => handleChange("fabric", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Collection *</Label>
                    <Select
                      value={formData.collection}
                      onValueChange={(value) =>
                        handleChange("collection", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {collections.map((col) => (
                          <SelectItem key={col.value} value={col.value}>
                            {col.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-4 py-2 border rounded ${
                          formData.sizes.includes(size)
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Product Images</Label>
                  <Input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />

                  {/* Existing Images (when editing) */}
                  {formData.existingImages.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Existing Images:
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {formData.existingImages.map((img, index) => (
                          <div
                            key={`existing-${index}`}
                            className="relative aspect-square group"
                          >
                            <Image
                              src={img.url}
                              alt={`Existing ${index + 1}`}
                              fill
                              className="object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Preview */}
                  {formData.imagePreviews.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        New Images to Upload:
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {formData.imagePreviews.map((preview, index) => (
                          <div
                            key={`new-${index}`}
                            className="relative aspect-square group"
                          >
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveNewImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        handleChange("featured", e.target.checked)
                      }
                    />
                    <span>Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) =>
                        handleChange("inStock", e.target.checked)
                      }
                    />
                    <span>In Stock</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting
                      ? "Saving..."
                      : editingProduct
                        ? "Update Product"
                        : "Add Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p className="text-center py-8 text-gray-600">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center py-8 text-gray-600">No products yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="relative aspect-[4/5] bg-gray-100">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 capitalize">
                    {product.category}
                  </p>
                  <p className="font-bold mb-3">{formatPrice(product.price)}</p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
