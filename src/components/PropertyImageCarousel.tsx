import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface PropertyImageCarouselProps {
  images: string[];
}

const PropertyImageCarousel = ({ images }: PropertyImageCarouselProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Fallback images if none provided
  const fallbackImages = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"
  ];

  const displayImages = images && images.length > 0 ? images : fallbackImages;

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImage(index);
  };

  // Keyboard navigation while fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen, displayImages.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0]?.clientX ?? null);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
    const threshold = 40; // pixels
    if (dx > threshold) {
      prevImage();
    } else if (dx < -threshold) {
      nextImage();
    }
    setTouchStartX(null);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <img
          src={displayImages[currentImage]}
          alt={`Property image ${currentImage + 1}`}
          className="w-full h-96 object-cover rounded-lg"
        />
        
        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Zoom Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsFullscreen(true)}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
            {currentImage + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {displayImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImage
                  ? "border-primary shadow-lg"
                  : "border-transparent hover:border-muted-foreground"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <img
              src={displayImages[currentImage]}
              alt={`Property image ${currentImage + 1}`}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
            />
            
            {/* Close Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white"
              onClick={() => setIsFullscreen(false)}
            >
              ×
            </Button>

            {/* Navigation in Fullscreen */}
            {displayImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImageCarousel;