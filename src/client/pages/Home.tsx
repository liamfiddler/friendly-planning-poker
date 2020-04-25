import React from 'react';
import { Link } from 'wouter';

const Home = () => (
  <div>
    <h1>Planning Poker</h1>
    <Link href="/play/ABCDEFG">
      <a>Play Game: ABCDEFG</a>
    </Link>
  </div>
);

export default Home;
