import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Decision } from '../types';

interface DecisionCardProps {
  decision: Decision;
  onDelete: (id: string) => void | Promise<void>;
}

export const DecisionCard = ({ decision, onDelete }: DecisionCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const previewOptions = decision.options.slice(0, 3);
  const remainingOptions = Math.max(
    decision.options.length - previewOptions.length,
    0,
  );

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(decision.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="glass-card card-lift flex h-full flex-col justify-between rounded-[2rem] p-6">
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="metric-pill bg-[color:var(--coral-soft)] text-[color:var(--coral)]">
              {decision.options.length} opciones
            </span>
            {decision.selectedOption ? (
              <span className="metric-pill bg-[color:var(--forest-soft)] text-[color:var(--forest)]">
                Elegida
              </span>
            ) : null}
            <span className="metric-pill bg-[color:var(--sky-soft)] text-[color:var(--sky)]">
              {new Date(decision.createdAt).toLocaleDateString('es-ES')}
            </span>
          </div>
          <h3 className="font-display text-[2rem] leading-[0.98] text-slate-950">
            {decision.title}
          </h3>
        </div>

        <div className="space-y-3">
          {decision.selectedOption ? (
            <div className="rounded-[1.2rem] border border-[color:var(--forest-soft)] bg-[rgba(29,109,99,0.12)] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--forest)]">
                Tu eleccion
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {decision.selectedOption}
              </p>
            </div>
          ) : null}
          <p className="text-sm font-medium text-slate-600">
            Opciones principales
          </p>
          <div className="flex flex-wrap gap-2">
            {previewOptions.map((option, index) => (
              <span
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs text-slate-700 shadow-sm shadow-slate-900/5"
                key={`${decision.id}-${index}`}
              >
                {option}
              </span>
            ))}
            {remainingOptions > 0 ? (
              <span className="rounded-full bg-[color:var(--gold-soft)] px-3 py-1 text-xs font-semibold text-[#9a6700]">
                +{remainingOptions} mas
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <Link
          className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-[color:var(--paper)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
          to={`/decisions/${decision.id}`}
        >
          Abrir
        </Link>

        <button
          className="rounded-full px-3 py-2 text-sm font-semibold text-rose-600 transition duration-200 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isDeleting}
          onClick={() => {
            void handleDelete();
          }}
          type="button"
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </article>
  );
};
