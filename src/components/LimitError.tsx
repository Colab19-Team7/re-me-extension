import { List } from "lucide-react";

function ErrorComp({ error }: { error: string }) {
  return (
    <main className="flex flex-col gap-2">
      <div className="flex justify-center items-center bg-[#FF2D2D] text-white h-[60px]">
        <p className="text-center">{error}</p>
      </div>

      <div className="flex flex-col gap-2 py-2 px-3">
        <div className="h-[2px] bg-[#2A2A2A]" />

        <a title="Library" className="w-fit cursor-pointer" onClick={() => {}}>
          <List className="h-6 w-6" strokeWidth={3} color="#FFEC78" />
        </a>
      </div>
    </main>
  );
}

export default ErrorComp;
