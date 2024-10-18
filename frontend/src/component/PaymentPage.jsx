import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router-dom';

// Load Stripe
const stripePromise = loadStripe('pk_test_51Q5CQjBSRlxFwzyWZZr67eMkwml3WUCZdRg4bcW5mtBx1NffoI3wDxNJ7QPAzEVUczP8ntAnMPmlDYeTyWEBpjl100xLHDUUps');

const PaymentPage = () => {
    const { sessionId } = useParams();
    const [productDetails, setProductDetails] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true); // New loading state
    const [error, setError] = useState(null); // New error state
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    // Fetch product details and client secret
    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/get-payment-details/${sessionId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProductDetails(data.productDetails);
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error('Error fetching payment details:', error);
                setError('Failed to load payment details. Please try again later.'); // Set error message
            } finally {
                setLoading(false); // Set loading to false regardless of the outcome
            }
        };

        fetchPaymentDetails();
    }, [sessionId]);

    console.log(productDetails)
    // Handle Stripe Payment submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            console.error('Payment error:', error.message);
            setError('Payment failed. Invalid Card Detail.'); // Set payment error message
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            alert('Payment successful!');
            navigate('/success'); // Redirect to a success page after payment
        }
    };

    if (loading) return <p>Loading payment details...</p>; // Show loading state

    return (
        <div className="h-full">
            {productDetails ? (
                <>
                    <h1 className='text-5xl font-bold my-5 mb-10 underline italic text-center' >Payment Form</h1>

                    <div className='flex w-1/2 mx-auto gap-5 shadow-lg border rounded-xl p-10'>
                        <div className='w-1/2' >
                            <h2 className="text-3xl font-bold mb-3">Product: {productDetails.title}</h2>
                            <p className="text-gray-700 mb-2"><span className='font-bold text-md' >Description:</span> {productDetails.description}</p>
                            <p className="text-xl font-bold mb-4 underline">Price: ${productDetails.amount / 100}</p>
                            <img className="w-72 h-72 rounded-lg mb-4 cover" src={productDetails.image} alt={productDetails.name} />

                        </div>
                        <div className='w-1/2'  >

                            {/* Stripe Card Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="border p-4 rounded-md shadow-inner">
                                    <CardElement className="w-full" />
                                </div>
                                {error && <p className="text-red-600 text-center py-2 bg-red-200 rounded-3xl">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={!stripe || loading}
                                    className={`w-full py-2 px-4 font-semibold text-white rounded-md transition-colors duration-300 
                      ${!stripe || loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    Pay Now
                                </button>
                            </form>
                        </div>



                    </div>
                    <div className='mt-10' >

                        <h1 className='text-5xl font-bold text-center' >VEHWARE</h1>
                        <hr className='my-4 mx-10 bg-black' />
                        <h1 className='text-xs text-center' >©2024. All Right Reserved </h1>

                    </div>
                </>
            ) : (
                <p className="text-gray-500">No product details available.</p>
            )}
        </div>

    );
};

export default PaymentPage;