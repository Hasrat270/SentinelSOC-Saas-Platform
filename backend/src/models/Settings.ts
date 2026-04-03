import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  tenantId: mongoose.Types.ObjectId;
  alertThresholds: {
    maxThreatsPerHour: number;
    emailAlertsEnabled: boolean;
    notifyOnHighSeverity: boolean;
  };
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      unique: true, // One settings document per tenant
      index: true,
    },
    alertThresholds: {
      maxThreatsPerHour: {
        type: Number,
        default: 100,
      },
      emailAlertsEnabled: {
        type: Boolean,
        default: true,
      },
      notifyOnHighSeverity: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);
