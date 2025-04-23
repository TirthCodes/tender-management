import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';

export function FormButtons({ isPending, submitText }: { isPending: boolean, submitText: string }) {
  return (
    <DialogFooter className="pt-2 md:pt-6 flex flex-row justify-end pb-2 md:pb-0 items-center">
      <DialogClose asChild>
        <Button
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
      </DialogClose>
      <Button
        type="submit"
        disabled={isPending}
      >
        {submitText} {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
      </Button>
    </DialogFooter>
  );
}
