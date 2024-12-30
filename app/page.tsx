
import LandingLayout from "./components/layouts/landingLayout";
import Hero from "./components/common/Hero";
import CounterGroup from "./components/common/CounterGroup";
import Carousel from "./components/common/Carousel";
import BiggestChallenges from "./components/common/BiggestChallenges";
import Cryptic from "./components/common/Cryptic";
import Faq from "./components/common/Faq";
import ConnectForm from "./components/common/ConnectForm";
import Sponsor from "./components/common/Sponsor";

export default function Home() {
  return (
  <LandingLayout>
    <Hero/>
    <CounterGroup/>
    <Carousel/>
    <BiggestChallenges/>
    <Cryptic/>
    <Faq/>
    <p className='font-serif pl-32 text-4xl   font-bold'>Meet our Partners</p>
    <Sponsor/>
    <ConnectForm/>
  </LandingLayout>
  );
}
