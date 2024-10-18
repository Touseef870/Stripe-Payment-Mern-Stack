const express = require('express');
const stripe = require('stripe')('sk_test_51Q5CQjBSRlxFwzyWpwO9MYCbfPKEmJKJ9tGmyoDeHaSzB2KCUxtasfJdV1Qb311utzXiuccUMGhd91NR52KSMaAy00i4V12Ovz');
const app = express();
const cors = require('cors');

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',  // Adjust this to your frontend's origin
}));
app.use(express.json());

const sessions = {}; // To store session details and track URL expiration
const SESSION_EXPIRATION_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

// Create payment session route
app.post('/create-payment-session', async (req, res) => {
    const { title, description, amount, image } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: { title, description, image },
        });

        const sessionId = paymentIntent.id;
        const uniqueUrl = `http://localhost:5173/payment/${sessionId}`; // Ensure this matches your frontend URL

        // Store session details with expiration timestamp
        sessions[sessionId] = {
            status: 'pending',
            productDetails: { title, description, amount, image },
            createdAt: Date.now(),
        };

        // Set a timeout to expire the session
        setTimeout(() => {
            delete sessions[sessionId]; // Remove the session after expiration
        }, SESSION_EXPIRATION_TIME);

        // Send the payment URL in the response
        res.json({ url: uniqueUrl });
    } catch (error) {
        console.error('Error creating payment session:', error.message); // Log error
        res.status(400).json({ error: error.message });
    }
});

// Route to retrieve payment details for the session
app.get('/get-payment-details/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    const session = sessions[sessionId]; // Retrieve session from stored data

    // Check if session exists and is not expired
    if (!session || Date.now() - session.createdAt > SESSION_EXPIRATION_TIME) {
        return res.status(404).json({ error: 'Session not found or expired' });
    }

    console.log('Session ID:', sessionId);
    console.log('Session Details:', session);
    // Create or retrieve the client secret for payment confirmation
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(sessionId);
        res.json({
            productDetails: session.productDetails,
            clientSecret: paymentIntent.client_secret, // Send clientSecret to the frontend
        });
    } catch (error) {
        console.error('Error retrieving payment intent:', error.message); // Log error
        return res.status(500).json({ error: error.message });
    }
});

// Handle payment success
// Handle payment success
app.post('/payment-success', (req, res) => {
    const { sessionId } = req.body;

    if (sessions[sessionId]) {
        // Mark session as completed and log status
        sessions[sessionId].status = 'completed';
        console.log(`Payment status for session ${sessionId}: ${sessions[sessionId].status}`);
        
        delete sessions[sessionId]; // Remove the session after payment
        res.json({ success: true });
    } else {
        return res.status(404).json({ error: 'Session not found or already completed' });
    }
});


// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
