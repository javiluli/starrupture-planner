import starruptureLogo from '@/assets/icons/starrupture-logo.png'
import { Image } from '@heroui/react'

export default function Header() {
  return (
    <nav className="bg-content1 w-full p-4 flex flex-col gap-4">
      <div className="flex items-center space-x-1.5">
        <Image alt="Starrupture Logo" src={starruptureLogo} width={150} />
        <h1 className="text-xl font-bold text-foreground/90">Planner</h1>
      </div>
    </nav>
  )
}
