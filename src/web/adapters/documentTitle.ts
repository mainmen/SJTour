/** Sets the document title; the returned function restores the previous one. */
export function setDocumentTitle(title: string): () => void {
  const previous = document.title
  document.title = title
  return () => {
    document.title = previous
  }
}
