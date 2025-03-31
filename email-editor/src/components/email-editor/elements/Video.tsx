import React, { useState, useEffect, useRef } from 'react';
import { VideoElement } from './';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

interface VideoElementComponentProps {
  element: VideoElement;
  isSelected: boolean;
  onClick: () => void;
  onUpdate?: (element: VideoElement) => void;
}

function getEmbedUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Handle YouTube URLs
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = '';
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || '';
      } else {
        videoId = urlObj.pathname.slice(1);
      }
      if (!videoId) return url;
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Handle Vimeo URLs
    if (urlObj.hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/').pop() || '';
      if (!videoId) return url;
      return `https://player.vimeo.com/video/${videoId}`;
    }

    // Return original URL if no special handling needed
    return url;
  } catch (error) {
    console.error('Error parsing video URL:', error);
    return url;
  }
}

function getThumbnailUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Handle YouTube URLs
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = '';
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || '';
      } else {
        videoId = urlObj.pathname.slice(1);
      }
      if (!videoId) return null;
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    
    // For Vimeo, we can't get the thumbnail directly without an API call
    // Return null and let the component show a placeholder
    return null;
  } catch (error) {
    console.error('Error getting thumbnail URL:', error);
    return null;
  }
}

export const VideoElementComponent: React.FC<VideoElementComponentProps> = ({
  element,
  isSelected,
  onClick,
  onUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [safeEmbedUrl, setSafeEmbedUrl] = useState(getEmbedUrl(element.settings.embedUrl));
  const [thumbnailUrl, setThumbnailUrl] = useState(element.settings.thumbnailUrl);
  const [dimensions, setDimensions] = useState({ width: element.width, height: element.height });

  // Handle auto width and height
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const parentWidth = container.parentElement?.clientWidth || 600;
    let newWidth = element.width;
    let newHeight = element.height;

    // Handle auto width
    if (element.settings.width === 'auto') {
      newWidth = Math.min(parentWidth, 600); // Max width of 600px
    } else if (typeof element.settings.width === 'number') {
      newWidth = element.settings.width;
    }

    // Handle auto height
    if (element.settings.height === 'auto') {
      // Use 16:9 aspect ratio for videos
      newHeight = Math.round(newWidth * (9/16));
    } else if (typeof element.settings.height === 'number') {
      newHeight = element.settings.height;
    }

    // Update dimensions if they've changed
    if (newWidth !== dimensions.width || newHeight !== dimensions.height) {
      setDimensions({ width: newWidth, height: newHeight });
      
      // Update the element if in edit mode
      if (onUpdate) {
        onUpdate({
          ...element,
          width: newWidth,
          height: newHeight
        });
      }
    }
  }, [element.settings.width, element.settings.height, containerRef.current]);

  useEffect(() => {
    const newEmbedUrl = getEmbedUrl(element.settings.embedUrl);
    setSafeEmbedUrl(newEmbedUrl);

    // Update thumbnail URL if needed
    const newThumbnailUrl = getThumbnailUrl(element.settings.embedUrl);
    if (newThumbnailUrl && (!element.settings.thumbnailUrl || element.settings.thumbnailUrl.includes('youtube.com'))) {
      setThumbnailUrl(newThumbnailUrl);
      if (onUpdate) {
        onUpdate({
          ...element,
          settings: {
            ...element.settings,
            thumbnailUrl: newThumbnailUrl
          }
        });
      }
    }
  }, [element.settings.embedUrl]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative border rounded-md overflow-hidden",
        isSelected && "ring-2 ring-primary ring-offset-2",
        !isSelected && "border-transparent hover:border-gray-200"
      )}
      onClick={onClick}
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      {/* Preview mode: show iframe */}
      {!onUpdate && (
        <div className="relative w-full h-full">
          <iframe
            src={safeEmbedUrl}
            title={element.settings.altText || 'Video embed'}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Edit mode: show thumbnail with overlay */}
      {onUpdate && (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-black/5">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={element.settings.altText || 'Video thumbnail'}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <Play className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity hover:bg-black/40">
              <div className="text-white text-center p-4">
                <Play className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Click to edit video settings</p>
                <p className="text-xs text-white/70 mt-1">{element.settings.embedUrl}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoElementComponent;
