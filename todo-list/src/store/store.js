import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import axios from 'axios'
import Axios from 'axios';
import {fs} from 'fs'

Vue.use(Vuex)
axios.defaults.baseURL =  'http://localhost:8000/api'

export const store = new Vuex.Store({
    state:{
        filter: 'all',
        todos: [
            // {
            //   'id': 1,
            //   'title': 'Finish Vue TodoList',
            //   'completed': false,
            //   'editting': false,
            // },
            // {
            //   'id': 2,
            //   'title': 'Learn English',
            //   'completed': false,
            //   'editting': false,
            // }
          ]
    },
    methods: {
      
    },
    getters: {
          remaining(state) {
            return state.todos.filter(todo => !todo.completed).length 
          },
          
          anyRemaining(state, getters) {
            return getters.remaining != 0
          },
      
          todosFiltered(state){
            if(state.filter == 'all'){
              return state.todos
            } else if (state.filter == 'active') {
              return state.todos.filter(todo => !todo.completed)
            } else if (state.filter == 'completed') {
              return state.todos.filter(todo => todo.completed)
            }
            return state.todos
          },
      
          showClearCompletedButton(state) {           
            return state.todos.filter(todo => todo.completed).length > 0
          }
    },
    mutations: {
      addTodo(state, todo){
        state.todos.push({
          id: todo.id,
          title: todo.title,
          completed: false,
          editting: false,
        })
      },
      clearCompleted(state){
        state.todos = state.todos.filter(todo => !todo.completed)
      },
      updateFilter(state, filter){
        state.filter = filter
      },
      checkAll(state, checked) {
      state.todos.forEach(todo => (todo.completed = checked))
      },
      deleteTodo(state, id){
        const index = state.todos.findIndex(item => item.id == id)
        state.todos.splice(index, 1)
      },
      updateTodo(state, todo){
        const index = state.todos.findIndex(item => item.id == todo.id)
        state.todos.splice(index, 1, {
              'id': todo.id,
              'title': todo.title,
              'completed': todo.completed,
              'editting': todo.editting,
          })
      },
      retrieveTodos(state, todos){
        state.todos = todos;
      },
    },
    actions: {
      retrieveTodos(context){
        axios.get('/todos')
          .then(response => {
            context.commit('retrieveTodos', response.data)
          })
          .catch(error => {
            console.log(error)
          })
      },

      addTodo(context, todo){
        // setTimeout(() => {
        //   context.commit('addTodo', todo)
        // }, 1000)
        axios.post('/todos', {
          title: todo.title,
          completed: false,
        })
          .then(response => {
            context.commit('addTodo', response.data)
          })
          .catch(error => {
            console.log(error)
          })
      },
      clearCompleted(context){
        const completed = store.state.todos
          .filter(todo => todo.completed)
          .map(todo => todo.id)
        axios.delete('/todosDeleteCompleted',{
          data: {
            todos: completed
          }
        })
          .then(response => {
            context.commit('clearCompleted')
          })
          .catch(error => {
            console.log(error)
          })

      },
      updateFilter(context, filter){
        // setTimeout(() => {
        //   context.commit('updateFilter', filter)
        // }, 1000) 
        context.commit('updateFilter', filter)
      },
      checkAll(context, checked){
        // setTimeout(() => {
        //   context.commit('checkAll', checked)
        // }, 1000)
        axios.patch('/todosCheckAll',{
          completed: checked,
        })
          .then(response => {
            context.commit('checkAll', checked)
          })
          .catch(error => {
            console.log(error)
          })
      },
      deleteTodo(context, id){
        // setTimeout(() => {
        //   context.commit('deleteTodo', id)
        // }, 1000)
        axios.delete('/todos/' + id)
          .then(response => {
            context.commit('deleteTodo', id)
          })
          .catch(error => {
            console.log(error)
          })

      },
      updateTodo(context, todo){
        // setTimeout(() => {
        //   context.commit('updateTodo', todo)
        // }, 1000) 
        axios.patch('/todos/' + todo.id, {
          title: todo.title,
          completed: todo.completed,
        })
          .then(response => {
            context.commit('updateTodo', response.data)
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
})
