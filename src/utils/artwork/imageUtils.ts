
/**
 * Detects the orientation of an image
 * @param imageUrl URL of the image to analyze
 * @returns Promise resolving to 'portrait', 'landscape', or 'square'
 */
export const detectImageOrientation = async (
  imageUrl: string | File
): Promise<'portrait' | 'landscape' | 'square'> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const { width, height } = img;
      const ratio = width / height;
      
      // Use a small threshold to account for negligible differences
      if (Math.abs(ratio - 1) < 0.05) {
        resolve('square');
      } else if (ratio > 1) {
        resolve('landscape');
      } else {
        resolve('portrait');
      }
    };
    
    img.onerror = () => {
      console.error('Error loading image for orientation detection');
      // Default to portrait if we can't load the image
      resolve('portrait');
    };
    
    // Handle both string URLs and File objects
    if (typeof imageUrl === 'string') {
      img.src = imageUrl;
    } else {
      img.src = URL.createObjectURL(imageUrl);
    }
  });
};

/**
 * Gets the appropriate aspect ratio class based on orientation
 * @param orientation The orientation of the image
 * @returns Tailwind aspect ratio class
 */
export const getAspectRatioClass = (orientation?: 'portrait' | 'landscape' | 'square'): string => {
  switch (orientation) {
    case 'landscape':
      return 'aspect-[4/3]';
    case 'square':
      return 'aspect-square';
    case 'portrait':
    default:
      return 'aspect-[3/4]';
  }
};
