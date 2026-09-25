import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { mp } from "@/lib/mixpanel"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        mp.themeChanged(next);
      }}
      className="relative flex h-9 w-9 items-center justify-center rounded-full p-0 text-white/80 hover:bg-white/10 hover:text-white dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 