import {notFound} from 'next/navigation'
import {FinanceModulePage} from '@/components/finance/ModulePages'
import {moduleOrder} from '@/lib/scenario/docs'
import type {ScenarioModule} from '@/lib/types'

export function generateStaticParams() {return moduleOrder.map((module) => ({module}))}
export default function ModulePage({params}: {params: {module: string}}) {if (!moduleOrder.includes(params.module as ScenarioModule)) notFound(); return <FinanceModulePage module={params.module as ScenarioModule} />}
