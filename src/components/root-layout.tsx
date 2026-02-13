import starruptureLogo from '@/assets/starrupture-logo.png'
import { Chip, cn, Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import { NavLink, Outlet, useMatch } from 'react-router-dom'
import GithubButton from './ui/github-button'
import { LanguageSelector } from './ui/language-selector'
import { ROUTE } from '@/constants'

const NavItem = ({ to, label, isBeta }: { to: string; label: string; isBeta?: boolean }) => {
  const match = useMatch(to)
  const isActive = Boolean(match)

  return (
    <NavbarItem className={cn(isBeta && 'p-1 ring-2 ring-yellow-400 rounded-xl')}>
      <NavLink
        to={to}
        className={cn('text-lg no-underline', isActive ? 'text-foreground font-semibold' : 'text-foreground/60 hover:text-foreground')}
      >
        {label}
      </NavLink>
      {isBeta && (
        <Chip size="sm" variant="flat" color="warning" className="text-sm font-bold mx-1">
          Alpha
        </Chip>
      )}
    </NavbarItem>
  )
}

const RootLayout = () => {
  return (
    <div id="__NEXT" className="h-screen flex flex-col bg-content1">
      <Navbar className="bg-content1 shrink-0" maxWidth="full">
        <NavbarBrand className="space-x-2">
          <Image alt="Starrupture Logo" src={starruptureLogo} width={140} />
          <p className="text-xl font-bold text-foreground/90">Planner</p>
        </NavbarBrand>

        <NavbarContent justify="center">
          <NavItem to={ROUTE.HOME} label="📐 Planner" />
          <NavItem to={ROUTE.ITEMS} label="📦 Items" />
          {/* <NavItem to={ROUTE.SKETCH} label="🗺️ Sketch" isBeta /> */}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <LanguageSelector />
          </NavbarItem>
          <NavbarItem>
            <Link isExternal>
              <GithubButton />
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout
