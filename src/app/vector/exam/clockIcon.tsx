import React, { FC } from "react"

const ClockIcon: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <svg
      className={`${className}`}
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_84_2002)">
        <path
          d="M5.50033 2.7513V5.5013L7.33366 6.41797M10.0837 5.5013C10.0837 8.03261 8.03163 10.0846 5.50033 10.0846C2.96902 10.0846 0.916992 8.03261 0.916992 5.5013C0.916992 2.97 2.96902 0.917969 5.50033 0.917969C8.03163 0.917969 10.0837 2.97 10.0837 5.5013Z"
          stroke="#383C4E"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_84_2002">
          <rect width="11" height="11" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default ClockIcon
