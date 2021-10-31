import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "./components/Layout";
import ConnectButton from './components/ConnectButton';
import CommitementForm from './components/CommitmentForm';

function App() {
  return (
    <ChakraProvider>
      <Layout>
        <ConnectButton />
        <CommitementForm /> 
      </Layout>
    </ChakraProvider>
  );
}

export default App;
