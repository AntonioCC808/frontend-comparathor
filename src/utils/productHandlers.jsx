import { fetchProducts, deleteProduct, updateProduct, addProduct, fetchProductTypes } from "../api/products";

// Load products
export const loadProducts = async (setProducts) => {
  try {
    const productsData = await fetchProducts();
    setProducts(productsData);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Handle editing product
export const handleEditProduct = (product, setSelectedProduct, setIsEditing, setIsModalOpen) => {
  setSelectedProduct({ ...product });
  setIsEditing(true);
  setIsModalOpen(true);
};

// Handle adding a new product
export const handleAddProduct = async (setSelectedProduct, setIsEditing, setIsModalOpen, setProductTypes) => {
    setIsEditing(false); // Set to adding mode
    setIsModalOpen(true); // Open modal first to avoid blocking UI updates
  
    try {
      const types = await fetchProductTypes(); // Fetch product types from API
  
      if (!Array.isArray(types) || types.length === 0) {
        console.error("No product types available.");
        return;
      }
  
      setProductTypes(types); // Store product types in state
  
      const defaultType = types[0]; // Default to first product type
      const metadataSchema = Array.isArray(defaultType.metadata_schema) ? defaultType.metadata_schema : [];
  
      setSelectedProduct({
        name: "",
        brand: "",
        score: "",
        image_url: "",
        product_type:  "Select...",
        product_metadata: metadataSchema.map(attr => ({
          attribute: attr.name,
          type: attr.type,
          value: "",
        })),
      });
  
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };
  
  

// Handle viewing product details
export const handleViewProduct = (product, setSelectedProduct, setIsInfoModalOpen) => {
  setSelectedProduct(product);
  setIsInfoModalOpen(true);
};

// Close all modals
export const handleCloseModals = (setSelectedProduct, setIsModalOpen) => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };
  

// Confirm delete
export const handleDeleteConfirmation = (product, setProductToDelete, setIsConfirmOpen) => {
  setProductToDelete(product);
  setIsConfirmOpen(true);
};

// Handle delete product
export const handleDeleteConfirmed = async (productToDelete, products, setProducts, setIsConfirmOpen, setProductToDelete) => {
  if (!productToDelete) return;
  try {
    await deleteProduct(productToDelete.id);
    setProducts(products.filter((p) => p.id !== productToDelete.id));
  } catch (error) {
    console.error("Error deleting product:", error);
  }
  setIsConfirmOpen(false);
  setProductToDelete(null);
};

// Save product (Add or Edit)
export const handleSaveChanges = async (selectedProduct, products, setProducts, isEditing, handleCloseModals) => {
  try {
    if (!selectedProduct.name || !selectedProduct.brand) {
      console.error("Name and Brand are required.");
      return;
    }

    const productPayload = {
      ...selectedProduct,
      product_metadata: selectedProduct.product_metadata.map((meta) => ({
        id: meta.id || null, // Ensure new attributes are handled
        attribute: meta.attribute,
        value: meta.value,
        score: meta.score,
      })),
    };

    if (isEditing) {
      const updatedData = await updateProduct(selectedProduct.id, productPayload);
      setProducts(products.map((p) => (p.id === updatedData.id ? updatedData : p)));
    } else {
      const newProduct = await addProduct(productPayload);
      setProducts([...products, newProduct]);
    }

    handleCloseModals();
  } catch (error) {
    console.error("Error saving product:", error);
  }
};

// Handle attribute change
export const handleAttributeChange = (index, field, value, setSelectedProduct) => {
  setSelectedProduct((prevProduct) => {
    const updatedAttributes = [...prevProduct.product_metadata];
    updatedAttributes[index] = { ...updatedAttributes[index], [field]: value };
    return { ...prevProduct, product_metadata: updatedAttributes };
  });
};

// Add new attribute
export const handleAddAttribute = (setSelectedProduct) => {
  setSelectedProduct((prevProduct) => ({
    ...prevProduct,
    product_metadata: [...prevProduct.product_metadata, { attribute: "", value: "", score: "" }],
  }));
};

// Remove attribute
export const handleRemoveAttribute = (index, setSelectedProduct) => {
  setSelectedProduct((prevProduct) => ({
    ...prevProduct,
    product_metadata: prevProduct.product_metadata.filter((_, i) => i !== index),
  }));
};


export const handleProductTypeChange = (event, productTypes, setSelectedProduct, setSelectedProductType) => {
    const selectedType = productTypes.find(pt => pt.id === parseInt(event.target.value, 10));
    setSelectedProductType(selectedType);
  
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      product_type: selectedType.name,
      product_metadata: selectedType.metadata_schema.map(attr => ({
        attribute: attr.name,
        value: "", // User will input this
        type: attr.type, // Helps with validation
      })),
    }));
  };