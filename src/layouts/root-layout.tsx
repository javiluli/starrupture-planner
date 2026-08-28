import { productionRoutes } from '@/router/router'
import { Flex, Typography } from '@/shared/ui'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Tab, Tabs } from '@heroui/react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { GithubButton } from './components/github-button'

/**
 * Componente principal que contiene el menu pincipal de la web y el <Outlet/> con el contenido/body
 */
const RootLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Flex id="__NEXT" direction="col" align="stretch" className="h-dvh min-h-0 gap-0 overflow-hidden">
      <Navbar className="shrink-0 border-b border-divider/60 bg-background/80 backdrop-blur" maxWidth="full">
        <NavbarBrand className="space-x-2">
          <Typography variant="h2" as="h1">
            SR Planner
          </Typography>
        </NavbarBrand>

        <NavbarContent justify="center">
          <Tabs selectedKey={location.pathname} onSelectionChange={(key) => navigate(key as string)} variant="light" size="sm">
            {productionRoutes.map((tab) => (
              <Tab
                key={tab.path}
                title={
                  <Typography as="div" className="text-foreground/60 group-data-[selected=true]:text-foreground">
                    {tab.label}
                  </Typography>
                }
              />
            ))}
          </Tabs>
        </NavbarContent>

        <NavbarContent justify="end">
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
