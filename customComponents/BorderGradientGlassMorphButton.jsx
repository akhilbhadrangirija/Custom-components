import React from 'react'
import style from './glassmorph.module.css'

function BorderGradientGlassMorphButton({
  action = () => {},
  children = 'Gradient button'
}) {
  return (
    <div className="">
      <div className="w-fit h-5">
        <button onClick={action} className={style.gradBorder}>
          <i></i>
          {children}
        </button>
      </div>
    </div>
  )
}

export default BorderGradientGlassMorphButton
