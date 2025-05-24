import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchTags, createTag, updateTag, deleteTag } from '../services/api';
import type { Tag } from '../types/tag';
import TagForm from '../components/tags/TagForm';

const TagsPage: React.FC = () => {
  const { token } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  // Mobile view state to toggle between list and form
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTags();
  }, [token]);

  const loadTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const tagsData = await fetchTags();
      setTags(tagsData);
    } catch (err) {
      console.error('Error loading tags:', err);
      setError('Failed to load tags. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (formData: FormData) => {
    try {
      await createTag(formData);
      await loadTags();
      setIsCreating(false);
      // Return to list view on mobile after creating
      setShowForm(false);
    } catch (err) {
      console.error('Error creating tag:', err);
      setError('Failed to create tag. Please try again.');
    }
  };

  const handleUpdateTag = async (formData: FormData) => {
    if (!selectedTag) return;

    try {
      await updateTag(selectedTag.id, formData);
      await loadTags();
      // Keep the tag selected after update, but refresh the selection
      const updatedTag = (await fetchTags()).find((tag: Tag) => tag.id === selectedTag.id);
      setSelectedTag(updatedTag || null);
      // Return to list view on mobile after updating
      setShowForm(false);
    } catch (err) {
      console.error('Error updating tag:', err);
      setError('Failed to update tag. Please try again.');
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTag(id);
      await loadTags();
      if (selectedTag?.id === id) {
        setSelectedTag(null);
      }
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting tag:', err);
      setError('Failed to delete tag. Please try again.');
    }
  };

  const startCreating = () => {
    setSelectedTag(null);
    setIsCreating(true);
    // Show form view on mobile when creating
    setShowForm(true);
  };

  const selectTag = (tag: Tag) => {
    setSelectedTag(tag);
    setIsCreating(false);
    // Show form view on mobile when selecting a tag
    setShowForm(true);
  };

  const cancelForm = () => {
    if (isCreating) {
      setIsCreating(false);
    }
    // Return to list view on mobile after canceling
    setShowForm(false);
  };

  // Back button for mobile view
  const handleBackToList = () => {
    setShowForm(false);
  };

  // Empty state component with consistent sizing
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <p className="mt-4 text-gray-400">Select a tag from the list or create a new one</p>
      <button
        onClick={startCreating}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Create New Tag
      </button>
    </div>
  );

  // Tag list component
  const TagList = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Tags</h2>
        <button
          onClick={startCreating}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Create
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-blue-500 border-blue-500 border-opacity-25"></div>
            <p className="mt-2 text-gray-300">Loading tags...</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No tags found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                onClick={() => selectTag(tag)}
                className={`p-3 rounded-md cursor-pointer transition-colors flex items-center ${
                  selectedTag?.id === tag.id
                    ? 'bg-blue-900/30 border border-blue-500/50'
                    : 'bg-gray-700 hover:bg-gray-600 border border-transparent'
                }`}
              >
                {tag.icon && (
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-600 flex-shrink-0 mr-3">
                    <img 
                      src={tag.icon} 
                      alt={tag.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Error';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{tag.name}</p>
                  <div className="flex space-x-2 text-xs mt-1">
                    <span className={`px-2 py-0.5 rounded-full ${
                      tag.visible 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {tag.visible ? 'Visible' : 'Hidden'}
                    </span>
                    <span className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full">
                      #{tag.id}
                    </span>
                  </div>
                </div>
                <div>
                  {deleteConfirmation === tag.id ? (
                    <div className="flex space-x-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTag(tag.id);
                        }}
                        className="text-white bg-red-600 hover:bg-red-700 p-1 rounded text-xs"
                      >
                        Yes
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmation(null);
                        }}
                        className="text-white bg-gray-600 hover:bg-gray-700 p-1 rounded text-xs"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmation(tag.id);
                      }}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Form container component
  const FormContainer = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">
          {isCreating ? 'Create New Tag' : selectedTag ? 'Edit Tag' : 'Select or Create a Tag'}
        </h2>
        {/* Back button only visible on mobile */}
        <button
          onClick={handleBackToList}
          className="md:hidden px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Back
        </button>
      </div>
      <div className="h-[calc(580px-56px)] p-6 overflow-visible">
        {isCreating ? (
          <TagForm
            onSubmit={handleCreateTag}
            onCancel={cancelForm}
          />
        ) : selectedTag ? (
          <TagForm
            tag={selectedTag}
            onSubmit={handleUpdateTag}
            onCancel={() => {
              setSelectedTag(null);
              setShowForm(false);
            }}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="flex flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-white">Tag Management</h1>
          {/* Create button (visible only on larger screens) */}
          <button
            onClick={startCreating}
            className="hidden md:block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Create New Tag
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500 bg-opacity-25 rounded-md text-red-200">
            {error}
          </div>
        )}

        {/* Main content area with responsive layout */}
        <div className="md:flex md:h-[580px] md:space-x-6">
          {/* Left column - Tags list (hidden on mobile when showing form) */}
          <div className={`w-full md:w-1/3 ${showForm ? 'hidden md:block' : 'block'} mb-4 md:mb-0 h-[580px] md:h-auto`}>
            <TagList />
          </div>

          {/* Right column - Form (hidden on mobile when showing list) */}
          <div className={`w-full md:w-2/3 ${showForm ? 'block' : 'hidden md:block'} h-[580px] md:h-auto`}>
            <FormContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagsPage; 