const features = [
  {
    title: "Data model first",
    description:
      "Schema includes the essential entities for auth, follows, likes, and content ownership rules.",
  },
  {
    title: "Testing from the start",
    description:
      "Vitest and Testing Library are wired in early so coverage grows with the feature set.",
  },
  {
    title: "Runbook friendly",
    description:
      "Dockerized Postgres, env example, and seed script keep local setup reproducible for anyone cloning the app.",
  },
];

export function FeatureGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {features.map((feature) => (
        <article
          key={feature.title}
          className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-950">{feature.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
        </article>
      ))}
    </section>
  );
}
