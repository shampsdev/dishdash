import Stories from 'react-insta-stories';
import { Story } from 'react-insta-stories/dist/interfaces';
import React from 'react';
import { cn } from '@/lib/utils';

export type StoryData = Story & {
  title?: string;
  description?: string;
};

interface ProgressBarSettings {
  progressBarPosition: ProgressBarPosition;
  padding: number;
}

type ProgressBarPosition = 'top' | 'bottom';

interface StoryViewerProps {
  stories: StoryData[];
  fade?: boolean;
  loop?: boolean;
  className?: string;
  progressBarSettings?: ProgressBarSettings;
  onComplete?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  onComplete,
  onNext,
  onPrev,
  className,
  fade = false,
  loop = false,
  progressBarSettings = {
    progressBarPosition: 'bottom',
    padding: 25
  }
}) => {
  const customStories = stories.map((story) => ({
    ...story,
    content: () => (
      <div className="relative z-10 w-full h-full">
        {'url' in story && story.type !== 'video' ? (
          <img
            src={story.url}
            alt="story"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={story.url}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        )}

        {fade && (
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent z-10" />
        )}

        {fade && (
          <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black to-transparent z-10" />
        )}

        {(story.title || story.description) && (
          <div className="absolute bottom-14 left-4 right-4 z-20 text-white">
            {story.title && (
              <h2 className="text-xl font-medium mb-1">{story.title}</h2>
            )}
            {story.description && (
              <p className="text-[13px] font-medium text-secondary-foreground">
                {story.description}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }));

  const bottomProgressBarStyle = {
    position: 'absolute',
    bottom: progressBarSettings.padding,
    top: 'unset',
    padding: '12px',
    zIndex: 30,
    width: '100%'
  };

  const topProgressBarStyle = {
    position: 'absolute',
    top: progressBarSettings.padding,
    bottom: 'unset',
    padding: '12px',
    zIndex: 30,
    width: '100%'
  };

  const progressBarStyle =
    progressBarSettings.progressBarPosition == 'top'
      ? topProgressBarStyle
      : bottomProgressBarStyle;

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <Stories
        onNext={onNext}
        onPrevious={onPrev}
        loop={loop}
        stories={customStories}
        defaultInterval={3000}
        width="100%"
        height="100%"
        onAllStoriesEnd={onComplete}
        progressContainerStyles={progressBarStyle}
      />
    </div>
  );
};

export default StoryViewer;
