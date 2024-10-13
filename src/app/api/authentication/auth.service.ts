import levenshtein from "fast-levenshtein"

export function filterSchoolName(school: string): string {
  const target = "โรงเรียน"
  const threshold = 2

  if (school.startsWith(target)) return school.slice(target.length).trim()

  for (const word of school)
    if (levenshtein.get(word, target) <= threshold) return school.replace(word, "").trim()

  return school
}
