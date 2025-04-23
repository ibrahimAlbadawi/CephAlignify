import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Divider } from '@mui/material';

import { getAvatarIcon } from '../../utils/getAvatarIcon';

const PatientMedicalProfileCard = ({  name, age, gender, lastVisit }) => {

  const avatarIcon = getAvatarIcon(age, gender);


  return (
    <Card
      sx={{
        width: 180,
        height: 200,
        backgroundColor: '#CDDAE3',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 2,
        boxShadow: 3,
      }}
    >
      <Avatar
        src={avatarIcon}
        alt={name}
        sx={{
          width: 50,
          height: 50,
          backgroundColor: '#fff',
          color: '#000',
          marginTop: 1,
        }}
      />

      <CardContent sx={{ padding: 0, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {name}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', fontSize: 12 }}>
          {age} • {gender}
        </Typography>
      </CardContent>

      <Divider sx={{ width: '100%', my: 1 }} />

      <Typography variant="caption" sx={{ fontSize: 11, textAlign: 'center' }}>
        Last visit: {lastVisit}
      </Typography>
    </Card>
  );
};

export default PatientMedicalProfileCard;
