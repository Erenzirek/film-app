import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function LoginModal({ show, onHide, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:9090/api/auth/login', { email, password });
      if (res.status === 200) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", res.data.id);
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
    <Modal show={show} onHide={onHide} centered contentClassName="login-modal-modern">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center text-gradient display-6 fw-bold">Giriş Yap</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group className="mb-4" controlId="loginEmail">
            <Form.Label className="fw-semibold">Email adresi</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Email giriniz" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              size="lg"
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="loginPassword">
            <Form.Label className="fw-semibold">Şifre</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Şifre giriniz" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              size="lg"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 login-btn-modern" size="lg">
            Giriş Yap
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
