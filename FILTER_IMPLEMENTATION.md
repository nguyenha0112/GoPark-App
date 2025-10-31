# Filter Implementation Guide

## Overview
Đã triển khai hệ thống bộ lọc toàn diện cho trang home, giống với web GoPark-FE.

## Changes Made

### 1. FilterModal Component (`components/FilterModal.tsx`)
**Status:** ✅ Created (200 lines)

**Features:**
- Modal overlay với white background
- Search input để tìm theo tên bãi đỗ
- City filter input
- Payment method dropdown:
  - `all` - Tất cả
  - `prepaid` - Trả trước
  - `pay-at-parking` - Trả tại bãi
- Sort by dropdown:
  - `newest` - Mới nhất (default)
  - `oldest` - Cũ nhất
  - `name-asc` - Tên A-Z
  - `name-desc` - Tên Z-A
  - `price-asc` - Giá thấp đến cao
  - `price-desc` - Giá cao đến thấp
- Min/Max price sliders
- "Xóa bộ lọc" clear button
- "Áp dụng" apply button (black)

**Props Interface:**
```typescript
interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  currentFilters: Filters;
}

export interface Filters {
  city: string;
  minPrice: string;
  maxPrice: string;
  paymentMethod: string;
  sortBy: string;
}
```

**Styling:**
- White background cards
- Gray-300 borders
- Black primary button (#000)
- Green-500 for selected states

### 2. Home Page Updates (`app/(tabs)/home.tsx`)

**Filter Integration:**
```typescript
const [filterModalVisible, setFilterModalVisible] = useState(false);
const [filters, setFilters] = useState<Filters>({
  city: '',
  minPrice: '',
  maxPrice: '',
  paymentMethod: '',
  sortBy: 'newest',
});
```

**Filter Logic in useEffect:**
- Search filter: name, address, description
- City filter: substring match in address
- Price range filter: minPrice and maxPrice
- Payment method filter: check allowedPaymentMethods array
- Sort options:
  - newest/oldest: by createdAt timestamp
  - name-asc/desc: by localeCompare
  - price-asc/desc: by pricePerHour
  - distance: by calculateDistance (if userLocation available)

**UI Changes:**
- Removed purple gradient header → white background
- Added filter button next to ViewToggle
- Shows result count: "Tìm thấy X bãi đỗ xe"
- Pull to refresh with green color (#22c55e)
- Empty state with "Xóa tìm kiếm" button

### 3. ViewToggle Component (`components/ViewToggle.tsx`)

**Updates:**
- Removed filter button (now separate in home.tsx)
- Changed from purple to gray/white color scheme
- Active state: white background with shadow
- Inactive state: transparent with gray text
- Icons change color based on state (black when active)

**Props Changed:**
```typescript
// BEFORE:
interface ViewToggleProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onFilterPress: () => void; // ❌ Removed
}

// AFTER:
interface ViewToggleProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}
```

### 4. SearchBar Component (`components/SearchBar.tsx`)

**Updates:**
- Simplified design: gray-50 background, gray-200 border
- Removed blue search button
- Added clear button (X) when text is entered
- Matches web design aesthetic

## Color Scheme (Matching Web)

| Element | Color |
|---------|-------|
| Background | White (#FFFFFF) |
| Secondary BG | Gray-50 (#F9FAFB) |
| Borders | Gray-200/300 (#E5E7EB) |
| Text Primary | Gray-900 (#111827) |
| Text Secondary | Gray-600 (#4B5563) |
| Icons Inactive | Gray-400 (#9CA3AF) |
| Primary Button | Black (#000000) |
| Success/Available | Green-500 (#22C55E) |
| Danger | Red-500 (#EF4444) |

## Filter Flow

1. User clicks "Bộ lọc" button in header
2. FilterModal opens with current filters
3. User adjusts filters (city, price, payment, sort)
4. User clicks "Áp dụng"
5. Modal closes, filters applied
6. useEffect runs and filters parkingLots array
7. filteredLots updated, UI refreshes

## API Integration

**No backend changes required** - all filtering done client-side.

Parking lots fetched once from:
```typescript
GET /api/v1/parkinglots/public/all
```

Response includes:
- `_id`, `name`, `address`, `description`
- `location.coordinates` - [longitude, latitude]
- `pricePerHour` - for price filtering
- `allowedPaymentMethods` - ['prepaid', 'pay-at-parking']
- `createdAt` - for newest/oldest sort
- `zones[]` - for slot calculations
- `avtImage`, `image[]` - for display

## Testing Checklist

- [ ] Filter by city name
- [ ] Filter by price range (min/max)
- [ ] Filter by payment method (prepaid/cash/all)
- [ ] Sort by newest
- [ ] Sort by oldest
- [ ] Sort by name A-Z
- [ ] Sort by name Z-A
- [ ] Sort by price low to high
- [ ] Sort by price high to low
- [ ] Sort by distance (requires location permission)
- [ ] Clear all filters
- [ ] Search + filter combination
- [ ] Empty state when no results
- [ ] Pull to refresh

## Known Issues

- ✅ Network connectivity: Backend accessible via curl but app may show "Network request failed"
  - Solution: User needs to check firewall/network settings
  - See: CONNECTION_GUIDE.md

- ⚠️ Distance sorting requires location permission
  - If denied, distance sort won't work
  - Falls back to default sort

## Next Steps

1. Test all filter combinations
2. Add loading states for filter application
3. Consider adding filter badge count (e.g., "Bộ lọc (3)")
4. Add analytics to track which filters are most used
5. Consider persisting filter preferences in AsyncStorage

## Files Modified

```
GoPark-App/
├── components/
│   ├── FilterModal.tsx          (NEW - 200 lines)
│   ├── SearchBar.tsx            (UPDATED - simpler design)
│   └── ViewToggle.tsx           (UPDATED - removed filter button)
└── app/
    └── (tabs)/
        └── home.tsx             (UPDATED - filter integration)
```

## References

- Web Design: `GoPark-FE/app/findParking/page.tsx`
- Color Scheme: Matching web (white/gray/green/black)
- Backend API: No changes required
- User Request: "trang home này cũng phải làm sao cho giống web cho tôi, và bạn hãy thực hiện bộ lọc cho tôi, tạo component bộ lọc nhé"
