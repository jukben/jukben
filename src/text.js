import { CYAN, GOLD, LABEL, LEADER, TEXT, WHITE } from './color.js'

// Lines get their colors from their shape: "2020–now  Role .... Company", "key ...: value", "heading:".
export function styledLine(line, base = TEXT) {
  const job = line.match(/^(\d{4}–\S+\s+)(.+?\s)(\.+)(\s.+)$/)
  if (job) return [[job[1], GOLD], [job[2], WHITE], [job[3], LEADER], [job[4], CYAN]]
  const kv = line.match(/^(\s*\S[^:]*?\s\.+:\s)(.*)$/)
  if (kv) return [[kv[1], LABEL], [kv[2], WHITE]]
  if (/:\s*$/.test(line)) return [[line, CYAN]]
  return [[line, base]]
}

export function wrap(line, width) {
  if (line.length <= width) return [line]
  // Continuation lines hang under the text, past any bullet.
  const lead = line.match(/^\s*(?:· )?/)[0]
  const hang = ' '.repeat(lead.length)
  const out = []
  let cur = ''
  for (const word of line.slice(lead.length).split(' ')) {
    const prefix = out.length ? hang : lead
    if ((prefix + cur + ' ' + word).length > width && cur) {
      out.push(prefix + cur)
      cur = word
    } else cur = cur ? cur + ' ' + word : word
  }
  if (cur) out.push((out.length ? hang : lead) + cur)
  return out
}

// "label ....:" padded to a fixed width so values line up.
export const dotted = (label, width = 11) => `${label} ${'.'.repeat(width - label.length - 1)}:`
