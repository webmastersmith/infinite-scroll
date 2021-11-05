import { useState, useRef, useCallback } from 'react'
import useBookSearch from './useBookSearch'
import './App.css'

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
  const uid = () => new Date().getTime() + Math.random().toString(16).slice(2)
  return (
    <div className="app-wrapper">
      <input type="text" value={query} onChange={handleQuery} />
      <div>
        {books.map(({ title, isbn, bookId }, index) => {
          if (books.length === index + 1) {
            return (
              <figure key={uid()} ref={lastBookElement} className="book">
                <a
                  href={`https://openlibrary.org/isbn/${isbn}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`}
                    alt={`${title}`}
                  />
                </a>
                <figcaption>{title}</figcaption>
              </figure>
            )
          } else {
            return (
              <figure key={uid()} className="book">
                <a
                  href={`https://openlibrary.org/isbn/${isbn}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`}
                    alt={`${title}`}
                  />
                </a>

                <figcaption>{title}</figcaption>
              </figure>
            )
          }
        })}
      </div>
      <div>{loading && query && `...Loading`}</div>
      <div>{error && `sorry there was an axios error`}</div>
    </div>
  )
}

export default App
