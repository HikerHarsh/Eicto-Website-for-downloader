import mongoose from 'mongoose';

const StatsSchema = new mongoose.Schema({
  totalDownloads: {
    type: Number,
    required: true,
    default: 1452890,
  }
});

// Since we only need one global document for stats, we will always fetch the first one.
export default mongoose.models.Stats || mongoose.model('Stats', StatsSchema);
