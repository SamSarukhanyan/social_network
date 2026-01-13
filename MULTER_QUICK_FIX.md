# Multer Error Fix - Quick Reference

## ✅ FIXED: Field Name Mismatch

### The Problem
- **Backend expected**: `"photos"`
- **Frontend was sending**: `"files"`
- **Result**: `MulterError: LIMIT_UNEXPECTED_FILE`

### The Solution

**Frontend** (`PostForm.jsx`):
```javascript
// ✅ FIXED: Changed from "files" to "photos"
files.forEach((file) => {
  formData.append('photos', file);  // Must match backend
});
```

**Backend** (`multer.js`):
```javascript
// Already correct - expects "photos"
export const upload = multer({...}).array("photos", 10);
```

## Field Name Must Match!

| Location | Field Name | Status |
|----------|-----------|--------|
| Backend `.array()` | `"photos"` | ✅ |
| Frontend `formData.append()` | `"photos"` | ✅ Fixed |

## Testing

1. Select multiple images (up to 10)
2. Fill in title and description
3. Submit post
4. ✅ Should upload successfully
5. ✅ No `LIMIT_UNEXPECTED_FILE` error

## Common Mistakes to Avoid

❌ **Wrong**: `formData.append('files', file)`
✅ **Correct**: `formData.append('photos', file)`

❌ **Wrong**: `formData.append('image', file)`
✅ **Correct**: `formData.append('photos', file)`

❌ **Wrong**: `formData.append('photo', file)` (singular)
✅ **Correct**: `formData.append('photos', file)` (plural)

The field name in frontend **must exactly match** the field name in backend Multer configuration!

