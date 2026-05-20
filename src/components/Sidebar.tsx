import React from 'react';
import { Plus, Settings, Sparkles, Folder, Globe, Wrench, Gamepad2, LayoutDashboard } from 'lucide-react';
import { promptCategories, promptLibrary } from '../utils/promptLibrary';
import type { PromptItem } from '../utils/promptLibrary';

interface SidebarProps {
  currentCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectPrompt: (prompt: PromptItem) => void;
  onOpenSettings: () => void;
  onNewChat: () => void;
  hasApiKey: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentCategory,
  onSelectCategory,
  onSelectPrompt,
  onOpenSettings,
  onNewChat,
  hasApiKey
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'User': return <Folder size={16} />;
      case 'Globe': return <Globe size={16} />;
      case 'Wrench': return <Wrench size={16} />;
      case 'Gamepad2': return <Gamepad2 size={16} />;
      case 'LayoutDashboard': return <LayoutDashboard size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  const filteredPrompts = promptLibrary.filter(
    item => item.category === currentCategory
  );

  return (
    <div className="sidebar-panel" style={{
      width: '260px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-magenta))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
        }}>
          <Sparkles size={16} color="#000" />
        </div>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.5px' }}>
            Vibe<span className="text-gradient">Craft</span>
          </h1>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>OPEN SOURCE BUILDER</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ padding: '12px 16px' }}>
        <button className="btn btn-primary" onClick={onNewChat} style={{ width: '100%', padding: '11px 16px' }}>
          <Plus size={16} />
          New Application
        </button>
      </div>

      {/* Category List */}
      <div style={{ padding: '8px 16px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
          Categories
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {promptCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: currentCategory === cat.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                color: currentCategory === cat.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: currentCategory === cat.id ? 600 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span style={{ color: currentCategory === cat.id ? 'var(--accent-cyan)' : 'inherit' }}>
                {getIcon(cat.name === 'Portfolios & Resumes' ? 'User' : cat.name === 'Landing Pages' ? 'Globe' : cat.name === 'Utility Tools' ? 'Wrench' : cat.name === 'Interactive Games' ? 'Gamepad2' : 'LayoutDashboard')}
              </span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Preloaded Blueprints */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Starter Templates
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredPrompts.map(prompt => (
            <div
              key={prompt.id}
              onClick={() => onSelectPrompt(prompt)}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                border: '1px solid var(--border-color)'
              }}
            >
              <h3 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '2px', color: 'var(--text-primary)' }}>
                {prompt.title}
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>
                {prompt.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Settings */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: hasApiKey ? '#10b981' : '#f59e0b' }}></div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {hasApiKey ? 'AI Online Mode' : 'Demo Offline Mode'}
          </span>
        </div>
        <button
          onClick={onOpenSettings}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};
