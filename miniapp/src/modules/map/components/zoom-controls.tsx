import { Minus, Plus } from 'lucide-react';

export const ZoomControls = ({
  zoomIn,
  zoomOut
}: {
  zoomIn: () => void;
  zoomOut: () => void;
}) => {
  return (
    <div className="absolute bottom-[50%] gap-2 translate-y-[50%] flex flex-col right-3 z-[1000]">
      <div
        className="flex active:opacity-75 transition justify-center cursor-pointer rounded-2xl items-center h-12 w-12 bg-[#B6B6B6]/20 backdrop-blur-sm"
        onClick={zoomIn}
      >
        <Plus className="h-8 w-8 text-white/70" />
      </div>
      <div
        className="flex active:opacity-75 justify-center cursor-pointer rounded-2xl items-center h-12 w-12 bg-[#B6B6B6]/20 backdrop-blur-sm"
        onClick={zoomOut}
      >
        <Minus className="h-8 w-8 text-white/70" />
      </div>
    </div>
  );
};
