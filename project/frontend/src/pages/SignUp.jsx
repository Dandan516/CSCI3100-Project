import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import "@radix-ui/themes/styles.css";
import { Text, Button, Flex, Box, Card, TextField, Link, Checkbox, Callout } from "@radix-ui/themes";
import { Form } from "radix-ui";
import axios from 'axios';

import * as Icons from '../assets/Icons';
import NavigateButton from '../components/NavigateButton';

function SignUp() {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const updateFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [signUpError, setSignUpError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const isEmailInvalid = () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return !regex.test(formData.email);
  };

  const isPasswordInvalid = () => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return !regex.test(formData.password);
  };

  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {

    const errors = [];

    if (!formData.email) {
      errors.push("Please enter your email.");
    } else if (isEmailInvalid()) {
      errors.push("Email is invalid.");
    }

    if (!formData.password) {
      errors.push("Password is required.");
    } else if (isPasswordInvalid()) {
      errors.push("Password should contain ≥ 8 characters, 1 uppercase letter, and 1 special character.");
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match.");
    }

    setErrorMessages(errors);
    setSignUpError(errors.length > 0 && formTouched); // Only show errors if the form has been touched
    setIsFormValid(errors.length === 0);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
   
    validateForm(); // Validate the form before proceeding
    if (!isFormValid) {
      setFormTouched(true); // Mark the form as touched when attempting to sign up
      return; // Prevent submission if the form is invalid
    }

    try {
      if (step === 1) {
        await axios.post(`${import.meta.env.VITE_API_URL}signup/`, { email: formData.email, password: formData.password });
        setStep(2);
      } else if (step === 2) {
        // await axios.post(`${import.meta.env.VITE_API_URL}verify-code/`, { email: formData.email, code: formData.code });
        navigate("/login");
      }
    } catch (error) {
      console.error('Error signing up:', error);
      const errors = [];
      if (error.response?.data?.email && !isEmailInvalid()) {
        errors.push('User with this email already exists.');
      } else {
        errors.push("An unexpected error occurred. Please try again later.");
      }
      setErrorMessages(errors);
      setSignUpError(true);
    }
  };

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box asChild width="480px">
        <Card size="3">
          <Flex direction="column" align="center" justify="center" gap="20px">

            <Text size="7" weight="bold" my="20px">
              Sign Up
            </Text>

            {signUpError && (
              <Box asChild width="380px">
                <Flex asChild direction="column" align="center" gap="10px">
                  <Callout.Root color="red">
                    <Callout.Icon>
                      <Icons.CrossCircled />
                    </Callout.Icon>
                    <Callout.Text>
                      {errorMessages.map((message, index) => (
                        <Text key={index} size="2" color="red" mb="5px">
                          {message}<br />
                        </Text>
                      ))}
                    </Callout.Text>
                  </Callout.Root>
                </Flex>
              </Box>
            )}

            <Form.Root className="FormRoot">
              <Flex align="center" direction="column" gap="20px">

                {step === 1 && (
                  <>
                    {/* Email */}
                    <Form.Field name="email">

                      <Form.Label asChild>
                        <Box asChild mb="10px" ml="6px">
                          <Text size="2" weight="medium">
                            Email
                          </Text>
                        </Box>
                      </Form.Label>

                      <Form.Control
                        asChild
                        type="email"
                        placeholder="Enter your email address..."
                        value={formData.email}
                        onChange={updateFormData}
                        required>
                        <Box asChild width="380px" height="50px">
                          <TextField.Root>
                            <TextField.Slot pl="10px" />
                            <TextField.Slot pr="10px" />
                          </TextField.Root>
                        </Box>
                      </Form.Control>
                    </Form.Field>

                    {/* Password */}
                    <Form.Field name="password">

                      <Form.Label asChild>
                        <Box asChild mb="10px" ml="6px">
                          <Text size="2" weight="medium">
                            Password
                          </Text>
                        </Box>
                      </Form.Label>

                      <Form.Control
                        asChild
                        className="Input"
                        type="password"
                        value={formData.password}
                        onChange={updateFormData}
                        required
                        minLength="8"
                        placeholder="Enter a password of 8 characters or more...">
                        <Box asChild width="380px" height="50px">
                          <TextField.Root>
                            <TextField.Slot pl="10px" />
                            <TextField.Slot pr="10px" />
                          </TextField.Root>
                        </Box>
                      </Form.Control>
                    </Form.Field>

                    {/* Confirm Password */}
                    <Form.Field name="confirmPassword">

                      <Form.Label asChild>
                        <Box asChild mb="10px" ml="6px">
                          <Text size="2" weight="medium">
                            Confirm Password
                          </Text>
                        </Box>
                      </Form.Label>

                      <Form.Control
                        asChild
                        type="password"
                        value={formData.confirmPassword}
                        onChange={updateFormData}
                        required
                        placeholder="Re-enter the password...">
                        <Box asChild width="380px" height="50px">
                          <TextField.Root>
                            <TextField.Slot pl="10px" />
                            <TextField.Slot pr="10px" />
                          </TextField.Root>
                        </Box>
                      </Form.Control>
                    </Form.Field>

                  </>
                )}

                {step === 2 && (
                  <Form.Field name="code">
                    <Flex align="baseline" justify="between">
                      <Form.Label asChild className="FormLabel">
                        <Box asChild mb="10px" ml="6px">
                          <Text size="2" weight="medium">
                            Authentication Code
                          </Text>
                        </Box>
                      </Form.Label>
                    </Flex>
                    <Form.Control
                      asChild
                      type="text"
                      placeholder="Enter the code sent to your email..."
                      value={formData.code}
                      onChange={updateFormData}
                      required>
                      <Box asChild width="380px" height="50px">
                        <TextField.Root>
                          <TextField.Slot pl="10px" />
                          <TextField.Slot pr="10px" />
                        </TextField.Root>
                      </Box>
                    </Form.Control>
                  </Form.Field>
                )}

                <Form.Submit asChild>
                  <Button
                    asChild
                    variant="solid"
                    onClick={handleSignUp}>
                    <Box width="380px" height="60px" my="10px">
                      <Text size="5" weight="bold">
                        Continue
                      </Text>
                    </Box>
                  </Button>
                </Form.Submit>


              </Flex>
            </Form.Root>

            {step === 1 && (
              <Text size="2" m="4px">
                Already have an account? <Link href="/login">Sign in</Link>
              </Text>
            )}

          </Flex>
        </Card>
      </Box>

      <Box height="40px" />

      <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>

    </Flex>
  );
}

export default SignUp;