// eslint-disable-next-line react-refresh/only-export-components
export default () => {
    return (
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 shadow-lg">
            <div className="max-w-screen-xl mx-auto px-4 py-4 items-center gap-x-4 justify-center text-white sm:flex md:px-8">
                <div className="flex items-center gap-x-3">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <p className="py-2 font-medium text-sm sm:text-base">
                         We just launched our new product - check out all features now!
                    </p>
                </div>

                <div className="flex-none flex gap-x-3 mt-3 sm:mt-0">
                    
                    <button className="inline-block px-4 py-2 text-sm font-medium text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200">
                        Try now
                    </button>
                </div>
            </div>
        </div>
    )
}

           {/* //<div className="bg-blue-500"></div>   -- This is the current color */}