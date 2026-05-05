import React from 'react';
import RmcCarousel, {
  CarouselProps as RmcCarouselProps
} from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface CustomProps {
  gutter?: number;
}

export type CarouselProps = Omit<RmcCarouselProps, 'responsive'> & CustomProps;

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = false,
  infinite = false,
  arrows = false,
  rtl = false,
  gutter = 62,
  className
}) => {
  const responsive = {
    mobile: {
      breakpoint: { max: 5000, min: 0 },
      items: 1,
      partialVisibilityGutter: gutter
    }
  };

  return (
    <RmcCarousel
      autoPlay={autoPlay}
      infinite={infinite}
      responsive={responsive}
      arrows={arrows}
      rtl={rtl}
      partialVisible
      className={className}
    >
      {children}
    </RmcCarousel>
  );
};
