import SignupForm from './SignupForm'
import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

test('renders register form elements', () => {
  const { getByText, getByLabelText } = render(< SignupForm />)
  expect(getByText('Signup Form')).toBeInTheDocument()
  expect(getByLabelText('Full Name')).toBeInTheDocument()
  expect(getByLabelText('Email Address')).toBeInTheDocument()
  expect(getByLabelText('Username')).toBeInTheDocument()
  expect(getByLabelText('Password')).toBeInTheDocument()
  expect(getByLabelText('Date of Birth')).toBeInTheDocument()
  expect(getByLabelText('Phone Number')).toBeInTheDocument()
  expect(getByText('Create Account')).toBeInTheDocument()
  expect(getByText("Already a member?")).toBeInTheDocument()
  expect(getByText('Login')).toBeInTheDocument()
})

test('submits signup form successfully', async () => {
  const { getByLabelText, getByText } = render(< SignupForm />)
  const usernameInput = getByLabelText('Full Name')
  const passwordInput = getByLabelText('Password')
  const signupButton = getByText('Create Account')
  fireEvent.change(usernameInput, {
    target: { value: 'testuser' }
  })
})
