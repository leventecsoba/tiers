class DOMReferenceCache {
  private cache = new Map<string, HTMLElement | null>()

  get<T extends HTMLElement>(id: string): T | null {
    if (!this.cache.has(id)) {
      const element = document.getElementById(id)
      if (!element) {
        return null
      }
      this.cache.set(id, element)
    }
    return this.cache.get(id) as T | null
  }

  delete(id: string) {
    this.cache.delete(id)
  }
}

export const dom = new DOMReferenceCache()
