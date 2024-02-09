//import react into the bundle
import React from 'react';
import { createRoot } from 'react-dom/client';

//include your index.scss file into the bundle
import '../styles/index';

//import your own components
import Layout from './layout';

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<Layout />);
