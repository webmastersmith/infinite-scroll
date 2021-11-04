import { useState, useRef, useCallback } from 'react'
import useBookSearch from './useBookSearch'

function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  function handleQuery(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  const { loading, books, error, hasMore } = useBookSearch(query, pageNumber)

  const observer = useRef()
  const lastBookElement = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  return (
    <div className="app-wrapper">
      <input type="text" value={query} onChange={handleQuery} />
      <div>
        {books.map((book, index) => {
          if (books.length === index + 1) {
            return (
              <div key={book} ref={lastBookElement}>
                {book}
              </div>
            )
          } else {
            return <div key={book}>{book}</div>
          }
        })}
      </div>
      <div>{loading && query && `...Loading`}</div>
      <div>{error && `sorry there was an axios error`}</div>
    </div>
  )
}

export default App
