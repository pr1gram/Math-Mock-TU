import React, { FC } from "react"

const CalendarIcon: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <svg className={`${className}`} viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 5H2M8.5 1V3M4.5 1V3M4.4 11H8.6C9.44008 11 9.86012 11 10.181 10.8365C10.4632 10.6927 10.6927 10.4632 10.8365 10.181C11 9.86012 11 9.44008 11 8.6V4.4C11 3.55992 11 3.13988 10.8365 2.81901C10.6927 2.53677 10.4632 2.3073 10.181 2.16349C9.86012 2 9.44008 2 8.6 2H4.4C3.55992 2 3.13988 2 2.81901 2.16349C2.53677 2.3073 2.3073 2.53677 2.16349 2.81901C2 3.13988 2 3.55992 2 4.4V8.6C2 9.44008 2 9.86012 2.16349 10.181C2.3073 10.4632 2.53677 10.6927 2.81901 10.8365C3.13988 11 3.55992 11 4.4 11Z"
        stroke="#383C4E"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

export default CalendarIcon