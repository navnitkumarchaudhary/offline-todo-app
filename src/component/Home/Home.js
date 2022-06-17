import React, { useState, useEffect } from "react";

import {
  createTodo,
  deleteTodo,
  getAllTodo,
  updateTodo,
} from "../../apiHandler";
import TodoModal from "../Modal/TodoModal";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [updateModal, setUpdateModal] = useState(null);
  const [saveModal, setSaveModal] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const cacheTodo = JSON.parse(localStorage.getItem("todo"));
    console.log("==", navigator.onLine);
    if (isOnline) {
      getAllTodo().then((res) => {
        updateTodoListToCache(res.data);
      });
      const pendingTask = JSON.parse(localStorage.getItem("pendingTask"));
      pendingTask && handlePendingTask(pendingTask);
    } else {
      console.log("====", cacheTodo);
      setIsOnline(false);
      setTodos(cacheTodo);
    }
  }, [isOnline]);

  const CloseModal = () => {
    setUpdateModal(null);
    setSaveModal(false);
  };

  const handlePendingTask = (taskArray) => {
    taskArray.forEach((task) => {
      if (task.type === "save") {
        createTodo(task.data).then((res) => {
          console.log(res);
        });
      } else if (task.type === "update") {
        updateTodo(task.data, task.data.id).then((res) => {
          console.log(res);
        });
      } else if (task.type === "delete") {
        deleteTodo(task.data).then((res) => {});
      }
    });
    if (navigator.onLine) {
      localStorage.removeItem("pendingTask");
    }
  };

  const StorePendingRequest = (task) => {
    const pendingTask = JSON.parse(localStorage.getItem("pendingTask"));
    if (pendingTask) {
      pendingTask.push(task);
      localStorage.setItem("pendingTask", JSON.stringify(pendingTask));
    } else {
      localStorage.setItem("pendingTask", JSON.stringify([task]));
    }
  };

  const updateTodoListToCache = (data) => {
    localStorage.setItem("todo", JSON.stringify(data));
    setTodos(data);
  };

  const updateLocalCache = (newUpdateData) => {
    const copyTodoList = [...todos];
    copyTodoList[copyTodoList.findIndex((el) => el.id === newUpdateData.id)] =
      newUpdateData;
    updateTodoListToCache(copyTodoList);
  };

  const saveLocalCache = (newTodo) => {
    const copyTodoList = [...todos];
    copyTodoList.unshift(newTodo);
    updateTodoListToCache(copyTodoList);
  };

  const DeleteTodoOnLocalCache = (id) => {
    let copyTodoList = [...todos];
    copyTodoList = copyTodoList.filter((el) => el.id !== id);
    updateTodoListToCache(copyTodoList);
  };

  const handleSaveTodo = (newtodoData) => {
    if (navigator.onLine) {
      !isOnline && setIsOnline(true);
      createTodo(newtodoData).then((res) => {
        console.log(res);
        saveLocalCache(res.data);
        CloseModal();
      });
    } else {
      newtodoData.id = todos.length + 1;
      saveLocalCache(newtodoData);
      const task = {
        type: "save",
        data: newtodoData,
      };
      StorePendingRequest(task);
      CloseModal();
      isOnline && setIsOnline(false);
    }
  };

  const handleUpdateTodo = (newUpdateData, id) => {
    if (navigator.onLine) {
      !isOnline && setIsOnline(true);
      updateTodo(newUpdateData, updateModal.id).then((res) => {
        updateLocalCache(newUpdateData);
        CloseModal();
      });
    } else {
      updateLocalCache(newUpdateData);
      const task = {
        type: "update",
        data: newUpdateData,
      };
      StorePendingRequest(task);
      CloseModal();
      isOnline && setIsOnline(false);
    }
  };

  const handleDeleteTodo = (id) => {
    if (navigator.onLine) {
      !isOnline && setIsOnline(true);
      deleteTodo(id).then((res) => {
        console.log(res);
        DeleteTodoOnLocalCache(id);
      });
    } else {
      DeleteTodoOnLocalCache(id);
      const task = {
        type: "delete",
        data: id,
      };
      StorePendingRequest(task);
      isOnline && setIsOnline(false);
    }
  };

  return (
    <div className="Home">
      <span className="create" onClick={() => setSaveModal(true)}>
        Create Todo
      </span>
      {!isOnline && (
        <span className="disconnected">You are disconnected..</span>
      )}
      {todos &&
        todos.map((e, el) => {
          return (
            <div className="todoContainer" key={e.id}>
              <span className="title">{e.title}</span>

              <div className="todoContainer-btn">
                <span className="edit-btn" onClick={() => setUpdateModal(e)}>
                  Edit
                </span>
                <span
                  className="delete-btn"
                  onClick={() => handleDeleteTodo(e.id)}
                >
                  Delete
                </span>
              </div>
            </div>
          );
        })}

      {!todos && (
        <h1>
          No any todo found. Please click on create button to create a new Todo.
        </h1>
      )}

      {updateModal && (
        <TodoModal {...{ CloseModal, updateModal, handleUpdateTodo }} />
      )}
      {saveModal && <TodoModal {...{ CloseModal, handleSaveTodo }} />}
    </div>
  );
};

export default Home;
