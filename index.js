import Todo from './scripts'

document.addEventListener('DOMContentLoaded', start)

function start() {
  const todo = new Todo()
  todo.init(document.body)
}
