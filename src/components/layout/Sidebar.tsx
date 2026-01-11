import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../hooks/useSettings';

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  collapsed: boolean;
}

function NavItem({ to, icon, label, collapsed }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? label : undefined}
    >
      <span className="w-5 h-5 flex items-center justify-center shrink-0" aria-hidden="true">
        {icon}
      </span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

interface SidebarProps {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const { settings, toggleSidebar } = useSettings();
  const { sidebarCollapsed } = settings;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-background-subtle border-r border-border flex flex-col transition-all duration-slow z-40
          ${sidebarCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className={`h-16 flex items-center border-b border-border ${sidebarCollapsed ? 'justify-center px-2' : 'px-4'}`}>
          <Link to="/app" className="flex items-center gap-2" aria-label="ContentOps Home">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-foreground">
                <path d="M12 3v18M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <span className="font-semibold text-text-primary">ContentOps</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-4 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
          <ul className="space-y-1" role="list">
            <li>
              <NavItem
                to="/app"
                collapsed={sidebarCollapsed}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="9" rx="1" />
                    <rect x="14" y="3" width="7" height="5" rx="1" />
                    <rect x="14" y="12" width="7" height="9" rx="1" />
                    <rect x="3" y="16" width="7" height="5" rx="1" />
                  </svg>
                }
                label="Dashboard"
              />
            </li>
            <li>
              <NavItem
                to="/app/board"
                collapsed={sidebarCollapsed}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="5" height="18" rx="1" />
                    <rect x="10" y="3" width="5" height="12" rx="1" />
                    <rect x="17" y="3" width="5" height="7" rx="1" />
                  </svg>
                }
                label="Kanban Board"
              />
            </li>
            <li>
              <NavItem
                to="/app/calendar"
                collapsed={sidebarCollapsed}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                }
                label="Calendar"
              />
            </li>
            <li>
              <NavItem
                to="/app/editor"
                collapsed={sidebarCollapsed}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                }
                label="New Draft"
              />
            </li>
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className={`border-t border-border py-4 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
          <ul className="space-y-1" role="list">
            <li>
              <NavItem
                to="/app/settings"
                collapsed={sidebarCollapsed}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                }
                label="Settings"
              />
            </li>
          </ul>

          {/* Collapse Button */}
          <button
            onClick={toggleSidebar}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors ${sidebarCollapsed ? 'px-0' : 'px-3'}`}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform duration-slow ${sidebarCollapsed ? 'rotate-180' : ''}`}
            >
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-slow ${sidebarCollapsed ? 'ml-sidebar-collapsed' : 'ml-sidebar'}`}
      >
        {children}
      </main>
    </div>
  );
}
