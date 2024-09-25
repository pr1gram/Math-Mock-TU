"use client"

import React, { use, useState } from "react"
import { useFormik } from "formik"
import { useSession } from "next-auth/react"
import apiFunction from "@/components/api"
import classNames from "classnames"
import * as yup from "yup"
import "yup-phone"
import { useRouter } from "next/navigation"

export default function SignUpForm() {
  const { data: session } = useSession()
  const [invalidUsername,setInvalidUsername] = useState(false)
  const router = useRouter()
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const formik = useFormik({
    initialValues: {
      FirstName: "",
      LastName: "",
      phone: "",
      username: "",
    },
    validationSchema: yup.object({
      FirstName: yup.string().required("*จำเป็นต้องใส่"),
      LastName: yup.string().required("*จำเป็นต้องใส่"),
      phone: yup
        .string()
        .matches(phoneRegExp, "หมายเลขโทรศัพท์ไม่ถูกต้อง")
        .required("*จำเป็นต้องใส่"),
      username: yup.string().required("*จำเป็นต้องใส่").max(16, "Username ห้ามเกิน 16 ตัวอักษร"),
    }),
    onSubmit: async (values) => {
      const response = await apiFunction("POST", `/authentication`, {
        email: session?.user?.email,
        firstname: values.FirstName,
        lastname: values.LastName,
        username: values.username,
        tel: values.phone,
      })

      if (response.status === 200) {
        router.push("/account")
      }

      if (response.status === 500) {
        setInvalidUsername(true)
      }
    },
  })

  console.log(formik.values)
  const formStyle = "border border-white pb-2 p-2 rounded-lg bg-transparent placeholder-white"

  return (
    <form className="grid gap-8 mt-3 " onSubmit={formik.handleSubmit}>
      <div className="flex space-x-5 ">
        <div>
          <input
            className={formStyle}
            placeholder="First name"
            name="FirstName"
            value={formik.values.FirstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.FirstName && formik.errors.FirstName ? (
            <div className=" text-red-600 h-0">{formik.errors.FirstName}</div>
          ) : null}
        </div>
        <div>
          <input
            className={formStyle}
            placeholder="Last name"
            name="LastName"
            value={formik.values.LastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.LastName && formik.errors.LastName ? (
            <div className=" text-red-600 h-0">{formik.errors.LastName}</div>
          ) : null}
        </div>
      </div>
      <div>
        <input
          className={classNames("w-full", formStyle)}
          placeholder="phone number"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.phone && formik.errors.phone ? (
          <div className=" text-red-600 h-0">{formik.errors.phone}</div>
        ) : null}
      </div>
      <div>
        <input
          className={classNames("w-full", formStyle)}
          placeholder="username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.username && formik.errors.username ? (
          <div className=" text-red-600 h-0">{formik.errors.username}</div>
        ) : null}
        {invalidUsername ? (
          <div className=" text-red-600 h-0">ชื่อบัญชีนี้ถูกใช้แล้ว</div>
        ) : null}
      </div>
      <button
        type="submit"
        className=" px-4 py-2 border rounded-full hover:text-black hover:bg-white duration-300"
      >
        Submit
      </button>
    </form>
  )
}
