import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { Flex, TextField, Box, Button, Text } from '@radix-ui/themes';
import { Form } from 'radix-ui';

import { useAuth } from '../hooks/AuthProvider';

function Start() {

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user.username != "") {
      navigate('/home');
    }
  }, [auth.user.username, navigate]);

  const [profile, setProfile] = useState({
    username: "",
    first_name: "",
    last_name: "",
    birthday: undefined,
  });

  const updateProfile = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  }

  const handleEditProfile = (e) => {
      e.preventDefault();
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
        .then((response) => {
          navigate('/home');
        })
        .catch((error) => {
          console.error('Error updating user info', error);
        });
    }

  return (
    <Flex width="100vw" height="100vh" direction="column" align="center" justify="center">
      <Form.Root>
        <Form.Field className="FormField" name="username">
          <Form.Label asChild className="FormLabel">
            <Box asChild mb="6px">
              <Text size="2" weight="medium">
                Set username
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

        <Form.Submit asChild onClick={handleEditProfile}>
          <Button asChild variant="solid">
            <Box width="380px" height="60px" my="10px">
              <Text size="5" weight="bold">
                Continue
              </Text>
            </Box>
          </Button>
        </Form.Submit>

      </Form.Root>
    </Flex>
  );
}

export default Start;