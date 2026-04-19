import React from 'react';
import { FileText, ExternalLink, Download, BookOpen } from 'lucide-react';

interface Resource {
  title: string;
  type: 'Link' | 'PDF' | 'Guide' | 'Video';
  url: string;
}

interface ResourcesProps {
  resources: string[] | Resource[];
}

const Resources: React.FC<ResourcesProps> = ({ resources }) => {
  const renderIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <Download size={18} />;
      case 'Guide': return <BookOpen size={18} />;
      case 'Link': return <ExternalLink size={18} />;
      default: return <FileText size={18} />;
    }
  };

  return (
    <div className="resources-section" id="resources">
      <div className="section-card">
        <h2>Learning & Resources</h2>
        <div className="resources-list-grid">
          {resources && resources.length > 0 ? (
            resources.map((resource, i) => {
              const isString = typeof resource === 'string';
              const title = isString ? resource : resource.title;
              const type = isString ? 'Guide' : resource.type;
              const url = isString ? '#' : resource.url;

              return (
                <a key={i} href={url} className="resource-link-card" target="_blank" rel="noopener noreferrer">
                  <div className="resource-icon-wrapper">
                    {renderIcon(type)}
                  </div>
                  <div className="resource-info">
                    <h3>{title}</h3>
                    <span>{type}</span>
                  </div>
                  <ExternalLink size={14} className="external-icon" />
                </a>
              );
            })
          ) : (
            <p className="no-data-msg">Resources will be uploaded soon.</p>
          )}
        </div>
      </div>
      
      <div className="section-card highlight-card">
        <h3>Need Help?</h3>
        <p>Join our Discord server to connect with mentors and other participants.</p>
        <button className="discord-btn">
          Join Discord Community
        </button>
      </div>
    </div>
  );
};

export default Resources;
