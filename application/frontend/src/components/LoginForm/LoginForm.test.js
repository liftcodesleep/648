import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import LoginForm from './LoginForm'
import Cookies from 'js-cookie'

test('renders login form elements', () => {
  const { getByText, getByLabelText } = render(<LoginForm />)
  expect(getByText('Login Form')).toBeInTheDocument()
  expect(getByLabelText('Username')).toBeInTheDocument()
  expect(getByLabelText('Password')).toBeInTheDocument()
  expect(getByText('Login')).toBeInTheDocument()
  expect(getByText("Don't have an account?")).toBeInTheDocument()
  expect(getByText('Sign up')).toBeInTheDocument()
})

test('submits login form successfully', async () => {
  const { getByLabelText, getByText } = render(<LoginForm />)
  const usernameInput = getByLabelText('Username')
  const passwordInput = getByLabelText('Password')
  const loginButton = getByText('Login')
  fireEvent.change(usernameInput, {
    target: { value: 'testuser' }
  })
})
