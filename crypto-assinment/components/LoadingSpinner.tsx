export default function LoadingSpinner() {
  return (
    /* Centered modern spinner with gradient border */
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="relative">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-t-indigo-600 border-r-purple-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )
}
