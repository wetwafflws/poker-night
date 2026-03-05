import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function ExportGameModal({ players, onClose, t }) {
  const [copied, setCopied] = useState(false);

  const gameState = players
    .map(p => `${p.name}:${p.stack}`)
    .join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(gameState);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal title="Export Game State" onClose={onClose} t={t}>
      <div style={{marginBottom: 16}}>
        <div style={{color: t.textMuted, fontSize: 13, marginBottom: 8}}>
          Copy the text below to save your game. You can import it in the main menu to resume.
        </div>
        <textarea
          readOnly
          value={gameState}
          style={{
            width: '100%',
            minHeight: 120,
            padding: 12,
            background: t.surface2,
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            color: t.text,
            fontFamily: 'monospace',
            fontSize: 13,
            fontWeight: 600,
            resize: 'none',
            cursor: 'default'
          }}
        />
      </div>
      <Button 
        onClick={handleCopy}
        bg={copied ? t.green : t.accent}
        style={{width: '100%', padding: '12px', fontSize: 15, fontWeight: 700, borderRadius: 12}}
      >
        {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
      </Button>
    </Modal>
  );
}
