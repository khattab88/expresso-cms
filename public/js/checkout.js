import axios from 'axios';

const stripe = Stripe("pk_test_51I9SWFI34OVmnrKNVEI8d6zi34ozzYfUpLN3zk5RJ8aBFVYLIlzbiY3TXcs3UJD1gLGvsyMIWwG02jgzmJG6x8He00HSH0alT1");

export const checkout = async orderId => {
    try {
        // 1) get checkout session from checkout endpoint
        const session = await axios(`http://127.0.0.1:3000/api/v1/orders/checkout-session/${orderId}`);
        // console.log(session);

        // 2) create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });

    } catch (err) {
        console.error(err);
    }
};