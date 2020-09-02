

import React, { createContext } from 'react';
import { useState } from 'react';
import uuid from 'uuid/v4';
import {useReducer} from 'react';
import {useContext } from 'react';
import useCombinedReducers from 'use-combined-reducers';

///Advanced HOOKS


//const DispatchContext = createContext(null);


const initialTodos = [
    {
      id: uuid(),
      task: 'Learn React',
      complete: true,
    },
    {
      id: uuid(),
      task: 'Learn Firebase',
      complete: true,
    },
    {
      id: uuid(),
      task: 'Learn GraphQL',
      complete: false,
    },
  ];
const filterReducer =(state,action) => {
    switch(action.type){
        case 'SHOW_ALL':
             return "ALL";
        case 'SHOW_COMPLETE':
             return "COMPLETE"
        case 'SHOW_INCOMPLETE':
            return "INCOMPLETE"
        default:
            return state  
    }
}


const todoReducer = (state,action) => {
    switch(action.type){

        case 'DO_TODO':
            return state.map((todo)=>{
                    if(todo.id === action.id){
                        return {...todo,complete: !todo.complete}
                    }
                    else{
                        return todo;
                    }
            })
        case 'UNDO_TODO':
            return state.map((todo)=>{
                if(todo.id === action.id){
                    return {...todo,complete: !todo.complete}
                }
                else{
                    return todo
                }
        })
        case 'ADD_TODO':
        
          return state.concat({id:uuid(),task: action.task, complete : false})  
           
        default:
            return state          
    }
} 




const Filter = () => {

    const dispatch = useContext(DispatchContext);

    const handleShowAll = () =>{
        dispatch({type: 'SHOW_ALL' });
    }
    
    const handleShowComplete = () => {
        
        dispatch({type : 'SHOW_COMPLETE'});
    }
    
    const handleShowIncomplete = () => {
        
        dispatch({type: 'SHOW_INCOMPLETE'});
    
    }

    return (
        <div>
            <button type="button" onClick={() => handleShowAll()}>Show All</button>
           <button type="button" onClick={() => handleShowComplete()}>Show Complete</button>
           <button type="button" onClick={() => handleShowIncomplete()}>Show Incomplete</button>
        </div>
    );

}

const TodoList = ({filteredTodos}) => {
    
    const dispatch = useContext(DispatchContext);
    return (
        <div>
        <ul>
            {filteredTodos.map((todo) =>  
            <TodoItem key={todo.id} dispatch={dispatch} todo={todo}></TodoItem>
            )}
        </ul>
    
    </div>



    );
   
}
const TodoItem = ({dispatch,todo}) => {
    const handleChangeCheckbox = (todo) => {
        dispatch({type:todo.complete ? 'UNDO_TODO' : 'DO_TODO',id:todo.id});
    }
    return (
    <li >
                    <label>
                        {todo.task}
                    </label>
                    <input type="checkbox" checked={todo.complete} onChange={() =>handleChangeCheckbox(todo)}/>
                </li>
    );
}

const AddTodo = () => {

    const [ task ,setTask ] = useState(' ');

    const dispatch = useContext(DispatchContext);

    const handleChangeInput = (e) => {
            setTask(e.target.value);
    }

    const handleSubmit = (e) => {
        console.log("This is the added elemet", task);
        if(task){
            dispatch({type:"ADD_TODO", task: task})
        }
     
        e.preventDefault();
            
    }

    return (
        <div>
        <form onSubmit={handleSubmit}>
        <input type="input" value={task} onChange={handleChangeInput}/>
        <button type="submit">Add Todo</button>
        </form>
        </div>
    );

}
const App = () => {

    // const [todos, dispatchTodos ] = useReducer(todoReducer,initialTodos);
    // const [ filter , dispatchFilter ] = useReducer(filterReducer,'ALL');

    const [state , dispatch ] = useCombinedReducers({
        todos : useReducer(todoReducer,initialTodos),
        filter : useReducer(filterReducer,'ALL')
    })

    // const dispatch = (action) => [dispatchTodos,dispatchFilter].forEach((fn) => fn(action)) 

    // const state = {
    //     filter,
    //     todos
    // }

    const filteredTodos = state.todos.filter((todo) => {
            if(state.filter === 'ALL'){
                return true;
            }
            if(state.filter === 'COMPLETE' && todo.complete) {
                return true;
            }
            if(state.filter === 'INCOMPLETE' && !todo.complete){
                return true;
            }
            return false;
    })

  

//     return (
//         <DispatchContext.Provider value={dispatch}>
//         <Filter/>
//         <TodoList filteredTodos={filteredTodos} />
//         <AddTodo/>
//         </DispatchContext.Provider>
//     );
// }


export default App;




