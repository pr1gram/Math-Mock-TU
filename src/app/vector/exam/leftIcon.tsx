import React, { FC } from "react"

const LeftIcon: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <svg
      className={`${className}`}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12.5" cy="12.5" r="12.5" fill="#2F7AEB" />
      <path
        d="M18.182 12.5002H6.81836M6.81836 12.5002L12.5002 18.182M6.81836 12.5002L12.5002 6.81836"
        stroke="#F6F5F1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default LeftIcon
