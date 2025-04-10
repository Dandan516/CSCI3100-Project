import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { Text, Button, Flex, Box, Card, TextField, Callout, Spinner } from "@radix-ui/themes";
import { Form } from "radix-ui";
import axios from 'axios';

import * as Icons from '../assets/Icons';

function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
  });
  const [emailError, setEmailError] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendEmail = async (e) => {

    e.preventDefault();

    if (!formData.email) {
      return;
    }

    setEmailError(false);
    setIsLoading(true);

    axios
      .post(`${import.meta.env.VITE_API_URL}password_reset/`, {
        email: formData.email
      })
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          setEmailError(false);
          setEmailSent(true);
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      })
      .catch((error) => {
        setEmailSent(false);
        setEmailError(true);
        setIsLoading(false);
      });
  };

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box asChild width="480px">
        <Card size="3">
          <Flex direction="column" align="center" justify="center" gap="20px">

            <Form.Root asChild className="FormRoot">
              <Flex direction="column" gap="20px">

                <Text align="center" size="7" weight="bold" my="20px">
                  Forgot Password
                </Text>

                {emailError && !isLoading && (
                  <Box width="380px">
                    <Callout.Root color="red">
                      <Callout.Icon>
                        <Icons.CrossCircled />
                      </Callout.Icon>
                      <Callout.Text>
                        Email not found.
                      </Callout.Text>
                    </Callout.Root>
                  </Box>
                )}

                {emailSent && (
                  <Box width="380px">
                    <Callout.Root color="green">
                      <Callout.Icon>
                        <Icons.Check />
                      </Callout.Icon>
                      <Callout.Text>
                        Reset email has been sent to your email!<br />
                        Please check your inbox.<br />
                        Redirecting you to home page...
                      </Callout.Text>
                    </Callout.Root>
                  </Box>
                )}

                {isLoading && (
                  <Box width="380px">
                    <Callout.Root color={emailError ? "red" : "blue"}>
                      <Callout.Icon>
                        <Spinner />
                      </Callout.Icon>
                      <Callout.Text>
                        Sending email...
                      </Callout.Text>
                    </Callout.Root>
                  </Box>
                )}


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

                <Form.Submit asChild onClick={handleSendEmail}>
                  <Button asChild variant="solid" disabled={(isLoading || emailSent)} className={(isLoading || emailSent) && "no-click"}>
                    <Box width="380px" height="60px" my="10px">
                      <Text size="5" weight="bold">
                        Send Reset Email
                      </Text>
                    </Box>
                  </Button>
                </Form.Submit>
              </Flex>
            </Form.Root>
          </Flex>
        </Card>
      </Box>

      <Box height="40px" />

      <Button variant="outline" onClick={() => navigate("/")}>Go Back</Button>

    </Flex>
  );
}

export default ForgotPassword;
