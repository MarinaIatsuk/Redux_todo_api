import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTodos = createAsyncThunk(
  //принимает имя экшена и асинхронная функция, которая принимает ссылку
  "todos/fetchTodos", //имя
  async function (_, { rejectWithValue }) {
    //здесь функция принимает два параметра и нам нужен второй
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=15"
      ); //plaseholder позволяет так установить лимит
      console.log(response); //выдает данные, в которых есть "ok: true", то есть ответ ок

      if (!response.ok) {
        throw new Error("что-то пошло не так");
      } //если ответ не ок, то выброси ошибку
      const data = await response.json();
      return data; //возвращает во внешний мир дату
    } catch (error) {
      return rejectWithValue(error.message); //вернем сообщение ошибки
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async function (id, { rejectWithValue, dispatch }) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        { method: "DELETE" }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("cant delete");
      }
      dispatch(removeTodo({ id })); //через диспатч вызвали функцию, которая внизу
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const setError = (state, action) => {
  state.status = "rejected";
  state.error = action.payload; //сообщили, что есть ошибка, кот хранится в
};

export const toggleStatus = createAsyncThunk(
  "todos/toggleStatus",
  async function (id, { rejectWithValue, dispatch, getState }) {
    //getState возвращает общий стэйт
    const todo = getState().todos.todos.find((todo) => todo.id === id);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            completed: !todo.completed,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("cant toggle");
      }
      const data = await response.json();
      console.log(data);
      dispatch(toggleComplete({ id })); //через диспатч вызвали функцию, которая внизу
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewTodo = createAsyncThunk(
  "todos/addNewTodo",
  async function (text, { rejectWithValue, dispatch }) {
    try {
      const todo = {
        title: text,
        userID: 1,
        completed: false,
      };
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          body: JSON.stringify(todo),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) {
        throw new Error("cant add");
      }

      const data = await response.json();
      console.log(data);
      dispatch(addTodo(data));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    status: null,
    error: null,
  },
  reducers: {
    addTodo(state, action) {
      console.log(state);
      console.log(action);

      state.todos.push(action.payload); //отправь в todos: [] новый элемент
    },
    toggleComplete(state, action) {
      const toggledTodo = state.todos.find(
        (todo) => todo.id === action.payload.id
      );
      toggledTodo.completed = !toggledTodo.completed;
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload.id); //в action.payload  всегда приходит то, что складируем (в данном случае в файле TodoItem dospatch(removeTodo({id})))
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.pending, (state) => {
      (state.status = "loading"), (state.error = null);
    }); //загрузка
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.status = "resolved";
      state.todos = action.payload; //положить в todos набор данных
    }); //положить в todos набор данных
    //успешно получены данные
    builder.addCase(fetchTodos.rejected, (state) => {
      setError;
    }); //возникла ошибка
    builder.addCase(deleteTodo.rejected, (state) => {
      setError;
    }); //возникла ошибка
    builder.addCase(toggleStatus.rejected, (state) => {
      setError;
    }); //возникла ошибка
  },
});

export const { addTodo, toggleComplete, removeTodo } = todoSlice.actions; //передаем экшены из редъюсеров upd: сейчас export можно убрать, так как эти константы по отдельности не используются на других страницах.

export default todoSlice.reducer; //экспортируем сас редъюсер
