import mongoose, { Document, Schema } from 'mongoose';

export interface IThreatLog extends Document {
  tenantId: mongoose.Types.ObjectId;
  threatType: string;
  severity: 'Low' | 'Medium' | 'High';
  attackerIp: string;
  payload: string;
  timestamp: Date;
}

const ThreatLogSchema: Schema = new Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true, // Crucial for querying logs strictly by tenant
    },
    threatType: {
      type: String,
      required: true,
      // Examples: 'XSS', 'SQLi', 'Path Traversal', 'DDoS'
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    attackerIp: {
      type: String,
      required: true,
    },
    payload: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true, // Useful for time-series queries (e.g. logs from last 24h)
    },
  },
  {
    // Do not use timestamps to manage 'createdAt', we explicitly manage 'timestamp'
    // but you can enable timestamps if you also want generic doc metadata
    timestamps: false,
  }
);

// Compound index to quickly fetch recent threats for a specific tenant
ThreatLogSchema.index({ tenantId: 1, timestamp: -1 });

export default mongoose.model<IThreatLog>('ThreatLog', ThreatLogSchema);
