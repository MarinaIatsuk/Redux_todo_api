import { useSelector } from "react-redux";
import TodoItem from "./TodoItem";

const TodoList = () => {
  const todos = useSelector((state) => state.todos.todos); //здесь state-это store.todos -название редъюсера из стора.todos -это массив в initialState  из todoSlise. просто называется одинаково. Взяли данные из нашего хранилища. Обратись к ветке todos, достань значения из массива todos

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} {...todo} />
      ))}
    </ul>
  );
};

export default TodoList;
