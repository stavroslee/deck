import { Subscription } from "./subscription";

export interface Database {
  connectUserToCustomer(userId:string, customerId:string) : Promise<void>;
  saveSubscription(stripeCustomerId:string, subscriptionId: string, status: string): Promise<void>
  updateSubscription(subscriptionId: string, status: string): Promise<void>;
  deleteSubscription(subscriptionId: string): Promise<void>;

  getSubscriptionByUserId(userId: string): Promise<Subscription | undefined>;
  getTokenBalanceByUserId(userId: string): Promise<number>;
  deductTokenBalanceByUserId(userId: string, amountToDeduct:number): Promise<number>;  
}
