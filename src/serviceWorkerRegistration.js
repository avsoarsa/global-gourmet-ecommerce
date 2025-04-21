// Service Worker Registration

// Check if service workers are supported
const isServiceWorkerSupported = 'serviceWorker' in navigator;

// Register the service worker
export const register = () => {
  if (isServiceWorkerSupported && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';
      
      registerValidSW(swUrl);
      
      // Add beforeinstallprompt event to handle PWA installation
      handleInstallPrompt();
    });
  }
};

// Register the service worker
const registerValidSW = (swUrl) => {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log('New content is available and will be used when all tabs for this page are closed.');
              
              // Show update notification to the user
              showUpdateNotification();
            } else {
              // At this point, everything has been precached.
              console.log('Content is cached for offline use.');
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
};

// Unregister the service worker
export const unregister = () => {
  if (isServiceWorkerSupported) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
};

// Show update notification
const showUpdateNotification = () => {
  // Create a notification element
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-0 left-0 right-0 bg-green-600 text-white p-4 flex justify-between items-center z-50';
  notification.innerHTML = `
    <div>
      <strong>New version available!</strong> 
      <span class="ml-2">Refresh to update.</span>
    </div>
    <div>
      <button id="update-app" class="bg-white text-green-600 px-4 py-1 rounded-md mr-2">
        Update
      </button>
      <button id="dismiss-update" class="text-white border border-white px-4 py-1 rounded-md">
        Later
      </button>
    </div>
  `;
  
  // Add the notification to the DOM
  document.body.appendChild(notification);
  
  // Add event listeners
  document.getElementById('update-app').addEventListener('click', () => {
    window.location.reload();
  });
  
  document.getElementById('dismiss-update').addEventListener('click', () => {
    notification.remove();
  });
};

// Handle PWA installation prompt
const handleInstallPrompt = () => {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show the install button
    showInstallButton(deferredPrompt);
  });
};

// Show install button
const showInstallButton = (deferredPrompt) => {
  // Create the install button if it doesn't exist
  if (!document.getElementById('pwa-install-button')) {
    const installButton = document.createElement('div');
    installButton.id = 'pwa-install-button';
    installButton.className = 'fixed bottom-4 right-4 bg-white shadow-lg rounded-full p-4 cursor-pointer z-40';
    installButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    `;
    
    // Add tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute bottom-full right-0 mb-2 bg-gray-800 text-white text-sm rounded px-2 py-1 hidden group-hover:block';
    tooltip.textContent = 'Install App';
    installButton.appendChild(tooltip);
    
    // Add event listener
    installButton.addEventListener('click', async () => {
      // Hide the button
      installButton.style.display = 'none';
      
      // Show the prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      
      // We've used the prompt, and can't use it again, throw it away
      deferredPrompt = null;
    });
    
    // Add the button to the DOM
    document.body.appendChild(installButton);
  }
};
