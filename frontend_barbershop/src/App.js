import React, {Suspense } from 'react';
import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import {Loader} from './components/Loader';
import { BrowserRouter as Router} from "react-router-dom";


// here app catches the suspense from page in case translations are not yet loaded
export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Router>
      <Header/>
      </Router>
      <Footer />
    </Suspense>
  );
}
