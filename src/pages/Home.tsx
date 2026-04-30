import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { DecisionCard } from '../components/DecisionCard';
import { useDecisionContext } from '../context/DecisionContext';

export const Home = () => {
  const { decisions, networkState, removeDecision, refresh } = useDecisionContext();
  const totalOptionsCount = decisions.reduce(
    (accumulatedOptions, decision) =>
      accumulatedOptions + decision.options.length,
    0,
  );
  const averageOptions =
    decisions.length === 0
      ? '0.0'
      : (totalOptionsCount / decisions.length).toFixed(1);
  const latestDecisions = [...decisions]
    .sort(
      (firstDecision, secondDecision) =>
        new Date(secondDecision.createdAt).getTime() -
        new Date(firstDecision.createdAt).getTime(),
    )
    .slice(0, 3);
  const isInitialLoading =
    networkState.status === 'loading' && decisions.length === 0;
  const isRefreshing =
    networkState.status === 'loading' && decisions.length > 0;
  const newestDecisionTitle =
    latestDecisions[0]?.title ?? 'Todavia no hay una decision creada';

  if (isInitialLoading) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-124px)] max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="glass-card animate-pulse rounded-[2.7rem] p-8 sm:p-10">
          <div className="h-8 w-36 rounded-full bg-slate-200" />
          <div className="mt-6 h-20 max-w-3xl rounded-[2rem] bg-slate-200" />
          <div className="mt-4 h-4 max-w-2xl rounded-full bg-slate-100" />
          <div className="mt-2 h-4 max-w-xl rounded-full bg-slate-100" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                className="h-36 rounded-[1.75rem] bg-slate-100"
                key={index}
              />
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-124px)] max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="glass-card rounded-[2.8rem] p-8 sm:p-10 fade-in-up">
          <div className="flex flex-wrap items-center gap-3">
            <span className="section-kicker">Panel general</span>
            {isRefreshing ? (
              <span className="metric-pill bg-[color:var(--sky-soft)] text-[color:var(--sky)]">
                Sincronizando
              </span>
            ) : (
              <span className="metric-pill bg-[color:var(--forest-soft)] text-[color:var(--forest)]">
                Vista en vivo
              </span>
            )}
          </div>

          <div className="mt-7 space-y-5">
            <h2 className="font-display max-w-4xl text-5xl leading-[0.92] text-slate-950 sm:text-6xl">
              Decide mas claro, con una interfaz que devuelve contexto en lugar de ruido.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              DecideYa junta opciones, rescata lo importante y te deja volver a
              cada lista con una vista limpia, calmada y mucho mas util para tomar
              decisiones reales.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-[color:var(--paper)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
              to="/decisions"
            >
              Ir a gestionar decisiones
            </Link>
            <Link
              className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-white"
              to="/about"
            >
              Explorar la estructura
            </Link>
          </div>

          {networkState.status === 'error' ? (
            <div className="coral-card mt-8 rounded-[1.85rem] p-5 text-sm text-slate-700">
              <p className="font-semibold text-[color:var(--coral)]">
                La app no pudo sincronizar los datos.
              </p>
              <p className="mt-2">{networkState.message}</p>
              <div className="mt-4">
                <Button onClick={() => refresh()} variant="secondary">
                  Reintentar carga
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <aside className="ink-card relative overflow-hidden rounded-[2.8rem] p-8 text-white fade-in-up delay-1">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-[color:var(--gold-soft)] blur-3xl" />

          <div className="relative">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              Radar del espacio
            </span>

            <h3 className="font-display mt-6 text-4xl leading-[0.96]">
              Un vistazo rapido a lo que ya esta en juego.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Todo lo esencial del tablero resumido para que sepas si toca crear,
              revisar o limpiar listas.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.07] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Decisiones activas
                </p>
                <p className="mt-2 text-3xl font-bold">{decisions.length}</p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.07] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Opciones totales
                </p>
                <p className="mt-2 text-3xl font-bold">{totalOptionsCount}</p>
              </div>
            </div>

            <div className="mt-4 rounded-[1.8rem] border border-white/10 bg-white/[0.06] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Promedio por lista
              </p>
              <p className="mt-2 text-3xl font-bold">{averageOptions}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Ultima decision
              </p>
              <p className="mt-2 text-2xl font-semibold leading-tight">
                {newestDecisionTitle}
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-3 fade-in-up delay-2">
        <article className="coral-card card-lift rounded-[2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--coral)]">
            Vision general
          </p>
          <h3 className="font-display mt-4 text-3xl leading-[0.95] text-slate-950">
            Menos ruido, mejor foco.
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Las tarjetas muestran solo lo justo para volver a una decision sin
            tener que reconstruirla mentalmente.
          </p>
        </article>

        <article className="sky-card card-lift rounded-[2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--sky)]">
            Continuidad
          </p>
          <h3 className="font-display mt-4 text-3xl leading-[0.95] text-slate-950">
            Todo queda listo para retomar.
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Cuando vuelves al tablero, la app te recuerda el estado del trabajo
            sin esconder las alternativas importantes.
          </p>
        </article>

        <article className="sun-card card-lift rounded-[2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a6700]">
            Ritmo
          </p>
          <h3 className="font-display mt-4 text-3xl leading-[0.95] text-slate-950">
            Crea, compara y limpia.
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Un flujo simple para que las listas se mantengan utiles y no se
            conviertan en otra fuente de desorden.
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="space-y-4 fade-in-up delay-2">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Ultimas decisiones
              </p>
              <h3 className="font-display mt-2 text-4xl leading-[0.96] text-slate-950">
                El tablero mas reciente, listo para revisar.
              </h3>
            </div>
          </div>

          {latestDecisions.length === 0 ? (
            <div className="glass-card rounded-[2.2rem] p-8">
              <p className="font-display text-3xl leading-[0.96] text-slate-950">
                Todavia no hay decisiones creadas.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Empieza con una pregunta concreta y dos o tres alternativas. En
                cuanto guardes la primera lista, aparecera aqui con acceso directo
                a su detalle.
              </p>
              <Link
                className="mt-5 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-[color:var(--paper)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                to="/decisions"
              >
                Crear mi primera decision
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              {latestDecisions.map((decision) => (
                <DecisionCard
                  decision={decision}
                  key={decision.id}
                  onDelete={removeDecision}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="glass-card rounded-[2.4rem] p-6 fade-in-up delay-3">
          <span className="section-kicker">Ritual sugerido</span>
          <h3 className="font-display mt-5 text-4xl leading-[0.96] text-slate-950">
            Una secuencia simple para aterrizar buenas decisiones.
          </h3>

          <div className="mt-6 space-y-4">
            <div className="forest-card rounded-[1.8rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--forest)]">
                Paso 1
              </p>
              <p className="mt-3 text-xl font-semibold text-slate-950">
                Nombra bien el dilema
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Una pregunta clara hace que la comparacion sea mas util desde el
                primer vistazo.
              </p>
            </div>

            <div className="sky-card rounded-[1.8rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--sky)]">
                Paso 2
              </p>
              <p className="mt-3 text-xl font-semibold text-slate-950">
                Reune opciones accionables
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Evita ideas vagas y registra alternativas que puedas evaluar de
                verdad.
              </p>
            </div>

            <div className="coral-card rounded-[1.8rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--coral)]">
                Paso 3
              </p>
              <p className="mt-3 text-xl font-semibold text-slate-950">
                Limpia lo que ya no ayuda
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Mantener el tablero enfocado hace que volver a decidir sea mas
                rapido la proxima vez.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};
