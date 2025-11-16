# Bio Link React App - TypeScript

Dự án Bio Link được xây dựng bằng React và TypeScript với các trang hiện đại và đẹp mắt.

## Cài đặt

1. Cài đặt dependencies:
```bash
cd react-app
npm install
```

## Chạy dự án

```bash
npm start
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

## Build cho production

```bash
npm run build
```

## Cấu trúc dự án

```
react-app/
├── src/
│   ├── components/       # Các component chung
│   ├── pages/           # Các trang chính
│   │   ├── SpecialLinkPage.tsx
│   │   ├── WebsitePage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── CVPage.tsx
│   │   ├── PaymentPage.js
│   │   └── TasksPage.js
│   ├── App.tsx          # Component chính với routing
│   └── index.tsx        # Entry point
├── public/
└── package.json
```

## Các trang đã tạo

1. **SpecialLinkPage** (`/special-link`) - Trang liên kết đặc biệt với animated background
2. **WebsitePage** (`/website`) - Trang website chính
3. **ContactPage** (`/contact`) - Trang liên hệ với form gửi email
4. **CVPage** (`/cv`) - Trang CV/Resume với tải xuống và preview

## Tính năng

- ✅ TypeScript support
- ✅ React Router cho navigation
- ✅ Animated background với network lines và glowing particles
- ✅ Responsive design
- ✅ Dark theme với glassmorphism effects
- ✅ Form validation
- ✅ LocalStorage integration

## Dependencies chính

- React 18.2.0
- React Router DOM 6.20.0
- TypeScript 5.2.2
- Font Awesome 6.4.0 (via CDN)

## Lưu ý

- Đảm bảo đã cài đặt Node.js (phiên bản 14 trở lên)
- Các file CV (PDF/DOCX) cần được thêm vào thư mục `public/` để tính năng download hoạt động
- Email contact form sử dụng mailto link, cần cấu hình email client
