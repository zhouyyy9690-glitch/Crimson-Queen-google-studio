/**
 * UI Theme and Responsive Constants
 * Use this file to manage sizes independently for Mobile and Desktop.
 */

export const UI_CONFIG = {
  // Common Breakpoints (Tailwind standard)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },

  // Header configuration
  header: {
    mobile: {
      height: 'h-16',
      fontSize: 'text-[8px]',
      gap: 'gap-2',
      iconSize: 'w-2.5 h-2.5',
      tracking: 'tracking-[0.15em]',
    },
    desktop: {
      height: 'h-24',
      fontSize: 'text-[10px]',
      gap: 'gap-4',
      iconSize: 'w-3 h-3',
      tracking: 'tracking-[0.2em]',
    }
  },

  // Footer configuration
  footer: {
    mobile: {
      gap: 'gap-3',
      fontSize: 'text-[7px]',
      padding: 'px-3 py-1.5',
      tracking: 'tracking-[0.2em]',
    },
    desktop: {
      gap: 'gap-8',
      fontSize: 'text-[10px]',
      padding: 'px-6 py-2',
      tracking: 'tracking-[0.4em]',
    }
  },

  // Notification Toast
  notification: {
    mobile: {
      top: 'top-4',
      inset: 'left-4 right-4',
      padding: 'px-4 py-2.5',
      fontSize: 'text-xs',
      radius: 'rounded-none', // Strip look
    },
    desktop: {
      top: 'top-8',
      inset: 'left-1/2 -translate-x-1/2',
      padding: 'px-8 py-4',
      fontSize: 'text-sm',
      radius: 'rounded-sm',
    }
  }
};
