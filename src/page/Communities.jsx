import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Container,
} from "@mui/material";

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommunities = async () => {
    try {
      const res = await AxiosInstance.get("/spaces");
      setCommunities(res.data.data);
    } catch (error) {
      setError("Failed to fetch communities. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Discover Communities
      </Typography>
      <Grid container spacing={3}>
        {communities.map((community) => (
          <Grid item xs={12} sm={6} md={4} key={community._id}>
            <Link
              to={`/community/${community._id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    height: 250, // Parehong height para sa lahat ng images
                    objectFit: "cover", // Para hindi ma-distort ang images
                  }}
                  image={community.profile.url}
                  alt={community.name}
                />
                <CardContent>
                  <Typography variant="h6" color="text.primary">
                    {community.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {community.description.length > 100
                      ? `${community.description.substring(0, 100)}...`
                      : community.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created by:{" "}
                    {community.createdBy.name === "Ian Calica"
                      ? "Trueself Administrator"
                      : community.createdBy.name}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Communities;
