import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Preset } from '@/hooks/usePresets';

interface Props {
  presets: Preset[];
  onLoad: (preset: Preset) => void;
  onSave: (name: string) => void;
  onDelete: (index: number) => void;
}

export function PresetsManager({ presets, onLoad, onSave, onDelete }: Props) {
  const { t } = useTranslation();
  const [showInput, setShowInput] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleSave = () => {
    if (presetName.trim()) {
      onSave(presetName);
      setPresetName('');
      setShowInput(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">💾</span> Presets
      </h2>

      {presets.length === 0 ? (
        <p className="card-hint">Keine Presets gespeichert</p>
      ) : (
        <div style={{ marginBottom: '12px' }}>
          {presets.map((preset, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                background: 'var(--surface2)',
                borderRadius: '6px',
                marginBottom: '6px',
              }}
            >
              <div>
                <strong>{preset.name}</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text2)', margin: '2px 0 0 0' }}>
                  {preset.consumption}Ah • {new Date(preset.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => onLoad(preset)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    background: 'var(--blue)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Load
                </button>
                <button
                  onClick={() => onDelete(idx)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    background: 'var(--red)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          style={{
            width: '100%',
            padding: '8px',
            background: 'var(--accent)',
            color: '#1a1a2e',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          + Neues Preset speichern
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            placeholder="Preset Name..."
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            style={{
              flex: 1,
              padding: '8px',
              background: 'var(--surface3)',
              color: 'var(--text)',
              border: '1px solid var(--surface3)',
              borderRadius: '4px',
            }}
          />
          <button
            onClick={handleSave}
            style={{
              padding: '8px 12px',
              background: 'var(--green)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
          <button
            onClick={() => setShowInput(false)}
            style={{
              padding: '8px 12px',
              background: 'var(--surface3)',
              color: 'var(--text)',
              border: '1px solid var(--surface3)',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
