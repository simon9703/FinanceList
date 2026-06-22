import {notFound} from 'next/navigation'
import {FinanceModulePage} from '@/components/category-finance/ModulePages'
import {moduleOrder} from '@/lib/category/docs'
import type {ScenarioModule} from '@/lib/category/types'

export function generateStaticParams() {return moduleOrder.map((module) => ({module}))}
export default function ModulePage({params}: {params: {module: string}}) {if (!moduleOrder.includes(params.module as ScenarioModule)) notFound(); return <FinanceModulePage module={params.module as ScenarioModule} />}
