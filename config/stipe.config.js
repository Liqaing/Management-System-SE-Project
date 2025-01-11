import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SKEY);

export default stripe;
