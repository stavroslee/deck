import { Database } from './database';

interface Subscription {
  customerId: string;
  subscriptionId: string;
  status: string;
}

class MemoryDatabase implements Database {
  private subscriptions: Subscription[] = [];

  async saveSubscription(customerId: string, subscriptionId: string, status: string): Promise<void> {
    this.subscriptions.push({ customerId, subscriptionId, status });
    console.log(`Saved subscription: ${subscriptionId} for customer: ${customerId} with status: ${status}`);
  }

  async updateSubscription(subscriptionId: string, status: string): Promise<void> {
    const subscription = this.subscriptions.find(sub => sub.subscriptionId === subscriptionId);
    if (subscription) {
      subscription.status = status;
      console.log(`Updated subscription: ${subscriptionId} to status: ${status}`);
    }
  }

  async deleteSubscription(subscriptionId: string): Promise<void> {
    this.subscriptions = this.subscriptions.filter(sub => sub.subscriptionId !== subscriptionId);
    console.log(`Deleted subscription: ${subscriptionId}`);
  }
}

export default MemoryDatabase;
