import React from 'react'
import DialogWrapper from './dialog-wrapper'
import { FluorescenceForm } from '../fluorescence-form'

export default function FlrDialog() {
  return (
    <DialogWrapper title="Fluorescence" isEdit={false}>
      <FluorescenceForm />
    </DialogWrapper>
  )
}
