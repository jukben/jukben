import { GREETZ } from './color.js'
import { dotted } from './text.js'

export const CONTACT = [
  { label: 'email', url: 'mailto:jukben@gmail.com', text: 'jukben@gmail.com' },
  { label: 'web', url: 'https://jukben.codes', text: 'jukben.codes' },
  { label: 'github', url: 'https://github.com/jukben', text: 'github.com/jukben' },
  { label: 'linkedin', url: 'https://linkedin.com/in/jukben', text: 'linkedin.com/in/jukben' },
]

export const SCROLL_TEXT =
  [
    'JUKBEN PRESENTS VERSION 2.0 OF HIS TERMINAL BUSINESS CARD',
    'PRODUCT ENGINEER FROM PRAGUE - BUILDING SOFTWARE SINCE 14',
    'NEW ARTICLE: THE DAY MY PRODUCT LEADER OUT-ENGINEERED ME',
    'CURRENTLY: ADVOCATE TECHNOLOGIES & CALENDARPIPE',
    'HIT [V] FOR THE CV, [F] FOR ANOTHER EFFECT, [Q] TO QUIT',
    'GREETINGS TO EVERYONE STILL LEARNING IN PUBLIC',
    'KEEP ON SCENEING',
  ].join('   ·   ') + '   ·   '

export const ROLE = 'product engineer · prague'

export const HOME = [
  'jakub beneš — building software since 14.',
  'freeware games → end-to-end product work.',
  '',
  'now .....: advocate · calendarpipe',
  'before ..: productboard · outreach',
]

// `hot` is the index of the hotkey letter in the label.
export const BUTTONS = [
  { label: 'About', hot: 0, action: 'about' },
  { label: 'CV', hot: 1, action: 'cv' },
  { label: 'Greetz', hot: 0, action: 'greetz' },
  { label: 'Contact', hot: 0, action: 'contact' },
  { label: 'Quit', hot: 0, action: 'quit' },
]

export const PANELS = {
  about: {
    title: 'FILE_ID.DIZ',
    lines: [
      'Name .......: jakub beneš',
      'Role .......: product engineer',
      'Location ...: prague, cz',
      'Experience .: 15+ years',
      'Release ....: 2026-11',
      '',
      'builder with 15+ years of experience delivering end-to-end.',
      "started by shipping freeware games as a teenager, and haven't",
      'stopped since. roots on the frontend, more time these days',
      'across the whole stack and infrastructure.',
      '',
      'currently: advocate technologies · calendarpipe',
      'previously: productboard · outreach',
      '',
      'learning the dark arts of agentic development and tuning my',
      "workflow for a world where half the keyboard isn't mine.",
    ],
  },
  cv: {
    title: 'CV.NFO',
    lines: [
      'Jakub Beneš · Product Engineer · AI & Agentic Systems',
      '15+ years of end-to-end delivery, first freeware games at 14. today i',
      'build agent-first: parallel coding agents orchestrated with orca, kept',
      'in check by verification harnesses. best in small, autonomous teams.',
      '',
      'experience:',
      '2026–now   Lead Product Engineer .... Advocate Technologies',
      '2026–now   Founder .................. CalendarPipe',
      '2024–2026  Senior Staff Engineer .... Productboard',
      '2022–2024  Senior Staff Engineer .... Outreach',
      '2018–2022  Sr Eng → EM → Sr Staff ... Productboard',
      '2017–2018  React Native Engineer .... Callstack',
      '',
      'highlights:',
      ' · agentic compliance ui, squad of one, idea → prod in under a month',
      ' · eval harness (golden datasets, gepa) holding satisfaction at ~90%',
      ' · calendarpipe: calendar sync + agent api, 20 paying customers',
      ' · federated graphql adopted org-wide, ~22k mau at 2,600 req/min',
      ' · founded the frontend platform team, managed up to 7 engineers',
      ' · datadog observability as terraform modules, adopted org-wide',
      '',
      'stack:',
      ' typescript · react · graphql · nestjs · next.js · llms · evals',
      ' mongodb · postgresql · redis · cloudflare · aws · terraform',
      '',
      'community:',
      ' reactgirls mentor & speaker · 2023',
      '',
      'education:',
      ' brno university of technology · information technology · 2013–2015',
      '',
      'languages:',
      ' czech — native · english — professional',
    ],
  },
  greetz: {
    title: 'GREETZ.NFO',
    color: GREETZ,
    lines: [
      'greetings fly out to:',
      '',
      'productboard frontend platform crew · you know who you are',
      'the outreach settings-platform survivors',
      'advocate technologies — thanks for the trust',
      'calendarpipe early adopters',
      'everyone who ever reviewed my gnarly RFC',
      'the reactgirls community',
      'the monorepo tooling gang',
      'anyone still using federated graphql in anger',
      '',
      "special greetz to the warez scene of '98",
      'you taught us what intros meant',
    ],
  },
  contact: {
    title: 'CONTACT.NFO',
    lines: CONTACT.map((c) => `${dotted(c.label)} ${c.text}`),
  },
}
