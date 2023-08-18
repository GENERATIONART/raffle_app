import { Box, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { Web3Button, useContract, useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";
import { useState } from "react";

export default function AdminTicketPriceCard() {
    const {
        contract
    } = useContract(LOTTERY_CONTRACT_ADDRESS);

    const {
        data: ticketCost,
        isLoading: ticketCostLoading
    } = useContractRead(contract, "ticketCost");

    const {
        data: lotteryStatus
    } = useContractRead(contract, "lotteryStatus");

    const [ticketPrice, setTicketPrice] = useState(0);
    
    const [payToken, setPayToken] = useState("0xb117Bd9B5d199C90aa63B1b8Be80FD9D40A6B9c0")

    function resetTicketPrice() {
        setTicketPrice(0);
        setPayToken("0xb117Bd9B5d199C90aa63B1b8Be80FD9D40A6B9c0");
    };

    return (
        <Stack spacing={4}>
            <Box>
            <Text fontWeight={"bold"} mb={4} fontSize={"xl"}>CCY Contract Address</Text>
              <Input
                type="string"
                value={payToken}
                onChange={(e) => setPayToken(e.target.value)}
            />  
                
                <Text fontWeight={"bold"} mb={4} fontSize={"xl"}>Ticket Price</Text>
                {!ticketCostLoading ? (
                    <Text fontSize={"xl"}>{ethers.utils.formatEther(ticketCost)} DOS</Text>
                ) : (
                    <Spinner />
                )}
            </Box>
            <Input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(parseFloat(e.target.value))}
            />
              
            <Web3Button
                contractAddress={LOTTERY_CONTRACT_ADDRESS}
                action={(contract) => contract.call(
                    "addCurrency",
                    [
                        payToken,
                        ethers.utils.parseEther(ticketPrice.toString())
                    ]
                )}
                onSuccess={resetTicketPrice}
                isDisabled={lotteryStatus}
            >Update Ticket Cost</Web3Button>
                    <Web3Button
                contractAddress={LOTTERY_CONTRACT_ADDRESS}
                action={
                    (contract) => contract.call(
                    "resetContract",
                    [ ]
                )}
                onSuccess={resetTicketPrice}
                isDisabled={lotteryStatus}
            >RESET CONTRACT</Web3Button>
        </Stack>
    )
}