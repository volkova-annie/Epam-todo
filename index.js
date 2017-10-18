import Todo from './scripts'

document.addEventListener('DOMContentLoaded', start)

function start() {
  const todo1 = new Todo()
  todo1.init(document.querySelector('.test1'))
  const todo2 = new Todo()
  todo2.init(document.querySelector('.test2'))
}
