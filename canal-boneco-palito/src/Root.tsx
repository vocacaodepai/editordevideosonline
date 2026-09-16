import "./index.css";
import { MyComposition } from "./Composition";
import { StoryVideo } from "./story/StoryComposition";
import { InfographicVideo } from "./infographic/InfographicComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <StoryVideo />
      <InfographicVideo />
    </>
  );
};
