import { Card, Flex, Text } from "@chakra-ui/react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";

type Props = {
    walletAddress: string;
};

const WinnerCard: React.FC<Props> = ({ walletAddress }) => {
    const {
        contract
    } = useContract(LOTTERY_CONTRACT_ADDRESS);

    const {
        data: numberOfEntries,
        isLoading: numberOfEntriesLoading
    } = useContractRead(contract, "entryCounts", [walletAddress]);


    const {
        data: winner,
        isLoading: winnerLoading,
      } = useContractRead(contract, "getWinner");

    

    function truncateAddress(address: string) {
        return address.slice(0, 9) + "..." + address.slice(-7);
    };

    return (
        <Card p={6} mb={4}>
            {!winnerLoading && (
                <Flex flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Text border={"1px solid"} borderRadius={"6px"} p={2} mr={2}>{truncateAddress(walletAddress)}</Text>
                    <Text fontSize={"30px"}>🎉</Text>
                </Flex>
            )}
        </Card>
    )
};

export default WinnerCard;