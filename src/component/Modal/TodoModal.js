import React, { useState, useEffect } from "react";

import CloseSVG from "../../assets/svg/close.svg";

const TodoModal = ({
  CloseModal,
  updateModal,
  handleUpdateTodo,
  handleSaveTodo,
}) => {
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (updateModal) {
      setTitle(updateModal.title);
      setCompleted(updateModal.completed);
    }
  }, []);

  const UpdateOnClick = () => {
    const newUpdateData = {
      ...updateModal,
      title,
      completed,
    };
    handleUpdateTodo(newUpdateData, updateModal);
  };

  const SaveOnClick = () => {
    const newSaveTodoData = {
      title,
      completed,
    };

    handleSaveTodo(newSaveTodoData);
  };

  return (
    <div className="container">
      <div className="modal">
        <span className="modal-title">{updateModal ? "Update Todo" : "Create Todo"}</span>
        <textarea
          className="testarea"
          rows={5}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        {updateModal ? (
          <span className="btn" onClick={UpdateOnClick}>
            Update
          </span>
        ) : (
          <span className="btn" onClick={SaveOnClick}>
            Save
          </span>
        )}
        <span onClick={CloseModal} className="close">
          <img src={CloseSVG} alt="close" />
        </span>
      </div>
    </div>
  );
};

export default TodoModal;
