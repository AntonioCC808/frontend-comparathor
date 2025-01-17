import React from 'react';

function MainDashboard({ navigate }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Comparator</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <button onClick={() => navigate('/products')}>My Products</button>
        <button onClick={() => navigate('/comparisons')}>My Comparisons</button>
        <button onClick={() => navigate('/addProduct')}>Add New Product</button>
        <button onClick={() => navigate('/addComparison')}>Add New Comparison</button>
        <button onClick={() => navigate('/config')}>Configuration</button>
      </div>
    </div>
  );
}

export default MainDashboard;
