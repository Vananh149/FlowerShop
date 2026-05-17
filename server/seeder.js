import mongoose from 'mongoose';
import dotenv from 'dotenv';

// 1. Import tất cả các khuôn mẫu (Models)
import Product from './models/Product.js';
import Review from './models/Review.js';
import Member from './models/Member.js';
import Timeline from './models/Timeline.js';

// 2. Import tất cả dữ liệu từ thư mục data
import { products } from '../src/data/temp_products.js';
import { reviews } from '../src/data/reviews.js';
import { team } from '../src/data/team.js';
import { timeline } from '../src/data/timeline.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB Atlas for a FULL SEEDING...');
        
        // --- BƯỚC 1: DỌN DẸP SẠCH SẼ ---
        await Product.deleteMany();
        await Review.deleteMany();
        await Member.deleteMany();
        await Timeline.deleteMany();
        console.log('--- 1. Đã dọn dẹp sạch kho dữ liệu cũ ---');

        // --- BƯỚC 2: NẠP DỮ LIỆU ---
        
        // Nạp Hoa
        await Product.insertMany(products.map(({id, ...rest}) => rest));
        console.log(`--- 2. Đã nạp ${products.length} sản phẩm hoa 🌸 ---`);

        // Nạp Đánh giá
        await Review.insertMany(reviews.map(({id, ...rest}) => rest));
        console.log(`--- 3. Đã nạp ${reviews.length} đánh giá ⭐ ---`);

        // Nạp Nhân sự
        await Member.insertMany(team.map(({id, ...rest}) => rest));
        console.log(`--- 4. Đã nạp ${team.length} nhân viên 👥 ---`);

        // Nạp Lịch sử
        await Timeline.insertMany(timeline.map(({id, ...rest}) => rest));
        console.log(`--- 5. Đã nạp ${timeline.length} mốc lịch sử ⏳ ---`);

        console.log('====================================');
        console.log('DỰ ÁN ĐÃ ĐƯỢC NẠP DỮ LIỆU ĐẦY ĐỦ! 🚀');
        console.log('====================================');
        
        process.exit();
    })
    .catch(err => {
        console.error('Lỗi khi nạp dữ liệu:', err);
        process.exit(1);
    });
