import { Typography, Link } from '@mui/material';
import React from 'react';

const OpenAIDisclaimer = () => {
  return (
    <Typography variant="body2" fontSize={12}>
      The original text was simplified to beginner-friendly by using{' '}
      <Link href="https://openai.com/index/hello-gpt-4o/">
        OpenAI GPT‑4o model
      </Link>{' '}
      and manually refining the resulting text.
    </Typography>
  );
};

export default OpenAIDisclaimer;
