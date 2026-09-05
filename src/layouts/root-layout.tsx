import { PRIMARY_NAVIGATION, ROUTE } from '@/router/routes'
import { Flex, Typography } from '@/shared/ui'
import { cn, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import { NavLink, Outlet } from 'react-router-dom'
import { GithubButton } from './components/github-button'

/**
 * Componente principal que contiene el menu pincipal de la web y el <Outlet/> con el contenido/body
 */
const RootLayout = () => {
  return (
    <Flex id="__NEXT" direction="col" align="stretch" className="h-dvh min-h-0 gap-0 overflow-hidden">
      <Navbar
        className="shrink-0 border-b border-divider/60 bg-background/80 backdrop-blur"
        classNames={{ wrapper: 'min-w-0 gap-2 px-3 sm:px-4 lg:px-6' }}
        maxWidth="full"
      >
        <NavbarBrand className="hidden space-x-2 lg:flex">
          <Typography variant="h2" as="span">
            SR Planner
          </Typography>
        </NavbarBrand>

        <nav aria-label="Primary navigation" className="min-w-0 flex-1 overflow-hidden lg:flex-[3]">
          <ul className="m-0 flex h-full w-full min-w-0 list-none items-center justify-center gap-1 p-0">
            {PRIMARY_NAVIGATION.map((item) => (
              <li key={item.path} className="shrink-0">
                <NavLink
                  to={item.path}
                  end={item.path === ROUTE.HOME}
                  aria-label={item.label}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex gap-1.5 rounded-medium px-2 py-2 text-foreground/80 outline-none transition-colors',
                      'hover:bg-default/40 hover:text-foreground',
                      'focus-visible:ring-2 focus-visible:ring-focus',
                      isActive && 'bg-default text-foreground',
                    )
                  }
                >
                  <span aria-hidden>{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <NavbarContent justify="end" className="hidden lg:flex">
          <NavbarItem>
            <GithubButton />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </Flex>
  )
}

export default RootLayout
