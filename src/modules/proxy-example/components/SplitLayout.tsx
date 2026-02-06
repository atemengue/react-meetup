import { useState } from 'react';
import type { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface SplitLayoutProps {
  tabs: Tab[];
  statusBar: ReactNode;
}

export function SplitLayout({ tabs, statusBar }: SplitLayoutProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '');

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className="split-layout">
      {/* Status bar toujours visible */}
      <div className="split-status">{statusBar}</div>

      {/* Tabs mobile */}
      <div className="split-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`split-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile : tab actif seulement */}
      <div className="split-mobile">{activeContent}</div>

      {/* Desktop : toutes les colonnes visibles */}
      <div className="split-desktop">
        {tabs.map((tab) => (
          <div key={tab.id} className="split-column">
            <div className="split-column-header">{tab.label}</div>
            <div className="split-column-content">{tab.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
