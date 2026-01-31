




const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB (must match backend)

const categories = [
  { value: 'suits', label: 'Suits' },
  { value: 'shirts', label: 'Shirts' },
  { value: 'trousers', label: 'Trousers' },
  { value: 'blazers', label: 'Blazers' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'occasion', label: 'Occasion' },
  { value: 'bridal', label: 'Bridal' },
];

const collections = [
  { value: 'ready-to-wear', label: 'Ready-to-Wear' },
  { value: 'lookbook', label: 'Lookbook' },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'];

export default function AdminProducts() {
  const { toast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    collection: 'ready-to-wear',
    fabric: '',
    sizes: [],
    featured: false,
    inStock: true,
    imageFiles: [],
    imagePreviews: [],
    existingImages: [],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products?limit=100');
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = size => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  /**
   * Client-side file size validation (prevents bad uploads)
   */
  const handleImageUpload = e => {
    const files = Array.from(e.target.files);

    const oversizedFile = files.find(file => file.size > MAX_FILE_SIZE);

    if (oversizedFile) {
      toast({
        variant: 'destructive',
        title: 'Image too large',
        description: `"${oversizedFile.name}" exceeds the 15MB size limit.`,
      });
      e.target.value = '';
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));

    e.target.value = '';
  };

  const handleRemoveNewImage = index => {
    setFormData(prev => {
      const newImageFiles = [...prev.imageFiles];
      const newImagePreviews = [...prev.imagePreviews];

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

  const handleRemoveExistingImage = index => {
    setFormData(prev => {
      const newExistingImages = [...prev.existingImages];
      newExistingImages.splice(index, 1);
      return {
        ...prev,
        existingImages: newExistingImages,
      };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('collection', formData.collection);
      data.append('fabric', formData.fabric || '');
      data.append('featured', String(formData.featured));
      data.append('inStock', String(formData.inStock));

      formData.sizes.forEach(size => data.append('sizes', size));
      formData.imageFiles.forEach(file => data.append('images', file));

      if (editingProduct) {
        data.append('existingImages', JSON.stringify(formData.existingImages));
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data);
      } else {
        await api.post('/products', data);
      }

      toast({
        title: 'Success',
        description: `Product ${editingProduct ? 'updated' : 'created'} successfully`,
      });

      setDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to save product',
        description:
          error.response?.data?.message || error.message || 'Something went wrong',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = product => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      collection: product.collection,
      fabric: product.fabric || '',
      sizes: product.sizes || [],
      featured: product.featured,
      inStock: product.inStock,
      imageFiles: [],
      imagePreviews: [],
      existingImages: product.images || [],
    });
    setDialogOpen(true);
  };

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      toast({ title: 'Product deleted successfully' });
      fetchProducts();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: 'Failed to delete product',
      });
    }
  };

  const resetForm = () => {
    formData.imagePreviews.forEach(url => URL.revokeObjectURL(url));

    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      collection: 'ready-to-wear',
      fabric: '',
      sizes: [],
      featured: false,
      inStock: true,
      imageFiles: [],
      imagePreviews: [],
      existingImages: [],
    });
  };

  /* JSX BELOW IS 100% UNCHANGED */
  return (
    <Card>
      <CardContent className="pt-6">
        {/* UI unchanged */}
        {/* ...your existing JSX continues exactly as-is... */}
      </CardContent>
    </Card>
  );
}
