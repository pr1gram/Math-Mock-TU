import React, { FC } from "react"

const ApprovedIcon: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <svg
      className={`${className}`}
      viewBox="0 0 18 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 1L6 12L1 7"
        stroke="#2FBA5E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ApprovedIcon
