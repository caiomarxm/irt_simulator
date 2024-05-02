import { Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <Grid templateColumns="repeat(6, 1fr)" bg="gray.50">
      <GridItem
        as="aside"
        colSpan={{ base: 6, lg: 2, xl: 1 }}
        bg="blue.600"
        minHeight={{ lg: "100vh" }}
        p={{ base: "20px", lg: "30px" }}
      ></GridItem>
      <GridItem
        as="main"
        colSpan={{ base: 6, lg: 4, xl: 5 }}
        p="40px"
      >
        <Outlet />
      </GridItem>
    </Grid>
  );
};

export default RootLayout;