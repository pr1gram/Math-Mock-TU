import React, { FC } from "react"

const StepperLine: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <svg
      width="62"
      height="2"
      className={`${className}`}
      viewBox="0 0 62 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1L61 1" stroke="#B5B6C2" stroke-width="2" stroke-linecap="round" />
    </svg>
  )
}

export default StepperLine
