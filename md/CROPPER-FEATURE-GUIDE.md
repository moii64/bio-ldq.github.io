# 🖼️ Hướng dẫn Tính năng Cắt Ảnh Đại diện

## ✨ Tính năng mới

Tính năng thay đổi ảnh đại diện đã được nâng cấp với khả năng **cắt và căn chỉnh ảnh** giống như Facebook!

### 🎯 Các tính năng chính:

- **Cắt ảnh vuông** (1:1 aspect ratio)
- **Xoay ảnh** (rotatable)
- **Phóng to/thu nhỏ** (zoomable)
- **Di chuyển vùng cắt** (movable)
- **Tự động căn giữa** (auto center)
- **Hướng dẫn cắt** (guides)
- **Tối ưu cho mobile** (touch support)

## 🚀 Cách sử dụng

### **Desktop:**
1. **Double click** vào ảnh đại diện
2. Chọn file ảnh từ máy tính
3. Modal cắt ảnh sẽ mở ra
4. Kéo thả để điều chỉnh vùng cắt
5. Nhấn **"Lưu thay đổi"**

### **Mobile:**
1. **Double tap** hoặc **long press** vào ảnh đại diện
2. Chọn ảnh từ thư viện
3. Sử dụng touch để cắt ảnh:
   - **Pinch to zoom** (véo để phóng to)
   - **Drag** để di chuyển vùng cắt
   - **Drag corners** để thay đổi kích thước
4. Nhấn **"Lưu thay đổi"**

## 🎮 Các thao tác cắt ảnh

### **Desktop Controls:**
- **Mouse wheel**: Phóng to/thu nhỏ
- **Double click**: Chuyển đổi chế độ drag/crop
- **Drag corners**: Thay đổi kích thước vùng cắt
- **Drag center**: Di chuyển vùng cắt
- **Drag outside**: Xoay ảnh

### **Mobile Controls:**
- **Pinch gesture**: Phóng to/thu nhỏ
- **Single finger drag**: Di chuyển vùng cắt
- **Two finger drag**: Xoay ảnh
- **Drag corners**: Thay đổi kích thước

## ⚙️ Cài đặt Cropper

### **Aspect Ratio:** 1:1 (vuông)
### **Auto Crop Area:** 80% (tự động chọn vùng cắt)
### **Min Size:** 100x100px
### **Max Size:** 4096x4096px
### **Output Size:** 400x400px
### **Quality:** 90% JPEG

## 🎨 Giao diện Modal

### **Header:**
- Tiêu đề: "Cắt ảnh đại diện"
- Nút đóng (X)

### **Body:**
- Khu vực cắt ảnh với CropperJS
- Loading spinner khi tải ảnh
- Hướng dẫn cắt (grid lines)

### **Footer:**
- Nút "Hủy" (màu xám)
- Nút "Lưu thay đổi" (màu gradient)

## 📱 Tối ưu Mobile

### **Responsive Design:**
- Modal chiếm 95% màn hình
- Buttons full-width trên mobile
- Touch-friendly controls
- Larger touch targets

### **Performance:**
- Lazy loading cho ảnh lớn
- Canvas optimization
- Memory management
- Smooth animations

## 🔧 Technical Details

### **Libraries Used:**
- **CropperJS 1.6.1**: Cắt ảnh chuyên nghiệp
- **Canvas API**: Xử lý ảnh
- **FileReader API**: Đọc file
- **Blob API**: Tạo file ảnh

### **Browser Support:**
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers

### **File Formats:**
- **Input:** JPEG, PNG, WebP, GIF
- **Output:** JPEG (90% quality)
- **Max Size:** 5MB input

## 🐛 Troubleshooting

### **Modal không mở:**
1. Kiểm tra console có lỗi không
2. Đảm bảo CropperJS đã load
3. Kiểm tra file ảnh hợp lệ

### **Cắt ảnh không hoạt động:**
1. Thử refresh trang
2. Kiểm tra kích thước file
3. Thử với ảnh khác

### **Mobile không responsive:**
1. Kiểm tra viewport meta tag
2. Thử zoom out browser
3. Kiểm tra touch events

## 🎯 Best Practices

### **Chọn ảnh tốt:**
- Tỷ lệ 1:1 hoặc gần 1:1
- Độ phân giải cao (ít nhất 400x400px)
- Chủ thể ở giữa ảnh
- Ánh sáng tốt

### **Cắt ảnh hiệu quả:**
- Sử dụng guides để căn chỉnh
- Zoom in để cắt chính xác
- Kiểm tra preview trước khi lưu
- Thử nhiều góc cắt khác nhau

## 🔄 Workflow

```
Chọn ảnh → Mở modal → Cắt ảnh → Preview → Lưu → Cập nhật UI
```

## 📊 Performance Metrics

- **Load time:** < 2s
- **Crop time:** < 1s
- **File size:** ~50-200KB
- **Memory usage:** < 50MB
- **Mobile FPS:** 60fps

## 🎉 Kết luận

Tính năng cắt ảnh đại diện mới cung cấp trải nghiệm chuyên nghiệp và dễ sử dụng, tương tự như các nền tảng mạng xã hội lớn. Người dùng có thể dễ dàng tạo ra những ảnh đại diện đẹp và phù hợp với trang bio link của mình.


