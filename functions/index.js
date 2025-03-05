const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const stripe = require("stripe")("sk_test_51QDNGBJPq8Wa0huqm9MQTscuGRoqIdeSrc1AWl8Y0UZQpK2ZHeVa4dNax6JrQohXcvDqXwMEErwErppmBqqAewzL00IZRW5T2C");
const cors = require("cors")({ origin: true });

exports.createCheckoutSession = onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { amount, currency } = req.body; // Amount in cents

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: currency || "usd",
                            product_data: { name: "Your Product" },
                            unit_amount: amount,
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: "https://your-app.com/success",
                cancel_url: "https://your-app.com/cancel",
            });

            res.json({ sessionId: session.id });
        } catch (error) {
            logger.error("Error creating Stripe session", error);
            res.status(500).json({ error: error.message });
        }
    });
});
