// CreatePostModal.tsx
import React, { useState } from 'react';
import { Button } from './buttons/Button';
import { api } from '~/utils/api';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const trpcUtils = api.useContext();
  const createPost = api.post.create.useMutation({
    onSuccess: async (newPost) => {
      console.log(newPost);
      await trpcUtils.post.infiniteFeed.invalidate();
      await trpcUtils.user.getUserProfile.invalidate();
    },
  });

  const handleSubmit = () => {
    setError(null);

    if (content.length < 1) {
      setError('Content must be at least 1 character.');
      return;
    } else if (content.length > 140) {
      setError('Content must not exceed 140 characters.');
      return;
    }

    try {
      createPost.mutate({ content: content });
      onClose();
    } catch (e) {
      setError('Unable to create post. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-40"></div> {/* Overlay */}
      <div className="bg-white dark:bg-black p-5 rounded-lg w-11/12 max-w-md z-10">
        <h2 className="text-md font-semibold mb-4">Create a New Post</h2>
        <h4 className="text-sm mb-2">Content</h4>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="border rounded p-2 w-full h-20 mb-2 resize-none bg-transparent"
        ></textarea>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button gray={true} onClick={onClose} className="px-4 py-2 w-20 rounded-md text-gray-600 hover:bg-gray-100">
            Close
          </Button>
          <Button onClick={handleSubmit} className="px-4 py-2 w-20 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
