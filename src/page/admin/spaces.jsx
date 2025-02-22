import React, { useState, useEffect } from "react";
import { notifyError, formatDate } from "../../../utils/helpers";
import AxiosInstance from "../../../utils/AxiosInstance";
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";

const spaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [spaceToEdit, setSpaceToEdit] = useState(null);

  const fetchSpaces = async () => {
    try {
      await AxiosInstance.get("/spaces").then((response) => {
        if (response.status === 200) {
          setSpaces(response.data.data);
          console.log(response.data.data);
        }
      });
    } catch (error) {
      console.log(error);
      notifyError("Failed to fetch spaces");
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  return (
    <div className="px-3 mt-8">
      <div className="flex justify-between">
        <h1 className="font-bold font-serif" style={{ fontSize: "30px" }}>
          List of Spaces
        </h1>
        <p style={{ fontSize: "13.5px" }}>
          <span className="text-blue-500 hover:underline">Home</span> /
          <span className="text-gray-500"> Spaces</span>
        </p>
      </div>
      <Button
        onClick={() => openModal()}
        variant="outlined"
        color="secondary"
        sx={{ fontSize: { xs: "0.75rem", sm: "1rem" } }}
      >
        Add Space
      </Button>
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <CircularProgress color="secondary" size={50} />
          </div>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Image</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Created At</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Updated At</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {spaces.length > 0 ? (
                  spaces.map((space, index) => (
                    <TableRow key={space._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{space.name}</TableCell>
                      <TableCell>{space.description}</TableCell>
                      <TableCell>
                        <img
                          src={space.image.url}
                          alt={space.name}
                          style={{ width: "100px", height: "auto" }}
                          className="rounded-xl"
                        />
                      </TableCell>
                      <TableCell>
                        {dayjs(space.createdAt).format("MMMM DD YYYY")}
                      </TableCell>
                      <TableCell>
                        {dayjs(space.updatedAt).format("MMMM DD YYYY")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => console.log(`View ${space.name}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No spaces found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default spaces;
