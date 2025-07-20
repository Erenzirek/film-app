import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function LoginModal({ show, onHide, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Form submit olduğunda sayfa yenilenmesini engellemek için
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleLogin = async () => {
    console.log("Login fonksiyonu başladı");
    try {
      const res = await axios.post('http://localhost:9090/api/auth/login', { email, password });
     
      if (res.status === 200) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", res.data.id); // backend'den gelen id
         console.log('Login response:', res.data.id);
        onLoginSuccess();
        setEmail('');
        setPassword('');
        setError('');
      }
    } catch (e) {
      setError('Giriş bilgileri yanlış veya kullanıcı bulunamadı.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Giriş Yap</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email adresi</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Email giriniz" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Şifre</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Şifre giriniz" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Giriş Yap
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
