import { useNavigate, useLocation } from 'react-router-dom';

function useGoBack(fallbackPath = '/') {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate(fallbackPath, { replace: true });
    }
  };

  return handleGoBack;
}

export default useGoBack;