import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "@radix-ui/themes/styles.css";
import { Text, Button, Flex, Box, Card, TextField, Link, Checkbox, Callout } from "@radix-ui/themes";
import { Form } from "radix-ui";
import axios from 'axios';

import * as Icons from '../assets/Icons';
import '../App.css';

function SignUp() {

  const navigate = useNavigate();

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

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const handleCheckboxChange = (checked) => setAgreeToTerms(checked);

  const [signUpError, setSignUpError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const invalidEmail = () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return !regex.test(formData.email);
  };

  const invalidPassword = () => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return !regex.test(formData.password);
    // return false; // FOR TESTING ONLY
  };

  const failConfirmPassword = () => {
    return formData.password !== formData.confirmPassword;
  };

  const handleSignUpError = (error) => {
    const errors = [];
    if (error.response && error.response.data) {
      const errorResponse = error.response.data;
      if (errorResponse.email) {
        errors.push('User with this email already exists.');
      }
    } else {
      errors.push("An unexpected error occurred. Please try again later.");
    }
    setErrorMessages(errors);
    setSignUpError(true);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const errors = [];

    if (!formData.email) {
      errors.push("Email is required.");
    } else if (invalidEmail()) {
      errors.push("Email is invalid.");
    }

    if (!formData.password) {
      errors.push("Password is required.");
    } else if (invalidPassword()) {
      errors.push("Password should contain ≥ 8 characters, 1 uppercase letter, and 1 special character.");
    }
    if (failConfirmPassword()) {
      errors.push("Passwords do not match.");
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      setSignUpError(true);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}users/`, formData);
      navigate("/login");
    } catch (error) {
      console.error('Error signing up:', error);
      handleSignUpError(error);
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
                      <Icons.AlertCircleOutline />
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

                {/* Email */}
                <Form.Field className="FormField" name="email">

                  <Form.Label asChild className="FormLabel">
                    <Box asChild mb="10px" ml="6px">
                      <Text size="2" weight="medium">
                        Email
                      </Text>
                    </Box>
                  </Form.Label>

                  <Form.Control
                    asChild
                    className="Input"
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
                <Form.Field className="FormField" name="password">

                  <Form.Label asChild className="FormLabel">
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
                <Form.Field className="FormField" name="confirmPassword">

                  <Form.Label asChild className="FormLabel">
                    <Box asChild mb="10px" ml="6px">
                      <Text size="2" weight="medium">
                        Confirm Password
                      </Text>
                    </Box>
                  </Form.Label>

                  <Form.Control
                    asChild
                    className="Input"
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

                <Text as="label" size="2">
                  <Flex as="span" gap='2' m="4px">
                    <Checkbox onCheckedChange={handleCheckboxChange} /> I agree to Terms and Conditions
                  </Flex>
                </Text>

                <Form.Submit asChild onClick={handleSignUp}>
                  <Button asChild variant="solid" disabled={!agreeToTerms}>
                    <Box width="380px" height="60px">
                      <Text size="5" weight="bold">
                        Continue
                      </Text>
                    </Box>
                  </Button>
                </Form.Submit>

              </Flex>
            </Form.Root>

            <Text size="2" m="4px">
              Already have an account? <Link href="/login">Sign in</Link>
            </Text>

          </Flex>
        </Card>
      </Box>

    </Flex>
  );
}

export default SignUp;