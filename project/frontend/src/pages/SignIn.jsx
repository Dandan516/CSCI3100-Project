import React, { useState } from 'react';
import '../App.css';
import "@radix-ui/themes/styles.css";
import { Text, Button, Flex, Box, Card, TextField, Link } from "@radix-ui/themes";
import { Form } from "radix-ui";
import axios from 'axios';

function SignIn() {
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}users/`, formData);
      console.log('Signed in successfully');
    } catch (error) {
      console.error('Error signing in:', JSON.parse(error.request.response)["email"][0]);
    } 
  };

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center" gap="20px">
      <Box width="480px" justify="center">
        <Card size="3" elevation="3" padding="5" radius="2">
          <Flex direction="column" align="center" justify="center" gap="50px" my="20px">
            <Text size="7" weight="bold">
              Sign In
            </Text>
            <Form.Root className="FormRoot">
              <Flex direction="column" align="center" justify="center" gap="20px">

                <Form.Field className="FormField" name="email">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}>
                    <Form.Label asChild className="FormLabel">
                      <Box height="30px">
                        <Text size="2" weight="bold">
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
                  </div>

                  <Form.Control
                    asChild
                    className="Input"
                    type="email"
                    placeholder="Enter your email address..."
                    required
                    size="3"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}>
                    <Box asChild width="380px" height="60px">
                      <TextField.Root>
                        <TextField.Slot pl="8px" />
                        <TextField.Slot pr="8px" />
                      </TextField.Root>
                    </Box>
                  </Form.Control>
                </Form.Field>

                <Form.Field className="FormField" name="password">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <Form.Label asChild className="FormLabel">
                      <Box height="30px">
                        <Text size="2" weight="bold">
                          Password
                        </Text>
                      </Box>
                    </Form.Label>
                    <Form.Message asChild className="FormMessage" match="valueMissing">
                      <Text size="2" color="red">
                        Please enter a password.
                      </Text>
                    </Form.Message>
                  </div>

                  <Form.Control
                    asChild
                    minLength="8"
                    className="Input"
                    type="password"
                    placeholder="Enter your password..."
                    required
                    size="3"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}>
                    <Box asChild width="380px" height="60px">
                      <TextField.Root>
                        <TextField.Slot pl="8px" />
                        <TextField.Slot pr="8px" />
                      </TextField.Root>
                    </Box>
                  </Form.Control>
                </Form.Field>

                <Form.Submit asChild onClick={handleSignIn}>
                  <Button asChild variant="solid" mt="20px" >
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
          </Flex>
        </Card>
      </Box>
      <Box>
        <Text size="2">
          Don't have an account? <Link href="/signup">Create an account</Link>
        </Text>
      </Box>
    </Flex>
  );
}

export default SignIn;