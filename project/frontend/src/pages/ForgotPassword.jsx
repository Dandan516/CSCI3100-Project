import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "@radix-ui/themes/styles.css";
import { Text, Button, Flex, Box, Card, TextField, Callout } from "@radix-ui/themes";
import { Form } from "radix-ui";
import axios from 'axios';

import '../App.css';
import * as Icons from '../assets/Icons';
import NavigateButton from '../components/NavigateButton';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState('');

  const updateFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    try {
      if (step === 1) {
        await axios.post(`${import.meta.env.VITE_API_URL}forgot-password/`, { email: formData.email });
        setStep(2);
      } else if (step === 2) {
        await axios.post(`${import.meta.env.VITE_API_URL}verify-code/`, { email: formData.email, code: formData.code });
        setStep(3);
      } else if (step === 3) {
        if (formData.newPassword !== formData.confirmNewPassword) {
          setError('Passwords do not match.');
          return;
        }
        await axios.post(`${import.meta.env.VITE_API_URL}reset-password/`, { email: formData.email, newPassword: formData.newPassword });
        navigate("/login");
      }
    } catch (error) {
      const errorResponse = JSON.parse(error.request.response);
      setError(errorResponse.message);
    }
  };

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box asChild width="480px">
        <Card size="3">
          <Flex direction="column" align="center" justify="center" gap="20px">

            {error && (
              <Box width="380px">
                <Callout.Root color="red">
                  <Callout.Icon>
                    <Icons.AlertCircleOutline />
                  </Callout.Icon>
                  <Callout.Text>
                    {error}
                  </Callout.Text>
                </Callout.Root>
              </Box>
            )}

            <Form.Root asChild className="FormRoot">
              <Flex direction="column" gap="20px">

                <Text align="center" size="7" weight="bold" my="20px">
                  Reset Password
                </Text>

                {step === 1 && (
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

                )}

                {step === 2 && (
                  <Form.Field className="FormField" name="code">
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
                      className="Input"
                      type="text"
                      placeholder="Enter the code sent to your email..."
                      value={formData.code}
                      onChange={updateFormData}
                      required>
                      <Box asChild width="380px" height="50px" >
                        <TextField.Root>
                          <TextField.Slot pl="10px" />
                          <TextField.Slot pr="10px" />
                        </TextField.Root>
                      </Box>
                    </Form.Control>
                  </Form.Field>
                )}

                {step === 3 && (
                  <>
                    <Form.Field className="FormField" name="newPassword">
                      <Form.Label asChild className="FormLabel">
                        <Box asChild mb="10px" ml="6px">
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
                        <Box asChild width="380px" height="50px">
                          <TextField.Root>
                            <TextField.Slot pl="10px" />
                            <TextField.Slot pr="10px" />
                          </TextField.Root>
                        </Box>
                      </Form.Control>
                    </Form.Field>

                    <Form.Field className="FormField" name="confirmNewPassword">
                      <Form.Label asChild className="FormLabel">
                        <Box asChild mb="10px" ml="6px">
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

                <Form.Submit asChild onClick={handleNextStep}>
                  <Button asChild variant="solid">
                    <Box width="380px" height="60px" my="10px">
                      <Text size="5" weight="bold">
                        {step === 3 ? 'Reset Password' : 'Continue'}
                      </Text>
                    </Box>
                  </Button>
                </Form.Submit>
              </Flex>
            </Form.Root>
          </Flex>
        </Card>
      </Box>

      <NavigateButton url="/portal" label="Back to portal"/>

    </Flex>
  );
}

export default ForgotPassword;
