# Blocks - Build. Experiment. Bring Ideas to Life on Starknet

When we first started this project, none of us knew how to write a single line of Cairo—and we weren’t the only ones. The biggest barrier that Web2 developers face in learning new Web3 technologies is the onboarding process: writing smart contracts in new languages and deploying them. The truth is, learning either requires quite a bit of time and effort, which most students don’t have at a hackathon. That’s why we built Blocks — a simple platform for building and deploying Cairo smart contracts — so developers with existing knowledge can easily onboard onto the Starknet ecosystem.

## 💡 What Is Blocks?
Blocks revolutionizes blockchain development on Cairo by creating a user-friendly, block-based coding interface for beginnners to learn smart contract development. With the ability to create and deploy contracts on testnet or mainnet, Blocks has the following features:

- Smart Contract Compiler: By easily dragging and dropping blocks, developers can create smart contracts without any Cairo knowledge, which are then compiled into running code!
- One-Click Deploy: Deploying a contract for the first time can take hours if you don’t know what you’re doing. Now, with the click of a button, your contract goes live, ready for interaction on StarkScan.
- CairoAgent: Need to build a smart contract quickly without doing research? We’ve got you covered with a custom LLM with access to the latest Cairo documents (e.g., The Cairo Book) so that you can debug compilation errors even faster!
- Snippet: Still unsure how to build a contract? Provide us with a prompt, and we’ll populate the blocks for you—all you have to do is deploy!
- Multiplayer (Temporarily Disabled): Need a friend to help you out? Collaborate on smart contracts in real-time within the same workspace.

Blocks empowers developers of all skill levels to build, compile, and deploy scalable and secure smart contracts effortlessly. By simplifying the development process, developers can spend more time building systems and less time writing code.

## 🛠️ How We Built It

- Building Blocks: Using React Flow Editor and Next.js, we created a website that allows users to drag and connect blocks representing smart contracts.
- One-Click Deploy: We developed a mini compiler that converts JSON (a graph representation of nodes and edges) to Cairo, enabling the creation of contracts. Deployment is automated with starkli and bash scripts.
- CairoAgent: We utilized Langgraph and Langchain to build a ReACT (Reasoning and Acting in Language Models) based AI agent. This agent supports the Cairo development process by retrieving data and performing actions.
- Snippet: We leveraged OpenAI structured outputs to create a JSON schema for a series of building blocks based on user prompts.
- Multiplayer: With Liveblocks, WebSockets, and Y.js, we enabled real-time collaboration on smart contracts.
- Deployment: The frontend is live on Vercel, and backend traffic is tunneled to the host machine using ngrok.
While our current proof of concept is built for Starknet, the same framework can be adapted for other blockchains (especially Ethereum-based L2s) by writing language-specific compilers.

## 🛠️ Tech Stack
- Frontend: Next.js, Liveblocks, WebSockets, Y.js, React Flow Editor, Vercel  
- Backend: Python, Flask, Starknet (Cairo, starkli, etc.), Langchain, Langgraph, OpenAI, ngrok

## Contributing

If you'd like to contribute to the frontend, check out the `README.md` in `client`, whereas if you're interested in contributing to the backend/compiler/AI features, checkout the `README.md` in `server`!
