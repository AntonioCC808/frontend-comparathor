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
export const handleEditProduct = (product, setSelectedProduct, setIsEditing, setIsEditModalOpen) => {
  setSelectedProduct({ ...product });
  setIsEditing(true); // ✅ Ensure editing mode is enabled
  setIsEditModalOpen(true); // ✅ Opens ONLY the Edit Product modal
};


// Handle adding a new product
export const handleAddProduct = async (setSelectedProduct, setIsEditing, setIsModalOpen, setProductTypes) => {
  setIsEditing(false); // ✅ Ensure we're in "Add Product" mode
  setSelectedProduct({  // ✅ Reset product state BEFORE opening modal
    name: "",
    brand: "",
    score: "",
    image_base64: "",
    product_type: "",
    product_metadata: [],
  });

  try {
    const types = await fetchProductTypes();
    if (!Array.isArray(types) || types.length === 0) {
      console.error("No product types available.");
      return;
    }
    setProductTypes(types);

    const metadataSchema = Array.isArray(types[0]?.metadata_schema)
      ? types[0].metadata_schema
      : [];

    setSelectedProduct(prevProduct => ({
      ...prevProduct,
      product_metadata: metadataSchema.map(attr => ({
        attribute: attr.name,
        type: attr.type,
        value: "",
      })),
    }));

    setIsModalOpen(true); // ✅ Open modal AFTER resetting state

  } catch (error) {
    console.error("Error fetching product types:", error);
  }
};




// Handle form submission
export const handleSubmit = async (event, selectedProduct, setSelectedProduct, setErrorMessage, setSuccessMessage) => {
  event.preventDefault();

  if (!selectedProduct.name || !selectedProduct.product_type) {
    setErrorMessage("⚠️ Please fill out all required fields.");
    return;
  }

   // Get the full user object from localStorage
   const user = JSON.parse(localStorage.getItem("user"));


  try {
    const payload = {
      ...selectedProduct,
      user_id: user.user_id,
      product_metadata: selectedProduct.product_metadata.map(meta => ({
        attribute: meta.attribute,
        value: meta.value,
        score: parseFloat(selectedProduct.score) || 0,
      })),
    };

    console.log("📤 Sending Payload:", payload);
    await addProduct(payload);
    setSuccessMessage("✅ Product added successfully!");
    setErrorMessage("");

    setSelectedProduct({
      name: "",
      brand: "",
      score: "",
      image_base64: "",
      product_type: "",
      product_metadata: [],
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    setErrorMessage("❌ Failed to add product. Please try again.");
    setSuccessMessage("");
  }
};

// Handle Image Upload and Convert to Base64
export const handleImageUpload = (file, setSelectedProduct) => {
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedProduct(prevProduct => ({ ...prevProduct, image_base64: reader.result }));
    };
    reader.readAsDataURL(file);
  }
};

// Handle File Drop
export const handleDrop = (event, setSelectedProduct) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  handleImageUpload(file, setSelectedProduct);
};


// Handle viewing product details
export const handleViewProduct = (product, setSelectedProduct, setIsInfoModalOpen) => {
  setSelectedProduct(product);
  setIsInfoModalOpen(true);
};

// Handle modal close
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
  console.log("Product to delete:", productToDelete); // Debugging
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


export const handleUpdateChanges = async (selectedProduct, setSelectedProduct, setIsModalOpen, setProducts) => {
  try {
    const productPayload = {
      ...selectedProduct,
      product_metadata: selectedProduct.product_metadata?.map((meta) => ({
        attribute: meta.attribute,
        value: meta.value,
        score: meta.score,
      })) || [],
    };

    await updateProduct(productPayload); 
    const updatedData = await updateProduct(productPayload);  // ✅ API request to update product

    // ✅ Update products list in state immediately
    setProducts((prevProducts) => 
      prevProducts.map((p) => (p.id === updatedData.id ? updatedData : p))
    );
    setIsModalOpen(false);  // ✅ Close modal after updating
    setSelectedProduct(null);

  } catch (error) {
    console.error("Error updating product:", error);
  }
};


// Handle attribute changes
export const handleAttributeChange = (index, field, value, setSelectedProduct) => {
  setSelectedProduct(prevProduct => {
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


// Handle product type selection
export const handleTypeChange = (event, productTypes, setSelectedProduct, selectedProduct) => {
  const selectedType = productTypes.find(
    (type) => type.id === parseInt(event.target.value, 10)
  );

  if (!selectedType) return;

  const metadataSchema = Object.entries(selectedType.metadata_schema || {}).map(
    ([key, type]) => ({
      attribute: key,
      type: type,
      value: "",
    })
  );

  setSelectedProduct({
    ...selectedProduct,
    product_type: selectedType.id,
    product_metadata: metadataSchema,
  });
};

