export function StatCard({label, value}: {label: string; value: string | number}) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-panel">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-black">{value}</div>
    </div>
  )
}
