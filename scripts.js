module.exports = function() {

  this.tasks = []

  this.init = (el) => {
    this.node = el

    this.drawForm(el)
	}

	this.drawForm = (el) => {
    const html = `<form id="js-newtask-form" class="new-task">
      <input name="newTask" class="js-input new-task__input" type="text" value="" placeholder="Add new task" required/>
      <label class="new-task__deadline">Deadline:</label>
      <input name="TaskDeadline" class="js-deadline new-task__input-date" type="date" required/>
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
    </select>`

		const form = document.createElement('form')
		el.appendChild(form)
		form.outerHTML = html
    if (this.node) {
      const appendedForm = this.node.querySelector('#js-newtask-form')
      appendedForm.addEventListener('submit', this.addNewTask)

      const select = this.node.querySelector('.js-select')
      select.addEventListener('change', this.onChange)
    }
    else {
      console.error('no node')
    }
	}

  this.onChange = (event) => {
    const value = event.target.value
    const sorted = this.sort(value)
    this.drawTasks(sorted)
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
    if (this.node) {
  		this.node.querySelector('.js-input').value = ''
  		this.node.querySelector('.js-deadline').value = ''
    }
    else {
      console.error('no node')
    }
	}

	this.drawTasks = (tasks) => {
    if (this.node) {
      const taskTemplate = `<li class="task {{checked}}">
        <label data-id={{id}} for="task-{{id}}">
          <input id="task-{{id}}" class="js-task-checkbox task__checkbox" checked type="checkbox"/>{{value}}
        </label>
        <div class="js-deadline task__deadline">Deadline: {{deadline}}</div>
        <div data-id={{id}} class="js-delete task__delete">x</div>
      </li>`

      let tasksLocal = tasks || this.tasks

  		const ul = document.createElement('ul')
  		ul.className = 'tasks'
  		const pattern = /\schecked/
  		const li = tasksLocal.map((el) => {
  			const temp = el.done ? taskTemplate : taskTemplate.replace(pattern, '')
  			const checked = el.done ? 'is-checked' : ''
  			const task = Object.assign({checked: checked}, el)
  			return this.templater(temp)(task)
  		}).join('')
  		const findUl = this.node.querySelector('ul.tasks');
  		ul.innerHTML = li
  		if (findUl) {
  			this.node.replaceChild(ul, findUl)
  		}
  		else {
  			this.node.appendChild(ul)
  		}
      const checkbox = [].slice.call(this.node.querySelectorAll('.js-task-checkbox'))
      checkbox.forEach((el) => {
        return el.addEventListener('change', this.changeTaskState)
      })

  		const del = [].slice.call(this.node.querySelectorAll('.js-delete'))
  		del.forEach((el) => {
  			return el.addEventListener('click', this.deleteTask)
  		})
    }
    else {
      console.error('no node')
    }
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
    console.log(event);
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
		const taskID = task.dataset.id
		this.tasks = this.tasks.filter(function(el) {
			return el.id != taskID
		})
		this.drawTasks()
	}

  this.sort = (value) => {
    const today = new Date()
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(3,0,0,0);
    const week = new Date(new Date().getTime() + 24 * 60 * 60 * 7 * 1000)

    if (value == 'done') {
      return this.tasks.filter(function(el) {
        return el.done
  		})
    }
    else if (value == 'not-done') {
      return this.tasks.filter(function(el) {
        return el.done === false
  		})
    }
    else if (value == 'tomorrow') {
      return this.tasks.filter(function(el) {
        return new Date(el.deadline)/1000 === tomorrow/1000
      })
    }
    else if (value == 'week') {
      return this.tasks.filter(function(el) {
        return new Date(el.deadline) <= week
      })
    }
    else {
      return this.tasks
    }
  }
}
