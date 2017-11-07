const card = document.querySelector('.card')
const cardValue = card.querySelector('.value')
const cardCount = card.querySelector('.count')
const cardDesc = card.querySelector('.desc')
const hammer = new Hammer(card)
const flipClass = 'flipped'

const values = [{
  value: '0',
  desc: 'no work required',
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
  desc: 'week & a half',
},
{
  value: '80',
  desc: 'a sprint',
},
{
  value: '100',
  desc: 'sprint & a half',
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
}]

let valueIndex = 1

const flipCard = () => {
  card.classList.toggle(flipClass)

  if ('vibrate' in navigator) {
    navigator.vibrate(300)
  }
}

const updateCardValue = (increment = true) => {
  if (card.classList.contains(flipClass)) {
    return // prevent card value changing when flipped
  }

  valueIndex += increment ? 1 : -1

  if (valueIndex >= values.length) {
    valueIndex = 0
  } else if (valueIndex < 0) {
    valueIndex = values.length - 1
  }

  const current = values[valueIndex]

  card.dataset.value = current.value
  cardValue.innerHTML = current.value
  cardDesc.innerHTML = current.desc

  let countVal = ''
  const countNum = parseInt(current.value)

  for (let i = 0; i < countNum; i++) {
    countVal += '•'
  }

  cardCount.innerHTML = countVal || '~'
}

(new Shake({
  threshold: 10, // shake strength threshold
  timeout: 1000 // frequency of event generation
})).start()

window.addEventListener('shake', flipCard)
hammer.on('press', flipCard)
hammer.on('swipeleft', e => updateCardValue(true))
hammer.on('swiperight', e => updateCardValue(false))

updateCardValue(true)
