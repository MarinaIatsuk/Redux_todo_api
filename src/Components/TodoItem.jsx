import { useDispatch } from "react-redux";
import { toggleStatus, deleteTodo } from "../Store/Slice/todoSlice";

const TodoItem = ({ id, title, completed }) => {
  const dispatch = useDispatch(); //создай функцию, которая с этим стором будет взаимодействовать. В диспетчер передается событие (функция из редъюсера), в эту функцию может передаваться набор данных

  return (
    <li>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => dispatch(toggleStatus( id ))}
      />
      <span>{title}</span>
      <span onClick={() => dispatch(deleteTodo(id))}>&times;</span>
    </li>
  );
  //dispatch, вызови наш экшн removeTodo и передай туда айди (делаем его объектом, так как это хороший тон)
};

export default TodoItem;
