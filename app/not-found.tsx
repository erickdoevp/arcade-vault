import { ButtonLink } from "@/components/button";

export default function NotFound() {
  return (
    <section className="fade-in flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <h1 className="pixel neon-magenta flicker text-[clamp(28px,6vw,56px)]">GAME OVER · 404</h1>
      <ButtonLink href="/" size="lg">
        VOLVER AL VAULT
      </ButtonLink>
    </section>
  );
}
