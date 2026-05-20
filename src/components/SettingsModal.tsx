import React, { useState } from 'react';
import { X, Key, Shield, HelpCircle, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigurationChange: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onConfigurationChange }) => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('vibecraft_api_key') || '');
  const [model, setModel] = useState(() => localStorage.getItem('vibecraft_model') || 'gemini-2.5-flash');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('vibecraft_api_key', apiKey.trim());
    localStorage.setItem('vibecraft_model', model);
    onConfigurationChange();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClearKey = () => {
    localStorage.removeItem('vibecraft_api_key');
    setApiKey('');
    onConfigurationChange();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="glass-panel" style={{
        width: '90%',
        maxWidth: '450px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '20px', right: '20px',
          background: 'none', border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(0, 240, 255, 0.1)',
            padding: '10px',
            borderRadius: '10px',
            color: 'var(--accent-cyan)'
          }}>
            <Key size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Gemini AI Settings</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Configure API configurations for custom page builds</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Gemini API Key</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste AIzaSy... API key here"
              style={{ width: '100%', paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600
              }}
            >
              {showKey ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Shield size={12} /> Key stays in this browser storage and is sent only to Google Gemini API when online generation runs.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>AI Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} style={{ width: '100%' }}>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fastest, default)</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro (Most intelligent, high quality)</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fallback)</option>
          </select>
        </div>

        <div className="glass-panel" style={{
          padding: '12px 16px',
          fontSize: '11.5px',
          color: 'var(--text-secondary)',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start',
          lineHeight: '1.4'
        }}>
          <HelpCircle size={22} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
          <span>
            Don't have an API key? You can get a free one from the Google AI Studio. Without a key, VibeCraft will run in <strong>Offline Demo Mode</strong> utilizing built-in templates.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button onClick={handleClearKey} className="btn btn-secondary" style={{ padding: '10px 12px' }} title="Remove stored API key">
            <Trash2 size={16} />
          </button>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary" style={{ flex: 2 }}>
            {saved ? 'Saved!' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};
