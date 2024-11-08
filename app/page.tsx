import Image from "next/image";
import LandingLayout from "./components/layouts/landingLayout";
import Hero from "./components/common/Hero";
import CounterGroup from "./components/common/CounterGroup";
import Carousel from "./components/common/Carousel";
import BiggestChallenges from "./components/common/BiggestChallenges";
import Cryptic from "./components/common/Cryptic";
import Faq from "./components/common/Faq";
import ConnectForm from "./components/common/ConnectForm";

export default function Home() {
  return (
  <LandingLayout>
    <Hero/>
    <CounterGroup/>
    <Carousel/>
    <BiggestChallenges/>
    <Cryptic/>
    <Faq/>
    <ConnectForm/>
  </LandingLayout>
  );
}
