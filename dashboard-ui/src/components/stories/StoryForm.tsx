import React, { useState, useEffect } from 'react';
import type { Story, StoryData, StoryPatch } from '../../types/story';

interface StoryFormProps {
  story?: Story;
  onSubmit: (storyData: Story | StoryPatch) => Promise<void>;
  onCancel: () => void;
}

interface StoryDataFormItem extends StoryData {
  tempId: string; // Used for tracking items in the form
}

const StoryForm: React.FC<StoryFormProps> = ({ story, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('');
  const [srcUrl, setSrcUrl] = useState('');
  const [visible, setVisible] = useState(true);
  const [storyItems, setStoryItems] = useState<StoryDataFormItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [srcPreviewError, setSrcPreviewError] = useState(false);
  const [itemPreviewErrors, setItemPreviewErrors] = useState<Record<string, boolean>>({});

  // Initialize or reset form based on story prop
  useEffect(() => {
    if (story) {
      // Edit mode - set values from existing story
      setTitle(story.title);
      setIcon(story.icon || '');
      setSrcUrl(story.src || '');
      setVisible(story.visible);
      setStoryItems(
        story.stories.map((item) => ({
          ...item,
          tempId: Math.random().toString(36).substr(2, 9)
        }))
      );
    } else {
      // Create mode - reset to defaults
      setTitle('');
      setIcon('');
      setSrcUrl('');
      setVisible(true);
      setStoryItems([]);
      setSrcPreviewError(false);
      setItemPreviewErrors({});
    }
  }, [story]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIcon(e.target.value);
  };

  const handleSrcUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSrcUrl(e.target.value);
    setSrcPreviewError(false);
  };

  const handleAddStoryItem = () => {
    const newItem: StoryDataFormItem = {
      title: '',
      description: '',
      type: 'image',
      url: '',
      duration: 5,
      tempId: Math.random().toString(36).substr(2, 9)
    };
    setStoryItems([...storyItems, newItem]);
  };

  const handleRemoveStoryItem = (tempId: string) => {
    setStoryItems(storyItems.filter(item => item.tempId !== tempId));
    // Remove any preview error for this item
    const newErrors = { ...itemPreviewErrors };
    delete newErrors[tempId];
    setItemPreviewErrors(newErrors);
  };

  const handleStoryItemChange = (tempId: string, field: keyof StoryData, value: string | number) => {
    setStoryItems(storyItems.map(item => 
      item.tempId === tempId ? { ...item, [field]: value } : item
    ));
    
    // Reset preview error when URL changes
    if (field === 'url') {
      const newErrors = { ...itemPreviewErrors };
      delete newErrors[tempId];
      setItemPreviewErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare story data without tempIds
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const storyItemsWithoutTempId = storyItems.map(({ tempId, ...rest }) => rest);
      
      const storyData = story 
        ? {
            id: story.id,
            title,
            icon,
            src: srcUrl,
            visible,
            stories: storyItemsWithoutTempId
          } as StoryPatch
        : {
            title,
            icon,
            src: srcUrl,
            visible,
            stories: storyItemsWithoutTempId
          } as Story;

      await onSubmit(storyData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSrcError = () => {
    setSrcPreviewError(true);
  };

  const handleItemImageError = (tempId: string) => {
    setItemPreviewErrors(prev => ({
      ...prev,
      [tempId]: true
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[500px] pr-2">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Story Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-300 mb-1">
            Icon
          </label>
          <input
            id="icon"
            type="text"
            value={icon}
            onChange={handleIconChange}
            placeholder="Icon identifier"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="srcUrl" className="block text-sm font-medium text-gray-300 mb-1">
            Source URL
          </label>
          <input
            id="srcUrl"
            type="url"
            value={srcUrl}
            onChange={handleSrcUrlChange}
            placeholder="https://example.com/source.png"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          {srcUrl && (
            <div className="mt-3 flex items-center">
              {!srcPreviewError ? (
                <div className="flex space-x-4 items-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-md overflow-hidden shadow-md">
                    <img
                      src={srcUrl}
                      alt="Source preview"
                      className="w-full h-full object-cover"
                      onError={handleSrcError}
                    />
                  </div>
                  <span className="text-sm text-gray-400">Source preview</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Invalid image URL</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center">
          <div className="flex items-center h-5">
            <input
              id="visible"
              type="checkbox"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="visible" className="text-sm text-gray-300">
              Visible
            </label>
            <p className="text-xs text-gray-400">
              Story will be shown to users in the app
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium text-white">Story Items</h3>
            <button
              type="button"
              onClick={handleAddStoryItem}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              Add Item
            </button>
          </div>
          
          {storyItems.length === 0 ? (
            <div className="text-center p-8 bg-gray-800 rounded-md">
              <p className="text-gray-400">No story items yet. Click "Add Item" to create one.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {storyItems.map((item, index) => (
                <div key={item.tempId} className="bg-gray-800 p-5 rounded-md border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-semibold">Item #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveStoryItem(item.tempId)}
                      className="text-red-400 hover:text-red-300 bg-gray-700 hover:bg-gray-600 p-1.5 rounded-md transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="lg:flex gap-6">
                    {/* Preview Column - Always visible */}
                    <div className="lg:w-1/3 mb-4 lg:mb-0">
                      <div className="bg-gray-900 rounded-md p-3 h-full flex flex-col">
                        <div className="text-sm font-medium text-gray-400 mb-2">Preview</div>
                        {item.url ? (
                          !itemPreviewErrors[item.tempId] ? (
                            <div className="flex-1 flex flex-col items-center justify-center">
                              <div className="w-full h-48 bg-gray-800 rounded-md overflow-hidden shadow-md">
                                <img
                                  src={item.url}
                                  alt={item.title || `Item ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={() => handleItemImageError(item.tempId)}
                                />
                              </div>
                              <div className="mt-3 text-center">
                                <div className="text-white font-medium">{item.title || 'Untitled'}</div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {item.type === 'video' ? 'Video' : 'Image'} • {item.duration}s
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center justify-center">
                              <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-400 mb-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div className="text-red-400 font-medium">Invalid image</div>
                                <div className="text-xs text-gray-500 mt-1">The URL provided cannot be loaded</div>
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                              <div className="text-gray-500 font-medium">No image yet</div>
                              <div className="text-xs text-gray-500 mt-1">Add a URL to see preview</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Form Fields Column */}
                    <div className="lg:w-2/3">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor={`item-title-${item.tempId}`} className="block text-sm font-medium text-gray-300 mb-1">
                              Title
                            </label>
                            <input
                              id={`item-title-${item.tempId}`}
                              type="text"
                              value={item.title}
                              onChange={(e) => handleStoryItemChange(item.tempId, 'title', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              required
                            />
                          </div>
                        
                          <div>
                            <label htmlFor={`item-type-${item.tempId}`} className="block text-sm font-medium text-gray-300 mb-1">
                              Type
                            </label>
                            <select
                              id={`item-type-${item.tempId}`}
                              value={item.type}
                              onChange={(e) => handleStoryItemChange(item.tempId, 'type', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              required
                            >
                              <option value="image">Image</option>
                              <option value="video">Video</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor={`item-description-${item.tempId}`} className="block text-sm font-medium text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            id={`item-description-${item.tempId}`}
                            value={item.description}
                            onChange={(e) => handleStoryItemChange(item.tempId, 'description', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor={`item-url-${item.tempId}`} className="block text-sm font-medium text-gray-300 mb-1">
                            Media URL {item.type === 'video' ? '(Video)' : '(Image)'}
                          </label>
                          <input
                            id={`item-url-${item.tempId}`}
                            type="url"
                            value={item.url}
                            onChange={(e) => handleStoryItemChange(item.tempId, 'url', e.target.value)}
                            placeholder={item.type === 'video' ? "https://example.com/video.mp4" : "https://example.com/image.jpg"}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor={`item-duration-${item.tempId}`} className="block text-sm font-medium text-gray-300 mb-1">
                            Duration (seconds)
                          </label>
                          <input
                            id={`item-duration-${item.tempId}`}
                            type="number"
                            min="1"
                            value={item.duration}
                            onChange={(e) => handleStoryItemChange(item.tempId, 'duration', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : story ? 'Update Story' : 'Create Story'}
        </button>
      </div>
    </form>
  );
};

export default StoryForm; 