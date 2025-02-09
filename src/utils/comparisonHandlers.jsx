import { fetchProductTypes } from "../api/products";
import { addComparison } from "../api/comparisons"; // Assuming you have an API call to add a comparison
import { fetchProducts } from "../api/products"; // Assuming API for fetching products by type

// Load product types
export const loadProductTypes = async (setProductTypes) => {
  try {
    const types = await fetchProductTypes();
    setProductTypes(types);
  } catch (error) {
    console.error("Error fetching product types:", error);
  }
};

// Load products based on selected type
export const loadProductsByType = async (productType, setProducts) => {
  try {
    const products = await fetchProducts();
    const filteredProducts = products.filter((p) => p.product_type === productType);
    setProducts(filteredProducts);
  } catch (error) {
    console.error("Error fetching products by type:", error);
  }
};

// Handle selecting a product type
export const handleTypeChange = async (event, setProductType, setProducts) => {
  const selectedType = event.target.value;
  setProductType(selectedType);
  await loadProductsByType(selectedType, setProducts);
};

// Handle selecting products for comparison
export const handleProductSelection = (productId, selectedProducts, setSelectedProducts) => {
  if (selectedProducts.includes(productId)) {
    setSelectedProducts(selectedProducts.filter((id) => id !== productId));
  } else {
    setSelectedProducts([...selectedProducts, productId]);
  }
};

// Handle form submission
export const handleSubmitComparison = async (
  comparisonName,
  productType,
  description,
  selectedProducts
) => {
  if (!comparisonName || !productType || !description || selectedProducts.length === 0) {
    alert("Please fill out all fields and select at least one product.");
    return;
  }

  try {
    const payload = {
      title: comparisonName,
      description,
      product_type: productType,
      id_user: 1, // Change this to the actual user ID
      date_created: new Date().toISOString(),
      products: selectedProducts.map((id) => ({ product_id: id })),
    };

    await addComparison(payload);
    alert("Comparison added successfully!");
  } catch (error) {
    console.error("Error adding comparison:", error);
    alert("Failed to add comparison.");
  }
};
