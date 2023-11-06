import React, { useEffect, useState } from 'react';
import {
  Button, TextField, Box, styled, Card, Typography,
} from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import { WebSocketServer } from 'ws';
import { w3cwebsocket as W3CWebSocket } from "websocket";

// const CardWrapperPrimary = styled(Card)(
//   ({ theme }) => `
//       background: ${theme.colors.primary.main};
//       color: ${theme.palette.primary.contrastText};
//       padding: ${theme.spacing(2)};
//       border-radius: ${theme.general.borderRadiusXl};
//       border-top-right-radius: ${theme.general.borderRadius};
//       max-width: 380px;
//       display: inline-flex;
// `
// );


const ws = new W3CWebSocket('ws://192.168.29.61:443');

const App = () => {
  const [chat, SetChat] = useState();
  const [message, setMessage] = useState([]);


  useEffect(() => {
    ws.onopen = () => {
      console.log('WebSocket Connected');
    };
  }, []);

  const OnButtonClicked = () => {
    // console.log('value: ', value);
    ws.send(JSON.stringify({
      type: 'message', msg: chat,
      // date: Date.now()
    }))
    // if (ws) {
    //   showMessage(`ME: ${chat}`);
    // } else {
    //   alert("ERROR: Not connected... refresh to try again!");
    // }
  }
  ws.onmessage = (message) => {
    const dataFromServer = JSON.parse(message.data)
    if (dataFromServer.type === 'message') {
      setMessage((prevState) => [
        ...prevState, {
          msg: dataFromServer.msg
        },
      ])
    }
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-end"
        py={3}
        sx={{ height: '100%' }}
      >
        <Box
          display="flex"
          alignItems="flex-end"
          flexDirection="column"
          justifyContent="flex-end"
          mr={2}
          width={70}

        >
          {message?.map((message) =>
            <Typography
              variant="subtitle1"
              className='chat'
              sx={{
                pt: 1,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              {message.msg}
            </Typography>)}

        </Box>
      </Box>
      <div className='inputField'>
        <TextField
          placeholder='Write your message here...'
          size='medium'
          name='message'
          type='text'
          onChange={(e) => SetChat(e.target.value)}
        // onClick={(e, value) => OnButtonClicked(value)}
        >
        </TextField>
        <Button variant='contained' size='large' type='submit'
          onClick={OnButtonClicked}
          sx={{ border: 'none', borderRadius: '0px' }}
        >send
        </Button>
      </div>

    </>
  )
}
export default App;