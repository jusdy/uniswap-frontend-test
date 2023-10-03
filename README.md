# Web3 Front End Developer Interview Assignment

This is a simple React-based web application that interacts with Uniswap on the Goerli network to swap tokens. It also displays the history of swaps and the corresponding profit and loss (PNL).

## Requirements

- Create a new React application using create-react-app or any other preferred setup.
- Use any front-end UI library of your choice (e.g., Material-UI, Ant Design, Bootstrap) to style the form components.
- Use the ethers.js or web3.js library to interact with the Ethereum blockchain and ERC20 token contract on the Goerli Test Network.

## Pages

### Swap (Part 1)

- Users can add the addresses of the "from" token and "to" token.
- Users can select an amount for the "from" token, which calculates the amount of the "to" token and shows the price impact.
- Validity checks are performed for addresses and amounts (address should be valid, and amount should be less than the user's balance).
- Clicking on "swap" creates a Uniswap swap transaction for the two tokens.

### Portfolio (Part 2)

- Displays all past Uniswap swaps for the connected address.
- Shows token address, entry price, exit price, current price, and PNL.

## Deliverables

1. **GitHub Repository**: Contains the source code of the React application.
2. **README**: Provides clear instructions on how to set up and run the application locally.
3. **Deployment**: Deploy the application on Vercel and provide the live URL.

## Evaluation Criteria

- Code quality and organization.
- Proper use of React components and state management.
- Proper implementation of web3/ethers.js library for interacting with the Ethereum blockchain on the Goerli Test Network.
- Effective error handling and user feedback.
- Responsive and visually appealing UI design.
- Successful deployment of the application on Vercel.

## Getting Started

To set up and run the application locally, follow these steps:

1. Clone the GitHub repository:

```bash
git clone <repository-url>
```

2. Install the dependencies:

```bash
cd <project-folder>
yarn install
```

3. Run the application:

```bash
yarn run dev
```

The application should now be running locally on `http://localhost:3000`.

## Live Demo

The application is deployed on Vercel and can be accessed at [Live Demo URL](https://uniswap-frontend-test.vercel.app/).
