import React from 'react'
import { useApp } from '../context/AppContext'
import CourseCard from '../components/CourseCard'

export default function Courses() {
  const { courses } = useApp()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-8">
      <h1 className="text-[26px] md:text-[28px] font-bold text-ink leading-tight">My Courses</h1>
      <p className="text-ink-soft text-[15px] mt-1 mb-6">{courses.length} active courses</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
