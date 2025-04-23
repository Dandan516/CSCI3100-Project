import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { Flex, TextField, Box, Button, Text, Card } from '@radix-ui/themes';
import { Form } from 'radix-ui';

import { useAuth } from '../hooks/AuthProvider';

function Start() {

  const auth = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [profile, setProfile] = useState({
    username: auth.user?.username || "",
    first_name: auth.user?.first_name || "",
    last_name: auth.user?.last_name || "",
    birthday: auth.user?.birthday || undefined,
  });

  const updateProfile = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  }

  const handleEditProfile = async () => {

    axios
      .patch(`${import.meta.env.VITE_API_URL}userinfo/${auth.user?.id}/`, {
        ...profile,
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        birthday: profile.birthday,
      }, {
        headers: {
          Authorization: `Token ${auth.token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Error updating user info', error);
      });
  }

  const handleNextStep = () => {
    switch (step) {
      case 1:
        setStep(2);
        break;
      case 2:
        handleEditProfile();
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const isNewUser = !auth.user.username;
    if (!isNewUser) {
      auth.getUserInfo();
      navigate('/dashboard');
    }
  }, [auth.user.username, navigate]);

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Box asChild width="480px">
        <Card size="3">
          <Flex direction="column" align="center" justify="center" gap="20px">


            <Box asChild my="20px">
              <Text size="5" weight="medium">
                <>
                  {step === 1 && (
                    "Welcome to Planner! Please set a username."
                  )}
                  {step === 2 && (
                    "Tell us about yourself."
                  )}
                </>
              </Text>
            </Box>

            <Form.Root>
              <Flex align="start" direction="column" gap="20px">

                {step === 1 && (
                  <Form.Field className="FormField" name="username">
                    <Form.Label asChild className="FormLabel">
                      <Box asChild mb="6px">
                        <Text size="2" weight="medium">
                          Username
                        </Text>
                      </Box>
                    </Form.Label>

                    <Form.Control
                      asChild
                      className="Input"
                      type="text"
                      placeholder="Set a username..."
                      value={profile.username}
                      onChange={updateProfile}
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

                {step === 2 && (
                  <>
                    <Form.Field className="FormField" name="first_name">
                      <Form.Label asChild className="FormLabel">
                        <Box asChild mb="6px">
                          <Text size="2" weight="medium">
                            First name
                          </Text>
                        </Box>
                      </Form.Label>

                      <Form.Control
                        asChild
                        className="Input"
                        type="text"
                        placeholder="Enter your first name..."
                        value={profile.first_name}
                        onChange={updateProfile}
                        required>
                        <Box asChild width="380px" height="50px" mt="10px">
                          <TextField.Root>
                            <TextField.Slot pl="10px" />
                            <TextField.Slot pr="10px" />
                          </TextField.Root>
                        </Box>
                      </Form.Control>
                    </Form.Field>

                    <Form.Field className="FormField" name="last_name">
                      <Form.Label asChild className="FormLabel">
                        <Box asChild mb="6px">
                          <Text size="2" weight="medium">
                            Last name
                          </Text>
                        </Box>
                      </Form.Label>

                      <Form.Control
                        asChild
                        className="Input"
                        type="text"
                        placeholder="Enter your last name..."
                        value={profile.last_name}
                        onChange={updateProfile}
                        required>
                        <Box asChild width="380px" height="50px" mt="10px">
                          <TextField.Root>
                            <TextField.Slot pl="10px" />
                            <TextField.Slot pr="10px" />
                          </TextField.Root>
                        </Box>
                      </Form.Control>
                    </Form.Field>

                    <Form.Field name="date">
                      <Form.Label asChild>
                        <Box asChild mb="6px" >
                          <Text size="2" weight="medium">Birhtday</Text>
                        </Box>
                      </Form.Label>
                      <Form.Control
                        asChild
                        type="date"
                        value={profile.birthday}
                        onChange={updateProfile}>
                        <Box asChild height="50px">
                          <TextField.Root>
                            <TextField.Slot />
                            <TextField.Slot />
                          </TextField.Root>
                        </Box>
                      </Form.Control>
                    </Form.Field>
                  </>
                )}

                <Button asChild variant="solid" onClick={handleNextStep}>
                  <Box width="380px" height="50px" my="10px">
                    <Text size="4" weight="medium">
                      {step === 1 && "Next"}
                      {step === 2 && "Save"}
                    </Text>
                  </Box>
                </Button>
              </Flex>
            </Form.Root>

          </Flex>
        </Card>
      </Box>
    </Flex>
  );
}

export default Start