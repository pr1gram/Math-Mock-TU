import React, { FC } from "react"

const Logo: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <svg
      className={`${className}`}
      viewBox="0 0 68 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M62.1137 36.1822L52.0101 17.8602L31.091 18.2713"
        stroke="#F6F5F1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.8316 36.0413L30.9352 54.3633L51.8543 53.9523"
        stroke="#F6F5F1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46.6901 27.2774L36.5865 8.95546L15.6675 9.36647"
        stroke="#F6F5F1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.40781 27.1365L15.5114 45.4585L36.4304 45.0475"
        stroke="#F6F5F1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M62.1138 36.1822L51.8543 53.9523M15.6675 9.36646L5.40795 27.1365"
        stroke="#F6F5F1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M62.1138 36.1822L46.6901 27.2774L36.4306 45.0474L51.8543 53.9523M15.6675 9.36646L31.0912 18.2713L20.8316 36.0414L5.40795 27.1365"
        stroke="#F6F5F1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.0911 18.2715L36.4305 45.0476M20.8315 36.0415L46.69 27.2775"
        stroke="#F6F5F1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Logo
