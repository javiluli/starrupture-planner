import starruptureLogo from '@/assets/starrupture-logo.png'
import { Flex, Typography } from '@/shared/ui'
import { ROUTE } from '@/router/routes'
import { cn, Image, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import { NavLink, Outlet, useMatch } from 'react-router-dom'
import { GithubButton } from './components/github-button'
import { LanguageSelector } from './components/language-selector'

const NavItem = ({ to, label }: { to: string; label: string }) => {
  const match = useMatch(to)
  const isActive = Boolean(match)

  return (
    <NavbarItem>
      <NavLink to={to} className={cn('no-underline', isActive ? 'text-foreground' : 'text-foreground/60 hover:text-foreground')}>
        <Typography as="span" variant="small" tone="normal" className="text-xl font-semibold">
          {label}
        </Typography>
      </NavLink>
    </NavbarItem>
  )
}

const RootLayout = () => {
  return (
    <Flex id="__NEXT" direction="col" align="stretch" className="h-screen bg-background">
      <Navbar height={74} className="shrink-0 border-b border-divider/60 bg-background/80 backdrop-blur" maxWidth="full">
        <NavbarBrand className="space-x-2">
          <Image alt="Starrupture Logo" src={starruptureLogo} width={180} />
        </NavbarBrand>

        <NavbarContent justify="center">
          <NavItem to={ROUTE.HOME} label="📐 Planner" />
          <NavItem to={ROUTE.ITEMS} label="📦 Items" />
          <NavItem to={ROUTE.RECIPES} label="🏭 Buildings" />
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <LanguageSelector />
          </NavbarItem>
          <NavbarItem>
            <GithubButton />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </Flex>
  )
}

export default RootLayout
