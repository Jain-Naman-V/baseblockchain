'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success - in a real app, we would store tokens, etc.
      console.log('Login successful');
      router.push('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '400px', 
      margin: '2rem auto', 
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#0284c7', marginBottom: '1.5rem', textAlign: 'center' }}>Sign In</h1>
        
        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#991b1b', 
            padding: '0.75rem', 
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="email" 
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
            >
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: '1px solid #cbd5e1',
                fontSize: '1rem'
              }}
              placeholder="john.doe@example.com"
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label 
                htmlFor="password" 
                style={{ fontWeight: 'bold' }}
              >
                Password
              </label>
              <Link 
                href="/auth/forgot-password" 
                style={{ color: '#0284c7', textDecoration: 'none', fontSize: '0.875rem' }}
              >
                Forgot password?
              </Link>
            </div>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: '1px solid #cbd5e1',
                fontSize: '1rem'
              }}
              placeholder="••••••••••"
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              id="rememberMe" 
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              style={{ marginRight: '0.5rem' }}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              backgroundColor: '#0284c7', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#64748b' }}>
            Don't have an account?{' '}
            <Link href="/auth/register" style={{ color: '#0284c7', textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          By signing in, you agree to the{' '}
          <Link href="/terms" style={{ color: '#0284c7', textDecoration: 'none' }}>
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: '#0284c7', textDecoration: 'none' }}>
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
} 