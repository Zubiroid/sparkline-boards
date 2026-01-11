import { useEffect } from 'react';

interface UnsavedChangesWarningProps {
  hasUnsavedChanges: boolean;
}

export function UnsavedChangesWarning({ hasUnsavedChanges }: UnsavedChangesWarningProps) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return null;
}

export function UnsavedChangesBanner({ hasUnsavedChanges, onSave, onDiscard }: {
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onDiscard: () => void;
}) {
  if (!hasUnsavedChanges) return null;

  return (
    <div 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-warning-light border border-warning/30 rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 animate-fade-up"
      role="alert"
    >
      <div className="flex items-center gap-2 text-warning">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-medium">You have unsaved changes</span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={onDiscard}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Discard
        </button>
        <button 
          onClick={onSave}
          className="btn btn-sm bg-warning text-white hover:bg-warning/90"
        >
          Save Now
        </button>
      </div>
    </div>
  );
}