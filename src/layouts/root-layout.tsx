import starruptureLogo from '@/assets/starrupture-logo.png'
import { ROUTE } from '@/router/routes'
import { Flex, Typography } from '@/shared/ui'
import { Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, Tab, Tabs } from '@heroui/react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { GithubButton } from './components/github-button'

const tabs = [
  { key: ROUTE.HOME, label: '📐 Planner' },
  { key: ROUTE.ITEMS, label: '📦 Items' },
  { key: ROUTE.RECIPES, label: '🏭 Buildings' },
  { key: ROUTE.CORPORATIONS, label: '🏢 Corporations' },
]

const RootLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Flex id="__NEXT" direction="col" align="stretch" className="h-screen bg-background">
      <Navbar className="py-2 shrink-0 border-b border-divider/60 bg-background/80 backdrop-blur" maxWidth="full">
        <NavbarBrand className="space-x-2">
          <Image alt="Starrupture Logo" src={starruptureLogo} width={180} />
        </NavbarBrand>

        <NavbarContent justify="center">
          <Tabs selectedKey={location.pathname} onSelectionChange={(key) => navigate(key as string)} variant="bordered" size="lg">
            {tabs.map((tab) => (
              <Tab
                key={tab.key}
                title={
                  <Typography as="div" className="text-lg text-foreground/80 group-data-[selected=true]:text-foreground">
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

      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </Flex>
  )
}

export default RootLayout
