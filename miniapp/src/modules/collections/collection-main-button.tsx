import { Button } from '@/components/ui/button';

interface CollectionMainButtonProps {
  onClick?: () => void;
}

export const CollectionMainButton = ({
  onClick
}: CollectionMainButtonProps) => {
  return (
    <>
      <div className="absolute z-10 bottom-10 right-0 left-0">
        <Button onClick={onClick} className="w-fit mx-auto">
          Свайпать
        </Button>
      </div>
      <div className="absolute pointer-events-none bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-black to-transparent z-0" />
    </>
  );
};
