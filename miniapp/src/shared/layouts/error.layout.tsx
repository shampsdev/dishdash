import sadFace from '@/assets/icons/sad-face.png';
import { Button } from '@/components/ui/button';
import { useErrorStore } from '@/shared/stores/error.store';
import { Outlet, useNavigate } from 'react-router-dom';

export const ErrorLayout = () => {
  const navigate = useNavigate();
  const { setError, error } = useErrorStore();

  const onMainButtonClick = () => {
    setError(null);
    navigate('/');
  };

  return error !== null ? (
    <div className="flex space-y-3 h-[95vh] items-center justify-center flex-col">
      <div className="w-[30%] mx-auto pb-2">
        <img src={sadFace} />
      </div>
      <p className="text-2xl font-medium">Что-то пошло не так</p>
      <p className="w-[90%] text-center">
        Попробуйте перезайти или возвращайтесь позже
      </p>
      <div className="pointer-events-none absolute z-20 bottom-0 right-0 left-0 flex flex-col h-56 gap-6 justify-center items-center">
        <Button
          onClick={onMainButtonClick}
          className="z-20 pointer-events-auto"
        >
          На главную
        </Button>
      </div>
    </div>
  ) : (
    <Outlet />
  );
};
