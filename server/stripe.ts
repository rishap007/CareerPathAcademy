import Stripe from 'stripe';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('⚠️  Stripe not configured - payment features will be disabled');
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

export interface CheckoutSessionData {
  courseId: number;
  courseTitle: string;
  priceInCents: number;
  userId: string;
  userEmail: string;
}

/**
 * Create a Stripe checkout session for course purchase
 */
export async function createCheckoutSession(data: CheckoutSessionData): Promise<string | null> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const { courseId, courseTitle, priceInCents, userId, userEmail } = data;
  const appUrl = process.env.APP_URL || 'http://localhost:5000';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: courseTitle,
              description: `Lifetime access to ${courseTitle}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/courses/${courseId}?payment=success`,
      cancel_url: `${appUrl}/courses/${courseId}?payment=cancelled`,
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        courseId: courseId.toString(),
        userId: userId,
      },
    });

    return session.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
}

/**
 * Verify Stripe webhook signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event | null {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('Stripe webhook secret is not configured');
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}

/**
 * Retrieve a payment intent
 */
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent | null> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return null;
  }
}

/**
 * Check if Stripe is configured and ready
 */
export function isStripeConfigured(): boolean {
  return stripe !== null;
}
