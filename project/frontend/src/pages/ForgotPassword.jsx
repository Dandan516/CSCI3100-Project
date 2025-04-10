import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { Text, Button, Flex, Box, Card, TextField, Callout } from "@radix-ui/themes";
import { Form } from "radix-ui";
import axios from 'axios';

import * as Icons from '../assets/Icons';

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
        await axios.post(`${import.meta.env.VITE_API_URL}password_reset/`, { email: formData.email });

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
                      value={formData.email}
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

                )}

                <Form.Submit asChild onClick={handleNextStep}>
                  <Button asChild variant="solid">
                    <Box width="380px" height="60px" my="10px">
                      <Text size="5" weight="bold">
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

      <Box height="40px"/>

      <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>

    </Flex>
  );
}

export default ForgotPassword;
