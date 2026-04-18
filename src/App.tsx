import { useEffect, useState } from "react";
import { About } from "./components/About";
import { Ambient } from "./components/Ambient";
import { Contact } from "./components/Contact";
import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Learning } from "./components/Learning";
import { Nav } from "./components/Nav";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { TerminalCommandPalette } from "./components/TerminalCommandPalette";

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      document.documentElement.classList.add("all-content-visible");
    }, 2200);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Ambient />
      <Nav onCommandOpen={() => setPaletteOpen(true)} />
      <main>
        <Hero onCommandOpen={() => setPaletteOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Learning />
        <Contact />
      </main>
      <Footer />
      <TerminalCommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}

export default App;
