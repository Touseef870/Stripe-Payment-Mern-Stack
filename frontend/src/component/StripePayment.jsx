import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';

// Stripe publishable key
const stripePromise = loadStripe('pk_test_51Q5CQjBSRlxFwzyWZZr67eMkwml3WUCZdRg4bcW5mtBx1NffoI3wDxNJ7QPAzEVUczP8ntAnMPmlDYeTyWEBpjl100xLHDUUps');

// PaymentForm Component
const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const location = useLocation();
    const { title, amount, image, description } = location.state || {}; // Get product details from location state
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [postalCode, setPostalCode] = useState(''); // State for ZIP code

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setMessage('Stripe has not loaded yet. Please try again.');
            return;
        }

        setLoading(true);

        const cardElement = elements.getElement(CardNumberElement);

        try {
            // Call backend to create a Payment Intent
            const response = await fetch('http://localhost:5000/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount }), // Send the selected product's amount
            });

            if (!response.ok) throw new Error('Failed to create payment intent.');

            const { clientSecret } = await response.json();

            // Confirm payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'Customer Name', // Replace with actual customer name
                        address: {
                            postal_code: postalCode, // Include postal code in billing details
                        },
                    },
                },
            });

            setLoading(false);

            if (result.error) {
                setMessage(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                setMessage('Payment successful!');
            }
        } catch (error) {
            setLoading(false);
            setMessage('An error occurred: ' + error.message);
        }
    };

    return (
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6 md:space-y-0 md:space-x-6">
            <div className="flex-1 p-4">
                {/* <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">Complete your payment for {title}</h3>
                <img src={image} alt={title} className="w-full h-40 object-cover rounded-lg mb-4" /> */}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="card-number-element" className="block text-lg font-medium text-gray-700 mb-2">Card Number:</label>
                        <div className="border border-gray-300 rounded-lg p-3 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                            <CardNumberElement
                                id="card-number-element"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#32325d',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                        invalid: {
                                            color: '#fa755a',
                                            iconColor: '#fa755a',
                                        },
                                    },
                                    showIcon: true, // Show card icons
                                }}
                                className="w-full bg-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-4">
                        <div className="flex-1">
                            <label htmlFor="card-expiry-element" className="block text-lg font-medium text-gray-700 mb-2">Expiration Date:</label>
                            <div className="border border-gray-300 rounded-lg p-3 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                                <CardExpiryElement
                                    id="card-expiry-element"
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#32325d',
                                                '::placeholder': {
                                                    color: '#aab7c4',
                                                },
                                            },
                                            invalid: {
                                                color: '#fa755a',
                                                iconColor: '#fa755a',
                                            },
                                            
                                        },
                                    }}
                                    className="w-full bg-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <label htmlFor="card-cvc-element" className="block text-lg font-medium text-gray-700 mb-2">CVC:</label>
                            <div className="border border-gray-300 rounded-lg p-3 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                                <CardCvcElement
                                    id="card-cvc-element"
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#32325d',
                                                '::placeholder': {
                                                    color: '#aab7c4',
                                                },
                                            },
                                            invalid: {
                                                color: '#fa755a',
                                                iconColor: '#fa755a',
                                            },
                                        },
                                    }}
                                    className="w-full bg-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="postal-code" className="block text-lg font-medium text-gray-700 mb-2">ZIP Code:</label>
                        <input
                            id="postal-code"
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!stripe || loading}
                        className={`w-full py-3 px-4 mt-5 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors 
                        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {loading ? 'Processing...' : 'Pay'}
                    </button>
                    {message && <div className="text-center text-red-500 mt-3">{message}</div>}
                </form>
            </div>

            <div className="flex-1 p-4 bg-gray-50 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Product Details</h4>
                <div className="space-y-2">
                    <p className="font-medium text-gray-700">Title: {title}</p>
                    <img src={image} alt={title} className="w-full h-52 object-cover rounded-md" />
                    <p className="text-gray-600">Description: {description}</p>
                    <p className="text-lg font-bold text-gray-900">Price: ${amount / 100}</p>
                </div>
            </div>
        </div>
    );
};

// Wrapper Component to load Stripe Elements
const StripePayment = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm />
        </Elements>
    );
};

export default StripePayment;
