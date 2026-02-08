export async function downloadPng(imageUrl: string, filename: string): Promise<void> {
  try {
    // For SVG URLs (like Dicebear), we need to convert to PNG
    if (imageUrl.includes('.svg') || imageUrl.includes('svg?')) {
      await downloadSvgAsPng(imageUrl, filename);
    } else {
      // Direct download for other image types
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}

async function downloadSvgAsPng(svgUrl: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob'));
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = svgUrl;
  });
}
