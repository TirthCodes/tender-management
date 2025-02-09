import React from 'react'
import DialogWrapper from './dialog-wrapper'
import { ClarityForm } from '../clarity-form'

export default function FlrDialog() {
  return (
    <DialogWrapper title="Fluorescence" isEdit={false}>
      <ClarityForm />
    </DialogWrapper>
  )
}
