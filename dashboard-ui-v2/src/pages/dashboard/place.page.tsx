import { useCallback, useEffect, useState } from 'react';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

import { Place, Tag } from '@/interfaces/place.interface';
import { Plus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TagComponent } from '@/components/tag';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/shared/stores/places.store';

import { uploadImageByFile, uploadImageByUrl } from '@/shared/api/parse.api';
import { FileUploader } from 'react-drag-drop-files';
import { Link2Icon } from '@radix-ui/react-icons';
import { LocationPicker } from '@/components/location-picker';
import toast from 'react-hot-toast';

export const PlacePage = ({
  inputPlace,
  onSave,
}: {
  inputPlace: Place;
  onSave: (place: Place) => void;
}) => {
  const [place, setPlace] = useState<Place>(inputPlace);

  useEffect(() => {
    if (inputPlace.title !== '') setPlace(inputPlace);
  }, [inputPlace]);

  const handleFileDrop = async (file: File) => {
    const newPhotoUrl = await uploadImageByFile(file);
    if (newPhotoUrl.url) {
      setPlace({
        ...place,
        images: [...place.images, newPhotoUrl.url],
      });
    }
  };

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (const item of items) {
          if (item.kind === 'file' && item.type.startsWith('image/')) {
            toast.success('Uploading photo.');
            const file = item.getAsFile();
            if (file) {
              await handleFileDrop(file);
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const { tags } = useDashboardStore();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (!place) return;

      if (name === 'lat' || name === 'lon') {
        const newLocation = {
          ...place.location,
          [name]: value,
        };
        setPlace({ ...place, location: newLocation });
      } else {
        setPlace({ ...place, [name]: value });
      }
    },
    [place]
  );

  const handleAddPhoto = async () => {
    if (!place) return;
    const rawPhotoUrl = prompt('Enter the URL of the new photo:');
    if (rawPhotoUrl) {
      const newPhotoUrl = await uploadImageByUrl(rawPhotoUrl);
      if (newPhotoUrl.url) {
        setPlace({
          ...place,
          images: [...place.images, newPhotoUrl.url],
        });
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    if (!place) return;
    const newImages = place.images.filter((_, i) => i !== index);
    setPlace({ ...place, images: newImages });
  };

  const toggleTag = (tag: Tag) => {
    const isTagSelected = place.tags.some((t) => t.id === tag.id);
    const updatedTags = isTagSelected
      ? place.tags.filter((t) => t.id !== tag.id)
      : [...place.tags, tag];
    handleTagChange(updatedTags);
  };

  const handleTagChange = (updatedTags: Tag[]) => {
    setPlace((prev) => ({
      ...prev,
      tags: updatedTags,
    }));
  };

  const handleSave = useCallback(() => {
    place.location.lon = Number(place.location.lon);
    place.location.lat = Number(place.location.lat);
    place.priceAvg = Number(place.priceAvg);
    onSave(place);
  }, [place, onSave]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(place.images);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);

    setPlace((prev) => ({ ...prev, images: reorderedImages }));
  };

  return place !== null ? (
    <form className='p-5 flex gap-5 flex-col w-full overflow-scroll no-scrollbar'>
      <div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='images' direction='horizontal' type='image'>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className='whitespace-nowrap w-full no-scrollbar space-x-5 overflow-y-scroll text-primary'
              >
                {place.images.map((img, index) => (
                  <Draggable
                    key={`${index}_picture`}
                    draggableId={`${index}_picture`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className='inline-block group aspect-[21/30] bg-secondary relative rounded-xl overflow-hidden h-[300px]'
                      >
                        <img
                          className='h-full w-full object-cover'
                          src={img}
                          alt='Place'
                        />
                        <div
                          className='cursor-pointer h-6 w-6 p-1 group-hover:flex hidden justify-center items-center absolute bottom-2 right-2 bg-background rounded-full'
                          onClick={() => handleRemovePhoto(index)}
                        >
                          <X />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <div className='inline-block group bg-secondary rounded-xl overflow-hidden h-[300px] cursor-pointer relative'>
                  <FileUploader
                    dropMessageStyle={{
                      background: 'hsl(var(--secondary))',
                    }}
                    handleChange={handleFileDrop}
                    name='file'
                    types={['PNG', 'JPG', 'JPEG']}
                    hoverTitle='Drop here'
                  >
                    <div className='flex items-center justify-center h-full w-full aspect-[21/30]'>
                      <Plus className='text-primary' />
                    </div>
                  </FileUploader>
                  <div
                    className='cursor-pointer z-20 h-6 w-6 p-1 group-hover:flex hidden justify-center items-center absolute bottom-3 right-3 bg-background rounded-full'
                    onClick={handleAddPhoto}
                  >
                    <Link2Icon />
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className='h-full pl-1 w-full space-y-4'>
        <div className='flex gap-5'>
          <div className='w-full space-y-4'>
            <div>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                name='title'
                value={place.title}
                onChange={handleInputChange}
              />
            </div>
            <div className='flex w-full gap-5'>
              <div className='w-full'>
                <Label htmlFor='address'>Address</Label>
                <Input
                  id='address'
                  name='address'
                  value={place.address}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor='priceAvg'>Avg Price</Label>
                <Input
                  id='priceAvg'
                  name='priceAvg'
                  className='w-[100px]'
                  value={place.priceAvg}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                maxLength={300}
                id='description'
                name='description'
                value={place.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className='w-[80%]'>
            <LocationPicker
              className='h-full w-full flex flex-col gap-2'
              place={place}
              setPlace={setPlace}
            />
          </div>
        </div>
        <div>
          <Label htmlFor='tags'>Tags</Label>
          <div className='flex pt-2 divide-black'>
            <div className='flex flex-wrap gap-5 border-r pr-5 border-r-secondary'>
              {place.tags.map((tag, index) => (
                <TagComponent
                  key={`${tag.id}_${index}_tag`}
                  onClick={() => {
                    toggleTag(tag);
                  }}
                  tag={tag}
                />
              ))}
            </div>
            <div className='flex flex-wrap gap-5 pl-5'>
              {tags
                .filter((x) => !place.tags.flatMap((y) => y.id).includes(x.id))
                .map((tag, index) => (
                  <TagComponent
                    key={`${tag.id}_${index}_tag`}
                    onClick={() => {
                      toggleTag(tag);
                    }}
                    tag={tag}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-end'>
        <Button type='button' onClick={handleSave}>
          Save
        </Button>
      </div>
    </form>
  ) : (
    <></>
  );
};
