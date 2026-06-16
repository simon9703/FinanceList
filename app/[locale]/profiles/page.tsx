import {Plus, Search} from 'lucide-react'
import {getTranslations} from 'next-intl/server'
import {ProfileCard} from '@/components/profile-card'
import {StatCard} from '@/components/stat-card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {listProfiles} from '@/lib/repository'

export default async function ProfilesPage({params}: {params: {locale: string}}) {
  const t = await getTranslations('Common')
  const p = await getTranslations('Profile')
  const profiles = await listProfiles()
  const prefix = params.locale === 'en' ? '/en' : ''

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-24 pt-5 sm:max-w-2xl">
      <header className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-xl font-black text-primary-foreground">
          FL
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-black">{t('appName')}</h1>
          <p className="truncate text-sm text-muted-foreground">{t('profiles')}</p>
        </div>
      </header>

      <section className="mt-5 grid grid-cols-3 gap-2">
        <StatCard label={t('totalProfiles')} value={profiles.length} />
        <StatCard label={t('monitoring')} value={profiles.length} />
        <StatCard label={t('alerts')} value={0} />
      </section>

      <section className="mt-5 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input className="pl-10" placeholder={t('searchPlaceholder')} />
        </div>
        <Button variant="secondary" className="shrink-0">
          {t('recentUpdated')}
        </Button>
      </section>

      <section className="mt-4 space-y-3">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} href={`${prefix}/profiles/${profile.id}`} unit={p('unit')} />
        ))}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto max-w-md sm:max-w-2xl">
          <Button size="lg" className="w-full">
            <Plus className="h-5 w-5" />
            {t('newProfile')}
          </Button>
        </div>
      </div>
    </main>
  )
}
