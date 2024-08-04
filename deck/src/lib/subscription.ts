export interface Subscription {
  userId: string;
  stripeCustomerId: string;
  subscriptionId: string;
  status: string;
  balance: number;
}
