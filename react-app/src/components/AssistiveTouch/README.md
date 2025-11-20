# AssistiveTouch Component

Component AssistiveTouch giống nút nổi trên iPhone, có thể kéo thả và mở menu với animation mượt mà.

## ✨ Tính năng

- ✅ **Nút tròn** với hiệu ứng glassmorphism
- ✅ **Kéo thả** tự do trên màn hình (hỗ trợ cả mouse và touch)
- ✅ **Animation** mượt khi mở/đóng menu
- ✅ **Tự động đóng** khi click ra ngoài
- ✅ **Lưu vị trí** vào localStorage
- ✅ **Responsive** trên mobile và desktop
- ✅ **Dark mode** support
- ✅ **Customizable** menu items

## 📦 Cài đặt

Component đã được tích hợp sẵn vào `App.tsx`. Chỉ cần import và sử dụng:

```tsx
import AssistiveTouch from './components/AssistiveTouch';

<AssistiveTouch
  menuItems={[
    {
      label: 'Home',
      icon: '🏠',
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
    // ... more items
  ]}
/>
```

## 🎯 Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `menuItems` | `Array<MenuItem>` | `[...]` | Danh sách các menu items |
| `position` | `{ x: number, y: number }` | `undefined` | Vị trí ban đầu (tự động lưu vào localStorage) |
| `onPositionChange` | `(pos: {x, y}) => void` | `undefined` | Callback khi vị trí thay đổi |

### MenuItem Interface

```typescript
interface MenuItem {
  label: string;        // Text hiển thị
  icon?: string;        // Icon (emoji hoặc text)
  action: () => void;   // Function được gọi khi click
}
```

## 🎨 Customization

### Thay đổi màu sắc

Chỉnh sửa trong `AssistiveTouch.css`:

```css
.assistive-touch-button {
  background: rgba(0, 0, 0, 0.7); /* Màu nền */
}

.assistive-touch-button.open {
  background: rgba(99, 102, 241, 0.9); /* Màu khi mở */
}
```

### Thay đổi kích thước

```css
.assistive-touch-button {
  width: 60px;  /* Đổi kích thước nút */
  height: 60px;
}
```

## 📱 Responsive

Component tự động điều chỉnh trên mobile:
- Nút nhỏ hơn (56px thay vì 60px)
- Menu nhỏ gọn hơn
- Touch events được tối ưu

## 🔧 Ví dụ sử dụng nâng cao

```tsx
<AssistiveTouch
  menuItems={[
    {
      label: 'Scroll to Top',
      icon: '⬆️',
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
    {
      label: 'Toggle Theme',
      icon: '🌓',
      action: () => {
        const current = document.body.classList.contains('dark') ? 'light' : 'dark';
        document.body.classList.toggle('dark');
      },
    },
    {
      label: 'Open Sidebar',
      icon: '☰',
      action: () => {
        // Your sidebar logic
      },
    },
  ]}
  onPositionChange={(pos) => {
    console.log('New position:', pos);
  }}
/>
```

## 🎭 Animation

Component sử dụng CSS transitions và transforms:
- **Fade in/out** khi mở/đóng menu
- **Scale animation** cho menu
- **Rotate animation** cho nút khi mở
- **Pulse effect** khi hover

## 💾 Lưu trữ

Vị trí của nút được tự động lưu vào `localStorage` với key `assistiveTouchPosition`. Component sẽ tự động khôi phục vị trí khi reload trang.

## 🐛 Troubleshooting

### Nút không hiển thị
- Kiểm tra `z-index` (mặc định: 9999)
- Đảm bảo không có element nào che phủ

### Không kéo được
- Kiểm tra console có lỗi không
- Đảm bảo `pointer-events: auto` được set

### Menu không đóng khi click ra ngoài
- Kiểm tra `useEffect` với `handleClickOutside`
- Đảm bảo không có event propagation bị chặn

## 📄 License

MIT

