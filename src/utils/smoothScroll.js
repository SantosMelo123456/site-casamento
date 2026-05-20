const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function smoothScrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}

export function smoothScrollToHash(hash) {
  const id = hash.replace(/^#/, '')
  if (!id) {
    smoothScrollToTop()
    return
  }

  const target = document.getElementById(id)
  if (!target) {
    return
  }

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
}

export function enableSmoothAnchorNavigation() {
  const handleClick = (event) => {
    const link = event.target.closest('a[href^="#"]')
    if (!link) {
      return
    }

    const hash = link.getAttribute('href')
    if (!hash || hash === '#') {
      return
    }

    const target = document.getElementById(hash.slice(1))
    if (!target) {
      return
    }

    event.preventDefault()
    smoothScrollToHash(hash)
    window.history.pushState(null, '', hash)
  }

  document.addEventListener('click', handleClick)
  return () => document.removeEventListener('click', handleClick)
}
