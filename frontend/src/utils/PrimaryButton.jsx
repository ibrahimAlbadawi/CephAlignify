import { Button } from '@mui/material';

const PrimaryButton = ({ text, width = '187px', height = '66px', fontSize = '20px',fontWeight ='bold', onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: '#284B63',
        borderRadius: '10px',
        textTransform: 'none',
        width: width,
        height: height,
        fontSize: fontSize,
        fontWeight: fontWeight,
        '&:hover': {
          backgroundColor: '#1f3c4e', // slightly darker on hover
        },
      }}
    >
      {text}
    </Button>
  );
};

export default PrimaryButton;