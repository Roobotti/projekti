import { createSlice } from "@reduxjs/toolkit";
import boardService from "../services/board";

const slice = createSlice({
  name: "board",
  initialState: [],
  reducers: {
    delBoard(state, action) {
      const board = action.payload;
      return state.filter((s) => s.id !== board.id);
    },
    setBoards(state, action) {
      return action.payload;
    },
    addBoard(state, action) {
      return state.concat(action.payload);
    },
  },
});

export const initializeBoards = () => {
  return async (dispatch) => {
    const boards = await boardService.getAll();
    dispatch(setBoards(boards));
  };
};

export const createBoard = (object) => {
  return async (dispatch) => {
    const board = await boardService.create(object);
    dispatch(addBoard(board));
  };
};

export const deleteBoard = (object) => {
  console.log(object.id);
  return async (dispatch) => {
    try {
      const board = await boardService.deleteOne(object.id);
      //dispatch(delBoard(board))
    } catch (error) {
      console.log(error);
    }
  };
};

export const { setBoards, addBoard, delBoard } = slice.actions;
export default slice.reducer;
