import {ProfileEditH5Page} from '@/components/pages/profile-edit/h5'
import {ProfileEditPcPage} from '@/components/pages/profile-edit/pc'
import {getProfileDetail} from '@/lib/repository'

export default async function EditProfilePage({params}: {params: {locale: string; id: string}}) {
  const detail = await getProfileDetail(params.id)
  const prefix = params.locale === 'en' ? '/en' : ''
  const profile = detail?.profile
  const moneyItems = detail?.moneyItems ?? []

  return (
    <main className="min-h-screen bg-[#f7faff]">
      <ProfileEditPcPage prefix={prefix} profileId={params.id} profile={profile} moneyItems={moneyItems} />
      <ProfileEditH5Page prefix={prefix} profileId={params.id} profile={profile} moneyItems={moneyItems} />
    </main>
  )
}
