import Header from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import TextBox from "@/components/text-box";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between h-screen gap-4 px-2">
      <Header />
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <h1 className="text-4xl font-bold text-center">
          Interpretador de sueños
        </h1>
        <h2 className="text-lg text-center">
          Describe tu sueño y descubre su significado
        </h2>
        <TextBox />
      </div>
      <Footer />
    </div>
  );
}
