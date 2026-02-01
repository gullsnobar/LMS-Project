"use client";

import React, { FC } from "react";
import { Modal, Box } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
};

const CustomModal: FC<Props> = ({ open, setOpen, children }) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-lg shadow-xl p-4 outline-none relative">
        <AiOutlineClose
          className="absolute top-3 right-3 cursor-pointer text-black dark:text-white"
          size={20}
          onClick={() => setOpen(false)}
        />
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
