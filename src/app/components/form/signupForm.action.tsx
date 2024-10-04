'use server'
import apiFunction from "@/components/api"

export const handlerSubmit = async(values: any, session: any) => {
  const response = await apiFunction("POST", `/authentication`, {
    email: session?.user?.email,
    firstname: values.FirstName,
    lastname: values.LastName,
    username: values.username,
    tel: values.phone,
    school: values.school,
  })
  return response.status
}
