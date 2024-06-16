import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // Cuando el componente se monta, establece el estado montado en verdadero
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Si el componente no se ha montado aún, no renderizar nada
  if (!mounted) {
    return null;
  }

  return (
    <Button
      onClick={toggleTheme}
      className="border rounded-full dark:border-white border-black transition-colors duration-300 hover:bg-yellow-200 dark:hover:bg-gray-800 w-7 h-7"
      size="icon"
    >
      {isDark ? (
        <Moon className="h-[1rem] w-[1rem]" />
      ) : (
        <Sun className="h-[1rem] w-[1rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}