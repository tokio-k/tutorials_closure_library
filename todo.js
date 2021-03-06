goog.provide('todopad')
goog.provide('todopad.Todo')

goog.require('goog.dom')
goog.require('goog.dom.TagName');
goog.require('goog.ui.Zippy');


todopad.makeTodos = function(data, todoContainer){
    const addTodo = new todopad.AddTodo(data,todoContainer)
    addTodo.makeAddTodoDom(todoContainer);
    for(let i = 0; i < data.length; i++){
        const todo = new todopad.Todo(data[i], todoContainer)
        todo.makeTodoDom()
    }

}

todopad.AddTodo = class {
    constructor(data ,todoContainer){
        this.data = data
        this.parent = todoContainer;
    }
    makeAddTodoDom = (() => {
        this.addTodoInput = goog.dom.createDom(goog.dom.TagName.TEXTAREA, {'style': 'margin-right:30px; margin-left:30px;'})
        const addTodoBtn = goog.dom.createDom(goog.dom.TagName.INPUT, {'type': 'button', 'value': 'Save'})
        const addTitle = goog.dom.createDom(goog.dom.TagName.SPAN,null, "todoを追加")
        const addContainer = goog.dom.createDom(goog.dom.TagName.DIV, {'style': 'margin-bottom: 40px; vertical-align: middle'},addTitle ,this.addTodoInput, addTodoBtn);
        this.parent.appendChild(addContainer);
        goog.events.listen(addTodoBtn, goog.events.EventType.CLICK, this.addTodo, false, this )
    })
    addTodo = (() => {
        const title = this.addTodoInput.value;
        const newData = {title: title, done: 0}
        if(this.data){
            this.data.push(newData)
        }else{
            this.data = [newData]
        }
        localStorage.setItem('todoList', JSON.stringify(this.data))
        const todo = new todopad.Todo(newData, this.parent)
        todo.makeTodoDom()
        this.addTodoInput.value = null;
    })
}



todopad.Todo = class {
    constructor(data, todoContainer) {
        this.title = data.title;
        this.done = data.done;
        this.parent = todoContainer;
    }
    makeTodoDom(){
        const doneState = this.done ? "完了": "未完了"
        this.doneElement = goog.dom.createDom(goog.dom.TagName.BUTTON, {'style': 'margin-right:30px;'}, doneState)

        this.titleElement = goog.dom.createDom(goog.dom.TagName.SPAN, null, this.title);
        if(this.done == 1) {
            this.titleElement.style.textDecoration = "line-through"
        }
        this.editorElement = goog.dom.createDom(goog.dom.TagName.TEXTAREA);
        const saveBtn = goog.dom.createDom(goog.dom.TagName.INPUT, {'type': 'button', 'value': 'Save'});
        this.editorContainer = goog.dom.createDom(goog.dom.TagName.SPAN, {'style': 'display:none;'},this.editorElement,saveBtn);

        const todoElement = goog.dom.createDom(goog.dom.TagName.DIV, null, this.doneElement, this.titleElement, this.editorContainer)

        this.parent.appendChild(todoElement);
        goog.events.listen(this.doneElement, goog.events.EventType.CLICK, this.changeDone, false, this )
        goog.events.listen(this.titleElement, goog.events.EventType.CLICK, this.openEditor, false, this )
        goog.events.listen(saveBtn, goog.events.EventType.CLICK, this.save, false, this )
    }
    changeDone(){
        if(this.done == 0){
            this.done = 1;
            this.titleElement.style.textDecoration = "line-through"
        }else{
            this.done = 0;
            this.titleElement.style.textDecoration = "none"
        }
        this.updateStorageDone(this.done)
        this.doneElement.innerHTML = this.done ? "完了": "未完了"
    }
    updateStorageDone(done){
        const todoList = JSON.parse(localStorage.getItem('todoList'))

        // for(let i = 0; i < todoList.length; i ++){
        //     if(todoList[i].title == this.title) {
        //         todoList[i].done = done;
        //     }
        // }
        // localStorage.setItem('todoList', JSON.stringify(todoList))

        const newTodoList =  [];
        let targetTodo;
        for(let i = 0; i < todoList.length; i ++){
            if(todoList[i].title == this.title) {
                targetTodo = {title: this.title, done}
                todoList[i].done = done;
            }else{
                newTodoList.push(todoList[i])
            }
        }
        if(done == 0){
            newTodoList.unshift(targetTodo)
        }else{
            newTodoList.push(targetTodo)
        }
        localStorage.setItem('todoList', JSON.stringify(newTodoList))

    }
    save(){
        this.title = this.editorElement.value;
        this.closeEditor();
    }
    closeEditor(){
        this.titleElement.innerHTML = this.title;
        this.editorContainer.style.display = "none"
        this.titleElement.style.display = "inline"
    }
    openEditor(){
        this.editorElement.value = this.title
        this.editorContainer.style.display = "inline"
        this.titleElement.style.display = "none"
    }
}