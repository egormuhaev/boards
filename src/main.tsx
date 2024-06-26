import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "reactflow/dist/style.css";
import { ReactFlowProvider } from "reactflow";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";

const apolloHttpLink = createHttpLink({
  uri: "http://localhost:3000/api/graphql",
});

const apolloClient = new ApolloClient({
  link: apolloHttpLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={apolloClient}>
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  </ApolloProvider>,
);
