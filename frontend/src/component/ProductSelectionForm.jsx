import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    title: 'Product 1',
    description: 'Description for Product 1',
    amount: 5000,
    image: 'https://images.unsplash.com/photo-1719937051176-9b98352a6cf4?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    title: 'Product 2',
    description: 'Description for Product 2',
    amount: 10000,
    image: 'https://images.unsplash.com/photo-1728878039239-6b2f85e3c361?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    title: 'Product 3',
    description: 'Description for Product 3',
    amount: 15000,
    image: 'https://images.unsplash.com/photo-1728755695652-7748e9c355a0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const ProductSelectionForm = () => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const navigate = useNavigate();

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value);
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
  };

  const handleProceed = async () => {
    if (selectedProduct) {
      // Call your backend to create a payment intent
      const response = await fetch('http://localhost:5000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedProduct.amount }), // Send the selected product's amount
      });

      if (!response.ok) {
        console.error('Failed to create payment intent.');
        return;
      }

      const paymentData = await response.json();

      // Navigate to the payment page, passing the selected product and payment information
      navigate('/payment', { state: { ...selectedProduct, clientSecret: paymentData.clientSecret } });
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Select a Product</h2>
      <div className="mb-4">
        <label htmlFor="product" className="block text-lg font-medium text-gray-700 mb-2">Choose a product:</label>
        <select id="product" className="w-full p-3 border border-gray-300 rounded-lg" onChange={handleProductChange}>
          <option value="">Select...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>{product.title}</option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm mb-6">
          <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full mb-4" />
          <h3 className="text-xl font-semibold">{selectedProduct.title}</h3>
          <p className="text-gray-700">{selectedProduct.description}</p>
          <p className="text-lg font-bold">Amount: ${selectedProduct.amount / 100}</p>
        </div>
      )}

      <button
        onClick={handleProceed}
        className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        disabled={!selectedProduct}
      >
        Process
      </button>
    </div>
  );
};

export default ProductSelectionForm;
