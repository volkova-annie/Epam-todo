const tasks = [
  {
    'id': 1,
    'value': 'помыть машину',
    'done': true
  },
  {
    'id': 2,
    'value': 'купить продукты',
    'done': false
  }
]

const taskTemplate = '<li data-id={{id}} class="task {{checked}}"><input class="js-task-checkbox task__checkbox" checked="{{checked}}" type="checkbox"/>{{value}}<div class="task__delete">x</div></li>'

document.addEventListener('DOMContentLoaded', start);

function start() {
	drawForm()
  deleteTask()
  changeTaskState()
}

function drawForm() {
	const app = document.getElementById('app');
	const html = '<form id="js-newtask-form" class="new-task"><input name="newTask" class="new-task__input" type="text" value="" placeholder="Add new task"/><button class="new-task__button">Add</button></form>'
	const form = document.createElement('form')
  app.appendChild(form)
	form.outerHTML = html
  const appendedForm = document.querySelector('#js-newtask-form')
	appendedForm.addEventListener('submit', addNewTask)
}

function addNewTask(event) {
	event.preventDefault()
	const form = event.target
	const input = form.elements.newTask
  const value = input.value

  if (value.length > 0) {
    tasks.push({'id':tasks.length+1, 'value': value, 'done': false })
  }
  console.log(tasks);

  drawTasks()
}

function drawTasks(task) {
  const ul = document.createElement('ul')
  ul.className = 'tasks'
  const app = document.getElementById('app');
  const li = tasks.map(function(el) {
    const temp = taskTemplate
    const checked = el.done ? 'is-checked' : ''
    const task = Object.assign({checked: checked}, el)
    return templater(temp)(task)
  }).join('')
  ul.innerHTML = li
  app.appendChild(ul)
}

function templater(html) {
  return function(data) {
      for (var x in data) {
        var re = '{{\\s?' + x + '\\s?}}'
        html = html.replace(new RegExp(re, 'ig'), data[x])
      }
    return html
  }
}

function changeTaskState(id) {
  // const task = document.querySelectorAll('.task')

  // input.addEventListener('change', changeTaskState)
}

function deleteTask(id) {

}
