import { useState, useRef } from 'react';
import { useCreatePost } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/auth';
import { Avatar } from '@/components/Account/Avatar';

export const PostForm = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const createPostMutation = useCreatePost();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    // Multer expects field name "photos" (matches backend configuration)
    files.forEach((file) => {
      formData.append('photos', file);
    });

    createPostMutation.mutate(formData, {
      onSuccess: () => {
        setTitle('');
        setDescription('');
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (onSuccess) onSuccess();
      },
    });
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Avatar user={user} size="medium" />
        <div className="font-medium text-gray-900">
          {user?.name} {user?.surname}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
          className="input mb-3"
          required
          disabled={createPostMutation.isPending}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          className="input mb-3 resize-none"
          required
          disabled={createPostMutation.isPending}
        />

        {/* File Preview */}
        {files.length > 0 && (
          <div className="mb-3 grid grid-cols-2 md:grid-cols-3 gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={createPostMutation.isPending}
            />
            <span className="btn btn-secondary text-sm">
              <svg
                className="w-5 h-5 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Add Photos
            </span>
          </label>
          <button
            type="submit"
            disabled={!title.trim() || !description.trim() || createPostMutation.isPending}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createPostMutation.isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

