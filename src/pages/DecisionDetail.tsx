import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import DecisionWheel from '../components/DecisionWheel';
import { useDecisionContext } from '../context/DecisionContext';
import NotFound from './NotFound';

export default function DecisionDetail() {
  const { decisionId } = useParams();
  const navigate = useNavigate();
  const { decisions, networkState, removeDecision, setSelectedOption, refresh } =
    useDecisionContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<string | null | undefined>(
    undefined,
  );

  const decision = decisions.find(
    (currentDecision) => currentDecision.id === decisionId,
  );
  const isInitialLoading =
    networkState.status === 'loading' && decisions.length === 0;

  if (isInitialLoading) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-5xl flex-col gap-6 px-6 py-8">
        <section className="glass-card animate-pulse rounded-[2.6rem] p-8">
          <div className="h-10 w-40 rounded-full bg-slate-200" />
          <div className="mt-7 h-16 max-w-2xl rounded-[1.8rem] bg-slate-200" />
          <div className="mt-4 h-5 max-w-xl rounded-full bg-slate-100" />
          <div className="mt-8 h-28 rounded-[2rem] bg-slate-100" />
        </section>
      </main>
    );
  }

  if (networkState.status === 'error' && decisions.length === 0) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-5xl flex-col gap-6 px-6 py-8">
        <section className="coral-card rounded-[2.4rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--coral)]">
            Error de carga
          </p>
          <h2 className="font-display mt-4 text-4xl leading-[0.96] text-slate-950">
            No pudimos abrir esta decision todavia.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700">
            {networkState.message}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => refresh()} variant="secondary">
              Reintentar
            </Button>
            <Link
              className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-[color:var(--paper)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
              to="/"
            >
              Volver a la lista
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (!decision) {
    return (
      <NotFound
        description="La decision que intentas abrir no existe o ya fue eliminada."
        title="Decision no encontrada"
      />
    );
  }

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await removeDecision(decision.id);
      navigate('/');
    } finally {
      setIsDeleting(false);
    }
  };

  const isUpdatingSelection = pendingSelection !== undefined;

  const handleSelectOption = async (option: string | null) => {
    if (isUpdatingSelection) {
      return;
    }

    setPendingSelection(option);

    try {
      await setSelectedOption(decision.id, option);
    } finally {
      setPendingSelection(undefined);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-5xl flex-col gap-6 px-6 py-8">
      <section className="glass-card rounded-[2.6rem] p-8 fade-in-up">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-white"
            to="/"
          >
            Volver a decisiones
          </Link>

          <div className="flex flex-wrap gap-2">
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
        </div>

        <div className="mt-7 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Detalle
          </p>
          <h2 className="font-display text-5xl leading-[0.92] text-slate-950 sm:text-6xl">
            {decision.title}
          </h2>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            Revisa opciones o deja que la ruleta elija.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-[color:var(--line)] bg-white/70 p-5">
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Creada
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {new Date(decision.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Actualizada
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {new Date(decision.updatedAt).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Identificador
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {decision.id.slice(0, 8)}
              </p>
            </div>
          </div>

          <Button
            disabled={isDeleting}
            onClick={handleDelete}
            variant="danger"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar decision'}
          </Button>
        </div>
      </section>

      {networkState.status === 'error' && decisions.length > 0 ? (
        <section className="coral-card rounded-[2rem] p-5 text-sm text-slate-700">
          <p className="font-semibold text-[color:var(--coral)]">
            No se pudo guardar el cambio.
          </p>
          <p className="mt-2">{networkState.message}</p>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="glass-card rounded-[2.4rem] p-7 fade-in-up delay-1">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Opciones
              </p>
              <h3 className="font-display mt-2 text-4xl leading-[0.96] text-slate-950">
                Lista
              </h3>
            </div>

            <span className="metric-pill bg-[color:var(--gold-soft)] text-[#9a6700]">
              {decision.options.length} registradas
            </span>
          </div>

          <div className="forest-card mt-6 rounded-[1.8rem] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--forest)]">
                  Tu decision
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-950">
                  {decision.selectedOption ?? 'Aun no has elegido una opcion.'}
                </p>
              </div>
              {decision.selectedOption ? (
                <Button
                  disabled={isUpdatingSelection}
                  onClick={() => {
                    void handleSelectOption(null);
                  }}
                  variant="secondary"
                >
                  Quitar
                </Button>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {decision.options.map((option, index) => (
              <div
                className={`flex items-start justify-between gap-4 rounded-[1.6rem] border px-5 py-4 shadow-sm shadow-slate-900/5 ${
                  decision.selectedOption === option
                    ? 'border-[color:var(--forest-soft)] bg-[rgba(29,109,99,0.08)]'
                    : 'border-[color:var(--line)] bg-white/[0.82]'
                }`}
                key={`${decision.id}-${option}-${index}`}
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--coral-soft)] text-sm font-bold text-[color:var(--coral)]">
                    {index + 1}
                  </span>
                  <p className="pt-2 text-base font-medium text-slate-950">
                    {option}
                  </p>
                </div>
                <Button
                  disabled={isUpdatingSelection}
                  onClick={() => {
                    void handleSelectOption(option);
                  }}
                  variant={
                    decision.selectedOption === option ? 'secondary' : 'primary'
                  }
                >
                  {pendingSelection === option
                    ? 'Guardando...'
                    : decision.selectedOption === option
                      ? 'Elegida'
                      : 'Elegir'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <aside className="glass-card rounded-[2.4rem] p-7 fade-in-up delay-2">
          <DecisionWheel
            description="Desempata en un giro."
            emptyMessage="Necesitas 2 opciones."
            options={decision.options}
            title="Ruleta"
          />
        </aside>
      </section>
    </main>
  );
}
