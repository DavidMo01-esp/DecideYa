import { Link, Outlet, useLocation } from 'react-router-dom';
import { useDecisionContext } from '../context/DecisionContext';

export default function AppLayout() {
  const location = useLocation();
  const { decisions, networkState } = useDecisionContext();
  const totalOptions = decisions.reduce(
    (accumulatedOptions, decision) =>
      accumulatedOptions + decision.options.length,
    0,
  );
  const isDecisionList =
    location.pathname === '/' || location.pathname === '/decisions';

  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-[rgba(251,247,239,0.88)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Link
              className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.28em] text-slate-500"
              to="/"
            >
              DecideYa
            </Link>
            <div>
              <h1 className="font-display text-3xl leading-tight text-slate-950 sm:text-4xl">
                Decide sin rodeos.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Crea una lista, gira la ruleta y elige.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {networkState.status === 'loading' ? (
              <span className="metric-pill bg-[color:var(--gold-soft)] text-[#9a6700]">
                Sincronizando
              </span>
            ) : null}
            {networkState.status === 'error' ? (
              <span className="metric-pill bg-[color:var(--coral-soft)] text-[color:var(--coral)]">
                Error de red
              </span>
            ) : null}
            <span className="metric-pill bg-[color:var(--coral-soft)] text-[color:var(--coral)]">
              {decisions.length} decisiones
            </span>
            <span className="metric-pill bg-[color:var(--sky-soft)] text-[color:var(--sky)]">
              {totalOptions} opciones
            </span>
            {isDecisionList ? (
              <a
                className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-[color:var(--paper)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                href="#decision-form"
              >
                Nueva
              </a>
            ) : (
              <Link
                className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-white/90"
                to="/"
              >
                Volver a la lista
              </Link>
            )}
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
