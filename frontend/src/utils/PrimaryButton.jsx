import { Button } from '@mui/material';

const PrimaryButton = ({
  text,
  width = '187px',
  height = '66px',
  fontSize = '20px',
  fontWeight = '600',
  onClick,
  backgroundColor = '#284b63',
  icon = null,
  sx = {}, 
}) => {
  const isGray = backgroundColor.toLowerCase() === '#afafaf';

  return (
    <Button
      variant="contained"
      startIcon={icon}
      onClick={onClick}
      sx={{
        backgroundColor: backgroundColor,
        borderRadius: '10px',
        textTransform: 'none',
        width: width,
        height: height,
        fontSize: fontSize,
        fontWeight: fontWeight,
        '&:hover': {
          backgroundColor: isGray ? '#8f8f8f' : '#1f3c4e',
        },
        ...sx, // Override any styles with external `sx` passed in
      }}
    >
      {text}
    </Button>
  );
};

export default PrimaryButton;
