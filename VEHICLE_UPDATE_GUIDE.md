# Cập nhật tính năng quản lý xe - GoPark App

## Những thay đổi đã thực hiện

### 1. Tạo Component VehicleFormModal riêng biệt
**File:** `components/VehicleFormModal.tsx`

Component modal mới để thêm/sửa thông tin xe với các tính năng:
- ✅ Form riêng biệt, có thể tái sử dụng
- ✅ Chọn ảnh từ **Camera** hoặc **Thư viện ảnh**
- ✅ Upload ảnh lên Supabase Storage qua backend API
- ✅ Hiển thị preview ảnh đã chọn
- ✅ Validation đầy đủ (biển số, sức chứa, giới hạn 3 xe)
- ✅ Loading state khi upload và save

### 2. Cập nhật trang Vehicles
**File:** `app/vehicles.tsx`

Thay đổi chính:
- ✅ Hiển thị **ảnh xe** trong danh sách (nếu có)
- ✅ Placeholder đẹp khi chưa có ảnh (icon Car màu xám)
- ✅ Import và sử dụng `VehicleFormModal` component
- ✅ Gọn gàng hơn, tách logic form ra ngoài
- ✅ Responsive layout với ảnh full-width

### 3. Tích hợp Image Picker
**Package:** `expo-image-picker`

Chức năng mới:
- 📷 Chụp ảnh trực tiếp bằng camera
- 🖼️ Chọn ảnh từ thư viện
- ✂️ Crop/edit ảnh với tỷ lệ 4:3
- 🔒 Yêu cầu quyền truy cập camera và thư viện

### 4. Upload ảnh lên Backend
**Endpoint:** `POST /api/v1/upload`

Request format:
```javascript
FormData {
  file: {uri, type, name},
  type: 'vehicle',
  userId: '<user-id>'
}
```

Response:
```json
{
  "url": "https://supabase-url/storage/v1/object/public/uploads/vehicles/..."
}
```

## Cách sử dụng

### Thêm xe mới
1. Mở app → Drawer menu → "Xe của tôi"
2. Nhấn nút **+** ở header (hoặc "Thêm xe đầu tiên" nếu chưa có xe)
3. **Chọn ảnh xe:**
   - Nhấn vào khung "Chọn ảnh xe"
   - Chọn "Chụp ảnh" hoặc "Thư viện ảnh"
   - Crop/adjust ảnh nếu cần
4. Nhập **biển số xe** (VD: 30A-12345)
5. Chọn **sức chứa** (2, 4, 5, 7 chỗ hoặc nhập tùy chỉnh)
6. Nhấn "Thêm xe"

### Sửa thông tin xe
1. Trong danh sách xe, nhấn icon **✏️ Edit** (màu xanh)
2. Modal hiện ra với thông tin cũ đã được điền sẵn
3. Có thể:
   - Thay đổi ảnh (nhấn icon camera ở góc ảnh)
   - Xóa ảnh (nhấn X đỏ)
   - Sửa biển số
   - Đổi sức chứa
4. Nhấn "Cập nhật"

### Xóa xe
1. Nhấn icon **🗑️ Trash** (màu đỏ)
2. Xác nhận xóa trong dialog
3. Xe sẽ bị xóa khỏi danh sách

## Technical Details

### Image Upload Flow
```
User chọn ảnh
   ↓
ImagePicker lấy local URI
   ↓
Component lưu imageFile state
   ↓
User nhấn Save
   ↓
uploadImage() được gọi
   ↓
FormData với file + type:'vehicle' + userId
   ↓
POST /api/v1/upload
   ↓
Backend upload lên Supabase Storage
   ↓
Trả về public URL
   ↓
URL được lưu vào database (field: imageVehicle)
```

### State Management
```typescript
// VehicleFormModal.tsx
const [imageUri, setImageUri] = useState<string>('');      // Preview URI
const [imageFile, setImageFile] = useState<any>(null);    // File object
const [uploading, setUploading] = useState(false);        // Upload loading
const [saving, setSaving] = useState(false);              // Save loading
```

### Validation Rules
- ✅ Biển số: Bắt buộc, tự động UPPERCASE
- ✅ Sức chứa: Bắt buộc, >= 1
- ✅ Ảnh: Tùy chọn
- ✅ Giới hạn: Tối đa 3 xe/user
- ✅ Duplicate: Backend kiểm tra biển số trùng

### Error Handling
```typescript
try {
  const imageUrl = await uploadImage();  // Upload ảnh trước
  const vehicleData = {
    licensePlate: licensePlate.trim().toUpperCase(),
    capacity: capacity,
    imageVehicle: imageUrl,  // Có thể empty string
  };
  // POST hoặc PUT vehicle...
} catch (error) {
  // Handle duplicate licensePlate
  if (error.field === 'licensePlate') {
    Alert.alert('Lỗi', 'Biển số này đã được đăng ký');
  }
}
```

## UI/UX Improvements

### Trước
- ❌ Form trong modal trực tiếp ở vehicles.tsx
- ❌ Chỉ nhập link ảnh bằng URL
- ❌ Không hiển thị ảnh xe trong danh sách
- ❌ Code dài, khó bảo trì

### Sau
- ✅ Component riêng biệt, clean code
- ✅ Chọn ảnh từ camera/thư viện
- ✅ Hiển thị ảnh xe đẹp mắt với fallback icon
- ✅ Preview ảnh trước khi save
- ✅ Upload progress indicator
- ✅ Edit/delete ảnh dễ dàng

## Dependencies

```json
{
  "expo-image-picker": "~16.0.0"  // Đã cài đặt
}
```

## Backend Requirements

Đảm bảo backend có:
1. ✅ POST `/api/v1/upload` endpoint
2. ✅ Supabase Storage bucket `uploads` configured
3. ✅ Public URL access cho uploaded images
4. ✅ Authentication middleware

## Troubleshooting

### Lỗi "Cannot upload image"
- Kiểm tra quyền camera/thư viện ảnh
- Kiểm tra kết nối internet
- Kiểm tra Supabase credentials trong backend .env

### Ảnh không hiển thị
- Kiểm tra URL trong database có đúng format
- Kiểm tra Supabase bucket public access
- Kiểm tra CORS nếu ảnh từ external domain

### "Giới hạn 3 phương tiện"
- Đây là business rule, xóa xe cũ trước khi thêm mới
- Backend cũng enforce rule này

## Future Enhancements

Có thể thêm:
- [ ] Compress ảnh trước khi upload (giảm dung lượng)
- [ ] Multiple images per vehicle (nhiều góc chụp)
- [ ] OCR để tự động detect biển số từ ảnh
- [ ] Image filters/effects
- [ ] Vehicle color/brand fields with autocomplete
- [ ] QR code cho xe (để scan khi đỗ)

---

**Ngày cập nhật:** 31/10/2025  
**Phiên bản:** 1.0.0
