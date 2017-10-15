let tasks = [
  // {
    // 'id': 1,
    // 'value': 'помыть машину',
    // 'done': true
  // }
]

const taskTemplate = '<li data-id={{id}} class="task {{checked}}"><input class="js-task-checkbox task__checkbox" checked type="checkbox"/>{{value}}<div class="js-delete task__delete">x</div></li>'

document.addEventListener('DOMContentLoaded', start);

function start() {
	drawForm()
  changeTaskState()
}

function drawForm() {
	const app = document.getElementById('app');
	const html = '<form id="js-newtask-form" class="new-task"><input name="newTask" class="js-input new-task__input" type="text" value="" placeholder="Add new task"/><button class="new-task__button">Add</button></form>'
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

  drawTasks()
  document.querySelector('.js-input').value = ''
}

function drawTasks(task) {
  const ul = document.createElement('ul')
  ul.className = 'tasks'
  const app = document.getElementById('app');
	const pattern = /\schecked/
  const li = tasks.map(function(el) {
    const temp = el.done ? taskTemplate : taskTemplate.replace(pattern, '')
    const checked = el.done ? 'is-checked' : ''
    const task = Object.assign({checked: checked}, el)
    return templater(temp)(task)
  }).join('')
	const findUl = document.querySelector('ul.tasks');
	ul.innerHTML = li
	if (findUl) {
		app.replaceChild(ul, findUl)
	}
	else {
  	app.appendChild(ul)
	}

	const del = [].slice.call(document.querySelectorAll('.js-delete'))
	del.forEach(function(el) {
		return el.addEventListener('click', deleteTask)
	})
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
  const task = document.querySelectorAll('.task')

  // console.log(task);
  // task.addEventListener('change', changeTaskState)
}

function deleteTask(event) {
	const task = event.target.parentNode
	const taskID = task.dataset.id
	tasks = tasks.filter(function(el) {
		return el.id != taskID
	})
	drawTasks()
}
