import { useLocalStorage } from './useLocalStorage';
import { UserSettings, DEFAULT_WORKFLOW_STAGES } from '../types/content';

const SETTINGS_KEY = 'contentops_settings';

const defaultSettings: UserSettings = {
  sidebarCollapsed: false,
  defaultPlatform: 'blog',
  defaultPriority: 'medium',
  defaultTags: [],
  showCompletedItems: true,
  calendarView: 'month',
  uiDensity: 'comfortable',
  workflowStages: DEFAULT_WORKFLOW_STAGES,
  customTags: [],
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<UserSettings>(SETTINGS_KEY, defaultSettings);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const toggleSidebar = () => {
    setSettings(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const addCustomTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    if (normalizedTag && !settings.customTags.includes(normalizedTag)) {
      setSettings(prev => ({
        ...prev,
        customTags: [...prev.customTags, normalizedTag],
      }));
    }
  };

  const removeCustomTag = (tag: string) => {
    setSettings(prev => ({
      ...prev,
      customTags: prev.customTags.filter(t => t !== tag),
    }));
  };

  const updateWorkflowStage = (stageId: string, updates: Partial<{ label: string; wipLimit: number }>) => {
    setSettings(prev => ({
      ...prev,
      workflowStages: prev.workflowStages.map(stage =>
        stage.id === stageId ? { ...stage, ...updates } : stage
      ),
    }));
  };

  return {
    settings,
    updateSettings,
    toggleSidebar,
    resetSettings,
    addCustomTag,
    removeCustomTag,
    updateWorkflowStage,
  };
}
