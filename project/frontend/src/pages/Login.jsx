import React, { useState } from 'react';

import { Text, Button, Flex, Box, Card, TextField, Link, Checkbox } from "@radix-ui/themes";
import { Form } from "radix-ui";
import axios from 'axios';
import "@radix-ui/themes/styles.css";

import '../App.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    // Handle sign-in logic here
    console.log('Signing in with', formData.email, formData.password);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}login/`, formData);
      console.log('Signed in successfully');
    } catch (error) {
      console.error('Error signing in:', JSON.parse(error.request.response));
    }
  };

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box width="480px">
        <Card size="3">
          <Flex direction="column" align="center" justify="center" gap="20px">
            <Text size="7" weight="bold" my="20px">
              Sign In
            </Text>
            <Form.Root className="FormRoot">
              <Flex direction="column" gap="20px">
                <Form.Field className="FormField" name="email">
                  <Flex align="baseline" justify="between">
                    <Form.Label asChild className="FormLabel">
                      <Box height="30px">
                        <Text size="2" weight="medium" mb="10px" ml="6px">
                          Email
                        </Text>
                      </Box>
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
                  </Flex>

                  <Form.Control
                    asChild
                    className="Input"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    size="3"
                    placeholder="Enter your password...">
                    <Box asChild width="380px" height="60px">
                      <TextField.Root>
                        <TextField.Slot pl="8px" />
                        <TextField.Slot pr="8px" />
                      </TextField.Root>
                    </Box>
                  </Form.Control>
                </Form.Field>

                <Flex align="center" justify="between" m="4px">
                  <Flex align="center" gap='10px'>
                    <Checkbox />
                    <Text size="2"> Remember Me </Text>
                  </Flex>
                  <Text size="2" align="right">
                    <Link href="/forgotpassword"> Forgot password? </Link>
                  </Text>
                </Flex>

                <Form.Submit asChild onClick={handleSignIn}>
                  <Button asChild variant="solid">
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
              Don't have an account? <Link href="/signup">Create an account</Link>
            </Text>
          </Flex>
        </Card >
      </Box >

    </Flex >
  );
}

export default Login;