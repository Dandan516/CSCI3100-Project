import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';


import { Text, Button, Flex, Box, Card, TextField, Checkbox, Callout } from "@radix-ui/themes";
import { Form } from "radix-ui";
import axios from 'axios';

import * as Icons from '../assets/Icons';

const isEmailInvalid = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return !regex.test(email);
};

const isPasswordInvalid = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return !regex.test(password);
};

function SignUp() {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const [signUpError, setSignUpError] = useState(false);

  const [errorMessages, setErrorMessages] = useState([]);

  const updateSignUpForm = (e) => {
    setSignUpForm({
      ...signUpForm,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {

    const errors = [];

    if (!signUpForm.email) {
      errors.push("Please enter your email.");
    } else if (isEmailInvalid(signUpForm.email)) {
      errors.push("Email is invalid.");
    }

    if (!signUpForm.password) {
      errors.push("Password is required.");
    } else if (isPasswordInvalid(signUpForm.password)) {
      errors.push("Password should contain ≥ 8 characters, with:");
      errors.push("- 1 uppercase letter ( A-Z )");
      errors.push("- 1 special character ( !@#$%^&* )");
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      errors.push("Passwords do not match.");
    }

    return errors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true); // Set loading state
    setErrorMessages([]); // Clear previous error messages
    const errors = validateForm(); // Validate the form and get errors

    if (errors.length > 0) {
      setSignUpError(true);
      setErrorMessages(errors); // Update error messages
      setIsLoading(false); // Reset loading state
      return; // Prevent submission if the form is invalid
    }

    axios
      .post(`${import.meta.env.VITE_API_URL}signup/`, {
        email: signUpForm.email,
        password: signUpForm.password,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Sign up valid:", response.data);
          setSignUpError(false);
          setSignUpSuccess(true);

          // Redirect to login page after 3 seconds
          const timeoutId = setTimeout(() => {
            navigate("/login");
          }, 3000);

          // Cleanup timeout on unmount
          return () => clearTimeout(timeoutId);
        }
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        const errors = [];
        if (JSON.parse(error.request.response).email) {
          errors.push("User with this email already exists.");
        } else {
          errors.push("An unexpected error occurred. Please try again later.");
        }
        setSignUpError(true);
        setErrorMessages(errors);
      })
      .finally(() => {
        setIsLoading(false); // Reset loading state
      });
  };

  useEffect(() => {
    setSignUpError(false);
    setSignUpSuccess(false);
    setErrorMessages([]);
  }, []);

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box asChild width="480px">
        <Card size="3">
          <Flex direction="column" align="center" justify="center" gap="20px">

            <Text size="7" weight="medium" my="20px">
              Sign Up
            </Text>

            <Form.Root className="FormRoot">
              <Flex align="center" direction="column" gap="20px">

                {step === 1 && (
                  <>
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

                    {signUpSuccess && (
                      <Box width="380px">
                        <Flex asChild direction="column" align="center" gap="10px">
                          <Callout.Root color="green">
                            <Callout.Icon>
                              <Icons.Check />
                            </Callout.Icon>
                            <Callout.Text>
                              Sign up successful.<br />
                              Redirecting you to login page...
                            </Callout.Text>
                          </Callout.Root>
                        </Flex>
                      </Box>
                    )}

                    {/* Email */}
                    <Form.Field name="email">

                      <Form.Label asChild>
                        <Box asChild mb="6px">
                          <Text size="2" weight="medium">
                            Email
                          </Text>
                        </Box>
                      </Form.Label>

                      <Form.Control
                        asChild
                        type="email"
                        placeholder="Enter your email address..."
                        value={signUpForm.email}
                        onChange={updateSignUpForm}
                        required>
                        <Box asChild width="380px" height="50px" mt="10px">
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
                        <Box asChild mb="6px">
                          <Text size="2" weight="medium">
                            Password
                          </Text>
                        </Box>
                      </Form.Label>

                      <Form.Control
                        asChild
                        className="Input"
                        type="password"
                        value={signUpForm.password}
                        onChange={updateSignUpForm}
                        required
                        minLength="8"
                        placeholder="Enter a password of 8 characters or more...">
                        <Box asChild width="380px" height="50px" mt="10px">
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
                        <Box asChild mb="6px">
                          <Text size="2" weight="medium">
                            Confirm Password
                          </Text>
                        </Box>
                      </Form.Label>

                      <Form.Control
                        asChild
                        type="password"
                        value={signUpForm.confirmPassword}
                        onChange={updateSignUpForm}
                        required
                        placeholder="Re-enter the password...">
                        <Box asChild width="380px" height="50px" mt="10px">
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
                        <Box asChild mb="6px">
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
                      value={signUpForm.code}
                      onChange={updateSignUpForm}
                      required>
                      <Box asChild width="380px" height="50px" mt="10px">
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
                    onClick={handleSignUp}
                    disabled={isLoading || signUpSuccess}
                    className={(isLoading || signUpSuccess) && "no-click"}>
                    <Box width="380px" height="50px" mt="10px">
                      <Text size="4" weight="medium">
                        Continue
                      </Text>
                    </Box>
                  </Button>
                </Form.Submit>


              </Flex>
            </Form.Root>

            {step === 1 && (
              <Text size="2" m="4px">
                Already have an account? <Link to="/login">Sign in</Link>
              </Text>
            )}

          </Flex>
        </Card>
      </Box>

      <Box height="40px" />

      <Button variant="outline" onClick={() => navigate("/")}>Go Back</Button>

    </Flex>
  );
}

export default SignUp;