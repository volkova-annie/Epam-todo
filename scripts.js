const tasks = [
  // {
    // 'id': 1,
    // 'value': 'помыть машину',
    // 'done': true
  // },
  // {
    // 'id': 2,
    // 'value': 'купить продукты',
    // 'done': false
  // }
]

const taskTemplate = '<li data-id={{id}} class="task {{checked}}"><input class="js-task-checkbox task__checkbox" checked="{{checked}}" type="checkbox"/>{{value}}<div class="js-delete task__delete">x</div></li>'

document.addEventListener('DOMContentLoaded', start);

function start() {
	drawForm()
  deleteTask()
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
  // console.log(typeof value);
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
  // if (ul) {
    ul.innerHTML = li
    // console.log('hello');
    // ul.insertBefore(li, ul.childNodes[0])
  // }
  // else {
    app.appendChild(ul)
    // console.log('world');
  // }
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

  console.log(task);
  task.addEventListener('change', changeTaskState)
}

function deleteTask(id) {
  if (tasks.length > 1) {
    for (var i=0; i<tasks.length; i++) {
      var del = document.querySelectorAll('.js-delete')
      del.addEventListener('click', changeTaskState)
      // delete this.tasks[i]
    }
    // console.log('hello');

  // del.addEventListener( 'click' , function(el) {
  //   console.log('hello');

  }
    // li.remove();
    // saveState();
    // return false;
  // });

}

function changeTaskState() {
  console.log('hello');
}
