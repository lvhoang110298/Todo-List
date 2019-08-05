<template>
    <div class="todo-item">
         <div class="todo-item-left">
          <input type="checkbox" v-model="completed" @change="doneEdit">
          <div v-if="!editting" @dblclick="editTodo" class="todo-item-label" :class="{ completed :completed }">
            {{title}}
          </div>
          <input v-else class="todo-item-edit" type="text" v-model="title" @blur="doneEdit" @keyup.enter="doneEdit" v-focus @keyup.esc="cancelEdit">
        </div>
        <div>
            <span class="remove-item" @click="removeTodo(id)">
                &times;
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'todo-item',
    props: {
        todo: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        checkAll: {
            type: Boolean,
            required: true,
        }
    },
    data() {
        return {
            'id': this.todo.id,
            'title': this.todo.title,
            'completed': this.todo.completed,
            'editting': this.todo.editting,
            'beforeEditCache': '',
        }
    },

    created(){
        eventBus.$on('pluralize', this.handlePluralize)
    },

    beforeDestroy(){
        eventBus.$off('pluralize', this.handlePluralize)
    },

    watch: {
        checkAll(){
            if(this.checkAll){
                this.completed = true
            } else {
                this.completed = this.todo.completed
            }
        }
    },
    directives: {
        focus: {
        // directive definition
        inserted: function (el) {
            el.focus()
            }
        }
    },

    methods: {
        removeTodo(id){
            this.$store.dispatch('deleteTodo', id)
        },
        editTodo(){
            this.beforeEditCache = this.title
            this.editting = true
        },
        doneEdit(){
            if(this.title.trim() == ''){
                this.title = this.beforeEditCache
            }
            this.editting = false
            this.$store.dispatch('updateTodo', {
                'id': this.id,
                'title': this.title,
                'completed': this.completed,
                'editting': this.editting,
            })
        },

        cancelEdit(){
            this.title = this.beforeEditCache
            this.editting = false
        },

        pluralize() {
            eventBus.$emit('pluralize')
        },

        handlePluralize(){
            this.title = this.title + 's'
            const index = this.$store.state.todos.findIndex(item => item.id == this.id)
            this.$store.state.todos.splice(index, 1, {
                'id': this.id,
                'title': this.title,
                 'completed': this.completed,
                'editting': this.editting,
            })
        }
    }
}
</script>
