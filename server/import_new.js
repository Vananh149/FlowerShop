import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

// Chú ý: Bạn cần sửa đường dẫn này tới file JS chứa hoa mới của bạn
import { products as dataToImport } from '../src/data/products.js'; 

dotenv.config();

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Đang kết nối để nhập khẩu dữ liệu...');

        // Thêm dữ liệu mới (không xóa dữ liệu cũ)
        await Product.insertMany(dataToImport);
        
        console.log('--- NHẬP KHẨU THÀNH CÔNG ---');
        console.log(`Đã thêm ${dataToImport.length} sản phẩm mới vào Database.`);
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Lỗi khi nhập khẩu:', error);
        process.exit(1);
    }
};

importData();
