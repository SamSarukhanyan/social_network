# Multer File Upload Fix - Complete Guide

## 1. Why This Error Happens

### The Error
```
MulterError: Unexpected field
    code: 'LIMIT_UNEXPECTED_FILE',
    field: 'files'
```

### Root Cause
**Field name mismatch between frontend and backend:**

- **Backend** (`multer.js` line 37): Expects field name `"photos"`
  ```javascript
  }).array("photos", 10);
  ```

- **Frontend** (`PostForm.jsx` line 26): Was sending field name `"files"`
  ```javascript
  formData.append('files', file);  // ❌ Wrong field name
  ```

When Multer is configured with `.array("photos", 10)`, it **only accepts** files with the field name `"photos"`. Any other field name (like `"files"`) triggers `LIMIT_UNEXPECTED_FILE` error.

## 2. Backend Fix (Express + Multer)

### Current Configuration (Fixed)

**File**: `src/modules/post/middlewares/multer.js`

```javascript
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10, // Maximum 10 files
  },
  fileFilter,
}).array("photos", 10); // Field name "photos", max 10 files
```

### Key Points:
- **Field name**: `"photos"` (must match frontend)
- **Max files**: 10
- **Max file size**: 5MB per file
- **Storage**: Disk storage in `uploads/posts/`
- **File types**: JPEG, JPG, PNG, GIF only

### Error Handling (Improved)

**File**: `src/modules/post/middlewares/multerError.middleware.js`

Now handles all Multer error codes with user-friendly messages:
- `LIMIT_UNEXPECTED_FILE` - Wrong field name
- `LIMIT_FILE_SIZE` - File too large
- `LIMIT_FILE_COUNT` - Too many files
- And more...

## 3. Frontend FormData Setup (Fixed)

### Correct Implementation

**File**: `frontend/src/components/Post/PostForm.jsx`

```javascript
const formData = new FormData();
formData.append('title', title.trim());
formData.append('description', description.trim());

// ✅ CORRECT: Field name must match backend "photos"
files.forEach((file) => {
  formData.append('photos', file);  // Field name: "photos"
});
```

### Complete Example

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  
  // Text fields
  formData.append('title', title.trim());
  formData.append('description', description.trim());
  
  // Image files - field name MUST be "photos"
  files.forEach((file) => {
    formData.append('photos', file);
  });
  
  // Send to API
  await createPostMutation.mutate(formData);
};
```

## 4. Production Safety & Validation

### Backend Validations

#### File Type Validation
```javascript
function fileFilter(req, file, cb) {
  const allowedExtensions = /\.(jpeg|jpg|png|gif)$/i;
  const allowedMimeTypes = /^image\/(jpeg|jpg|png|gif)$/i;
  
  // Check both extension AND MIME type (security)
  const ext = allowedExtensions.test(path.extname(file.originalname));
  const mime = allowedMimeTypes.test(file.mimetype);
  
  if (!ext || !mime) {
    return cb(new AppError("Invalid file type", 400));
  }
  
  cb(null, true);
}
```

#### File Size Limits
```javascript
limits: {
  fileSize: 5 * 1024 * 1024, // 5MB per file
  files: 10, // Maximum 10 files per request
}
```

#### Filename Sanitization
```javascript
filename(req, file, cb) {
  const unique = crypto.randomBytes(6).toString("hex");
  const ext = path.extname(file.originalname).toLowerCase();
  const base = path.basename(file.originalname, ext)
    .replace(/[^\w\-]/g, "_"); // Sanitize filename
  
  cb(null, `${unique}-${base}${ext}`);
}
```

### Frontend Validations

Add client-side validation before upload:

```javascript
const handleFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files);
  
  // Validate file count
  if (selectedFiles.length > 10) {
    toast.error('Maximum 10 files allowed');
    return;
  }
  
  // Validate file types and sizes
  const invalidFiles = selectedFiles.filter(file => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    return !validTypes.includes(file.type) || file.size > maxSize;
  });
  
  if (invalidFiles.length > 0) {
    toast.error('Only JPEG, PNG, GIF images up to 5MB are allowed');
    return;
  }
  
  setFiles(selectedFiles);
};
```

### Recommended Production Limits

```javascript
// Conservative limits for production
limits: {
  fileSize: 5 * 1024 * 1024,    // 5MB per file
  files: 10,                      // 10 files max
  fieldSize: 1024 * 1024,        // 1MB for other fields
  fields: 10,                     // 10 text fields max
}
```

## 5. Debugging Multer Errors

### Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| `LIMIT_UNEXPECTED_FILE` | Wrong field name | Match frontend field name to backend |
| `LIMIT_FILE_SIZE` | File too large | Reduce file size or increase limit |
| `LIMIT_FILE_COUNT` | Too many files | Reduce number of files |
| `LIMIT_PART_COUNT` | Too many parts | Check request structure |
| `LIMIT_FIELD_KEY` | Field name too long | Shorten field names |
| `LIMIT_FIELD_VALUE` | Field value too long | Reduce text field size |

### Debugging Steps

1. **Check field name match**:
   ```javascript
   // Backend
   }).array("photos", 10);
   
   // Frontend - MUST match
   formData.append('photos', file);
   ```

2. **Log Multer errors**:
   ```javascript
   if (err instanceof multer.MulterError) {
     console.error("Multer error:", {
       code: err.code,
       field: err.field,
       message: err.message,
     });
   }
   ```

3. **Check request in browser DevTools**:
   - Network tab → Request payload
   - Verify FormData field names
   - Check Content-Type: `multipart/form-data`

4. **Test with curl**:
   ```bash
   curl -X POST http://localhost:5000/posts \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "title=Test Post" \
     -F "description=Test Description" \
     -F "photos=@image1.jpg" \
     -F "photos=@image2.jpg"
   ```

## 6. Folder Structure & File Names

### Upload Directory Structure

```
Social_network_backend/
├── uploads/
│   └── posts/
│       ├── a1b2c3-image1.jpg
│       ├── d4e5f6-photo.png
│       └── g7h8i9-screenshot.gif
```

### Filename Format

```
{random-hex}-{sanitized-original-name}.{ext}
```

**Example**:
- Original: `My Vacation Photo (2024).jpg`
- Saved as: `a1b2c3-My_Vacation_Photo_2024_.jpg`

### Directory Creation

Ensure directory exists (already in `src/index.js`):
```javascript
fs.mkdirSync("uploads/posts", { recursive: true });
```

## 7. Common Pitfalls: `upload.array()` vs `upload.single()`

### `upload.array(fieldname, maxCount)`

**Use when**: Multiple files with same field name

```javascript
// Backend
export const upload = multer({...}).array("photos", 10);

