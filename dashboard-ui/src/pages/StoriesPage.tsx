import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchStories, fetchStoryById, createStory, updateStory, deleteStory } from '../services/api';
import type { Story, StoryFilter, StoryPatch } from '../types/story';
import StoryForm from '../components/stories/StoryForm';

const StoriesPage: React.FC = () => {
  const { token } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  // Mobile view state to toggle between list and form
  const [showForm, setShowForm] = useState(false);
  const [filter] = useState<StoryFilter>({});

  useEffect(() => {
    loadStories();
  }, [token]);

  const loadStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const storiesData = await fetchStories(filter);
      setStories(Array.isArray(storiesData) ? storiesData.flat() : []);
    } catch (err) {
      console.error('Error loading stories:', err);
      setError('Failed to load stories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (storyData: Story) => {
    try {
      await createStory(storyData);
      await loadStories();
      setIsCreating(false);
      // Return to list view on mobile after creating
      setShowForm(false);
    } catch (err) {
      console.error('Error creating story:', err);
      setError('Failed to create story. Please try again.');
    }
  };

  const handleUpdateStory = async (storyData: StoryPatch) => {
    try {
      await updateStory(storyData);
      await loadStories();
      // Keep the story selected after update, but refresh the selection
      if (selectedStory && selectedStory.id) {
        const updatedStory = await fetchStoryById(selectedStory.id);
        setSelectedStory(updatedStory);
      }
      // Return to list view on mobile after updating
      setShowForm(false);
    } catch (err) {
      console.error('Error updating story:', err);
      setError('Failed to update story. Please try again.');
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      await deleteStory(id);
      await loadStories();
      if (selectedStory?.id === id) {
        setSelectedStory(null);
      }
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting story:', err);
      setError('Failed to delete story. Please try again.');
    }
  };

  const startCreating = () => {
    setSelectedStory(null);
    setIsCreating(true);
    // Show form view on mobile when creating
    setShowForm(true);
  };

  const selectStory = (story: Story) => {
    setSelectedStory(story);
    setIsCreating(false);
    // Show form view on mobile when selecting a story
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

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <svg
        className="w-16 h-16 text-gray-500 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <h3 className="text-lg font-semibold text-white mb-2">No Story Selected</h3>
      <p className="text-gray-400 mb-6">Select a story from the list to edit or create a new one.</p>
      <button
        onClick={startCreating}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Create New Story
      </button>
    </div>
  );

  // Story list component
  const StoryListWrapper = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Stories</h2>
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
            <p className="mt-2 text-gray-300">Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No stories found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {stories.map((story) => (
              <div
                key={story.id}
                onClick={() => selectStory(story)}
                className={`p-3 rounded-md cursor-pointer transition-colors flex items-center ${
                  selectedStory?.id === story.id
                    ? 'bg-blue-900/30 border border-blue-500/50'
                    : 'bg-gray-700 hover:bg-gray-600 border border-transparent'
                }`}
              >
                {story.src && (
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-600 flex-shrink-0 mr-3">
                    <img 
                      src={story.src} 
                      alt={story.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite error loop
                        target.src = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"%3e%3crect width="40" height="40" fill="%234B5563"/%3e%3cpath d="M20 18C21.1046 18 22 17.1046 22 16C22 14.8954 21.1046 14 20 14C18.8954 14 18 14.8954 18 16C18 17.1046 18.8954 18 20 18Z" fill="%236B7280"/%3e%3cpath d="M14 26L18 22L20 24L24 20L26 22V26H14Z" fill="%236B7280"/%3e%3c/svg%3e';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{story.title}</p>
                  <div className="flex space-x-2 text-xs mt-1">
                    <span className={`px-2 py-0.5 rounded-full ${
                      story.visible 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {story.visible ? 'Visible' : 'Hidden'}
                    </span>
                    <span className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full">
                      {story.stories.length} items
                    </span>
                  </div>
                </div>
                {deleteConfirmation === story.id && (
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (story.id) {
                          handleDeleteStory(story.id);
                        }
                      }}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Yes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmation(null);
                      }}
                      className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                    >
                      No
                    </button>
                  </div>
                )}
                {deleteConfirmation !== story.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (story.id) {
                        setDeleteConfirmation(story.id);
                      }
                    }}
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
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
          {isCreating ? 'Create New Story' : selectedStory ? 'Edit Story' : 'Select or Create a Story'}
        </h2>
        {/* Back button only visible on mobile */}
        <button
          onClick={handleBackToList}
          className="md:hidden px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Back
        </button>
      </div>
      <div className="h-[calc(580px-56px)] p-6 overflow-y-auto">
        {isCreating ? (
          <StoryForm
            onSubmit={async (storyData) => {
              await handleCreateStory(storyData as Story);
            }}
            onCancel={cancelForm}
          />
        ) : selectedStory ? (
          <StoryForm
            story={selectedStory}
            onSubmit={async (storyData) => {
              // Make sure we have an ID for updates
              if (selectedStory?.id) {
                // Ensure we're sending a properly formatted patch request
                const patchData: StoryPatch = {
                  id: selectedStory.id,
                  ...storyData
                };
                await handleUpdateStory(patchData);
              } else {
                console.error("Cannot update story: missing ID");
              }
            }}
            onCancel={() => {
              setSelectedStory(null);
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
          <h1 className="text-xl md:text-2xl font-semibold text-white">Story Management</h1>
          {/* Create button (visible only on larger screens) */}
          <button
            onClick={startCreating}
            className="hidden md:block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Create New Story
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500 bg-opacity-25 rounded-md text-red-200">
            {error}
          </div>
        )}

        {/* Main content area with responsive layout */}
        <div className="md:flex md:h-[580px] md:space-x-6">
          {/* Left column - Stories list (hidden on mobile when showing form) */}
          <div className={`w-full md:w-1/3 ${showForm ? 'hidden md:block' : 'block'} mb-4 md:mb-0 h-[580px] md:h-auto`}>
            <StoryListWrapper />
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

export default StoriesPage; 