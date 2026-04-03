import mongoose, { Document, Schema } from 'mongoose';

export interface ITenantKey {
  key: string;
  name: string;
  createdAt: Date;
}

export interface ITenant extends Document {
  clerkUserId: string;
  apiKeys: ITenantKey[];
  subscriptionPlan: 'FREE' | 'PRO';
  logCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema: Schema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    apiKeys: [
      {
        key: { type: String, required: true, unique: true, index: true },
        name: { type: String, default: 'Default Key' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    subscriptionPlan: {
      type: String,
      enum: ['FREE', 'PRO'],
      default: 'FREE',
    },
    logCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITenant>('Tenant', TenantSchema);
