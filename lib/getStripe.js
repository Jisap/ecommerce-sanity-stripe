import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

const getStripe = () => { // Obtenemos una instancia de stripe para realizar los pagos
    if(!stripePromise)  {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
}

export default getStripe;