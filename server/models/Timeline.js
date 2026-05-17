import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Timeline = mongoose.model('Timeline', timelineSchema);
export default Timeline;
