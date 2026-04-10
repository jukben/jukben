export const tagline = 'jukben · product engineer · prague'

export const menu = [
  { key: 'A', label: 'bout', section: 'about' },
  { key: 'W', label: 'riting', section: 'writing' },
  { key: 'T', label: 'alks', section: 'talks' },
  { key: 'G', label: 'reetz', section: 'greetz' },
  { key: 'C', label: 'ontact', section: 'contact' },
  { key: 'Q', label: 'uit', section: null },
]

const scrollerFragments = [
  'welcome to jukben.codes',
  'hit [a] to read the about',
  'new article: the day my product leader out-engineered me',
  'currently building calendarpipe & advocate',
  'shoutouts to everyone still learning in public',
  "press [q] to quit, or don't",
  'keep on sceneing',
]

export const scrollerText = '»»» ' + scrollerFragments.join(' »»» ') + ' »»» '

export const panels = {
  about: {
    title: 'about',
    body: [
      'JUKBEN',
      'product engineer · prague',
      '',
      'builder with 10+ years of experience delivering end-to-end.',
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
  writing: {
    title: 'writing',
    body: [
      '1. the day my product leader out-engineered me',
      '2. analyzing your webpack bundle like a pro',
      '3. the ultimate git flow: trunk-based dev & stacked prs',
      '4. outcomes over outputs',
      '5. reflection on social media in the era of elon musk',
      '6. scaling monorepo: to infinity and beyond',
      '7. how we revamped rfc process at productboard',
      '8. one yarn to rule them all',
      '',
      'read more at jukben.codes',
    ],
  },
  talks: {
    title: 'talks',
    body: [
      'my talks:',
      '  · co možná nevíte o react dev tools',
      '  · frodo baggins but with federated graphql',
      '  · fighting chaos in a monorepo',
      '',
      'appearances:',
      '  · the real role of staff/principal developers',
      '  · from ic to manager and back',
      '  · techuncovered: platform frontend',
    ],
  },
  greetz: {
    title: 'greetz',
    body: [
      '            ═══ GREETZ ═══',
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
      "     special greetz to the warez scene of '98",
      '        you taught us what intros meant',
    ],
  },
  contact: {
    title: 'contact',
    body: [
      '  email    jukben@gmail.com',
      '  web      jukben.codes',
      '  github   github.com/jukben',
      '  linkedin linkedin.com/in/jukben',
    ],
  },
}
