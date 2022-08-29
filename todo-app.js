(function () {

  let arrListTodo = [];
  let keyName = '';

  function createAppTitle (title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createAppForm () {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div')
    let button = document.createElement('button')

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Ведите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('disabled', 'disabled')
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener('input', function (e) {
      e.preventDefault
      if (!input.value) {
        button.setAttribute('disabled', 'disabled')
      } else {
        button.removeAttribute('disabled', 'disabled')
      }
    })

    return {
      form,
      input,
      button,
    };

  }

  function createTodoList () {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function newId (arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id
    }
    return max + 1;
  }

  //Функция сохранения в localstorage

  function saveList (arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr))
  }

  function createTodoItem (arr) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = arr.name
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger')
    deleteButton.textContent = 'Удалить';

    console.log(arr)

    if (arr.done) {
      item.classList.add('list-group-item-success');
    }

    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');

      for (const item of arrListTodo) {
        if (item.id == arr.id) {
          item.done = !item.done;
        }
        saveList(arrListTodo, keyName)
      }
    });

    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены')){
        item.remove();

        for(let i = 0; i < arrListTodo.length; i++) {
          if (arrListTodo[i].id == arr.id) {
            arrListTodo.splice(i, 1)
          }
        }
        saveList(arrListTodo, keyName)
      }
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton
    };
  }

  function createTodoApp (container, title = 'Список дел', key, listArr = []) {
    let todoAppTitle = createAppTitle(title);
    let todoAppForm = createAppForm();
    let todoList = createTodoList();

    arrListTodo = listArr

    container.append(todoAppTitle);
    container.append(todoAppForm.form);
    container.append(todoList);

    keyName = key;

    let storage = localStorage.getItem(key);

    if (storage !== null && storage !=='') {
      arrListTodo = JSON.parse(storage)
    }

    if (arrListTodo.length > 0) {
      for (const item of arrListTodo) {
        let todoItem = createTodoItem(item);
        todoList.append(todoItem.item)
      }

    }

    todoAppForm.form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!todoAppForm.input.value) {
        return
      }

      let newArray = {
        id: newId(arrListTodo),
        name: todoAppForm.input.value,
        done: false
      }

      let todoItem = createTodoItem(newArray);

      arrListTodo.push(newArray)

      todoList.append(todoItem.item)

      todoAppForm.input.value = '';

      todoAppForm.button.setAttribute('disabled', 'disabled')

      saveList(arrListTodo, keyName)
    });
  }
  window.createTodoApp = createTodoApp;
})();
