import { promises as fs } from 'fs';
import { Database } from './database';
import { Subscription } from './subscription';

const DATA_FILE = './data/subscriptions.json';

class MemoryDatabase implements Database {
  private subscriptions: Subscription[] = [];
  private userMap: Record<string, string> = {};
  private customerMap: Record<string, string> = {};
  private loadPromise: Promise<void>;

  constructor() {
    this.loadPromise = this.loadFromFile();
  }

  private async loadFromFile(): Promise<void> {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      const parsedData = JSON.parse(data);
      this.subscriptions = parsedData.subscriptions || [];
      this.userMap = parsedData.userMap || {};
      this.customerMap = parsedData.customerMap || {};
      console.log(`Loaded data from file: ${this.subscriptions.length} subscriptions, ${Object.keys(this.userMap).length} users, ${Object.keys(this.customerMap).length} customers`);
    } catch (error) {
      console.error('Error loading data from file:', error);
    }
  }

  private async saveToFile(): Promise<void> {
    const data = {
      subscriptions: this.subscriptions,
      userMap: this.userMap,
      customerMap: this.customerMap,
    };
    try {
      await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
      console.log('Saved data to file');
    } catch (error) {
      console.error('Error saving data to file:', error);
    }
  }

  async connectUserToCustomer(userId: string, customerId: string): Promise<void> {
    await this.loadPromise;
    this.userMap[userId] = customerId;
    this.customerMap[customerId] = userId;
    console.log(`Connected user: ${userId} to customer: ${customerId}`);
    await this.saveToFile();
  }

  async saveSubscription(stripeCustomerId: string, subscriptionId: string, status: string): Promise<void> {
    await this.loadPromise;
    const userId = this.customerMap[stripeCustomerId];
    const existing = this.subscriptions.find(sub => sub.subscriptionId === subscriptionId);
    if (existing) {
      if (existing.userId !== userId) {
        console.error(`Subscription exists but for a different user! ${existing.userId} !== ${userId}`);
      }
      await this.updateSubscription(subscriptionId, status);
      return;
    }
    this.subscriptions.push({ userId, stripeCustomerId, subscriptionId, status, balance: 0 });
    console.log(`Saved subscription: ${subscriptionId} for user: ${userId} customer: ${stripeCustomerId} with status: ${status}`);
    await this.saveToFile();
  }

  async updateSubscription(subscriptionId: string, status: string): Promise<void> {
    await this.loadPromise;
    const subscription = this.subscriptions.find(sub => sub.subscriptionId === subscriptionId);
    if (subscription) {
      subscription.status = status;
      console.log(`Updated subscription: ${subscriptionId} to status: ${status}`);
      await this.saveToFile();
    } else {
      console.error(`Subscription not found: ${subscriptionId}`);
    }
  }

  async deleteSubscription(subscriptionId: string): Promise<void> {
    await this.loadPromise;
    this.subscriptions = this.subscriptions.filter(sub => sub.subscriptionId !== subscriptionId);
    console.log(`Deleted subscription: ${subscriptionId}`);
    await this.saveToFile();
  }

  async getSubscriptionByUserId(userId: string): Promise<Subscription | undefined> {
    await this.loadPromise;
    console.log(`Searching subscriptions for user: ${userId}`);
    console.log(this.subscriptions);
    return this.subscriptions.find(sub => sub.userId === userId);
  }

  async getTokenBalanceByUserId(userId: string): Promise<number> {
    await this.loadPromise;
    const entry = this.subscriptions.find(sub => sub.userId === userId);
    return entry ? entry.balance : 0;
  }

  async deductTokenBalanceByUserId(userId: string, amountToDeduct:number): Promise<number>
  {
    if(amountToDeduct <= 0) {
      return 0;
    }
    await this.loadPromise;
    const entry = this.subscriptions.find(sub => sub.userId === userId);
    if (entry) {
      entry.balance -= amountToDeduct;
      console.log(`Deducted ${amountToDeduct} tokens from user: ${userId}`);
      await this.saveToFile();
      return entry.balance;
    }
    return 0;
  }
}

export default MemoryDatabase;
