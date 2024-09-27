import React, { FC } from "react"

const UserIcon: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <svg className={`${className}`} viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24.5" cy="24.5" r="23.5" stroke="#F6F5F1" stroke-width="2" />
      <path
        d="M36 36.75C36 34.8311 36 33.8716 35.7632 33.0909C35.2299 31.3331 33.8544 29.9575 32.0966 29.4243C31.3159 29.1875 30.3564 29.1875 28.4375 29.1875H21.5625C19.6436 29.1875 18.6841 29.1875 17.9034 29.4243C16.1456 29.9575 14.7701 31.3331 14.2368 33.0909C14 33.8716 14 34.8311 14 36.75M31.1875 18.1875C31.1875 21.6048 28.4173 24.375 25 24.375C21.5827 24.375 18.8125 21.6048 18.8125 18.1875C18.8125 14.7702 21.5827 12 25 12C28.4173 12 31.1875 14.7702 31.1875 18.1875Z"
        stroke="#F6F5F1"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

export default UserIcon
