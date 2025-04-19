import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Text, Button, Flex, Box, Card, TextField, Checkbox, Callout, Link } from "@radix-ui/themes";
import { Form } from "radix-ui";

import * as Icons from '../assets/Icons';
import { useAuth } from "../hooks/AuthProvider";

function Login() {

  const auth = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);

  const updateCredentials = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (checked) => setRememberMe(checked);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', credentials.email);
      localStorage.setItem('rememberedPassword', credentials.password);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }
    await auth.login(credentials);
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setCredentials((prevData) => ({ ...prevData, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box asChild width="480px">
        <Card size="3">
          <Flex direction="column" align="center" justify="center" gap="20px">

            <Text size="7" weight="medium" my="20px">
              Login
            </Text>

            {auth.loginError && (
              <Box width="380px">
                <Callout.Root color="red">
                  <Callout.Icon>
                    <Icons.CrossCircled />
                  </Callout.Icon>
                  <Callout.Text>
                    Invalid credentials.
                  </Callout.Text>
                </Callout.Root>
              </Box>
            )}

            {auth.loginSuccess && (
              <Box width="380px">
                <Flex asChild direction="column" align="center" gap="10px">
                  <Callout.Root color="green">
                    <Callout.Icon>
                      <Icons.Check />
                    </Callout.Icon>
                    <Callout.Text>
                      Login success!<br />
                      Logging in...
                    </Callout.Text>
                  </Callout.Root>
                </Flex>
              </Box>
            )}

            <Form.Root asChild className="FormRoot">
              <Flex direction="column" gap="20px">

                {/* Email */}
                <Form.Field className="FormField" name="email">
                  <Form.Label asChild className="FormLabel">
                    <Box asChild mb="6px">
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
                    value={credentials.email}
                    onChange={updateCredentials}
                    required>
                    <Box asChild width="380px" height="50px" mt="10px">
                      <TextField.Root>
                        <TextField.Slot pl="10px" />
                        <TextField.Slot pr="10px" />
                      </TextField.Root>
                    </Box>
                  </Form.Control>
                </Form.Field>

                <Form.Field className="FormField" name="password">
                  <Form.Label asChild className="FormLabel">
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
                    value={credentials.password}
                    onChange={updateCredentials}
                    required
                    placeholder="Enter your password...">
                    <Box asChild width="380px" height="50px" mt="10px">
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
                    <Link className="radix-ui-link"onClick={() => navigate("/forgot-password")}> Forgot password? </Link>
                  </Text>
                </Flex>

                <Form.Submit asChild onClick={handleLogin}>
                  <Button asChild variant="solid" className={(auth.isLoading || auth.loginSuccess) && "no-click"} disabled={auth.isLoading || auth.loginSuccess}>
                    <Box width="380px" height="50px">
                      <Text size="4" weight="medium">
                        Continue
                      </Text>
                    </Box>
                  </Button>
                </Form.Submit>

              </Flex>
            </Form.Root>

            <Text size="2" m="4px">
              Don't have an account? <Link className="radix-ui-link" onClick={() => navigate("/signup")}>Create an account</Link>
            </Text>

          </Flex>
        </Card >
      </Box >

      <Box height="40px" />

      <Button variant="outline" onClick={() => navigate("/")}>Go Back</Button>

    </Flex >
  );
}

export default Login;