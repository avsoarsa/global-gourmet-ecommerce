import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faPinterestP, 
  faWhatsapp,
  faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';
import { 
  faShareNodes, 
  faEnvelope, 
  faLink, 
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const SocialShare = ({ 
  url = window.location.href, 
  title = document.title, 
  description = '', 
  image = '',
  compact = false,
  vertical = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedImage = encodeURIComponent(image);
  
  const shareLinks = [
    {
      name: 'Facebook',
      icon: faFacebookF,
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      name: 'Twitter',
      icon: faTwitter,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
    },
    {
      name: 'Pinterest',
      icon: faPinterestP,
      color: '#E60023',
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`
    },
    {
      name: 'WhatsApp',
      icon: faWhatsapp,
      color: '#25D366',
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`
    },
    {
      name: 'LinkedIn',
      icon: faLinkedinIn,
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      name: 'Email',
      icon: faEnvelope,
      color: '#D44638',
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
    }
  ];
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const handleShare = (shareUrl) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };
  
  // For compact mode, we'll show just the share button that opens a dropdown
  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Share"
        >
          <FontAwesomeIcon icon={faShareNodes} />
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            ></div>
            
            <div className={`absolute z-20 ${vertical ? 'left-0 top-10' : 'right-0 top-10'} bg-white rounded-lg shadow-xl p-3 w-64 border border-gray-200`}>
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Share</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                {shareLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleShare(link.url)}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label={`Share on ${link.name}`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                      style={{ backgroundColor: link.color }}
                    >
                      <FontAwesomeIcon icon={link.icon} className="text-white text-sm" />
                    </div>
                    <span className="text-xs text-gray-700">{link.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex items-center">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="form-input text-xs py-1 flex-grow"
                />
                <button
                  onClick={handleCopyLink}
                  className="ml-2 p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Copy link"
                >
                  <FontAwesomeIcon icon={copied ? faCheck : faLink} className={copied ? 'text-green-600' : 'text-gray-600'} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  
  // For full mode, we'll show all the share buttons inline
  return (
    <div className={`flex ${vertical ? 'flex-col space-y-2' : 'flex-row space-x-2'} items-center`}>
      {shareLinks.map((link) => (
        <button
          key={link.name}
          onClick={() => handleShare(link.url)}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
          style={{ backgroundColor: link.color }}
          aria-label={`Share on ${link.name}`}
        >
          <FontAwesomeIcon icon={link.icon} className="text-white" />
        </button>
      ))}
      
      <button
        onClick={handleCopyLink}
        className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-transform hover:scale-110 ${copied ? 'bg-green-500' : ''}`}
        aria-label="Copy link"
      >
        <FontAwesomeIcon icon={copied ? faCheck : faLink} className={copied ? 'text-white' : 'text-gray-700'} />
      </button>
    </div>
  );
};

export default SocialShare;
