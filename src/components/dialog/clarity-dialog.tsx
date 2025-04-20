import React from 'react'
import DialogWrapper from './dialog-wrapper'
import { ClarityForm } from '../forms/clarity-form'

export default function ClarityDialog() {
  return (
    <DialogWrapper title="Clarity" isEdit={false}>
      <ClarityForm />
    </DialogWrapper>
  )
}
