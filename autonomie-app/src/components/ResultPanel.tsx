import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { SimulationResult } from '@/types';

interface Props {
  result: SimulationResult;
}

export function ResultPanel({ result }: Props) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawChart();
  });

  function drawChart() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = result.dailyResults;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = 200;
    const pad = { top: 20, right: 10, bottom: 30, left: 40 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;

    ctx.clearRect(0, 0, w, h);

    const maxBatt = Math.max(...data.map((d) => d.batteryStateAh));
    const maxY = Math.ceil(maxBatt / 10) * 10 || 10;

    ctx.strokeStyle = '#333350';
    ctx.lineWidth = 0.5;
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#808098';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const y = pad.top + ch - (ch * i) / 4;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillText(((maxY * i) / 4).toFixed(0), pad.left - 4, y + 3);
    }

    ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(data.length / 6));
    const count = data.length - 1 || 1;
    for (let i = 0; i < data.length; i += step) {
      const x = pad.left + (cw * i) / count;
      const d = data[i].date;
      ctx.fillText(`${d.getDate()}.${d.getMonth() + 1}`, x, h - 6);
    }

    ctx.beginPath();
    ctx.strokeStyle = '#f0c040';
    ctx.lineWidth = 2;
    data.forEach((d, i) => {
      const x = pad.left + (cw * i) / count;
      const y = pad.top + ch - (ch * d.batteryStateAh) / maxY;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
    gradient.addColorStop(0, 'rgba(240,192,64,0.3)');
    gradient.addColorStop(1, 'rgba(240,192,64,0)');
    ctx.lineTo(pad.left + cw, pad.top + ch);
    ctx.lineTo(pad.left, pad.top + ch);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.fillStyle = '#808098';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(t('results.ah'), pad.left, pad.top - 6);
  }

  const solarPct = Math.min(
    100,
    (result.averageSolarYieldAh / (result.dailyResults[0]?.consumptionAh || 1)) * 100,
  );
  const barColor =
    solarPct >= 100
      ? 'var(--green)'
      : solarPct >= 60
        ? 'var(--accent)'
        : 'var(--red)';

  return (
    <div className="result visible">
      <div className="result-header">
        <div
          className="days"
          style={{
            color: result.isFullyAutonomous
              ? 'var(--green)'
              : result.autonomyDays > 3
                ? 'var(--accent)'
                : 'var(--red)',
          }}
        >
          {result.autonomyDays}
        </div>
        <div className="days-label">
          {result.isFullyAutonomous ? (
            <>
              {t('results.days')}{' '}
              <span style={{ color: 'var(--green)' }}>(gesamter Zeitraum)</span>
            </>
          ) : (
            `von ${result.totalDays} ${t('results.days')}`
          )}
        </div>
        {!result.isFullyAutonomous && result.averageBalanceAh < 0 && (
          <div style={{ fontSize: '12px', color: '#999', marginTop: '8px', fontStyle: 'italic' }}>
            Wegen beschleunigter Entladung und weniger Sonneneinstrahlung werden tägliche Verluste größer.
            Ein weiterer Tag ist nicht mehr möglich.
          </div>
        )}
      </div>

      <div className="detail-grid">
        <div className="detail-item">
          <div className="val">{result.averageSolarYieldAh.toFixed(1)}</div>
          <div className="lbl">{t('results.dailyGeneration')} (Ah)</div>
        </div>
        <div className="detail-item">
          <div className="val">
            {result.dailyResults[0]?.consumptionAh.toFixed(1) ?? '--'}
          </div>
          <div className="lbl">Verbrauch/Tag (Ah)</div>
        </div>
        <div className="detail-item">
          <div className="val">{result.usableBatteryAh.toFixed(0)}</div>
          <div className="lbl">Nutzbare Batterie (Ah)</div>
        </div>
        <div className="detail-item">
          <div className="val" style={{
            color: result.averageBalanceAh >= 0 ? 'var(--green)' : 'var(--red)',
          }}>
            {result.averageBalanceAh >= 0 ? '+' : ''}
            {result.averageBalanceAh.toFixed(1)}
          </div>
          <div className="lbl">Tagesbilanz (Ah)</div>
        </div>
      </div>

      <div className="bar">
        <div className="bar-label">
          <span>Solar vs. Verbrauch / Solar vs. Consumption</span>
          <span>{solarPct.toFixed(0)}%</span>
        </div>
        <div className="bar-track">
          <div
            className="bar-fill"
            style={{ width: `${solarPct}%`, background: barColor }}
          />
        </div>
      </div>

      <div className="chart-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: 200 }} />
      </div>

      {!result.isFullyAutonomous && result.averageBalanceAh < 0 && (
        <div className="warning">
          Tägliches Defizit von {Math.abs(result.averageBalanceAh).toFixed(1)} Ah.
          Die Batterie ist nach {result.autonomyDays} Tag(en) leer.
          Verbrauch senken oder Solarleistung erhöhen.
        </div>
      )}
    </div>
  );
}
