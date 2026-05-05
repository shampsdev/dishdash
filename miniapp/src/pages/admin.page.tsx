import { backButton, cloudStorage } from '@telegram-apps/sdk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    backButton.show();
    backButton.onClick(goBack);

    return () => {
      backButton.hide();
      backButton.offClick(goBack);
    };
  }, []);

  const resetStorage = () => {
    cloudStorage.setItem('seen', '');
    cloudStorage.setItem('auth', '');
  };

  return (
    <>
      <div className="p-8 space-y-5">
        <div
          onClick={resetStorage}
          className="p-3 active:opacity-90 bg-secondary rounded-xl text-center"
        >
          Reset Cloud Storage
        </div>
      </div>
    </>
  );
};
