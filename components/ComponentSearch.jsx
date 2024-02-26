'use client'

import React, { useEffect, useMemo, useState } from 'react'

import BorderGradientGlassMorphButton from '@/customComponents/BorderGradientGlassMorphButton'
import DebounceInput from '@/customComponents/DebounceInput'
import { useRouter } from 'next/navigation'

function ComponentSearch() {
  const components = [<DebounceInput />, <BorderGradientGlassMorphButton />]
  const router = useRouter()
  const [output, setOutput] = useState()
  const [selectedComp, setSelectedComp] = useState([])
  useEffect(() => {
    if (!output) return setSelectedComp([])
    const comps = components.find(comp =>
      comp.type.name.toLowerCase().includes(output.toLowerCase())
    )
    console.log('comps', comps)
    setSelectedComp([comps])
  }, [output])
  return (
    <div className="space-y-8 justify-center">
      <DebounceInput label="Component name" setOutput={setOutput} />
      <div className="grid grid-flow-col gap-4">
        {selectedComp.map(item => {
          return (
            <div className="" key={item?.type?.name}>
              <BorderGradientGlassMorphButton
                action={() => router.push(`/${item?.type?.name}`)}>
                {item?.type?.name}
              </BorderGradientGlassMorphButton>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ComponentSearch
