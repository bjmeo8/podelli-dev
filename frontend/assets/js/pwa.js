// PWA Manager for Podelli
class PWAManager {
    constructor() {
      this.deferredPrompt = null;
      this.installBanner = null;
      this.init();
    }
  
    init() {
      // Register Service Worker
      this.registerServiceWorker();
      
      // Setup install prompt
      this.setupInstallPrompt();
      
      // Setup online/offline handlers
      this.setupConnectivityHandlers();
      
      // Detect PWA mode
      this.detectPWAMode();
    }
  
    registerServiceWorker() {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
              console.log('✅ Service Worker registered:', registration.scope);
              
              // Check for updates every 60 seconds
              setInterval(() => {
                registration.update();
              }, 60000);
            })
            .catch((error) => {
              console.log('❌ Service Worker registration failed:', error);
            });
        });
      }
    }
  
    setupInstallPrompt() {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        
        // Show custom install banner after 3 seconds
        setTimeout(() => {
          this.showInstallBanner();
        }, 3000);
      });
  
      // Track when app is installed
      window.addEventListener('appinstalled', (evt) => {
        console.log('🎉 App installed successfully');
        this.hideInstallBanner();
        this.deferredPrompt = null;
      });
    }
  
    showInstallBanner() {
      // Check if user already dismissed or app is installed
      if (this.isAppInstalled() || localStorage.getItem('installBannerDismissed') === 'true') {
        return;
      }
  
      // Get or create install banner
      this.installBanner = document.getElementById('installBanner');
      
      if (this.installBanner) {
        this.installBanner.style.display = 'block';
      } else {
        // Create banner if it doesn't exist
        this.createInstallBanner();
      }
    }
  
    createInstallBanner() {
      const banner = document.createElement('div');
      banner.id = 'installBanner';
      banner.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #1CB79A 0%, #159b83 100%);
        color: white;
        padding: 16px;
        z-index: 1000;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
        border-radius: 24px 24px 0 0;
        animation: slideUp 0.3s ease-out;
      `;
  
      banner.innerHTML = `
        <div class="max-w-lg mx-auto px-4 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="h-6 w-6" style="color: #1CB79A;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-sm">Installer Podelli</h4>
              <p class="text-xs opacity-90">Accédez plus rapidement à l'app</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button id="dismissInstallBtn" class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white" style="background: transparent; border: none; cursor: pointer;">
              Plus tard
            </button>
            <button id="installPWABtn" class="px-4 py-2 bg-white rounded-full text-sm font-bold hover:bg-white/90 transition-all" style="color: #1CB79A; border: none; cursor: pointer;">
              Installer
            </button>
          </div>
        </div>
      `;
  
      document.body.appendChild(banner);
      this.installBanner = banner;
  
      // Add event listeners
      document.getElementById('dismissInstallBtn')?.addEventListener('click', () => this.dismissInstallBanner());
      document.getElementById('installPWABtn')?.addEventListener('click', () => this.installPWA());
  
      // Add animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  
    hideInstallBanner() {
      if (this.installBanner) {
        this.installBanner.style.display = 'none';
      }
    }
  
    dismissInstallBanner() {
      this.hideInstallBanner();
      localStorage.setItem('installBannerDismissed', 'true');
    }
  
    installPWA() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('✅ User accepted the install prompt');
            this.hideInstallBanner();
          } else {
            console.log('❌ User dismissed the install prompt');
          }
          this.deferredPrompt = null;
        });
      }
    }
  
    isAppInstalled() {
      // Check if app is already installed
      return window.matchMedia('(display-mode: standalone)').matches ||
             window.navigator.standalone === true;
    }
  
    setupConnectivityHandlers() {
      window.addEventListener('online', () => {
        console.log('🟢 Back online');
        this.syncDataWhenOnline();
      });
  
      window.addEventListener('offline', () => {
        console.log('🔴 Gone offline');
        this.showOfflineIndicator();
      });
    }
  
    syncDataWhenOnline() {
      // Trigger background sync if needed
      if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          return registration.sync.register('sync-progress');
        }).catch((err) => {
          console.log('Background sync failed:', err);
        });
      }
    }
  
    showOfflineIndicator() {
      // You can implement a visual indicator here
      console.log('App is running offline');
    }
  
    detectPWAMode() {
      const isPWA = this.isAppInstalled();
      
      if (isPWA) {
        console.log('🚀 Running as installed PWA');
        document.body.classList.add('pwa-mode');
        
        // iOS Standalone Detection
        if (window.navigator.standalone === true) {
          console.log('🍎 Running as iOS standalone app');
          document.body.classList.add('ios-pwa');
        }
      }
    }
  
    // Public method to manually trigger install
    triggerInstall() {
      this.installPWA();
    }
  
    // Public method to check if app can be installed
    canInstall() {
      return this.deferredPrompt !== null;
    }
  }
  
  // Initialize PWA Manager
  const pwaManager = new PWAManager();
  
  // Expose globally for manual triggers
  window.pwaManager = pwaManager;
  
  // Legacy function names for backward compatibility
  window.installApp = () => pwaManager.triggerInstall();
  window.dismissInstallBanner = () => pwaManager.dismissInstallBanner();
  window.installPWA = () => pwaManager.installPWA();