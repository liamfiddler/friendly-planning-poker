const card = document.querySelector('.card')
const cardValue = card.querySelector('.value')
const cardDesc = card.querySelector('.desc')
const hammer = new Hammer(card)

const values = [
  {
    value: '0',
    desc: 'already done',
  },
  {
    value: '½',
    desc: 'half an hour',
  },
  {
    value: '1',
    desc: 'an hour',
  },
  {
    value: '2',
    desc: 'two hours',
  },
  {
    value: '4',
    desc: 'half a day',
  },
  {
    value: '8',
    desc: 'a day',
  },
  {
    value: '16',
    desc: 'two days',
  },
  {
    value: '24',
    desc: 'three days',
  },
  {
    value: '40',
    desc: 'a week',
  },
  {
    value: '60',
    desc: 'week and a half',
  },
  {
    value: '80',
    desc: 'a sprint',
  },
  {
    value: '100',
    desc: 'sprint and a half',
  },
  {
    value: '120',
    desc: 'two sprints',
  },
  {
    value: '∞',
    desc: 'ongoing',
  },
  {
    value: '?',
    desc: 'unestimateable',
  },
]

let valueIndex = 1

const flipCard = () => {
  card.classList.toggle('flipped')

  if ('vibrate' in navigator) {
    navigator.vibrate(300)
  }
}

const updateCardValue = (increment = true) => {
  valueIndex += increment ? 1 : -1

  if (valueIndex >= values.length) {
    valueIndex = 0
  } else if (valueIndex < 0) {
    valueIndex = values.length - 1
  }

  const current = values[valueIndex]

  cardValue.innerHTML = current.value
  cardDesc.innerHTML = current.desc
}

(new Shake({
  threshold: 15, // shake strength threshold
  timeout: 1000 // frequency of event generation
})).start()

window.addEventListener('shake', flipCard)
hammer.on('swipeleft', e => updateCardValue(true))
hammer.on('swiperight', e => updateCardValue(false))
hammer.on('doubletap', flipCard)

updateCardValue(true)
