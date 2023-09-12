import {
  Navbar,
  NavbarContent,
  Tab,
  Tabs,
} from "@nextui-org/react";
import CustomWalletConnectButton from "./CustomWalletConnectButton";
import { Dispatch, SetStateAction } from "react";
import { Modes } from "@/pages";


type Props = {
  setMode: Dispatch<SetStateAction<Modes>>;
};

const Header = ({ setMode }: Props) => {
  return (
    <Navbar isBlurred={true} className="bg-black/20">
      <NavbarContent  justify="start">
          <h1 className="font-bold text-xl">TokenPlex</h1>
        <Tabs
          color="primary"
          radius="full"
          onSelectionChange={(key) => setMode(key as Modes)}
        >
          <Tab key="swap" title="Swap" />
          <Tab key="supply" title="Supply" />
          <Tab key="airdrop" title="Airdrop test tokens" />
        </Tabs>
      </NavbarContent>
      <NavbarContent justify="end">
        <CustomWalletConnectButton />
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
