import { Card, Container, Spinner } from "@chakra-ui/react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";
import WinnerCard from "./WinnerCard";

export default function Winner() {
    const {
        contract
    } = useContract(LOTTERY_CONTRACT_ADDRESS);

    const {
        data: entries,
        isLoading: entriesLoading
    } = useContractRead(contract, "getPlayers");

    const {
        data: winner,
        isLoading: winnerLoading,
      } = useContractRead(contract, "getWinner");

    return (
        <Container py={8}>

            {!winnerLoading ? (
                winner.map((entry: any, index: number) => (
                    <WinnerCard
                        key={index}
                        walletAddress={entry}
                    />
                ))
            ) : (
                <Spinner />
            )}
        </Container>
    )
}