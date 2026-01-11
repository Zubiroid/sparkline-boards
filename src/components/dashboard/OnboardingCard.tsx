import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { useContent } from '../../hooks/useContent';
import { loadSampleData } from '../../data/sampleData';

export function OnboardingCard() {
  const { addItem, stats } = useContent();

  const handleLoadSampleData = () => {
    if (stats.total === 0) {
      loadSampleData(addItem);
    }
  };

  return (
    <div className="card p-8 bg-gradient-to-br from-primary-light to-background border-primary/20 animate-fade-up">
      <div className="max-w-lg">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-foreground">
            <path d="M12 3v18M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="heading-2 mb-2">Welcome to ContentOps!</h2>
        <p className="text-text-secondary mb-6">
          Your content planning journey starts here. Create your first piece of content to get started with organizing your ideas, drafts, and publishing schedule.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/editor">
            <Button variant="primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Create First Content
            </Button>
          </Link>
          <Button variant="outline" onClick={handleLoadSampleData}>
            Load Sample Data
          </Button>
        </div>
      </div>
    </div>
  );
}
