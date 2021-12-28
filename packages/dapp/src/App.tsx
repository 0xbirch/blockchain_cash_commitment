import React from 'react';
import './App.css';
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "./components/Layout";
import Homepage from './components/Homepage';

function App() {
  
  return (
    <ChakraProvider>
      <Layout>
        <Homepage />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
