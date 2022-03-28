const fullyInView = (elem: Element) => {
  const bounding = elem.getBoundingClientRect()
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  )
}
const topBotInView = (elem: Element) => {
  const bounding = elem.getBoundingClientRect()
  return (
    (bounding.top >= 0 &&
      bounding.top <=
        (window.innerHeight || document.documentElement.clientHeight)) ||
    (bounding.left >= 0 &&
      bounding.left <=
        (window.innerWidth || document.documentElement.clientWidth)) ||
    (bounding.bottom >= 0 &&
      bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)) ||
    (bounding.right <= 0 &&
      bounding.right <=
        (window.innerWidth || document.documentElement.clientWidth))
  )
}
const topInView = (elem: Element) => {
  const bounding = elem.getBoundingClientRect()
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.top <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  )
}
export { fullyInView, topInView, topBotInView }
