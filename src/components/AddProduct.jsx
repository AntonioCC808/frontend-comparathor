import React from 'react';

function AddProduct() {
  return (
    <div>
      <h2>Add New Product</h2>
      <form>
        <label>
          Product Name:
          <input type="text" placeholder="Enter product name" />
        </label>
        <br />
        <label>
          Product Type:
          <select>
            <option>TV</option>
            <option>Laptop</option>
            <option>Smartphone</option>
          </select>
        </label>
        <br />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
