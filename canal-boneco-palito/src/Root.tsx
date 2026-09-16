import "./index.css";
import { MyComposition } from "./Composition";
import { StoryVideo } from "./story/StoryComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <StoryVideo />
    </>
  );
};
