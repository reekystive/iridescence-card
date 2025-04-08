import { type FC } from 'react';
import { IridescenceCardScene } from './components/iridescence-card/scene';

export const App: FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <IridescenceCardScene />
    </div>
  );
};
