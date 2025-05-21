import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-10/12 md:w-3/6 mx-auto gap-4">
      <h1 className="text-4xl font-bold text-primary">Apoyar</h1>
      <div className="flex flex-col items-start gap-4">
        <p className="text-lg text-muted-foreground ">
          Si te gusta el proyecto, puedes apoyarlo de varias maneras:
        </p>
        <ul className="list-disc list-inside">
          <li className="text-lg text-muted-foreground">
            Deja tus comentarios por WhatsApp en{" "}
            <Link
              href="https://wa.me/573016334177"
              className="text-primary"
              target="_blank"
            >
              este enlace.
            </Link>
          </li>
          <li className="text-lg text-muted-foreground">
            Compartir el proyecto con tus amigos.
          </li>
          <li className="text-lg text-muted-foreground">
            Si eres desarrollador, puedes contribuir creando tus Pull Request en{" "}
            <Link
              href="https://github.com/LEstebanR/dream_journal"
              className="text-primary"
              target="_blank"
            >
              este repositorio
            </Link>
          </li>
          <li className="text-lg text-muted-foreground">
            <span>
              Me puedes invitar a un café en{" "}
              <Link
                href="https://buymeacoffee.com/lesteban"
                className="text-primary"
                target="_blank"
              >
                este enlace
              </Link>{" "}
              (Ojo que funciona en dólares)
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
