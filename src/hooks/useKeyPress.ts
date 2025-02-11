import { useRouter } from "next/navigation";
import { useEffect, RefObject } from "react";

export default function useKeyPress({
  backPath,
  ref,
}: {
  backPath: string;
  ref: RefObject<HTMLFormElement | null>;
}) {
  const router = useRouter();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.push(backPath);
      } else if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        if(ref && ref.current) {
          ref.current.requestSubmit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [backPath, ref, router]);

  return;
}
