import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Text, Button, Flex, Box, Card, TextField, Link, Checkbox, Callout } from "@radix-ui/themes";
import { Form } from "radix-ui";
import axios from 'axios';
import "@radix-ui/themes/styles.css";

import '../App.css';
import * as Icons from '../assets/Icons';

function Login({ setCurrentUser }) {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData((prevData) => ({ ...prevData, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const updateFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (checked) => setRememberMe(checked);

  const [loginError, setLoginError] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}login/`, formData);
      setCurrentUser(response.data.user);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      navigate("../home");
    } catch (error) {
      const errorResponse = JSON.parse(error.request.response);
      setLoginError(true);
    }
  };

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box asChild width="480px">
        <Card size="3">
          <Flex direction="column" align="center" justify="center" gap="20px">

            <Text size="7" weight="bold" my="20px">
              Sign In
            </Text>

            {loginError && (
              <Box width="380px">
                <Callout.Root color="red">
                  <Callout.Icon>
                    <Icons.AlertCircleOutline />
                  </Callout.Icon>
                  <Callout.Text>
                    Invalid credentials.
                  </Callout.Text>
                </Callout.Root>
              </Box>
            )}

            <Form.Root asChild className="FormRoot">
              <Flex direction="column" gap="20px">

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
                    placeholder="Enter your password...">
                    <Box asChild width="380px" height="50px">
                      <TextField.Root>
                        <TextField.Slot pl="10px" />
                        <TextField.Slot pr="10px" />
                      </TextField.Root>
                    </Box>
                  </Form.Control>
                </Form.Field>

                {/* Password */}
                <Flex align="center" justify="between" m="4px">
                  <Text as="label" size="2">
                    <Flex as="span" gap='2' m="4px">
                      <Checkbox onCheckedChange={handleCheckboxChange} /> Remember me
                    </Flex>
                  </Text>
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