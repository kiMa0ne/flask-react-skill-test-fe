import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { ReactNode } from "react"
import { Button } from "./ui/button"
import { signOut, useSession } from "next-auth/react"


interface LayoutProps {
  children: ReactNode
}

const LayoutComponent = ({children}: LayoutProps) => {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login", redirect: true})
  }
  const { data: session } = useSession()

  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList className="flex flex-col">
          {session && <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Button onClick={() => handleSignOut()}>LOGOUT</Button>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>}
        </NavigationMenuList>
      </NavigationMenu>
      {children}
    </div>
  )
}

export default LayoutComponent