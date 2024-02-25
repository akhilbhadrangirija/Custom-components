'use client'

import React, { useEffect, useState } from 'react'

import BorderGradientGlassMorphButton from '@/components/BorderGradientGlassMorphButton'
import DebounceInput from '@/components/DebounceInput'

function page({ params }) {
  const components = [<DebounceInput />, <BorderGradientGlassMorphButton />]
  const [selectedComponent, setSelectedComponent] = useState(<></>)
  useEffect(() => {
    let comp = components.find(_ => _.type.name === params.component)
    setSelectedComponent(comp)
    return () => {
      setSelectedComponent()
    }
  }, [params])
  return (
    <div className="p-20">
      <p className="mb-4 font-medium text-center">{params.component}</p>
      {selectedComponent ? selectedComponent : <NoComp />}
    </div>
  )
}
export default page
function NoComp() {
  return (
    <div className="text-2xl font-medium text-red-600">
      Error finding the component you are searching for
    </div>
  )
}
