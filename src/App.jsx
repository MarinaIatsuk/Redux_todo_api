import {useState, useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';

import { addNewTodo,fetchTodos } from './Store/Slice/todoSlice';
import NewTodoForm from './Components/NewTodoForm';
import TodoList from './Components/TodoList';

import './App.css';


function App() {
  const [text, setText] = useState('');
  const{status,error}=useSelector(state=>state.todos)//достаем статус и ошибку, если она есть
  const dispatch = useDispatch(); //ф-ция, кот приводит к тому, что срабатывает триггер к тому, что какой-то экшн произошел, что его пора передать в редьюсер

  const handleAction = () => {
    if(text.trim().length) {
      dispatch(addNewTodo(text));
      setText('');
    }
  }
  useEffect(()=>{
    dispatch(fetchTodos())
  },[])

  return (
    <div className='App'>
      <NewTodoForm
        value={text}
        updateText={setText}
        handleAction={handleAction}
      />
      {status==='loading...'&& <h2>Loading</h2>} 
      {error && <h2>Error:{error}</h2>} 
      <TodoList />
    </div>
  );
}
//{status==='loading'&& <h2>Loading...</h2>}  - если статус=загрузке, дай спиннер
//{error && <h2>Error:{error}</h2>}  - если ошибка, то выдай ее

export default App;