// create-admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const Users = require('./model/user.model');

// Tạo salt cho bcrypt
const salt = bcrypt.genSaltSync(10);

// Thông tin người dùng cần tạo
const adminData = {
  displayName: "Admin User",
  username: "admin",
  password: "admin123", // Sẽ được hash
  email: "admin@example.com",
  phonenumber: "0123456789",
  role: "U" // Admin
};

// Kết nối đến MongoDB
mongoose.connect("mongodb+srv://hieuls1232003:ySHDEDhnEuS6ZgpI@cluster0.9gsag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    dbName: "nckh",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(async () => {
  console.log('Đã kết nối đến MongoDB');
  
  try {
    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await Users.findOne({
      $or: [
        { username: adminData.username },
        { email: adminData.email }
      ]
    });
    
    if (existingUser) {
      console.log('Người dùng đã tồn tại với username hoặc email này!');
      mongoose.disconnect();
      return;
    }
    
    // Hash mật khẩu
    const hashPassword = bcrypt.hashSync(adminData.password, salt);
    
    // Tạo user mới
    const newUser = new Users({
      userId: uuid(),
      displayName: adminData.displayName,
      username: adminData.username,
      password: hashPassword,
      email: adminData.email,
      phonenumber: adminData.phonenumber,
      role: adminData.role
    });
    
    // Lưu vào database
    await newUser.save();
    console.log('Tạo người dùng thành công:');
    console.log({
      userId: newUser.userId,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    });
  } catch (error) {
    console.error('Lỗi khi tạo người dùng:', error);
  } finally {
    mongoose.disconnect();
    console.log('Đã ngắt kết nối MongoDB');
  }
})
.catch(err => {
  console.error('Lỗi kết nối MongoDB:', err);
});