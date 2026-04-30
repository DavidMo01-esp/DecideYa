export default function About() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-124px)] max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="glass-card rounded-[2.8rem] p-8 sm:p-10 fade-in-up">
        <span className="section-kicker">Acerca de</span>
        <h2 className="font-display mt-6 max-w-4xl text-5xl leading-[0.92] text-slate-950 sm:text-6xl">
          Una app pequena para ordenar dudas cotidianas con una presencia visual mas clara.
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          DecideYa nace para resolver algo sencillo: reunir alternativas, volver a
          ellas con contexto y no depender de notas dispersas cada vez que toca
          decidir algo importante o pequeno.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3 fade-in-up delay-1">
        <article className="ink-card rounded-[2.2rem] p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Enfoque
          </p>
          <h3 className="font-display mt-4 text-3xl leading-[0.96]">
            Menos friccion, mas contexto util.
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            La interfaz intenta quitar carga mental en lugar de anadirla.
          </p>
        </article>

        <article className="coral-card rounded-[2.2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--coral)]">
            Estructura
          </p>
          <h3 className="font-display mt-4 text-3xl leading-[0.96] text-slate-950">
            Cada pagina cumple un papel claro.
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Inicio, gestion, detalle y recuperacion de rutas invalidas sin
            perder coherencia visual.
          </p>
        </article>

        <article className="sky-card rounded-[2.2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--sky)]">
            Evolucion
          </p>
          <h3 className="font-display mt-4 text-3xl leading-[0.96] text-slate-950">
            Base ligera para seguir creciendo.
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            La separacion por contexto, paginas y API deja margen para ampliar
            el producto sin rehacerlo entero.
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <article className="glass-card rounded-[2.4rem] p-7 fade-in-up delay-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Stack
          </p>
          <h3 className="font-display mt-3 text-4xl leading-[0.96] text-slate-950">
            Tecnologia sobria para una experiencia flexible.
          </h3>
          <div className="mt-6 flex flex-wrap gap-2">
            {['React', 'TypeScript', 'React Router', 'Context API', 'Tailwind CSS', 'Vite'].map(
              (item) => (
                <span
                  className="rounded-full border border-[color:var(--line)] bg-white/80 px-3 py-1 text-sm font-medium text-slate-700"
                  key={item}
                >
                  {item}
                </span>
              ),
            )}
          </div>
          <p className="mt-6 text-sm leading-6 text-slate-600">
            La combinacion da velocidad, claridad de estructura y espacio para
            iterar tanto en producto como en interfaz.
          </p>
        </article>

        <article className="sun-card rounded-[2.4rem] p-7 fade-in-up delay-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9a6700]">
            Documentacion
          </p>
          <h3 className="font-display mt-3 text-4xl leading-[0.96] text-slate-950">
            El proyecto ya deja huellas para seguirlo con calma.
          </h3>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Los archivos de `docs/` resumen rutas, API, formularios y contexto
            para que el crecimiento del proyecto no dependa solo de abrir codigo.
          </p>
        </article>
      </section>
    </main>
  );
}
