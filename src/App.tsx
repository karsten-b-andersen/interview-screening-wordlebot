import { Container } from "@mui/material";
import GameBoard from "./components/GameBoard";
import Header from "./components/Header";
import Layout from "./components/Layout";

function App() {
    return (
        <Layout>
            <Container maxWidth="sm">
                <Header />
                {/* Insert App here */}
                <GameBoard />
            </Container>
        </Layout>
    );
}

export default App;
