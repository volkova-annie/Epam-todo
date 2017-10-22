export function Todo() {

  let tasks = [];

  const drawForm = (app) => {
    const html = `<form id="js-newtask-form" class="new-task">
      <input name="newTask" class="js-input new-task__input" type="text" value="" placeholder="Add new task" required/>
      <label class="new-task__deadline">Deadline:</label>
      <input name="TaskDeadline" class="js-deadline new-task__input-date" type="date" value="" required/>
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
    </select>`;

    const form = document.createElement('form');

    app.appendChild(form);
    form.outerHTML = html;

    const appendedForm = document.querySelector('#js-newtask-form');
    appendedForm.addEventListener('submit', addNewTask);

    const select = document.querySelector('.js-select');
    select.addEventListener('change', onSort);
  }

  const drawTasks = (tsks) => {
    const taskTemplate = `<li class="task {{checked}}">
      <label data-id={{id}} for="task-{{id}}">
        <input id="task-{{id}}" class="js-task-checkbox task__checkbox" checked type="checkbox"/>{{value}}
      </label>
      <div class="js-deadline task__deadline">Deadline: {{deadline}}</div>
      <div data-id={{id}} class="js-delete task__delete">x</div>
    </li>`;

    let tasksLocal = tsks || tasks;

    const ul = document.createElement('ul');
    const app = document.getElementById('todo-app');
    const pattern = /\schecked/;

    ul.className = 'tasks';
    const li = tasksLocal.map((el) => {
      const temp = el.done ? taskTemplate : taskTemplate.replace(pattern, '')
      const checked = el.done ? 'is-checked' : ''
      const task = Object.assign({checked: checked}, el)
      return templater(temp)(task)
    }).join('');
    const findUl = document.querySelector('ul.tasks');

    ul.innerHTML = li;

    if (findUl) {
      app.replaceChild(ul, findUl);
    }
    else {
      app.appendChild(ul);
    }

    const checkbox = [].slice.call(document.querySelectorAll('.js-task-checkbox'));

    checkbox.forEach((el) => {
      return el.addEventListener('change', changeTaskState);
    });

    const del = [].slice.call(document.querySelectorAll('.js-delete'));

    del.forEach((el) => {
      return el.addEventListener('click', deleteTask);
    });
  }

  const onSort = (event) => {
    const value = event.target.value;
    const sorted = sort(value);
    drawTasks(sorted);
  }

  const addNewTask = (event) => {
    event.preventDefault();

    const form = event.target;
    const input = form.elements.newTask;
    const value = input.value;
    const deadline = form.elements.TaskDeadline.value;
    const inputField = document.querySelector('.js-input').value;

    if (value.length > 0) {
      const newID = tasks.length > 0 ? tasks[tasks.length-1].id + 1 : 1;
      tasks.push({'id': newID, 'value': value, 'done': false, 'deadline': deadline });
    }

    drawTasks();

    document.querySelector('.js-input').value = '';
    document.querySelector('.js-deadline').value = '';
  }

  const templater = (html) => {
    return function(data) {
      for (var x in data) {
        var re = '{{\\s?' + x + '\\s?}}';
        html = html.replace(new RegExp(re, 'ig'), data[x]);
      }
      return html;
    }
  }

  const changeTaskState = (event) => {
    const checked = event.target.checked;
    const task = event.target.parentNode;
    const taskID = task.dataset.id;

    tasks = tasks.map(function(el) {
      if (el.id == taskID) {
        el.done = checked;
      }
      return el;
    });

    drawTasks();
  };

  const deleteTask = (event) => {
    if (confirm('You sure?')) {
      const task = event.target;
      const taskID = task.dataset.id;

      tasks = tasks.filter(function(el) {
        return el.id != taskID;
      });

      drawTasks();
    }
  }

  const sort = (value) => {
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(3,0,0,0);
    const week = new Date(new Date().getTime() + 24 * 60 * 60 * 7 * 1000);

    switch (value) {
      case 'done':
        return tasks.filter(function(el) {
          return el.done;
        });
        break;

      case 'not-done':
        return tasks.filter(function(el) {
          return el.done === false;
        });
        break;

      case 'tomorrow':
        return tasks.filter(function(el) {
          return new Date(el.deadline)/1000 === tomorrow/1000;
        });
        break;

      case 'week':
        return tasks.filter(function(el) {
          return new Date(el.deadline) <= week;
        });
        break;

      default:
        return tasks;
    }
  }

  this.init = (el) => {
    let app = document.createElement('div');

    app.id = 'todo-app';
    app = el.appendChild(app);

    drawForm(app);
  }
}
