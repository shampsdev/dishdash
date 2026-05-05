'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { IconVariant, StoryButton } from '@/components/ui/stories/story-button';
import StoryViewer from '@/components/ui/stories/story-viewer';
import { Story } from '@/shared/interfaces/story.interface';
import { hapticFeedback } from '@telegram-apps/sdk-react';
import { useStories } from '@/shared/hooks/useStories';

export const StoryTray = () => {
  const [open, setOpen] = useState(false);
  const [currentStories, setCurrentStories] = useState<Story[]>([]);

  const { stories, seen, addToSeen } = useStories();

  const handleOpen = (id: string, stories: Story[]) => {
    addToSeen(id);
    setCurrentStories(stories);
    setOpen(true);
  };

  const onStoryChange = () => {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }
  };

  return (
    stories != undefined && (
      <div className="px-4 pt-5">
        <div className="flex gap-6 overflow-x-auto no-scrollbar p-2">
          {stories.map((story, index) => (
            <button
              key={index}
              className="flex flex-col items-center"
              onClick={() => handleOpen(story.id, story.stories)}
            >
              <StoryButton
                background={story.src}
                title={story.title}
                seen={seen.includes(story.id)}
                icon={story.icon as IconVariant}
              />
            </button>
          ))}
        </div>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Content className="fixed pb-16 inset-0 z-20 flex items-center justify-center">
              <StoryViewer
                fade
                stories={currentStories}
                onNext={onStoryChange}
                onPrev={onStoryChange}
                onComplete={() => setOpen(false)}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    )
  );
};
