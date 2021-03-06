import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [books, setBooks] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setBooks([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    if (!query) return
    axios({
      url: `http://openlibrary.org/search.json`,
      method: 'get',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setBooks((prevBooks) => [
          ...new Set([
            ...prevBooks,
            ...res.data.docs.map((b) => {
              return {
                title: b.title,
                isbn: b.isbn?.[0] ?? '',
                bookId: b?.cover_edition_key ?? '',
              }
            }),
          ]),
        ])
        setHasMore(res.data.docs.length > 0)
        setLoading(false)
        console.log(res.data)
      })
      .catch((e) => {
        if (axios.isCancel(e)) return
        setError(true)
      })

    return () => cancel()
  }, [query, pageNumber])

  return {
    loading,
    error,
    books,
    hasMore,
  }
}
