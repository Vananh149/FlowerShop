import Member from '../models/Member.js';

export const getTeam = async (req, res) => {
    try {
        const team = await Member.find();
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách nhân viên", error: error.message });
    }
};
