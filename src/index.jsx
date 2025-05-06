/*** APP ***/
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
} from "@apollo/client";


import { link } from "./link.js";
import { Subscriptions } from "./subscriptions.jsx";
import { Layout } from "./layout.jsx";
import "./index.css";

const PERSON_1 = gql`
  query Person {
    person {
      id
      name
    }
  }
`;

const numRows = 500;
const numCols = 10;

function App() {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(<Row key={i}/>);
  }

  return (
    <main>
      <h2>Lots of People</h2>
      {rows}
    </main>
  );
}

function Row() {
  const johns = [];
  for (let i = 0; i < numCols; i++) {
    johns.push(<John key={i}/>);
  }

  return (
    <div style={{display: "flex", flexDirection: "row"}}>
      {johns}
    </div>

  );
}

function John() {
  const {loading, data} = useQuery(PERSON_1, {
    //fetchPolicy: "network-only"
    batching: true,
  });

  return (
    <div style={{border: "1px solid black", margin: "5px", padding: "5px"}}>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <h2>
          {data.person.name}
        </h2>
      )}
    </div>
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
  queryDeduplication: true,
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ApolloProvider client={client}>
  <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="subscriptions-wslink" element={<Subscriptions />} />
        </Route>
      </Routes>
    </Router>
  </ApolloProvider>
);
