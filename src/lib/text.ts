/** 1 → I, 2 → II, 4 → IV… para los números de página. */
export function roman(n: number): string {
  const table: Array<[number, string]> = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let out = ''
  let rest = Math.max(0, Math.floor(n))
  for (const [value, sym] of table) {
    while (rest >= value) {
      out += sym
      rest -= value
    }
  }
  return out || 'I'
}

/** Capitaliza la primera letra. */
export function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}