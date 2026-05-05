import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AdminTriggerProps = {
  children?: ReactNode;
};

export const AdminTrigger = ({ children }: AdminTriggerProps) => {
  const [, setClicks] = useState(0);
  const navigate = useNavigate();

  const handleClick = () => {
    setClicks((prev) => {
      const newCount = prev + 1;
      if (newCount >= 10) {
        navigate('/admin');
      }
      return newCount;
    });
  };

  return <div onClick={handleClick}>{children}</div>;
};
