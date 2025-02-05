import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css"; // Use the updated styles
import productsImage from "../assets/products-menu.png";
import comparisonsImage from "../assets/comparisons-menu.png";
import addProductImage from "../assets/add_product-menu.png";
import addComparisonImage from "../assets/add_comparison-menu.png";

const dashboardOptions = [
  {
    title: "My Products",
    description: "View and manage your products.",
    image: productsImage,
    route: "/products",
  },
  {
    title: "My Comparisons",
    description: "View and analyze your product comparisons.",
    image: comparisonsImage,
    route: "/comparisons",
  },
  {
    title: "Add Product",
    description: "Add a new product to your collection.",
    image: addProductImage,
    route: "/addProduct",
  },
  {
    title: "Add Comparison",
    description: "Create a new comparison between products.",
    image: addComparisonImage,
    route: "/addComparison",
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* App Introduction */}
      <Box className="dashboard-intro">
        <h1>Welcome to Comparathor!</h1>
        <p>
          The ultimate tool to compare and manage your products, analyze comparisons,
          and customize your preferences. Simplify your decision-making process with ease!
        </p>
      </Box>

      {/* Dashboard Options */}
      <Box className="dashboard-container">
        {dashboardOptions.map((option, index) => (
          <Paper
            key={index}
            className="dashboard-item"
            onClick={() => navigate(option.route)}
          >
            <img
              src={option.image}
              alt={option.title}
              className="dashboard-image"
            />
            <Box className="dashboard-text">
              <Typography className="dashboard-title">{option.title}</Typography>
              <Typography className="dashboard-description">{option.description}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export default Home;
