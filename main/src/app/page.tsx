import NumberGrid from "@/components/number-grid";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <NumberGrid />
    </div>
  );
}
