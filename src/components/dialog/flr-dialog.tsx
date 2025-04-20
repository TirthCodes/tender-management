import React from 'react'
import DialogWrapper from './dialog-wrapper'
import { FluorescenceForm } from '../forms/fluorescence-form'

export default function FlrDialog() {
  return (
    <DialogWrapper title="Fluorescence" isEdit={false}>
      <FluorescenceForm />
    </DialogWrapper>
  )
}
