import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const groq = new Groq();

const chatRequestSchema = z.object({
  message: z.string(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const { message } = chatRequestSchema.parse(body);
    const chatCompletion = await getGroqChatCompletion(message);
    
    console.log("Completion returned by the LLM; ")
    console.log(chatCompletion.choices[0]?.message?.content || "");
    return NextResponse.json(chatCompletion.choices[0]?.message?.content, { status: 200 });
  }catch(error){
    console.log(error);
    return NextResponse.json("Error fetching response from Groq", {
      status: 500,
    });
  }
}

 async function getGroqChatCompletion(message: string) {
  return groq.chat.completions.create({
    //
    // Required parameters
    //
    messages: [
      // Set an optional system message. This sets the behavior of the
      // assistant and can be used to provide specific instructions for
      // how it should behave throughout the conversation.
      {
        role: "system",
        content: "you are a helpful assistant.",
      },
      // Set a user message for the assistant to respond to.
      {
        role: "user",
        content: message,
      },
    ],

    // The language model which will generate the completion.
    model: "llama3-8b-8192",

    //
    // Optional parameters
    //

    // Controls randomness: lowering results in less random completions.
    // As the temperature approaches zero, the model will become deterministic
    // and repetitive.
    temperature: 0.5,

    // The maximum number of tokens to generate. Requests can use up to
    // 2048 tokens shared between prompt and completion.
    max_tokens: 1024,

    // Controls diversity via nucleus sampling: 0.5 means half of all
    // likelihood-weighted options are considered.
    top_p: 1,

    // A stop sequence is a predefined or user-specified text string that
    // signals an AI to stop generating content, ensuring its responses
    // remain focused and concise. Examples include punctuation marks and
    // markers like "[end]".
    stop: null,

    // If set, partial message deltas will be sent.
    stream: false,
  });
};
