import React from 'react'
import DialogWrapper from './dialog-wrapper'
import { ColorForm } from '../color-form'

export default function ColorDialog() {
  return (
    <DialogWrapper title="Color" isEdit={false}>
      <ColorForm />
    </DialogWrapper>
  )
}
