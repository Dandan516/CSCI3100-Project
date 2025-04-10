import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Text, Button, Flex, Box, Card, TextField, Callout } from "@radix-ui/themes";
import { Form } from "radix-ui";
import axios from 'axios';

import * as Icons from '../assets/Icons';

function PasswordReset() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState(false);

  const updateFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [isFormValid, setIsFormValid] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const isPasswordInvalid = () => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return !regex.test(formData.newPassword);
  };

  const validateForm = () => {

    const errors = [];

    if (!formData.newPassword) {
      errors.push("Password is required.");
    } 

    if (formData.newPassword !== formData.confirmNewPassword) {
      errors.push("Passwords do not match.");
    }

    setErrorMessages(errors);
    setError(errors.length > 0 && formTouched);
    setIsFormValid(errors.length === 0);
  };

  const handleNextStep = async (e) => {

    validateForm();
    if (!isFormValid) {
        setFormTouched(true); // Mark the form as touched when attempting to sign up
        return; // Prevent submission if the form is invalid
      }

    e.preventDefault();
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}password_reset/confirm/`, { 
            password: formData.newPassword,
            token: token 
        });
        navigate('/login');
    } catch (error) {
      console.error("Error resetting password:", error.response.data.password);
      setError(true);
      setErrorMessages([error.response.data.password]);
    }
  };

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box asChild width="480px">
        <Card size="3">
          <Flex direction="column" align="center" justify="center" gap="20px">

            

            <Form.Root asChild className="FormRoot">
              <Flex direction="column" gap="20px">

                <Text align="center" size="7" weight="bold" my="20px">
                  Reset Password
                </Text>

                {error && (
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
                  <Form.Field className="FormField" name="newPassword">
                    <Form.Label asChild className="FormLabel">
                      <Box asChild mb="6px">
                        <Text size="2" weight="medium">
                          New Password
                        </Text>
                      </Box>
                    </Form.Label>

                    <Form.Control
                      asChild
                      className="Input"
                      type="password"
                      placeholder="Enter your new password..."
                      value={formData.newPassword}
                      onChange={updateFormData}
                      required>
                      <Box asChild width="380px" height="50px" mt="10px">
                        <TextField.Root>
                          <TextField.Slot pl="10px" />
                          <TextField.Slot pr="10px" />
                        </TextField.Root>
                      </Box>
                    </Form.Control>
                  </Form.Field>                

                  <Form.Field className="FormField" name="confirmNewPassword">
                    <Form.Label asChild className="FormLabel">
                        <Box asChild mb="6px">
                            <Text size="2" weight="medium">
                            Confirm New Password
                            </Text>
                        </Box>
                    </Form.Label>

                    <Form.Control
                        asChild
                        className="Input"
                        type="password"
                        placeholder="Confirm your new password..."
                        value={formData.confirmNewPassword}
                        onChange={updateFormData}
                        required>
                        <Box asChild width="380px" height="50px" mt="10px">
                            <TextField.Root>
                            <TextField.Slot pl="10px" />
                            <TextField.Slot pr="10px" />
                            </TextField.Root>
                        </Box>
                    </Form.Control>
                  </Form.Field>

                <Form.Submit asChild onClick={handleNextStep}>
                  <Button asChild variant="solid">
                    <Box width="380px" height="60px" my="10px">
                      <Text size="5" weight="bold">
                        Reset Password
                      </Text>
                    </Box>
                  </Button>
                </Form.Submit>
              </Flex>
            </Form.Root>
          </Flex>
        </Card>
      </Box>

      <Box height="40px"/>

      <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>

    </Flex>
  );
}

export default PasswordReset;
