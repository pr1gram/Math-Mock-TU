'use server'
import axios from "axios"
import apiFunction from "@/components/api"

export const RegisterationFormSubmit = async(images: any, session: any ,examData:any) => {
    const body = new FormData()
    body.append("file", images.examID)
    body.append("email", session?.user?.email)
    body.append("testID", examData.id)
    body.append("price", examData.price)
  const response = await apiFunction("POST", `/authentication`, {
    body
  })
  return response.status
}
