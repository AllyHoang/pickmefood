function ToggleView({viewType,handleToggleView}) {
    return <>
        {/* View Type Toggle */}
        <div className="bg-gray-200 p-2 rounded-full mr-3">
          <button
            onClick={() => handleToggleView()}
            className={`px-6 py-2 rounded-full ${viewType === "list" ? "bg-sky-500 text-white" : "text-gray-500"}`}
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              List
            </span>
          </button>
          <button
            onClick={() => handleToggleView()}
            className={`px-6 py-2 rounded-full ${viewType === "map" ? "bg-sky-500 text-white" : "text-gray-500"}`}
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5a1 1 0 011-1h16a1 1 0 011 1v11.382a1 1 0 01-1.553.894L15 16.118V5" />
              </svg>
              Map
            </span>
          </button>
        </div>
    </>
}

export default ToggleView
