import { Fragment, useMemo, useRef, useState } from "react";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import {
  faCircleCheck,
  faCircleXmark,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useShallow } from "zustand/react/shallow";
import { motion } from "framer-motion";
import { format } from "date-fns";

import { STATUS_COLOR } from "@/constants/color";
import useTodoStore from "@/state/useTodoStore";
import { STATUS_LABEL } from "@/constants/todo";
const TodoCard = ({
  todo,
  handleClick,
  index,
  handleDelete,
  handleToggleStatus,
  currentTodo,
}) => {
  const { actions, todos } = useTodoStore(
    useShallow((state) => ({ actions: state.actions, todos: state.todos }))
  );
  const { reorderTodos } = actions;
  const todoItemDrag = useRef();
  const todoItemDragOver = useRef();
  const [overLay, setOverLay] = useState(false);
  const status = useMemo(() => {
    let statusResult = todo.status;
    if (
      new Date(todo.dueDate) < new Date(format(new Date(), "yyyy-MM-dd")) &&
      todo.status === "pending"
    ) {
      statusResult = "overDue";
    }
    return {
      color: STATUS_COLOR[statusResult],
      label: STATUS_LABEL[statusResult],
    };
  }, [todo.status, todo.dueDate]);

  const handleDragStart = () => {
    todoItemDrag.current = index;
  };
  const handleDragEnter = () => {
    todoItemDragOver.current = index;

    const currentTodos = [...todos];

    let finalTodos = [];

    currentTodos.forEach((todo) => {
      finalTodos.push({
        ...todo,
        isDragging: false,
      });
    });

    finalTodos[index].isDragging = true;

    reorderTodos(finalTodos);
  };
  const handleDragEnd = () => {
    const currentTodos = [...todos];

    const todoItemMain = currentTodos[todoItemDrag.current];
    currentTodos.splice(todoItemDrag.current, 1);
    currentTodos.splice(todoItemDragOver.current, 0, todoItemMain);

    todoItemDrag.current = null;
    todoItemDragOver.current = null;

    let finalTodos = [];

    currentTodos.forEach((todo) => {
      finalTodos.push({
        ...todo,
        isDragging: false,
      });
    });

    reorderTodos(finalTodos);
  };
  return (
    <Fragment
      key={todo.id}
      // initial={{ x: -30 }}
      // animate={{ x: 0 }}
      // exit={{ x: 30 }}
      // transition={{ duration: 0.3 }}
    >
      <Box
        draggable
        droppable
        onDragStart={handleDragStart}
        onDragEnter={handleDragEnter}
        onDragEnd={handleDragEnd}
        sx={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          padding: "10px",
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
          maxWidth: "100%",
          flexShrink: "0",
          border:
            currentTodo.id === todo.id
              ? "3px solid #0277bd"
              : "1px solid black",
        }}
        onClick={handleClick}
        onMouseEnter={() => {
          setOverLay(true);
        }}
        onMouseLeave={() => {
          setOverLay(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            zIndex: "999",
            height: "100%",
            top: "0",
            left: "0",
            right: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            backgroundColor: "rgba(0,0,0,0.4)",
            visibility: overLay ? "visible" : "hidden",
            opacity: overLay ? 1 : 0,
            pointerEvents: overLay ? "auto" : "none",
            transition: "opacity 0.3s ease-in-out",
            cursor: todo.isDragging ? "grab" : "pointer",
          }}
        >
          <IconButton
            color="success"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus();
            }}
          >
            <FontAwesomeIcon
              icon={todo.status === "pending" ? faCircleCheck : faCircleXmark}
            />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(e);
            }}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flex: "1",
            maxWidth: "100%",
          }}
        >
          <Typography
            className="truncate"
            sx={{ flex: "1" }}
            title={todo.title}
          >
            {todo.title}
          </Typography>
          <Chip variant="filled" color={status.color} label={status.label} />
        </Box>
      </Box>
      {todo.isDragging && <Box className="drag-indicator"></Box>}
    </Fragment>
  );
};

export default TodoCard;
