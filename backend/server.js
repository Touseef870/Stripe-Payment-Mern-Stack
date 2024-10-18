const express = require('express');
const cors = require('cors');  // Import CORS
const stripe = require('stripe')('sk_test_51Q5CQjBSRlxFwzyWpwO9MYCbfPKEmJKJ9tGmyoDeHaSzB2KCUxtasfJdV1Qb311utzXiuccUMGhd91NR52KSMaAy00i4V12Ovz');

const app = express();

// Use the CORS middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow your frontend origin
    methods: ['GET', 'POST'],  // Allow only necessary methods
    credentials: true, // Enable credentials if required
}));

app.use(express.json());

// Create Payment Intent endpoint
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body; // Get the amount from the request body

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // amount in cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        const uniqueUrl = `StripePayment/${paymentIntent.id}`; // Example URL format

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
