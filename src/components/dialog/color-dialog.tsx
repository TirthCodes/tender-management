import React from 'react'
import DialogWrapper from './dialog-wrapper'
import { ColorForm } from '../forms/color-form'

export default function ColorDialog() {
  return (
    <DialogWrapper title="Color" isEdit={false}>
      <ColorForm />
    </DialogWrapper>
  )
}
