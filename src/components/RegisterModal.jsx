import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function RegisterModal({ show, onHide }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:9090/api/auth/register', { email, password });
      if (res.status === 200) {
        setSuccess('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        setError('');
        setEmail('');
        setPassword('');
      }
    } catch (e) {
      setError('Bu email zaten kayıtlı.');
      setSuccess('');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="register-modal-modern">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center text-gradient display-6 fw-bold">Kayıt Ol</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form className="mt-3">
          <Form.Group className="mb-4" controlId="registerEmail">
            <Form.Label className="fw-semibold">Email adresi</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Email giriniz" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              size="lg"
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="registerPassword">
            <Form.Label className="fw-semibold">Şifre</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Şifre giriniz" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              size="lg"
            />
          </Form.Group>
          <Button variant="success" onClick={handleRegister} className="w-100 register-btn-modern" size="lg">
            Kayıt Ol
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default RegisterModal;