import React from 'react'

const Pagination = ({ page, setPage, total ,limit}) => {
    const totalPages = Math.ceil(total / limit)
    const end = Math.min(page * 10, total)
    const start = (page - 1) * 10 + 1

    const handlePrev = () => {
        if (page > 1) setPage(prev => prev - 1)
    }

    const handleNext = () => {
        if (page < totalPages) setPage(prev => prev + 1)
    }

    const handleInputChange = (e) => {
        const val = parseInt(e.target.value)
        if (!isNaN(val) && val >= 1 && val <= totalPages) {
            setPage(val)
        }
    }

    return (
        <div>
            <nav className="flex items-center justify-between gap-x-1 ml-auto" aria-label="Pagination">
                <div className='pb-1'>
                    {total===0? 'No Record to show':`Showing ${start} to ${end} of ${total}`}
                </div>
                <div className="flex items-center">
                    <button
                        onClick={handlePrev}
                        disabled={page === 1}
                        className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                        aria-label="Previous"
                    >
                        <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"></path>
                        </svg>
                        <span className="sr-only">Previous</span>
                    </button>

                    <div className="flex items-center gap-x-1">
                        <input
                            className="min-h-9.5 w-10 flex justify-center items-center border border-gray-200 text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-gray-50"
                         
                            min={1}
                            max={totalPages}
                            type="text"
                            value={page}
                            onChange={(e) => {
                                const val = e.target.value;

                                // Allow empty input, or only digits (no negative, no decimals)
                                if (val === '' || /^[1-9]\d*$/.test(val)) {
                                    handleInputChange(e); // You can cast to number in this handler
                                }
                            }}
                        />
                        <span className="text-sm text-gray-500">of</span>
                        <span className="text-sm text-gray-500">{totalPages}</span>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={page === totalPages}
                        className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                        aria-label="Next"
                    >
                        <span className="sr-only">Next</span>
                        <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Pagination
