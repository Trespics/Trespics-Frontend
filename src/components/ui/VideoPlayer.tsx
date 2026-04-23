import React from 'react';

interface VideoPlayerProps {
  url: string;
  title?: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title = 'Video Player', className = '' }) => {
  const getEmbedUrl = (videoUrl: string) => {
    if (!videoUrl) return '';

    // YouTube regex patterns
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const ytMatch = videoUrl.match(ytRegex);

    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    // Vimeo regex patterns
    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/i;
    const vimeoMatch = videoUrl.match(vimeoRegex);

    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return videoUrl; // Return as is for other types (direct files)
  };

  const embedUrl = getEmbedUrl(url);
  const isEmbeddable = embedUrl.includes('youtube.com/embed/') || embedUrl.includes('player.vimeo.com/video/');
  
  // Check if it's a direct video or audio file
  const isVideoFile = url.match(/\.(mp4|webm|ogg)$/i) || url.includes('supabase.co/storage/v1/object/public/');
  const isAudioFile = url.match(/\.(mp3|wav|ogg)$/i);


  if (isEmbeddable) {
    return (
      <div className={`video-player-wrapper ${className}`} style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
        <iframe
          src={embedUrl}
          title={title}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  if (isVideoFile) {
    return (
      <video controls className={`video-player ${className}`} style={{ width: '100%', borderRadius: '8px' }}>
        <source src={url} type={`video/${url.split('.').pop()}`} />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (isAudioFile) {
    return (
      <div className={`audio-player-wrapper ${className}`} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
        <audio controls style={{ width: '100%' }}>
          <source src={url} type={`audio/${url.split('.').pop()}`} />
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  }

  // Fallback for unknown links - try to embed anyway or show a link
  return (
    <div className="video-player-fallback">
      <p>Unable to preview media. <a href={url} target="_blank" rel="noopener noreferrer">Open link directly</a></p>
    </div>
  );
};

export default VideoPlayer;
