import Product from '../models/Product.js';
import cloudinary, { uploadToCloudinary } from '../config/cloudinary.js';

export const createProduct = async (req, res, next) => {
  try {
    console.log('📦 Creating product...');
    console.log('📝 Request body:', req.body);
    console.log('📁 Files received:', req.files?.length || 0);

    const {
      name,
      description,
      price,
      category,
      collection,
      fabric,
      featured,
      inStock,
    } = req.body;

    let images = [];

    // Handle file uploads from multer
    if (req.files && req.files.length > 0) {
      console.log('📤 Uploading images to Cloudinary...');
      
      const uploadPromises = req.files.map(file => {
        console.log('   Uploading:', file.originalname);
        return uploadToCloudinary(file.buffer, 'ciliade-products');
      });

      const uploadResults = await Promise.all(uploadPromises);

      images = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));

      console.log('✅ All images uploaded successfully');
    }

    // Handle sizes array
    let sizes = [];
    if (req.body.sizes) {
      sizes = Array.isArray(req.body.sizes) ? req.body.sizes : [req.body.sizes];
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      collection,
      images,
      sizes,
      fabric: fabric || '',
      featured: featured === 'true',
      inStock: inStock === 'true',
      createdBy: req.user.id,
    });

    console.log('✅ Product created successfully:', product._id);

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('❌ Create product error:', error);
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { category, collection, search, page = 1, limit = 12 } = req.query;

    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (collection) {
      query.collection = collection;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    console.log('📝 Updating product:', req.params.id);
    
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const {
      name,
      description,
      price,
      category,
      collection,
      fabric,
      featured,
      inStock,
      existingImages,
    } = req.body;

    // Start with existing images if provided
    let images = existingImages ? JSON.parse(existingImages) : product.images;

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      console.log('📤 Uploading new images to Cloudinary...');
      
      const uploadPromises = req.files.map(file => {
        console.log('   Uploading:', file.originalname);
        return uploadToCloudinary(file.buffer, 'ciliade-products');
      });

      const uploadResults = await Promise.all(uploadPromises);

      const newImages = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));

      images = [...images, ...newImages];
      console.log('✅ New images uploaded successfully');
    }

    // Handle sizes array
    let sizes = product.sizes;
    if (req.body.sizes) {
      sizes = Array.isArray(req.body.sizes) ? req.body.sizes : [req.body.sizes];
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        collection,
        images,
        sizes,
        fabric: fabric || '',
        featured: featured === 'true',
        inStock: inStock === 'true',
      },
      { new: true, runValidators: true }
    );

    console.log('✅ Product updated successfully');

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('❌ Update product error:', error);
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true }).limit(6);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};