<template>
  <div>
      <input type="text" class="todo-input" placeholder="What need to be done" v-model="newTodo" @keyup.enter="addTodo()">
      <transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown" >
      <todo-item v-for="(todo, index) in todosFiltered" :key="todo.id" class="todo-item" :todo="todo" :index="index" :checkAll="!anyRemaining" >
      </todo-item>
      </transition-group>
      <div class="extra-container">
        <todo-check-all>
        </todo-check-all>
        <todo-item-remaining>
        </todo-item-remaining>
      </div>
      <div class="extra-container">
        <todo-filter></todo-filter>
        <div>
          <transition name="fade">
          <todo-clear-completed></todo-clear-completed>
          </transition>
        </div>
      </div>
      <div class="download">
        <a href="javascript:void(0)" id="dlbtn"><button @click="jsonDownload">Download Data</button></a>
      </div>
  </div>
  
</template>
<script>

import TodoItem from './TodoItem'
import TodoItemRemaining from './TodoItemRemaining'
import TodoCheckAll from './TodoCheckAll'
import TodoFilter from './TodoFilter'
import TodoClearCompleted from './TodoClearCompleted'
export default {
  name: 'todo-list',
  components: {
    TodoItem,
    TodoItemRemaining,
    TodoCheckAll,
    TodoFilter,
    TodoClearCompleted,
  },
  data () {
    return {
      newTodo: '',
      idForTodo: 3,
      beforeEditCache: '',
    }
  },

  created(){
    this.$store.dispatch('retrieveTodos')
  },

  computed: {
    remaining() {
      return this.$store.getters.remaining
    },
    
    anyRemaining() {
      return this.$store.getters.anyRemaining
    },

    todosFiltered(){
      return this.$store.getters.todosFiltered
    },

    showClearCompletedButton() {
      return this.$store.getters.showClearCompletedButton
    }
  },  
  directives: {
    focus: {
      inserted: function (el) {
          el.focus()
        }
      }
  },
  methods: {
    jsonDownload(){
      var txtFile = "test.txt";
      var file = new File([''],txtFile);
      var jsonexport = require('jsonexport');
      var jsonOject = this.$store.state.todos
      var str = JSON.stringify(jsonOject);


      const blob = new Blob([str], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
      a.download = "todoJSON.text";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);

    },

    addTodo(){
      if(this.newTodo.trim().length == 0){
        return
      }

      this.$store.dispatch('addTodo', {
        id: this.idForTodo,
        title: this.newTodo,
      })

      this.newTodo = ''
      this.idForTodo++;
    },
  }
}


</script>

<style lang="scss">
    @import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");
    .todo-input{
      width: 100%;
      padding: 10px 18px;
      font-size: 18px;
      margin-bottom: 16px;

      &:focus {
        outline: 0;
      }
    }

    .todo-item{
      margin-bottom: 12px;
      display: flex;
      align-content: center;
      justify-content: space-between;
      animation-duration: 0.3s;
    }

    .todo-item-left {
      display: flex;
      align-content: center;
    }

    .remove-item{
      cursor: pointer;
      margin-left: 14px;
      &:hover{
        color: black;
      }
    }

    .todo-item-label {
      padding: 10x;
      border: 1px solid white;
      margin-left: 12px;
    }

    .todo-item-edit{
      font-size: 24px;
      color: #2c3e50;
      margin-left: 12px;
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      font-family: 'Avenir', Arial, Helvetica, sans-serif;

      &:focus{
        outline: none;
      }
    }

    .completed{
      text-decoration: line-through;
      color: grey;
    }

    .extra-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      border-top: 1px solid lightgrey;
      padding-top: 14px;
      margin-bottom: 14px;
    }

    button{
      // font-size: 14px;
      // background-color: white;
      background-color: grey; /* Green */
      border: none;
      color: white;
      padding: 5px 15px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      appearance: none;
      &:hover{
        background-color: lightseagreen;
      }
      &:focus{
        outline: none;
      }
    }
    
    .active {
      background: lightseagreen;
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity .1s;
    }

    .fade-enter, .fade-leave-to {
      opacity: 0;
    }

</style>
