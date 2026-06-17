import {ProfilesH5Page} from '@/components/pages/profiles/h5'
import {ProfilesPcPage} from '@/components/pages/profiles/pc'
import {getProfileDetail, listProfiles} from '@/lib/repository'

export default async function ProfilesPage({params}: {params: {locale: string}}) {
  const profiles = await listProfiles()
  const prefix = params.locale === 'en' ? '/en' : ''
  const details = await Promise.all(profiles.map((profile) => getProfileDetail(profile.id)))
  const totalAsset = profiles.reduce((sum, profile) => sum + profile.totalAsset, 0)
  const totalDebt = profiles.reduce((sum, profile) => sum + profile.totalDebt, 0)

  return (
    <main className="min-h-screen bg-[#f7faff]">
      <ProfilesPcPage profiles={profiles} details={details} prefix={prefix} />
      <ProfilesH5Page profiles={profiles} details={details} prefix={prefix} totalAsset={totalAsset} totalDebt={totalDebt} />
    </main>
  )
}
