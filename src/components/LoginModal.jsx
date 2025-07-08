import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function LoginModal({ show, onHide, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:9090/api/auth/login', { email, password });
      if (res.status === 200) {
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
        <Form>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email adresi</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Email giriniz" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Şifre</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Şifre giriniz" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </Form.Group>
          <Button variant="primary" onClick={handleLogin} className="w-100">
            Giriş Yap
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
