import levenshtein from "fast-levenshtein"
export interface User {
  email: string
  firstname?: string
  lastname?: string
  username?: string
  school?: string
  tel?: string
  _id?: string
}

export function filterSchoolName(school: string): string {
  const target = "โรงเรียน"
  const threshold = 2

  if (school.startsWith(target))
    return school.slice(target.length).trim()

  for (const word of school) 
    if (levenshtein.get(word, target) <= threshold) 
      return school.replace(word, "").trim()
  
  return school
}