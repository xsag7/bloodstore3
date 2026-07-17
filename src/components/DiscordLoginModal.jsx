import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const DiscordLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithDiscord } = useStore();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('https://cdn.discordapp.com/embed/avatars/0.png');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const avatars = [
    { id: 'blue', url: 'https://cdn.discordapp.com/embed/avatars/0.png', label: 'Azul Padrão' },
    { id: 'red', url: 'https://cdn.discordapp.com/embed/avatars/4.png', label: 'Vermelho Blood' },
    { id: 'green', url: 'https://cdn.discordapp.com/embed/avatars/3.png', label: 'Verde Gamer' },
    { id: 'purple', url: 'https://cdn.discordapp.com/embed/avatars/5.png', label: 'Roxo Nitro' },
    { id: 'yellow', url: 'https://cdn.discordapp.com/embed/avatars/2.png', label: 'Amarelo VIP' },
  ];

  const handleConnect = (e) => {
    e.preventDefault();
    if (!username.trim() || username.trim().length < 2) {
      setError('Digite um nome de usuário ou tag do Discord válido.');
      return;
    }

    const cleanUser = username.trim().startsWith('@') ? username.trim() : `@${username.trim()}`;
    const userData = {
      username: cleanUser,
      avatar: selectedAvatar,
      connectedAt: new Date().toISOString()
    };

    loginWithDiscord(userData);
    setError('');
    if (onSuccess) onSuccess(userData);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="modal-content" style={{
        background: '#14141e',
        border: '1px solid #5865F2',
        boxShadow: '0 0 35px rgba(88, 101, 242, 0.35)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '430px',
        padding: '28px',
        position: 'relative',
        animation: 'fadeInUp 0.3s ease-out'
      }}>
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '16px', right: '16px',
            background: 'transparent', border: 'none',
            color: '#a0a0b0', fontSize: '1.2rem', cursor: 'pointer'
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: '#5865F2',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '2rem', color: '#fff',
            boxShadow: '0 0 20px rgba(88, 101, 242, 0.5)'
          }}>
            <i className="fa-brands fa-discord"></i>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
            Autenticação Discord
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#a0a0b0' }}>
            Conecte sua conta para acessar seus pedidos, liberar o chat ao vivo e receber seus produtos instantaneamente!
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(204, 0, 0, 0.15)', border: '1px solid #cc0000', color: '#ff6b6b', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleConnect}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ color: '#fff', fontSize: '0.88rem' }}>
              Seu Usuário do Discord
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fa-brands fa-discord" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5865F2', fontSize: '1.1rem' }}></i>
              <input 
                type="text"
                className="form-input"
                placeholder="ex: usuario#1234 ou @usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  background: '#1a1a26',
                  border: '1px solid #2a2a3e',
                  color: '#fff',
                  borderRadius: '8px'
                }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ color: '#fff', fontSize: '0.88rem' }}>
              Escolha seu Avatar Gamer
            </label>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {avatars.map((av) => (
                <div 
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.url)}
                  style={{
                    width: '46px', height: '46px',
                    borderRadius: '50%',
                    border: selectedAvatar === av.url ? '3px solid #5865F2' : '2px solid transparent',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    transform: selectedAvatar === av.url ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: selectedAvatar === av.url ? '0 0 12px rgba(88, 101, 242, 0.6)' : 'none'
                  }}
                  title={av.label}
                >
                  <img src={av.url} alt={av.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="btn-complete-order"
            style={{
              background: '#5865F2',
              border: 'none',
              padding: '14px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(88, 101, 242, 0.4)',
              transition: 'background 0.2s'
            }}
          >
            <i className="fa-solid fa-bolt"></i> Conectar & Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
