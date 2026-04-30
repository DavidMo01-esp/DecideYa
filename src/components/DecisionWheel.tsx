import { useEffect, useRef, useState } from 'react';
import Button from './Button';

const wheelColors = [
  '#eb6b4a',
  '#efb44d',
  '#1c8fd6',
  '#1d6d63',
  '#405a7a',
  '#d98356',
];

interface DecisionWheelProps {
  description: string;
  emptyMessage: string;
  eyebrow?: string;
  options: string[];
  title: string;
}

const truncateOptionLabel = (option: string, maxLength: number) => {
  if (option.length <= maxLength) {
    return option;
  }

  return `${option.slice(0, maxLength - 3).trimEnd()}...`;
};

const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

export default function DecisionWheel({
  description,
  emptyMessage,
  eyebrow = 'Modo azar',
  options,
  title,
}: DecisionWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'instant' | 'wheel' | null>(
    null,
  );
  const spinTimeoutRef = useRef<number | null>(null);
  const optionsSignature = JSON.stringify(options);
  const segmentAngle = options.length > 0 ? 360 / options.length : 360;
  const isReady = options.length > 1;
  const selectedOption = selectedIndex !== null ? options[selectedIndex] : null;
  const labelRadiusPercent =
    options.length <= 3 ? 28.5 : options.length <= 5 ? 30.5 : 32;
  const labelWidthPercent =
    options.length <= 3 ? 34 : options.length <= 6 ? 28 : 22;
  const labelTextLimit = options.length <= 4 ? 16 : 12;
  const labelFontSize = options.length > 6 ? '9px' : '10px';
  const spinTransition = isSpinning
    ? 'transform 4600ms cubic-bezier(0.16, 1, 0.3, 1)'
    : 'transform 420ms ease-out';
  const wheelGradient =
    options.length === 0
      ? 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(241,245,249,0.92))'
      : `conic-gradient(from 0deg, ${options
          .map((_, index) => {
            const start = index * segmentAngle;
            const end = (index + 1) * segmentAngle;
            return `${wheelColors[index % wheelColors.length]} ${start}deg ${end}deg`;
          })
          .join(', ')})`;

  const clearSpinTimeout = () => {
    if (spinTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(spinTimeoutRef.current);
    spinTimeoutRef.current = null;
  };

  useEffect(() => {
    clearSpinTimeout();
    setRotation(0);
    setSelectedIndex(null);
    setSelectionMode(null);
    setIsSpinning(false);
  }, [optionsSignature]);

  useEffect(() => () => clearSpinTimeout(), []);

  const pickRandomIndex = () => Math.floor(Math.random() * options.length);

  const handleSpin = () => {
    if (!isReady || isSpinning) {
      return;
    }

    const nextIndex = pickRandomIndex();
    const centerAngle = nextIndex * segmentAngle + segmentAngle / 2;
    const currentNormalized = normalizeAngle(rotation);
    const desiredNormalized = normalizeAngle(360 - centerAngle);
    let delta = desiredNormalized - currentNormalized;

    if (delta < 0) {
      delta += 360;
    }

    clearSpinTimeout();
    setSelectedIndex(null);
    setSelectionMode('wheel');
    setIsSpinning(true);
    setRotation(rotation + 2160 + delta);

    spinTimeoutRef.current = window.setTimeout(() => {
      setSelectedIndex(nextIndex);
      setIsSpinning(false);
      spinTimeoutRef.current = null;
    }, 4600);
  };

  const handleInstantPick = () => {
    if (!isReady || isSpinning) {
      return;
    }

    clearSpinTimeout();
    setSelectionMode('instant');
    setSelectedIndex(pickRandomIndex());
  };

  return (
    <div>
      <span className="section-kicker">{eyebrow}</span>
      <h3 className="font-display mt-5 text-4xl leading-[0.96] text-slate-950">
        {title}
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        {description}
      </p>

      <div className="relative mx-auto mt-8 w-full max-w-[22rem]">
        <div className="absolute left-1/2 top-1 z-20 h-0 w-0 -translate-x-1/2 border-x-[14px] border-t-[22px] border-x-transparent border-t-slate-950 drop-shadow-[0_8px_18px_rgba(15,23,42,0.25)]" />

        <div className="relative aspect-square w-full">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.95),rgba(241,245,249,0.8))] shadow-[0_24px_60px_rgba(15,23,42,0.14)]" />

          <div
            className="absolute inset-[0.7rem]"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinTransition,
            }}
          >
            <div
              className="absolute inset-0 rounded-full border-[10px] border-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_18px_36px_rgba(15,23,42,0.16)]"
              style={{ background: wheelGradient }}
            />

            {options.map((option, index) => {
              const angle = index * segmentAngle + segmentAngle / 2;
              const radians = (angle * Math.PI) / 180;
              const x = 50 + Math.sin(radians) * labelRadiusPercent;
              const y = 50 - Math.cos(radians) * labelRadiusPercent;
              const isSelected = !isSpinning && selectedIndex === index;

              return (
                <div
                  className={`absolute rounded-[1rem] border px-2 py-1 text-center text-[11px] font-semibold leading-4 shadow-lg shadow-slate-900/10 ${
                    isSelected
                      ? 'border-orange-300 bg-white text-slate-950'
                      : 'border-white/70 bg-white/88 text-slate-700 backdrop-blur'
                  }`}
                  key={`${option}-${index}`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
                    transition: spinTransition,
                    fontSize: labelFontSize,
                    width: `${labelWidthPercent}%`,
                  }}
                  title={option}
                >
                  {truncateOptionLabel(option, labelTextLimit)}
                </div>
              );
            })}
          </div>

          <div className="absolute inset-[26%] flex items-center justify-center rounded-full border border-white/90 bg-white/90 px-5 text-center shadow-[0_18px_36px_rgba(15,23,42,0.14)] backdrop-blur">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {isSpinning
                  ? 'Girando'
                  : selectedOption
                    ? 'Resultado'
                    : 'Centro'}
              </p>
              <p className="mt-3 text-lg font-semibold leading-6 text-slate-950">
                {isSpinning
                  ? 'Buscando una opción...'
                  : selectedOption ?? 'Listo para decidir'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button disabled={!isReady || isSpinning} onClick={handleSpin}>
          {isSpinning ? 'Girando...' : 'Girar ruleta'}
        </Button>
        <Button
          disabled={!isReady || isSpinning}
          onClick={handleInstantPick}
          variant="secondary"
        >
          Elegir ahora
        </Button>
      </div>

      {!isReady ? (
        <div className="mt-5 rounded-[1.7rem] border border-dashed border-[color:var(--line)] bg-white/65 p-5 text-sm leading-6 text-slate-600">
          <p className="font-semibold text-slate-950">
            La ruleta necesita al menos dos opciones.
          </p>
          <p className="mt-2">{emptyMessage}</p>
        </div>
      ) : null}

      <div
        aria-live="polite"
        className="mt-5 rounded-[1.8rem] border border-[color:var(--line)] bg-white/75 p-5 shadow-sm shadow-slate-900/5"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {selectionMode === 'wheel'
            ? 'Salida de la ruleta'
            : selectionMode === 'instant'
              ? 'Salida rapida'
              : 'Sin resultado'}
        </p>
        <p className="mt-3 text-2xl font-semibold leading-tight text-slate-950">
          {selectedOption ?? 'Todavia no hay una opcion elegida.'}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {selectedOption
            ? 'Si quieres, puedes volver a lanzar.'
            : 'Gira o deja que la app elija.'}
        </p>
      </div>

      {options.length > 0 ? (
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {options.map((option, index) => {
            const isSelected = !isSpinning && selectedIndex === index;

            return (
              <div
                className={`flex items-center gap-3 rounded-[1.2rem] border px-4 py-3 text-sm ${
                  isSelected
                    ? 'border-orange-300 bg-orange-50/90 text-slate-950'
                    : 'border-[color:var(--line)] bg-white/70 text-slate-700'
                }`}
                key={`${option}-legend-${index}`}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: wheelColors[index % wheelColors.length],
                  }}
                />
                <span className="min-w-0 flex-1 truncate" title={option}>
                  {option}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
