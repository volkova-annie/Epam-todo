module.exports = function() {

  this.tasks = []

  this.init = (el) => {
    let app = document.createElement('div')
    app.id = 'todo-app'

    app = el.appendChild(app)

    this.drawForm(app)

	}

	this.drawForm = (app) => {
		const html = `<form id="js-newtask-form" class="new-task">
      <input name="newTask" class="js-input new-task__input" type="text" value="" placeholder="Add new task"/>
      <label class="new-task__deadline">Deadline:</label>
      <input name="TaskDeadline" class="js-deadline new-task__input-date" type="date" value=""/>
      <button class="new-task__button">Add</button>
    </form>
    <label>Sort:</label>
    <select class="tasks-select js-select">
      <option value="" selected>---</option>
      <option value="all">All</option>
      <option value="done">Done</option>
      <option value="not-done">Not done</option>
      <option value="tomorrow">For tomorrow</option>
      <option value="week">For week</option>
    </select>
    `
		const form = document.createElement('form')
		app.appendChild(form)
		form.outerHTML = html
		const appendedForm = document.querySelector('#js-newtask-form')
		appendedForm.addEventListener('submit', this.addNewTask)

    const select = document.querySelector('.js-select')
    select.addEventListener('change', this.sort)
	}

	this.addNewTask = (event) => {
		event.preventDefault()

		const form = event.target
		const input = form.elements.newTask
		const value = input.value
    const deadline = form.elements.TaskDeadline.value

		if (value.length > 0) {
      const newID = this.tasks.length > 0 ? this.tasks[this.tasks.length-1].id + 1 : 1
			this.tasks.push({'id': newID, 'value': value, 'done': false, 'deadline': deadline })
		}

		this.drawTasks()
		document.querySelector('.js-input').value = ''
	}

	this.drawTasks = () => {
		// const taskTemplate = '<li data-id={{id}} class="task {{checked}}"><input class="js-task-checkbox task__checkbox" checked type="checkbox"/>{{value}}<div class="js-delete task__delete">x</div></li>'
    const taskTemplate = `<li class="task {{checked}}">
      <label data-id={{id}} for="task-{{id}}">
        <input id="task-{{id}}" class="js-task-checkbox task__checkbox" checked type="checkbox"/>{{value}}
      </label>
      <div class="js-deadline task__deadline">{{deadline}}</div>
      <div data-id={{id}} class="js-delete task__delete">x</div>

    </li>`

		const ul = document.createElement('ul')
		ul.className = 'tasks'
		const app = document.getElementById('todo-app');
		const pattern = /\schecked/
		const li = this.tasks.map((el) => {
			const temp = el.done ? taskTemplate : taskTemplate.replace(pattern, '')
			const checked = el.done ? 'is-checked' : ''
			const task = Object.assign({checked: checked}, el)
			return this.templater(temp)(task)
		}).join('')
		const findUl = document.querySelector('ul.tasks');
		ul.innerHTML = li
		if (findUl) {
			app.replaceChild(ul, findUl)
		}
		else {
			app.appendChild(ul)
		}
    const checkbox = [].slice.call(document.querySelectorAll('.js-task-checkbox'))
    checkbox.forEach((el) => {
      return el.addEventListener('change', this.changeTaskState)
    })

		const del = [].slice.call(document.querySelectorAll('.js-delete'))
		del.forEach((el) => {
			return el.addEventListener('click', this.deleteTask)
		})
	}

	this.templater = (html) => {
		return function(data) {
			for (var x in data) {
				var re = '{{\\s?' + x + '\\s?}}'
				html = html.replace(new RegExp(re, 'ig'), data[x])
			}
			return html
		}
	}

	this.changeTaskState = (event) => {
		const checked = event.target.checked
		const task = event.target.parentNode
		const taskID = task.dataset.id
		this.tasks = this.tasks.map(function(el) {
			if (el.id == taskID) {
				el.done = checked
			}
			return el
		})
    this.drawTasks()
	}

	this.deleteTask = (event) => {
		const task = event.target
		// const task = event.target.parentNode
		const taskID = task.dataset.id
		this.tasks = this.tasks.filter(function(el) {
			return el.id != taskID
		})
		this.drawTasks()
	}

  this.sort = (event) => {
    const value = event.target.value
    const today = new Date()
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(3,0,0,0);
    const week = new Date(new Date().getTime() + 24 * 60 * 60 * 7 * 1000)
    if (value == 'done') {
      this.tasks = this.tasks.filter(function(el) {
        return el.done == true
  		})
    }
    else if (value == 'not-done') {
      this.tasks = this.tasks.filter(function(el) {
        return el.done != true
  		})
    }
    else if (value == 'tomorrow') {
      this.tasks = this.tasks.filter(function(el) {
        console.log(new Date(el.deadline));
        console.log(new Date(tomorrow));
        return new Date(el.deadline) == tomorrow
      })
    }
    else if (value == 'week') {
      this.tasks = this.tasks.filter(function(el) {
        return new Date(el.deadline) <= week
      })
    }
    else {
      return this.tasks
    }
    this.drawTasks()
  }
}
