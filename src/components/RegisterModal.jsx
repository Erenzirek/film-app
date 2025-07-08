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
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Kayıt Ol</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>Email adresi</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Email giriniz" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Şifre</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Şifre giriniz" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </Form.Group>
          <Button variant="success" onClick={handleRegister} className="w-100">
            Kayıt Ol
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default RegisterModal;