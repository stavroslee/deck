export interface Database {
  saveSubscription(customerId: string, subscriptionId: string, status: string): Promise<void>;
  updateSubscription(subscriptionId: string, status: string): Promise<void>;
  deleteSubscription(subscriptionId: string): Promise<void>;
}
