import BorderGradientGlassMorphButton from '@/components/BorderGradientGlassMorphButton'
import DebounceInput from '@/components/DebounceInput'

export default function Home() {
  const components = [<DebounceInput />, <BorderGradientGlassMorphButton />]
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24 bg-gradient-to-tr from-pink-700 to-blue-600">
      <DebounceInput />
      <BorderGradientGlassMorphButton />
    </main>
  )
}
