"use client"

import React, { use, useState } from "react"
import { useFormik } from "formik"
import { useSession } from "next-auth/react"
import apiFunction from "@/components/api"
import * as yup from "yup"
import { useRouter } from "next/navigation"
import { handlerSubmit } from "./signupForm.action"

export default function SignUpForm() {
  const { data: session } = useSession()
  const [invalidUsername, setInvalidUsername] = useState(false)
  const router = useRouter()
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const formik = useFormik({
    initialValues: {
      FirstName: "",
      LastName: "",
      phone: "",
      username: "",
      school: "",
    },
    validationSchema: yup.object({
      FirstName: yup.string().required("*จำเป็นต้องใส่"),
      LastName: yup.string().required("*จำเป็นต้องใส่"),
      phone: yup
        .string()
        .matches(phoneRegExp, "หมายเลขโทรศัพท์ไม่ถูกต้อง")
        .required("*จำเป็นต้องใส่"),
      username: yup.string().required("*จำเป็นต้องใส่").max(16, "Username ห้ามเกิน 16 ตัวอักษร"),
      school: yup.string().required("*จำเป็นต้องใส่"),
    }),
    onSubmit: async (values) => {
      const response = await handlerSubmit(values, session)

      if (response.status === 200) {
        router.push("/account")
      }

      if (response.status === 400) {
        setInvalidUsername(true)
      }
    },
  })

  const formStyle =
    "border-2 border-[#b5b6c2] p-1 rounded-lg bg-transparent placeholder-[#b5b6c2] sm:text-base text-sm w-full "
  const errorStyle = "text-red-600 h-0 sm:text-sm text-xs"

  return (
    <form
      className=" grid sm:gap-[18px] gap-3 sm:mt-3 text-black sm:text-xl text-lg font-medium overflow-visible"
      onSubmit={formik.handleSubmit}
    >
      <div>
        <div>ชื่อจริง</div>
        <input
          className={formStyle}
          placeholder="ชื่อจริง"
          name="FirstName"
          value={formik.values.FirstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.FirstName && formik.errors.FirstName ? (
          <div className={errorStyle}>{formik.errors.FirstName}</div>
        ) : null}
      </div>
      <div>
        <div>นามสกุล</div>
        <input
          className={formStyle}
          placeholder="นามสกุล"
          name="LastName"
          value={formik.values.LastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.LastName && formik.errors.LastName ? (
          <div className={errorStyle}>{formik.errors.LastName}</div>
        ) : null}
      </div>

      <div>
        <div>ชื่อบัญชี</div>
        <input
          className={formStyle}
          placeholder="ชื่อบัญชี"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.username && formik.errors.username ? (
          <div className={errorStyle}>{formik.errors.username}</div>
        ) : null}
        {invalidUsername ? <div className={errorStyle}>ชื่อบัญชีนี้ถูกใช้แล้ว</div> : null}
      </div>
      <div>
        <div>โรงเรียน</div>
        <input
          className={formStyle}
          placeholder="โรงเรียน"
          name="school"
          value={formik.values.school}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.school && formik.errors.school ? (
          <div className={errorStyle}>{formik.errors.school}</div>
        ) : null}
      </div>
      <div>
        <div>เบอร์โทรศัพท์</div>
        <input
          className={formStyle}
          placeholder="เบอร์โทรศัพท์"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.phone && formik.errors.phone ? (
          <div className={errorStyle}>{formik.errors.phone}</div>
        ) : null}
      </div>
        <button
          type="submit"
          className=" sm:text-lg text-base mt-2 py-1 border-2 rounded-full border-[#2f7aeb] text-white bg-[#2f7aeb] hover:text-[#2f7aeb] hover:bg-transparent duration-300"
        >
          สร้างบัญชีใหม่
        </button>
    </form>
  )
}
