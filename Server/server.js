const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

// Initialize Stripe
const stripe = new Stripe('sk_test_51PJZWwG5nxL6dlBMu35hH7gSzFfaRdVZCkhGgjVucwsWusSxrPga9sCHYzUOTBr4GyP0PEviXrLrJV7I4hTFwjGF00ukDkVrm7', {
  apiVersion: '2022-11-15',
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Stripe Payment Intent Endpoint
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    res.status(400).send({
      error: e.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
