'use client'

import React, { useCallback, useEffect, useState } from 'react'

function DebounceInput({ label = 'DebounceInput', setOutput = () => {} }) {
  const [value, setValue] = useState()
  const debounce = (callback, timeout = 1000) => {
    let timer
    return function (...args) {
      clearTimeout(timer)
      timer = setTimeout(() => callback.apply(this, args), timeout)
    }
  }
  const debounceCall = useCallback(
    debounce(value => setOutput(value)),
    []
  )

  useEffect(() => {
    debounceCall(value)
  }, [value])
  return (
    <div className="mx-auto flex flex-col max-w-60 my-10">
      <label htmlFor="input">{label}</label>
      <input
        className="text-black p-2 rounded-md"
        name="input"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {/* {output && <p className="mt-5 bg-white p-2 text-gray-800">{output}</p>}  */}
    </div>
  )
}

export default DebounceInput
