import "./index.css";
import { MyComposition } from "./Composition";
import { StoryVideo } from "./story/StoryComposition";
import { InfographicVideo } from "./infographic/InfographicComposition";
import { WirecardVideo } from "./wirecard/WirecardEpisode";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <StoryVideo />
      <InfographicVideo />
      <WirecardVideo />
    </>
  );
};
