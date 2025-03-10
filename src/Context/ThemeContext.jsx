export const initializeTheme = () => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  };
  
  export const setLightTheme = () => {
    // Whenever the user explicitly chooses light mode
    localStorage.theme = "light";
    document.documentElement.classList.remove("dark");
  };
  
  export const setDarkTheme = () => {
    // Whenever the user explicitly chooses dark mode
    localStorage.theme = "dark";
    document.documentElement.classList.add("dark");
  };
  
  export const setSystemTheme = () => {
    // Whenever the user explicitly chooses to respect the OS preference
    localStorage.removeItem("theme");
    document.documentElement.classList.toggle(
      "dark",
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  };
  
  export const getCurrentTheme = () => {
    if (localStorage.theme === "dark") return "dark";
    if (localStorage.theme === "light") return "light";
    return "system";
  };