
import { Container, Col, Row } from "react-bootstrap";
import "./App.css";
import Login from "./Login";


function App() {
  return (
    <Container>
      <Row>
    <Col xs={12} sm={12} md={6} lg={6}>
    <Login />
    </Col>
    <Col xs={12} sm={12} md={6} lg={6}></Col>
      
      
      
      </Row>
    </Container>
  );
}

export default App;