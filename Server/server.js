const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;

// Initialize Stripe
const stripe = new Stripe( process.env.API_KEY , {
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
  console.log(process.env.API_KEY)
});
