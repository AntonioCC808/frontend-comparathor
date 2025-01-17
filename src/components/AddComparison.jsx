import React from 'react';

function AddComparison() {
  return (
    <div>
      <h2>Add New Comparison</h2>
      <form>
        <label>
          Comparison Name:
          <input type="text" placeholder="Enter comparison name" />
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
        <button type="submit">Create Comparison</button>
      </form>
    </div>
  );
}

export default AddComparison;
