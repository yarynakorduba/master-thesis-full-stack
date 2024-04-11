//import react into the bundle
import React from 'react';
import { createRoot } from 'react-dom/client';

//import your own components
import Layout from './layout';

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<Layout />);