// Frontend
formData.append('photos', file1);
formData.append('photos', file2);
formData.append('photos', file3);

// Access in controller
req.files  // Array of files
```

**Pitfalls**:
- ❌ Don't use different field names for each file
- ❌ Don't exceed `maxCount`
- ✅ All files must use the same field name

### `upload.single(fieldname)`

**Use when**: Single file upload

```javascript
// Backend
export const upload = multer({...}).single("photo");

// Frontend
formData.append('photo', file);

// Access in controller
req.file  // Single file object (not array!)
```

**Pitfalls**:
- ❌ `req.file` (singular), not `req.files`
- ❌ Only accepts ONE file
- ❌ Sending multiple files will cause errors

### `upload.fields([{name, maxCount}, ...])`

**Use when**: Multiple fields with different names

```javascript
// Backend
export const upload = multer({...}).fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]);

// Frontend
formData.append('avatar', avatarFile);
formData.append('gallery', galleryFile1);
formData.append('gallery', galleryFile2);

// Access in controller
req.files.avatar[0]    // Single file
req.files.gallery      // Array of files
```

### Comparison Table

| Method | Field Name | Files | Access |
|--------|-----------|-------|--------|
| `.single()` | One | 1 | `req.file` |
| `.array()` | One (repeated) | Multiple | `req.files` (array) |
| `.fields()` | Multiple | Multiple | `req.files.fieldname` |

## 8. Complete Working Example

### Backend Route

```javascript
// post.router.js
postRouter.post(
  "/",
  upload,  // Multer middleware
  asyncHandler(postController.createPost.bind(postController))
);
```

### Backend Controller

```javascript
// post.controller.js
async createPost(req, res) {
  // req.files is an array when using .array()
  const post = await this.service.createPost(
    req.user.id,
    req.body,      // { title, description }
    req.files      // Array of file objects
  );
  return res.status(201).json({ ok: true, data: post });
}
```

### Frontend Component

```javascript
// PostForm.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('title', title.trim());
  formData.append('description', description.trim());
  
  // ✅ Field name matches backend: "photos"
  files.forEach((file) => {
    formData.append('photos', file);
  });
  
  await createPostMutation.mutate(formData);
};
```

### Frontend Service

```javascript
// post.service.js
createPost: async (formData) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.POSTS.CREATE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data', // Important!
      },
    }
  );
  return response.data;
}
```

## 9. Security Best Practices

1. **Validate file types** (both extension and MIME type)
2. **Limit file size** (prevent DoS attacks)
3. **Sanitize filenames** (prevent path traversal)
4. **Use unique filenames** (prevent overwrites)
5. **Store outside web root** (if possible)
6. **Scan for malware** (in production)
7. **Rate limit uploads** (prevent abuse)

## 10. Testing Checklist

- [x] Field name matches: frontend `"photos"` = backend `"photos"`
- [x] Multiple files upload correctly
- [x] File size validation works (5MB limit)
- [x] File type validation works (images only)
- [x] File count limit works (10 max)
- [x] Error messages are user-friendly
- [x] Files saved with unique names
- [x] Files accessible via URL
- [x] Failed uploads don't leave orphaned files

## Summary

**The Fix**: Changed frontend field name from `"files"` to `"photos"` to match backend configuration.

**Key Takeaway**: The field name in `formData.append()` **must exactly match** the field name in Multer's `.array()` or `.single()` configuration.

