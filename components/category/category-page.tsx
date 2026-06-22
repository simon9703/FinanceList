import {moduleDocs} from '@/lib/category/docs'
import {mockScenario} from '@/lib/category/mock'
import {calculateBuyRent, calculateInvestment, calculateLivingCost, calculatePersonal, calculateRetirement} from '@/lib/category/calc'
import type {ScenarioModule} from '@/lib/category/types'

function calculate(module: ScenarioModule, data: any) {
  if (module === 'buy_rent') return calculateBuyRent(data)
  if (module === 'investment') return calculateInvestment(data)
  if (module === 'living_cost') return calculateLivingCost(data)
  if (module === 'retirement') return calculateRetirement(data)
  return calculatePersonal(data)
}

export function ScenarioPage({module}: {module: ScenarioModule}) {
  const doc = moduleDocs[module]
  const scenario = mockScenario[module]
  const output = calculate(module, scenario.data)

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto grid max-w-6xl gap-6">
        <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">FinanceList Scenario</p>
          <h1 className="mt-3 text-4xl font-bold">{doc.title}</h1>
          <p className="mt-4 max-w-3xl text-slate-300">统一 Scenario 数据层：AI 生成 data，DB 缓存 scenario，Mock 兜底，前端只依赖 scenario.data 计算。</p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <DocCard title="数据" value={doc.data} lines={[`module: ${module}`, `city_model: ${scenario.city_model}`, `ai_generated: ${String(scenario.ai_generated)}`]} />
          <DocCard title="结构" value={doc.input} lines={[`output: ${doc.output}`, 'assumptions: Assumptions', 'data: module payload']} />
          <DocCard title="说明" value="AI + Mock + DB" lines={doc.notes} />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <JsonBlock title="Scenario" value={scenario} />
          <JsonBlock title="计算输出" value={output} />
        </section>
      </div>
    </main>
  )
}

function DocCard({title, value, lines}: {title: string; value: string; lines: string[]}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900 p-5">
      <h2 className="text-sm text-slate-400">{title}</h2>
      <p className="mt-2 text-xl font-semibold text-cyan-200">{value}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        {lines.map((line) => <li key={line}>• {line}</li>)}
      </ul>
    </article>
  )
}

function JsonBlock({title, value}: {title: string; value: unknown}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
      <h2 className="border-b border-white/10 px-5 py-3 font-semibold">{title}</h2>
      <pre className="max-h-[520px] overflow-auto p-5 text-xs leading-5 text-emerald-100">{JSON.stringify(value, null, 2)}</pre>
    </article>
  )
}
