import { useEffect, useRef } from "react";

export default function useEffectAfterMount(callback: () => void, dependencies: unknown[] = []) {
  const isMounted = useRef(false);

  useEffect(() => {
    if(!isMounted.current) {
      isMounted.current = true;
      return;
    }
    callback();
  }, dependencies);

}
