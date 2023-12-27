import { useEffect, useMemo, useState } from "react";
import { faCircleXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Popover,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import { toast } from "react-toastify";

import Input from "@/components/input";
import useTodoStore from "@/state/useTodoStore";
import { FIELDS } from "@/constants/field";
import TodoCard from "@/components/todoCard";
import { TODO_FILTERS } from "@/constants/todo";

const DELAY_CLOSE = 500;
const DEFAULT_TAB = "all";

const TodoPage = () => {
  const { todos, actions } = useTodoStore(
    useShallow((state) => ({ todos: state.todos, actions: state.actions }))
  );
  const { addTodo, loadTodos, editTodo, deleteTodo, toggleStatus } = actions;

  //layout state
  const [openSideContent, setOpenSideContent] = useState(false);
  const [openConfirmLeave, setOpenConfirmLeave] = useState(false);
  const [anchorElDeleteConfirm, setAnchorElDeleteConfirm] = useState(null);
  const [selectedTab, setSelectedTab] = useState(DEFAULT_TAB);
  //todo state
  const [currentTodo, setCurrentTodo] = useState({});
  const [errors, setErrors] = useState([]);
  const [isDirty, setDirty] = useState(false);

  const filteredTodos = useMemo(() => {
    return TODO_FILTERS[selectedTab](todos);
  }, [JSON.stringify(todos), selectedTab]);

  const handleClickAdd = () => {
    if (isDirty) {
      setOpenConfirmLeave(true);
      setTimeout(() => setOpenSideContent(true), 100);
    } else {
      setCurrentTodo({});
      setOpenSideContent(true);
    }
  };

  const handleCloseSideContent = () => {
    if (isDirty) {
      setOpenConfirmLeave(true);
    } else {
      setOpenSideContent(false);
      setTimeout(() => setCurrentTodo({}), DELAY_CLOSE);
    }
  };

  const handleDelete = (todo) => {
    !todo.id && setOpenSideContent(false);
    setAnchorElDeleteConfirm(null);
    setTimeout(
      () => {
        deleteTodo(todo?.id || currentTodo.id);
        !todo.id && setCurrentTodo({});
      },
      !todo.id ? DELAY_CLOSE : 0
    );
  };

  const handleChangeTab = (_, value) => {
    setSelectedTab(value);
  };

  const handleSelectTodo = (todo) => {
    setCurrentTodo(todo);
    setOpenSideContent(true);
  };

  const handleToggleStatus = (todo) => {
    toggleStatus(todo.id);
    if (todo.id === currentTodo.id) {
      setCurrentTodo({
        ...currentTodo,
        status: currentTodo.status === "completed" ? "pending" : "completed",
      });
    } else {
    }
  };

  const handleChangeInput = (field, value) => {
    setDirty(true);
    setCurrentTodo({ ...currentTodo, [field.name]: value });
  };

  const handleSave = () => {
    let listError = [];
    FIELDS.forEach((field) => {
      if (!currentTodo[field.name] && field.required) {
        listError.push({
          target: field.name,
          helper: "This field is require",
        });
      } else {
        listError = listError.filter((error) => {
          return error.target !== field.name;
        });
      }
    });
    if (listError.length > 0) {
      setErrors(listError);
      toast(currentTodo.id ? "Edit task fail!" : "Create task fail!", {
        type: "error",
      });
      return;
    }

    if (currentTodo.id) {
      editTodo(currentTodo);
    } else {
      addTodo({ ...currentTodo, status: "pending" });
    }
    setTimeout(() => !currentTodo.id && setCurrentTodo({}), DELAY_CLOSE);
    setDirty(false);
    toast(
      currentTodo.id ? "Edit task successfully!" : "Create task successfully!",
      { type: "success" }
    );
  };

  const handleLeave = () => {
    setOpenConfirmLeave(false);
    setOpenSideContent(false);
    setCurrentTodo({});
    setDirty(false);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    setErrors([]);
  }, [currentTodo.id ? currentTodo.id : JSON.stringify(currentTodo)]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: openSideContent ? "10px" : "0px",

        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* List todo UI */}
      <Box
        sx={{
          flex: "1",
          borderRight: "1px solid #c4c4c4",
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          maxWidth: {
            xs: openSideContent ? "0vw" : "100vw",
            sm: openSideContent ? "70vw" : "100vw",
            md: openSideContent ? "75vw" : "100vw",
          },
          overflow: "hidden",
          gap: "10px",
          transition: "all 0.5s ease-in-out",
          padding: {
            xs: openSideContent ? "0" : "10px",
            sm: "10px",
            md: "20px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button
            onClick={handleClickAdd}
            sx={{
              "& p, & button": {
                transition: "color 0.2s ease-in-out",
              },
              "&:hover p, &:hover button": {
                color: "#0277bd",
              },
            }}
          >
            <IconButton>
              <FontAwesomeIcon icon={faPlus} />
            </IconButton>
            <Typography sx={{ color: "black" }}>Add new task</Typography>
          </Button>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
          <Tabs
            value={selectedTab}
            onChange={handleChangeTab}
            variant="scrollable"
          >
            <Tab label="All" value="all" />
            <Tab label="Pending" value="pending" />
            <Tab label="Completed" value="completed" />
            <Tab label="Over due" value="overDue" />
          </Tabs>
        </Box>
        <Box
          sx={{
            flex: "1",
            maxHeight: "100%",
            overflow: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo, index) => {
              return (
                <TodoCard
                  todo={todo}
                  key={todo.id}
                  handleClick={() => handleSelectTodo(todo)}
                  currentTodo={currentTodo}
                  index={index}
                  handleDelete={(e) => {
                    handleDelete(todo);
                  }}
                  handleToggleStatus={() => handleToggleStatus(todo)}
                />
              );
            })
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              Nothing here to do, add more task!
            </Box>
          )}
        </Box>
      </Box>
      {/*End list todo UI */}
      {/* Form todo UI */}

      <Box
        sx={{
          padding: {
            xs: openSideContent ? "10px" : "0",
            md: openSideContent ? "20px" : "0",
          },
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: { xs: "100vw", sm: "30vw", md: "25vw" },
          overflow: "hidden",
          width: openSideContent ? "100%" : "0",
          transition: "all 0.5s ease-in-out",
        }}
      >
        <Box
          sx={{
            borderBottom: "1px solid black",
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "100%",
            overflow: "hidden",
            flexShrink: "0",
          }}
        >
          <Typography
            className="truncate"
            sx={{ fontSize: "30px", fontWeight: "bold" }}
            title={currentTodo.title}
          >
            {currentTodo.id ? currentTodo.title : "Create new task"}
          </Typography>
          <IconButton onClick={handleCloseSideContent}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </IconButton>
        </Box>
        <Box sx={{ overflow: "auto" }}>
          {FIELDS.map((field) => {
            const helpers = errors.find((error) => error.target === field.name)
              ?.helper
              ? [errors.find((error) => error.target === field.name)?.helper]
              : [];
            const isErrored = errors.find(
              (error) => error.target === field.name
            );
            return (
              <Input
                key={field.name}
                value={currentTodo[field.name] || ""}
                label={field.label}
                handleChange={(value) => handleChangeInput(field, value)}
                required={field.required}
                isErrored={isErrored}
                helpers={helpers}
                type={field.type}
                minDate={field.minDate}
              />
            );
          })}
          {currentTodo.id && (
            <Input
              value={currentTodo["status"] === "completed" ? true : false}
              handleChange={(value) => {
                setDirty(true);
                setCurrentTodo({
                  ...currentTodo,
                  status: value ? "completed" : "pending",
                });
              }}
              type={"BOOLEAN"}
              labelEnd="Completed"
            />
          )}
        </Box>

        <Box
          sx={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {currentTodo.id && (
            <>
              <Button
                variant="outlined"
                onClick={(e) => {
                  setAnchorElDeleteConfirm(e.currentTarget);
                }}
              >
                Delete
              </Button>
            </>
          )}
          <Button variant="contained" onClick={handleSave}>
            {currentTodo.id ? "Save" : "Create"}
          </Button>
        </Box>
      </Box>
      {/*End form todo UI */}
      {/* Popper and Modal container */}
      <Popover
        open={Boolean(anchorElDeleteConfirm)}
        anchorEl={anchorElDeleteConfirm}
        onClose={() => {
          setAnchorElDeleteConfirm(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            padding: "10px",
          }}
        >
          <Typography sx={{ fontSize: "18px" }}>
            Are you sure to delete the task?
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Button variant="outlined" onClick={handleDelete}>
              Delete
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setAnchorElDeleteConfirm(null);
                !openSideContent && setCurrentTodo({});
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Popover>
      <Modal
        open={openConfirmLeave}
        onClose={() => {
          setOpenConfirmLeave(false);
        }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            padding: "20px",
            backgroundColor: "white",
            width: "fit-content",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Typography sx={{ fontSize: "18px" }}>
            You have unsaved content, do you want to leave?
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Button variant="outlined" onClick={handleLeave}>
              Leave
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setOpenConfirmLeave(false);
              }}
            >
              Stay
            </Button>
          </Box>
        </Box>
      </Modal>
      {/*End popper and Modal container */}
    </Box>
  );
};

export default TodoPage;
