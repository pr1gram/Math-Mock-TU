import React, { FC } from "react"

const Left_Arrow: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <svg
      width="14"
      height="14"
      className={`${className}`}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.8882 6.88867H1.45068M1.45068 6.88867L7.16943 12.6074M1.45068 6.88867L7.16943 1.16992"
        stroke="#F6F5F1"
        strokeWidth="1.63393"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Left_Arrow
