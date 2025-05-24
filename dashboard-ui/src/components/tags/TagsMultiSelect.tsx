import React, { useState, useEffect, useRef } from 'react';
import { fetchTags } from '../../services/api';
import type { Tag } from '../../types/tag';

interface TagsMultiSelectProps {
  selectedTags: number[];
  onChange: (selectedTags: number[]) => void;
}

const TagsMultiSelect: React.FC<TagsMultiSelectProps> = ({ selectedTags, onChange }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all available tags on component mount
  useEffect(() => {
    const loadTags = async () => {
      setLoading(true);
      try {
        const tagsData = await fetchTags();
        setTags(tagsData);
      } catch (error) {
        console.error('Error loading tags:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTag = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  const getSelectedTagNames = () => {
    return selectedTags.map(tagId => {
      const tag = tags.find(t => t.id === tagId);
      return tag ? tag.name : `Tag ${tagId}`;
    }).join(', ');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center justify-between w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedTags.length > 0 ? (
            getSelectedTagNames()
          ) : (
            <span className="text-gray-400">Select tags...</span>
          )}
        </div>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-gray-700 shadow-lg max-h-60 overflow-auto custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center py-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-blue-500 border-blue-500 border-opacity-25"></div>
              <span className="ml-2 text-gray-300">Loading tags...</span>
            </div>
          ) : tags.length === 0 ? (
            <div className="py-2 px-3 text-gray-400 text-sm">No tags available</div>
          ) : (
            <div className="py-1">
              {tags.map(tag => (
                <div
                  key={tag.id}
                  className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-600 ${
                    selectedTags.includes(tag.id) ? 'bg-blue-900/30' : ''
                  }`}
                  onClick={() => toggleTag(tag.id)}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded bg-gray-700"
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => {}} // Handled by parent div click
                    onClick={e => e.stopPropagation()}
                  />
                  {tag.icon && (
                    <img
                      src={tag.icon}
                      alt=""
                      className="ml-2 h-6 w-6 rounded object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span className="ml-2 text-white">{tag.name}</span>
                  {!tag.visible && (
                    <span className="ml-2 text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full">
                      Hidden
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagsMultiSelect; 