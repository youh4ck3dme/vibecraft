import React, { useState } from 'react';
import { Eye, Code, Copy, Download, Check } from 'lucide-react';

interface PreviewAreaProps {
  code: string;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({ code }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (code) {
      const blob = new Blob([code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vibecraft-application.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="preview-panel" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-secondary)',
      borderLeft: '1px solid var(--border-color)',
      height: '100%'
    }}>
      {/* Top Header & Tabs */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-secondary)',
        flexShrink: 0
      }}>
        {/* Tab Controls */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setActiveTab('preview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              background: activeTab === 'preview' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === 'preview' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Eye size={14} />
            Live Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              background: activeTab === 'code' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === 'code' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Code size={14} />
            Code View
          </button>
        </div>

        {/* Action Controls */}
        {code && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCopy}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11.5px', gap: '6px' }}
            >
              {copied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="btn btn-primary"
              style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11.5px', gap: '6px', color: '#000' }}
            >
              <Download size={13} />
              Download
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {!code ? (
          /* Empty Code State */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            padding: '24px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              color: 'var(--text-muted)'
            }}>
              <Eye size={20} />
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Preview Monitor
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '240px', lineHeight: '1.4' }}>
              Your generated app layout will render interactively in this section.
            </p>
          </div>
        ) : activeTab === 'preview' ? (
          /* Live Sandbox Preview (Iframe) */
          <iframe
            srcDoc={code}
            title="VibeCraft Sandbox Preview"
            sandbox="allow-scripts allow-modals"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#fff' // White canvas context inside preview so mock templates are visible
            }}
          />
        ) : (
          /* Syntax Highlighter / Code view */
          <div style={{
            height: '100%',
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: 'var(--bg-primary)'
          }}>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: '#d4d4d8',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
