'use client'
import { useTheme } from "next-themes"

const ThemeToggler = () => {
    const { setTheme, resolvedTheme } = useTheme()

    return (
        <button 
            onClick={() => setTheme(resolvedTheme ? 'light' : 'dark')}
        >
            Theme: { resolvedTheme }
        </button>
    )
}

export default ThemeToggler