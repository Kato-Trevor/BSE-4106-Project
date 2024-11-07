'use client'

import { useState } from 'react';
import axios from 'axios';
import { Card, Button, Flex, TextArea, Text } from '@radix-ui/themes';

export default function Home() {
  const [input, setInput] = useState('');
  const [chatResponse, setChatResponse] = useState<string | null>(null);

  const sendMessage = async () => {
    const response = await axios.post('/api/groq', {
      message: input,
    });
    setChatResponse(response.data)
    setInput('');
  };

  return (
    <div>
      <Flex
        direction="column" 
        gap="3"
      >
        <h1>Chat with our AI assistant</h1>
        {chatResponse ? 
        <Card>
          <Text as="div" size="2" color="gray">
            {chatResponse}
          </Text>
        </Card> : null
        }
        <TextArea
          value={input}
          placeholder="Type your question here..." 
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          onClick={sendMessage}
        >
          Submit
        </Button>
      </Flex>
    </div>
  );
}