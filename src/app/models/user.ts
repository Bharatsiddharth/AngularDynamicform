export interface User {
  userType: 'Admin' | 'Guest' | 'Subscriber';
  name?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  visitReason?: string;
  visitDate?: Date;
  subscriptionType?: string;
}

export interface Permission {
  name: string;
  value: string;
  checked: boolean;
}

export interface Role {
  name: string;
  value: string;
}

export interface SubscriptionType {
  name: string;
  value: string;
}