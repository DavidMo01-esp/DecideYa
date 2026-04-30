import {
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import Button from '../components/Button';
import { DecisionCard } from '../components/DecisionCard';
import DecisionWheel from '../components/DecisionWheel';
import { useDecisionContext } from '../context/DecisionContext';

const parseOptions = (value: string) =>
  value
    .split(/[\n,]/)
    .map((option) => option.trim())
    .filter(Boolean);

export default function Decisions() {
  const { decisions, addDecision, removeDecision, networkState, refresh } =
    useDecisionContext();
  const [title, setTitle] = useState('');
  const [optionInput, setOptionInput] = useState('');
  const [draftOptions, setDraftOptions] = useState<string[]>([]);
  const [draftSelectedOption, setDraftSelectedOption] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const optionInputRef = useRef<HTMLInputElement>(null);
  const trimmedTitle = title.trim();
  const hasMinimumTitleLength = trimmedTitle.length >= 3;
  const hasValidOptionCount =
    draftOptions.length >= 2 && draftOptions.length <= 6;

  const totalOptions = useMemo(
    () =>
      decisions.reduce(
        (accumulatedOptions, decision) =>
          accumulatedOptions + decision.options.length,
        0,
      ),
    [decisions],
  );
  const orderedDecisions = useMemo(
    () =>
      [...decisions].sort(
        (firstDecision, secondDecision) =>
          new Date(secondDecision.createdAt).getTime() -
          new Date(firstDecision.createdAt).getTime(),
      ),
    [decisions],
  );
  const canSubmit = hasMinimumTitleLength && hasValidOptionCount;
  const isDraftEmpty =
    title.trim().length === 0 &&
    optionInput.trim().length === 0 &&
    draftOptions.length === 0;
  const isInitialLoading =
    networkState.status === 'loading' && decisions.length === 0;
  const isRefreshing =
    networkState.status === 'loading' && decisions.length > 0 && !isSubmitting;
  const averageOptions =
    decisions.length === 0 ? '0.0' : (totalOptions / decisions.length).toFixed(1);

  const addDraftOptions = (value: string) => {
    const nextOptions = parseOptions(value);

    if (nextOptions.length === 0 || isSubmitting) {
      return;
    }

    setDraftOptions((currentOptions) => {
      const seen = new Set(currentOptions.map((option) => option.toLowerCase()));
      const uniqueNextOptions = nextOptions.filter((option) => {
        const normalizedOption = option.toLowerCase();

        if (seen.has(normalizedOption)) {
          return false;
        }

        seen.add(normalizedOption);
        return true;
      });
      const remainingSlots = Math.max(0, 6 - currentOptions.length);

      return [...currentOptions, ...uniqueNextOptions.slice(0, remainingSlots)];
    });
    setOptionInput('');
  };

  const handleAddOption = () => {
    addDraftOptions(optionInput);
    optionInputRef.current?.focus();
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    handleAddOption();
  };

  const handleRemoveDraftOption = (optionIndex: number) => {
    if (isSubmitting) {
      return;
    }

    const nextOptions = draftOptions.filter((_, index) => index !== optionIndex);
    setDraftOptions(nextOptions);
    setDraftSelectedOption((currentSelectedOption) =>
      currentSelectedOption && nextOptions.includes(currentSelectedOption)
        ? currentSelectedOption
        : null,
    );
  };

  const handleClearDraft = () => {
    if (isSubmitting) {
      return;
    }

    setTitle('');
    setOptionInput('');
    setDraftOptions([]);
    setDraftSelectedOption(null);
    optionInputRef.current?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addDecision(title.trim(), draftOptions, draftSelectedOption);
      setTitle('');
      setOptionInput('');
      setDraftOptions([]);
      setDraftSelectedOption(null);
      optionInputRef.current?.focus();
    } catch {
      // Error already handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl flex-col gap-6 px-6 py-8">
      <section className="grid gap-4 md:grid-cols-3 fade-in-up">
        <article className="glass-card rounded-[2rem] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Estado
          </p>
          <p className="mt-3 text-2xl font-bold text-slate-950">
            {isRefreshing ? 'Sincronizando...' : 'Todo listo'}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Crea y decide.
          </p>
        </article>

        <article className="coral-card rounded-[2rem] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--coral)]">
            Decisiones
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {decisions.length}
          </p>
        </article>

        <article className="sky-card rounded-[2rem] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--sky)]">
            Promedio de opciones
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {averageOptions}
          </p>
        </article>
      </section>

      {networkState.status === 'error' ? (
        <section className="coral-card rounded-[2rem] p-5 text-sm text-slate-700 fade-in-up">
          <p className="font-semibold text-[color:var(--coral)]">
            No se pudo actualizar la informacion.
          </p>
          <p className="mt-2">{networkState.message}</p>
          <div className="mt-4">
            <Button onClick={() => refresh()} variant="secondary">
              Reintentar
            </Button>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <form
          className="glass-card rounded-[2.5rem] p-7 fade-in-up"
          id="decision-form"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Nueva
              </p>
              <h2 className="font-display mt-3 text-4xl leading-[0.96] text-slate-950">
                Crea tu decision.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Pega opciones por comas o saltos de linea y la app las separa.
              </p>
            </div>

            <Button
              onClick={() => refresh()}
              variant="secondary"
              type="button"
            >
              {isRefreshing ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </div>

          <div className="mt-7 space-y-5">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="title"
              >
                Titulo
              </label>
              <input
                className="w-full rounded-[1.3rem] border border-[color:var(--line)] bg-white/85 px-4 py-3 text-sm text-slate-900 shadow-sm shadow-white/70 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                disabled={isSubmitting}
                id="title"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ej: Que hacemos este fin de semana"
                  value={title}
              />
              <p className="text-sm text-slate-500">
                Minimo 3 caracteres.
              </p>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="option"
              >
                Agregar opcion
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  className="w-full rounded-[1.3rem] border border-[color:var(--line)] bg-white/85 px-4 py-3 text-sm text-slate-900 shadow-sm shadow-white/70 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  disabled={isSubmitting}
                  id="option"
                  onChange={(event) => setOptionInput(event.target.value)}
                  onKeyDown={handleOptionKeyDown}
                  placeholder="Ej: Cena en casa, salir a cenar o pedir comida"
                  ref={optionInputRef}
                  value={optionInput}
                />
                <Button
                  disabled={
                    isSubmitting ||
                    draftOptions.length >= 6 ||
                    parseOptions(optionInput).length === 0
                  }
                  onClick={handleAddOption}
                  type="button"
                >
                  Anadir
                </Button>
              </div>
              <p className="text-sm text-slate-500">
                Enter para anadir. Minimo 2 opciones y maximo 6.
              </p>
            </div>

            <div className="sun-card rounded-[1.8rem] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Borrador actual
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {draftOptions.length === 0
                      ? 'Sin opciones.'
                      : `${draftOptions.length} listas.`}
                  </p>
                </div>
                <span className="metric-pill bg-white/85 text-[#9a6700]">
                  {draftOptions.length} opciones
                </span>
              </div>

              {draftOptions.length === 0 ? (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Anade una opcion para empezar.
                </p>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  {draftOptions.map((option, index) => (
                    <button
                      className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm shadow-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isSubmitting}
                      key={`${option}-${index}`}
                      onClick={() => handleRemoveDraftOption(index)}
                      type="button"
                    >
                      <span>{option}</span>
                      <span className="text-slate-400">x</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="forest-card rounded-[1.8rem] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Elegir manualmente
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {draftSelectedOption ?? 'Aun no has elegido una opcion.'}
                  </p>
                </div>
                {draftSelectedOption ? (
                  <Button
                    disabled={isSubmitting}
                    onClick={() => setDraftSelectedOption(null)}
                    variant="secondary"
                    type="button"
                  >
                    Quitar
                  </Button>
                ) : null}
              </div>

              {draftOptions.length === 0 ? (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Primero crea opciones.
                </p>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  {draftOptions.map((option) => (
                    <Button
                      disabled={isSubmitting}
                      key={option}
                      onClick={() => setDraftSelectedOption(option)}
                      variant={
                        draftSelectedOption === option ? 'secondary' : 'primary'
                      }
                      type="button"
                    >
                      {draftSelectedOption === option ? `Elegida: ${option}` : option}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                Guarda cuando tengas un titulo de 3 caracteres y entre 2 y 6 opciones.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  disabled={isSubmitting || isDraftEmpty}
                  onClick={handleClearDraft}
                  variant="secondary"
                  type="button"
                >
                  Limpiar
                </Button>
                <Button disabled={!canSubmit || isSubmitting} type="submit">
                  {isSubmitting ? 'Guardando...' : 'Guardar decision'}
                </Button>
              </div>
            </div>
          </div>
        </form>

        <aside className="glass-card rounded-[2.5rem] p-6 fade-in-up delay-1">
          <DecisionWheel
            description="Prueba el borrador antes de guardar."
            emptyMessage="Anade 2 opciones para activar la ruleta."
            options={draftOptions}
            title="Ruleta rapida"
          />
        </aside>
      </section>

      <section className="space-y-4 fade-in-up delay-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Guardadas
            </p>
            <h2 className="font-display mt-2 text-4xl leading-[0.96] text-slate-950">
              Todas tus decisiones
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {decisions.length === 0
              ? 'Todavia no hay decisiones'
              : `${decisions.length} decisiones y ${totalOptions} opciones`}
          </p>
        </div>

        {isInitialLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                className="glass-card h-52 animate-pulse rounded-[2rem]"
                key={index}
              />
            ))}
          </div>
        ) : orderedDecisions.length === 0 ? (
          <div className="glass-card rounded-[2.2rem] p-8 text-sm leading-6 text-slate-600">
            Tu primera decision aparecera aqui.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {orderedDecisions.map((decision) => (
              <DecisionCard
                decision={decision}
                key={decision.id}
                onDelete={removeDecision}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
