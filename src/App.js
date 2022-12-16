/* PROGRAMMER:
 * Mok Chau Wing (1155142763)
 * Chan Shi Leung Jonathan (1155142863)
 * Li Tsz Yeung (1155144367)
 * Ng Kai Pong (1155144829)
 * Lee Yat Him (1155176301)
 * Lin Chun Man (1155177065)
*/
import { Container, Col, Row } from "react-bootstrap";
import "./bootstrap.scheme.css";
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