import React, { useState } from 'react';

import "@radix-ui/themes/styles.css";
import { Text, Button, Flex, Box, Card, TextField, Link, Checkbox } from "@radix-ui/themes";
import { Form } from "radix-ui";
import axios from 'axios';

import '../App.css';

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const invalidPassword = () => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return false; // FOR TESTING ONLY
    // return !regex.test(password);
  };

  const failConfirmPassword = () => {
    return formData.password !== formData.confirmPassword;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log('Signing up with', formData.email, formData.password, formData.confirmPassword);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}users/`, formData);
      console.log('Signed up successfully');
    } catch (error) {
      console.error('Error signing up:', JSON.parse(error.request.response)["email"][0]);
    }
  };

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box width="480px">
        <Card size="3">
          <Flex direction="column" align="center" justify="center" gap="20px">
            <Text size="7" weight="bold" my="20px">
              Sign Up
            </Text>
            <Form.Root className="FormRoot">
              <Flex direction="column" gap="20px">

                <Form.Field className="FormField" name="email">
                  <Flex display="flex" align="baseline" justify="between">
                    <Form.Label asChild className="FormLabel">
                      <Text size="2" weight="medium" mb="10px" ml="6px">
                        Email
                      </Text>
                    </Form.Label>
                    <Form.Message asChild className="FormMessage" match="valueMissing">
                      <Text size="2" color="red">
                        Please enter your email.
                      </Text>
                    </Form.Message>
                    <Form.Message asChild className="FormMessage" match="typeMismatch">
                      <Text size="2" color="red">
                        Please provide a valid email.
                      </Text>
                    </Form.Message>
                    {/* <Form.Message asChild className="FormMessage" match={invalidEmail}>
                      <Text color="red">
                        User with this email already exists.
                      </Text>
                    </Form.Message> */}
                  </Flex>

                  <Form.Control
                    asChild
                    className="Input"
                    name="email"
                    type="email"
                    placeholder="Enter your email address..."
                    value={formData.email}
                    onChange={handleChange}
                    required
                    size="3">
                    <Box asChild width="380px" height="60px">
                      <TextField.Root>
                        <TextField.Slot pl="8px" />
                        <TextField.Slot pr="8px" />
                      </TextField.Root>
                    </Box>
                  </Form.Control>
                </Form.Field>

                <Form.Field className="FormField" name="password">
                  <Flex align="baseline" justify="between">
                    <Form.Label asChild className="FormLabel">
                      <Text size="2" weight="medium" mb="10px" ml="6px">
                        Password
                      </Text>
                    </Form.Label>
                    <Form.Message asChild className="FormMessage" match="valueMissing">
                      <Text size="2" color="red">
                        Please enter a password.
                      </Text>
                    </Form.Message>
                    <Form.Message asChild className="FormMessage" match="tooShort">
                      <Text size="2" color="red">
                        Password too short.
                      </Text>
                    </Form.Message>
                    <Form.Message asChild className="FormMessage" match={invalidPassword}>
                      <Text size="2" color="red">
                        Password too weak. {/*It should contain at least 8 characters, one uppercase letter, and one special character. */}
                      </Text>
                    </Form.Message>
                  </Flex>

                  <Form.Control
                    asChild
                    className="Input"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="8"
                    size="3"
                    placeholder="Enter a password of 8 characters or more...">
                    <Box asChild width="380px" height="60px">
                      <TextField.Root>
                        <TextField.Slot pl="8px" />
                        <TextField.Slot pr="8px" />
                      </TextField.Root>
                    </Box>
                  </Form.Control>
                </Form.Field>

                <Form.Field className="FormField" name="confirmPassword">
                  <Flex align="baseline" justify="between">
                    <Form.Label asChild className="FormLabel">
                      <Text size="2" weight="medium" mb="10px" ml="6px">
                        Confirm Password
                      </Text>
                    </Form.Label>
                    <Form.Message asChild className="FormMessage" match="valueMissing">
                      <Text size="2" color="red">
                        Please re-enter your password.
                      </Text>
                    </Form.Message>
                    <Form.Message asChild className="FormMessage" match={failConfirmPassword}>
                      <Text size="2" color="red">
                        Passwords do not match.
                      </Text>
                    </Form.Message>
                  </Flex>
                  <Form.Control
                    asChild
                    className="Input"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    size="3"
                    placeholder="Re-enter the password...">
                    <Box asChild width="380px" height="60px">
                      <TextField.Root>
                        <TextField.Slot pl="8px" />
                        <TextField.Slot pr="8px" />
                      </TextField.Root>
                    </Box>
                  </Form.Control>
                </Form.Field>

                <Flex align="center" gap='10px' m="4px">
                  <Checkbox />
                  <Text size="2"> I agree to Terms and Conditions </Text>
                </Flex>

                <Form.Submit asChild onClick={handleSignUp}>
                  <Button asChild variant="solid">
                    <Box width="380px" height="60px">
                      <Text
                        size="5"
                        weight="bold">
                        Continue
                      </Text>
                    </Box>
                  </Button>
                </Form.Submit>

              </Flex>
            </Form.Root>
            <Text size="2" m="4px">
              Already have an account? <Link href="/signin">Sign in</Link>
            </Text>
          </Flex>
        </Card>
      </Box>

    </Flex>
  );
}

export default SignUp;