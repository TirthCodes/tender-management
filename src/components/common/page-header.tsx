import React from 'react'
import { FormDialog } from './form-dialog'
import { Button } from '../ui/button'
import { PlusCircle } from 'lucide-react'


export function PageHeader({ title, setDialogOpen }: { title: string, setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button
        size="sm"
        className="rounded-sm"
        onClick={() => setDialogOpen(true)}
      >
        Create <PlusCircle />{" "}
      </Button>
    </div>
  )
}
