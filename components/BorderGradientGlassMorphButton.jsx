import React from 'react'
import style from './glassmorph.module.css'

function BorderGradientGlassMorphButton() {
  return (
    <div className="w-screen flex justify-center items-center h-[300px] bg-[url('https://images.unsplash.com/photo-1706864318540-dd0d085ccba5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-contain">
      <div className="w-fit h-5">
        <button className={style.gradBorder}>
          <i></i>
          Gradient button
        </button>
      </div>
    </div>
  )
}

export default BorderGradientGlassMorphButton
