export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border/40 px-4 py-3 text-center">
      <p className="text-[11px] tracking-wide text-muted-foreground">
        Made with care for portfolio ·{" "}
        <a
          href="https://github.com/FratresMedAI/BreachMark"
          className="text-primary/80 transition-colors hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          BreachMark
        </a>
      </p>
    </footer>
  );
}
