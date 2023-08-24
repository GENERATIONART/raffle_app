import { Box, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { Web3Button, useContract, useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { LOTTERY_CONTRACT_ADDRESS, CUSTOM_TOKEN_ADDRESS } from "../const/addresses";
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
        data: ticketCost2,
        isLoading: ticketCost2Loading
      } = useContractRead(contract, "getTokenCostInfo", [0] );
  

    const {
        data: currency,
        isLoading: currencyLoading
      } = useContractRead(contract, "AllowedCrypto", [0] );

      const ticketCostInDOS = ticketCost2 ? ethers.utils.formatEther(ticketCost) : "0";
    

    const {
        data: lotteryStatus
    } = useContractRead(contract, "lotteryStatus");

    const [ticketPrice, setTicketPrice] = useState(0);
    
    const [payToken, setPayToken] = useState(CUSTOM_TOKEN_ADDRESS)

    function resetTicketPrice() {
        setTicketPrice(0);
        setPayToken(CUSTOM_TOKEN_ADDRESS);
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
                {!ticketCost2Loading && ticketCost2 ? (
                    <Text fontSize={"xl"}>{ethers.utils.formatEther(ticketCost2).toString()} DOS</Text>
                        
                ) : (
                    <Text color={"red"} fontWeight={"bold"} fontSize={"xl"}>PLEASE SET TICKET COST</Text>
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