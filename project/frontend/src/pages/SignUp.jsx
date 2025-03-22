import React, { useState } from 'react';
import '../App.css';
import "@radix-ui/themes/styles.css";
import { Text, Button, Flex, Box, Card, TextField, Link } from "@radix-ui/themes";
import { Form } from "radix-ui";
import axios from 'axios';

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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}users/`, {
        email : formData.email,
        password : formData.password
      });
      console.log('Signed up successfully');
    } catch (error) {
      console.error('Error signing up:', JSON.parse(error.request.response)["email"][0]);
    }
  };

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center" gap="20px">
      <Box width="480px" justify="center">
        <Card size="3" elevation="3" padding="5" radius="2">
          <Flex direction="column" align="center" justify="center" gap="50px" my="20px">
            <Text size="7" weight="bold">
              Sign Up
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
                    {/* <Form.Message asChild className="FormMessage" match={invalidEmail}>
                      <Text color="red">
                        User with this email already exists.
                      </Text>
                    </Form.Message> */}
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
                  </div>

                  <Form.Control
                    asChild
                    minLength="8"
                    className="Input"
                    type="password"
                    placeholder="Enter a password of 8 characters or more..."
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

                <Form.Field className="FormField" name="confirmPassword">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}>
                    <Form.Label asChild className="FormLabel">
                      <Box height="30px">
                        <Text size="2" weight="bold">
                          Confirm Password
                        </Text>
                      </Box>
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
                  </div>
                  <Form.Control
                    asChild
                    className="Input"
                    type="password"
                    placeholder="Re-enter the password..."
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    size="3">
                    <Box asChild width="380px" height="60px">
                      <TextField.Root>
                        <TextField.Slot pl="8px" />
                        <TextField.Slot pr="8px" />
                      </TextField.Root>
                    </Box>
                  </Form.Control>
                </Form.Field>

                <Form.Submit asChild onClick={handleSignUp}>
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
          Already have an account? <Link href="/signin">Sign in</Link>
        </Text>
      </Box>
    </Flex>
  );
}

export default SignUp;