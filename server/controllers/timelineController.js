import Timeline from '../models/Timeline.js';

export const getTimeline = async (req, res) => {
    try {
        const timeline = await Timeline.find();
        res.status(200).json(timeline);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy lịch sử tiệm hoa", error: error.message });
    }
};
